import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Workflow state machine types
export type WorkflowStatus = 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SUPERSEDED';
export type WorkflowAction = 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES';

// State machine: maps (currentStatus, action) -> nextStatus
const WORKFLOW_TRANSITIONS: Record<WorkflowStatus, Partial<Record<WorkflowAction, WorkflowStatus>>> = {
  DRAFT: {
    SUBMIT: 'UNDER_REVIEW',
  },
  UNDER_REVIEW: {
    APPROVE: 'APPROVED',
    REQUEST_CHANGES: 'DRAFT',
  },
  APPROVED: {
    // No transitions from APPROVED in v1 (SUPERSEDED is future)
  },
  SUPERSEDED: {
    // No transitions from SUPERSEDED
  },
};

/**
 * Get next status from current status and action
 * @throws Error if transition is invalid
 */
function getNextStatus(currentStatus: WorkflowStatus, action: WorkflowAction): WorkflowStatus {
  const transitions = WORKFLOW_TRANSITIONS[currentStatus];
  if (!transitions || !transitions[action]) {
    throw new Error(
      `Invalid transition: Cannot perform action "${action}" from status "${currentStatus}"`
    );
  }
  return transitions[action]!;
}

/**
 * Validate transition is allowed
 */
function validateTransition(
  currentStatus: WorkflowStatus,
  action: WorkflowAction
): { valid: boolean; error?: string } {
  try {
    getNextStatus(currentStatus, action);
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Check checklist completion (extension point for future)
 * TODO: When checklist management is fully implemented,
 * enforce that checklistCompletion === 100% before allowing APPROVE
 * for certain document types (e.g., SRS, BRD).
 */
async function checkChecklistCompletion(
  documentId: string,
  action: WorkflowAction
): Promise<{ allowed: boolean; error?: string }> {
  // For v1: If action is APPROVE, check if checklist exists and is complete
  // For now, return allowed=true as checklist is not yet implemented
  // Extension point: Query ChecklistInstance and check completionScore >= 100
  
  if (action === 'APPROVE') {
    // TODO: Implement checklist check
    // const checklist = await prisma.checklistInstance.findUnique({ where: { documentId } });
    // if (checklist && checklist.completionScore < 100) {
    //   return {
    //     allowed: false,
    //     error: `Cannot approve: checklist incomplete (${checklist.completionScore}% complete, requires 100%)`,
    //   };
    // }
  }
  
  return { allowed: true };
}

/**
 * Execute workflow transition
 * POST /api/documents/:documentId/workflow/transition
 */
export const executeTransition = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { action, comment } = req.body;

    // Validate action
    const validActions: WorkflowAction[] = ['SUBMIT', 'APPROVE', 'REQUEST_CHANGES'];
    if (!action || !validActions.includes(action)) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: `Action must be one of: ${validActions.join(', ')}`,
        },
      });
    }

    // Fetch document
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    const currentStatus = document.status as WorkflowStatus;

    // Validate transition
    const validation = validateTransition(currentStatus, action as WorkflowAction);
    if (!validation.valid) {
      return res.status(400).json({
        error: {
          code: 'WORKFLOW_TRANSITION_BLOCKED',
          message: validation.error,
        },
      });
    }

    // Check checklist completion (extension point)
    const checklistCheck = await checkChecklistCompletion(documentId, action as WorkflowAction);
    if (!checklistCheck.allowed) {
      return res.status(400).json({
        error: {
          code: 'WORKFLOW_TRANSITION_BLOCKED',
          message: checklistCheck.error,
          details: {
            reason: 'CHECKLIST_INCOMPLETE',
          },
        },
      });
    }

    // Get next status
    const nextStatus = getNextStatus(currentStatus, action as WorkflowAction);

    // Perform transition in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update document status
      const updatedDocument = await tx.documentInstance.update({
        where: { id: documentId },
        data: { status: nextStatus },
      });

      // Create history record
      const history = await tx.workflowHistory.create({
        data: {
          documentId,
          fromStatus: currentStatus,
          toStatus: nextStatus,
          performedBy: req.body.performedBy || 'system', // TODO: Get from auth context
          comment: comment || null,
        },
      });

      return { document: updatedDocument, history };
    });

    // Get recent history for response
    const recentHistory = await prisma.workflowHistory.findMany({
      where: { documentId },
      orderBy: { performedAt: 'desc' },
      take: 10,
    });

    res.json({
      id: result.document.id,
      status: result.document.status,
      updatedAt: result.document.updatedAt,
      history: recentHistory.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        performedBy: h.performedBy,
        performedAt: h.performedAt,
        comment: h.comment,
      })),
    });
  } catch (error: any) {
    console.error('Workflow transition error:', error);
    res.status(500).json({
      error: {
        code: 'TRANSITION_ERROR',
        message: 'Failed to execute workflow transition',
        details: error.message,
      },
    });
  }
};

/**
 * Get workflow history
 * GET /api/documents/:documentId/workflow/history
 */
export const getWorkflowHistory = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    // Fetch document
    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    // Fetch history
    const history = await prisma.workflowHistory.findMany({
      where: { documentId },
      orderBy: { performedAt: 'asc' },
    });

    res.json({
      documentId: document.id,
      currentStatus: document.status,
      history: history.map((h) => ({
        id: h.id,
        fromStatus: h.fromStatus,
        toStatus: h.toStatus,
        performedBy: h.performedBy,
        performedAt: h.performedAt,
        comment: h.comment,
      })),
    });
  } catch (error: any) {
    console.error('Get workflow history error:', error);
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch workflow history',
        details: error.message,
      },
    });
  }
};

/**
 * Get available transitions for current status
 * GET /api/documents/:documentId/workflow/transitions
 */
export const getAvailableTransitions = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    const document = await prisma.documentInstance.findUnique({
      where: { id: documentId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!document) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Document not found',
        },
      });
    }

    const currentStatus = document.status as WorkflowStatus;
    const transitions = WORKFLOW_TRANSITIONS[currentStatus] || {};

    const availableTransitions = Object.entries(transitions).map(([action, nextStatus]) => ({
      action: action as WorkflowAction,
      nextStatus,
      label: getActionLabel(action as WorkflowAction),
    }));

    res.json({
      documentId: document.id,
      currentStatus,
      availableTransitions,
    });
  } catch (error: any) {
    console.error('Get available transitions error:', error);
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch available transitions',
        details: error.message,
      },
    });
  }
};

/**
 * Get human-readable label for action
 */
function getActionLabel(action: WorkflowAction): string {
  const labels: Record<WorkflowAction, string> = {
    SUBMIT: 'Submit for Review',
    APPROVE: 'Approve',
    REQUEST_CHANGES: 'Request Changes',
  };
  return labels[action];
}

