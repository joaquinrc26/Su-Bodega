-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Wine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL DEFAULT 0,
    "region" TEXT DEFAULT 'Sin especificar',
    "bodega" TEXT,
    "maridaje" TEXT DEFAULT 'Versatile',
    "description" TEXT,
    "grapeTypeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Wine_grapeTypeId_fkey" FOREIGN KEY ("grapeTypeId") REFERENCES "GrapeType" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Wine" ("createdAt", "description", "grapeTypeId", "id", "name", "year") SELECT "createdAt", "description", "grapeTypeId", "id", "name", "year" FROM "Wine";
DROP TABLE "Wine";
ALTER TABLE "new_Wine" RENAME TO "Wine";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
