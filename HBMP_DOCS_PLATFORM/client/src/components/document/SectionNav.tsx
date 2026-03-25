import { useState } from 'react';
import { DocumentSection } from '@/api/documents.api';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  MoreVertical, 
  Plus, 
  Trash2, 
  Copy, 
  Pencil, 
  Smile, 
  Link as LinkIcon, 
  List, 
  ArrowUp, 
  ArrowDown, 
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useParams } from 'react-router-dom';

interface SectionNavProps {
  sections: DocumentSection[];
  activeSectionId?: string | null;
  onSectionSelect: (sectionId: string) => void;
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onSectionRename?: (sectionId: string, newTitle: string) => void;
  onSectionDelete?: (sectionId: string) => void;
  onSectionDuplicate?: (sectionId: string) => void;
  onSectionMove?: (sectionId: string, direction: 'up' | 'down') => void;
}

export default function SectionNav({ 
  sections, 
  activeSectionId, 
  onSectionSelect, 
  isCollapsed: externalCollapsed, 
  onCollapseChange,
  onSectionRename,
  onSectionDelete,
  onSectionDuplicate,
  onSectionMove,
}: SectionNavProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<DocumentSection | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const { projectId, docketId, documentId } = useParams<{
    projectId: string;
    docketId: string;
    documentId: string;
  }>();
  const { toast } = useToast();
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const setIsCollapsed = (collapsed: boolean) => {
    if (onCollapseChange) {
      onCollapseChange(collapsed);
    } else {
      setInternalCollapsed(collapsed);
    }
  };

  const getSectionStatus = (section: DocumentSection) => {
    const hasData = section.fields.some((f) => f.value && f.value.trim() !== '');
    const allMandatoryFilled = section.fields
      .filter((f) => f.mandatory)
      .every((f) => f.value && f.value.trim() !== '');

    if (allMandatoryFilled) return 'complete';
    if (hasData) return 'in-progress';
    return 'untouched';
  };

  const handleRename = (section: DocumentSection) => {
    setSelectedSection(section);
    setRenameValue(section.title);
    setRenameDialogOpen(true);
  };

  const confirmRename = () => {
    if (selectedSection && renameValue.trim()) {
      onSectionRename?.(selectedSection.id, renameValue.trim());
      setRenameDialogOpen(false);
      setSelectedSection(null);
      setRenameValue('');
      toast({
        title: 'Section renamed',
        description: `Section renamed to "${renameValue.trim()}"`,
      });
    }
  };

  const handleDelete = (section: DocumentSection) => {
    if (window.confirm(`Are you sure you want to delete "${section.title}"?`)) {
      onSectionDelete?.(section.id);
      toast({
        title: 'Section deleted',
        description: `"${section.title}" has been deleted`,
      });
    }
  };

  const handleDuplicate = (section: DocumentSection) => {
    onSectionDuplicate?.(section.id);
    toast({
      title: 'Section duplicated',
      description: `"${section.title}" has been duplicated`,
    });
  };

  const handleCopyLink = (section: DocumentSection) => {
    const url = `${window.location.origin}/projects/${projectId}/dockets/${docketId}/documents/${documentId}#section-${section.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied',
      description: 'Section link copied to clipboard',
    });
  };

  const handleMove = (section: DocumentSection, direction: 'up' | 'down') => {
    onSectionMove?.(section.id, direction);
    toast({
      title: 'Section moved',
      description: `"${section.title}" moved ${direction}`,
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    if (selectedSection) {
      toast({
        title: 'Emoji added',
        description: `Emoji ${emoji} added to section`,
      });
    }
    setSelectedSection(null);
  };

  const handleAddSubtab = (section: DocumentSection) => {
    toast({
      title: 'Add subtab',
      description: `Adding subtab to "${section.title}"`,
    });
  };

  const commonEmojis = ['📄', '📋', '📝', '📊', '📈', '📉', '✅', '⚠️', '❌', '💡', '🎯', '🚀'];

  if (isCollapsed) {
    return (
      <div className="h-full bg-white border-r border-gray-200 flex items-start justify-center pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="h-8 w-8 text-gray-600 hover:bg-gray-100"
          title="Expand sections"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky top-[120px] h-[calc(100vh-120px)] bg-white border-r border-gray-200 flex flex-col w-64 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(true)}
              className="h-8 w-8 text-gray-600 hover:bg-gray-100 -ml-2"
              title="Collapse sections"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-base font-semibold text-gray-900">Sections</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                toast({
                  title: 'Add tab',
                  description: 'Adding new document tab',
                });
              }}
              className="h-6 w-6 text-gray-600 hover:bg-gray-100 ml-auto"
              title="Add new tab"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Completion Dot Legend */}
        <div className="px-4 pb-2 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
            <span>Untouched</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Sections List */}
      <nav className="flex-1 overflow-y-auto py-2">
        {sections.map((section) => {
          const isActive = activeSectionId === section.id;
          const isHovered = hoveredSectionId === section.id;
          const status = getSectionStatus(section);
          
          return (
            <div
              key={section.id}
              className="relative group"
              onMouseEnter={() => setHoveredSectionId(section.id)}
              onMouseLeave={() => setHoveredSectionId(null)}
            >
              <div
                onClick={() => onSectionSelect(section.id)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 text-left text-sm transition-all cursor-pointer',
                  'hover:bg-gray-50 focus:outline-none',
                  // Consistent row height
                  'min-h-[3rem] py-3',
                  // Active state with stronger highlight
                  isActive && 'bg-blue-50 border-l-4 border-blue-600 font-medium'
                )}
              >
                {/* Completion Status Dot */}
                <div className={cn(
                  'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
                  status === 'complete' && 'bg-green-500',
                  status === 'in-progress' && 'bg-amber-400',
                  status === 'untouched' && 'bg-gray-300'
                )} />
                
                {/* Document Icon */}
                <FileText className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )} />
                
                {/* Section Number and Title */}
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    'font-medium truncate',
                    isActive ? 'text-blue-700 font-semibold' : 'text-gray-900'
                  )}>
                    {section.order}. {section.title}
                  </div>
                </div>

                {/* Three-dot menu (visible on hover or when active) */}
                {(isHovered || isActive) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                        title="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleAddSubtab(section)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add subtab
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(section)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(section)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRename(section)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <Smile className="mr-2 h-4 w-4" />
                          Choose emoji
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent className="w-48">
                          <div className="grid grid-cols-4 gap-2 p-2">
                            {commonEmojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setSelectedSection(section);
                                  handleEmojiSelect(emoji);
                                }}
                                className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleCopyLink(section)}>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Copy link
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <List className="mr-2 h-4 w-4" />
                        Show outline
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleMove(section, 'up')}
                        disabled={section.order === 1}
                      >
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Move up
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleMove(section, 'down')}
                        disabled={section.order === sections.length}
                      >
                        <ArrowDown className="mr-2 h-4 w-4" />
                        Move down
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Move into
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Section</DialogTitle>
            <DialogDescription>
              Enter a new name for this section.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="Section name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  confirmRename();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRename} disabled={!renameValue.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
