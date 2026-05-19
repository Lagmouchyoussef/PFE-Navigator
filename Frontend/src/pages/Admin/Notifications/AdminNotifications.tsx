import React from 'react';
import {
  Bell, CheckCircle2,
  Archive, UserPlus,
  ShieldAlert, MoreVertical, Trash2, Search, Activity, RefreshCcw, AlertCircle, Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Badge, Form, Dropdown } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';

const typeIcon = (type: string) => {
  switch (type) {
    case 'reminder': return <RefreshCcw />;
    case 'success': return <CheckCircle2 />;
    case 'warning': return <AlertCircle />;
    case 'danger':
    case 'urgent': return <AlertCircle />;
    case 'system': return <ShieldAlert />;
    case 'user': return <UserPlus />;
    case 'archive': return <Archive />;
    default: return <Info />;
  }
};

const typeColor = (type: string) => {
  switch (type) {
    case 'reminder': return 'warning';
    case 'success': return 'success';
    case 'warning': return 'warning';
    case 'danger':
    case 'urgent': return 'danger';
    case 'system': return 'info';
    case 'user': return 'primary';
    default: return 'primary';
  }
};

const timeAgo = (dateStr: string) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const AdminNotifications: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification, unreadNotificationsCount } = useApp();
  const [search, setSearch] = React.useState('');

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCount = (notifications || []).filter(n => n && new Date(n.created_at) >= weekAgo).length;
  const importantCount = (notifications || []).filter(n => n && (n.type === 'urgent' || n.type === 'danger' || n.priority === 'high')).length;

  const filtered = (notifications || []).filter(n =>
    n && (!search || (n.title || n.message || '').toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="admin-notifications-pro-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="mb-5 d-flex justify-content-between align-items-center flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-gradient">Notifications Center</h2>
            <p className="text-muted small mb-0">Stay informed of all important administrative activities.</p>
          </motion.div>

          <div className="d-flex align-items-center px-4 py-2 rounded-pill shadow-sm glass-card" style={{ minWidth: '300px' }}>
            <Search size={18} className="text-muted me-2" />
            <Form.Control
              type="text"
              placeholder="Search for a notification..."
              className="border-0 bg-transparent shadow-none extra-small fw-bold p-0 text-navy"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Unread" value={String(unreadNotificationsCount)} icon={<Bell />} color="primary" trend="Alert" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Total" value={String((notifications || []).length)} icon={<Activity />} color="info" trend="Stats" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="This week" value={String(thisWeekCount)} icon={<RefreshCcw />} color="success" trend="Active" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Important" value={String(importantCount)} icon={<AlertCircle />} color="danger" trend="Urgent" />
          </Col>
        </Row>

        {/* Feed Actions */}
        <div className="d-flex gap-2 mb-4">
          <Button variant="primary" className="fw-bold small rounded-pill px-4 shadow-sm border-0 btn-premium">All</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Unread</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Archives</Button>
          <Button variant="link" className="ms-auto text-muted text-decoration-none extra-small fw-bold border-0 bg-transparent"
            onClick={() => markAllNotificationsRead()}>Mark all as read</Button>
        </div>

        {/* Main Feed */}
        <div className="glass-card shadow-sm border rounded-4 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <Bell size={40} className="mb-3 opacity-25" />
              <p className="fw-bold mb-0">No notifications.</p>
            </div>
          ) : filtered.map((n, idx) => {
            const color = typeColor(n.type || n.notification_type || '');
            const icon = typeIcon(n.type || n.notification_type || '');
            const isUnread = !n.is_read;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`nt-item p-4 d-flex gap-4 align-items-start transition-all cursor-pointer ${isUnread ? 'nt-unread' : ''}`}
              >
                <div className={`p-3 rounded-circle flex-shrink-0 bg-${color} bg-opacity-10 text-${color}`}>
                  {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 22 })}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1 d-flex align-items-center gap-2 text-navy">
                        {n.title || n.message || 'Notification'}
                        {isUnread && <Badge bg="primary" className="p-1 rounded-circle border border-2 border-white"><span className="visually-hidden">New</span></Badge>}
                      </h6>
                      <p className="small text-muted mb-0 lh-base fw-bold opacity-75">{n.message || n.description || ''}</p>
                    </div>
                    <span className="extra-small text-muted fw-bold whitespace-nowrap">{timeAgo(n.created_at)}</span>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    {isUnread && (
                      <Button variant="link" className="p-0 extra-small fw-bold text-primary text-decoration-none"
                        onClick={() => markNotificationRead(n.id)}>Mark as read</Button>
                    )}
                  </div>
                </div>

                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                    {isUnread && (
                      <Dropdown.Item className="small fw-bold" onClick={() => markNotificationRead(n.id)}>
                        <CheckCircle2 size={14} className="me-2"/> Mark as read
                      </Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item className="small fw-bold text-danger" onClick={() => deleteNotification(n.id)}>
                      <Trash2 size={14} className="me-2"/> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </motion.div>
            );
          })}
        </div>
      </Container>
      <style>{`
        .nt-item {
          border-bottom: 1px solid var(--color-border);
        }
        .nt-item:last-child {
          border-bottom: none;
        }
        .nt-item:hover {
          background-color: var(--color-surface-alt);
        }
        .nt-unread {
          background-color: rgba(var(--color-primary-rgb), 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
