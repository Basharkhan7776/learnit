// express1.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Add GET /
  // TODO: Add GET /users/:id
  // TODO: Add POST /echo

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
