import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Authentication logic for protected routes
  const isAuthRoute = req.nextUrl.pathname.startsWith('/login') || 
                     req.nextUrl.pathname.startsWith('/signup');
  
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  
  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/reset-password'];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);
  
  // Redirect logic
  if (!session && !isPublicPath && !isAuthRoute && !isApiRoute) {
    // If not authenticated and trying to access protected route, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  if (session && isAuthRoute) {
    // If authenticated and trying to access auth route, redirect to dashboard
    return NextResponse.redirect(new URL('/finance', req.url));
  }
  
  return res;
}

// Only run middleware on specific paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};