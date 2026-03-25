import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { importApi, ImportItem } from '@/api/import.api';
import { googleAuthApi, getGoogleToken, storeGoogleToken, clearGoogleToken } from '@/api/googleAuth.api';
import { Document, DocumentSection } from '@/api/documents.api';
import { LogIn, LogOut } from 'lucide-react';

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  document: Document; // Need full document to show all sections
  defaultSectionId?: string; // Default selected section
  onSuccess?: () => void;
}

export default function ImportDialog({
  open,
  onOpenChange,
  documentId,
  document,
  defaultSectionId,
  onSuccess,
}: ImportDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<'LINK_ONLY' | 'AUTO_FILL'>('LINK_ONLY');
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>(defaultSectionId ? [defaultSectionId] : []);
  const [googleDocUrl, setGoogleDocUrl] = useState('');
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [googleSlideUrl, setGoogleSlideUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Load Google token on mount
  useEffect(() => {
    if (open) {
      const token = getGoogleToken();
      setGoogleAccessToken(token);
    }
  }, [open]);

  // Initialize selected sections
  useEffect(() => {
    if (open && defaultSectionId && selectedSectionIds.length === 0) {
      setSelectedSectionIds([defaultSectionId]);
    }
  }, [open, defaultSectionId, selectedSectionIds.length]);

  // Get Google auth URL
  const { data: authUrlData } = useQuery({
    queryKey: ['google-auth-url'],
    queryFn: () => googleAuthApi.getAuthUrl(),
    enabled: false, // Only fetch when needed
  });

  const handleGoogleAuth = async () => {
    try {
      const { authUrl } = await googleAuthApi.getAuthUrl();
      // Open OAuth popup
      const popup = window.open(
        authUrl,
        'Google Auth',
        'width=600,height=700,left=100,top=100'
      );

      if (!popup) {
        toast({
          title: 'Popup blocked',
          description: 'Please allow popups for this site to authenticate with Google',
          variant: 'destructive',
        });
        return;
      }

      // Listen for message from popup (OAuth callback)
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.accessToken) {
          storeGoogleToken(event.data.accessToken);
          setGoogleAccessToken(event.data.accessToken);
          window.removeEventListener('message', messageListener);
          if (!popup.closed) popup.close();
          toast({
            title: 'Google authentication successful',
            description: 'You can now import from Google Docs/Sheets/Slides',
          });
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', messageListener);
          if (!popup.closed) popup.close();
          toast({
            title: 'Authentication failed',
            description: event.data.error || 'Failed to authenticate with Google',
            variant: 'destructive',
          });
        }
      };
      
      window.addEventListener('message', messageListener);

      // Cleanup if popup is closed manually
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          window.removeEventListener('message', messageListener);
        }
      }, 1000);
    } catch (error: any) {
      toast({
        title: 'Authentication failed',
        description: error.message || 'Failed to initiate Google authentication',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleLogout = () => {
    clearGoogleToken();
    setGoogleAccessToken(null);
    toast({
      title: 'Logged out',
      description: 'Google authentication cleared',
    });
  };

  const toggleSection = (sectionId: string) => {
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const importMutation = useMutation({
    mutationFn: importApi.import,
    onSuccess: (data) => {
      // Invalidate queries for all affected sections
      selectedSectionIds.forEach((sectionId) => {
        queryClient.invalidateQueries({ queryKey: ['section-docket', documentId, sectionId] });
      });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      toast({
        title: 'Import successful',
        description: `Imported ${data.totalItemsCreated} item(s) to ${selectedSectionIds.length} section(s)${data.fieldValueUpdates > 0 ? ` and updated ${data.fieldValueUpdates} field(s)` : ''}`,
      });
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setGoogleDocUrl('');
      setGoogleSheetUrl('');
      setGoogleSlideUrl('');
      setLinkUrl('');
      setPasteText('');
      setSelectedSectionIds(defaultSectionId ? [defaultSectionId] : []);
    },
    onError: (error: any) => {
      toast({
        title: 'Import failed',
        description: error.message || 'Failed to import documents',
        variant: 'destructive',
      });
    },
  });

  const handleImport = () => {
    const imports: ImportItem[] = [];

    if (googleDocUrl.trim()) {
      imports.push({
        type: 'GOOGLE_DOC',
        url: googleDocUrl.trim(),
        title: 'Imported Google Doc',
        rawText: mode === 'AUTO_FILL' && !googleAccessToken && pasteText.trim() ? pasteText.trim() : undefined,
        accessToken: mode === 'AUTO_FILL' && googleAccessToken ? googleAccessToken : undefined,
      });
    }

    if (googleSheetUrl.trim()) {
      imports.push({
        type: 'GOOGLE_SHEET',
        url: googleSheetUrl.trim(),
        title: 'Imported Google Sheet',
        accessToken: mode === 'AUTO_FILL' && googleAccessToken ? googleAccessToken : undefined,
      });
    }

    if (googleSlideUrl.trim()) {
      imports.push({
        type: 'GOOGLE_SLIDE',
        url: googleSlideUrl.trim(),
        title: 'Imported Google Slides',
        accessToken: mode === 'AUTO_FILL' && googleAccessToken ? googleAccessToken : undefined,
      });
    }

    if (linkUrl.trim()) {
      imports.push({
        type: 'LINK',
        url: linkUrl.trim(),
        title: 'Imported Link',
      });
    }

    if (imports.length === 0) {
      toast({
        title: 'No items to import',
        description: 'Please provide at least one URL or link',
        variant: 'destructive',
      });
      return;
    }

    if (selectedSectionIds.length === 0) {
      toast({
        title: 'No sections selected',
        description: 'Please select at least one section to import into',
        variant: 'destructive',
      });
      return;
    }

    importMutation.mutate({
      documentId,
      sectionIds: selectedSectionIds,
      imports,
      mode,
      accessToken: mode === 'AUTO_FILL' ? googleAccessToken || undefined : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import from Google Docs/Sheets/Slides</DialogTitle>
          <DialogDescription>
            Import existing artifacts and optionally auto-fill section fields across multiple sections.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Google OAuth Status */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Google Authentication:</span>
              {googleAccessToken ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-600">
                  Not Connected
                </Badge>
              )}
            </div>
            {googleAccessToken ? (
              <Button variant="outline" size="sm" onClick={handleGoogleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={handleGoogleAuth}>
                <LogIn className="h-4 w-4 mr-2" />
                Connect Google
              </Button>
            )}
          </div>

          {/* Section Selection - Multi-select */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Select Sections to Import Into *
            </label>
            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto space-y-2">
              {document.template.sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-slate-50 p-2 rounded"
                  onClick={() => toggleSection(section.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedSectionIds.includes(section.id)}
                    onChange={() => toggleSection(section.id)}
                    className="h-4 w-4"
                  />
                  <label className="text-sm cursor-pointer flex-1">
                    {section.order}. {section.title}
                  </label>
                </div>
              ))}
            </div>
            {selectedSectionIds.length === 0 && (
              <p className="text-xs text-red-600">Please select at least one section</p>
            )}
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Import Mode</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="link-only"
                  name="import-mode"
                  value="LINK_ONLY"
                  checked={mode === 'LINK_ONLY'}
                  onChange={(e) => setMode(e.target.value as 'LINK_ONLY' | 'AUTO_FILL')}
                  className="h-4 w-4"
                />
                <label htmlFor="link-only" className="text-sm font-medium leading-none cursor-pointer">
                  Link Only (Create docket items only)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="auto-fill"
                  name="import-mode"
                  value="AUTO_FILL"
                  checked={mode === 'AUTO_FILL'}
                  onChange={(e) => setMode(e.target.value as 'LINK_ONLY' | 'AUTO_FILL')}
                  className="h-4 w-4"
                />
                <label htmlFor="auto-fill" className="text-sm font-medium leading-none cursor-pointer">
                  Auto-Fill (Link + extract content to fields)
                </label>
              </div>
            </div>
          </div>

          {/* Google Doc URL */}
          <div className="space-y-2">
            <label htmlFor="google-doc-url" className="text-sm font-medium leading-none">
              Google Doc URL (Optional)
              {mode === 'AUTO_FILL' && googleAccessToken && (
                <span className="text-green-600 ml-2">✓ Auto-fetch enabled</span>
              )}
            </label>
            <Input
              id="google-doc-url"
              type="url"
              value={googleDocUrl}
              onChange={(e) => setGoogleDocUrl(e.target.value)}
              placeholder="https://docs.google.com/document/d/..."
            />
            {mode === 'AUTO_FILL' && googleDocUrl && !googleAccessToken && (
              <div className="space-y-2 mt-2">
                <Textarea
                  placeholder="Paste text content here for auto-fill (or connect Google above to auto-fetch)..."
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-slate-500">
                  💡 Tip: Connect Google account above to automatically fetch content from Google Docs
                </p>
              </div>
            )}
            {mode === 'AUTO_FILL' && googleDocUrl && googleAccessToken && (
              <p className="text-xs text-green-600 mt-2">
                ✓ Content will be automatically fetched from Google Docs when you import
              </p>
            )}
          </div>

          {/* Google Sheet URL */}
          <div className="space-y-2">
            <label htmlFor="google-sheet-url" className="text-sm font-medium leading-none">Google Sheet URL (Optional)</label>
            <Input
              id="google-sheet-url"
              type="url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
            />
          </div>

          {/* Google Slides URL */}
          <div className="space-y-2">
            <label htmlFor="google-slide-url" className="text-sm font-medium leading-none">Google Slides URL (Optional)</label>
            <Input
              id="google-slide-url"
              type="url"
              value={googleSlideUrl}
              onChange={(e) => setGoogleSlideUrl(e.target.value)}
              placeholder="https://docs.google.com/presentation/d/..."
            />
          </div>

          {/* Generic Link URL */}
          <div className="space-y-2">
            <label htmlFor="link-url" className="text-sm font-medium leading-none">Web Link URL (Optional)</label>
            <Input
              id="link-url"
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={importMutation.isPending}
          >
            {importMutation.isPending ? 'Importing...' : 'Import'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

