import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  User, Session, Document as AppDocument, Message, Defense, 
  Notification, Scores, UserRole, Milestone, Appointment
} from '../types';
import { INITIAL_SCORES, COEFFICIENTS, SCORE_LABELS } from '../constants';

// ─── INITIAL DATA ────────────────────────────────────────────────────────────

const ACCOUNTS: User[] = [
  { id: '1', institutionalId: 'STU-2026-001', email: 'etudiant@emsi.ma', name: 'User Student', role: 'student', initials: 'ST' },
  { id: '2', institutionalId: 'JRY-2026-001', email: 'jury@emsi.ma', name: 'User Jury', role: 'jury', initials: 'JR' },
  { id: '3', institutionalId: 'SUP-2026-001', email: 'encadrant@emsi.ma', name: 'User Supervisor', role: 'supervisor', initials: 'SP' },
  { id: '4', institutionalId: 'ADM-2026-001', email: 'admin@emsi.ma', name: 'System Admin', role: 'admin', initials: 'AD' },
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: 1, title: 'Proposal', description: 'Submission of initial report / proposal by student.', status: 'current', date: '' },
  { id: 2, title: 'Interim Report', description: 'Verification and validation of progress by supervisor.', status: 'pending', date: '' },
  { id: 3, title: 'Final Report', description: 'Final validation or rejection of report by jury member.', status: 'pending', date: '' },
  { id: 4, title: 'Defense', description: 'Defense presentation and publication of final grades by administration.', status: 'pending', date: '' },
];


const INITIAL_DOCUMENTS: AppDocument[] = [];

const INITIAL_MESSAGES: Message[] = [];

const INITIAL_DEFENSES: Defense[] = [];

const INITIAL_NOTIFICATIONS: Notification[] = [];

const INITIAL_APPOINTMENTS: Appointment[] = [];

// ─── CONTEXT INTERFACE ───────────────────────────────────────────────────────

interface AppContextType {
  user: Session | null;
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
  juryCriteriaWeights: Record<string, number>;
  updateJuryCriteriaWeights: (weights: Record<string, number>) => void;
  theme: string;
  setTheme: (theme: string) => void;
  // Milestones
  projectMilestones: Milestone[];
  updateMilestone: (id: number, status: 'completed' | 'current' | 'pending') => void;
  // Validation Results
  isProjectValidated: boolean;
  finalResultMessage: string;
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  rescheduleAppointment: (id: number, newDate: string, newTime: string) => void;
  cancelAppointment: (id: number) => void;
  deleteAppointment: (id: number) => void;
  sendReminder: (id: number) => void;
  reminders: any[];
  students: any[];
  updateStudentEvaluation: (studentId: number, data: any) => void;
  // Archives & Resources
  archives: any[];
  updateArchiveProject: (id: string, updates: any) => void;
  deleteArchiveProject: (id: string) => void;
  shareToResources: (projectId: string) => void;
  resourceCenter: any[];
  // Criteria Weights
  supervisorCriteriaWeights: Record<string, number>;
  updateSupervisorCriteriaWeights: (weights: Record<string, number>) => void;
  administrativeNotes: AdministrativeNote[];
}

const AppContext = createContext<AppContextType | null>(null);

const initialReminders: any[] = [];

const initialStudents = [];

const INITIAL_ARCHIVES = [];

const INITIAL_RESOURCES: any[] = [];

const INITIAL_NOTES: any[] = [];

// Data version for tracking schema/state changes
const DATA_VERSION = 'v2_zero_data';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // AUTH
  const [user, setUser] = useState<Session | null>(() => {
    const saved = localStorage.getItem('pfe-user-session');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Failed to parse user session', e);
      return null;
    }
  });

  // DATA STORE
  const [scores, setScores] = useState<Scores>(() => {
    const saved = localStorage.getItem('pfe-scores');
    return saved ? JSON.parse(saved) : INITIAL_SCORES;
  });
  
  // Persist scores
  useEffect(() => {
    localStorage.setItem('pfe-scores', JSON.stringify(scores));
  }, [scores]);
  const [documents, setDocuments] = useState<AppDocument[]>(() => {
    const saved = localStorage.getItem('pfe-documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });
  
  // Persist documents
  useEffect(() => {
    localStorage.setItem('pfe-documents', JSON.stringify(documents));
  }, [documents]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [defenses, setDefenses] = useState<Defense[]>(INITIAL_DEFENSES);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [juryComment, setJuryComment] = useState('');
  const [isGradesPublished, setIsGradesPublished] = useState(false);
  const [pfeWeights, setPfeWeights] = useState({ supervisor: 50, jury: 50 });
  const [juryCriteriaWeights, setJuryCriteriaWeights] = useState(() => {
    const saved = localStorage.getItem('pfe-jury-weights');
    return saved ? JSON.parse(saved) : {
      innovation: 4,
      methodology: 4,
      quality: 4,
      presentation: 4,
      docs: 4
    };
  });
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [reminders, setReminders] = useState(initialReminders);
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('pfe-students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [archives, setArchives] = useState(() => {
    const saved = localStorage.getItem('pfe-archives');
    return saved ? JSON.parse(saved) : INITIAL_ARCHIVES;
  });

  const [resourceCenter, setResourceCenter] = useState(() => {
    const saved = localStorage.getItem('pfe-resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  // Persist archives & resources
  useEffect(() => {
    localStorage.setItem('pfe-archives', JSON.stringify(archives));
  }, [archives]);

  useEffect(() => {
    localStorage.setItem('pfe-resources', JSON.stringify(resourceCenter));
  }, [resourceCenter]);

  // Persist students
  const [administrativeNotes, setAdministrativeNotes] = useState(() => {
    const saved = localStorage.getItem('pfe-admin-notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  useEffect(() => {
    localStorage.setItem('pfe-students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    // Reset localStorage if it's the first time running this version
    const currentVersion = localStorage.getItem('pfe_app_data_version');
    if (currentVersion !== DATA_VERSION) {
      localStorage.removeItem('pfe-students');
      localStorage.removeItem('pfe-documents');
      localStorage.removeItem('pfe-archives');
      localStorage.removeItem('pfe-resources');
      localStorage.removeItem('pfe-admin-notes');
      localStorage.removeItem('pfe-scores');
      localStorage.setItem('pfe_app_data_version', DATA_VERSION);
      
      // Also update state to reflect the wipe
      setStudents([]);
      setDocuments([]);
      setArchives([]);
      setResourceCenter([]);
      setAdministrativeNotes([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pfe-admin-notes', JSON.stringify(administrativeNotes));
  }, [administrativeNotes]);

  // Automatic Archiving Logic
  useEffect(() => {
    students.forEach((s: any) => {
      if (s.status === 'Validated') {
        const exists = archives.find(a => a.studentId === s.id);
        if (!exists) {
          const newArchive = {
            id: `ARCH-${s.id}`,
            studentId: s.id,
            name: s.project,
            desc: `Final project validated by ${s.name}.`,
            date: s.date || new Date().toISOString().split('T')[0],
            files: 3,
            status: 'Completed',
            type: 'PFE',
            supervisor: 'Dr. Sofia Drissi'
          };
          setArchives(prev => [...prev, newArchive]);
        }
      }
    });
  }, [students, archives]);



  const [supervisorCriteriaWeights, setSupervisorCriteriaWeights] = useState(() => {
    const saved = localStorage.getItem('pfe-supervisor-weights');
    return saved ? JSON.parse(saved) : {
      report: 5,
      progress: 5,
      autonomy: 5,
      professionalism: 5
    };
  });

  // Persist weights
  useEffect(() => {
    localStorage.setItem('pfe-jury-weights', JSON.stringify(juryCriteriaWeights));
  }, [juryCriteriaWeights]);

  useEffect(() => {
    localStorage.setItem('pfe-supervisor-weights', JSON.stringify(supervisorCriteriaWeights));
  }, [supervisorCriteriaWeights]);

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
      account = ACCOUNTS.find(a => a.email === emailOrRole && (role === undefined || a.role === role));
    }

    if (!account) return false;
    const session = { ...account };
    setUser(session);
    localStorage.setItem('pfe-user-session', JSON.stringify(session));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('pfe-user-session');
  }, []);

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
    addNotification('grade', 'The jury has submitted their evaluation. Grades will be visible after official publication.', '/student/evaluation');
  }, []);

  const publishGrades = useCallback(() => {
    setIsGradesPublished(true);
    addNotification('grade', 'Final PFE grades have been officially published. You can consult them now.', '/student/evaluation');
  }, []);

  const updatePfeWeights = useCallback((supervisor: number, jury: number) => {
    setPfeWeights({ supervisor, jury });
    addNotification('grade', `Grading coefficients have been updated by administration (${supervisor}% Supervisor / ${jury}% Jury).`, '/admin/grades');
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

  // ── APPOINTMENTS ─────────────────────────────────────────────────────────────
  const addAppointment = useCallback((appointment: Omit<Appointment, 'id'>) => {
    const newAppt = { ...appointment, id: Date.now() };
    setAppointments(prev => [...prev, newAppt]);
    addNotification('defense', `New appointment: "${appointment.title}" for ${appointment.date}.`, '/student/schedule');
  }, [addNotification]);

  const rescheduleAppointment = useCallback((id: number, newDate: string, newTime: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, date: newDate, time: newTime, status: 'Rescheduled' } : a));
    const appt = appointments.find(a => a.id === id);
    addNotification('defense', `The appointment "${appt?.title}" has been rescheduled to ${newDate} at ${newTime}.`, '/student/schedule');
  }, [appointments]);

  const cancelAppointment = useCallback((id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    const appt = appointments.find(a => a.id === id);
    addNotification('defense', `The appointment "${appt?.title}" has been cancelled by the supervisor.`, '/student/schedule');
  }, [appointments, addNotification]);

  const deleteAppointment = useCallback((id: number) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  const sendReminder = useCallback((id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, reminderSent: true } : a));
    const appt = appointments.find(a => a.id === id);
    addNotification('message', `Reminder sent for appointment "${appt?.title}".`, '/student/schedule');
  }, [appointments, addNotification]);

  // ── STUDENT ACTIONS ─────────────────────────────────────────────────────────
  const uploadDocument = useCallback((title: string, file: File | null, target: 'supervisor' | 'jury' = 'supervisor') => {
    const existing = documents.filter(d => d.title === title);
    const version = existing.length > 0
      ? Math.max(...existing.map(d => d.version)) + 1
      : 1;
    const newDoc: AppDocument = {
      id: Date.now(),
      title: title || file?.name || 'Document',
      studentName: user?.name || 'Ahmed Khalil',
      version,
      date: new Date().toISOString(),
      status: 'pending',
      comment: '',
      size: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '—',
      target,
    };
    setDocuments(prev => [...prev, newDoc]);
    return newDoc;
  }, [documents, user]);

  const deleteDocument = useCallback((id: number) => {
    setDocuments(prev => prev.filter(d => Number(d.id) !== Number(id)));
    addNotification('approved', "The document has been successfully deleted.", '/student/reports');
  }, [addNotification]);

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

  const markNotificationRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const shareToResources = useCallback((projectId: string) => {
    console.log("Sharing project to resources:", projectId);
    const project = archives.find(a => a.id === projectId);
    if (project) {
      const newResource = {
        id: `RES-${Date.now()}`,
        title: `Archive: ${project.name}`,
        type: 'Folder',
        category: 'Archived Projects',
        date: new Date().toISOString().split('T')[0]
      };
      setResourceCenter(prev => {
        const updated = [newResource, ...prev];
        localStorage.setItem('pfe-resources', JSON.stringify(updated));
        return updated;
      });
      addNotification('approved', `The project "${project.name}" has been shared in the Resource Center.`, '/admin/resources');
    }
  }, [archives, addNotification]);

  const addToResources = useCallback((fileData: any) => {
    setResourceCenter(prev => {
      const updated = [fileData, ...prev];
      localStorage.setItem('pfe-resources', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromResources = useCallback((id: string) => {
    setResourceCenter(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('pfe-resources', JSON.stringify(updated));
      return updated;
    });
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
        ? `Congratulations Mr ${user?.name}, you have passed.` 
        : `Unfortunately Mr ${user?.name}, you have not passed.`)
    : "";

  return (
    <AppContext.Provider value={{
      user, login, logout,
      scores, saveScore, submitEvaluation, globalGrade, pfeFinalGrade, coefficients: COEFFICIENTS, juryComment,
      SCORE_LABELS,
      documents, uploadDocument, deleteDocument, approveDocument, rejectDocument, pendingDocsCount,
      messages, sendMessage, markMessagesRead, unreadCountForRole, deleteMessage,
      defenses, createDefense, updateDefense, deleteDefense,
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount, deleteNotification,
      progressPct, approvedDocs, totalRequired,
      isGradesPublished, publishGrades,
      pfeWeights, updatePfeWeights,
      juryCriteriaWeights,
      updateJuryCriteriaWeights: (weights: Record<string, number>) => {
        setJuryCriteriaWeights(weights);
        addNotification('grade', "Jury criteria scales have been updated by administration.", '/jury/evaluation');
      },
      theme, setTheme,
      projectMilestones, updateMilestone,
      isProjectValidated, finalResultMessage,
      appointments, addAppointment, rescheduleAppointment, cancelAppointment, deleteAppointment,
      sendReminder,
      reminders,
      students,
      updateStudentEvaluation: (id: number, data: any) => {
        setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      },
      archives,
      updateArchiveProject: (id: string, updates: any) => {
        setArchives(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
      },
      deleteArchiveProject: (id: string) => {
        setArchives(prev => prev.filter(a => a.id !== id));
      },
      shareToResources,
      resourceCenter, addToResources, removeFromResources,
      supervisorCriteriaWeights,
      updateSupervisorCriteriaWeights: (weights: Record<string, number>) => {
        setSupervisorCriteriaWeights(weights);
        addNotification('grade', "Supervisor criteria scales have been updated by administration.", '/supervisor/evaluation');
      },
      administrativeNotes
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
