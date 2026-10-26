// express2.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  // TODO: Create a router with GET /status returning { online: true }
  // TODO: Mount router at /api/v1

  return app;
}

test("mounts and dispatches sub-routers", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/status").expect(200);
  expect(res.body.online).toBe(true);
});
