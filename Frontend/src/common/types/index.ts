/**
 * Common types and interfaces for the Scientific Research Portal.
 */

export type UserRole = 'admin' | 'supervisor' | 'jury' | 'student';

export interface User {
  id: string;
  institutional_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  name?: string;
  role: UserRole;
  initials?: string;
  status?: 'Active' | 'Inactive';
  last_login?: string;
  is_active?: boolean;
}

export interface Session extends User {}

export interface Document {
  id: number;
  title: string;
  student_name: string;
  version: number;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
  comment: string;
  size: string;
  target: 'supervisor' | 'jury';
}

export interface Message {
  id: number;
  sender: UserRole | string;
  text: string;
  time: string;
  read_by_student: boolean;
  read_by_jury: boolean;
}

export interface Defense {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: number;
  room: string;
  notes: string;
}

export interface Notification {
  id: number;
  type: 'approved' | 'rejected' | 'grade' | 'defense' | 'message';
  text: string;
  read?: boolean;
  timestamp?: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  start_date: string;
  end_date: string;
  student_id?: number;
  supervisor_id?: number;
}

export interface Evaluation {
  id: number;
  project_id: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  comments: string;
  evaluator_id?: number;
}

export interface Scores {
  [key: string]: number | null;
}
