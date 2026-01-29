
export interface ReportFormData {
  title: string;
  subject: string;
  institution: string;
  author: string;
  wordCount: number;
  academicLevel: 'School' | 'UG' | 'PG' | 'Research';
  reportType: string;
  customInstructions: string;
}

export interface GeneratedReport {
  abstract: string;
  introduction: string;
  mainBody: string;
  conclusion: string;
  references: string;
  fullReport: string;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  isEditable: boolean;
}

export const REPORT_TYPES = [
  'Lab Report',
  'Field Report',
  'Research Summary',
  'Case Study',
  'Assignment Report',
  'Others'
];

export const ACADEMIC_LEVELS = [
  'School',
  'UG',
  'PG',
  'Research'
] as const;
