-- CreateTable
CREATE TABLE "FlowMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "NodeMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flowId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    CONSTRAINT "NodeMaster_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "FlowMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EdgeMaster" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flowId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "data" TEXT,
    CONSTRAINT "EdgeMaster_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "FlowMaster" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
