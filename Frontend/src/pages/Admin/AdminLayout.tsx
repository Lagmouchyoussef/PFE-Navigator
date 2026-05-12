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

        <div className="sidebar-group px-3 mt-4">
          {!isSidebarCollapsed && (
            <div className="extra-small text-muted fw-bold text-uppercase px-2 mb-2 opacity-50">
              Principal
            </div>
          )}
          <nav className="nav flex-column gap-1">
            <SidebarLink to="/admin/dashboard" icon={<LayoutDashboard size={20} />} label={!isSidebarCollapsed && "Tableau de Bord"} />
            <SidebarLink to="/admin/users" icon={<Users size={20} />} label={!isSidebarCollapsed && "Gestion Utilisateurs"} />
            <SidebarLink to="/admin/jury" icon={<Calendar size={20} />} label={!isSidebarCollapsed && "Planning Jury"} />
            <SidebarLink to="/admin/projects" icon={<Briefcase size={20} />} label={!isSidebarCollapsed && "Archive Projets"} />
            <SidebarLink to="/admin/analytics" icon={<BarChartIcon size={20} />} label={!isSidebarCollapsed && "Analyses"} />
          </nav>
        </div>

        <div className="sidebar-group px-3 mt-4">
          {!isSidebarCollapsed && (
            <div className="extra-small text-muted fw-bold text-uppercase px-2 mb-2 opacity-50">
              Communication
            </div>
          )}
          <nav className="nav flex-column gap-1">
            <SidebarLink to="/admin/resources" icon={<Briefcase size={20} />} label={!isSidebarCollapsed && "Ressources"} />
            <SidebarLink to="/admin/messages" icon={<MessageSquare size={20} />} label={!isSidebarCollapsed && "Messages"} badge={adminUnreadMsgCount > 0 ? adminUnreadMsgCount : null} />
            <SidebarLink to="/admin/notifications" icon={<Bell size={20} />} label={!isSidebarCollapsed && "Notifications"} badge={2} />
            <SidebarLink to="/admin/notes" icon={<FileEdit size={20} />} label={!isSidebarCollapsed && "Notes"} />
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
        <header className="main-header">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <Button 
              variant="link" 
              className="p-2 text-muted border-0 shadow-none" 
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </Button>
            
            <div className="header-search flex-grow-1 maxWidth-700 glass-card px-3 d-flex align-items-center" style={{ height: '42px', backgroundColor: 'var(--color-background)' }}>
              <Search size={18} className="text-muted" />
              <Form.Control
                type="text"
                placeholder="Rechercher des ressources, documents..."
                className="border-0 shadow-none bg-transparent small fw-bold"
              />
            </div>
          </div>

          <div className="header-actions d-flex align-items-center gap-4">
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}>
              {isDarkMode ? <Sun size={20} className="text-warning" /> : <Moon size={20} />}
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 text-muted shadow-none position-relative border-0 no-caret"
              >
                <MessageSquare size={20} />
                {adminUnreadMsgCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary border border-2 border-white" style={{ fontSize: '0.6rem' }}>
                    {adminUnreadMsgCount}
                  </span>
                )}
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-3 p-0 overflow-hidden" style={{ width: '320px' }}>
                <div className="px-3 py-3 border-bottom d-flex justify-content-between align-items-center">
                  <span className="fw-bold text-navy">Messages</span>
                  <Link to="/admin/messages" className="extra-small text-primary fw-bold text-decoration-none">Voir tout</Link>
                </div>
                <div className="p-0 overflow-y-auto" style={{ maxHeight: '400px' }}>
                  {messages.filter(m => m.sender !== 'admin').slice(0, 3).map(msg => (
                    <div key={msg.id} className="dropdown-item px-3 py-3 border-bottom d-flex gap-3 position-relative">
                      <div className="avatar-circle small flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                        {msg.sender?.charAt(0).toUpperCase()}
                      </div>
                      <div className="overflow-hidden flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold extra-small text-primary">{msg.sender === 'student' ? 'Étudiant' : 'Jury'}</span>
                          <span className="extra-small text-muted">{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="extra-small text-muted text-truncate mb-0 fw-bold">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                className="p-0 border-0 shadow-none d-flex align-items-center gap-3 text-decoration-none"
              >
                <div className="d-flex flex-column text-end d-none d-md-flex">
                  <span className="fw-bold text-navy small">
                    {session?.name || 'Admin'}
                  </span>
                  <span className="text-muted extra-small fw-bold">Administrateur</span>
                </div>
                <div className="avatar-circle" style={{ width: '36px', height: '36px' }}>{session?.name?.charAt(0) || 'A'}</div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg mt-2">
                <Dropdown.Item as={Link} to="/admin/settings">Profil</Dropdown.Item>
                <Dropdown.Item as={Link} to="/admin/settings">Paramètres</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout} className="text-danger d-flex align-items-center gap-2">
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
