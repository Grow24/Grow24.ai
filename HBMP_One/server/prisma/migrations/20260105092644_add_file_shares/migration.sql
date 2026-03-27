-- CreateTable
CREATE TABLE "file_shares" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileId" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "shareToken" TEXT NOT NULL,
    "sharedBy" TEXT NOT NULL,
    "permission" TEXT NOT NULL DEFAULT 'EDITOR',
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "file_shares_shareToken_key" ON "file_shares"("shareToken");

-- CreateIndex
CREATE INDEX "file_shares_fileId_idx" ON "file_shares"("fileId");

-- CreateIndex
CREATE INDEX "file_shares_shareToken_idx" ON "file_shares"("shareToken");
