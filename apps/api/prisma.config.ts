import { defineConfig } from "prisma/config";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(import.meta.dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema",
});
