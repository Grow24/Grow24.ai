-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "flow_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "lastSync" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changes" TEXT,
    CONSTRAINT "flow_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_flow_collaborators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "flow_collaborators_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "flows" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "flow_collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_flow_collaborators" ("createdAt", "flowId", "id", "role", "userId") SELECT "createdAt", "flowId", "id", "role", "userId" FROM "flow_collaborators";
DROP TABLE "flow_collaborators";
ALTER TABLE "new_flow_collaborators" RENAME TO "flow_collaborators";
CREATE UNIQUE INDEX "flow_collaborators_flowId_userId_key" ON "flow_collaborators"("flowId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
