import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { 
  User, Session, Document as AppDocument, Message, Defense, 
  Notification, Scores, UserRole, Milestone, Appointment
} from '../types';
import { INITIAL_SCORES, COEFFICIENTS, SCORE_LABELS } from '../constants';

// ─── PRODUCTION STATE INITIALIZATION ──────────────────────────────────────────
// All data is fetched from the backend on mount or login.

const INITIAL_MILESTONES: Milestone[] = [];
const INITIAL_DOCUMENTS: AppDocument[] = [];
const INITIAL_MESSAGES: Message[] = [];
const INITIAL_DEFENSES: Defense[] = [];
const INITIAL_NOTIFICATIONS: Notification[] = [];
const INITIAL_APPOINTMENTS: Appointment[] = [];

// ─── CONTEXT INTERFACE ───────────────────────────────────────────────────────

interface AppContextType {
  user: Session | null;
  login: (emailOrRole: string, password?: string, role?: UserRole) => Promise<boolean>;
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
  addToResources: (fileData: any) => void;
  removeFromResources: (id: string) => void;
  // Criteria Weights
  supervisorCriteriaWeights: Record<string, number>;
  updateSupervisorCriteriaWeights: (weights: Record<string, number>) => void;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  administrativeNotes: any[];
  subjects: any[];
  allUsers: any[];
  updateSubjectStatus: (id: number, status: string) => void;
  deleteSubject: (id: number) => void;
  deleteUser: (id: number) => void;
  createUser: (data: any) => void;
  updateUser: (id: number, data: any) => void;
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
  const [user, setUser] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // DATA ENTITIES
  const [scores, setScores] = useState<Scores>(INITIAL_SCORES);
  const [documents, setDocuments] = useState<AppDocument[]>(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [defenses, setDefenses] = useState<Defense[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [archives, setArchives] = useState<any[]>([]);
  const [resourceCenter, setResourceCenter] = useState<any[]>([]);
  const [administrativeNotes, setAdministrativeNotes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  
  const [juryComment, setJuryComment] = useState('');
  const [isGradesPublished, setIsGradesPublished] = useState(false);
  const [pfeWeights, setPfeWeights] = useState({ supervisor: 50, jury: 50 });
  
  const [juryCriteriaWeights, setJuryCriteriaWeights] = useState<Record<string, number>>({
    innovation: 4, methodology: 4, quality: 4, presentation: 4, docs: 4
  });
  const [supervisorCriteriaWeights, setSupervisorCriteriaWeights] = useState<Record<string, number>>({
    report: 5, progress: 5, autonomy: 5, professionalism: 5
  });

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const refreshData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { projectsApi } = await import('../api/projects');
      const { studentsApi } = await import('../api/students');
      
      const [docs, stud, subjs] = await Promise.all([
        projectsApi.getRepository(),
        studentsApi.getAll(),
        projectsApi.getSubjects()
      ]);
      
      setDocuments(docs || []);
      setStudents(stud || []);
      setSubjects(subjs || []);

      if (user.role === 'admin') {
        const { usersApi } = await import('../api/users');
        const users = await usersApi.getAll();
        setAllUsers(users || []);
      }
      setError(null);
    } catch (err: any) {
      console.error("Data fetch error:", err);
      setError("Server connection issue.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('pfe_access_token');
      if (token) {
        try {
          const { authApi } = await import('../api/auth');
          const userData = await authApi.me();
          setUser(userData);
        } catch (e) {
          localStorage.removeItem('pfe_access_token');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (user) refreshData();
  }, [user, refreshData]);

  const login = useCallback(async (emailOrRole: string, password?: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const { authApi } = await import('../api/auth');
      const userSession = await authApi.login({ email: emailOrRole, password: password || '', role });
      setUser(userSession);
      return true;
    } catch (err: any) {
      setError(err.data?.detail || "Invalid credentials.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const { authApi } = await import('../api/auth');
      await authApi.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('pfe_access_token');
      localStorage.removeItem('pfe_refresh_token');
    }
  }, []);
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
      isLoading, error, refreshData,
      administrativeNotes,
      subjects,
      allUsers,
      updateSubjectStatus: (id: number, status: string) => {
        setSubjects(prev => prev.map(s => s.id === id ? { ...s, status } : s));
      },
      deleteSubject: (id: number) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
      },
      createUser: async (data: any) => {
        const { usersApi } = await import('../api/users');
        const newUser = await usersApi.create(data);
        setAllUsers(prev => [...prev, newUser]);
      },
      updateUser: async (id: number, data: any) => {
        const { usersApi } = await import('../api/users');
        const updatedUser = await usersApi.update(id, data);
        setAllUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      },
      deleteUser: async (id: number) => {
        const { usersApi } = await import('../api/users');
        await usersApi.delete(id);
        setAllUsers(prev => prev.filter(u => u.id !== id));
      }
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
