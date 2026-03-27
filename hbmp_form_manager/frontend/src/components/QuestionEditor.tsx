import { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import type { Question } from '../types';
import { api } from '../services/api';
import { ImageUploader } from './ImageUploader';

interface Props {
  question: Question;
  sheetName: string;
  onUpdate: () => void;
}

// Google Forms question types
const QUESTION_TYPES = [
  { value: 'TEXT', label: 'Short Answer' },
  { value: 'PARAGRAPH', label: 'Paragraph' },
  { value: 'MCQ', label: 'Multiple Choice' },
  { value: 'CHECKBOX', label: 'Checkboxes' },
  { value: 'DROPDOWN', label: 'Dropdown' },
  { value: 'LINEAR_SCALE', label: 'Linear Scale' },
  { value: 'DATE', label: 'Date' },
  { value: 'TIME', label: 'Time' },
  { value: 'FILE_UPLOAD', label: 'File Upload' },
];

// Common constraint templates
const CONSTRAINT_TEMPLATES = {
  TEXT: [
    { label: 'No constraints', value: null },
    { label: 'Email address', value: { type: 'email' } },
    { label: 'URL', value: { type: 'url' } },
    { label: 'Number only', value: { type: 'number' } },
    { label: 'Min length (10)', value: { type: 'minLength', value: 10 } },
    { label: 'Max length (100)', value: { type: 'maxLength', value: 100 } },
    { label: 'Regex pattern', value: { type: 'regex', pattern: '^[A-Za-z]+$' } },
  ],
  MCQ: [
    { label: 'No constraints', value: null },
    { label: 'Required', value: { type: 'required' } },
  ],
  CHECKBOX: [
    { label: 'No constraints', value: null },
    { label: 'Min selections (1)', value: { type: 'minSelections', value: 1 } },
    { label: 'Max selections (3)', value: { type: 'maxSelections', value: 3 } },
    { label: 'Exact selections (2)', value: { type: 'exactSelections', value: 2 } },
  ],
};

// Component for rendering inline LaTeX
function InlineMath({ math }: { math: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          throwOnError: false,
          displayMode: false,
        });
      } catch (e) {
        console.error('KaTeX inline render error:', e);
        if (ref.current) ref.current.textContent = `$${math}$`;
      }
    }
  }, [math]);

  return <span ref={ref} />;
}

// Helper to detect and render LaTeX in text
function renderTextWithLatex(text: string) {
  if (!text) return null;

  // Match $...$ for inline math
  const parts = text.split(/(\$[^\$]+?\$)/g);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      // Inline math
      const latex = part.slice(1, -1).trim();
      if (!latex) return null;
      return <InlineMath key={i} math={latex} />;
    } else {
      // Plain text
      return <span key={i}>{part}</span>;
    }
  }).filter(Boolean);
}

export function QuestionEditor({ question, sheetName, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(question.text);
  const [editedOptions, setEditedOptions] = useState(question.options.map(opt => opt.text));
  const [editedType, setEditedType] = useState(question.type);
  const [selectedConstraint, setSelectedConstraint] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync local state when question prop changes
  useEffect(() => {
    setEditedText(question.text);
    setEditedOptions(question.options.map(opt => opt.text));
    setEditedType(question.type);
  }, [question]);

  const constraintOptions = CONSTRAINT_TEMPLATES[question.type as keyof typeof CONSTRAINT_TEMPLATES] || [];

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('Saving question:', question.id, { text: editedText, options: editedOptions, type: editedType });
      const result = await api.updateQuestion(question.id, {
        text: editedText,
        options: editedOptions,
        type: editedType,
        sheetName,
      });
      console.log('Save result:', result);
      setIsEditing(false);
      // Wait a bit for Google Sheets to update, then reload
      setTimeout(() => {
        onUpdate();
      }, 500);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleTypeChange = async (newType: string) => {
    setSaving(true);
    setError(null);
    try {
      await api.updateQuestion(question.id, {
        type: newType,
        sheetName,
      });
      setEditedType(newType);
      // Wait a bit for Google Sheets to update, then reload
      setTimeout(() => {
        onUpdate();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update question type');
    } finally {
      setSaving(false);
    }
  };

  const handleConstraintChange = async (templateIndex: number) => {
    const template = constraintOptions[templateIndex];
    if (!template) return;

    setSaving(true);
    setError(null);
    try {
      await api.updateQuestion(question.id, {
        constraints: template.value,
        sheetName,
      });
      setSelectedConstraint(templateIndex.toString());
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update constraints');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedText(question.text);
    setEditedOptions(question.options.map(opt => opt.text));
    setIsEditing(false);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <strong style={styles.questionId}>{question.id}</strong>
        <span style={styles.badge}>{question.section || 'No Section'}</span>
        {question.theme && <span style={styles.themeBadge}>{question.theme}</span>}
        <div style={styles.typeSelector}>
          <label style={styles.typeLabel}>Type:</label>
          <select
            value={editedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            style={styles.typeSelect}
            disabled={saving}
          >
            {QUESTION_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Passage Display (for DI/VARC questions) */}
      {question.passage && (
        <div style={styles.passage}>
          <div style={styles.passageLabel}>📖 Passage:</div>
          <div style={styles.passageContent}>{question.passage}</div>
        </div>
      )}

      {/* Question Text Editor */}
      {isEditing ? (
        <div style={styles.editSection}>
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            style={styles.textarea}
            rows={3}
            placeholder="Question text..."
          />
        </div>
      ) : (
        <div style={styles.questionText} onClick={() => setIsEditing(true)}>
          {renderTextWithLatex(question.text)}
          <span style={styles.editHint}>(click to edit)</span>
        </div>
      )}

      {/* Options Editor */}
      {['MCQ', 'CHECKBOX', 'DROPDOWN'].includes(question.type) && (
        <div style={styles.optionsContainer}>
          <strong style={styles.optionsLabel}>Options:</strong>
          {isEditing ? (
            <div style={styles.optionsList}>
              {editedOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...editedOptions];
                    newOptions[i] = e.target.value;
                    setEditedOptions(newOptions);
                  }}
                  style={styles.optionInput}
                  placeholder={`Option ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <div style={styles.optionsList}>
              {question.options.map((opt, i) => (
                <div key={i} style={styles.optionDisplay}>• {renderTextWithLatex(opt.text)}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Constraints Selector */}
      {constraintOptions.length > 0 && (
        <div style={styles.constraintsSection}>
          <label style={styles.constraintLabel}>
            <strong>Validation/Constraints:</strong>
            <select
              value={selectedConstraint}
              onChange={(e) => handleConstraintChange(Number(e.target.value))}
              style={styles.select}
              disabled={saving}
            >
              <option value="">Select constraint...</option>
              {constraintOptions.map((opt, i) => (
                <option key={i} value={i}>{opt.label}</option>
              ))}
            </select>
          </label>
          {question.constraints && (
            <div style={styles.currentConstraint}>
              Current: {JSON.stringify(question.constraints)}
            </div>
          )}
        </div>
      )}

      {/* Image Uploaders */}
      <div style={styles.imageSection}>
        <ImageUploader
          questionId={question.id}
          targetType="QUESTION"
          currentImageUrl={question.imageUrl}
          onUploadSuccess={onUpdate}
          label="Upload Question Image"
          sheetName={sheetName}
        />
        {question.options.length > 0 && (
          <div style={styles.optionImageUploaders}>
            {question.options.map((opt, i) => (
              <ImageUploader
                key={i}
                questionId={question.id}
                targetType="OPTION"
                optionIndex={i}
                currentImageUrl={opt.imageUrl}
                sheetName={sheetName}
                onUploadSuccess={onUpdate}
                label={`Opt ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div style={styles.actions}>
          <button onClick={handleSave} disabled={saving} style={styles.saveButton}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleCancel} disabled={saving} style={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '12px',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #eee',
  },
  questionId: {
    fontSize: '14px',
    color: '#333',
    fontFamily: 'monospace',
  },
  badge: {
    padding: '4px 8px',
    backgroundColor: '#e7f3ff',
    color: '#0066cc',
    borderRadius: '4px',
    fontSize: '12px',
  },
  themeBadge: {
    padding: '4px 8px',
    backgroundColor: '#d4edda',
    color: '#28a745',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
  },
  typeBadge: {
    padding: '4px 8px',
    backgroundColor: '#f0f0f0',
    color: '#666',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 'bold',
  },
  typeSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  typeLabel: {
    fontSize: '12px',
    color: '#666',
    fontWeight: 'bold',
  },
  typeSelect: {
    padding: '4px 8px',
    fontSize: '12px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  error: {
    padding: '8px 12px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
    marginBottom: '12px',
    fontSize: '13px',
  },
  passage: {
    marginBottom: '16px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderLeft: '4px solid #007bff',
    borderRadius: '4px',
  },
  passageLabel: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#007bff',
    marginBottom: '6px',
  },
  passageContent: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  questionText: {
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '12px',
    padding: '8px',
    cursor: 'pointer',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    backgroundColor: '#f8f9fa',
  },
  editHint: {
    marginLeft: '8px',
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
  },
  editSection: {
    marginBottom: '12px',
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  optionsContainer: {
    marginBottom: '12px',
  },
  optionsLabel: {
    display: 'block',
    fontSize: '13px',
    marginBottom: '6px',
    color: '#555',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  optionInput: {
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
  },
  optionDisplay: {
    fontSize: '13px',
    color: '#333',
    padding: '4px 0',
  },
  constraintsSection: {
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  constraintLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#555',
    marginBottom: '6px',
  },
  select: {
    width: '100%',
    padding: '6px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '6px',
  },
  currentConstraint: {
    marginTop: '8px',
    padding: '6px 8px',
    backgroundColor: '#e7f3ff',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#0066cc',
  },
  imageSection: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  optionImageUploaders: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #eee',
  },
  saveButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

