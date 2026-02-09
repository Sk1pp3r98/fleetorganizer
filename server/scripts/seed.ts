import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { shipTypes, shipTypeRoles, shipInstances, users } from "../db/schema";
import crypto from "node:crypto";

const dbUrl = process.env.DB_URL;
const client = createClient({ url: dbUrl });
const db = drizzle(client);

// hard-coded seed data
const adminId = crypto.randomUUID();
const arrowId = "anvil-arrow";

await db.insert(users).values({
  id: adminId,
  handle: "admin",
  passwordHash: "SEE_CREATE_ADMIN_SCRIPT",
  role: "admin",
});

await db.insert(shipTypes).values({
  id: arrowId,
  name: "Arrow",
  manufacturer: "Anvil",
  size: "S",
  crewMin: 1,
  crewMax: 1,
  imageUrl: null,
  metaJson: "{}",
});

await db.insert(shipTypeRoles).values({
  shipTypeId: arrowId,
  role: "fighter",
});

await db.insert(shipInstances).values({
  id: crypto.randomUUID(),
  ownerId: adminId,
  shipTypeId: arrowId,
  nickname: "Daily Interceptor",
  hardwareJson: JSON.stringify({
    weapons: ["Mantis GT-220"],
    shields: ["Paladin"],
  }),
  notes: "Stock loadout, combat ready",
});

console.log("Seed complete");
process.exit(0);
