// server/db/schema.ts
import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * fleetorganizer
 *
 * Model:
 * - shipTypes: the catalog (one row per ship model/type)
 * - shipInstances: one row per actual ship owned by a player (duplicates allowed)
 *   Each instance stores owner-authored notes + installed hardware config.
 */

// org members who can log in
export const users = sqliteTable("users", {
  id: text("id").primaryKey(), // uuid
  handle: text("handle").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("member"), // member | admin
  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
});

// cookie session tokens
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // random token
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(), // unixepoch
});

// ship catalog (one entry per ship type/model)
export const shipTypes = sqliteTable("ship_types", {
  id: text("id").primaryKey(), // stable key, e.g. "anvil-arrow"
  name: text("name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  size: text("size").notNull(), // XS|S|M|L|XL etc
  crewMin: integer("crew_min").notNull().default(1),
  crewMax: integer("crew_max").notNull().default(1),
  imageUrl: text("image_url"),
  metaJson: text("meta_json").notNull().default("{}"), // JSON string for extra catalog fields
  updatedAt: integer("updated_at").notNull().default(sql`(unixepoch())`),
});

// roles/tags per ship type (normalized)
export const shipTypeRoles = sqliteTable(
  "ship_type_roles",
  {
    shipTypeId: text("ship_type_id")
      .notNull()
      .references(() => shipTypes.id, { onDelete: "cascade" }),
    role: text("role").notNull(), // fighter|mining|hauler|...
  },
  (t) => ({
    pk: primaryKey({ columns: [t.shipTypeId, t.role] }),
  })
);

// one row per actual ship owned by a player (duplicates allowed)
export const shipInstances = sqliteTable("ship_instances", {
  id: text("id").primaryKey(), // uuid
  ownerId: text("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  shipTypeId: text("ship_type_id")
    .notNull()
    .references(() => shipTypes.id, { onDelete: "restrict" }),

  // optional per-instance label (e.g. "Arrow #2", "Daily Driver", in-game name)
  nickname: text("nickname"),

  // installed hardware / loadout / components; owner-managed
  // store as JSON string: { "quantumDrive": "...", "shields": [...], ... }
  hardwareJson: text("hardware_json").notNull().default("{}"),

  // owner notes for this exact ship instance
  notes: text("notes"),

  createdAt: integer("created_at").notNull().default(sql`(unixepoch())`),
  updatedAt: integer("updated_at").notNull().default(sql`(unixepoch())`),
});
