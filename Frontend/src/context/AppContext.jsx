import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const ACCOUNTS = [
  { email: 'student@mail.com', password: 'student123', role: 'student', name: 'Youssef', initials: 'YM' },
  { email: 'jury@mail.com',    password: 'jury123',    role: 'jury',    name: 'Prof. Youssef', initials: 'PY' },
  { email: 'supervisor@mail.com', password: 'supervisor123', role: 'supervisor', name: 'Dr. Supervisor', initials: 'DS' },
  { email: 'admin@mail.com',    password: 'admin123',    role: 'admin',    name: 'Admin System', initials: 'AS' },
];

const INITIAL_SCORES = {
  rapport:      null,
  presentation: null,
  technique:    null,
  innovation:   null,
  delais:       null,
};

const COEFFICIENTS = {
  rapport:      3,
  presentation: 2,
  technique:    2,
  innovation:   1,
  delais:       1,
};

const SCORE_LABELS = {
  rapport:      'Thesis Report',
  presentation: 'Oral Defense',
  technique:    'Technical Proficiency',
  innovation:   'Innovation & Research',
  delais:       'Milestone Compliance',
};

const INITIAL_DOCUMENTS = [
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

const INITIAL_MESSAGES = [
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

const INITIAL_DEFENSES = [
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

const INITIAL_NOTIFICATIONS = [
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

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // AUTH
  const [session, setSession] = useState(null); // { role, name, email }

  // DATA STORE
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [coefficients] = useState(COEFFICIENTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [defenses, setDefenses] = useState(INITIAL_DEFENSES);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [juryComment, setJuryComment] = useState('');
  
  // THEME MANAGEMENT
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'system');

  const applyTheme = useCallback((targetTheme) => {
    let resolvedTheme = targetTheme;
    if (targetTheme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    localStorage.setItem('app-theme', targetTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme);

    // Listen for system theme changes if in 'system' mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, applyTheme]);

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const login = useCallback((emailOrRole, password, role) => {
    let account;
    
    // If only one argument is provided, assume it's a role for quick login
    if (password === undefined && role === undefined) {
      account = ACCOUNTS.find(a => a.role === emailOrRole);
    } else {
      account = ACCOUNTS.find(
        (a) => a.email === emailOrRole && a.password === password && a.role === role
      );
    }

    if (!account) return false;
    setSession({ role: account.role, name: account.name, email: account.email, initials: account.initials });
    return true;
  }, []);

  const logout = useCallback(() => setSession(null), []);

  // ── NOTE CALCULATION ────────────────────────────────────────────────────────
  const computeGlobalGrade = useCallback(() => {
    const entries = Object.entries(scores);
    const filled = entries.filter(([, v]) => v !== null);
    if (filled.length === 0) return null;
    const sumWeighted = filled.reduce((acc, [key, val]) => acc + val * coefficients[key], 0);
    const sumCoef     = filled.reduce((acc, [key])      => acc + coefficients[key], 0);
    return (sumWeighted / sumCoef);
  }, [scores, coefficients]);

  const globalGrade = computeGlobalGrade();

  // ── JURY ACTIONS ────────────────────────────────────────────────────────────
  const saveScore = useCallback((criterion, value) => {
    setScores(prev => ({ ...prev, [criterion]: value === '' ? null : Number(value) }));
    addNotification('grade', `A score has been assigned for "${SCORE_LABELS[criterion]}".`, '/student/evaluation');
  }, []);

  const submitEvaluation = useCallback((comment) => {
    setJuryComment(comment);
    addNotification('grade', 'The jury has finalized your evaluation. View your scores.', '/student/evaluation');
  }, []);

  const approveDocument = useCallback((docId) => {
    setDocuments(prev =>
      prev.map(d => d.id === docId ? { ...d, status: 'approved', comment: '' } : d)
    );
    const doc = documents.find(d => d.id === docId);
    if (doc) addNotification('approved', `Your document "${doc.title}" has been approved.`, '/student/reports');
  }, [documents]);

  const rejectDocument = useCallback((docId, reason) => {
    setDocuments(prev =>
      prev.map(d => d.id === docId ? { ...d, status: 'rejected', comment: reason } : d)
    );
    const doc = documents.find(d => d.id === docId);
    if (doc) addNotification('rejected', `Your document "${doc.title}" was rejected: ${reason}`, '/student/reports');
  }, [documents]);

  const createDefense = useCallback((defense) => {
    const newDefense = { ...defense, id: Date.now() };
    setDefenses(prev => [...prev, newDefense]);
    addNotification('defense', `Defense scheduled for ${defense.date} at ${defense.time} — ${defense.room}.`, '/student/schedule');
  }, []);

  const updateDefense = useCallback((id, updates) => {
    setDefenses(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    addNotification('defense', `The defense scheduled for ${updates.date || ''} has been updated.`, '/student/schedule');
  }, []);

  const deleteDefense = useCallback((id) => {
    setDefenses(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── STUDENT ACTIONS ─────────────────────────────────────────────────────────
  const uploadDocument = useCallback((title, file) => {
    const existing = documents.filter(d => d.title === title);
    const version = existing.length > 0
      ? Math.max(...existing.map(d => d.version)) + 1
      : 1;
    const newDoc = {
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

  const deleteDocument = useCallback((id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  // ── MESSAGES ─────────────────────────────────────────────────────────────────
  const sendMessage = useCallback((text, senderRole) => {
    const newMsg = {
      id: Date.now(),
      sender: senderRole,
      text,
      time: new Date().toISOString(),
      readByStudent: senderRole === 'student',
      readByJury:    senderRole === 'jury',
    };
    setMessages(prev => [...prev, newMsg]);

    // Notification to the recipient
    if (senderRole === 'student') {
      addNotification('message', 'New message from a student.', '/jury/messages');
    } else {
      addNotification('message', `New message from ${senderRole}.`, '/student/messages');
    }
  }, []);

  const markMessagesRead = useCallback((role) => {
    setMessages(prev =>
      prev.map(m => ({
        ...m,
        readByStudent: role === 'student' ? true : m.readByStudent,
        readByJury:    role === 'jury'    ? true : m.readByJury,
      }))
    );
  }, []);

  const deleteMessage = useCallback((id) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  const unreadCountForRole = useCallback((role) => {
    return messages.filter(m =>
      m.sender !== role &&
      (role === 'student' ? !m.readByStudent : !m.readByJury)
    ).length;
  }, [messages]);

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  const addNotification = useCallback((type, text, link) => {
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

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
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
      // Auth
      session, login, logout,

      // Scores
      scores, saveScore, submitEvaluation, globalGrade, coefficients, juryComment,
      SCORE_LABELS,

      // Documents
      documents, uploadDocument, deleteDocument, approveDocument, rejectDocument, pendingDocsCount,

      // Messages
      messages, sendMessage, markMessagesRead, unreadCountForRole, deleteMessage,

      // Defenses / Calendar
      defenses, createDefense, updateDefense, deleteDefense,

      // Notifications
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount, deleteNotification,

      // Computed
      progressPct, approvedDocs, totalRequired,

      // Theme
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
