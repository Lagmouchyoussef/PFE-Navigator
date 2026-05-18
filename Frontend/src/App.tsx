import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FileUp, GraduationCap,
  Calendar, MessageSquare, Settings, Bell, Search,
  Sun, Moon, LogOut, Users, Briefcase, Activity, History, FileText,
  ChevronRight, Menu, X, MoreVertical
} from 'lucide-react';
import { Container, Button, Dropdown, Form } from 'react-bootstrap';
import { useApp } from './context/AppContext';

import SidebarLink from './components/shared/SidebarLink';
import NotificationItem from './components/shared/NotificationItem';

import LoginPage from './pages/Auth/Login/LoginPage';
import AdminLoginPage from './pages/Auth/Login/AdminLoginPage';
import StudentDashboard from './pages/Student/Dashboard/StudentDashboard';
import ReportsPage from './pages/Student/Reports/ReportsPage';
import EvaluationPage from './pages/Student/Evaluation/EvaluationPage';
import SchedulePage from './pages/Student/Schedule/SchedulePage';
import MessagesPage from './pages/Common/Messages/MessagesPage';
import NotificationsPage from './pages/Common/Notifications/NotificationsPage';
import SettingsPage from './pages/Common/Settings/SettingsPage';
import ResourceHubPage from './pages/Common/ResourceHub/ResourceHubPage';
import JuryDashboard from './pages/Jury/Dashboard/JuryDashboard';
import JuryProjectsPage from './pages/Jury/Projects/JuryProjectsPage';
import JurySchedulePage from './pages/Jury/Schedule/JurySchedulePage';
import JuryEvaluationPage from './pages/Jury/Evaluation/JuryEvaluationPage';
import JuryDocumentsPage from './pages/Jury/Documents/JuryDocumentsPage';
import SupervisorDashboard from './pages/Supervisor/Dashboard/SupervisorDashboard';
import StudentsList from './pages/Supervisor/StudentsList/StudentsList';
import StudentDetail from './pages/Supervisor/StudentDetail/StudentDetail';
import SupervisorPlanning from './pages/Supervisor/Planning/Planning';
import SupervisorSubjects from './pages/Supervisor/Subjects/Subjects';
import SupervisorEvaluations from './pages/Supervisor/Evaluations/Evaluations';
import SupervisorMessages from './pages/Supervisor/Messages/Messages';
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

import AdminGrades from './pages/Admin/Grades/AdminGrades';

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
          <Route path="messages" element={<MessagesPage />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="notes" element={<AdminNotes />} />
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
    <div className="app-shell d-flex" data-role={user.role} style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <aside
        ref={sidebarRef}
        className={`sidebar-nav shadow-lg ${isSidebarCollapsed ? 'collapsed' : ''}`}
        style={{ width: isSidebarCollapsed ? '0px' : `${sidebarWidth}px`, transition: isResizing ? 'none' : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="sidebar-header d-flex align-items-center px-4 py-3" style={{ height: '80px' }}>
          {!isSidebarCollapsed && (
            <div className="d-flex align-items-center animate-fade-in overflow-hidden flex-grow-1">
              <img src="/logo_emsi_white.png" alt="EMSI Logo" className="logo-img-sidebar" />
            </div>
          )}
        </div>

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div
              className="sidebar-group-title d-flex align-items-center justify-content-between"
              onClick={() => toggleGroup('core')}
            >
              <span>PRINCIPAL</span>
              <motion.div
                animate={{ rotate: expandedGroups.core ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="d-flex align-items-center"
              >
                <ChevronRight size={12} />
              </motion.div>
            </div>
          )}
        </div>

        {expandedGroups.core && (
          <nav className="nav flex-column px-3">
            {user.role === 'jury' ? (
              <>
                <SidebarLink to="/jury/dashboard" icon={<LayoutDashboard size={20} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/jury/projects" icon={<FileUp size={20} />} iconClassName="icon-success" label={!isSidebarCollapsed && "Assigned Projects"} />
                <SidebarLink to="/jury/evaluation" icon={<GraduationCap size={20} />} iconClassName="icon-warning" label={!isSidebarCollapsed && "Evaluation"} />
                <SidebarLink to="/jury/schedule" icon={<Calendar size={20} />} iconClassName="icon-indigo" label={!isSidebarCollapsed && "Calendar"} />
              </>
            ) : user.role === 'supervisor' ? (
              <>
                <SidebarLink to="/supervisor/dashboard" icon={<LayoutDashboard size={20} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/supervisor/students" icon={<GraduationCap size={20} />} iconClassName="icon-indigo" label={!isSidebarCollapsed && "My Students"} />
                <SidebarLink to="/supervisor/subjects" icon={<FileText size={20} />} iconClassName="icon-success" label={!isSidebarCollapsed && "Subjects"} />
                <SidebarLink to="/supervisor/evaluation" icon={<MessageSquare size={20} />} iconClassName="icon-warning" label={!isSidebarCollapsed && "Evaluations"} />
                <SidebarLink to="/supervisor/schedule" icon={<Calendar size={20} />} iconClassName="icon-purple" label={!isSidebarCollapsed && "Planning"} />
              </>
            ) : (
              <>
                <SidebarLink to="/student/dashboard" icon={<LayoutDashboard size={20} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/student/reports" icon={<FileUp size={20} />} iconClassName="icon-success" label={!isSidebarCollapsed && "Documents"} />
                <SidebarLink to="/student/evaluation" icon={<GraduationCap size={20} />} iconClassName="icon-warning" label={!isSidebarCollapsed && "Evaluation"} />
                <SidebarLink to="/student/schedule" icon={<Calendar size={20} />} iconClassName="icon-indigo" label={!isSidebarCollapsed && "Schedule"} />
              </>
            )}
          </nav>
        )}

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div
              className="sidebar-group-title d-flex align-items-center justify-content-between"
              onClick={() => toggleGroup('resources')}
            >
              <span>COMMUNICATION</span>
              <motion.div
                animate={{ rotate: expandedGroups.resources ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="d-flex align-items-center"
              >
                <ChevronRight size={12} />
              </motion.div>
            </div>
          )}
        </div>

        {expandedGroups.resources && (
          <nav className="nav flex-column px-3">
            <SidebarLink to="/resources" icon={<Briefcase size={20} />} iconClassName="icon-orange" label={!isSidebarCollapsed && "Resource Hub"} />
            <SidebarLink
              to={user.role === 'student' ? '/student/messages' : user.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'}
              icon={<MessageSquare size={20} />}
              iconClassName="icon-teal"
              label={!isSidebarCollapsed && "Messages"}
              badge={unreadMsgCount > 0 ? unreadMsgCount : null}
            />
            <SidebarLink
              to={user.role === 'student' ? '/student/notifications' : user.role === 'supervisor' ? '/supervisor/notifications' : '/jury/notifications'}
              icon={<Bell size={20} />}
              iconClassName="icon-rose"
              label={!isSidebarCollapsed && "Notifications"}
              badge={unreadNotificationsCount > 0 ? unreadNotificationsCount : null}
            />
            <SidebarLink to={user.role === 'student' ? '/student/notes' : user.role === 'supervisor' ? '/supervisor/notes' : '/jury/notes'} icon={<FileText size={20} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Admin Notes"} />
          </nav>
        )}

        <div className="sidebar-footer mt-auto p-3 border-top border-secondary border-opacity-10">
          <div className="d-flex flex-column gap-1">
            <SidebarLink to="/settings" icon={<Settings size={18} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Settings"} />
            {!isSidebarCollapsed && (
              <button
                onClick={logout}
                className="nav-link-custom w-100 text-danger border-0 bg-transparent"
                style={{ textAlign: 'left' }}
              >
                <div className="sidebar-icon-wrapper">
                  <LogOut size={18} />
                </div>
                <span className="fw-bold">Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Resizer Handle */}
        <div
          className="sidebar-resizer"
          onMouseDown={startResizing}
        />
      </aside>

      <main className="flex-grow-1 main-wrapper bg-background">
        <header className="main-header d-flex align-items-center justify-content-between px-4">
          <div className="header-search-container d-flex align-items-center gap-3">
            <Button
              variant="link"
              className="p-1 text-navy shadow-none border-0 hover-bg-light transition-all"
              onClick={toggleSidebar}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <div className="p-2 rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden">
                <motion.div
                  animate={{ rotate: isSidebarCollapsed ? 0 : 90 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Menu size={20} className="text-navy" />
                </motion.div>
              </div>
            </Button>
            <div className="header-search">
              <Search size={18} className="text-muted mx-2" />
              <Form.Control
                type="text"
                placeholder="Search resources, documents..."
                className="border-0 shadow-none bg-transparent text-primary-custom fw-bold"
              />
            </div>
            {user && (
              <div className="breadcrumb-box d-none d-xl-flex align-items-center gap-2 extra-small text-muted fw-bold text-uppercase tracking-wider">
                <span className="opacity-50">Portal</span>
                <ChevronRight size={12} className="opacity-25" />
                <span className="text-primary text-capitalize">{user.role} Workspace</span>
              </div>
            )}
          </div>
          <div className="header-actions d-flex align-items-center gap-3">
            <Button
              variant="link"
              className="p-2 text-muted shadow-none hover-bg-surface-alt rounded-circle transition-all"
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            >
              {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-2 text-muted shadow-none position-relative border-0 no-caret hover-bg-surface-alt rounded-circle"
              >
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <MessageSquare size={20} />
                  {unreadMsgCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white"
                      style={{ fontSize: '0.6rem', padding: '3px 5px', zIndex: 10 }}
                    >
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
                    <MoreVertical size={16} className="text-muted cursor-pointer" />
                  </div>
                </div>
                <div className="message-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {unreadMessages.length === 0 ? (
                    <div className="px-3 py-4 text-center text-muted small">No new messages</div>
                  ) : (
                    unreadMessages.map(m => (
                      <div key={m.id} className="px-3 py-3 border-bottom-dashed-light d-flex gap-3 align-items-start position-relative group transition-all"
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
                              <span className="extra-small text-muted" style={{ fontSize: '10px' }}>
                                {formatDateSafe(m.time || m.created_at)}
                              </span>
                            </div>
                            <div className="extra-small text-muted text-truncate">{m.text}</div>
                          </div>
                        </Link>
                        <Button
                          variant="link"
                          className="p-1 text-muted hover-text-danger border-0 shadow-none align-self-start mt-n1 me-n1 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            deleteMessage(m.id);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-2 text-muted shadow-none position-relative border-0 no-caret hover-bg-surface-alt rounded-circle"
              >
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <Bell size={20} />
                  {localUnreadNotifs > 0 && (
                    <span
                      className="position-absolute badge rounded-pill bg-danger border border-2 border-white"
                      style={{
                        fontSize: '0.65rem',
                        padding: '2px 5px',
                        zIndex: 10,
                        top: '-6px',
                        right: '-8px'
                      }}
                    >
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
                      <button
                        className="extra-small text-primary fw-bold bg-transparent border-0 p-0"
                        onClick={markAllNotificationsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                    <MoreVertical size={16} className="text-muted cursor-pointer" />
                  </div>
                </div>
                <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {recentNotifs.length === 0 ? (
                    <div className="px-3 py-4 text-center text-muted small">No new notifications</div>
                  ) : (
                    recentNotifs.map(n => (
                      <NotificationItem
                        key={n.id}
                        notif={n}
                        onClick={() => markNotificationRead(n.id)}
                        onMarkRead={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          markNotificationRead(n.id);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteNotification(n.id);
                        }}
                      />
                    ))
                  )}
                </div>
                <div className="p-2 text-center border-top bg-light-soft">
                  <Link
                    to={
                      (user.role as string) === 'student' ? '/student/notifications' :
                        (user.role as string) === 'supervisor' ? '/supervisor/notifications' :
                          (user.role as string) === 'admin' ? '/admin/notifications' :
                            '/jury/notifications'
                    }
                    className="text-decoration-none small text-secondary-custom fw-bold p-0"
                  >
                    View all notifications
                  </Link>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 shadow-none d-flex align-items-center gap-3 text-decoration-none no-caret"
              >
                <motion.div
                  className="d-flex align-items-center gap-3"
                  whileHover={{ x: -5 }}
                >
                  <div className="d-flex flex-column text-end d-none d-md-flex">
                    <span className="fw-bold text-primary-custom" style={{ fontSize: '0.9rem' }}>
                      {user.name}
                    </span>
                    <span className="text-muted fw-black uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
                      {user.role === 'jury' ? 'Jury Member' : user.role === 'supervisor' ? 'Supervisor Prof.' : 'PFE Student'}
                    </span>
                  </div>
                  <div className="avatar-circle">{user?.name?.charAt(0) || 'U'}</div>
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2 rounded-4">
                <Dropdown.Item as={Link} to="/settings" className="rounded-3 py-2 small fw-bold text-navy">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/settings" className="rounded-3 py-2 small fw-bold text-navy">
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => { logout(); }}
                  className="text-danger d-flex align-items-center gap-2 rounded-3 py-2 small fw-bold"
                >
                  <LogOut size={16} /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {error && (
          <div className="px-4 mt-3">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="alert alert-danger border-0 shadow-sm d-flex justify-content-between align-items-center rounded-4 py-3"
            >
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

        <div className="content-area flex-grow-1" style={{ minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <ErrorBoundary>
          <Routes>
            <Route path="/student/dashboard" element={<RequireAuth requiredRole="student"><StudentDashboard /></RequireAuth>} />
            <Route path="/student/reports" element={<RequireAuth requiredRole="student"><ReportsPage /></RequireAuth>} />
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
            <Route path="/jury/messages" element={<RequireAuth requiredRole="jury"><MessagesPage /></RequireAuth>} />
            <Route path="/jury/notifications" element={<RequireAuth requiredRole="jury"><NotificationsPage /></RequireAuth>} />
            <Route path="/jury/notes" element={<RequireAuth requiredRole="jury"><AdministrativeNotesPage /></RequireAuth>} />
            <Route path="/jury/settings" element={<RequireAuth requiredRole="jury"><SettingsPage /></RequireAuth>} />

            <Route path="/supervisor/dashboard" element={<RequireAuth requiredRole="supervisor"><SupervisorDashboard /></RequireAuth>} />
            <Route path="/supervisor/students" element={<RequireAuth requiredRole="supervisor"><StudentsList /></RequireAuth>} />
            <Route path="/supervisor/student/:id" element={<RequireAuth requiredRole="supervisor"><StudentDetail /></RequireAuth>} />
            <Route path="/supervisor/subjects" element={<RequireAuth requiredRole="supervisor"><SupervisorSubjects /></RequireAuth>} />
            <Route path="/supervisor/evaluation" element={<RequireAuth requiredRole="supervisor"><SupervisorEvaluations /></RequireAuth>} />
            <Route path="/supervisor/messages" element={<RequireAuth requiredRole="supervisor"><MessagesPage /></RequireAuth>} />
            <Route path="/supervisor/schedule" element={<RequireAuth requiredRole="supervisor"><SupervisorPlanning /></RequireAuth>} />
            <Route path="/supervisor/notifications" element={<RequireAuth requiredRole="supervisor"><NotificationsPage /></RequireAuth>} />
            <Route path="/supervisor/notes" element={<RequireAuth requiredRole="supervisor"><AdministrativeNotesPage /></RequireAuth>} />
            <Route path="/supervisor/settings" element={<RequireAuth requiredRole="supervisor"><SettingsPage /></RequireAuth>} />

            <Route path="*" element={
              <Navigate to={
                user.role === 'jury' ? '/jury/dashboard' :
                  user.role === 'supervisor' ? '/supervisor/dashboard' :
                    '/student/dashboard'
              } replace />
            } />
          </Routes>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;
