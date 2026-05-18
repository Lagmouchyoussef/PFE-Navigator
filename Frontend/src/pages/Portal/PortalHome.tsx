import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';
import { GraduationCap, Users, ClipboardCheck, ShieldCheck, LogOut } from 'lucide-react';

const INTERFACES = [
  {
    role: 'student',
    label: 'Student Interface',
    desc: 'Documents, evaluations and PFE project tracking',
    path: '/student/dashboard',
    icon: GraduationCap,
    accent: '#3b82f6',
  },
  {
    role: 'supervisor',
    label: 'Supervisor Interface',
    desc: 'Manage students, subjects and planning',
    path: '/supervisor/dashboard',
    icon: Users,
    accent: '#8b5cf6',
  },
  {
    role: 'jury',
    label: 'Jury Interface',
    desc: 'Project evaluation and defense sessions',
    path: '/jury/dashboard',
    icon: ClipboardCheck,
    accent: '#f59e0b',
  },
  {
    role: 'admin',
    label: 'Administration Interface',
    desc: 'Global management of users and the portal',
    path: '/admin/dashboard',
    icon: ShieldCheck,
    accent: '#ef4444',
  },
];

const PortalHome: React.FC = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const available = user?.role === 'admin'
    ? INTERFACES
    : INTERFACES.filter(i => i.role === user?.role);

  const cols = Math.min(available.length, 2);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--color-background, #f8fafc)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <img
          src="/logo_emsi.png"
          alt="EMSI"
          style={{ height: 56, marginBottom: 20, objectFit: 'contain' }}
          onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <h3 style={{ fontWeight: 700, color: 'var(--color-navy, #1e293b)', marginBottom: 6 }}>
          PFE Portal — EMSI
        </h3>
        <p style={{ color: 'var(--color-muted, #64748b)', fontSize: '0.95rem' }}>
          Welcome, <strong>{user?.name}</strong>. Select an interface to continue.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '1.5rem',
          width: '100%',
          maxWidth: cols <= 2 ? 580 : 880,
        }}
      >
        {available.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: '0 20px 48px rgba(0,0,0,0.13)' }}
              onClick={() => navigate(item.path)}
              style={{
                background: '#fff',
                borderRadius: 20,
                padding: '2.25rem 1.75rem',
                cursor: 'pointer',
                textAlign: 'center',
                borderTop: `4px solid ${item.accent}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: item.accent + '18',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.2rem',
                }}
              >
                <Icon size={30} style={{ color: item.accent }} />
              </div>
              <h5 style={{ fontWeight: 700, color: 'var(--color-navy, #1e293b)', marginBottom: 8 }}>
                {item.label}
              </h5>
              <p style={{ color: 'var(--color-muted, #64748b)', fontSize: '0.875rem', margin: 0 }}>
                {item.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        onClick={logout}
        style={{
          marginTop: '3rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--color-muted, #64748b)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <LogOut size={14} /> Sign Out
      </motion.button>
    </div>
  );
};

export default PortalHome;
