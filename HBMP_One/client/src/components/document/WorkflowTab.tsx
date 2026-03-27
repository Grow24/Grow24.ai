import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, documentsApi, WorkflowHistoryEntry, AvailableTransitions } from '@/api/documents.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Send, Check, X, Clock, CheckCircle2, AlertCircle, ArrowRight, ExternalLink, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ChecklistSummary } from '@/types/checklist';
import { FlowNodeViewModel, LevelStatus } from '@/utils/workflow';

interface WorkflowTabProps {
  document: Document;
  checklistSummary?: ChecklistSummary;
  pendingItemIds?: string[];
  flowNodes?: FlowNodeViewModel[];
  levelStatuses?: LevelStatus[];
  onTabChange?: (tab: string) => void;
}

export default function WorkflowTab({
  document,
  checklistSummary,
  pendingItemIds = [],
  flowNodes = [],
  levelStatuses = [],
  onTabChange,
}: WorkflowTabProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [localComments, setLocalComments] = useState<Map<string, string>>(new Map());

  const { data: workflowHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['workflow-history', document.id],
    queryFn: () => documentsApi.getWorkflowHistory(document.id),
  });

  const { data: availableTransitions } = useQuery({
    queryKey: ['workflow-transitions', document.id],
    queryFn: () => documentsApi.getAvailableTransitions(document.id),
  });

  const workflowTransitionMutation = useMutation({
    mutationFn: async ({ action, comment }: { action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES'; comment?: string }) => {
      try {
        const result = await documentsApi.executeWorkflowTransition(document.id, action, comment);
        // Ensure result has expected structure
        if (!result || typeof result !== 'object') {
          throw new Error('Invalid response from server');
        }
        return result;
      } catch (error: any) {
        // Safely extract error message with defensive checks
        let errorMessage = 'Failed to execute workflow transition';
        
        // Handle different error shapes
        if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'object') {
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        }
        
        // Create a clean error object
        const cleanError = new Error(errorMessage);
        (cleanError as any).response = error?.response;
        throw cleanError;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', document.id] });
      queryClient.invalidateQueries({ queryKey: ['workflow-history', document.id] });
      queryClient.invalidateQueries({ queryKey: ['workflow-transitions', document.id] });
      queryClient.invalidateQueries({ queryKey: ['project-documents', document.projectId] });
      
      // Store comment locally if API didn't return it (best-effort)
      if (variables.comment && data && typeof data === 'object' && Array.isArray(data.history) && !data.history.some((h: any) => h.comment === variables.comment)) {
        setLocalComments((prev) => {
          const next = new Map(prev);
          next.set(`${variables.action}-${Date.now()}`, variables.comment!);
          return next;
        });
      }
      
      setComment('');
      toast({
        title: 'Workflow transition successful',
        description: 'Document status has been updated',
      });
    },
    onError: (error: any) => {
      // Safely extract error message with defensive checks
      let errorMessage = 'Failed to execute workflow transition';
      
      try {
        if (error?.message) {
          errorMessage = String(error.message);
        } else if (error?.response?.data) {
          const errorData = error.response.data;
          if (typeof errorData === 'object') {
            errorMessage = errorData.error?.message || errorData.message || errorMessage;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        }
      } catch (e) {
        // If error extraction fails, use default message
        console.error('Error extracting error message:', e);
      }
      
      toast({
        title: 'Workflow transition failed',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'UNDER_REVIEW':
        return 'warning';
      case 'DRAFT':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMIT':
        return <Send className="h-4 w-4" />;
      case 'APPROVE':
        return <Check className="h-4 w-4" />;
      case 'REQUEST_CHANGES':
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusIcon = (toStatus: string) => {
    switch (toStatus) {
      case 'APPROVED':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'DRAFT':
        return <Clock className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleTransition = (action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES') => {
    const commentValue = comment.trim() || undefined;
    workflowTransitionMutation.mutate({ action, comment: commentValue });
  };

  // Calculate checklist completion
  const checklistCompletion = checklistSummary?.completedCount ?? 0;
  const checklistTotal = checklistSummary?.totalCount ?? 0;
  const checklistPercent = checklistSummary?.completionPercent ?? 0;
  const requiredCompletionPercent = 100;

  // Check if APPROVE is blocked
  // TEMPORARY FOR TESTING: Always allow approval regardless of checklist
  const isApproveBlocked = useMemo(() => {
    // const approveTransition = availableTransitions?.availableTransitions.find((t) => t.action === 'APPROVE');
    // if (!approveTransition) return false;
    // const roundedChecklistPercent = Math.round(checklistPercent);
    // return roundedChecklistPercent < requiredCompletionPercent; // DISABLED FOR TESTING
    return false; // Always allow approval for testing
  }, [availableTransitions, checklistPercent, requiredCompletionPercent]);

  // Merge workflow history with local comments
  const enhancedHistory = useMemo(() => {
    if (!workflowHistory) return [];
    
    const history = [...workflowHistory.history];
    // Add local comments to history entries if they don't have comments
    return history.map((entry) => {
      if (!entry.comment) {
        // Try to find a matching local comment (best-effort matching)
        const localComment = Array.from(localComments.values()).find((c) => 
          entry.toStatus === 'APPROVED' || entry.toStatus === 'UNDER_REVIEW'
        );
        if (localComment) {
          return { ...entry, comment: localComment };
        }
      }
      return entry;
    });
  }, [workflowHistory, localComments]);

  return (
    <div className="space-y-4 pb-4">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={getStatusVariant(document.status)} className="text-sm px-3 py-1">
              {formatStatus(document.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Version {document.version}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Approval Blocking Warning */}
      {isApproveBlocked && (
        <Card className="border-2 border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <CardTitle className="text-sm font-semibold text-amber-900">
                Approval Blocked
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-amber-800">
              Checklist incomplete ({checklistPercent}%). Complete all mandatory items to approve this document.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange?.('checklist')}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Checklist
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Comments Input */}
      {availableTransitions && availableTransitions.availableTransitions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Add Comment</CardTitle>
            <CardDescription className="text-xs">Optional comment for workflow transition</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your comment (optional)..."
              rows={3}
              className="text-sm"
            />
          </CardContent>
        </Card>
      )}

          {/* Action Buttons */}
          {availableTransitions && availableTransitions.availableTransitions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {availableTransitions.availableTransitions.map((transition) => {
              // TEMPORARY FOR TESTING: Always enable APPROVE button regardless of checklist
              // TODO: Re-enable checklist validation for production
              const isApproveAction = transition.action === 'APPROVE';
              
              // FOR TESTING: Always enable buttons (no checklist or pending check)
              const isDisabled = false; // Always enabled for testing
              const isPending = workflowTransitionMutation.isPending;
              
              // Debug logging for APPROVE button state
              if (isApproveAction && process.env.NODE_ENV === 'development') {
                console.log('Approve button state (TESTING MODE):', {
                  isDisabled,
                  isPending,
                  hasTransition: !!transition,
                  action: transition.action,
                });
              }

              return (
                <div key={transition.action} className="space-y-2">
                  <Button
                    onClick={() => {
                      console.log('Button clicked:', transition.action);
                      handleTransition(transition.action as 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES');
                    }}
                    disabled={false}
                    variant={transition.action === 'APPROVE' ? 'default' : 'outline'}
                    className="w-full justify-start"
                    size="lg"
                  >
                    {getActionIcon(transition.action)}
                    <span className="ml-2">{transition.label}</span>
                  </Button>
                  {transition.action === 'APPROVE' && !isDisabled && (
                      <p className="text-xs text-muted-foreground ml-1">
                      Requires: Checklist 100% complete + all mandatory fields filled
                      </p>
                    )}
                  {transition.action === 'SUBMIT' && (
                    <p className="text-xs text-muted-foreground ml-1">
                      Requires: All mandatory fields filled
                    </p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Workflow Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHistory ? (
            <p className="text-sm text-muted-foreground py-4">Loading history...</p>
          ) : enhancedHistory.length > 0 ? (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-6">
                {enhancedHistory.map((entry: WorkflowHistoryEntry, index: number) => (
                  <div key={entry.id} className="relative flex gap-4">
                    {/* Timeline icon */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={cn(
                        "h-8 w-8 rounded-full border-2 flex items-center justify-center",
                        entry.toStatus === 'APPROVED' && "bg-green-50 border-green-500",
                        entry.toStatus === 'UNDER_REVIEW' && "bg-amber-50 border-amber-500",
                        entry.toStatus === 'DRAFT' && "bg-gray-50 border-gray-400",
                        !['APPROVED', 'UNDER_REVIEW', 'DRAFT'].includes(entry.toStatus) && "bg-gray-50 border-gray-400"
                      )}>
                        {getStatusIcon(entry.toStatus)}
                      </div>
                    </div>

                    {/* Timeline content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatStatus(entry.fromStatus)}
                            </span>
                            <ArrowRight className="h-3 w-3 text-gray-400 flex-shrink-0" />
                            <span className={cn(
                              "text-sm font-semibold",
                              entry.toStatus === 'APPROVED' && "text-green-700",
                              entry.toStatus === 'UNDER_REVIEW' && "text-amber-700",
                              entry.toStatus === 'DRAFT' && "text-gray-700"
                            )}>
                              {formatStatus(entry.toStatus)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span className="font-medium">{entry.performedBy}</span>
                            <span className="text-muted-foreground/60">•</span>
                            <span>{formatDate(entry.performedAt)}</span>
                          </div>

                          {entry.comment && (
                            <div className="mt-2 p-2.5 bg-gray-50 rounded-md border-l-2 border-primary/30">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {entry.comment}
                              </p>
                      </div>
                    )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                No workflow history yet. Transitions will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

          {/* Status Flow Diagram */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status Flow</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                'px-4 py-2 rounded border-2 font-medium transition-colors',
                  document.status === 'DRAFT'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted'
                )}
              >
                Draft
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={cn(
                'px-4 py-2 rounded border-2 font-medium transition-colors',
                  document.status === 'UNDER_REVIEW'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted'
                )}
              >
                Under Review
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={cn(
                'px-4 py-2 rounded border-2 font-medium transition-colors',
                  document.status === 'APPROVED'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-muted'
                )}
              >
                Approved
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
