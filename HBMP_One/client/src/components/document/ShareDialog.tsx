import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { useToast } from '@/components/ui/use-toast';
import { shareApi, FileShare } from '@/api/share.api';
import { Copy, Check, Trash2 } from 'lucide-react';

interface ShareDialogProps {
  fileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
}

export default function ShareDialog({ fileId, open, onOpenChange, projectId }: ShareDialogProps) {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [permission, setPermission] = useState<'EDITOR' | 'VIEWER'>('EDITOR');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing shares
  const { data: sharesData, refetch } = useQuery({
    queryKey: ['file-shares', fileId],
    queryFn: () => shareApi.getShares(fileId),
    enabled: open,
  });

  // Create share mutation
  const createShareMutation = useMutation({
    mutationFn: () => shareApi.createShare(fileId, permission),
    onSuccess: (data) => {
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/projects/${projectId || ':projectId'}/office/${fileId}?share=${data.shareToken}`;
      setShareUrl(fullUrl);
      refetch();
      toast({
        title: 'Share link created',
        description: 'Copy the link to share with others',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create share',
        description: error.response?.data?.error?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Revoke share mutation
  const revokeShareMutation = useMutation({
    mutationFn: (shareToken: string) => shareApi.revokeShare(fileId, shareToken),
    onSuccess: () => {
      refetch();
      toast({
        title: 'Share revoked',
        description: 'The share link has been revoked',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to revoke share',
        description: error.response?.data?.error?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  const handleCopyLink = async () => {
    if (!shareUrl) {
      // Create share if none exists
      createShareMutation.mutate();
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: 'Link copied',
        description: 'Share link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the link manually',
        variant: 'destructive',
      });
    }
  };

  const handleCreateShare = () => {
    createShareMutation.mutate();
  };

  const handleRevokeShare = (shareToken: string) => {
    revokeShareMutation.mutate(shareToken);
  };

  // Set share URL from existing shares when dialog opens
  useEffect(() => {
    if (open && sharesData?.shares && sharesData.shares.length > 0) {
      const firstShare = sharesData.shares[0];
      const baseUrl = window.location.origin;
      const fullUrl = `${baseUrl}/projects/${projectId || ':projectId'}/office/${fileId}?share=${firstShare.shareToken}`;
      setShareUrl(fullUrl);
    } else if (open && (!sharesData?.shares || sharesData.shares.length === 0)) {
      setShareUrl('');
    }
  }, [open, sharesData, fileId, projectId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Spreadsheet</DialogTitle>
          <DialogDescription>
            Create a shareable link that others can use to view or edit this file
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Permission Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Permission</label>
            <select
              value={permission}
              onChange={(e) => setPermission(e.target.value as 'EDITOR' | 'VIEWER')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="EDITOR">Editor - Can view and edit</option>
              <option value="VIEWER">Viewer - Can view only</option>
            </select>
          </div>

          {/* Share Link */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl || 'Click "Create Link" to generate a shareable link'}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={shareUrl ? handleCopyLink : handleCreateShare}
                disabled={createShareMutation.isPending}
              >
                {shareUrl ? (
                  copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </>
                  )
                ) : (
                  'Create Link'
                )}
              </Button>
            </div>
          </div>

          {/* Existing Shares */}
          {sharesData?.shares && sharesData.shares.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Active Shares</label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                {sharesData.shares.map((share: FileShare) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium capitalize">{share.permission.toLowerCase()}</div>
                      <div className="text-xs text-gray-500">
                        Created {formatDate(share.createdAt)}
                        {share.expiresAt && ` • Expires ${formatDate(share.expiresAt)}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeShare(share.shareToken)}
                      disabled={revokeShareMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

