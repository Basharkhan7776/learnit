// elysia1.ts solution
import { Elysia, t } from 'elysia';

export function createElysiaApp() {
  return new Elysia()
    .get('/health', () => 'OK')
    .post('/calculate', ({ body }: any) => {
      return { sum: body.a + body.b };
    }, {
      body: t.Object({
        a: t.Number(),
        b: t.Number()
      })
    });
}

test("handles ElysiaJS routing and schema validation", async () => {
  const app = createElysiaApp();

  const healthRes = await app.handle(new Request("http://localhost/health"));
  expect(healthRes.status).toBe(200);
  expect(await healthRes.text()).toBe("OK");

  const calcRes = await app.handle(new Request("http://localhost/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: 15, b: 25 })
  }));

  expect(calcRes.status).toBe(200);
  const data = await calcRes.json();
  expect(data.sum).toBe(40);
});
