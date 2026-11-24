/**
 * Where the site lives, for absolute addresses: link previews, the sitemap and robots.txt.
 * Vercel names the production domain itself; rambhardwaj.in is the site's own domain for anywhere else.
 */
export const SITE = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://rambhardwaj.in';
