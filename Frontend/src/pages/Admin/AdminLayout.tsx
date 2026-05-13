import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, BarChart as BarChartIcon, 
  MessageSquare, Bell, FileEdit, Settings, 
  LogOut, Search, Menu, X, ChevronRight, Briefcase, 
  Sun, Moon, User
} from 'lucide-react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import SidebarLink from '../../components/shared/SidebarLink';

const AdminLayout: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { session, logout, theme, setTheme, unreadCountForRole, messages, deleteMessage } = useApp();

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

  const adminUnreadMsgCount = unreadCountForRole ? unreadCountForRole('admin') : 0;

  return (
    <div className="app-shell d-flex" style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <aside 
        ref={sidebarRef}
        className={`sidebar-nav shadow-lg flex-shrink-0 ${isSidebarCollapsed ? 'collapsed' : ''}`}
        style={{ width: isSidebarCollapsed ? '0px' : `${sidebarWidth}px`, transition: isResizing ? 'none' : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <div className="sidebar-header d-flex align-items-center px-4 py-3" style={{ height: '80px' }}>
          {!isSidebarCollapsed && (
            <div className="d-flex align-items-center animate-fade-in overflow-hidden flex-grow-1">
              <img src="/logo_emsi.png" alt="EMSI Logo" className="logo-img-sidebar" />
            </div>
          )}
        </div>

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title">
              PRINCIPAL
            </div>
          )}
          <nav className="nav flex-column gap-1 px-3">
            <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />} iconClassName="icon-primary" label={!isSidebarCollapsed && "Tableau de Bord"} />
            <SidebarLink to="/admin/users" icon={<Users size={20} />} iconClassName="icon-indigo" label={!isSidebarCollapsed && "Gestion Utilisateurs"} />
            <SidebarLink to="/admin/jury" icon={<Calendar size={20} />} iconClassName="icon-success" label={!isSidebarCollapsed && "Planning Jury"} />
            <SidebarLink to="/admin/projects" icon={<Briefcase size={20} />} iconClassName="icon-warning" label={!isSidebarCollapsed && "Archive Projets"} />
            <SidebarLink to="/admin/analytics" icon={<BarChartIcon size={20} />} iconClassName="icon-danger" label={!isSidebarCollapsed && "Analyses"} />
          </nav>
        </div>

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title">
              COMMUNICATION
            </div>
          )}
          <nav className="nav flex-column gap-1 px-3">
            <SidebarLink to="/admin/resources" icon={<Briefcase size={20} />} iconClassName="icon-orange" label={!isSidebarCollapsed && "Ressources"} />
            <SidebarLink to="/admin/messages" icon={<MessageSquare size={20} />} iconClassName="icon-teal" label={!isSidebarCollapsed && "Messages"} badge={adminUnreadMsgCount > 0 ? adminUnreadMsgCount : null} />
            <SidebarLink to="/admin/notifications" icon={<Bell size={20} />} iconClassName="icon-rose" label={!isSidebarCollapsed && "Notifications"} badge={2} />
            <SidebarLink to="/admin/notes" icon={<FileEdit size={20} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Notes"} />
          </nav>
        </div>

        <div className="sidebar-footer mt-auto p-3 border-top border-secondary border-opacity-10">
          <div className="d-flex flex-column gap-1">
            <SidebarLink to="/admin/settings" icon={<Settings size={18} />} iconClassName="icon-slate" label={!isSidebarCollapsed && "Paramètres"} />
            {!isSidebarCollapsed && (
              <button 
                onClick={logout}
                className="nav-link-custom w-100 text-danger border-0 bg-transparent"
                style={{ textAlign: 'left' }}
              >
                <div className="sidebar-icon-wrapper">
                  <LogOut size={18} />
                </div>
                <span className="fw-bold">Déconnexion</span>
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
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <Button 
              variant="link" 
              className="p-1 text-navy shadow-none border-0 hover-bg-light transition-all" 
              onClick={toggleSidebar}
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
                placeholder="Rechercher des ressources, documents..."
                className="border-0 shadow-none bg-transparent text-primary-custom fw-bold"
              />
            </div>
            {session && (
              <div className="breadcrumb-box d-none d-xl-flex align-items-center gap-2 extra-small text-muted fw-bold text-uppercase tracking-wider">
                <span className="opacity-50">Portail</span>
                <ChevronRight size={12} className="opacity-25" />
                <span className="text-primary">Espace Admin</span>
              </div>
            )}
          </div>

          <div className="header-actions d-flex align-items-center gap-3">
            <Button 
              variant="link" 
              className="p-2 text-muted shadow-none hover-bg-surface-alt rounded-circle transition-all" 
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre"}
            >
              {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-2 text-muted shadow-none position-relative border-0 no-caret hover-bg-surface-alt rounded-circle"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <MessageSquare size={20} />
                  {adminUnreadMsgCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white" style={{ fontSize: '0.6rem', padding: '3px 5px' }}>
                      {adminUnreadMsgCount}
                    </span>
                  )}
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px', borderRadius: '16px' }}>
                <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                  <span className="fw-bold text-navy">Messages Directs</span>
                  <Link to="/admin/messages" className="extra-small text-primary fw-bold text-decoration-none">Voir tout</Link>
                </div>
                <div className="p-0 overflow-y-auto" style={{ maxHeight: '400px' }}>
                  {messages.filter(m => m.sender !== 'admin').length === 0 ? (
                    <div className="p-4 text-center text-muted extra-small fw-bold">Aucun nouveau message</div>
                  ) : (
                    messages.filter(m => m.sender !== 'admin').slice(0, 3).map(msg => (
                      <div key={msg.id} className="dropdown-item px-3 py-3 border-bottom d-flex gap-3 position-relative hover-bg-surface-alt">
                        <div className="avatar-circle small flex-shrink-0" style={{ width: '32px', height: '32px', background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                          {msg.sender?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="fw-bold extra-small text-primary text-capitalize">{msg.sender}</span>
                            <span className="extra-small text-muted" style={{ fontSize: '10px' }}>{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="extra-small text-muted text-truncate mb-0 fw-bold">{msg.text}</p>
                        </div>
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
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="position-relative">
                  <Bell size={20} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white" style={{ fontSize: '0.6rem', padding: '3px 5px' }}>
                    2
                  </span>
                </motion.div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px', borderRadius: '16px' }}>
                <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                  <span className="fw-bold text-navy">Notifications</span>
                  <Link to="/admin/notifications" className="extra-small text-primary fw-bold text-decoration-none">Tout marquer</Link>
                </div>
                <div className="p-2">
                  <div className="p-3 dropdown-item rounded-3 border-bottom-dashed-light hover-bg-surface-alt">
                    <div className="fw-bold extra-small text-navy mb-1">Nouveau Rapport</div>
                    <div className="extra-small text-muted">Ahmed Khalil a soumis son rapport final.</div>
                    <div className="extra-small text-primary mt-2 fw-bold" style={{ fontSize: '10px' }}>Il y a 10 minutes</div>
                  </div>
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 shadow-none d-flex align-items-center gap-3 text-decoration-none no-caret"
              >
                <div className="d-flex flex-column text-end d-none d-md-flex">
                  <span className="fw-bold text-navy small">
                    {session?.name || 'Admin'}
                  </span>
                  <span className="text-muted fw-black uppercase" style={{ fontSize: '10px', letterSpacing: '0.5px' }}>Administrateur</span>
                </div>
                <div className="avatar-circle">{session?.name?.charAt(0) || 'A'}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2 rounded-4">
                <Dropdown.Item as={Link} to="/admin/settings" className="rounded-3 py-2 small fw-bold text-navy">
                  Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/settings" className="rounded-3 py-2 small fw-bold text-navy">
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2 rounded-3 py-2 small fw-bold">
                  <LogOut size={16} /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        <div className="content-area flex-grow-1 px-4">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-100"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
