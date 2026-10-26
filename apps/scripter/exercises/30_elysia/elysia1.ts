// elysia1.ts
import { Elysia, t } from 'elysia';

export function createElysiaApp() {
  const app = new Elysia();

  // TODO: Add GET /health returning "OK"
  // TODO: Add POST /calculate returning { sum: a + b } with TypeBox validation

  return app;
}

test("handles ElysiaJS routing and schema validation", async () => {
  const app = createElysiaApp();

  // Health check
  const healthRes = await app.handle(new Request("http://localhost/health"));
  expect(healthRes.status).toBe(200);
  expect(await healthRes.text()).toBe("OK");

  // Valid payload
  const calcRes = await app.handle(new Request("http://localhost/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: 15, b: 25 })
  }));

  expect(calcRes.status).toBe(200);
  const data = await calcRes.json();
  expect(data.sum).toBe(40);
});
