// middleware1.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === 'Bearer secret-token') {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  app.get('/public', (req, res) => {
    res.json({ public: true });
  });

  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ secretData: 12345 });
  });

  return app;
}

test("authenticates requests with Bearer token middleware", async () => {
  const app = createApp();

  await request(app).get("/public").expect(200);

  const failRes = await request(app).get("/protected").expect(401);
  expect(failRes.body.error).toBe("Unauthorized");

  const okRes = await request(app)
    .get("/protected")
    .set("Authorization", "Bearer secret-token")
    .expect(200);
  expect(okRes.body.secretData).toBe(12345);
});
