/**
 * Application-wide constants and configuration.
 * 
 * Contains shared constants, labels, and configuration values
 * used across the application.
 */

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  SUPERVISOR: 'supervisor',
  JURY: 'jury',
  STUDENT: 'student',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Notification types
export const NOTIFICATION_TYPES = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
  GRADE: 'grade',
  DEFENSE: 'defense',
  MESSAGE: 'message',
} as const;

// Document statuses
export const DOCUMENT_STATUSES = {
  APPROVED: 'approved',
  PENDING: 'pending',
  REJECTED: 'rejected',
} as const;

// Evaluation scores
export const EVALUATION_SCORES = {
  THESIS_REPORT: 'thesis_report',
  ORAL_PRESENTATION: 'oral_presentation',
  TECHNICAL_MASTERY: 'technical_mastery',
  INNOVATION_RESEARCH: 'innovation_research',
  SCHEDULE_COMPLIANCE: 'schedule_compliance',
  SUPERVISOR_GRADE: 'supervisor_grade',
  JURY_GRADE: 'jury_grade',
} as const;

// Score coefficients for weighted evaluation
export const SCORE_COEFFICIENTS = {
  [EVALUATION_SCORES.THESIS_REPORT]: 3,
  [EVALUATION_SCORES.ORAL_PRESENTATION]: 2,
  [EVALUATION_SCORES.TECHNICAL_MASTERY]: 2,
  [EVALUATION_SCORES.INNOVATION_RESEARCH]: 1,
  [EVALUATION_SCORES.SCHEDULE_COMPLIANCE]: 1,
  [EVALUATION_SCORES.SUPERVISOR_GRADE]: 1,
  [EVALUATION_SCORES.JURY_GRADE]: 1,
} as const;

// Score labels for UI display
export const SCORE_LABELS = {
  [EVALUATION_SCORES.THESIS_REPORT]: 'Thesis Report',
  [EVALUATION_SCORES.ORAL_PRESENTATION]: 'Oral Presentation',
  [EVALUATION_SCORES.TECHNICAL_MASTERY]: 'Technical Mastery',
  [EVALUATION_SCORES.INNOVATION_RESEARCH]: 'Innovation & Research',
  [EVALUATION_SCORES.SCHEDULE_COMPLIANCE]: 'Schedule Compliance',
  [EVALUATION_SCORES.SUPERVISOR_GRADE]: 'Supervisor Grade (50%)',
  [EVALUATION_SCORES.JURY_GRADE]: 'Jury Grade (50%)',
} as const;

// Default scores object
export const INITIAL_SCORES = {
  [EVALUATION_SCORES.THESIS_REPORT]: null,
  [EVALUATION_SCORES.ORAL_PRESENTATION]: null,
  [EVALUATION_SCORES.TECHNICAL_MASTERY]: null,
  [EVALUATION_SCORES.INNOVATION_RESEARCH]: null,
  [EVALUATION_SCORES.SCHEDULE_COMPLIANCE]: null,
  [EVALUATION_SCORES.SUPERVISOR_GRADE]: null,
  [EVALUATION_SCORES.JURY_GRADE]: null,
} as const;
