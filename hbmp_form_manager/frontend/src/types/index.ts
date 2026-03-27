export interface Question {
  id: string;
  section: string;
  passage?: string; // NEW: Comprehension/DI passage (for VARC/DI/LR questions)
  theme?: string; // Topic/Category (e.g., "Algebra", "Geometry")
  order: number;
  type: 'MCQ' | 'CHECKBOX' | 'TEXT' | 'PARAGRAPH' | 'DROPDOWN' | 'LINEAR_SCALE' | 'DATE' | 'TIME' | 'FILE_UPLOAD';
  text: string;
  required: boolean;
  imageUrl?: string;
  timerSeconds?: number;
  options: Option[];
  constraints?: Record<string, any>;
  goToSectionOnOption?: string;
}

export interface Option {
  text: string;
  imageUrl?: string;
}

export interface Section {
  title: string;
  questions: Question[];
}

export interface Assessment {
  meta: Record<string, string>;
  respondentFields: any[];
  sections: Section[];
  questions: Question[];
}

export interface PreviewResponse {
  ok: boolean;
  assessment: Assessment;
  stats: {
    totalQuestions: number;
    totalSections: number;
    respondentFieldsCount: number;
    questionsByType: Record<string, number>;
    questionsBySection: Record<string, number>;
    questionsWithImages: number;
    optionsWithImages: number;
  };
  errors: string[];
}

export interface UploadImageRequest {
  questionId: string;
  targetType: 'QUESTION' | 'OPTION';
  optionIndex?: number;
  fileName: string;
  mimeType: string;
  base64Data: string;
  sheetName?: string;
}

export interface PublishResponse {
  ok: boolean;
  formId: string;
  editUrl: string;
  publishedUrl: string;
  version: string;
  createdAt: string;
  message?: string;
}


