import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'https://subaksubak.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  server: { host: true, port: 4321 },
});
