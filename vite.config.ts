import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import ssrPlugin from 'vite-ssr-components/plugin';
// import adapter from '@hono/vite-dev-server/cloudflare';
// import build from '@hono/vite-cloudflare-pages';

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin()],
});
