import { defineConfig } from 'vite';

const productionPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";

export default defineConfig({
  // Keep built assets working when the site is hosted in a subdirectory.
  base: './',
  plugins: [
    {
      name: 'portfolio-security',
      configureServer(server) {
        // Vite's watch exclusions do not stop files being served. Keep local
        // reference projects and private notes out of the development server.
        server.middlewares.use((request, response, next) => {
          let pathname;
          try {
            // Keep leading slashes as path characters (URL treats // as a host),
            // and catch encoded separators before Vite's static middleware.
            pathname = (request.url || '').split('?')[0];
            for (let i = 0; i < 2; i += 1) {
              const decoded = decodeURIComponent(pathname);
              if (decoded === pathname) break;
              pathname = decoded;
            }
            pathname = pathname.replaceAll('\\', '/');
          } catch {
            response.writeHead(400).end();
            return;
          }
          if (/(?:^|\/)(?:docs|private|\.git)(?:\/|$)/i.test(pathname)) {
            response.writeHead(404).end();
            return;
          }
          next();
        });
      },
      transformIndexHtml: {
        order: 'post',
        handler(html, context) {
          // Vite injects development scripts and styles, so enforce this policy
          // on the production build rather than breaking hot reload.
          if (context.server) return html;
          return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${productionPolicy}" />`);
        },
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    // Project copies are reference material, not part of the portfolio app.
    watch: { ignored: ['**/docs/Tempo/**', '**/docs/Tempo-AI-Assistant/**', '**/docs/RPS_218Game/**', '**/docs/echo-mountain/**', '**/docs/alpfa-njit-app/**'] },
  },
  preview: { host: '127.0.0.1' },
});
