import { useState, useEffect } from 'react';
import { Document } from '@/api/documents.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { cn } from '@/lib/utils';
import { getFieldHint, isFieldEmpty } from '@/utils/uc1Hints';
import MiniDocketPanel from './MiniDocketPanel';

interface SectionContentProps {
  document: Document;
  activeSectionId?: string | null;
  onSectionChange?: (sectionId: string) => void;
  onSave: (fieldValues: Array<{ fieldValueId: string; value: string }>) => void;
}

export default function SectionContent({ document, activeSectionId, onSectionChange, onSave }: SectionContentProps) {
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    document.template.sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.fieldValueId) {
          values[field.fieldValueId] = field.value;
        }
      });
    });
    return values;
  });

  // Set first section as active by default
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(
    activeSectionId || document.template.sections[0]?.id || null
  );

  useEffect(() => {
    if (activeSectionId) {
      setCurrentSectionId(activeSectionId);
    }
  }, [activeSectionId]);

  const currentSection = document.template.sections.find((s) => s.id === currentSectionId);
  const currentIndex = document.template.sections.findIndex((s) => s.id === currentSectionId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < document.template.sections.length - 1;

  const goToPrevious = () => {
    if (hasPrevious) {
      const prevSection = document.template.sections[currentIndex - 1];
      setCurrentSectionId(prevSection.id);
      onSectionChange?.(prevSection.id);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      const nextSection = document.template.sections[currentIndex + 1];
      setCurrentSectionId(nextSection.id);
      onSectionChange?.(nextSection.id);
    }
  };

  const handleFieldChange = (fieldValueId: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldValueId]: value }));
  };

  const handleSave = () => {
    const updates = Object.entries(fieldValues).map(([fieldValueId, value]) => ({
      fieldValueId,
      value,
    }));
    onSave(updates);
  };

  if (!currentSection) {
    return <div className="p-6">Section not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Navigation Stepper - Compact and improved */}
      <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-3 shadow-sm">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          disabled={!hasPrevious}
          className={cn(
            "h-8 px-3 text-sm",
            !hasPrevious && "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
          )}
        >
          <ChevronLeft className="mr-1.5 h-3.5 w-3.5" />
          Previous
        </Button>
        <div className="text-sm text-gray-600 font-medium">
          Section {currentIndex + 1} of {document.template.sections.length}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={!hasNext}
          className={cn(
            "h-8 px-3 text-sm",
            !hasNext && "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
          )}
        >
          Next
          <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Current Section Content */}
      <Card key={currentSection.id} id={`section-${currentSection.id}`}>
        <CardHeader className="pb-4 pt-6">
          <CardTitle className="text-2xl font-bold text-foreground mb-2">
            {currentSection.order}. {currentSection.title}
          </CardTitle>
          {currentSection.description && (
            <CardDescription className="text-sm text-muted-foreground/80">
              {currentSection.description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6 pt-2 pb-6">
          {currentSection.fields.map((field) => {
            const fieldValue = fieldValues[field.fieldValueId || ''] || field.value || '';
            const isEmpty = isFieldEmpty(fieldValue);
            const hint = isEmpty ? getFieldHint(document.template.code, field.label, field.id) : null;

            if (field.dataType === 'RICH_TEXT') {
              // Use RichTextEditor for all RICH_TEXT fields
              return (
                <div key={field.id} className="space-y-2">
                  <label className="text-base font-semibold text-foreground">
                    {field.label}
                    {field.mandatory && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {field.helpText && (
                    <p className="text-xs text-muted-foreground/70">{field.helpText}</p>
                  )}
                  {hint && (
                    <p className="text-xs text-primary/70 italic bg-primary/5 border-l-2 border-primary/30 pl-3 py-1.5 rounded-r">
                      💡 Example: {hint}
                    </p>
                  )}
                  <RichTextEditor
                    value={fieldValue}
                    onChange={(value) => {
                      if (field.fieldValueId) {
                        handleFieldChange(field.fieldValueId, value);
                      }
                    }}
                  />
                </div>
              );
            }
            return (
              <div key={field.id} className="space-y-2">
                <label className="text-base font-semibold text-foreground">
                  {field.label}
                  {field.mandatory && <span className="text-destructive ml-1">*</span>}
                </label>
                {field.helpText && (
                  <p className="text-xs text-muted-foreground/70">{field.helpText}</p>
                )}
                {hint && (
                  <p className="text-xs text-primary/70 italic bg-primary/5 border-l-2 border-primary/30 pl-3 py-1.5 rounded-r">
                    💡 Example: {hint}
                  </p>
                )}
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={fieldValue}
                  onChange={(e) => {
                    if (field.fieldValueId) {
                      handleFieldChange(field.fieldValueId, e.target.value);
                    }
                  }}
                  placeholder={hint || ''}
                  rows={4}
                />
              </div>
            );
          })}

          {/* Mini-Docket Panel - Available for all sections */}
          <div className="mt-6">
            <MiniDocketPanel
              documentId={document.id}
              sectionId={currentSection.id}
              sectionTitle={currentSection.title}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button - Sticky without overlap */}
      <div className="sticky bottom-0 pt-6 pb-4 bg-gradient-to-t from-white via-white to-transparent">
        <div className="flex justify-end border-t pt-4">
          <Button 
            onClick={handleSave} 
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}

