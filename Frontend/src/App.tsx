import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FileUp, GraduationCap,
  Calendar, MessageSquare, Settings, Bell, Search,
  Sun, Moon, LogOut, Briefcase, Activity, FileText,
  ChevronRight, Menu, X, MoreVertical, FolderOpen, Trophy, BookOpen
} from 'lucide-react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { useApp } from './context/AppContext';

import SidebarLink from './components/shared/SidebarLink';
import NotificationItem from './components/shared/NotificationItem';

import LoginPage from './pages/Auth/Login/LoginPage';
import AdminLoginPage from './pages/Auth/Login/AdminLoginPage';
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard';
import ReportsPage from './pages/Student/Reports/ReportsPage';
import EvaluationPage from './pages/Student/Evaluation/EvaluationPage';
import SchedulePage from './pages/Student/Schedule/SchedulePage';
import StudentSubjectsPage from './pages/Student/Subjects/StudentSubjectsPage';
import MessagesPage from './pages/Common/Messages/MessagesPage';
import NotificationsPage from './pages/Common/Notifications/NotificationsPage';
import SettingsPage from './pages/Common/Settings/SettingsPage';
import ResourceHubPage from './pages/Common/ResourceHub/ResourceHubPage';
import JuryDashboard from './pages/Jury/Dashboard/JuryDashboard';
import JuryProjectsPage from './pages/Jury/Projects/JuryProjectsPage';
import JurySchedulePage from './pages/Jury/Schedule/JurySchedulePage';
import JuryEvaluationPage from './pages/Jury/Evaluation/JuryEvaluationPage';
import JuryDocumentsPage from './pages/Jury/Documents/JuryDocumentsPage';
import JuryResultsPage from './pages/Jury/Results/JuryResultsPage';
import SupervisorResultsPage from './pages/Supervisor/Results/SupervisorResultsPage';
import SupervisorDashboard from './pages/Supervisor/Dashboard/SupervisorDashboard';
import StudentsList from './pages/Supervisor/StudentsList/StudentsList';
import StudentDetail from './pages/Supervisor/StudentDetail/StudentDetail';
import SupervisorPlanning from './pages/Supervisor/Planning/Planning';
import SupervisorSubjects from './pages/Supervisor/Subjects/Subjects';
import SupervisorEvaluations from './pages/Supervisor/Evaluations/Evaluations';
// import SupervisorSettings from './pages/Supervisor/Settings/Settings';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard';
import UserManagement from './pages/Admin/Users/UserManagement';
import AdminSubjects from './pages/Admin/Subjects/AdminSubjects';
import JuryPlanning from './pages/Admin/Jury/JuryPlanning';
import ProjectsArchive from './pages/Admin/Projects/ProjectsArchive';
import AnalyticsCenter from './pages/Admin/Analytics/AnalyticsCenter';
import AdminNotes from './pages/Admin/Notes/AdminNotes';
import PortalSettings from './pages/Admin/Settings/PortalSettings';
import AdminNotifications from './pages/Admin/Notifications/AdminNotifications';
import AdminMessages from './pages/Admin/Messages/AdminMessages';
import ResourceHub from './pages/Admin/Resources/ResourceHub';
import AdminDocuments from './pages/Admin/Documents/AdminDocuments';
import AdminGrades from './pages/Admin/Grades/AdminGrades';
import SupervisorDocuments from './pages/Supervisor/Documents/SupervisorDocuments';

import AdministrativeNotesPage from './pages/Common/AdministrativeNotes/AdministrativeNotesPage';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import './App.css';
import { UserRole } from './types/index';

interface RequireAuthProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children, requiredRole }) => {
  const { user } = useApp();
  const location = useLocation();
  if (!user) {
    const isLinkToAdmin = location.pathname.startsWith('/admin');
    return <Navigate to={isLinkToAdmin ? "/admin-login" : "/login"} replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    const rolePath =
      user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'jury' ? '/jury/dashboard' :
          user.role === 'supervisor' ? '/supervisor/dashboard' :
            '/student/dashboard';
    return <Navigate to={rolePath} replace />;
  }
  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const {
    user, logout, theme, setTheme, unreadCountForRole,
    notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, unreadNotificationsCount,
    messages, deleteMessage, markMessagesRead, isLoading, error, refreshData
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [expandedGroups, setExpandedGroups] = useState({ core: true, resources: true });

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 280) newWidth = 280;
      if (newWidth > 450) newWidth = 450;
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
    if (!newState) {
      setSidebarWidth(300);
    } else {
      setSidebarWidth(0);
    }
  };

  if (isLoading && !user) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-background overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="spinner-border text-primary border-4 mb-4" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <h5 className="fw-bold text-navy">Initializing Portal...</h5>
          <p className="text-muted extra-small fw-bold opacity-75">Secure Production Session</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (location.pathname === '/login' || location.pathname === '/') {
    const dashPath =
      user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'jury' ? '/jury/dashboard' :
          user.role === 'supervisor' ? '/supervisor/dashboard' :
            '/student/dashboard';
    return <Navigate to={dashPath} replace />;
  }

  if (user.role === 'admin') {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="grades" element={<AdminGrades />} />
          <Route path="jury" element={<JuryPlanning />} />
          <Route path="projects" element={<ProjectsArchive />} />
          <Route path="analytics" element={<AnalyticsCenter />} />
          <Route path="resources" element={<ResourceHub />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="notes" element={<AdminNotes />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="settings" element={<PortalSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    );
  }

  const toggleGroup = (group: 'core' | 'resources') => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const unreadMsgCount = typeof unreadCountForRole === 'function' ? unreadCountForRole(user.role) : 0;
  const localUnreadNotifs = Array.isArray(notifications) ? notifications.filter(n => !n.read && !n.is_read).length : 0;
  const recentNotifs = Array.isArray(notifications) ? notifications.slice(0, 4) : [];
  const unreadMessages = (Array.isArray(messages) && user) 
    ? messages.filter(m => {
        if (m.sender === user.role) return false;
        if (user.role === 'student') return !m.readByStudent && !m.is_read;
        if (user.role === 'jury') return !m.readByJury && !m.is_read;
        return !m.is_read;
      }).slice(0, 4) 
    : [];

  const formatDateSafe = (dateStr: string | undefined | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-shell" data-role={user.role} style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* ── FULL-WIDTH TOP HEADER ── */}
      <header className="main-header">
        <div className="header-search-container d-flex align-items-center gap-3">
          <Button
            variant="link"
            className="p-1 shadow-none border-0 transition-all"
            onClick={toggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ color: 'rgba(255,255,255,0.85)' }}
          >
            <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <motion.div
                animate={{ rotate: isSidebarCollapsed ? 0 : 90 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="d-flex align-items-center justify-content-center"
              >
                <Menu size={20} />
              </motion.div>
            </div>
          </Button>

          <img src="/logo_emsi_white.png" alt="EMSI Logo" className="logo-img-header" />

          <div className="header-search ms-2">
            <Search size={18} style={{ color: 'rgba(255,255,255,0.6)' }} className="mx-2" />
            <Form.Control
              type="text"
              placeholder="Search resources, documents..."
              className="border-0 shadow-none bg-transparent fw-bold"
              style={{ color: '#fff' }}
            />
          </div>
          {user && (
            <div className="d-none d-xl-flex align-items-center gap-2 extra-small fw-bold text-uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span>Portal</span>
              <ChevronRight size={12} style={{ opacity: 0.4 }} />
              <span style={{ color: 'rgba(255,255,255,0.9)' }} className="text-capitalize">{user.role} Workspace</span>
            </div>
          )}
        </div>

        <div className="header-actions d-flex align-items-center gap-2">
          <Button
            variant="link"
            className="p-2 shadow-none rounded-circle border-0"
            style={{ color: 'rgba(255,255,255,0.85)' }}
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
          >
            {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
          </Button>

          {/* Messages dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-2 shadow-none position-relative border-0 no-caret rounded-circle" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                <MessageSquare size={20} />
                {unreadMsgCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem', padding: '3px 5px', zIndex: 10 }}>
                    {unreadMsgCount}
                  </span>
                )}
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="notification-dropdown-menu border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
              <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <span className="fw-bold text-navy">Messages</span>
                <div className="d-flex align-items-center gap-2">
                  <Link to={user.role === 'student' ? '/student/messages' : user.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'} className="extra-small text-primary fw-bold text-decoration-none">View All</Link>
                  <MoreVertical size={16} className="text-muted" />
                </div>
              </div>
              <div className="message-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {unreadMessages.length === 0 ? (
                  <div className="px-3 py-4 text-center text-muted small">No new messages</div>
                ) : (
                  unreadMessages.map(m => (
                    <div key={m.id} className="px-3 py-3 border-bottom d-flex gap-3 align-items-start"
                      style={{ cursor: 'default' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}
                    >
                      <Link
                        className="d-flex gap-3 align-items-start text-decoration-none flex-grow-1 overflow-hidden"
                        onClick={() => markMessagesRead(user.role)}
                        to={user.role === 'student' ? '/student/messages' : user.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'}
                      >
                        <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary mt-1 flex-shrink-0">
                          <MessageSquare size={14} />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="extra-small fw-bold text-navy text-capitalize">{String(m.sender_role || m.sender || 'User')}</span>
                            <span className="extra-small text-muted" style={{ fontSize: '10px' }}>{formatDateSafe(m.time || m.created_at)}</span>
                          </div>
                          <div className="extra-small text-muted text-truncate">{m.text}</div>
                        </div>
                      </Link>
                      <Button variant="link" className="p-1 text-muted border-0 shadow-none align-self-start"
                        onClick={e => { e.stopPropagation(); e.preventDefault(); deleteMessage(m.id); }}>
                        <X size={14} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Notifications dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-2 shadow-none position-relative border-0 no-caret rounded-circle" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                <Bell size={20} />
                {localUnreadNotifs > 0 && (
                  <span className="position-absolute badge rounded-pill bg-danger" style={{ fontSize: '0.65rem', padding: '2px 5px', zIndex: 10, top: '-6px', right: '-8px' }}>
                    {localUnreadNotifs}
                  </span>
                )}
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="notification-dropdown-menu border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
              <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <span className="fw-bold text-navy">Notifications {localUnreadNotifs > 0 && `(${localUnreadNotifs})`}</span>
                <div className="d-flex align-items-center gap-2">
                  {localUnreadNotifs > 0 && (
                    <button className="extra-small text-primary fw-bold bg-transparent border-0 p-0" onClick={markAllNotificationsRead}>
                      Mark all read
                    </button>
                  )}
                  <MoreVertical size={16} className="text-muted" />
                </div>
              </div>
              <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {recentNotifs.length === 0 ? (
                  <div className="px-3 py-4 text-center text-muted small">No new notifications</div>
                ) : (
                  recentNotifs.map(n => (
                    <NotificationItem key={n.id} notif={n}
                      onClick={() => markNotificationRead(n.id)}
                      onMarkRead={e => { e.stopPropagation(); e.preventDefault(); markNotificationRead(n.id); }}
                      onDelete={e => { e.stopPropagation(); e.preventDefault(); deleteNotification(n.id); }}
                    />
                  ))
                )}
              </div>
              <div className="p-2 text-center border-top">
                <Link to={user.role === 'student' ? '/student/notifications' : user.role === 'supervisor' ? '/supervisor/notifications' : '/jury/notifications'}
                  className="text-decoration-none small text-primary fw-bold">
                  View all notifications
                </Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* User dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-0 border-0 shadow-none d-flex align-items-center gap-2 text-decoration-none no-caret ms-1">
              <motion.div className="d-flex align-items-center gap-2" whileHover={{ opacity: 0.85 }}>
                <div className="d-flex flex-column text-end d-none d-md-flex">
                  <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#fff' }}>{user.name}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>
                    {user.role === 'jury' ? 'Jury Member' : user.role === 'supervisor' ? 'Supervisor' : 'PFE Student'}
                  </span>
                </div>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="avatar-circle" style={{ objectFit: 'cover' }} />
                  : <div className="avatar-circle">{user?.name?.charAt(0) || 'U'}</div>
                }
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2 rounded-4">
              <Dropdown.Item as={Link} to="/settings" className="rounded-3 py-2 small fw-bold text-navy">Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/settings" className="rounded-3 py-2 small fw-bold text-navy">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => { logout(); }} className="text-danger d-flex align-items-center gap-2 rounded-3 py-2 small fw-bold">
                <LogOut size={16} /> Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {/* ── BODY: sidebar + content ── */}
      <div className="app-body">
        <aside
          className={`sidebar-nav ${isSidebarCollapsed ? 'collapsed' : ''}`}
          style={{ width: isSidebarCollapsed ? '0px' : '260px', transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)', flexShrink: 0 }}
        >
          {/* ── Titre Navigation ── */}
          {!isSidebarCollapsed && (
            <div className="sidebar-nav-title">Navigation</div>
          )}

          {/* ── Groupe PRINCIPAL ── */}
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title" onClick={() => toggleGroup('core')}>
              <LayoutDashboard size={13} />
              <span>PRINCIPAL</span>
            </div>
          )}
          {expandedGroups.core && (
            <nav className="nav flex-column sidebar-nav-section">
              {user.role === 'jury' ? (
                <>
                  <SidebarLink to="/jury/dashboard"   icon={<LayoutDashboard size={16} />} label={!isSidebarCollapsed && "Dashboard"} />
                  <SidebarLink to="/jury/projects"    icon={<FileUp size={16} />}          label={!isSidebarCollapsed && "Assigned Projects"} />
                  <SidebarLink to="/jury/documents"   icon={<FolderOpen size={16} />}      label={!isSidebarCollapsed && "Deliverables"} />
                  <SidebarLink to="/jury/evaluation"  icon={<GraduationCap size={16} />}   label={!isSidebarCollapsed && "Evaluation"} />
                  <SidebarLink to="/jury/results"     icon={<Trophy size={16} />}          label={!isSidebarCollapsed && "Student Results"} />
                  <SidebarLink to="/jury/schedule"    icon={<Calendar size={16} />}        label={!isSidebarCollapsed && "Calendar"} />
                </>
              ) : user.role === 'supervisor' ? (
                <>
                  <SidebarLink to="/supervisor/dashboard"  icon={<LayoutDashboard size={16} />} label={!isSidebarCollapsed && "Dashboard"} />
                  <SidebarLink to="/supervisor/students"   icon={<GraduationCap size={16} />}   label={!isSidebarCollapsed && "My Students"} />
                  <SidebarLink to="/supervisor/documents"  icon={<FileUp size={16} />}          label={!isSidebarCollapsed && "Documents"} />
                  <SidebarLink to="/supervisor/subjects"   icon={<FileText size={16} />}        label={!isSidebarCollapsed && "Subjects"} />
                  <SidebarLink to="/supervisor/evaluation" icon={<MessageSquare size={16} />}   label={!isSidebarCollapsed && "Evaluations"} />
                  <SidebarLink to="/supervisor/results"    icon={<Trophy size={16} />}          label={!isSidebarCollapsed && "Student Results"} />
                  <SidebarLink to="/supervisor/schedule"   icon={<Calendar size={16} />}        label={!isSidebarCollapsed && "Planning"} />
                </>
              ) : (
                <>
                  <SidebarLink to="/student/dashboard" icon={<LayoutDashboard size={16} />} label={!isSidebarCollapsed && "Dashboard"} />
                  <SidebarLink to="/student/reports"   icon={<FileUp size={16} />}          label={!isSidebarCollapsed && "Documents"} />
                  <SidebarLink to="/student/subjects"  icon={<BookOpen size={16} />}        label={!isSidebarCollapsed && "Sujets"} />
                  <SidebarLink to="/student/evaluation"icon={<GraduationCap size={16} />}   label={!isSidebarCollapsed && "Evaluation"} />
                  <SidebarLink to="/student/schedule"  icon={<Calendar size={16} />}        label={!isSidebarCollapsed && "Schedule"} />
                </>
              )}
            </nav>
          )}

          {/* ── Groupe COMMUNICATION ── */}
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title" onClick={() => toggleGroup('resources')}>
              <MessageSquare size={13} />
              <span>COMMUNICATION</span>
            </div>
          )}
          {expandedGroups.resources && (
            <nav className="nav flex-column sidebar-nav-section">
              <SidebarLink to="/resources" icon={<Briefcase size={16} />} label={!isSidebarCollapsed && "Resource Hub"} />
              <SidebarLink
                to={user.role === 'student' ? '/student/messages' : user.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'}
                icon={<MessageSquare size={16} />}
                label={!isSidebarCollapsed && "Messages"} badge={unreadMsgCount > 0 ? unreadMsgCount : null}
              />
              <SidebarLink
                to={user.role === 'student' ? '/student/notifications' : user.role === 'supervisor' ? '/supervisor/notifications' : '/jury/notifications'}
                icon={<Bell size={16} />}
                label={!isSidebarCollapsed && "Notifications"} badge={unreadNotificationsCount > 0 ? unreadNotificationsCount : null}
              />
              <SidebarLink
                to={user.role === 'student' ? '/student/notes' : user.role === 'supervisor' ? '/supervisor/notes' : '/jury/notes'}
                icon={<FileText size={16} />} label={!isSidebarCollapsed && "Admin Notes"}
              />
            </nav>
          )}

          {/* ── Footer ── */}
          <div className="sidebar-footer mt-auto">
            <SidebarLink to="/settings" icon={<Settings size={16} />} label={!isSidebarCollapsed && "Settings"} />

            {!isSidebarCollapsed && (
              <>
                <div className="sidebar-user-row">
                  <div className="sidebar-user-avatar">
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                      : <span style={{ fontSize: '14px', fontWeight: 700, color: '#6b7280' }}>{user?.name?.charAt(0) || 'U'}</span>
                    }
                  </div>
                  <span className="sidebar-user-name">{user?.name}</span>
                </div>
                <button onClick={logout} className="sidebar-logout-btn">
                  <LogOut size={15} />
                  <span>Déconnexion</span>
                </button>
              </>
            )}
          </div>

          <div className="sidebar-resizer" onMouseDown={startResizing} />
        </aside>

        {/* Main content */}
        <main className="flex-grow-1 main-wrapper bg-background">
          {error && (
            <div className="px-4 mt-3">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="alert alert-danger border-0 shadow-sm d-flex justify-content-between align-items-center rounded-4 py-3">
                <div className="d-flex align-items-center gap-3">
                  <Activity size={20} />
                  <span className="extra-small fw-bold">{error}</span>
                </div>
                <Button variant="outline-danger" size="sm" className="rounded-pill px-3 border-2 fw-bold" onClick={refreshData}>
                  Retry Connection
                </Button>
              </motion.div>
            </div>
          )}

          <div className="content-area flex-grow-1" style={{ position: 'relative' }}>
            <ErrorBoundary>
              <Routes>
                <Route path="/student/dashboard" element={<RequireAuth requiredRole="student"><StudentDashboard /></RequireAuth>} />
                <Route path="/student/reports" element={<RequireAuth requiredRole="student"><ReportsPage /></RequireAuth>} />
                <Route path="/student/subjects" element={<RequireAuth requiredRole="student"><StudentSubjectsPage /></RequireAuth>} />
                <Route path="/student/evaluation" element={<RequireAuth requiredRole="student"><EvaluationPage /></RequireAuth>} />
                <Route path="/student/schedule" element={<RequireAuth requiredRole="student"><SchedulePage /></RequireAuth>} />
                <Route path="/student/messages" element={<RequireAuth requiredRole="student"><MessagesPage /></RequireAuth>} />
                <Route path="/student/notifications" element={<RequireAuth requiredRole="student"><NotificationsPage /></RequireAuth>} />
                <Route path="/student/notes" element={<RequireAuth requiredRole="student"><AdministrativeNotesPage /></RequireAuth>} />
                <Route path="/student/settings" element={<RequireAuth requiredRole="student"><SettingsPage /></RequireAuth>} />
                <Route path="/resources" element={<RequireAuth><ResourceHubPage /></RequireAuth>} />
                <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
                <Route path="/jury/dashboard" element={<RequireAuth requiredRole="jury"><JuryDashboard /></RequireAuth>} />
                <Route path="/jury/projects" element={<RequireAuth requiredRole="jury"><JuryProjectsPage /></RequireAuth>} />
                <Route path="/jury/schedule" element={<RequireAuth requiredRole="jury"><JurySchedulePage /></RequireAuth>} />
                <Route path="/jury/documents" element={<RequireAuth requiredRole="jury"><JuryDocumentsPage /></RequireAuth>} />
                <Route path="/jury/evaluation" element={<RequireAuth requiredRole="jury"><JuryEvaluationPage /></RequireAuth>} />
                <Route path="/jury/results" element={<RequireAuth requiredRole="jury"><JuryResultsPage /></RequireAuth>} />
                <Route path="/jury/messages" element={<RequireAuth requiredRole="jury"><MessagesPage /></RequireAuth>} />
                <Route path="/jury/notifications" element={<RequireAuth requiredRole="jury"><NotificationsPage /></RequireAuth>} />
                <Route path="/jury/notes" element={<RequireAuth requiredRole="jury"><AdministrativeNotesPage /></RequireAuth>} />
                <Route path="/jury/settings" element={<RequireAuth requiredRole="jury"><SettingsPage /></RequireAuth>} />
                <Route path="/supervisor/dashboard" element={<RequireAuth requiredRole="supervisor"><SupervisorDashboard /></RequireAuth>} />
                <Route path="/supervisor/students" element={<RequireAuth requiredRole="supervisor"><StudentsList /></RequireAuth>} />
                <Route path="/supervisor/student/:id" element={<RequireAuth requiredRole="supervisor"><StudentDetail /></RequireAuth>} />
                <Route path="/supervisor/subjects" element={<RequireAuth requiredRole="supervisor"><SupervisorSubjects /></RequireAuth>} />
                <Route path="/supervisor/evaluation" element={<RequireAuth requiredRole="supervisor"><SupervisorEvaluations /></RequireAuth>} />
                <Route path="/supervisor/results" element={<RequireAuth requiredRole="supervisor"><SupervisorResultsPage /></RequireAuth>} />
                <Route path="/supervisor/messages" element={<RequireAuth requiredRole="supervisor"><MessagesPage /></RequireAuth>} />
                <Route path="/supervisor/schedule" element={<RequireAuth requiredRole="supervisor"><SupervisorPlanning /></RequireAuth>} />
                <Route path="/supervisor/documents" element={<RequireAuth requiredRole="supervisor"><SupervisorDocuments /></RequireAuth>} />
                <Route path="/supervisor/notifications" element={<RequireAuth requiredRole="supervisor"><NotificationsPage /></RequireAuth>} />
                <Route path="/supervisor/notes" element={<RequireAuth requiredRole="supervisor"><AdministrativeNotesPage /></RequireAuth>} />
                <Route path="/supervisor/settings" element={<RequireAuth requiredRole="supervisor"><SettingsPage /></RequireAuth>} />
                <Route path="*" element={<Navigate to={user.role === 'jury' ? '/jury/dashboard' : user.role === 'supervisor' ? '/supervisor/dashboard' : '/student/dashboard'} replace />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
