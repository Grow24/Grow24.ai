import { useState, useEffect } from 'react';
import { api, clearSecretToken } from '../services/api';
import type { Question, PreviewResponse } from '../types';
import { QuestionPreview } from './QuestionPreview';
import { QuestionEditor } from './QuestionEditor';
import { CheckIcon, LinkIcon, AlertIcon, RocketIcon, CheckCircleIcon, RefreshIcon, ClipboardIcon } from './Icons';

type Tab = 'review' | 'preview';

interface Props {
  testName: string;
  onBack: () => void;
}

export function AdminPanel({ testName, onBack }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('review');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [driveConnected, setDriveConnected] = useState(false);

  useEffect(() => {
    loadQuestions();
    checkDriveAuth();
  }, [testName]);

  const checkDriveAuth = async () => {
    try {
      const result = await api.checkAuthStatus();
      setDriveConnected(result.authenticated);
    } catch (err) {
      console.error('Failed to check auth status:', err);
    }
  };

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getQuestions(testName);
      setQuestions(result.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getPreview(testName);
      setPreviewData(result);
      setCurrentPreviewIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load preview');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setError(null);
    // Always reload preview when switching to preview tab to get latest images
    if (tab === 'preview') {
      loadPreview();
    }
  };

  const handleImageUploadSuccess = (questionId: string) => {
    // Reload questions to get updated image URLs
    loadQuestions();
    // Also reload preview if we're in preview mode
    if (activeTab === 'preview') {
      loadPreview();
    }
  };

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish this form? This will create a new Google Form.')) {
      return;
    }

    setLoading(true);
    setError(null);
    setPublishResult(null);

    try {
      const result = await api.publish({
        sheetName: testName,
        formTitle: previewData?.assessment.meta.formTitle,
        formDescription: previewData?.assessment.meta.formDescription,
      });
      setPublishResult(result);
      alert('Form published successfully! Check the results below.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish form');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearSecretToken();
    window.location.reload();
  };

  const handleConnectDrive = async () => {
    try {
      const result = await api.getGoogleAuthUrl();
      // Open auth URL in popup
      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const popup = window.open(
        result.authUrl,
        'Connect Google Drive',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Poll for auth completion
      const checkAuth = setInterval(async () => {
        if (popup && popup.closed) {
          clearInterval(checkAuth);
          await checkDriveAuth();
        }
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Drive');
    }
  };

  const handleDisconnectDrive = async () => {
    if (!confirm('Are you sure you want to disconnect Google Drive?')) {
      return;
    }
    try {
      await api.disconnectDrive();
      setDriveConnected(false);
      alert('Google Drive disconnected successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect Drive');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <button onClick={onBack} style={styles.backButton}>
            ← Back to Dashboard
          </button>
          <div style={styles.testBadge}>
            <ClipboardIcon size={18} color="#0066cc" /> {testName}
          </div>
        </div>
        <div style={styles.headerActions}>
          {driveConnected ? (
            <div style={styles.driveStatus}>
              <span style={styles.connectedBadge}>
                <CheckIcon size={14} color="#155724" /> Drive Connected
              </span>
              <button onClick={handleDisconnectDrive} style={styles.disconnectButton}>
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={handleConnectDrive} style={styles.connectButton}>
              <LinkIcon size={16} color="white" /> Connect Google Drive
            </button>
          )}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.tabs}>
        <button
          onClick={() => handleTabChange('review')}
          style={{
            ...styles.tab,
            ...(activeTab === 'review' ? styles.activeTab : {}),
          }}
        >
          1. Review & Upload Images
        </button>
        <button
          onClick={() => handleTabChange('preview')}
          style={{
            ...styles.tab,
            ...(activeTab === 'preview' ? styles.activeTab : {}),
          }}
        >
          2. Preview & Publish
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && <div style={styles.loading}>Loading...</div>}

      {activeTab === 'review' && !loading && (
        <div style={styles.reviewPanel}>
          <div style={styles.panelHeader}>
            <h2>Questions ({questions.length})</h2>
            <button onClick={loadQuestions} style={styles.refreshButton}>
              <RefreshIcon size={14} color="white" /> Refresh
            </button>
          </div>

          <div style={styles.infoBox}>
            <strong>💡 Pro Tip:</strong> Click on question text to edit it inline. Select constraints from the dropdown. Upload images for questions and options.
          </div>

          {questions.map((q) => (
            <QuestionEditor
              key={q.id}
              question={q}
              sheetName={testName}
              onUpdate={() => handleImageUploadSuccess(q.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'preview' && !loading && previewData && (
        <div style={styles.previewPanel}>
          <div style={styles.previewHeader}>
            <h2>Preview - Exam View</h2>
            <div style={styles.stats}>
              <div>Questions: {previewData.stats.totalQuestions}</div>
              <div>Sections: {previewData.stats.totalSections}</div>
              <div>With Images: {previewData.stats.questionsWithImages}</div>
            </div>
          </div>

          {previewData.errors.length > 0 && (
            <div style={styles.errorsPanel}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertIcon size={18} color="#856404" />
                <strong>Validation Errors:</strong>
              </div>
              <ul>
                {previewData.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={styles.previewControls}>
            <button
              onClick={() => setCurrentPreviewIndex(Math.max(0, currentPreviewIndex - 1))}
              disabled={currentPreviewIndex === 0}
              style={styles.navButton}
            >
              ← Previous
            </button>
            <span>
              Question {currentPreviewIndex + 1} / {previewData.assessment.questions.length}
            </span>
            <button
              onClick={() => setCurrentPreviewIndex(Math.min(previewData.assessment.questions.length - 1, currentPreviewIndex + 1))}
              disabled={currentPreviewIndex === previewData.assessment.questions.length - 1}
              style={styles.navButton}
            >
              Next →
            </button>
          </div>

          <QuestionPreview
            question={previewData.assessment.questions[currentPreviewIndex]}
            index={currentPreviewIndex}
          />

          <div style={styles.publishSection}>
            <button onClick={handlePublish} style={styles.publishButton} disabled={previewData.errors.length > 0 || loading}>
              <RocketIcon size={18} color="white" /> Publish / Make Live
            </button>
            <p style={styles.publishNote}>
              This will create a new version of the Google Form and save URLs to your sheet.
            </p>
          </div>

          {publishResult && (
            <div style={styles.publishResult}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircleIcon size={24} color="#155724" /> Form Published!
              </h3>
              <p><strong>Version:</strong> {publishResult.version}</p>
              <p><strong>Form ID:</strong> {publishResult.formId}</p>
              <p>
                <strong>Published URL:</strong>{' '}
                <a href={publishResult.publishedUrl} target="_blank" rel="noopener noreferrer">
                  {publishResult.publishedUrl}
                </a>
              </p>
              <p>
                <strong>Edit URL:</strong>{' '}
                <a href={publishResult.editUrl} target="_blank" rel="noopener noreferrer">
                  {publishResult.editUrl}
                </a>
              </p>
              {publishResult.message && (
                <p style={styles.stubMessage}>{publishResult.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '20px 60px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #ddd',
  },
  backButton: {
    padding: '8px 16px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '12px',
    transition: 'background-color 0.2s',
  },
  title: {
    margin: '8px 0 0 0',
    fontSize: '28px',
    color: '#333',
  },
  testBadge: {
    marginTop: '8px',
    padding: '8px 16px',
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  driveStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  connectedBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    fontSize: '13px',
    fontWeight: '600',
  },
  connectButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  disconnectButton: {
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    borderBottom: '1px solid #ddd',
  },
  tab: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#666',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#007bff',
    borderBottomColor: '#007bff',
    fontWeight: '600',
  },
  error: {
    padding: '12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '16px',
    color: '#666',
  },
  reviewPanel: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
  },
  infoBox: {
    padding: '12px 16px',
    backgroundColor: '#e7f3ff',
    borderRadius: '6px',
    marginBottom: '20px',
    fontSize: '13px',
    color: '#0066cc',
    border: '1px solid #b3d9ff',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  refreshButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewPanel: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    fontSize: '14px',
    color: '#666',
  },
  errorsPanel: {
    padding: '12px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '4px',
    marginBottom: '16px',
  },
  previewControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  navButton: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  publishSection: {
    marginTop: '32px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  },
  publishButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    padding: '12px 32px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
  },
  publishNote: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#666',
  },
  publishResult: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#d4edda',
    borderRadius: '8px',
    color: '#155724',
  },
  stubMessage: {
    marginTop: '12px',
    padding: '8px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderRadius: '4px',
    fontSize: '13px',
  },
};

