import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, BarChart as BarChartIcon,
  MessageSquare, Bell, FileEdit, Settings,
  LogOut, Search, Menu, X, ChevronRight, Briefcase,
  Sun, Moon, User, MoreVertical, CheckCircle, Trash2,
  ChevronDown, BookOpen, Award, FolderOpen
} from 'lucide-react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import SidebarLink from '../../components/shared/SidebarLink';
import NotificationItem from '../../components/shared/NotificationItem';

const AdminLayout: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { 
    user, logout, theme, setTheme, unreadCountForRole, 
    notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, unreadNotificationsCount,
    messages, deleteMessage 
  } = useApp();

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

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleSidebar = () => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
      setSidebarWidth(300);
    } else {
      setIsSidebarCollapsed(true);
      setSidebarWidth(0);
    }
  };

  const adminUnreadMsgCount = typeof unreadCountForRole === 'function' ? unreadCountForRole('admin') : 0;
  const localUnreadNotifs = Array.isArray(notifications) ? notifications.filter(n => n && !n.is_read && !n.read).length : 0;
  const recentNotifs = Array.isArray(notifications) ? notifications.filter(n => n).slice(0, 4) : [];
  const safeMessages = Array.isArray(messages) ? messages : [];
  const adminUnreadMessages = safeMessages.filter(m => m && m.sender !== 'admin').slice(0, 4);

  const formatDateSafe = (dateStr: string | undefined | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? '-' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({ principal: true, communication: true });
  const toggleGroup = (key: string) => setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="app-shell" data-role="admin" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* ── FULL-WIDTH TOP HEADER ── */}
      <header className="main-header">
        <div className="header-search-container d-flex align-items-center gap-3">
          <Button variant="link" className="p-1 shadow-none border-0" onClick={toggleSidebar}
            style={{ color: 'rgba(255,255,255,0.85)' }}>
            <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <motion.div animate={{ rotate: isSidebarCollapsed ? 0 : 90 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="d-flex align-items-center justify-content-center">
                <Menu size={20} />
              </motion.div>
            </div>
          </Button>

          <img src="/logo_emsi_white.png" alt="EMSI Logo" className="logo-img-header" />

          <div className="header-search ms-2">
            <Search size={18} style={{ color: 'rgba(255,255,255,0.6)' }} className="mx-2" />
            <Form.Control type="text" placeholder="Search resources, documents..."
              className="border-0 shadow-none bg-transparent fw-bold" style={{ color: '#fff' }} />
          </div>
          {user && (
            <div className="d-none d-xl-flex align-items-center gap-2 extra-small fw-bold text-uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span>Portal</span>
              <ChevronRight size={12} style={{ opacity: 0.4 }} />
              <span style={{ color: 'rgba(255,255,255,0.9)' }}>Admin Space</span>
            </div>
          )}
        </div>

        <div className="header-actions d-flex align-items-center gap-2">
          <Button variant="link" className="p-2 shadow-none rounded-circle border-0"
            style={{ color: 'rgba(255,255,255,0.85)' }} onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
            {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
          </Button>

          {/* Messages */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-2 shadow-none position-relative border-0 no-caret rounded-circle" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="position-relative">
                <MessageSquare size={20} />
                {adminUnreadMsgCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning" style={{ fontSize: '0.6rem', padding: '3px 5px' }}>
                    {adminUnreadMsgCount}
                  </span>
                )}
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px', borderRadius: '16px' }}>
              <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <span className="fw-bold text-navy">Direct Messages</span>
                <Link to="/admin/messages" className="extra-small text-primary fw-bold text-decoration-none">View all</Link>
              </div>
              <div className="message-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {adminUnreadMessages.length === 0 ? (
                  <div className="px-3 py-4 text-center text-muted small">No new messages</div>
                ) : (
                  adminUnreadMessages.map(msg => (
                    <div key={msg.id} className="px-3 py-3 border-bottom d-flex gap-3"
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-alt)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = '')}>
                      <div className="rounded-circle bg-primary-soft text-primary d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                        {String(msg.sender_role || msg.sender || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden flex-grow-1">
                        <div className="d-flex justify-content-between mb-1">
                          <span className="fw-bold extra-small text-navy text-capitalize">{String(msg.sender_role || msg.sender || 'User')}</span>
                          <span className="extra-small text-muted" style={{ fontSize: '10px' }}>{formatDateSafe(msg.time)}</span>
                        </div>
                        <p className="extra-small text-muted text-truncate mb-0">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* Notifications */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-2 shadow-none position-relative border-0 no-caret rounded-circle" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="position-relative">
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.6rem', padding: '3px 5px' }}>
                    {unreadNotificationsCount}
                  </span>
                )}
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px', borderRadius: '16px' }}>
              <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <span className="fw-bold text-navy">Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <button className="extra-small text-primary fw-bold bg-transparent border-0 p-0" onClick={markAllNotificationsRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted extra-small fw-bold">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <NotificationItem key={n.id} notif={n}
                      onClick={() => markNotificationRead(n.id)}
                      onMarkRead={e => { e.stopPropagation(); e.preventDefault(); markNotificationRead(n.id); }}
                      onDelete={e => { e.stopPropagation(); e.preventDefault(); deleteNotification(n.id); }}
                    />
                  ))
                )}
              </div>
              <div className="p-2 text-center border-top">
                <Link to="/admin/notifications" className="text-decoration-none small text-primary fw-bold">View all notifications</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>

          {/* User */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-0 border-0 shadow-none d-flex align-items-center gap-2 text-decoration-none no-caret ms-1">
              <motion.div className="d-flex align-items-center gap-2" whileHover={{ opacity: 0.85 }}>
                <div className="d-flex flex-column text-end d-none d-md-flex">
                  <span className="fw-bold" style={{ fontSize: '0.85rem', color: '#fff' }}>{user?.name || 'Admin'}</span>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.5px' }}>Administrator</span>
                </div>
                {user?.avatar
                  ? <img src={user.avatar} alt={user?.name || 'Admin'} className="avatar-circle" style={{ objectFit: 'cover' }} />
                  : <div className="avatar-circle">{user?.name?.charAt(0) || 'A'}</div>
                }
              </motion.div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2 rounded-4">
              <Dropdown.Item as={Link} to="/admin/settings" className="rounded-3 py-2 small fw-bold text-navy">Profile</Dropdown.Item>
              <Dropdown.Item as={Link} to="/admin/settings" className="rounded-3 py-2 small fw-bold text-navy">Settings</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2 rounded-3 py-2 small fw-bold">
                <LogOut size={16} /> Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>

      {/* ── BODY: sidebar + content ── */}
      <div className="app-body">
        <aside
          ref={sidebarRef}
          className={`sidebar-nav flex-shrink-0 ${isSidebarCollapsed ? 'collapsed' : ''}`}
          style={{ width: isSidebarCollapsed ? '0px' : `${sidebarWidth}px`, transition: isResizing ? 'none' : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {/* PRINCIPAL Group */}
          <div className="sidebar-group mt-2">
            {!isSidebarCollapsed && (
              <button onClick={() => toggleGroup('principal')}
                className="sidebar-group-title w-100 border-0 bg-transparent d-flex align-items-center justify-content-between px-3 py-1" style={{ cursor: 'pointer' }}>
                <span>PRINCIPAL</span>
                <motion.span animate={{ rotate: expandedGroups.principal ? 0 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={13} className="opacity-50" />
                </motion.span>
              </button>
            )}
            <AnimatePresence initial={false}>
              {(isSidebarCollapsed || expandedGroups.principal) && (
                <motion.nav key="principal-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="nav flex-column gap-1 px-3 overflow-hidden">
                  <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={16} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Dashboard"} />
                  <SidebarLink to="/admin/users" icon={<Users size={16} />} iconClassName="icon-indigo" label={!isSidebarCollapsed && "User Management"} />
                  <SidebarLink to="/admin/subjects" icon={<BookOpen size={16} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Subject Approval"} />
                  <SidebarLink to="/admin/grades" icon={<Award size={16} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Grades Management"} />
                  <SidebarLink to="/admin/jury" icon={<Calendar size={16} />} iconClassName="icon-success" label={!isSidebarCollapsed && "Jury Planning"} />
                  <SidebarLink to="/admin/projects" icon={<Briefcase size={16} />} iconClassName="icon-warning" label={!isSidebarCollapsed && "Project Archive"} />
                  <SidebarLink to="/admin/documents" icon={<FolderOpen size={16} />} iconClassName="icon-teal" label={!isSidebarCollapsed && "Deliverables Repository"} />
                  <SidebarLink to="/admin/analytics" icon={<BarChartIcon size={16} />} iconClassName="icon-danger" label={!isSidebarCollapsed && "Analytics"} />
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          {/* COMMUNICATION Group */}
          <div className="sidebar-group">
            {!isSidebarCollapsed && (
              <button onClick={() => toggleGroup('communication')}
                className="sidebar-group-title w-100 border-0 bg-transparent d-flex align-items-center justify-content-between px-3 py-1" style={{ cursor: 'pointer' }}>
                <span>COMMUNICATION</span>
                <motion.span animate={{ rotate: expandedGroups.communication ? 0 : -90 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={13} className="opacity-50" />
                </motion.span>
              </button>
            )}
            <AnimatePresence initial={false}>
              {(isSidebarCollapsed || expandedGroups.communication) && (
                <motion.nav key="communication-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="nav flex-column gap-1 px-3 overflow-hidden">
                  <SidebarLink to="/admin/resources" icon={<Briefcase size={16} />} iconClassName="icon-orange" label={!isSidebarCollapsed && "Resources"} />
                  <SidebarLink to="/admin/messages" icon={<MessageSquare size={16} />} iconClassName="icon-teal" label={!isSidebarCollapsed && "Messages"} badge={adminUnreadMsgCount > 0 ? adminUnreadMsgCount : null} />
                  <SidebarLink to="/admin/notifications" icon={<Bell size={16} />} iconClassName="icon-rose" label={!isSidebarCollapsed && "Notifications"} badge={unreadNotificationsCount > 0 ? unreadNotificationsCount : null} />
                  <SidebarLink to="/admin/notes" icon={<FileEdit size={16} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Notes"} />
                </motion.nav>
              )}
            </AnimatePresence>
          </div>

          <div className="sidebar-footer mt-auto p-3">
            <div className="d-flex flex-column gap-1">
              <SidebarLink to="/admin/settings" icon={<Settings size={16} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Settings"} />
              {!isSidebarCollapsed && (
                <button onClick={logout} className="nav-link-custom w-100 text-danger border-0 bg-transparent" style={{ textAlign: 'left' }}>
                  <div className="sidebar-icon-wrapper"><LogOut size={18} /></div>
                  <span className="fw-bold">Logout</span>
                </button>
              )}
            </div>
          </div>

          <div className="sidebar-resizer" onMouseDown={startResizing} />
        </aside>

        <main className="flex-grow-1 main-wrapper bg-background">
          <div className="content-area flex-grow-1 px-4">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }} className="w-100">
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
