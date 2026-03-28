import React, { useState } from 'react';
import { X, Check, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CommentThreadProps {
  comments: Comment[];
  onClose: () => void;
  onAddComment: (content: string) => void;
  onResolveComment: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  position: { x: number; y: number };
  userRole: 'viewer' | 'commenter' | 'editor';
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  onClose,
  onAddComment,
  onResolveComment,
  onDeleteComment,
  position,
  userRole
}) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || userRole === 'viewer') return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const unresolvedComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <div
      className="absolute z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200"
      style={{
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 400),
        maxHeight: '400px'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span className="font-medium text-sm">
            Comments ({comments.length})
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments List */}
      <div className="max-h-60 overflow-y-auto p-3 space-y-3">
        {/* Unresolved Comments */}
        {unresolvedComments.map((comment) => (
          <div key={comment.id} className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-sm text-gray-900 whitespace-pre-wrap">
                  {comment.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {comment.authorId} • {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
              {userRole !== 'viewer' && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onResolveComment(comment.id)}
                    title="Resolve"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                  {userRole === 'editor' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteComment(comment.id)}
                      title="Delete"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Resolved Comments */}
        {resolvedComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 opacity-60">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-sm text-gray-700 line-through whitespace-pre-wrap">
                  {comment.content}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {comment.authorId} • Resolved • {new Date(comment.updatedAt).toLocaleString()}
                </div>
              </div>
              {userRole === 'editor' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteComment(comment.id)}
                  title="Delete"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-4">
            No comments yet
          </div>
        )}
      </div>

      {/* Add Comment */}
      {userRole !== 'viewer' && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a comment... (Ctrl+Enter to send)"
              className="flex-1 min-h-[60px] text-sm"
              disabled={isSubmitting}
            />
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || isSubmitting}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Press Ctrl+Enter to send
          </div>
        </div>
      )}
    </div>
  );
};