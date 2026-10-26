// elysia2.ts
import { Elysia } from 'elysia';

export function createElysiaApp() {
  const versionPlugin = (app: any) => {
    return app
      .state("version", "v1.0")
      .decorate("appName", "ScripterApp");
  };

  const app = new Elysia();
  // TODO: Use versionPlugin and register GET /info returning { app, version }

  return app;
}

test("shares state and decorators via Elysia plugins", async () => {
  const app = createElysiaApp();

  const res = await app.handle(new Request("http://localhost/info"));
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data.app).toBe("ScripterApp");
  expect(data.version).toBe("v1.0");
});
