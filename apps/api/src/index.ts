import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { auth } from "./lib/auth";
import { syncRoutes } from "./routes/sync";

const port = Number(process.env.PORT) || 4000;

export const app = new Elysia()
  .use(
    cors({
      origin: [
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
      ],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  )
  .all("/api/auth", async (ctx) => {
    return auth.handler(ctx.request);
  })
  .all("/api/auth/*", async (ctx) => {
    return auth.handler(ctx.request);
  })
  .use(syncRoutes)
  .get("/", () => ({
    name: "Learnit API",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
  }))
  .listen(port);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
