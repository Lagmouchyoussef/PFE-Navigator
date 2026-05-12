import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, Archive, BarChart as BarChartIcon, 
  Package, MessageSquare, Bell, FileEdit, Settings, 
  LogOut, Search, Menu, X, ChevronRight, User, Briefcase, Activity,
  Sun, Moon
} from 'lucide-react';
import { Container, Button, Dropdown, Form, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import './AdminLayout.css';

// Reusing the SidebarLink style from the main App
const SidebarLink = ({ to, icon, label, badge, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center gap-3 mb-2 text-decoration-none position-relative`}
    >
      {icon}
      {!isCollapsed && <span className="flex-grow-1">{label}</span>}
      {badge && !isCollapsed && (
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

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { session, logout, theme, setTheme, unreadCountForRole, messages, deleteMessage } = useApp();

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-shell d-flex" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Sidebar - Matching the original design */}
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
            <div className="sidebar-group-title extra-small text-white opacity-75 fw-bold text-uppercase tracking-widest px-2 mb-2">
              Principal
            </div>
          )}
          <nav className="nav flex-column">
            <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} color="#3b82f6" />} label="Dashboard" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/users" icon={<Users size={20} color="#8b5cf6" />} label="User Management" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/jury" icon={<Calendar size={20} color="#6366f1" />} label="Jury Planning" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/projects" icon={<Briefcase size={20} color="#06b6d4" />} label="Projects Archive" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/analytics" icon={<BarChartIcon size={20} color="#f43f5e" />} label="Analytics Center" isCollapsed={isSidebarCollapsed} />
          </nav>
        </div>

        <div className="sidebar-group px-3 mt-4 mb-2">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title extra-small text-white opacity-50 fw-bold text-uppercase tracking-widest px-2 mb-2">
              Resources & Sync
            </div>
          )}
          <nav className="nav flex-column">
            <SidebarLink to="/admin/resources" icon={<Briefcase size={20} color="#f97316" />} label="Resource Hub" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/messages" icon={<MessageSquare size={20} color="#14b8a6" />} label="Messages" isCollapsed={isSidebarCollapsed} />
            <SidebarLink to="/admin/notifications" icon={<Bell size={20} color="#f43f5e" />} label="Notifications" isCollapsed={isSidebarCollapsed} badge={2} />
            <SidebarLink to="/admin/notes" icon={<FileEdit size={20} color="#94a3b8" />} label="Admin Notes" isCollapsed={isSidebarCollapsed} />
          </nav>
        </div>

        <div className="mt-auto mb-4 px-3 pt-4 border-top border-secondary border-opacity-25">
          <SidebarLink to="/admin/settings" icon={<Settings size={20} color="#94a3b8" />} label="Portal Settings" isCollapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed && (
            <button 
              onClick={logout}
              className="nav-link-custom w-100 text-danger d-flex align-items-center gap-3 border-0 bg-transparent px-3 py-2 rounded-3 hover-bg-light transition-all"
              style={{ textAlign: 'left' }}
            >
              <LogOut size={20} />
              <span className="fw-bold">Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 main-wrapper bg-background">
        <header className="main-header d-flex align-items-center justify-content-between px-4">
          <div className="header-search-container d-flex align-items-center gap-3">
            <Button 
              variant="link" 
              className="p-1 shadow-none border-0 hover-bg-light transition-all" 
              onClick={toggleSidebar}
            >
              <div className="p-2 rounded-circle bg-surface-alt d-flex align-items-center justify-content-center overflow-hidden border">
                <motion.div
                  animate={{ rotate: isSidebarCollapsed ? 0 : 90 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Menu size={20} className="text-primary" />
                </motion.div>
              </div>
            </Button>
            
            <div className="header-search">
              <Search size={18} className="text-muted mx-2" />
              <Form.Control
                type="text"
                placeholder="Search resources, documents..."
                className="border-0 shadow-none bg-transparent"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>

            <div className="breadcrumb-box d-none d-xl-flex align-items-center gap-2 extra-small text-muted fw-bold text-uppercase tracking-wider">
              <span className="opacity-50">Portal</span>
              <ChevronRight size={12} className="opacity-25" />
              <span className="text-primary">Administrator Workspace</span>
            </div>
          </div>

          <div className="header-actions d-flex align-items-center gap-4">
            <style>{`
              .hover-text-danger:hover { color: #ef4444 !important; }
              .dropdown-item:active, .dropdown-item:focus { background-color: transparent !important; color: inherit !important; }
              .btn:focus, .btn:active { outline: none !important; box-shadow: none !important; }
            `}</style>
            {/* Theme toggle */}
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
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
                  {unreadCountForRole('admin') > 0 && (
                    <span
                      className="position-absolute badge rounded-pill bg-primary border border-2 border-white"
                      style={{ 
                        fontSize: '0.65rem', 
                        padding: '2px 5px', 
                        zIndex: 10,
                        top: '-6px',
                        right: '-8px'
                      }}
                    >
                      {unreadCountForRole('admin')}
                    </span>
                  )}
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
                <div className="px-3 py-3 border-bottom bg-surface d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Messages</span>
                  <Link to="/admin/messages" className="extra-small text-primary fw-bold text-decoration-none">View All</Link>
                </div>
                <div className="p-0 max-h-400 overflow-y-auto">
                  {messages.filter(m => m.sender !== 'admin').slice(0, 3).map(msg => (
                    <div key={msg.id} className="dropdown-item px-3 py-3 border-bottom d-flex gap-3 position-relative group">
                      <Link to="/admin/messages" className="d-flex gap-3 text-decoration-none flex-grow-1 overflow-hidden">
                        <div className="avatar-circle small flex-shrink-0" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {msg.sender?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="fw-bold extra-small text-primary">{msg.sender === 'student' ? 'Student' : 'Jury'}</span>
                            <span className="extra-small text-muted">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="extra-small text-muted text-truncate mb-0">{msg.text}</p>
                        </div>
                      </Link>
                      <Button 
                        variant="link" 
                        className="p-1 text-muted hover-text-danger border-0 shadow-none align-self-start mt-n1 me-n1 transition-all" 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          deleteMessage(msg.id);
                        }}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  {messages.filter(m => m.sender !== 'admin').length === 0 && (
                    <div className="p-4 text-center text-muted small">No new messages</div>
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
                    2
                  </span>
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
                <div className="px-3 py-3 border-bottom bg-surface d-flex justify-content-between align-items-center">
                  <span className="fw-bold">Notifications</span>
                  <span className="extra-small text-primary fw-bold cursor-pointer">Mark all as read</span>
                </div>
                <div className="p-4 text-center text-muted small">No new notifications</div>
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
                    <span className="fw-bold text-primary-custom" style={{ fontSize: '0.9rem' }}>
                      {session?.name || 'Admin'}
                    </span>
                    <span className="text-muted extra-small">Administrator</span>
                  </div>
                  <div className="avatar-circle">{session?.name?.charAt(0) || 'A'}</div>
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2">
                <Dropdown.Item as={Link} to="/admin/settings">Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/settings">Settings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2">
                  <LogOut size={16} /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        <div className="admin-content-scroll" style={{ minHeight: 'calc(100vh - 80px)', position: 'relative' }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
