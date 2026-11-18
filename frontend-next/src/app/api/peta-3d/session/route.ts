import { createHmac, randomInt } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';

const SECRET = process.env.PETA3D_SESSION_SECRET || 'smkn2-peta3d-dev-secret-2026';

interface SessionPayload {
  playerId: string;
  name: string;
  isAuthenticated: boolean;
  iat: number;
}

function signPayload(payload: SessionPayload): string {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data).digest('hex');
  return `${data}.${sig}`;
}

function verifyToken(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  const expected = createHmac('sha256', SECRET).update(data).digest('hex');
  if (sig !== expected) return null;
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as SessionPayload;
  } catch {
    return null;
  }
}

async function resolveAuthenticatedUser(
  req: NextRequest,
): Promise<{ id: string | number; name: string } | null> {
  const cookie = req.headers.get('cookie') || '';
  const authHeader = req.headers.get('authorization') || '';
  if (!cookie && !authHeader) return null;

  const apiBase =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://127.0.0.1:8000/api/v1';

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/admin/auth/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(cookie ? { Cookie: cookie } : {}),
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timer);

    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { id?: string | number; name?: string; nama?: string };
    };
    const user = json?.data;
    const name = user?.name || user?.nama;
    if (user?.id && name) {
      return { id: user.id, name };
    }
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const authUser = await resolveAuthenticatedUser(req);
  if (authUser) {
    const payload: SessionPayload = {
      playerId: `user-${authUser.id}`,
      name: String(authUser.name).slice(0, 32),
      isAuthenticated: true,
      iat: Date.now(),
    };
    return NextResponse.json({
      ...payload,
      token: signPayload(payload),
    });
  }

  let existingGuestToken = '';
  try {
    const body = (await req.json()) as { guestToken?: string };
    if (typeof body?.guestToken === 'string') {
      existingGuestToken = body.guestToken;
    }
  } catch {
    // Body opsional
  }

  if (existingGuestToken) {
    const verified = verifyToken(existingGuestToken);
    if (verified && !verified.isAuthenticated && verified.playerId.startsWith('tamu-')) {
      const refreshed: SessionPayload = {
        playerId: verified.playerId,
        name: verified.name,
        isAuthenticated: false,
        iat: Date.now(),
      };
      return NextResponse.json({
        ...refreshed,
        token: signPayload(refreshed),
      });
    }
  }

  const code = randomInt(1000, 9999);
  const payload: SessionPayload = {
    playerId: `tamu-${Date.now()}-${code}`,
    name: `Tamu-${code}`,
    isAuthenticated: false,
    iat: Date.now(),
  };

  return NextResponse.json({
    ...payload,
    token: signPayload(payload),
  });
}
