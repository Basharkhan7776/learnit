// express1.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Scripter API" });
  });

  app.get('/users/:id', (req, res) => {
    res.status(200).json({ userId: req.params.id });
  });

  app.post('/echo', (req, res) => {
    res.status(201).json(req.body);
  });

  return app;
}

test("handles Express routes and request parameters", async () => {
  const app = createApp();

  const res1 = await request(app).get("/").expect(200);
  expect(res1.body.message).toBe("Welcome to Scripter API");

  const res2 = await request(app).get("/users/42").expect(200);
  expect(res2.body.userId).toBe("42");

  const res3 = await request(app)
    .post("/echo")
    .send({ name: "Alice" })
    .expect(201);
  expect(res3.body.name).toBe("Alice");
});
