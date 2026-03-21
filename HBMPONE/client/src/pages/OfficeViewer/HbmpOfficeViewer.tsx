import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';

interface OfficeConfig {
  wopiSrc: string;
  accessToken: string;
  fileId: string;
  ext: string;
}

/**
 * HbmpOfficeViewer - Collabora Online Editor Integration
 * 
 * Uses the official WOPI protocol with POST form submission (per Collabora docs)
 * This approach handles HTTP/HTTPS WebSocket protocol detection properly.
 * 
 * Flow:
 * 1. Fetch WOPI configuration from HBMP server
 * 2. Get Collabora action URL from discovery
 * 3. Submit POST form with WOPISrc and access_token
 * 4. Collabora loads in iframe and makes WOPI requests back to HBMP server
 */
export default function HbmpOfficeViewer() {
  const { projectId, fileId } = useParams<{ projectId: string; fileId: string }>();
  
  const [config, setConfig] = useState<OfficeConfig | null>(null);
  const [collaboraUrl, setCollaboraUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCollabora = async () => {
      try {
        setLoading(true);
        
        // Detect file type from fileId prefix
        const ext = fileId?.startsWith('slide_') ? 'pptx' : 'xlsx';
        
        // Get WOPI config
        const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/$/, '')
        const response = await fetch(`${apiBase}/office/open/${fileId}?ext=${ext}`)
        
        if (!response.ok) {
          throw new Error('Failed to get office configuration');
        }
        
        const data = await response.json();
        setConfig(data);
        
        // Build Collabora action URL with WOPISrc as query parameter
        const encodedWopiSrc = encodeURIComponent(data.wopiSrc);
        const actionUrl = `http://localhost:9980/browser/dist/cool.html?WOPISrc=${encodedWopiSrc}&access_token=${data.accessToken}`;
        setCollaboraUrl(actionUrl);
        
        setLoading(false);
        
      } catch (err) {
        console.error('Error loading office viewer:', err);
        setError(err instanceof Error ? err.message : 'Failed to load editor');
        setLoading(false);
      }
    };

    if (fileId) {
      initCollabora();
    }
  }, [fileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading Collabora Editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-600 mb-4">
            <svg
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Editor
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to={`/projects/${projectId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Minimal Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center space-x-4">
          <Link
            to={`/projects/${projectId}`}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="text-sm font-medium text-gray-900">
            HBMP Office Editor
          </h1>
        </div>
        
        <div className="text-xs text-gray-500">
          File: {config?.fileId}.{config?.ext}
        </div>
      </div>

      {/* Collabora iframe - loads editor with WOPISrc in URL */}
      <div className="flex-1 relative">
        {collaboraUrl && (
          <iframe
            src={collaboraUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="Collabora Office"
            allow="clipboard-read; clipboard-write"
          />
        )}
      </div>
    </div>
  );
}
