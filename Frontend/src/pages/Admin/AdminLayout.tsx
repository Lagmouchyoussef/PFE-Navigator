import React, { useState } from 'react';
import { useLocation, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Calendar, BarChart as BarChartIcon, 
  MessageSquare, Bell, FileEdit, Settings, 
  LogOut, Search, Menu, X, ChevronRight, Briefcase, 
  Sun, Moon
} from 'lucide-react';
import { Button, Dropdown, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import SidebarLink from '../../components/shared/SidebarLink';

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { session, logout, theme, setTheme, unreadCountForRole, messages, deleteMessage } = useApp();

  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const adminUnreadMsgCount = unreadCountForRole ? unreadCountForRole('admin') : 0;

  return (
    <div className="app-shell">
      <aside className={`sidebar-nav ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header d-flex align-items-center px-4 py-4" style={{ minHeight: '72px' }}>
          {!isSidebarCollapsed && (
            <div className="d-flex align-items-center overflow-hidden flex-grow-1">
              <img src="/logo_emsi.png" alt="EMSI Logo" className="logo-img-sidebar" style={{ maxHeight: '40px' }} />
            </div>
          )}
        </div>

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title">
              Principal
            </div>
          )}
          <nav className="nav flex-column gap-1">
            <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} color="#3b82f6" />} label={!isSidebarCollapsed && "Tableau de Bord"} />
            <SidebarLink to="/admin/users" icon={<Users size={20} color="#6366f1" />} label={!isSidebarCollapsed && "Gestion Utilisateurs"} />
            <SidebarLink to="/admin/jury" icon={<Calendar size={20} color="#10b981" />} label={!isSidebarCollapsed && "Planning Jury"} />
            <SidebarLink to="/admin/projects" icon={<Briefcase size={20} color="#f59e0b" />} label={!isSidebarCollapsed && "Archive Projets"} />
            <SidebarLink to="/admin/analytics" icon={<BarChartIcon size={20} color="#ef4444" />} label={!isSidebarCollapsed && "Analyses"} />
          </nav>
        </div>

        <div className="sidebar-group">
          {!isSidebarCollapsed && (
            <div className="sidebar-group-title">
              Communication
            </div>
          )}
          <nav className="nav flex-column gap-1">
            <SidebarLink to="/admin/resources" icon={<Briefcase size={20} color="#f97316" />} label={!isSidebarCollapsed && "Ressources"} />
            <SidebarLink to="/admin/messages" icon={<MessageSquare size={20} color="#14b8a6" />} label={!isSidebarCollapsed && "Messages"} badge={adminUnreadMsgCount > 0 ? adminUnreadMsgCount : null} />
            <SidebarLink to="/admin/notifications" icon={<Bell size={20} color="#f43f5e" />} label={!isSidebarCollapsed && "Notifications"} badge={2} />
            <SidebarLink to="/admin/notes" icon={<FileEdit size={20} color="#94a3b8" />} label={!isSidebarCollapsed && "Notes"} />
          </nav>
        </div>

        <div className="mt-auto mb-4 px-3 pt-4 border-top border-secondary border-opacity-25">
          <SidebarLink to="/admin/settings" icon={<Settings size={20} />} label={!isSidebarCollapsed && "Paramètres"} />
          {!isSidebarCollapsed && (
            <button 
              onClick={logout}
              className="nav-link-custom w-100 text-danger border-0 bg-transparent px-3 py-2"
              style={{ textAlign: 'left' }}
            >
              <LogOut size={20} />
              <span className="fw-bold">Déconnexion</span>
            </button>
          )}
        </div>
      </aside>

      <main className="main-wrapper">
        <header className="main-header px-4">
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
          </div>

          <div className="header-actions d-flex align-items-center gap-3">
            <Button 
              variant="link" 
              className="p-2 text-muted shadow-none hover-bg-surface-alt rounded-circle" 
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            >
              {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-2 text-muted shadow-none position-relative border-0 no-caret hover-bg-surface-alt rounded-circle"
              >
                <Bell size={20} />
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white" style={{ fontSize: '0.6rem', marginTop: '8px', marginLeft: '-8px' }}>
                  2
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
                <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                  <span className="fw-bold text-navy">Notifications</span>
                  <Link to="/admin/notifications" className="extra-small text-primary fw-bold text-decoration-none">Voir tout</Link>
                </div>
                <div className="p-2">
                  <div className="p-3 dropdown-item rounded-3 border-bottom-dashed-light">
                    <div className="fw-bold extra-small text-navy mb-1">Nouveau Rapport</div>
                    <div className="extra-small text-muted">Ahmed Khalil a soumis son rapport final.</div>
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
                  <span className="text-muted extra-small fw-bold uppercase letter-spacing-1">Administrateur</span>
                </div>
                <div className="avatar-circle">{session?.name?.charAt(0) || 'A'}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2 rounded-4">
                <Dropdown.Item as={Link} to="/admin/settings" className="rounded-3 py-2 extra-small fw-bold">
                  <Settings size={16} className="me-2 text-muted" /> Profil & Paramètres
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2 rounded-3 py-2 extra-small fw-bold">
                  <LogOut size={16} /> Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>

        <div className="p-4 overflow-auto flex-grow-1">
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
