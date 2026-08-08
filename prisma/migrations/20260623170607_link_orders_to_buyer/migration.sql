-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "buyerId" TEXT,
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "shippingAddress" TEXT NOT NULL,
    "shippingCity" TEXT NOT NULL,
    "shippingZip" TEXT NOT NULL,
    "shippingCost" DECIMAL NOT NULL DEFAULT 0,
    "total" DECIMAL NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "mpPreferenceId" TEXT,
    "mpPaymentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "customerEmail", "customerName", "customerPhone", "id", "mpPaymentId", "mpPreferenceId", "paymentMethod", "shippingAddress", "shippingCity", "shippingCost", "shippingZip", "status", "total", "updatedAt") SELECT "createdAt", "customerEmail", "customerName", "customerPhone", "id", "mpPaymentId", "mpPreferenceId", "paymentMethod", "shippingAddress", "shippingCity", "shippingCost", "shippingZip", "status", "total", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
