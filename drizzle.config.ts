import type { Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: { url: process.env.DB_URL || "file:./data/fleetorganizer.db" },
} satisfies Config;