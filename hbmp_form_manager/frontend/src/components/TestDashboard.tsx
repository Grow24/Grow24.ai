import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BookIcon, ClipboardIcon, PlusIcon, RefreshIcon, AlertIcon } from './Icons';

interface Test {
  sheetId: number;
  title: string;
  questionCount: number;
  rowCount: number;
  columnCount: number;
}

interface Props {
  onSelectTest: (testName: string) => void;
}

export function TestDashboard({ onSelectTest }: Props) {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getTests();
      setTests(result.tests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            <BookIcon size={32} color="#007bff" /> HBMP Survey Manager
          </h1>
          <p style={styles.subtitle}>Manage your assessments and question banks</p>
        </div>
        <button onClick={loadTests} style={styles.refreshButton}>
          <RefreshIcon size={16} color="#666" /> Refresh
        </button>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      {loading && <div style={styles.loading}>Loading tests...</div>}

      {!loading && tests.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <ClipboardIcon size={64} color="#ccc" />
          </div>
          <h2>No tests found</h2>
          <p>Create a new sheet tab in your Google Spreadsheet to add a test.</p>
          <p style={styles.hint}>
            <AlertIcon size={16} color="#0066cc" /> Each sheet tab (except RespondentDetails, FormMeta) will appear as a test here.
          </p>
        </div>
      )}

      {!loading && tests.length > 0 && (
        <div style={styles.grid}>
          {tests.map((test) => (
            <div
              key={test.sheetId}
              style={styles.card}
              onClick={() => onSelectTest(test.title)}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIcon}>
                  <ClipboardIcon size={32} color="#007bff" />
                </div>
                <h3 style={styles.cardTitle}>{test.title}</h3>
              </div>
              
              <div style={styles.cardStats}>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>{test.questionCount}</span>
                  <span style={styles.statLabel}>Questions</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statNumber}>{test.rowCount}</span>
                  <span style={styles.statLabel}>Rows</span>
                </div>
              </div>

              <div style={styles.cardFooter}>
                <span style={styles.cardLink}>Open Test →</span>
              </div>
            </div>
          ))}

          {/* Add New Test Card */}
          <div style={styles.addCard}>
            <div style={styles.addIcon}>
              <PlusIcon size={48} color="#999" />
            </div>
            <h3 style={styles.addTitle}>Add New Test</h3>
            <p style={styles.addText}>
              Create a new tab in your Google Sheet to add another test
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '40px 60px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  subtitle: {
    margin: '8px 0 0 0',
    fontSize: '16px',
    color: '#666',
  },
  refreshButton: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  error: {
    padding: '16px',
    backgroundColor: '#fee',
    color: '#c00',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '18px',
    color: '#666',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    color: '#666',
  },
  emptyIcon: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  hint: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#e7f3ff',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#0066cc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      borderColor: '#007bff',
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  cardIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardStats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#007bff',
  },
  statLabel: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cardLink: {
    fontSize: '14px',
    color: '#007bff',
    fontWeight: '600',
  },
  addCard: {
    backgroundColor: '#f8f9fa',
    border: '2px dashed #ccc',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
  },
  addIcon: {
    marginBottom: '16px',
    opacity: 0.5,
    display: 'flex',
    justifyContent: 'center',
  },
  addTitle: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    color: '#666',
  },
  addText: {
    margin: 0,
    fontSize: '14px',
    color: '#999',
    maxWidth: '250px',
  },
};

