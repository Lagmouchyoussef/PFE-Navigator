export type UserRole = 'admin' | 'supervisor' | 'jury' | 'student';

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}

export interface User {
  id: string | number;
  username?: string;
  institutionalId?: string;
  email: string;
  name: string;
  role: UserRole;
  initials?: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
  phone_number?: string;
  first_name?: string;
  last_name?: string;
  supervisor?: { name: string; department?: string };
}

export interface Session extends User {}

export interface Document {
  id: number;
  title: string;
  studentName: string;
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
  readByStudent: boolean;
  readByJury: boolean;
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
  type: 'approved' | 'rejected' | 'grade' | 'defense' | 'message' | string;
  title?: string;
  message?: string;
  text?: string;
  date?: string;
  created_at?: string;
  read?: boolean;
  is_read?: boolean;
  link?: string;
}

export interface Scores {
  rapport: number | null;
  presentation: number | null;
  technique: number | null;
  innovation: number | null;
  delais: number | null;
  pfeSupervisor: number | null;
  pfeJury: number | null;
}

export interface Milestone {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  date: string;
}

export interface Appointment {
  id: number;
  title: string;
  studentName: string;
  date: string;
  time: string;
  location: string;
  type: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled' | 'Rescheduled';
  reminderSent?: boolean;
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
  supervisor_score?: number | null;
  jury_score?: number | null;
  supervisor_weight?: number;
  jury_weight?: number;
  comments?: string;
  is_published?: boolean;
  evaluator_id?: number;
}
