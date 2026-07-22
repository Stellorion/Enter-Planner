import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './utils/jwt';

const PUBLIC_API_ROUTES = ['/api/register', '/api/login'];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (PUBLIC_API_ROUTES.some((route) => pathname === route)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
