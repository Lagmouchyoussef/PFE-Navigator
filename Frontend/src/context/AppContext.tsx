import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  User, Session, Document as AppDocument, Message, Defense, 
  Notification, Scores, UserRole, Milestone
} from '../types';

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const ACCOUNTS: User[] = [
  { id: '1', institutionalId: 'STU-2026-00105', email: 'ahmed.khalil@emsi.ma', name: 'Ahmed Khalil', role: 'student', initials: 'AK' },
  { id: '2', institutionalId: 'JRY-2026-00951', email: 'y.lagmouch@emsi.ma', name: 'Prof. Youssef Lagmouch', role: 'jury', initials: 'YL' },
  { id: '3', institutionalId: 'SUP-2026-00842', email: 's.drissi@emsi.ma', name: 'Dr. Sofia Drissi', role: 'supervisor', initials: 'SD' },
  { id: '4', institutionalId: 'ADM-2026-00412', email: 'admin@emsi.ma', name: 'Système PFE Navigator', role: 'admin', initials: 'SP' },
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: 1, title: 'Proposition', description: 'Dépôt du rapport initial / proposition par l\'étudiant.', status: 'completed', date: '2025-11-10' },
  { id: 2, title: 'Rapport Intérimaire', description: 'Vérification et validation de l\'état d\'avancement par l\'encadrant.', status: 'completed', date: '2026-02-15' },
  { id: 3, title: 'Rapport Final', description: 'Validation finale ou refus du rapport par le membre du jury.', status: 'current', date: '2026-05-14' },
  { id: 4, title: 'Défense', description: 'Soutenance et publication des notes finales par l\'administration.', status: 'pending', date: '' },
];

const INITIAL_SCORES: Scores = {
  rapport:      null,
  presentation: null,
  technique:    null,
  innovation:   null,
  delais:       null,
  pfeSupervisor: null,
  pfeJury:       null,
};

const COEFFICIENTS: Record<keyof Scores, number> = {
  rapport:      3,
  presentation: 2,
  technique:    2,
  innovation:   1,
  delais:       1,
  pfeSupervisor: 1, // Will be handled specifically for PFE Final
  pfeJury:       1,
};

const SCORE_LABELS: Record<keyof Scores, string> = {
  rapport:      'Rapport de Thèse',
  presentation: 'Soutenance Orale',
  technique:    'Maîtrise Technique',
  innovation:   'Innovation & Recherche',
  delais:       'Respect des Échéances',
  pfeSupervisor: 'Note Encadrant (50%)',
  pfeJury:       'Note Jury (50%)',
};

const INITIAL_DOCUMENTS: AppDocument[] = [
  {
    id: 1,
    title: 'Rapport_Final_v1.pdf',
    studentName: 'Ahmed Khalil',
    version: 1,
    date: '2026-04-20T09:30:00',
    status: 'approved',
    comment: '',
    size: '2.4 MB',
    target: 'jury',
  },
  {
    id: 2,
    title: 'Presentation_Soutenance.pptx',
    studentName: 'Ahmed Khalil',
    version: 1,
    date: '2026-04-22T14:15:00',
    status: 'pending',
    comment: '',
    size: '5.1 MB',
    target: 'jury',
  },
  {
    id: 3,
    title: 'Cahier_des_Charges.pdf',
    studentName: 'Sara Bennani',
    version: 1,
    date: '2026-04-10T11:00:00',
    status: 'approved',
    comment: '',
    size: '1.2 MB',
    target: 'supervisor',
  },
  {
    id: 4,
    title: 'Rapport_Avancement.pdf',
    studentName: 'Mehdi Alami',
    version: 2,
    date: '2026-04-18T16:45:00',
    status: 'pending',
    comment: '',
    size: '3.8 MB',
    target: 'supervisor',
  },
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    sender: 'jury',
    text: 'Bonjour Ahmed, votre rapport initial a bien été reçu et est en cours de révision.',
    time: '2026-04-20T10:00:00',
    readByStudent: true,
    readByJury: true,
  },
  {
    id: 2,
    sender: 'student',
    text: 'Merci Prof. Lagmouch ! Je prépare actuellement la présentation pour la soutenance.',
    time: '2026-04-20T10:15:00',
    readByStudent: true,
    readByJury: true,
  },
  {
    id: 3,
    sender: 'student',
    text: 'Admin, j\'ai une question concernant la date limite de dépôt du rapport final.',
    time: new Date().toISOString(),
    readByStudent: true,
    readByJury: false,
  },
];

const INITIAL_DEFENSES: Defense[] = [
  {
    id: 1,
    title: 'Soutenance de PFE – Ahmed Khalil',
    date: '2026-05-15',
    time: '09:00',
    duration: 45,
    room: 'Salle de Conférence A',
    notes: 'Présentation de 20 min + 25 min de Q&A',
  },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'approved',
    text: 'Votre document Rapport_Final_v1.pdf a été approuvé par le jury.',
    date: '2026-04-21T08:00:00',
    read: true,
    link: '/student/reports',
  },
  {
    id: 2,
    type: 'grade',
    text: 'Mise à jour Système : Les paramètres de l\'année académique 2026 ont été initialisés.',
    date: new Date().toISOString(),
    read: false,
    link: '/admin/dashboard',
  },
  {
    id: 3,
    type: 'message',
    text: 'Nouveau message de Ahmed Khalil (Étudiant) concernant le dépôt final.',
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
  pfeFinalGrade: number | null;
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
  isGradesPublished: boolean;
  publishGrades: () => void;
  pfeWeights: { supervisor: number; jury: number };
  updatePfeWeights: (supervisor: number, jury: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
  // Milestones
  projectMilestones: Milestone[];
  updateMilestone: (id: number, status: 'completed' | 'current' | 'pending') => void;
  // Validation Results
  isProjectValidated: boolean;
  finalResultMessage: string;
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
  const [isGradesPublished, setIsGradesPublished] = useState(false);
  const [pfeWeights, setPfeWeights] = useState({ supervisor: 50, jury: 50 });

  
  // THEME MANAGEMENT
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'system');
  const [projectMilestones, setProjectMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  const updateMilestone = useCallback((id: number, status: 'completed' | 'current' | 'pending') => {
    setProjectMilestones(prev => prev.map(m => m.id === id ? { 
      ...m, 
      status, 
      date: status === 'completed' ? new Date().toISOString().split('T')[0] : m.date 
    } : m));
  }, []);

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

  const pfeFinalGrade = (scores.pfeSupervisor !== null && scores.pfeJury !== null)
    ? (scores.pfeSupervisor * (pfeWeights.supervisor / 100)) + (scores.pfeJury * (pfeWeights.jury / 100))
    : (scores.pfeSupervisor !== null) ? scores.pfeSupervisor : (scores.pfeJury !== null) ? scores.pfeJury : null;

  // ── JURY ACTIONS ────────────────────────────────────────────────────────────
  const saveScore = useCallback((criterion: keyof Scores, value: string | number) => {
    setScores(prev => ({ ...prev, [criterion]: value === '' ? null : Number(value) }));
    addNotification('grade', `A score has been assigned for "${SCORE_LABELS[criterion]}".`, '/student/evaluation');
  }, []);

  const submitEvaluation = useCallback((comment: string) => {
    setJuryComment(comment);
    addNotification('grade', 'Le jury a soumis son évaluation. Les notes seront visibles après publication officielle.', '/student/evaluation');
  }, []);

  const publishGrades = useCallback(() => {
    setIsGradesPublished(true);
    addNotification('grade', 'Les notes finales du PFE ont été publiées officiellement. Vous pouvez les consulter dès maintenant.', '/student/evaluation');
  }, []);

  const updatePfeWeights = useCallback((supervisor: number, jury: number) => {
    setPfeWeights({ supervisor, jury });
    addNotification('grade', `Les coefficients de notation ont été mis à jour par l'administration (${supervisor}% Encadrant / ${jury}% Jury).`, '/admin/grades');
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
  const uploadDocument = useCallback((title: string, file: File | null, target: 'supervisor' | 'jury' = 'supervisor') => {
    const existing = documents.filter(d => d.title === title);
    const version = existing.length > 0
      ? Math.max(...existing.map(d => d.version)) + 1
      : 1;
    const newDoc: AppDocument = {
      id: Date.now(),
      title: title || file?.name || 'Document',
      studentName: session?.name || 'Ahmed Khalil',
      version,
      date: new Date().toISOString(),
      status: 'pending',
      comment: '',
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '—',
      target,
    };
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, [documents, session]);

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

  // FINAL VALIDATION LOGIC
  const isProjectValidated = (pfeFinalGrade || 0) >= 10;
  const finalResultMessage = isGradesPublished 
    ? (isProjectValidated 
        ? `Bravo Mr ${session?.name}, vous avez validé.` 
        : `Malheureusement Mr ${session?.name}, vous n'avez pas validé.`)
    : "";

  return (
    <AppContext.Provider value={{
      session, login, logout,
      scores, saveScore, submitEvaluation, globalGrade, pfeFinalGrade, coefficients: COEFFICIENTS, juryComment,
      SCORE_LABELS,
      documents, uploadDocument, deleteDocument, approveDocument, rejectDocument, pendingDocsCount,
      messages, sendMessage, markMessagesRead, unreadCountForRole, deleteMessage,
      defenses, createDefense, updateDefense, deleteDefense,
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount, deleteNotification,
      progressPct, approvedDocs, totalRequired,
      isGradesPublished, publishGrades,
      pfeWeights, updatePfeWeights,
      theme, setTheme,
      projectMilestones, updateMilestone,
      isProjectValidated, finalResultMessage
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
