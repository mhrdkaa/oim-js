import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware without auth - auth check is in layout.tsx
// Middleware runs on Edge Runtime which doesn't support bcryptjs/prisma
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (pathname.startsWith('/api/sensor') || pathname === '/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // For protected routes, let the layout.tsx handle auth check
  // This avoids Edge Runtime issues with bcryptjs/prisma
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
