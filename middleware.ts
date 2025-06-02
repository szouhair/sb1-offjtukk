import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  console.log(session);

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