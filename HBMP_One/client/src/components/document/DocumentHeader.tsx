import { Document } from '@/api/documents.api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Send, Check, Download, ChevronDown, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CLIPONStepper from './CLIPONStepper';
import { ChecklistSummary } from '@/types/checklist';
import { getDocumentDependencies } from '@/utils/documentDependencies';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface DocumentHeaderProps {
  document: Document;
  onStatusChange?: (status: string) => void; // Deprecated, use onWorkflowTransition
  onWorkflowTransition?: (action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES', comment?: string) => void;
  onExport: (format: 'docx' | 'pdf' | 'xlsx' | 'google-sheets') => void;
  checklistSummary?: ChecklistSummary;
  requiredCompletionPercent?: number;
  onSwitchToTab?: (tab: 'checklist' | 'workflow' | 'info' | 'flow') => void;
}

export default function DocumentHeader({
  document,
  onStatusChange,
  onWorkflowTransition,
  onExport,
  checklistSummary,
  requiredCompletionPercent = 100,
  onSwitchToTab,
}: DocumentHeaderProps) {
  const dependencies = getDocumentDependencies(document.template.code);
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'UNDER_REVIEW':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Map document level to stepper level
  const getStepperLevel = (level: string): 'C' | 'L' | 'I' | 'P' | 'O' | 'N' | undefined => {
    const upperLevel = level.toUpperCase();
    if (['C', 'L', 'I', 'P', 'O', 'N'].includes(upperLevel)) {
      return upperLevel as 'C' | 'L' | 'I' | 'P' | 'O' | 'N';
    }
    // Default mapping
    if (upperLevel.includes('CONCEPTUAL') || upperLevel.includes('CONCEPT')) return 'C';
    if (upperLevel.includes('LOGICAL') || upperLevel.includes('LOGIC')) return 'L';
    if (upperLevel.includes('IMPLEMENTATION') || upperLevel.includes('IMPLEMENT')) return 'I';
    return 'C'; // Default to Conceptual
  };

  return (
    <div className="sticky top-16 z-40 border-b bg-white">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="text-sm text-muted-foreground">
              Project / {document.template.name} / {document.title}
            </div>
            <div className="flex items-center gap-6 mt-2">
              <h1 className="text-2xl font-bold">{document.title}</h1>
              {/* Stepper positioned right next to the title */}
              <CLIPONStepper currentLevel={getStepperLevel(document.level)} />
            </div>
            
            {/* Document Role Strip */}
            <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-medium">
                  {dependencies.documentType}
                </Badge>
              </div>
              
              {dependencies.dependsOn.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/70">Depends on:</span>
                  <div className="flex items-center gap-1.5">
                    {dependencies.dependsOn.map((dep, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {dependencies.enables.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/70">Enables:</span>
                  <div className="flex items-center gap-1.5">
                    {dependencies.enables.map((en, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-normal border-primary/30">
                        {en}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Checklist Completion Indicator */}
            {checklistSummary && (
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => onSwitchToTab?.('checklist')}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer group"
                >
                  <span className="font-medium">Checklist:</span>
                  <div className="w-32">
                    <Progress 
                      value={checklistSummary.completionPercent} 
                      className="h-1.5"
                    />
                  </div>
                  <span className={cn(
                    "font-semibold min-w-[3rem] text-right",
                    checklistSummary.completionPercent >= requiredCompletionPercent
                      ? "text-green-600"
                      : checklistSummary.completionPercent >= 50
                      ? "text-amber-600"
                      : "text-red-600"
                  )}>
                    {checklistSummary.completionPercent}%
                  </span>
                  <span className="text-muted-foreground/60 group-hover:text-muted-foreground">
                    ({checklistSummary.completedCount}/{checklistSummary.totalCount})
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={getStatusVariant(document.status)}>{document.status}</Badge>

            <Button variant="outline" size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>

            {document.status === 'DRAFT' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onWorkflowTransition) {
                    onWorkflowTransition('SUBMIT');
                  } else if (onStatusChange) {
                    onStatusChange('UNDER_REVIEW');
                  }
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit for Review
              </Button>
            )}

            {document.status === 'UNDER_REVIEW' && (
              <>
                {(() => {
                  const checklistPercent = checklistSummary?.completionPercent ?? 0;
                  const isChecklistComplete = checklistPercent >= requiredCompletionPercent;
                  const pendingCount = checklistSummary ? checklistSummary.totalCount - checklistSummary.completedCount : 0;
                  const disabledReason = pendingCount > 0 
                    ? `Cannot approve: ${pendingCount} checklist item${pendingCount !== 1 ? 's' : ''} pending (${checklistPercent}% complete)`
                    : 'Checklist must be 100% complete to approve';

                  return (
                    <div className="relative group">
                      <Button
                        variant="default"
                        size="sm"
                        disabled={!isChecklistComplete}
                        onClick={() => {
                          if (!isChecklistComplete) {
                            return;
                          }
                          if (onWorkflowTransition) {
                            onWorkflowTransition('APPROVE');
                          } else if (onStatusChange) {
                            onStatusChange('APPROVED');
                          }
                        }}
                        className={!isChecklistComplete ? 'opacity-60 cursor-not-allowed' : ''}
                      >
                        {!isChecklistComplete && <AlertCircle className="mr-2 h-4 w-4" />}
                        <Check className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      {!isChecklistComplete && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          {disabledReason}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (onWorkflowTransition) {
                      onWorkflowTransition('REQUEST_CHANGES');
                    } else if (onStatusChange) {
                      onStatusChange('DRAFT');
                    }
                  }}
                >
                  Request Changes
                </Button>
              </>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onExport('docx')}>
                  Word (.docx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('pdf')}>
                  PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('xlsx')}>
                  Excel (.xlsx)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('google-doc')}>
                  Google Doc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExport('google-sheets')}>
                  Google Sheets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

