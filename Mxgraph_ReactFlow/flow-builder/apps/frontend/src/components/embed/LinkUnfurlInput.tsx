import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface LinkUnfurlInputProps {
  onSubmit: (url: string) => void;
  onCancel: () => void;
}

export const LinkUnfurlInput: React.FC<LinkUnfurlInputProps> = ({ onSubmit, onCancel }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(url.trim());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border rounded p-4 space-y-3">
      <Input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to unfurl..."
        required
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Link'}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};