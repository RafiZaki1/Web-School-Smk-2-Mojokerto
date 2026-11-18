'use client';

import { useEffect } from 'react';
import { io, type Socket } from 'socket.io-client';
import { type RemotePlayerState, useCampusStore } from '../store/useCampusStore';

const GUEST_TOKEN_KEY = 'peta3d_guest_session_token';
const LAST_POS_KEY = 'peta3d_last_pos';

interface SessionResponse {
  playerId: string;
  name: string;
  token: string;
  isAuthenticated: boolean;
}

function getRealtimeUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_PETA3D_REALTIME_URL?.trim();
  if (configured) {
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      return configured.replace(/^http:\/\//i, 'https://').replace(/^ws:\/\//i, 'wss://');
    }
    return configured;
  }

  // Di production, jika NEXT_PUBLIC_PETA3D_REALTIME_URL kosong, tampilkan "Online: tidak tersedia"
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  return 'http://localhost:3001';
}

async function fetchServerSession(): Promise<SessionResponse | null> {
  try {
    const guestToken =
      typeof window !== 'undefined'
        ? window.sessionStorage.getItem(GUEST_TOKEN_KEY) ?? undefined
        : undefined;

    const res = await fetch('/api/peta-3d/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestToken }),
      credentials: 'include',
    });
    if (!res.ok) return null;

    const data = (await res.json()) as SessionResponse;
    if (!data.isAuthenticated && typeof window !== 'undefined' && data.token) {
      window.sessionStorage.setItem(GUEST_TOKEN_KEY, data.token);
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * Layer dunia bersama realtime menggunakan Socket.IO.
 * - Masuk otomatis ke room peta-3d:smkn2 saat halaman dibuka.
 * - Heartbeat setiap 5 detik; server menghapus pemain jika diam > 20 detik.
 * - Menyimpan posisi terakhir di sessionStorage & memulihkan dari server (TTL 10 menit).
 * - Backoff reconnect 1s, 2s, 4s, 8s (maks 15s).
 */
export function useMultiplayerSync() {
  const setPlayerIdentity = useCampusStore((s) => s.setPlayerIdentity);
  const setRemotePlayers = useCampusStore((s) => s.setRemotePlayers);
  const setConnectionStatus = useCampusStore((s) => s.setConnectionStatus);
  const setObserver = useCampusStore((s) => s.setObserver);
  const setAvatarTransform = useCampusStore((s) => s.setAvatarTransform);
  const teleportNonce = useCampusStore((s) => s.teleportNonce);

  useEffect(() => {
    let active = true;
    let socket: Socket | null = null;
    let sendTimer: number | null = null;
    let heartbeatTimer: number | null = null;
    let lastPayloadKey = '';
    const peers = new Map<string, RemotePlayerState>();

    // Pulihkan posisi terakhir di sesi yang sama dari sessionStorage
    try {
      const savedRaw = window.sessionStorage.getItem(LAST_POS_KEY);
      if (savedRaw) {
        const saved = JSON.parse(savedRaw) as {
          pos?: [number, number, number];
          yaw?: number;
        };
        if (Array.isArray(saved.pos) && saved.pos.length === 3) {
          setAvatarTransform(saved.pos, typeof saved.yaw === 'number' ? saved.yaw : 0);
        }
      }
    } catch {
      // Abaikan jika sessionStorage tidak valid
    }

    const syncStorePeers = () => {
      setRemotePlayers(Array.from(peers.values()));
    };

    const start = async () => {
      const realtimeUrl = getRealtimeUrl();
      if (!realtimeUrl) {
        setConnectionStatus('unavailable');
        return;
      }

      setConnectionStatus('connecting');
      const session = await fetchServerSession();
      if (!active || !session) {
        if (active) setConnectionStatus('offline');
        return;
      }

      setPlayerIdentity(session.playerId, session.name);

      socket = io(realtimeUrl, {
        auth: { token: session.token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 15000,
        randomizationFactor: 0.1,
      });

      const buildUpdate = () => {
        const s = useCampusStore.getState();
        const isWaving = s.waveUntil > Date.now();
        return {
          pos: s.avatarPos,
          yaw: s.avatarYaw,
          anim: isWaving ? 'wave' : s.avatarAnim,
          shirtColor: s.shirtColor,
          hairColor: s.hairColor,
          waveText: isWaving ? s.waveText : null,
          waveUntil: isWaving ? s.waveUntil : 0,
        };
      };

      socket.on('connect', () => {
        if (!active) return;
        setObserver(false);
        setConnectionStatus('connected');
        lastPayloadKey = '';
        socket?.emit('player:update', buildUpdate());
      });

      socket.on('disconnect', () => {
        if (!active) return;
        setConnectionStatus('reconnecting');
      });

      socket.io.on('reconnect_attempt', () => {
        if (!active) return;
        setConnectionStatus('reconnecting');
      });

      socket.on('connect_error', () => {
        if (!active) return;
        setConnectionStatus('offline');
      });

      socket.on(
        'room:observer',
        ({ snapshot }: { message: string; snapshot: RemotePlayerState[] }) => {
          if (!active) return;
          setObserver(true);
          setConnectionStatus('full');
          peers.clear();
          for (const p of snapshot) {
            peers.set(p.id, p);
          }
          syncStorePeers();
        },
      );

      socket.on(
        'player:restore',
        ({ pos, yaw }: { pos: [number, number, number]; yaw: number }) => {
          if (!active) return;
          // Hanya pulihkan dari server jika posisi lokal masih di titik awal gerbang
          const cur = useCampusStore.getState().avatarPos;
          if (Math.hypot(cur[0], cur[2] + 50.5) < 0.5) {
            setAvatarTransform(pos, yaw);
          }
        },
      );

      socket.on('room:snapshot', (list: RemotePlayerState[]) => {
        if (!active) return;
        peers.clear();
        for (const p of list) {
          if (p.id !== session.playerId) {
            peers.set(p.id, p);
          }
        }
        syncStorePeers();
      });

      socket.on('player:joined', (p: RemotePlayerState) => {
        if (!active || p.id === session.playerId) return;
        peers.set(p.id, p);
        syncStorePeers();
      });

      socket.on('player:state', (p: RemotePlayerState) => {
        if (!active || p.id === session.playerId) return;
        peers.set(p.id, p);
        syncStorePeers();
      });

      socket.on('player:left', ({ id }: { id: string }) => {
        if (!active) return;
        if (peers.delete(id)) {
          syncStorePeers();
        }
      });

      // Kirim perubahan posisi (~10 Hz) + simpan posisi terakhir ke sessionStorage
      sendTimer = window.setInterval(() => {
        const s = useCampusStore.getState();
        try {
          window.sessionStorage.setItem(
            LAST_POS_KEY,
            JSON.stringify({ pos: s.avatarPos, yaw: s.avatarYaw }),
          );
        } catch {
          // Abaikan kuota storage
        }

        if (!socket?.connected || s.isObserver) return;
        const payload = buildUpdate();
        const key = JSON.stringify([
          Math.round(payload.pos[0] * 100),
          Math.round(payload.pos[1] * 100),
          Math.round(payload.pos[2] * 100),
          Math.round(payload.yaw * 100),
          payload.anim,
          payload.shirtColor,
          payload.hairColor,
          payload.waveText,
        ]);
        if (key !== lastPayloadKey) {
          lastPayloadKey = key;
          socket.emit('player:update', payload);
        }
      }, 100);

      // Heartbeat setiap 5 detik
      heartbeatTimer = window.setInterval(() => {
        if (socket?.connected && !useCampusStore.getState().isObserver) {
          socket.emit('player:heartbeat');
        }
      }, 5000);

      (window as unknown as { __peta3dSocket?: Socket }).__peta3dSocket = socket;
    };

    void start();

    return () => {
      active = false;
      if (sendTimer !== null) window.clearInterval(sendTimer);
      if (heartbeatTimer !== null) window.clearInterval(heartbeatTimer);
      socket?.disconnect();
      delete (window as unknown as { __peta3dSocket?: Socket }).__peta3dSocket;
    };
  }, [
    setPlayerIdentity,
    setRemotePlayers,
    setConnectionStatus,
    setObserver,
    setAvatarTransform,
  ]);

  // Beri tahu server secara eksplisit saat pemain melakukan teleport
  useEffect(() => {
    if (teleportNonce === 0) return;
    const sock = (window as unknown as { __peta3dSocket?: Socket }).__peta3dSocket;
    if (sock?.connected && !useCampusStore.getState().isObserver) {
      sock.emit('player:teleport', { pos: useCampusStore.getState().avatarPos });
    }
  }, [teleportNonce]);
}
