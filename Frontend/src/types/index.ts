export type UserRole = 'admin' | 'supervisor' | 'jury' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  initials?: string;
  status?: 'Active' | 'Inactive';
  lastLogin?: string;
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
  type: 'approved' | 'rejected' | 'grade' | 'defense' | 'message';
  text: string;
  date: string;
  read: boolean;
  link: string;
}

export interface Scores {
  rapport: number | null;
  presentation: number | null;
  technique: number | null;
  innovation: number | null;
  delais: number | null;
}
