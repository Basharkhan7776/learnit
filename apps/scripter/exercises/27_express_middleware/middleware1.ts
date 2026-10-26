// middleware1.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  const authMiddleware = (req: any, res: any, next: any) => {
    // TODO: Verify Authorization header is "Bearer secret-token"
    next();
  };

  app.get('/public', (req, res) => {
    res.json({ public: true });
  });

  // Protected route with authMiddleware
  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ secretData: 12345 });
  });

  return app;
}

test("authenticates requests with Bearer token middleware", async () => {
  const app = createApp();

  await request(app).get("/public").expect(200);

  // Missing token -> 401
  const failRes = await request(app).get("/protected").expect(401);
  expect(failRes.body.error).toBe("Unauthorized");

  // Valid token -> 200
  const okRes = await request(app)
    .get("/protected")
    .set("Authorization", "Bearer secret-token")
    .expect(200);
  expect(okRes.body.secretData).toBe(12345);
});
