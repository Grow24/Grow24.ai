-- CreateTable
CREATE TABLE "diagram_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" INTEGER NOT NULL,
    "anchorType" TEXT NOT NULL,
    "anchorId" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sticky_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" INTEGER NOT NULL,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL,
    "width" REAL NOT NULL DEFAULT 240,
    "height" REAL NOT NULL DEFAULT 140,
    "color" TEXT NOT NULL DEFAULT '#FFF7D6',
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "flow_collaborators" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "flowId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "flow_collaborators_flowId_userId_key" ON "flow_collaborators"("flowId", "userId");
