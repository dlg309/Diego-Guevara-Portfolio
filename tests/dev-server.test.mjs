import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { createServer } from 'vite';

let server;
let origin;

before(async () => {
  server = await createServer({
    configFile: resolve('vite.config.js'),
    logLevel: 'silent',
    server: { host: '127.0.0.1', port: 0, strictPort: false },
  });
  await server.listen();
  origin = `http://127.0.0.1:${server.httpServer.address().port}`;
});

after(async () => {
  await server?.close();
});

test('development server serves the portfolio entry point', async () => {
  const response = await fetch(`${origin}/`);
  assert.equal(response.status, 200);
  assert.match(await response.text(), /src\/main\.jsx/);
});

test('development server does not serve private project folders', async () => {
  const paths = [
    '/docs/not-public.html',
    '//docs/not-public.html',
    '/%64ocs/not-public.html',
    '/docs%2fnot-public.html',
    '/%2564ocs/not-public.html',
    '/%2e%2e/private/README.md',
    '/%252e%252e%252fprivate/README.md',
    '/.env',
    '/.env.local',
    '/%2eenv.production',
    '/private/README.md',
    `/@fs${resolve('docs/not-public.html')}`,
  ];
  for (const path of paths) {
    const response = await fetch(`${origin}${path}`);
    assert.equal(response.status, 404, `${path} should be inaccessible`);
  }
});
