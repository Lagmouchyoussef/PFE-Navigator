import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  User, Session, Document as AppDocument, Message, Defense, 
  Notification, Scores, UserRole 
} from '../types';

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const ACCOUNTS: User[] = [
  { id: '1', email: 'student@mail.com', name: 'Youssef', role: 'student', initials: 'YM' },
  { id: '2', email: 'jury@mail.com', name: 'Prof. Youssef', role: 'jury', initials: 'PY' },
  { id: '3', email: 'supervisor@mail.com', name: 'Dr. Supervisor', role: 'supervisor', initials: 'DS' },
  { id: '4', email: 'admin@mail.com', name: 'Admin System', role: 'admin', initials: 'AS' },
];

const INITIAL_SCORES: Scores = {
  rapport:      null,
  presentation: null,
  technique:    null,
  innovation:   null,
  delais:       null,
};

const COEFFICIENTS: Record<keyof Scores, number> = {
  rapport:      3,
  presentation: 2,
  technique:    2,
  innovation:   1,
  delais:       1,
};

const SCORE_LABELS: Record<keyof Scores, string> = {
  rapport:      'Thesis Report',
  presentation: 'Oral Defense',
  technique:    'Technical Proficiency',
  innovation:   'Innovation & Research',
  delais:       'Milestone Compliance',
};

const INITIAL_DOCUMENTS: AppDocument[] = [
  {
    id: 1,
    title: 'Final_Report_v1.pdf',
    version: 1,
    date: '2026-04-20T09:30:00',
    status: 'approved',
    comment: '',
    size: '2.4 MB',
  },
  {
    id: 2,
    title: 'Defense_Presentation.pptx',
    version: 1,
    date: '2026-04-22T14:15:00',
    status: 'pending',
    comment: '',
    size: '5.1 MB',
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'jury',
    text: 'Hello Youssef, your initial report has been received.',
    time: '2026-04-20T10:00:00',
    readByStudent: true,
    readByJury: true,
  },
  {
    id: 2,
    sender: 'student',
    text: 'Thank you Prof. Youssef! I am preparing the presentation.',
    time: '2026-04-20T10:15:00',
    readByStudent: true,
    readByJury: true,
  },
  {
    id: 3,
    sender: 'student',
    text: 'Admin, I have a question regarding the project archiving process.',
    time: new Date().toISOString(),
    readByStudent: true,
    readByJury: false,
  },
];

const INITIAL_DEFENSES: Defense[] = [
  {
    id: 1,
    title: 'PFE Defense – Youssef',
    date: '2026-05-15',
    time: '09:00',
    duration: 45,
    room: 'Hall A',
    notes: '',
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'approved',
    text: 'Your document Final_Report_v1.pdf has been approved.',
    date: '2026-04-21T08:00:00',
    read: true,
    link: '/student/reports',
  },
  {
    id: 2,
    type: 'grade',
    text: 'System Update: New academic year parameters have been initialized.',
    date: new Date().toISOString(),
    read: false,
    link: '/admin/dashboard',
  },
  {
    id: 3,
    type: 'message',
    text: 'New message from Youssef (Student) regarding archiving.',
    date: new Date().toISOString(),
    read: false,
    link: '/jury/messages',
  },
];

// ─── CONTEXT INTERFACE ───────────────────────────────────────────────────────

interface AppContextType {
  session: Session | null;
  login: (emailOrRole: string, password?: string, role?: UserRole) => boolean;
  logout: () => void;
  scores: Scores;
  saveScore: (criterion: keyof Scores, value: string | number) => void;
  submitEvaluation: (comment: string) => void;
  globalGrade: number | null;
  coefficients: Record<keyof Scores, number>;
  juryComment: string;
  SCORE_LABELS: Record<keyof Scores, string>;
  documents: AppDocument[];
  uploadDocument: (title: string, file: File | null) => AppDocument;
  deleteDocument: (id: number) => void;
  approveDocument: (id: number) => void;
  rejectDocument: (id: number, reason: string) => void;
  pendingDocsCount: number;
  messages: Message[];
  sendMessage: (text: string, senderRole: UserRole) => void;
  markMessagesRead: (role: UserRole) => void;
  unreadCountForRole: (role: UserRole) => number;
  deleteMessage: (id: number) => void;
  defenses: Defense[];
  createDefense: (defense: Omit<Defense, 'id'>) => void;
  updateDefense: (id: number, updates: Partial<Defense>) => void;
  deleteDefense: (id: number) => void;
  notifications: Notification[];
  markNotificationRead: (id: number) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;
  deleteNotification: (id: number) => void;
  progressPct: number;
  approvedDocs: number;
  totalRequired: number;
  theme: string;
  setTheme: (theme: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // AUTH
  const [session, setSession] = useState<Session | null>(null);

  // DATA STORE
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [documents, setDocuments] = useState<AppDocument[]>(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [defenses, setDefenses] = useState<Defense[]>(INITIAL_DEFENSES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [juryComment, setJuryComment] = useState('');
  
  // THEME MANAGEMENT
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'system');

  const applyTheme = useCallback((targetTheme: string) => {
    let resolvedTheme = targetTheme;
    if (targetTheme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('app-theme', targetTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const login = useCallback((emailOrRole: string, password?: string, role?: UserRole) => {
    let account;
    if (password === undefined && role === undefined) {
      account = ACCOUNTS.find(a => a.role === emailOrRole);
    } else {
      // In a real app, we would use email and password. For mock, we just check role if role is provided.
      account = ACCOUNTS.find(a => a.email === emailOrRole && a.role === role);
    }

    if (!account) return false;
    setSession({ ...account });
    return true;
  }, []);

  const logout = useCallback(() => setSession(null), []);

  // ── NOTE CALCULATION ────────────────────────────────────────────────────────
  const computeGlobalGrade = useCallback(() => {
    const entries = Object.entries(scores) as [keyof Scores, number | null][];
    const filled = entries.filter(([, v]) => v !== null) as [keyof Scores, number][];
    if (filled.length === 0) return null;
    const sumWeighted = filled.reduce((acc, [key, val]) => acc + val * COEFFICIENTS[key], 0);
    const sumCoef     = filled.reduce((acc, [key])      => acc + COEFFICIENTS[key], 0);
    return (sumWeighted / sumCoef);
  }, [scores]);

  const globalGrade = computeGlobalGrade();

  // ── JURY ACTIONS ────────────────────────────────────────────────────────────
  const saveScore = useCallback((criterion: keyof Scores, value: string | number) => {
    setScores(prev => ({ ...prev, [criterion]: value === '' ? null : Number(value) }));
    addNotification('grade', `A score has been assigned for "${SCORE_LABELS[criterion]}".`, '/student/evaluation');
  }, []);

  const submitEvaluation = useCallback((comment: string) => {
    setJuryComment(comment);
    addNotification('grade', 'The jury has finalized your evaluation. View your scores.', '/student/evaluation');
  }, []);

  const approveDocument = useCallback((docId: number) => {
    setDocuments(prev =>
      prev.map(d => d.id === docId ? { ...d, status: 'approved', comment: '' } : d)
    );
    const doc = documents.find(d => d.id === docId);
    if (doc) addNotification('approved', `Your document "${doc.title}" has been approved.`, '/student/reports');
  }, [documents]);

  const rejectDocument = useCallback((docId: number, reason: string) => {
    setDocuments(prev =>
      prev.map(d => d.id === docId ? { ...d, status: 'rejected', comment: reason } : d)
    );
    const doc = documents.find(d => d.id === docId);
    if (doc) addNotification('rejected', `Your document "${doc.title}" was rejected: ${reason}`, '/student/reports');
  }, [documents]);

  const createDefense = useCallback((defense: Omit<Defense, 'id'>) => {
    const newDefense = { ...defense, id: Date.now() };
    setDefenses(prev => [...prev, newDefense]);
    addNotification('defense', `Defense scheduled for ${defense.date} at ${defense.time} — ${defense.room}.`, '/student/schedule');
  }, []);

  const updateDefense = useCallback((id: number, updates: Partial<Defense>) => {
    setDefenses(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    addNotification('defense', `The defense scheduled for ${updates.date || ''} has been updated.`, '/student/schedule');
  }, []);

  const deleteDefense = useCallback((id: number) => {
    setDefenses(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── STUDENT ACTIONS ─────────────────────────────────────────────────────────
  const uploadDocument = useCallback((title: string, file: File | null) => {
    const existing = documents.filter(d => d.title === title);
    const version = existing.length > 0
      ? Math.max(...existing.map(d => d.version)) + 1
      : 1;
    const newDoc: AppDocument = {
      id: Date.now(),
      title: title || file?.name || 'Document',
      version,
      date: new Date().toISOString(),
      status: 'pending',
      comment: '',
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '—',
    };
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, [documents]);

  const deleteDocument = useCallback((id: number) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── MESSAGES ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((text: string, senderRole: UserRole) => {
    const newMsg: Message = {
      id: Date.now(),
      sender: senderRole,
      text,
      time: new Date().toISOString(),
      readByStudent: senderRole === 'student',
      readByJury:    senderRole === 'jury',
    };
    setMessages(prev => [...prev, newMsg]);
    addNotification('message', senderRole === 'student' ? 'New message from a student.' : `New message from ${senderRole}.`, senderRole === 'student' ? '/jury/messages' : '/student/messages');
  }, []);

  const markMessagesRead = useCallback((role: UserRole) => {
    setMessages(prev =>
      prev.map(m => ({
        ...m,
        readByStudent: role === 'student' ? true : m.readByStudent,
        readByJury:    role === 'jury'    ? true : m.readByJury,
      }))
    );
  }, []);

  const deleteMessage = useCallback((id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const unreadCountForRole = useCallback((role: UserRole) => {
    return messages.filter(m =>
      m.sender !== role &&
      (role === 'student' ? !m.readByStudent : !m.readByJury)
    ).length;
  }, [messages]);

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  const addNotification = useCallback((type: Notification['type'], text: string, link: string) => {
    setNotifications(prev => [
      {
        id: Date.now(),
        type,
        text,
        date: new Date().toISOString(),
        read: false,
        link,
      },
      ...prev,
    ]);
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // ── COMPUTED ──────────────────────────────────────────────────────────────
  const approvedDocs  = documents.filter(d => d.status === 'approved').length;
  const totalRequired = 10;
  const progressPct   = Math.round((approvedDocs / totalRequired) * 100);
  const pendingDocsCount = documents.filter(d => d.status === 'pending').length;

  return (
    <AppContext.Provider value={{
      session, login, logout,
      scores, saveScore, submitEvaluation, globalGrade, coefficients: COEFFICIENTS, juryComment,
      SCORE_LABELS,
      documents, uploadDocument, deleteDocument, approveDocument, rejectDocument, pendingDocsCount,
      messages, sendMessage, markMessagesRead, unreadCountForRole, deleteMessage,
      defenses, createDefense, updateDefense, deleteDefense,
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount, deleteNotification,
      progressPct, approvedDocs, totalRequired,
      theme, setTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

export { SCORE_LABELS, COEFFICIENTS };
