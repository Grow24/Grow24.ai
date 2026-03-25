import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download } from 'lucide-react';
import { Docket } from '@/api/projects.api';
import { DocumentListItem } from '@/api/documents.api';
import { cn } from '@/lib/utils';

interface DocketCardProps {
  docket: Docket;
  documents: DocumentListItem[];
  onCreateDocument?: () => void;
  onCreateSRS?: () => void;
  onCreateUATP?: () => void;
  projectId: string;
  isCreateDisabled?: boolean;
  disabledTooltip?: string;
  showSRSButton?: boolean;
  showUATPButton?: boolean;
  isSRSCreateDisabled?: boolean;
  isUATPCreateDisabled?: boolean;
}

export default function DocketCard({ 
  docket, 
  documents, 
  onCreateDocument,
  onCreateSRS,
  onCreateUATP,
  projectId,
  isCreateDisabled = false,
  disabledTooltip,
  showSRSButton = false,
  showUATPButton = false,
  isSRSCreateDisabled = false,
  isUATPCreateDisabled = false,
}: DocketCardProps) {
  const navigate = useNavigate();

  const getCreateButtonLabel = () => {
    if (docket.type === 'BUSINESS_CASE') {
      return 'Create Business Case';
    }
    if (docket.type === 'BUSINESS_REQUIREMENTS') {
      return 'Create BRD';
    }
    return 'Create Document';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'UNDER_REVIEW':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const handleExport = async (documentId: string, format: 'docx' | 'pdf') => {
    try {
      const blob = await import('@/api/documents.api').then((api) => api.documentsApi.export(documentId, format));
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <CardHeader className="pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-slate-900">{docket.name}</CardTitle>
          <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600 bg-slate-50">
            Level: {docket.level}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-500 font-medium mt-1.5">
          {docket.type === 'BUSINESS_REQUIREMENTS' && 'Conceptual & Logical'}
          {docket.type === 'BUSINESS_CASE' && 'Conceptual'}
          {docket.type === 'TEST' && 'Implementation'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {onCreateDocument && (
          <Button 
            onClick={onCreateDocument} 
            className="w-full font-medium shadow-sm hover:shadow" 
            disabled={isCreateDisabled}
            title={isCreateDisabled ? disabledTooltip : undefined}
          >
            <Plus className="mr-2 h-4 w-4" />
            {getCreateButtonLabel()}
          </Button>
        )}
        
        {/* Additional create buttons for SRS and UATP (shown after BRD approval) */}
        {showSRSButton && onCreateSRS && (
          <Button 
            onClick={onCreateSRS} 
            className="w-full font-medium border-slate-300 hover:bg-slate-50" 
            variant="outline"
            disabled={isSRSCreateDisabled}
            title={isSRSCreateDisabled ? "BRD must be Approved before creating SRS" : undefined}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create SRS
          </Button>
        )}
        
        {showUATPButton && onCreateUATP && (
          <Button 
            onClick={onCreateUATP} 
            className="w-full font-medium border-slate-300 hover:bg-slate-50" 
            variant="outline"
            disabled={isUATPCreateDisabled}
            title={isUATPCreateDisabled ? "BRD must be Approved before creating UATP" : undefined}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create UATP
          </Button>
        )}

        {documents.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500 font-medium">
            No documents created yet
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 hover:border-slate-300 transition-all"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2.5">
                    <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-900 truncate">{doc.title}</span>
                    <Badge 
                      variant={getStatusBadgeVariant(doc.status)} 
                      className={cn(
                        "text-xs font-medium flex-shrink-0",
                        doc.status === 'APPROVED' && "bg-emerald-100 text-emerald-700 border-emerald-200",
                        doc.status === 'UNDER_REVIEW' && "bg-amber-100 text-amber-700 border-amber-200",
                        doc.status === 'DRAFT' && "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      {doc.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs font-medium text-slate-700 hover:bg-white hover:text-slate-900"
                    onClick={() =>
                      navigate(`/projects/${projectId}/dockets/${doc.docketId}/documents/${doc.id}`)
                    }
                  >
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 hover:bg-white"
                    onClick={() => handleExport(doc.id, 'docx')}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

