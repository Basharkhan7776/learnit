// middleware2.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  app.get('/fail', (req, res, next) => {
    next(new Error("Database crash"));
  });

  // TODO: Register 4-argument error handler (err, req, res, next)
  app.use((err: any, req: any, res: any, next: any) => {
    // Return status 500 with { error: err.message }
  });

  return app;
}

test("catches error in centralized error middleware", async () => {
  const app = createApp();
  const res = await request(app).get("/fail").expect(500);
  expect(res.body.error).toBe("Database crash");
});
