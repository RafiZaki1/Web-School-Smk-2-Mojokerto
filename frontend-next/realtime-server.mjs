import { createServer } from 'node:http';
import { createHmac } from 'node:crypto';
import { Server } from 'socket.io';

const PORT = Number(process.env.PETA3D_SOCKET_PORT || 3001);
const SECRET = process.env.PETA3D_SESSION_SECRET || (process.env.NODE_ENV === 'production' ? null : 'peta3d-dev-only');
if (!SECRET) {
  console.error('PETA3D_SESSION_SECRET belum diisi. Server realtime tidak dijalankan.');
  process.exit(1);
}
const IS_PROD = process.env.NODE_ENV === 'production';
const ROOM_NAME = 'peta-3d:smkn2';
const MAX_PLAYERS_PER_ROOM = 100;
const MAX_SPEED_UNITS_PER_SEC = 34; // 24 (Shift) + toleransi latensi
const MAX_PACKETS_PER_SEC = 15;
const HEARTBEAT_TIMEOUT_MS = 20_000;
const POSITION_CACHE_TTL_MS = 10 * 60_000;

const ALLOWED_ORIGINS = (process.env.PETA3D_ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const BAD_WORDS = ['anjing', 'bangsat', 'kontol', 'memek', 'asu', 'jancok', 'tolol', 'babi'];

function filterText(input, maxLen = 32) {
  if (typeof input !== 'string') return '';
  let clean = input.replace(/[<>]/g, '').trim().slice(0, maxLen);
  for (const word of BAD_WORDS) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(re, '***');
  }
  return clean;
}

const BOUNDS = {
  minX: -100,
  maxX: 100,
  minZ: -55,
  maxZ: 55,
  minY: -1,
  maxY: 15,
};

function verifyToken(token) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = createHmac('sha256', SECRET).update(data).digest('hex');
  if (sig !== expected) return null;
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
    if (!parsed?.playerId || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

function isInsideBounds(pos) {
  if (!Array.isArray(pos) || pos.length !== 3) return false;
  const [x, y, z] = pos;
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return false;
  return (
    x >= BOUNDS.minX &&
    x <= BOUNDS.maxX &&
    y >= BOUNDS.minY &&
    y <= BOUNDS.maxY &&
    z >= BOUNDS.minZ &&
    z <= BOUNDS.maxZ
  );
}

function sanitizeColor(val, fallback) {
  return typeof val === 'string' && /^#[0-9a-fA-F]{6}$/.test(val) ? val : fallback;
}

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (!IS_PROD && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
    return true;
  }
  if (ALLOWED_ORIGINS.length > 0) {
    return ALLOWED_ORIGINS.includes(origin);
  }
  return !IS_PROD;
}

const VALID_ANIMS = new Set(['idle', 'walk', 'run', 'jump', 'wave']);

const players = new Map(); // socket.id -> active player record
const lastPositions = new Map(); // playerId -> { pos, yaw, savedAt }

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        ok: true,
        room: ROOM_NAME,
        players: players.size,
        maxPlayers: MAX_PLAYERS_PER_ROOM,
      }),
    );
    return;
  }
  res.writeHead(404);
  res.end();
});

const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origin tidak diizinkan'));
      }
    },
    credentials: true,
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  const session = verifyToken(token);
  if (!session) {
    return next(new Error('Token sesi tidak valid'));
  }
  socket.data.session = session;
  return next();
});

function toPublicPlayer(p) {
  return {
    id: p.id,
    name: p.name,
    pos: p.pos,
    yaw: p.yaw,
    anim: p.anim,
    shirtColor: p.shirtColor,
    hairColor: p.hairColor,
    waveText: p.waveText,
    waveUntil: p.waveUntil,
    lastSeen: p.lastSeen,
  };
}

io.on('connection', (socket) => {
  const session = socket.data.session;
  socket.join(ROOM_NAME);

  // Jika room sudah mencapai 100 pemain aktif, pemain ke-101 masuk sebagai observer
  if (players.size >= MAX_PLAYERS_PER_ROOM) {
    const snapshot = Array.from(players.values()).map(toPublicPlayer);
    socket.emit('room:observer', {
      message: 'Dunia penuh, coba lagi nanti',
      snapshot,
    });
    return;
  }

  const now = Date.now();
  const cached = lastPositions.get(session.playerId);
  const restoredPos =
    cached && now - cached.savedAt <= POSITION_CACHE_TTL_MS ? cached.pos : [0, 0, -50.5];
  const restoredYaw =
    cached && now - cached.savedAt <= POSITION_CACHE_TTL_MS ? cached.yaw : 0;

  const initial = {
    id: session.playerId,
    name: filterText(String(session.name), 32) || 'Tamu',
    pos: restoredPos,
    yaw: restoredYaw,
    anim: 'idle',
    shirtColor: '#0284c7',
    hairColor: '#0f172a',
    waveText: null,
    waveUntil: 0,
    lastSeen: now,
    lastHeartbeatAt: now,
    rateWindowStart: now,
    packetCount: 0,
    lastTeleportAt: 0,
  };
  players.set(socket.id, initial);

  // Kirim daftar pemain aktif ke klien yang baru bergabung + posisi terakhir jika ada
  const snapshot = [];
  for (const [sid, p] of players.entries()) {
    if (sid !== socket.id) snapshot.push(toPublicPlayer(p));
  }
  socket.emit('room:snapshot', snapshot);
  if (cached && now - cached.savedAt <= POSITION_CACHE_TTL_MS) {
    socket.emit('player:restore', { pos: restoredPos, yaw: restoredYaw });
  }
  socket.to(ROOM_NAME).emit('player:joined', toPublicPlayer(initial));

  const checkRateLimit = (record) => {
    const t = Date.now();
    if (t - record.rateWindowStart >= 1000) {
      record.rateWindowStart = t;
      record.packetCount = 0;
    }
    record.packetCount += 1;
    return record.packetCount <= MAX_PACKETS_PER_SEC;
  };

  socket.on('player:heartbeat', () => {
    const record = players.get(socket.id);
    if (!record) return;
    record.lastHeartbeatAt = Date.now();
  });

  socket.on('player:update', (payload) => {
    const record = players.get(socket.id);
    if (!record || !checkRateLimit(record)) return;
    if (!payload || !isInsideBounds(payload.pos)) return;

    const t = Date.now();
    const dtSec = Math.max(0.05, (t - record.lastSeen) / 1000);
    const dist = Math.hypot(payload.pos[0] - record.pos[0], payload.pos[2] - record.pos[2]);

    if (t - record.lastTeleportAt > 1000 && dist / dtSec > MAX_SPEED_UNITS_PER_SEC) {
      return;
    }

    record.pos = [
      Number(payload.pos[0].toFixed(2)),
      Number(payload.pos[1].toFixed(2)),
      Number(payload.pos[2].toFixed(2)),
    ];
    record.yaw = Number.isFinite(payload.yaw) ? Number(payload.yaw.toFixed(3)) : record.yaw;
    record.anim = VALID_ANIMS.has(payload.anim) ? payload.anim : 'idle';
    record.shirtColor = sanitizeColor(payload.shirtColor, record.shirtColor);
    record.hairColor = sanitizeColor(payload.hairColor, record.hairColor);
    const filteredWave = filterText(payload.waveText, 40);
    record.waveText = filteredWave || null;
    record.waveUntil =
      typeof payload.waveUntil === 'number' && payload.waveUntil > t ? payload.waveUntil : 0;
    record.lastSeen = t;
    record.lastHeartbeatAt = t;

    lastPositions.set(record.id, { pos: record.pos, yaw: record.yaw, savedAt: t });
    socket.to(ROOM_NAME).emit('player:state', toPublicPlayer(record));
  });

  socket.on('player:teleport', (payload) => {
    const record = players.get(socket.id);
    if (!record || !checkRateLimit(record)) return;
    if (!payload || !isInsideBounds(payload.pos)) return;

    const t = Date.now();
    record.pos = [
      Number(payload.pos[0].toFixed(2)),
      Number(payload.pos[1].toFixed(2)),
      Number(payload.pos[2].toFixed(2)),
    ];
    record.lastTeleportAt = t;
    record.lastSeen = t;
    record.lastHeartbeatAt = t;

    lastPositions.set(record.id, { pos: record.pos, yaw: record.yaw, savedAt: t });
    socket.to(ROOM_NAME).emit('player:state', toPublicPlayer(record));
  });

  socket.on('disconnect', () => {
    const leaving = players.get(socket.id);
    players.delete(socket.id);
    if (leaving) {
      lastPositions.set(leaving.id, {
        pos: leaving.pos,
        yaw: leaving.yaw,
        savedAt: Date.now(),
      });
      socket.to(ROOM_NAME).emit('player:left', { id: leaving.id });
    }
  });
});

// Sapu pemain yang tidak mengirim heartbeat > 20 detik & bersihkan cache posisi > 10 menit
setInterval(() => {
  const now = Date.now();
  for (const [sid, record] of players.entries()) {
    if (now - record.lastHeartbeatAt > HEARTBEAT_TIMEOUT_MS) {
      players.delete(sid);
      lastPositions.set(record.id, { pos: record.pos, yaw: record.yaw, savedAt: now });
      io.to(ROOM_NAME).emit('player:left', { id: record.id });
      const sock = io.sockets.sockets.get(sid);
      sock?.disconnect(true);
    }
  }
  for (const [pid, cached] of lastPositions.entries()) {
    if (now - cached.savedAt > POSITION_CACHE_TTL_MS) {
      lastPositions.delete(pid);
    }
  }
}, 5000);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[peta-3d-realtime] Socket.IO listening on http://0.0.0.0:${PORT} (${ROOM_NAME})`);
});
