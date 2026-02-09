import { getDb } from "../db";
import { shipInstances } from "../db/schema";

export default defineEventHandler(async () => {
  const db = getDb();

  // libsql drizzle uses .all() for "many rows"
  const rows = await db.select().from(shipInstances).all();

  return {
    count: rows.length,
    rows,
  };
});
