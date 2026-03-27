import { useState } from 'react';
import { api } from '../services/api';
import { CheckIcon, UploadIcon, ImageIcon } from './Icons';

interface Props {
  questionId: string;
  targetType: 'QUESTION' | 'OPTION';
  optionIndex?: number;
  currentImageUrl?: string;
  onUploadSuccess: (imageUrl: string) => void;
  label: string;
  sheetName?: string;
}

export function ImageUploader({ questionId, targetType, optionIndex, currentImageUrl, onUploadSuccess, label, sheetName }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;

        try {
          const result = await api.uploadImage({
            questionId,
            targetType,
            optionIndex,
            fileName: file.name,
            mimeType: file.type,
            base64Data,
            sheetName,
          });

          onUploadSuccess(result.imageUrl);
          setUploading(false);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed');
          setUploading(false);
        }
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }

    // Reset input
    e.target.value = '';
  };

  return (
    <div style={styles.container}>
      <label style={styles.button}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {uploading ? (
            'Uploading...'
          ) : currentImageUrl ? (
            <>
              <ImageIcon size={14} color="white" /> Change Image
            </>
          ) : (
            <>
              <UploadIcon size={14} color="white" /> {label}
            </>
          )}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={styles.fileInput}
        />
      </label>

      {currentImageUrl && (
        <span style={styles.status}>
          <CheckIcon size={16} color="#4CAF50" />
        </span>
      )}

      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  button: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  fileInput: {
    display: 'none',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: '12px',
  },
};


