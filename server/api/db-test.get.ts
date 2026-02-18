import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { shipInstances, shipTypes, users } from "../db/schema";

export default defineEventHandler(async () => {
  const db = getDb();

  // Resolve FK references so consumers don't need to re-query related tables.
  const rows = await db
    .select({
      id: shipInstances.id,
      ownerId: shipInstances.ownerId,
      shipTypeId: shipInstances.shipTypeId,
      nickname: shipInstances.nickname,
      hardwareJson: shipInstances.hardwareJson,
      notes: shipInstances.notes,
      createdAt: shipInstances.createdAt,
      updatedAt: shipInstances.updatedAt,
      owner: {
        id: users.id,
        handle: users.handle,
        role: users.role,
        createdAt: users.createdAt,
      },
      shipType: {
        id: shipTypes.id,
        name: shipTypes.name,
        manufacturer: shipTypes.manufacturer,
        size: shipTypes.size,
        crewMin: shipTypes.crewMin,
        crewMax: shipTypes.crewMax,
        imageUrl: shipTypes.imageUrl,
      },
    })
    .from(shipInstances)
    .leftJoin(users, eq(shipInstances.ownerId, users.id))
    .leftJoin(shipTypes, eq(shipInstances.shipTypeId, shipTypes.id))
    .all();

  return {
    count: rows.length,
    rows,
  };
});
