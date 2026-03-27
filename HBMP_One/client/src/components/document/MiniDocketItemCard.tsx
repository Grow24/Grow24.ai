import { SectionDocketItem, SectionDocketItemType } from '@/api/sectionDockets.api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Link as LinkIcon, File, Trash2, ExternalLink, ChevronUp, ChevronDown, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniDocketItemCardProps {
  item: SectionDocketItem;
  onOpen?: () => void;
  onOpenExternal?: () => void;
  onDownload?: () => void;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
}

const getItemIcon = (itemType: SectionDocketItemType) => {
  switch (itemType) {
    case 'HBMP_DOC':
      return <FileText className="h-4 w-4" />;
    case 'GOOGLE_DOC':
    case 'GOOGLE_SHEET':
    case 'GOOGLE_SLIDE':
      return <LinkIcon className="h-4 w-4" />;
    case 'SHEET':
      return <FileText className="h-4 w-4" />;
    case 'SLIDE':
      return <FileText className="h-4 w-4" />;
    case 'FILE':
      return <File className="h-4 w-4" />;
    case 'LINK':
      return <LinkIcon className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getItemTypeLabel = (itemType: SectionDocketItemType): string => {
  switch (itemType) {
    case 'HBMP_DOC':
      return 'HBMP Doc';
    case 'GOOGLE_DOC':
      return 'Google Doc';
    case 'GOOGLE_SHEET':
      return 'Google Sheet';
    case 'GOOGLE_SLIDE':
      return 'Google Slides';
    case 'SHEET':
      return 'Spreadsheet';
    case 'SLIDE':
      return 'Presentation';
    case 'FILE':
      return 'File';
    case 'LINK':
      return 'Link';
    default:
      return itemType;
  }
};

const getItemTypeColor = (itemType: SectionDocketItemType): string => {
  switch (itemType) {
    case 'HBMP_DOC':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'GOOGLE_DOC':
    case 'GOOGLE_SHEET':
    case 'GOOGLE_SLIDE':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'SHEET':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'SLIDE':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'FILE':
      return 'bg-slate-100 text-slate-800 border-slate-200';
    case 'LINK':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function MiniDocketItemCard({
  item,
  onOpen,
  onOpenExternal,
  onDownload,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
}: MiniDocketItemCardProps) {
  const hasExternalLink = item.itemType === 'GOOGLE_DOC' || item.itemType === 'GOOGLE_SHEET' || item.itemType === 'GOOGLE_SLIDE' || item.itemType === 'LINK';
  const hasInternalLink = item.itemType === 'HBMP_DOC' || item.itemType === 'SHEET' || item.itemType === 'SLIDE';
  const isFile = item.itemType === 'FILE';

  return (
    <Card className="border-slate-200 hover:border-slate-300 transition-colors">
      <div className="p-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn('mt-1 text-slate-600', hasExternalLink && 'text-green-600')}>
            {getItemIcon(item.itemType)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-slate-900 truncate">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={cn('text-xs font-medium', getItemTypeColor(item.itemType))}
              >
                {getItemTypeLabel(item.itemType)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Move buttons */}
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveUp}
              disabled={!canMoveUp}
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onMoveDown}
              disabled={!canMoveDown}
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          {/* Action buttons */}
          {hasInternalLink && onOpen && (
            <Button variant="ghost" size="sm" onClick={onOpen} className="h-8 text-xs">
              Open
            </Button>
          )}
          {hasExternalLink && item.url && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                if (onOpenExternal) {
                  onOpenExternal();
                } else if (item.url) {
                  window.open(item.url, '_blank');
                }
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          {isFile && onDownload && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onDownload}
              title="Download file"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}


