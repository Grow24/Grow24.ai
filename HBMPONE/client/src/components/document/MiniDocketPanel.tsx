import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, FolderPlus, FileText, Link as LinkIcon, Upload } from 'lucide-react';
import { sectionDocketsApi, SectionDocket, SectionDocketItem } from '@/api/sectionDockets.api';
import { templatesApi } from '@/api/templates.api';
import { attachmentsApi } from '@/api/attachments.api';
import MiniDocketItemCard from './MiniDocketItemCard';
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

interface MiniDocketPanelProps {
  documentId: string;
  sectionId: string;
  sectionTitle: string;
}

export default function MiniDocketPanel({ documentId, sectionId, sectionTitle }: MiniDocketPanelProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { projectId, docketId } = useParams<{ projectId: string; docketId: string }>();
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [addItemType, setAddItemType] = useState<'LINK' | 'GOOGLE_DOC' | 'GOOGLE_SHEET' | 'GOOGLE_SLIDE' | 'HBMP_DOC' | 'FILE' | 'SHEET' | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch section docket
  const { data: docket, isLoading } = useQuery({
    queryKey: ['section-docket', documentId, sectionId],
    queryFn: () => sectionDocketsApi.getBySection(documentId, sectionId),
    enabled: !!documentId && !!sectionId,
  });

  // File upload mutation (handles both cases: docket exists or needs creation)
  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, docketId }: { file: File; docketId: string }) => {
      // First upload the file as an attachment
      const attachment = await attachmentsApi.upload(documentId, file);
      // Then add it as a docket item
      return sectionDocketsApi.addItem(docketId, {
        itemType: 'FILE',
        title: file.name,
        attachmentId: attachment.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      setIsUploading(false);
      toast({
        title: 'File uploaded',
        description: 'File has been uploaded and added to the mini-docket',
      });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: any) => {
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    },
  });

  // Fetch templates for creating child docs
  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.getAll(),
  });

  // Create docket mutation (idempotent)
  const createDocketMutation = useMutation({
    mutationFn: () =>
      sectionDocketsApi.create({
        documentId,
        sectionId,
        title: sectionTitle,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      toast({
        title: 'Sub-docket created',
        description: 'Section converted to mini-docket',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create sub-docket',
        variant: 'destructive',
      });
    },
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: (data: Parameters<typeof sectionDocketsApi.addItem>[1]) =>
      sectionDocketsApi.addItem(docket!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      setAddItemDialogOpen(false);
      setLinkUrl('');
      setLinkTitle('');
      setSelectedTemplateId('');
      setAddItemType(null);
      toast({
        title: 'Item added',
        description: 'Item has been added to the mini-docket',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item',
        variant: 'destructive',
      });
    },
  });

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => sectionDocketsApi.deleteItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      toast({
        title: 'Item removed',
        description: 'Item has been removed from the mini-docket',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
      });
    },
  });

  // Reorder items mutation
  const reorderItemsMutation = useMutation({
    mutationFn: (orderedItemIds: string[]) =>
      sectionDocketsApi.reorderItems(docket!.id, { orderedItemIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reorder items',
        variant: 'destructive',
      });
    },
  });

  // Create child doc mutation
  const createChildDocMutation = useMutation({
    mutationFn: (data: { templateId: string; title?: string }) =>
      sectionDocketsApi.createChildDoc(docket!.id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      setAddItemDialogOpen(false);
      setSelectedTemplateId('');
      setAddItemType(null);
      toast({
        title: 'Child document created',
        description: 'Child document has been created and linked',
      });
      // Navigate to the new document
      if (projectId && docketId && data.document.id) {
        navigate(`/projects/${projectId}/dockets/${docketId}/documents/${data.document.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create child document',
        variant: 'destructive',
      });
    },
  });


  const handleCreateDocket = () => {
    createDocketMutation.mutate();
  };

  const handleAddItem = () => {
    if (!docket) return;

    if (addItemType === 'HBMP_DOC') {
      if (!selectedTemplateId) {
        toast({
          title: 'Error',
          description: 'Please select a template',
          variant: 'destructive',
        });
        return;
      }
      createChildDocMutation.mutate({
        templateId: selectedTemplateId,
        title: linkTitle || undefined,
      });
    } else if (addItemType && (addItemType === 'LINK' || addItemType.startsWith('GOOGLE_'))) {
      if (!linkUrl || !linkTitle) {
        toast({
          title: 'Error',
          description: 'URL and title are required',
          variant: 'destructive',
        });
        return;
      }
      addItemMutation.mutate({
        itemType: addItemType,
        title: linkTitle,
        url: linkUrl,
      });
    } else if (addItemType === 'SHEET' || addItemType === 'SLIDE') {
      // Create a new spreadsheet or presentation item
      if (!linkTitle) {
        toast({
          title: 'Error',
          description: 'Title is required',
          variant: 'destructive',
        });
        return;
      }
      // Generate a unique fileId
      const prefix = addItemType === 'SHEET' ? 'sheet' : 'slide';
      const fileId = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      addItemMutation.mutate({
        itemType: addItemType,
        title: linkTitle,
        refId: fileId, // Store fileId as refId for navigation
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let targetDocketId = docket?.id;

      // Create docket first if it doesn't exist
      if (!targetDocketId) {
        const newDocket = await sectionDocketsApi.create({
          documentId,
          sectionId,
          title: sectionTitle,
        });
        targetDocketId = newDocket.id;
        // Refresh docket query
        queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      }

      // Upload file using mutation
      uploadFileMutation.mutate({ file, docketId: targetDocketId });
    } catch (error: any) {
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to create docket or upload file',
        variant: 'destructive',
      });
    }
  };

  const handleUploadFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!docket || !docket.items.length) return;

    const currentIndex = docket.items.findIndex((item) => item.id === itemId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= docket.items.length) return;

    const newOrder = [...docket.items];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];

    reorderItemsMutation.mutate(newOrder.map((item) => item.id));
  };

  const handleOpenItem = (item: SectionDocketItem) => {
    if (item.itemType === 'HBMP_DOC' && item.refId && projectId && docketId) {
      navigate(`/projects/${projectId}/dockets/${docketId}/documents/${item.refId}`);
    } else if ((item.itemType === 'SHEET' || item.itemType === 'SLIDE') && item.refId && projectId) {
      // Open in Collabora viewer
      navigate(`/projects/${projectId}/office/${item.refId}`);
    }
  };

  const handleOpenExternal = (item: SectionDocketItem) => {
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const handleDownloadFile = async (item: SectionDocketItem) => {
    if (!item.attachmentId) return;

    try {
      const blob = await attachmentsApi.download(item.attachmentId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.title;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message || 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  // Show "Create Sub-Docket" button if no docket exists
  if (!docket && !isLoading) {
    return (
      <Card className="border-slate-200 bg-slate-50/50">
        <CardContent className="p-6 text-center">
          <FolderPlus className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="font-semibold text-slate-900 mb-2">Convert to Mini-Docket</h3>
          <p className="text-sm text-slate-600 mb-4">
            Add supporting documents, files, and links to this section
          </p>
          <Button
            onClick={handleCreateDocket}
            disabled={createDocketMutation.isPending}
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sub-Docket
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="text-sm text-slate-600">Loading mini-docket...</div>
        </CardContent>
      </Card>
    );
  }

  if (!docket) {
    return null;
  }

  return (
    <>
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">Mini-Docket</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">
                Supporting artifacts and linked documents
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setAddItemType('HBMP_DOC');
                  setAddItemDialogOpen(true);
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create HBMP Doc
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setAddItemType('GOOGLE_DOC');
                  setAddItemDialogOpen(true);
                }}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link Google Doc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setAddItemType('GOOGLE_SHEET');
                  setAddItemDialogOpen(true);
                }}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link Google Sheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setAddItemType('GOOGLE_SLIDE');
                  setAddItemDialogOpen(true);
                }}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Link Google Slides
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setAddItemType('SHEET');
                  setAddItemDialogOpen(true);
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Spreadsheet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setAddItemType('SLIDE');
                  setAddItemDialogOpen(true);
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Presentation
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {
                  setAddItemType('LINK');
                  setAddItemDialogOpen(true);
                }}>
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Add Web Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUploadFileClick} disabled={isUploading || uploadFileMutation.isPending}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading || uploadFileMutation.isPending ? 'Uploading...' : 'Upload File'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              disabled={!docket || isUploading || uploadFileMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          {docket.items.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No items yet. Click "Add Item" to get started.
            </div>
          ) : (
            <div className="space-y-3">
              {docket.items.map((item, index) => (
                <MiniDocketItemCard
                  key={item.id}
                  item={item}
                  onOpen={() => handleOpenItem(item)}
                  onOpenExternal={() => handleOpenExternal(item)}
                  onDownload={() => handleDownloadFile(item)}
                  onRemove={() => handleRemoveItem(item.id)}
                  onMoveUp={() => handleMoveItem(item.id, 'up')}
                  onMoveDown={() => handleMoveItem(item.id, 'down')}
                  canMoveUp={index > 0}
                  canMoveDown={index < docket.items.length - 1}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {addItemType === 'HBMP_DOC'
                ? 'Create Child Document'
                : addItemType === 'SHEET'
                ? 'Create Spreadsheet'
                : addItemType === 'SLIDE'
                ? 'Create Presentation'
                : addItemType?.startsWith('GOOGLE_')
                ? 'Link Google Document'
                : 'Add Link'}
            </DialogTitle>
            <DialogDescription>
              {addItemType === 'HBMP_DOC'
                ? 'Create a new document from a template and link it to this section'
                : addItemType === 'SHEET'
                ? 'Create a new spreadsheet that will open in Collabora'
                : addItemType === 'SLIDE'
                ? 'Create a new presentation that will open in Collabora'
                : 'Add a link to an external resource'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {addItemType === 'HBMP_DOC' ? (
              <>
                <div className="space-y-2">
                  <label htmlFor="template" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Template
                  </label>
                  <select
                    id="template"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={selectedTemplateId}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                  >
                    <option value="">Select a template...</option>
                    {templatesData?.templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} ({template.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="child-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Document Title (Optional)
                  </label>
                  <Input
                    id="child-title"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Leave empty to use default"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label htmlFor="link-title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Title *
                  </label>
                  <Input
                    id="link-title"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                  />
                </div>
                {addItemType !== 'SHEET' && addItemType !== 'SLIDE' && (
                  <div className="space-y-2">
                    <label htmlFor="link-url" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      URL *
                    </label>
                    <Input
                      id="link-url"
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={addItemMutation.isPending || createChildDocMutation.isPending}
            >
              {addItemType === 'HBMP_DOC' 
                ? 'Create & Link' 
                : addItemType === 'SHEET' 
                ? 'Create Spreadsheet' 
                : addItemType === 'SLIDE'
                ? 'Create Presentation'
                : 'Add Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

