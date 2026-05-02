import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FileUp, GraduationCap,
  Calendar, MessageSquare, Settings, Bell, Search,
  Sun, Moon, LogOut, Users, Briefcase, Activity, History, FileText,
  ChevronRight, Menu
} from 'lucide-react';
import { Container, Button, Dropdown, Form, Badge } from 'react-bootstrap';
import { useApp } from './context/AppContext.jsx';
import logo from './assets/logo.png';

import LoginPage       from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import ReportsPage     from './pages/ReportsPage';
import EvaluationPage  from './pages/EvaluationPage';
import SchedulePage    from './pages/SchedulePage';
import MessagesPage    from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage    from './pages/SettingsPage';
import ResourceHubPage from './pages/ResourceHubPage';
import JuryDashboard   from './pages/JuryDashboard';
import JuryProjectsPage from './pages/JuryProjectsPage';
import JurySchedulePage from './pages/JurySchedulePage';
import JuryEvaluationPage from './pages/JuryEvaluationPage';
import JuryDocumentsPage from './pages/JuryDocumentsPage';
import SupervisorDashboard from './pages/SupervisorDashboard';
import MyStudentsPage from './pages/MyStudentsPage';
import ReportValidationPage from './pages/ReportValidationPage';
import SupervisorEvaluationPage from './pages/SupervisorEvaluationPage';
import AdminDashboard from './pages/AdminDashboard';
import AdministrativeNotesPage from './pages/AdministrativeNotesPage';
import './App.css';

const RequireAuth = ({ children, requiredRole }) => {
  const { session } = useApp();
  if (!session) return <Navigate to="/login" replace />;
  if (requiredRole && session.role !== requiredRole) {
    const rolePath = 
      session.role === 'admin' ? '/admin/dashboard' :
      session.role === 'jury' ? '/jury/dashboard' : 
      session.role === 'supervisor' ? '/supervisor/dashboard' : 
      '/student/dashboard';
    return <Navigate to={rolePath} replace />;
  }
  return children;
};

function App() {
  // --- 1. Hook Declarations (Must be at the TOP) ---
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();
  const { session, logout, notifications, markNotificationRead, markAllNotificationsRead,
          unreadNotificationsCount, unreadCountForRole, messages, markMessagesRead } = useApp();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebar-collapsed') === 'true';
  });
  const [expandedGroups, setExpandedGroups] = useState({ core: true, resources: true });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', newState);
  };

  // --- 2. Conditional Logic (After Hooks) ---
  
  // A. Unauthenticated: Only show login
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*"      element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // B. Redirect from login/root to dashboard if already logged in
  if (location.pathname === '/login' || location.pathname === '/') {
    const dashPath = 
      session.role === 'admin' ? '/admin/dashboard' :
      session.role === 'jury' ? '/jury/dashboard' :
      session.role === 'supervisor' ? '/supervisor/dashboard' :
      '/student/dashboard';
    return <Navigate to={dashPath} replace />;
  }

  // --- 3. UI Logic & Render ---
  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const unreadMsgCount = unreadCountForRole ? unreadCountForRole(session.role) : 0;
  const localUnreadNotifs = notifications ? notifications.filter(n => !n.read).length : 0;
  const recentNotifs = notifications ? notifications.slice(0, 4) : [];
  const unreadMessages = messages ? messages.filter(m => m.sender !== session.role && (session.role === 'student' ? !m.readByStudent : !m.readByJury)).slice(0, 4) : [];

  if (!session) return null;

  return (
    <div className="app-shell d-flex" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar - Scrollable via .sidebar-nav CSS */}
      <aside className={`sidebar-nav shadow-lg ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className={`sidebar-header d-flex align-items-center justify-content-center px-4 py-3`} style={{ minHeight: '80px', position: 'relative' }}>
          {!isSidebarCollapsed && (
            <div className="d-flex align-items-center animate-fade-in overflow-hidden flex-grow-1">
              <img src="/logo_emsi.png" alt="EMSI Logo" className="logo-img-sidebar" />
            </div>
          )}
        </div>

        <div className="sidebar-group px-3 mt-4 mb-2">
          {!isSidebarCollapsed && (
            <div 
              className="sidebar-group-title d-flex align-items-center justify-content-between extra-small text-white opacity-50 fw-bold text-uppercase tracking-widest px-2 mb-2"
              onClick={() => toggleGroup('core')}
            >
              <span>Core Workspace</span>
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
            {session.role === 'jury' ? (
              <>
                <SidebarLink to="/jury/dashboard" icon={<LayoutDashboard size={20} color="#3b82f6" />} label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/jury/projects"  icon={<FileUp size={20} color="#10b981" />}          label={!isSidebarCollapsed && "Assigned Projects"} />
                <SidebarLink to="/jury/evaluation" icon={<GraduationCap size={20} color="#f59e0b" />}  label={!isSidebarCollapsed && "Evaluation"} />
                <SidebarLink to="/jury/schedule"  icon={<Calendar size={20} color="#6366f1" />}         label={!isSidebarCollapsed && "Calendar"} />
              </>
            ) : session.role === 'supervisor' ? (
              <>
                <SidebarLink to="/supervisor/dashboard" icon={<LayoutDashboard size={20} color="#3b82f6" />} label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/supervisor/students"  icon={<GraduationCap size={20} color="#6366f1" />}    label={!isSidebarCollapsed && "My Students"} />
                <SidebarLink to="/supervisor/validation" icon={<FileUp size={20} color="#10b981" />}          label={!isSidebarCollapsed && "Report Validation"} />
                <SidebarLink to="/supervisor/evaluation" icon={<MessageSquare size={20} color="#f59e0b" />}   label={!isSidebarCollapsed && "Feedback & Evaluations"} />
                <SidebarLink to="/supervisor/schedule"  icon={<Calendar size={20} color="#8b5cf6" />}         label={!isSidebarCollapsed && "Defense Calendar"} />
              </>
            ) : session.role === 'admin' ? (
              <>
                <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} color="#3b82f6" />} label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/admin/users"     icon={<Users size={20} color="#8b5cf6" />}           label={!isSidebarCollapsed && "User Management"} />
                <SidebarLink to="/admin/jury"      icon={<Calendar size={20} color="#6366f1" />}        label={!isSidebarCollapsed && "Jury Planning"} />
                <SidebarLink to="/admin/archive"   icon={<Briefcase size={20} color="#06b6d4" />}       label={!isSidebarCollapsed && "Projects Archive"} />
                <SidebarLink to="/admin/analytics" icon={<Activity size={20} color="#f43f5e" />}        label={!isSidebarCollapsed && "Analytics Center"} />
              </>
            ) : (
              <>
                <SidebarLink to="/student/dashboard"     icon={<LayoutDashboard size={20} color="#3b82f6" />} label={!isSidebarCollapsed && "Dashboard"} />
                <SidebarLink to="/student/reports"       icon={<FileUp size={20} color="#10b981" />}           label={!isSidebarCollapsed && "Documents"} />
                <SidebarLink to="/student/evaluation"    icon={<GraduationCap size={20} color="#f59e0b" />}    label={!isSidebarCollapsed && "Evaluation"} />
                <SidebarLink to="/student/schedule"      icon={<Calendar size={20} color="#6366f1" />}          label={!isSidebarCollapsed && "Schedule"} />
              </>
            )}
          </nav>
        )}

        <div className="sidebar-group px-3 mt-4 mb-2">
          {!isSidebarCollapsed && (
            <div 
              className="sidebar-group-title d-flex align-items-center justify-content-between extra-small text-white opacity-50 fw-bold text-uppercase tracking-widest px-2 mb-2"
              onClick={() => toggleGroup('resources')}
            >
              <span>Resources & Sync</span>
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
            <SidebarLink to="/resources" icon={<Briefcase size={20} color="#f97316" />} label={!isSidebarCollapsed && "Resource Hub"} />
            <SidebarLink 
              to={session.role === 'admin' ? '/admin/messages' : session.role === 'student' ? '/student/messages' : session.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'} 
              icon={<MessageSquare size={20} color="#14b8a6" />} 
              label={!isSidebarCollapsed && "Messages"} 
              badge={unreadMsgCount > 0 ? unreadMsgCount : null}
            />
            <SidebarLink 
              to={session.role === 'admin' ? '/admin/notifications' : session.role === 'student' ? '/student/notifications' : session.role === 'supervisor' ? '/supervisor/notifications' : '/jury/notifications'} 
              icon={<Bell size={20} color="#f43f5e" />} 
              label={!isSidebarCollapsed && "Notifications"} 
              badge={localUnreadNotifs > 0 ? localUnreadNotifs : null}
            />
            <SidebarLink to={session.role === 'admin' ? '/admin/notes' : session.role === 'student' ? '/student/notes' : session.role === 'supervisor' ? '/supervisor/notes' : '/jury/notes'} icon={<FileText size={20} color="#94a3b8" />} label={!isSidebarCollapsed && "Admin Notes"} />
          </nav>
        )}

        <div className="mt-auto mb-4 px-3 pt-4 border-top border-secondary border-opacity-25">
          <SidebarLink to="/settings" icon={<Settings size={20} color="#94a3b8" />} label={!isSidebarCollapsed && "Portal Settings"} />
        </div>
      </aside>

      {/* Main Content */}
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
                className="border-0 shadow-none bg-transparent"
              />
            </div>
            {session && (
              <div className="breadcrumb-box d-none d-xl-flex align-items-center gap-2 extra-small text-muted fw-bold text-uppercase tracking-wider">
                <span className="opacity-50">Portal</span>
                <ChevronRight size={12} className="opacity-25" />
                <span className="text-primary">{session.role} Workspace</span>
              </div>
            )}
          </div>
          <div className="header-actions d-flex align-items-center gap-4">
            {/* Theme toggle */}
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={22} className="text-warning" /> : <Moon size={22} />}
            </Button>

            {/* Messages dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-muted shadow-none position-relative border-0 no-caret"
              >
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <MessageSquare size={22} />
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
                <div className="px-3 py-3 border-bottom bg-surface d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Messages</span>
                  <Link to={session.role === 'admin' ? '/admin/messages' : session.role === 'student' ? '/student/messages' : session.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'} className="extra-small text-primary fw-bold text-decoration-none">View All</Link>
                </div>
                <div className="message-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  {unreadMessages.length === 0 ? (
                    <div className="px-3 py-4 text-center text-muted small">No new messages</div>
                  ) : (
                    unreadMessages.map(m => (
                      <Dropdown.Item 
                        key={m.id} 
                        className="px-3 py-3 border-bottom-dashed-light d-flex gap-3 align-items-start"
                        onClick={() => markMessagesRead(session.role)}
                        as={Link}
                        to={session.role === 'admin' ? '/admin/messages' : session.role === 'student' ? '/student/messages' : session.role === 'supervisor' ? '/supervisor/messages' : '/jury/messages'}
                      >
                        <div className="p-2 rounded-circle bg-primary bg-opacity-10 text-primary mt-1 flex-shrink-0">
                          <MessageSquare size={14} />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="extra-small fw-bold text-navy text-capitalize">{m.sender}</span>
                            <span className="extra-small text-muted" style={{ fontSize: '10px' }}>
                              {new Date(m.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="extra-small text-muted text-truncate">{m.text}</div>
                        </div>
                        <div className="ms-auto mt-2 bg-primary rounded-circle" style={{ width: '6px', height: '6px' }}></div>
                      </Dropdown.Item>
                    ))
                  )}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* Notifications bell */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-muted shadow-none position-relative border-0 no-caret"
              >
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <Bell size={22} />
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
                <div className="px-3 py-3 border-bottom bg-surface d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Notifications {localUnreadNotifs > 0 && `(${localUnreadNotifs})`}</span>
                  {localUnreadNotifs > 0 && (
                    <button
                      className="extra-small text-primary fw-bold bg-transparent border-0 p-0"
                      onClick={markAllNotificationsRead}
                    >
                      Mark all as read
                    </button>
                  )}
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
                      />
                    ))
                  )}
                </div>
                <div className="p-2 text-center border-top bg-light-soft">
                  <Link
                    to={session.role === 'admin' ? '/admin/notifications' : session.role === 'student' ? '/student/notifications' : session.role === 'supervisor' ? '/supervisor/notifications' : '/jury/notifications'}
                    className="text-decoration-none small text-secondary-custom fw-bold p-0"
                  >
                    View all notifications
                  </Link>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            {/* User menu */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 shadow-none d-flex align-items-center gap-3 text-decoration-none"
              >
                <motion.div 
                  className="d-flex align-items-center gap-3"
                  whileHover={{ x: -5 }}
                >
                  <div className="d-flex flex-column text-end d-none d-md-flex">
                    <span className="fw-bold text-dark-custom" style={{ fontSize: '0.9rem' }}>
                      {session.name}
                    </span>
                    <span className="text-muted extra-small">
                      {session.role === 'jury' ? 'Jury Member' : session.role === 'supervisor' ? 'Supervisor' : session.role === 'admin' ? 'Administrator' : 'PFE Student'}
                    </span>
                  </div>
                  <div className="avatar-circle">{session.name.charAt(0)}</div>
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2">
                <Dropdown.Item as={Link} to={session.role === 'admin' ? '/admin/settings' : session.role === 'jury' ? '/jury/settings' : session.role === 'supervisor' ? '/supervisor/settings' : '/student/settings'}>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to={session.role === 'admin' ? '/admin/settings' : session.role === 'jury' ? '/jury/settings' : session.role === 'supervisor' ? '/supervisor/settings' : '/student/settings'}>
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={() => { logout(); }}
                  className="text-danger d-flex align-items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="content-area flex-grow-1" style={{ minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <Routes>
            {/* Student Routes */}
            <Route path="/student/dashboard"  element={<RequireAuth requiredRole="student"><StudentDashboard /></RequireAuth>} />
            <Route path="/student/reports"    element={<RequireAuth requiredRole="student"><ReportsPage /></RequireAuth>} />
            <Route path="/student/evaluation" element={<RequireAuth requiredRole="student"><EvaluationPage /></RequireAuth>} />
            <Route path="/student/schedule"   element={<RequireAuth requiredRole="student"><SchedulePage /></RequireAuth>} />
            <Route path="/student/messages"   element={<RequireAuth requiredRole="student"><MessagesPage /></RequireAuth>} />
            <Route path="/student/notifications" element={<RequireAuth requiredRole="student"><NotificationsPage /></RequireAuth>} />
            <Route path="/student/notes"      element={<RequireAuth requiredRole="student"><AdministrativeNotesPage /></RequireAuth>} />
            <Route path="/student/settings"   element={<RequireAuth requiredRole="student"><SettingsPage /></RequireAuth>} />

            {/* Common Routes */}
            <Route path="/resources" element={<RequireAuth><ResourceHubPage /></RequireAuth>} />
            <Route path="/settings"  element={<RequireAuth><SettingsPage /></RequireAuth>} />

            {/* Jury Routes */}
            <Route path="/jury/dashboard"  element={<RequireAuth requiredRole="jury"><JuryDashboard /></RequireAuth>} />
            <Route path="/jury/projects"   element={<RequireAuth requiredRole="jury"><JuryProjectsPage /></RequireAuth>} />
            <Route path="/jury/schedule"   element={<RequireAuth requiredRole="jury"><JurySchedulePage /></RequireAuth>} />
            <Route path="/jury/documents"  element={<RequireAuth requiredRole="jury"><JuryDocumentsPage /></RequireAuth>} />
            <Route path="/jury/evaluation" element={<RequireAuth requiredRole="jury"><JuryEvaluationPage /></RequireAuth>} />
            <Route path="/jury/messages"   element={<RequireAuth requiredRole="jury"><MessagesPage /></RequireAuth>} />
            <Route path="/jury/notifications" element={<RequireAuth requiredRole="jury"><NotificationsPage /></RequireAuth>} />
            <Route path="/jury/notes"      element={<RequireAuth requiredRole="jury"><AdministrativeNotesPage /></RequireAuth>} />
            <Route path="/jury/settings"   element={<RequireAuth requiredRole="jury"><SettingsPage /></RequireAuth>} />
            <Route path="/jury/*"          element={<RequireAuth requiredRole="jury"><JuryDashboard /></RequireAuth>} />

            {/* Supervisor Routes */}
            <Route path="/supervisor/dashboard"  element={<RequireAuth requiredRole="supervisor"><SupervisorDashboard /></RequireAuth>} />
            <Route path="/supervisor/students"   element={<RequireAuth requiredRole="supervisor"><MyStudentsPage /></RequireAuth>} />
            <Route path="/supervisor/validation" element={<RequireAuth requiredRole="supervisor"><ReportValidationPage /></RequireAuth>} />
            <Route path="/supervisor/evaluation" element={<RequireAuth requiredRole="supervisor"><SupervisorEvaluationPage /></RequireAuth>} />
            <Route path="/supervisor/messages"   element={<RequireAuth requiredRole="supervisor"><MessagesPage /></RequireAuth>} />
            <Route path="/supervisor/schedule"   element={<RequireAuth requiredRole="supervisor"><SchedulePage /></RequireAuth>} />
            <Route path="/supervisor/notifications" element={<RequireAuth requiredRole="supervisor"><NotificationsPage /></RequireAuth>} />
            <Route path="/supervisor/notes"      element={<RequireAuth requiredRole="supervisor"><AdministrativeNotesPage /></RequireAuth>} />
            <Route path="/supervisor/settings"   element={<RequireAuth requiredRole="supervisor"><SettingsPage /></RequireAuth>} />
            <Route path="/supervisor/*"          element={<RequireAuth requiredRole="supervisor"><SupervisorDashboard /></RequireAuth>} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/users"     element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/jury"      element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/archive"   element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/analytics" element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/notes"     element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/messages"  element={<RequireAuth requiredRole="admin"><MessagesPage /></RequireAuth>} />
            <Route path="/admin/notifications" element={<RequireAuth requiredRole="admin"><NotificationsPage /></RequireAuth>} />
            <Route path="/admin/settings"  element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/logs"      element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />
            <Route path="/admin/*"         element={<RequireAuth requiredRole="admin"><AdminDashboard /></RequireAuth>} />

            {/* Fallback for Authenticated users: Go to their specific dashboard if path unknown */}
            <Route path="*" element={
              <Navigate to={
                session.role === 'admin' ? '/admin/dashboard' :
                session.role === 'jury' ? '/jury/dashboard' :
                session.role === 'supervisor' ? '/supervisor/dashboard' :
                '/student/dashboard'
              } replace />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const SidebarLink = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center gap-3 mb-2 text-decoration-none position-relative`}
    >
      {icon}
      <span className="flex-grow-1">{label}</span>
      {badge && (
        <span
          className="badge rounded-pill bg-danger"
          style={{ fontSize: '0.65rem', padding: '3px 6px' }}
        >
          {badge}
        </span>
      )}
    </Link>
  );
};

const NOTIF_COLORS = {
  approved: 'success',
  rejected: 'danger',
  grade:    'primary',
  defense:  'warning',
  message:  'info',
};

const NotificationItem = ({ notif, onClick }) => (
  <Dropdown.Item
    onClick={onClick}
    className={`notif-item px-3 py-3 border-bottom-dashed-light d-flex gap-3 align-items-start ${!notif.read ? 'notif-unread' : ''}`}
  >
    <div
      className={`p-2 rounded-circle bg-${NOTIF_COLORS[notif.type] || 'secondary'} bg-opacity-10 text-${NOTIF_COLORS[notif.type] || 'secondary'} mt-1 flex-shrink-0`}
    >
      <Bell size={14} />
    </div>
    <div className="flex-grow-1 overflow-hidden">
      <div className="extra-small text-muted text-truncate mb-1">{notif.text}</div>
      <div className="extra-small text-secondary-custom fw-medium">
        {new Date(notif.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
    {!notif.read && (
      <span className="bg-primary rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px', marginTop: '6px' }} />
    )}
  </Dropdown.Item>
);

export default App;
