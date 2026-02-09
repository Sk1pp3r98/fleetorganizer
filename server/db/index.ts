// server/db/index.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// fleetorganizer DB accessor (call from server routes only)
export function getDb() {
  const config = useRuntimeConfig();
  const client = createClient({
    url: config.dbUrl,
  });
  return drizzle(client);
}
