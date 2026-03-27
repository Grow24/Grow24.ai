-- CreateTable
CREATE TABLE "workflow_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL DEFAULT 'system',
    "performedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "comment" TEXT,
    CONSTRAINT "workflow_history_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "document_instances" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "workflow_history_documentId_idx" ON "workflow_history"("documentId");

-- CreateIndex
CREATE INDEX "workflow_history_performedAt_idx" ON "workflow_history"("performedAt");
