// express2.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  const apiRouter = express.Router();

  apiRouter.get('/status', (req, res) => {
    res.json({ online: true });
  });

  app.use('/api/v1/status', (req, res) => {
    res.json({ online: true });
  });

  return app;
}

test("mounts and dispatches sub-routers", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/status").expect(200);
  expect(res.body.online).toBe(true);
});
