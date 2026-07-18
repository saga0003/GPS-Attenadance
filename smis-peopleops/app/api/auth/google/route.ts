import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';

const DOMAIN = process.env.ALLOWED_GOOGLE_DOMAIN || 'smis.edu.in';
const SUPER_ADMIN = process.env.SUPER_ADMIN_EMAIL || 'sagar@smis.edu.in';

export async function POST(request: Request) {
  try {
    const { credential } = await request.json();
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId || !credential) return NextResponse.json({ error: 'Google login is not configured.' }, { status: 503 });
    const ticket = await new OAuth2Client(clientId).verifyIdToken({ idToken: credential, audience: clientId });
    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    if (!payload?.email_verified || payload.hd !== DOMAIN || !email?.endsWith(`@${DOMAIN}`)) {
      return NextResponse.json({ error: `Only verified @${DOMAIN} accounts may sign in.` }, { status: 403 });
    }
    return NextResponse.json({ user: { name: payload.name || email, email, role: email === SUPER_ADMIN ? 'super_admin' : 'employee' } });
  } catch {
    return NextResponse.json({ error: 'Invalid Google credential.' }, { status: 401 });
  }
}
