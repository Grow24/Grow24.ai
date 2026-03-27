import { useEffect, useRef } from 'react';
import katex from 'katex';
import type { Question } from '../types';

interface Props {
  question: Question;
  index: number;
}

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

// Component for rendering block LaTeX
function BlockMath({ math }: { math: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(math, ref.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (e) {
        console.error('KaTeX block render error:', e);
        if (ref.current) ref.current.textContent = `$$${math}$$`;
      }
    }
  }, [math]);

  return <div ref={ref} />;
}

// Helper to detect and render LaTeX in text
function renderTextWithLatex(text: string) {
  if (!text) return null;

  // Match $...$ for inline and $$...$$ for block
  // This regex matches: $$...$$ (block) or $...$ (inline)
  const parts = text.split(/(\$\$[^\$]+?\$\$|\$[^\$]+?\$)/g);

  return parts.map((part, i) => {
    if (!part) return null;

    if (part.startsWith('$$') && part.endsWith('$$')) {
      // Block math
      const latex = part.slice(2, -2).trim();
      if (!latex) return null;
      return <BlockMath key={i} math={latex} />;
    } else if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
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

export function QuestionPreview({ question, index }: Props) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span style={styles.number}>Question {index + 1}</span>
        {question.required && <span style={styles.required}>*</span>}
        {question.timerSeconds > 0 && (
          <span style={styles.timer}>⏱ {question.timerSeconds}s</span>
        )}
      </div>

      <div style={styles.questionText}>
        {renderTextWithLatex(question.text)}
      </div>

      {question.imageUrl && (
        <div style={styles.imageContainer}>
          <img
            src={question.imageUrl}
            alt="Question"
            style={styles.image}
            onError={(e) => {
              console.error('Failed to load image:', question.imageUrl);
              e.currentTarget.style.border = '2px solid red';
              e.currentTarget.alt = 'Failed to load image. URL: ' + question.imageUrl;
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully:', question.imageUrl);
            }}
          />
        </div>
      )}

      {question.options.length > 0 && (
        <div style={styles.optionsContainer}>
          {question.options.map((option, i) => (
            <div key={i} style={styles.option}>
              <input
                type={question.type === 'CHECKBOX' ? 'checkbox' : 'radio'}
                name={`q-${question.id}`}
                id={`q-${question.id}-opt-${i}`}
                disabled
                style={styles.input}
              />
              <label htmlFor={`q-${question.id}-opt-${i}`} style={styles.optionLabel}>
                {renderTextWithLatex(option.text)}
              </label>
              {option.imageUrl && (
                <div style={styles.optionImageContainer}>
                  <img
                    src={option.imageUrl}
                    alt={`Option ${i + 1}`}
                    style={styles.optionImage}
                    onError={(e) => {
                      console.error('Failed to load option image:', option.imageUrl);
                      e.currentTarget.style.border = '2px solid red';
                    }}
                    onLoad={() => {
                      console.log('✅ Option image loaded:', option.imageUrl);
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {['TEXT', 'PARAGRAPH'].includes(question.type) && (
        <div style={styles.inputContainer}>
          {question.type === 'TEXT' ? (
            <input type="text" style={styles.textInput} disabled placeholder="Your answer..." />
          ) : (
            <textarea style={styles.textArea} disabled placeholder="Your answer..." rows={4} />
          )}
        </div>
      )}

      <div style={styles.metadata}>
        {question.section && (
          <div style={styles.section}>Section: {question.section}</div>
        )}
        {question.theme && (
          <div style={styles.theme}>Theme: {question.theme}</div>
        )}
      </div>

      {question.passage && (
        <div style={styles.passage}>
          <div style={styles.passageLabel}>📖 Passage:</div>
          <div style={styles.passageContent}>{question.passage}</div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    backgroundColor: '#fff',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },
  number: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
  },
  required: {
    color: 'red',
    fontSize: '18px',
  },
  timer: {
    marginLeft: 'auto',
    backgroundColor: '#fff3cd',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#856404',
  },
  questionText: {
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '16px',
    color: '#222',
  },
  imageContainer: {
    marginBottom: '16px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  input: {
    marginTop: '4px',
    cursor: 'not-allowed',
  },
  optionLabel: {
    flex: 1,
    fontSize: '14px',
    cursor: 'not-allowed',
    lineHeight: '1.5',
  },
  optionImageContainer: {
    marginTop: '8px',
    marginLeft: '28px',
  },
  optionImage: {
    maxWidth: '200px',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  inputContainer: {
    marginTop: '16px',
  },
  textInput: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  textArea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  metadata: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  section: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic',
  },
  theme: {
    fontSize: '13px',
    color: '#28a745',
    fontWeight: '600',
    padding: '4px 8px',
    backgroundColor: '#d4edda',
    borderRadius: '4px',
  },
  passage: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderLeft: '4px solid #007bff',
    borderRadius: '4px',
  },
  passageLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#007bff',
    marginBottom: '8px',
  },
  passageContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
};


