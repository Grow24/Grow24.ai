/*
  Warnings:

  - Added the required column `edgeId` to the `EdgeMaster` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nodeId` to the `NodeMaster` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_EdgeMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "edgeId" TEXT NOT NULL,
    "flowId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "data" TEXT,
    CONSTRAINT "EdgeMaster_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "FlowMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_EdgeMaster" ("data", "flowId", "id", "source", "target") SELECT "data", "flowId", "id", "source", "target" FROM "EdgeMaster";
DROP TABLE "EdgeMaster";
ALTER TABLE "new_EdgeMaster" RENAME TO "EdgeMaster";
CREATE TABLE "new_NodeMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nodeId" TEXT NOT NULL,
    "flowId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    CONSTRAINT "NodeMaster_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "FlowMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NodeMaster" ("data", "flowId", "id", "position", "type") SELECT "data", "flowId", "id", "position", "type" FROM "NodeMaster";
DROP TABLE "NodeMaster";
ALTER TABLE "new_NodeMaster" RENAME TO "NodeMaster";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
