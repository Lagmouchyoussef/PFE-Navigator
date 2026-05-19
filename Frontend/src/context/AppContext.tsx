import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { UserRole, Session } from '../types';

export type { Session };

// ─── CONTEXT INTERFACE ────────────────────────────────────────────────────────

interface AppContextType {
  user: Session | null;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;

  // Projects
  projects: any[];
  currentProject: any | null;
  refreshProject: () => Promise<void>;

  // Documents
  documents: any[];
  uploadDocument: (formData: FormData) => Promise<any>;
  deleteDocument: (id: number) => Promise<void>;
  approveDocument: (id: number) => Promise<void>;
  rejectDocument: (id: number, reason: string) => Promise<void>;
  addDocumentRemark: (documentId: number, comment: string, score?: number) => Promise<void>;

  // Evaluations
  evaluations: any[];
  submitSupervisorScore: (evaluationId: number, score: number, comment: string, criteria?: any) => Promise<void>;
  submitJuryScore: (evaluationId: number, score: number, comment: string, criteria?: any) => Promise<void>;
  publishEvaluation: (evaluationId: number) => Promise<void>;
  updateEvaluationWeights: (evaluationId: number, supervisorWeight: number, juryWeight: number) => Promise<void>;

  // Appointments
  appointments: any[];
  createAppointment: (data: any) => Promise<any>;
  updateAppointment: (id: number, data: any) => Promise<any>;
  cancelAppointment: (id: number) => Promise<void>;
  confirmAppointment: (id: number) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;

  // Milestones
  milestones: any[];
  updateMilestone: (id: number, data: any) => Promise<void>;

  // Messages
  messages: any[];
  sendMessage: (recipientId: number, content: string, subject?: string) => Promise<void>;
  markMessageRead: (id: number) => Promise<void>;
  markAllMessagesRead: () => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  contactableUsers: any[];

  // Notifications
  notifications: any[];
  unreadNotificationsCount: number;
  markNotificationRead: (id: number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  sendNotification: (data: any) => Promise<void>;

  // Administrative Notes
  administrativeNotes: any[];
  createAdminNote: (data: any) => Promise<void>;
  deleteAdminNote: (id: number) => Promise<void>;

  // Resources
  resourceCenter: any[];
  uploadResource: (formData: FormData) => Promise<void>;
  deleteResource: (id: number) => Promise<void>;

  // Users (admin)
  allUsers: any[];
  createUser: (data: any) => Promise<void>;
  updateUser: (id: number, data: any) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;

  // Students (for supervisor/admin)
  students: any[];
  subjects: any[];

  // Feedbacks
  feedbacks: any[];
  createFeedback: (projectId: number, title: string, comment: string) => Promise<void>;

  // Jury Assignments (admin)
  juryAssignments: any[];
  assignJury: (projectId: number, juryMemberId: number, role?: string) => Promise<void>;
  removeJuryAssignment: (id: number) => Promise<void>;
  toggleJuryDocs: (projectId: number) => Promise<void>;

  // Theme
  theme: string;
  setTheme: (theme: string) => void;

  // Refresh
  refreshData: () => Promise<void>;

  // Legacy compatibility
  scores: any;
  saveScore: (criterion: string, value: any) => void;
  submitEvaluation: (comment: string) => void;
  globalGrade: number | null;
  pfeFinalGrade: number | null;
  juryComment: string;
  isGradesPublished: boolean;
  publishGrades: () => void;
  pfeWeights: { supervisor: number; jury: number };
  updatePfeWeights: (s: number, j: number) => void;
  juryCriteriaWeights: Record<string, number>;
  updateJuryCriteriaWeights: (w: Record<string, number>) => void;
  supervisorCriteriaWeights: Record<string, number>;
  updateSupervisorCriteriaWeights: (w: Record<string, number>) => void;
  SCORE_LABELS: Record<string, string>;
  coefficients: Record<string, number>;
  progressPct: number;
  approvedDocs: number;
  totalRequired: number;
  pendingDocsCount: number;
  isProjectValidated: boolean;
  finalResultMessage: string;
  defenses: any[];
  createDefense: (d: any) => void;
  updateDefense: (id: number, d: any) => void;
  deleteDefense: (id: number) => void;
  reminders: any[];
  sendReminder: (id: number) => void;
  archives: any[];
  updateArchiveProject: (id: string, d: any) => void;
  deleteArchiveProject: (id: string) => void;
  shareToResources: (id: string) => void;
  addToResources: (d: any) => void;
  removeFromResources: (id: string) => void;
  projectMilestones: any[];
  unreadCountForRole: (role: UserRole) => number;
  markMessagesRead: (role: UserRole) => void;
  updateStudentEvaluation: (id: number, d: any) => void;
  updateSubjectStatus: (id: number, s: string) => void;
  deleteSubject: (id: number) => void;
  createSubject: (data: { title: string; description?: string; year?: string }) => Promise<void>;
  approveSubject: (id: number) => Promise<void>;
  rejectSubject: (id: number) => Promise<void>;
  // Subject requests
  mySubjectRequest: any | null;
  subjectRequests: any[];
  requestSubject: (subjectId: number) => Promise<void>;
  cancelSubjectRequest: () => Promise<void>;
  approveSubjectRequest: (id: number) => Promise<void>;
  rejectSubjectRequest: (id: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const ROLE_MAP: Record<string, string> = {
  student: 'Student',
  supervisor: 'Supervisor',
  jury: 'Jury Member',
  admin: 'Admin',
};

const ROLE_MAP_REVERSE: Record<string, string> = {
  Student: 'student',
  Supervisor: 'supervisor',
  'Jury Member': 'jury',
  Admin: 'admin',
};

function normalizeUser(u: any) {
  const role = ROLE_MAP[u.role] || u.role;
  return {
    ...u,
    role,
    institutionalId: u.institutional_id || u.institutionalId || '',
    status: u.status || (u.is_active === false ? 'Inactive' : 'Active'),
    lastLogin: u.lastLogin || u.last_login || 'Never',
    avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.first_name || '')}&background=3b82f6&color=fff`,
    confirmationStatus: u.confirmationStatus || 'None',
  };
}

const SCORE_LABELS: Record<string, string> = {
  pfeSupervisor: 'Supervisor Score',
  pfeJury: 'Jury Score',
};

const COEFFICIENTS: Record<string, number> = {
  pfeSupervisor: 1,
  pfeJury: 1,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [contactableUsers, setContactableUsers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [mySubjectRequest, setMySubjectRequest] = useState<any | null>(null);
  const [subjectRequests, setSubjectRequests] = useState<any[]>([]);
  const [administrativeNotes, setAdministrativeNotes] = useState<any[]>([]);
  const [resourceCenter, setResourceCenter] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [juryAssignments, setJuryAssignments] = useState<any[]>([]);
  const [archives] = useState<any[]>([]);
  const [defenses, setDefenses] = useState<any[]>([]);
  const [reminders] = useState<any[]>([]);

  // Legacy state
  const [scores, setScores] = useState<any>({ pfeSupervisor: null, pfeJury: null });
  const [juryComment, setJuryComment] = useState('');
  const [isGradesPublished, setIsGradesPublished] = useState(false);
  const [pfeWeights, setPfeWeights] = useState({ supervisor: 50, jury: 50 });
  const [juryCriteriaWeights, setJuryCriteriaWeights] = useState<Record<string, number>>({
    innovation: 4, methodology: 4, quality: 4, presentation: 4, docs: 4,
  });
  const [supervisorCriteriaWeights, setSupervisorCriteriaWeights] = useState<Record<string, number>>({
    report: 5, progress: 5, autonomy: 5, professionalism: 5,
  });
  const [theme, setThemeState] = useState(() => localStorage.getItem('app-theme') || 'system');

  // ── THEME ──────────────────────────────────────────────────────────────────
  const applyTheme = useCallback((t: string) => {
    let resolved = t;
    if (t === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
    localStorage.setItem('app-theme', t);
  }, []);

  const setTheme = useCallback((t: string) => {
    setThemeState(t);
    applyTheme(t);
  }, [applyTheme]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Apply role accent on login/logout
  useEffect(() => {
    if (user?.role) {
      document.documentElement.setAttribute('data-role', user.role);
    } else {
      document.documentElement.removeAttribute('data-role');
    }
  }, [user]);

  // ── AUTH ───────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const { authApi } = await import('../api/auth');
      const session = await authApi.login({ email, password, role });
      setUser(session);
      return true;
    } catch (err: any) {
      setError(err.data?.detail || 'Invalid credentials.');
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
      sessionStorage.removeItem('pfe_access_token');
      sessionStorage.removeItem('pfe_refresh_token');
      setProjects([]);
      setCurrentProject(null);
      setDocuments([]);
      setEvaluations([]);
      setAppointments([]);
      setMilestones([]);
      setMessages([]);
      setNotifications([]);
      setAdministrativeNotes([]);
      setResourceCenter([]);
      setAllUsers([]);
    }
  }, []);

  // ── DATA REFRESH ───────────────────────────────────────────────────────────
  const refreshProject = useCallback(async () => {
    if (!user) return;
    try {
      const { projectsApi } = await import('../api/projects');
      if (user.role === 'student') {
        const data = await projectsApi.getDashboard() as any;
        if (data && data.id) {
          setCurrentProject(data);
          setDocuments(data.documents || []);
          setMilestones(data.milestones || []);
          setAppointments(data.appointments || []);
          setFeedbacks(data.feedbacks || []);
          if (data.jury_assignments) setJuryAssignments(data.jury_assignments);
          if (data.evaluation) {
            setEvaluations([data.evaluation]);
            if (data.evaluation.supervisor_score) {
              setScores((prev: any) => ({ ...prev, pfeSupervisor: parseFloat(data.evaluation.supervisor_score) }));
            }
            if (data.evaluation.jury_score) {
              setScores((prev: any) => ({ ...prev, pfeJury: parseFloat(data.evaluation.jury_score) }));
            }
            setIsGradesPublished(data.evaluation.is_published || false);
          }
        }
      } else {
        const data = await projectsApi.getAll() as any;
        setProjects(Array.isArray(data) ? data : (data?.results || []));
      }
    } catch (err) {
      console.error('Project refresh error:', err);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [
        { projectsApi },
        { studentsApi },
        { messagesApi },
        { notificationsApi },
      ] = await Promise.all([
        import('../api/projects'),
        import('../api/students'),
        import('../api/communications'),
        import('../api/communications'),
      ]);

      const { resourcesApi, adminNotesApi: notesApi } = await import('../api/communications');

      const promises: Promise<any>[] = [
        refreshProject(),
        notificationsApi.getAll().then((data: any) => setNotifications(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
        messagesApi.getAll().then((data: any) => setMessages(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
        messagesApi.getContactableUsers().then((data: any) => setContactableUsers(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
        projectsApi.getSubjects().then((data: any) => setSubjects(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
        resourcesApi.getAll().then((data: any) => setResourceCenter(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
        notesApi.getAll().then((data: any) => setAdministrativeNotes(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
      ];

      if (user.role === 'student') {
        promises.push(
          (async () => {
            const { subjectRequestsApi } = await import('../api/projects');
            const req: any = await subjectRequestsApi.getMyRequest().catch(() => null);
            setMySubjectRequest(req);
          })(),
        );
      } else if (user.role === 'supervisor' || user.role === 'jury') {
        promises.push(
          studentsApi.getAll().then((data: any) => setStudents(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
          (async () => {
            const evalData: any = await (await import('../api/projects')).evaluationsApi.getAll().catch(() => []);
            setEvaluations(Array.isArray(evalData) ? evalData : (evalData?.results || []));
          })(),
          (async () => {
            const apptData: any = await (await import('../api/projects')).appointmentsApi.getAll().catch(() => []);
            setAppointments(Array.isArray(apptData) ? apptData : (apptData?.results || []));
          })(),
          (async () => {
            const docsData: any = await (await import('../api/projects')).documentsApi.getAll().catch(() => []);
            setDocuments(Array.isArray(docsData) ? docsData : (docsData?.results || []));
          })(),
          (async () => {
            const { subjectRequestsApi } = await import('../api/projects');
            const reqs: any = await subjectRequestsApi.list().catch(() => []);
            setSubjectRequests(Array.isArray(reqs) ? reqs : (reqs?.results || []));
          })(),
        );
      } else if (user.role === 'admin') {
        const { usersApi } = await import('../api/users');
        promises.push(
          usersApi.getAll().then((data: any) => {
            const raw = Array.isArray(data) ? data : (data?.results || []);
            setAllUsers(raw.map(normalizeUser));
          }).catch(() => {}),
          usersApi.getStudents().then((data: any) => setStudents(Array.isArray(data) ? data : (data?.results || []))).catch(() => {}),
          (async () => {
            const evalData: any = await (await import('../api/projects')).evaluationsApi.getAll().catch(() => []);
            setEvaluations(Array.isArray(evalData) ? evalData : (evalData?.results || []));
          })(),
          (async () => {
            const apptData: any = await (await import('../api/projects')).appointmentsApi.getAll().catch(() => []);
            setAppointments(Array.isArray(apptData) ? apptData : (apptData?.results || []));
          })(),
          (async () => {
            const jaData: any = await (await import('../api/projects')).juryAssignmentsApi.getAll().catch(() => []);
            setJuryAssignments(Array.isArray(jaData) ? jaData : (jaData?.results || []));
          })(),
          (async () => {
            const docsData: any = await (await import('../api/projects')).documentsApi.getAll().catch(() => []);
            setDocuments(Array.isArray(docsData) ? docsData : (docsData?.results || []));
          })(),
          (async () => {
            const { subjectRequestsApi } = await import('../api/projects');
            const reqs: any = await subjectRequestsApi.list().catch(() => []);
            setSubjectRequests(Array.isArray(reqs) ? reqs : (reqs?.results || []));
          })(),
        );
      }

      await Promise.allSettled(promises);
      setError(null);
    } catch (err) {
      console.error('refreshData error:', err);
      setError('Server connection issue.');
    } finally {
      setIsLoading(false);
    }
  }, [user, refreshProject]);

  // ── INIT AUTH ──────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem('pfe_access_token');
      if (token) {
        try {
          const { authApi } = await import('../api/auth');
          const userData = await authApi.me();
          setUser(userData);
        } catch {
          sessionStorage.removeItem('pfe_access_token');
        }
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) refreshData();
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── REAL-TIME POLLING ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    const pollMessages = async () => {
      try {
        const { messagesApi } = await import('../api/communications');
        const data = await messagesApi.getAll() as any;
        setMessages(Array.isArray(data) ? data : (data?.results || []));
      } catch { /* ignore polling errors */ }
    };

    const pollNotifications = async () => {
      try {
        const { notificationsApi } = await import('../api/communications');
        const data = await notificationsApi.getAll() as any;
        setNotifications(Array.isArray(data) ? data : (data?.results || []));
      } catch { /* ignore polling errors */ }
    };

    const pollProjectData = async () => {
      try {
        const { projectsApi } = await import('../api/projects');
        if (user.role === 'student') {
          const data = await projectsApi.getDashboard() as any;
          if (data?.id) {
            setCurrentProject(data);
            setDocuments(data.documents || []);
            setMilestones(data.milestones || []);
            setAppointments(data.appointments || []);
            if (data.jury_assignments) setJuryAssignments(data.jury_assignments);
            if (data.evaluation) setEvaluations([data.evaluation]);
          }
        } else {
          const data = await projectsApi.getAll() as any;
          setProjects(Array.isArray(data) ? data : (data?.results || []));
        }
      } catch { /* ignore polling errors */ }
    };

    const pollDocuments = async () => {
      if (user.role !== 'jury' && user.role !== 'admin') return;
      try {
        const { documentsApi } = await import('../api/projects');
        const docsData: any = await documentsApi.getAll();
        setDocuments(Array.isArray(docsData) ? docsData : (docsData?.results || []));
      } catch { /* ignore polling errors */ }
    };

    const pollResources = async () => {
      try {
        const { resourcesApi } = await import('../api/communications');
        const data: any = await resourcesApi.getAll();
        setResourceCenter(Array.isArray(data) ? data : (data?.results || []));
      } catch { /* ignore polling errors */ }
    };

    const pollNotes = async () => {
      try {
        const { adminNotesApi } = await import('../api/communications');
        const data: any = await adminNotesApi.getAll();
        setAdministrativeNotes(Array.isArray(data) ? data : (data?.results || []));
      } catch { /* ignore polling errors */ }
    };

    const msgId       = setInterval(() => { if (!document.hidden) pollMessages(); }, 5000);
    const notifId     = setInterval(() => { if (!document.hidden) pollNotifications(); }, 10000);
    const projId      = setInterval(() => { if (!document.hidden) pollProjectData(); }, 10000);
    const docsId      = setInterval(() => { if (!document.hidden) pollDocuments(); }, 10000);
    const resourcesId = setInterval(() => { if (!document.hidden) pollResources(); }, 30000);
    const notesId     = setInterval(() => { if (!document.hidden) pollNotes(); }, 30000);

    return () => {
      clearInterval(msgId);
      clearInterval(notifId);
      clearInterval(projId);
      clearInterval(docsId);
      clearInterval(resourcesId);
      clearInterval(notesId);
    };
  }, [user]);

  // ── DOCUMENTS ──────────────────────────────────────────────────────────────
  const uploadDocument = useCallback(async (formData: FormData) => {
    const { documentsApi } = await import('../api/projects');
    const doc = await documentsApi.upload(formData);
    setDocuments(prev => [doc, ...prev]);
    return doc;
  }, []);

  const deleteDocument = useCallback(async (id: number) => {
    const { documentsApi } = await import('../api/projects');
    await documentsApi.delete(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  const approveDocument = useCallback(async (id: number) => {
    const { documentsApi } = await import('../api/projects');
    const updated = await documentsApi.approve(id);
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
  }, []);

  const rejectDocument = useCallback(async (id: number, reason: string) => {
    const { documentsApi } = await import('../api/projects');
    const updated = await documentsApi.reject(id, reason);
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
  }, []);

  const addDocumentRemark = useCallback(async (documentId: number, comment: string, score?: number) => {
    const { documentRemarksApi } = await import('../api/projects');
    const remark = await documentRemarksApi.create({ document: documentId, comment, score });
    setDocuments(prev => prev.map(d =>
      d.id === documentId ? { ...d, remarks: [...(d.remarks || []), remark] } : d
    ));
  }, []);

  // ── EVALUATIONS ────────────────────────────────────────────────────────────
  const submitSupervisorScore = useCallback(async (
    evaluationId: number, score: number, comment: string, criteria?: any
  ) => {
    const { evaluationsApi } = await import('../api/projects');
    const updated = await evaluationsApi.submitSupervisor(evaluationId, { score, comment, criteria });
    setEvaluations(prev => prev.map(e => e.id === evaluationId ? updated : e));
  }, []);

  const submitJuryScore = useCallback(async (
    evaluationId: number, score: number, comment: string, criteria?: any
  ) => {
    const { evaluationsApi } = await import('../api/projects');
    const updated = await evaluationsApi.submitJury(evaluationId, { score, comment, criteria });
    setEvaluations(prev => prev.map(e => e.id === evaluationId ? updated : e));
  }, []);

  const publishEvaluation = useCallback(async (evaluationId: number) => {
    const { evaluationsApi } = await import('../api/projects');
    const updated = await evaluationsApi.publish(evaluationId);
    setEvaluations(prev => prev.map(e => e.id === evaluationId ? updated : e));
    setIsGradesPublished(true);
  }, []);

  const updateEvaluationWeights = useCallback(async (
    evaluationId: number, supervisorWeight: number, juryWeight: number
  ) => {
    const { evaluationsApi } = await import('../api/projects');
    const updated = await evaluationsApi.updateWeights(evaluationId, { supervisor_weight: supervisorWeight, jury_weight: juryWeight });
    setEvaluations(prev => prev.map(e => e.id === evaluationId ? updated : e));
  }, []);

  // ── APPOINTMENTS ───────────────────────────────────────────────────────────
  const createAppointment = useCallback(async (data: any) => {
    const { appointmentsApi } = await import('../api/projects');
    const appt = await appointmentsApi.create(data);
    setAppointments(prev => [...prev, appt]);
    return appt;
  }, []);

  const updateAppointment = useCallback(async (id: number, data: any) => {
    const { appointmentsApi } = await import('../api/projects');
    const updated = await appointmentsApi.update(id, data);
    setAppointments(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  }, []);

  const cancelAppointment = useCallback(async (id: number) => {
    const { appointmentsApi } = await import('../api/projects');
    const updated = await appointmentsApi.cancel(id);
    setAppointments(prev => prev.map(a => a.id === id ? updated : a));
  }, []);

  const confirmAppointment = useCallback(async (id: number) => {
    const { appointmentsApi } = await import('../api/projects');
    const updated = await appointmentsApi.confirm(id);
    setAppointments(prev => prev.map(a => a.id === id ? updated : a));
  }, []);

  const deleteAppointment = useCallback(async (id: number) => {
    const { appointmentsApi } = await import('../api/projects');
    await appointmentsApi.delete(id);
    setAppointments(prev => prev.filter(a => a.id !== id));
  }, []);

  // ── MILESTONES ─────────────────────────────────────────────────────────────
  const updateMilestone = useCallback(async (id: number, data: any) => {
    const { milestonesApi } = await import('../api/projects');
    const updated = await milestonesApi.update(id, data);
    setMilestones(prev => prev.map(m => m.id === id ? updated : m));
  }, []);

  // ── MESSAGES ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (recipientId: number, content: string, subject?: string) => {
    const { messagesApi } = await import('../api/communications');
    const msg = await messagesApi.send({ recipient: recipientId, content, subject });
    setMessages(prev => [msg, ...prev]);
  }, []);

  const markMessageRead = useCallback(async (id: number) => {
    const { messagesApi } = await import('../api/communications');
    await messagesApi.markRead(id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
  }, []);

  const markAllMessagesRead = useCallback(async () => {
    const { messagesApi } = await import('../api/communications');
    await messagesApi.markAllRead();
    setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
  }, []);

  const deleteMessage = useCallback(async (id: number) => {
    const { messagesApi } = await import('../api/communications');
    await messagesApi.delete(id);
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  // ── NOTIFICATIONS ──────────────────────────────────────────────────────────
  const markNotificationRead = useCallback(async (id: number) => {
    const { notificationsApi } = await import('../api/communications');
    await notificationsApi.markRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    const { notificationsApi } = await import('../api/communications');
    await notificationsApi.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  }, []);

  const deleteNotification = useCallback(async (id: number) => {
    const { notificationsApi } = await import('../api/communications');
    await notificationsApi.delete(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const sendNotification = useCallback(async (data: any) => {
    const { notificationsApi } = await import('../api/communications');
    await notificationsApi.send(data);
  }, []);

  // ── ADMIN NOTES ────────────────────────────────────────────────────────────
  const createAdminNote = useCallback(async (data: any) => {
    const { adminNotesApi } = await import('../api/communications');
    const note = await adminNotesApi.create(data);
    setAdministrativeNotes(prev => [note, ...prev]);
  }, []);

  const deleteAdminNote = useCallback(async (id: number) => {
    const { adminNotesApi } = await import('../api/communications');
    await adminNotesApi.delete(id);
    setAdministrativeNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  // ── RESOURCES ──────────────────────────────────────────────────────────────
  const uploadResource = useCallback(async (formData: FormData) => {
    const { resourcesApi } = await import('../api/communications');
    const res = await resourcesApi.upload(formData);
    setResourceCenter(prev => [res, ...prev]);
  }, []);

  const deleteResource = useCallback(async (id: number) => {
    const { resourcesApi } = await import('../api/communications');
    await resourcesApi.delete(id);
    setResourceCenter(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── USERS ──────────────────────────────────────────────────────────────────
  const createUser = useCallback(async (data: any) => {
    const { usersApi } = await import('../api/users');
    const nameParts = (data.name || '').trim().split(' ');
    const backendData = {
      email: data.email,
      password: data.password || 'Emsi2026!',
      first_name: nameParts[0] || '',
      last_name: nameParts.slice(1).join(' ') || '',
      role: ROLE_MAP_REVERSE[data.role] || data.role,
      institutional_id: data.institutionalId || data.institutional_id || '',
      phone_number: data.phone_number || '',
      department: data.department || '',
    };
    const newUser = await usersApi.create(backendData);
    setAllUsers(prev => [...prev, normalizeUser(newUser)]);
  }, []);

  const updateUser = useCallback(async (id: number, data: any) => {
    const backendFields: Record<string, any> = {};

    // Use `name` (combined) as the source of truth; ignore stale first_name/last_name
    if (data.name !== undefined) {
      const parts = (data.name || '').trim().split(/\s+/);
      backendFields.first_name = parts[0] || '';
      backendFields.last_name = parts.slice(1).join(' ') || '';
    } else {
      if (data.first_name !== undefined) backendFields.first_name = data.first_name;
      if (data.last_name !== undefined) backendFields.last_name = data.last_name;
    }

    if (data.phone_number !== undefined) backendFields.phone_number = data.phone_number;
    if (data.department !== undefined) backendFields.department = data.department;
    if (data.institutionalId !== undefined) backendFields.institutional_id = data.institutionalId;
    if (data.institutional_id !== undefined) backendFields.institutional_id = data.institutional_id;

    // Map frontend status → backend is_active (status takes priority over is_active)
    if (data.status !== undefined) {
      backendFields.is_active = data.status === 'Active';
    } else if (data.is_active !== undefined) {
      backendFields.is_active = data.is_active;
    }

    if (Object.keys(backendFields).length > 0) {
      const { usersApi } = await import('../api/users');
      const updated = await usersApi.update(id, backendFields);
      // normalizeUser(updated) has correct first_name/last_name/name from backend.
      // frontendOnly keeps frontend-only fields (history, confirmationStatus, avatar…)
      // but we remove backend-managed fields so the backend response wins.
      const frontendOnly = { ...data };
      ['name', 'first_name', 'last_name', 'is_active', 'institutional_id', 'phone_number', 'department'].forEach(k => delete frontendOnly[k]);
      setAllUsers(prev => prev.map(u => (u.id === id ? { ...normalizeUser(updated), ...frontendOnly } : u)));
    } else {
      // Only frontend-only fields changed (history, confirmationStatus, etc.)
      setAllUsers(prev => prev.map(u => (u.id === id ? { ...u, ...data } : u)));
    }
  }, []);

  const deleteUser = useCallback(async (id: number) => {
    const { usersApi } = await import('../api/users');
    await usersApi.delete(id);
    setAllUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // ── FEEDBACKS ──────────────────────────────────────────────────────────────
  const createFeedback = useCallback(async (projectId: number, title: string, comment: string) => {
    const { feedbacksApi } = await import('../api/projects');
    const fb = await feedbacksApi.create({ project: projectId, title, comment });
    setFeedbacks(prev => [fb, ...prev]);
  }, []);

  // ── JURY ASSIGNMENTS ───────────────────────────────────────────────────────
  const assignJury = useCallback(async (projectId: number, juryMemberId: number, role?: string) => {
    const { juryAssignmentsApi } = await import('../api/projects');
    const ja = await juryAssignmentsApi.create({ project: projectId, jury_member: juryMemberId, role });
    setJuryAssignments(prev => [...prev, ja]);
  }, []);

  const removeJuryAssignment = useCallback(async (id: number) => {
    const { juryAssignmentsApi } = await import('../api/projects');
    await juryAssignmentsApi.delete(id);
    setJuryAssignments(prev => prev.filter(j => j.id !== id));
  }, []);

  const toggleJuryDocs = useCallback(async (projectId: number) => {
    const { adminProjectsApi } = await import('../api/projects');
    const result = await adminProjectsApi.toggleJuryDocs(projectId);
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, jury_documents_open: result.jury_documents_open } : p));
  }, []);

  const createSubject = useCallback(async (data: { title: string; description?: string; year?: string }) => {
    const { supervisorSubjectsApi } = await import('../api/projects');
    const created = await supervisorSubjectsApi.create(data);
    setSubjects(prev => [created, ...prev]);
  }, []);

  const approveSubject = useCallback(async (id: number) => {
    const { adminSubjectsApi } = await import('../api/projects');
    const updated = await adminSubjectsApi.approve(id);
    setSubjects(prev => prev.map(s => s.id === id ? updated : s));
  }, []);

  const rejectSubject = useCallback(async (id: number) => {
    const { adminSubjectsApi } = await import('../api/projects');
    const updated = await adminSubjectsApi.reject(id);
    setSubjects(prev => prev.map(s => s.id === id ? updated : s));
  }, []);

  const requestSubject = useCallback(async (subjectId: number) => {
    const { subjectRequestsApi } = await import('../api/projects');
    const req = await subjectRequestsApi.create(subjectId);
    setMySubjectRequest(req);
  }, []);

  const cancelSubjectRequest = useCallback(async () => {
    const { subjectRequestsApi } = await import('../api/projects');
    await subjectRequestsApi.cancel();
    setMySubjectRequest(null);
  }, []);

  const approveSubjectRequest = useCallback(async (id: number) => {
    const { subjectRequestsApi } = await import('../api/projects');
    const updated: any = await subjectRequestsApi.approve(id);
    setSubjectRequests(prev => prev.map(r => r.id === id ? updated : r));
    if (updated.status === 'approved') {
      setSubjects(prev => prev.filter(s => s.id !== updated.subject));
    }
  }, []);

  const rejectSubjectRequest = useCallback(async (id: number) => {
    const { subjectRequestsApi } = await import('../api/projects');
    const updated: any = await subjectRequestsApi.reject(id);
    setSubjectRequests(prev => prev.map(r => r.id === id ? updated : r));
  }, []);

  const updateSubjectStatus = useCallback(async (id: number, status: string) => {
    const { adminSubjectsApi } = await import('../api/projects');
    if (status === 'Approved' || status === 'available') {
      const updated = await adminSubjectsApi.approve(id);
      setSubjects(prev => prev.map(s => s.id === id ? updated : s));
    } else {
      const updated = await adminSubjectsApi.reject(id);
      setSubjects(prev => prev.map(s => s.id === id ? updated : s));
    }
  }, []);

  const deleteSubject = useCallback(async (id: number) => {
    const { adminSubjectsApi } = await import('../api/projects');
    await adminSubjectsApi.delete(id);
    setSubjects(prev => prev.filter(s => s.id !== id));
  }, []);

  // ── COMPUTED ───────────────────────────────────────────────────────────────
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length;
  const approvedDocs = documents.filter(d => d.status === 'approved').length;
  const totalRequired = 10;
  const progressPct = Math.min(Math.round((approvedDocs / totalRequired) * 100), 100);
  const pendingDocsCount = documents.filter(d => d.status === 'pending').length;

  const currentEval = evaluations[0];
  const pfeFinalGrade = currentEval
    ? (() => {
        const sup = currentEval.supervisor_score !== null ? parseFloat(currentEval.supervisor_score) : null;
        const jury = currentEval.jury_score !== null ? parseFloat(currentEval.jury_score) : null;
        const supW = (currentEval.supervisor_weight || 50) / 100;
        const juryW = (currentEval.jury_weight || 50) / 100;
        if (sup !== null && jury !== null) return sup * supW + jury * juryW;
        return sup ?? jury;
      })()
    : null;

  const globalGrade = pfeFinalGrade;
  const isProjectValidated = (pfeFinalGrade || 0) >= 10;
  const finalResultMessage = isGradesPublished
    ? (isProjectValidated
        ? `Congratulations ${user?.name}, you have passed.`
        : `Unfortunately ${user?.name}, you have not passed.`)
    : '';

  // Legacy compatibility helpers
  const saveScore = useCallback((criterion: string, value: any) => {
    setScores((prev: any) => ({ ...prev, [criterion]: value === '' ? null : Number(value) }));
  }, []);

  const submitEvaluation = useCallback((comment: string) => {
    setJuryComment(comment);
  }, []);

  const publishGrades = useCallback(() => {
    setIsGradesPublished(true);
  }, []);

  const updatePfeWeights = useCallback((s: number, j: number) => {
    setPfeWeights({ supervisor: s, jury: j });
  }, []);

  const unreadCountForRole = useCallback((_role: UserRole) => {
    if (!user) return 0;
    return (messages || []).filter(m => m && !m.is_read && m.recipient === user.id).length;
  }, [messages, user]);

  const markMessagesRead = useCallback((_role: UserRole) => {
    setMessages(prev => prev.map(m => ({ ...m, is_read: true })));
  }, []);

  return (
    <AppContext.Provider value={{
      user, login, logout, isLoading, error,

      projects, currentProject, refreshProject,

      documents, uploadDocument, deleteDocument, approveDocument, rejectDocument, addDocumentRemark,

      evaluations, submitSupervisorScore, submitJuryScore, publishEvaluation, updateEvaluationWeights,

      appointments, createAppointment, updateAppointment, cancelAppointment, confirmAppointment, deleteAppointment,

      milestones, updateMilestone,

      messages, sendMessage, markMessageRead, markAllMessagesRead, deleteMessage, contactableUsers,

      notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead,
      deleteNotification, sendNotification,

      administrativeNotes, createAdminNote, deleteAdminNote,

      resourceCenter, uploadResource, deleteResource,

      allUsers, createUser, updateUser, deleteUser,

      students, subjects,
      createSubject, approveSubject, rejectSubject,
      mySubjectRequest, subjectRequests,
      requestSubject, cancelSubjectRequest, approveSubjectRequest, rejectSubjectRequest,

      feedbacks, createFeedback,

      juryAssignments, assignJury, removeJuryAssignment, toggleJuryDocs,

      theme, setTheme,

      refreshData,

      // Legacy
      scores, saveScore, submitEvaluation, globalGrade, pfeFinalGrade, juryComment,
      isGradesPublished, publishGrades,
      pfeWeights, updatePfeWeights,
      juryCriteriaWeights, updateJuryCriteriaWeights: (w: Record<string, number>) => setJuryCriteriaWeights(w),
      supervisorCriteriaWeights, updateSupervisorCriteriaWeights: (w: Record<string, number>) => setSupervisorCriteriaWeights(w),
      SCORE_LABELS, coefficients: COEFFICIENTS,
      progressPct, approvedDocs, totalRequired, pendingDocsCount,
      isProjectValidated, finalResultMessage,
      defenses, createDefense: (d: any) => setDefenses(prev => [...prev, { ...d, id: Date.now() }]),
      updateDefense: (id: number, d: any) => setDefenses(prev => prev.map(x => x.id === id ? { ...x, ...d } : x)),
      deleteDefense: (id: number) => setDefenses(prev => prev.filter(x => x.id !== id)),
      reminders, sendReminder: (_id: number) => {},
      archives, updateArchiveProject: () => {}, deleteArchiveProject: () => {}, shareToResources: () => {},
      addToResources: () => {}, removeFromResources: () => {},
      projectMilestones: milestones,
      unreadCountForRole, markMessagesRead,
      updateStudentEvaluation: (id: number, d: any) => setStudents(prev => prev.map(s => s.id === id ? { ...s, ...d } : s)),
      updateSubjectStatus, deleteSubject,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
