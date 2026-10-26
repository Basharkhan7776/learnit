// elysia2.ts solution
import { Elysia } from 'elysia';

export function createElysiaApp() {
  const versionPlugin = (app: any) => {
    return app
      .state("version", "v1.0")
      .decorate("appName", "ScripterApp");
  };

  return new Elysia()
    .use(versionPlugin)
    .get('/info', ({ store, appName }: any) => {
      return { app: appName, version: store.version };
    });
}

test("shares state and decorators via Elysia plugins", async () => {
  const app = createElysiaApp();

  const res = await app.handle(new Request("http://localhost/info"));
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data.app).toBe("ScripterApp");
  expect(data.version).toBe("v1.0");
});
