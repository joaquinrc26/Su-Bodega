PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS "ProductCategory" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT 1,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "ProductCategory_slug_key" ON "ProductCategory"("slug");

INSERT OR IGNORE INTO "ProductCategory" ("id", "slug", "name", "description", "isActive", "createdAt") VALUES
  (lower(hex(randomblob(16))), 'vino', 'Vino', 'Catálogo principal de vinos', 1, CURRENT_TIMESTAMP),
  (lower(hex(randomblob(16))), 'vino-guardado', 'Vino Guardado', 'Selección de vinos con guarda', 1, CURRENT_TIMESTAMP);

ALTER TABLE "Wine" ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Wine" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT 1;
ALTER TABLE "Wine" ADD COLUMN "categoryId" TEXT NOT NULL DEFAULT '';

UPDATE "Wine"
SET "categoryId" = (
  SELECT "id"
  FROM "ProductCategory"
  WHERE "slug" = 'vino'
  LIMIT 1
)
WHERE "categoryId" = '';

CREATE INDEX IF NOT EXISTS "Wine_categoryId_idx" ON "Wine"("categoryId");

PRAGMA foreign_keys=ON;
