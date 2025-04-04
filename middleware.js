import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api(.*)',
  ],
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Don't run middleware on static files
    '/', // Run on homepage
    '/(api|trpc)(.*)', // Run on API routes
    '/((?!api/inngest|_next/static|_next/image|favicon.ico).*)'
  ],
};