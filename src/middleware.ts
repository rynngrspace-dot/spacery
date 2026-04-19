import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Skip all internal paths (_next, _vercel, api)
    // Skip all files (sitemap.xml, robots.txt, etc.)
    '/((?!api|_next|_vercel|sitemap\\.xml|robots\\.xml|robots\\.txt|.*\\..*).*)',
    // Optional: Only run on root or localized paths
    '/',
    '/(id|en)/:path*'
  ]
};
