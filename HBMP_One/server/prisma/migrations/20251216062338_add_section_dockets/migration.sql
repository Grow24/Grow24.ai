-- CreateTable
CREATE TABLE "section_dockets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "section_dockets_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_instances" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "section_docket_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sectionDocketId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "refId" TEXT,
    "url" TEXT,
    "attachmentId" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "section_docket_items_sectionDocketId_fkey" FOREIGN KEY ("sectionDocketId") REFERENCES "section_dockets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "section_dockets_documentId_idx" ON "section_dockets"("documentId");

-- CreateIndex
CREATE UNIQUE INDEX "section_dockets_documentId_sectionId_key" ON "section_dockets"("documentId", "sectionId");

-- CreateIndex
CREATE INDEX "section_docket_items_sectionDocketId_idx" ON "section_docket_items"("sectionDocketId");
