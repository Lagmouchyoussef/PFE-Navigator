import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCircle, AlertCircle, Calendar,
  MessageSquare, Activity, RefreshCcw, Search,
  MoreVertical, Star, FileText, Trash2, Info,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
};

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  approved: { icon: <CheckCircle size={20} />, color: 'success', label: 'Approved' },
  rejected: { icon: <AlertCircle size={20} />, color: 'danger',  label: 'Rejected' },
  grade:    { icon: <Star size={20} />,        color: 'warning', label: 'Grade' },
  defense:  { icon: <Calendar size={20} />,    color: 'info',    label: 'Defense' },
  message:  { icon: <MessageSquare size={20} />, color: 'primary', label: 'Message' },
  info:     { icon: <Info size={20} />,         color: 'secondary', label: 'Info' },
};

const FILTERS = [
  { key: 'all',      label: 'All' },
  { key: 'unread',   label: 'Unread' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'grade',    label: 'Grades' },
  { key: 'defense',  label: 'Defense' },
  { key: 'message',  label: 'Messages' },
  { key: 'info',     label: 'Info' },
];

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    deleteNotification,
    markAllNotificationsRead,
    user,
    unreadNotificationsCount,
  } = useApp();

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const filtered = notifications.filter(n => {
    const matchSearch =
      !searchTerm ||
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      activeFilter === 'all' ||
      (activeFilter === 'unread' ? !n.is_read : n.type === activeFilter);
    return matchSearch && matchFilter;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleNotifClick = async (notif: any) => {
    if (!notif.is_read) await markNotificationRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  const stats = [
    { label: 'Unread',    value: unreadNotificationsCount, color: 'primary',   icon: Bell },
    { label: 'Total',     value: notifications.length,     color: 'info',      icon: Activity },
    { label: 'Approved',  value: notifications.filter(n => n.type === 'approved').length, color: 'success', icon: CheckCircle },
    { label: 'Rejected',  value: notifications.filter(n => n.type === 'rejected').length, color: 'danger',  icon: AlertCircle },
  ];

  return (
    <div className="notifications-modern-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notification Center</h2>
            <p className="text-muted small mb-0">All alerts from your supervisor, jury, and admin — {user?.name}.</p>
          </div>
          <InputGroup size="sm" className="bg-surface rounded-pill border px-3 shadow-none" style={{ width: '280px' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16} /></InputGroup.Text>
            <Form.Control
              placeholder="Search notifications..."
              className="bg-transparent border-0 shadow-none py-2 small fw-bold text-primary-custom"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col key={i} lg={3} sm={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm d-flex align-items-center gap-3 border-start border-4 border-${s.color}`}>
                <div className={`p-3 rounded-4 bg-${s.color}-soft text-${s.color}`}>
                  <s.icon size={22} />
                </div>
                <div>
                  <div className="fs-4 fw-bold text-navy">{s.value}</div>
                  <div className="extra-small text-muted fw-bold text-uppercase">{s.label}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Filter Tabs + Mark All */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button
                key={f.key}
                type="button"
                className={`btn btn-sm rounded-pill fw-bold extra-small px-3 ${activeFilter === f.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => { setActiveFilter(f.key); setVisibleCount(20); }}
              >
                {f.label}
                {f.key === 'unread' && unreadNotificationsCount > 0 && (
                  <Badge bg="danger" pill className="ms-1" style={{ fontSize: '9px' }}>{unreadNotificationsCount}</Badge>
                )}
              </button>
            ))}
          </div>
          <Button
            variant="link"
            className="extra-small fw-bold text-primary p-0 text-decoration-none shadow-none"
            onClick={markAllNotificationsRead}
          >
            Mark all as read
          </Button>
        </div>

        {/* List */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="d-flex flex-column">
            {filtered.length === 0 && (
              <div className="p-5 text-center text-muted">
                <Bell size={40} className="mb-3 opacity-25" />
                <p className="fw-bold small">{searchTerm ? 'No notifications match your search.' : 'No notifications in this category.'}</p>
              </div>
            )}
            {visible.map(notif => {
              const meta = TYPE_META[notif.type] || TYPE_META.info;
              const isUnread = !notif.is_read;
              return (
                <div
                  key={notif.id}
                  className={`p-4 d-flex gap-4 border-bottom transition-all ${isUnread ? 'border-start border-primary border-3 bg-primary-soft' : 'hover-bg-surface'}`}
                >
                  {/* Icon */}
                  <div className={`p-3 rounded-4 bg-${meta.color}-soft text-${meta.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div
                    className="flex-grow-1 overflow-hidden"
                    style={{ cursor: notif.link ? 'pointer' : 'default' }}
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h6 className={`mb-0 small ${isUnread ? 'fw-bold text-primary' : 'fw-semibold text-navy'}`}>
                          {notif.title || meta.label}
                        </h6>
                        <Badge
                          className={`extra-small px-2 py-1 bg-${meta.color}-soft text-${meta.color} border-0 text-capitalize`}
                          style={{ fontSize: '10px' }}
                        >
                          {meta.label}
                        </Badge>
                        {isUnread && (
                          <span
                            className="bg-primary rounded-circle d-inline-block"
                            style={{ width: 7, height: 7 }}
                          />
                        )}
                      </div>
                      <span className="extra-small text-muted fw-bold flex-shrink-0 ms-2">
                        {relativeTime(notif.created_at)}
                      </span>
                    </div>
                    <p className={`extra-small mb-0 lh-base ${isUnread ? 'text-navy fw-bold' : 'text-muted fw-bold opacity-75'}`}>
                      {notif.message}
                    </p>
                    {notif.link && (
                      <span className="extra-small text-primary fw-bold mt-1 d-inline-block">
                        <FileText size={11} className="me-1" />
                        Tap to view →
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none">
                      <MoreVertical size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="border-0 shadow-lg rounded-3 extra-small glass-card">
                      {isUnread && (
                        <Dropdown.Item
                          className="fw-bold d-flex align-items-center gap-2"
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <CheckCircle size={14} className="text-success" /> Mark as read
                        </Dropdown.Item>
                      )}
                      {notif.link && (
                        <Dropdown.Item
                          className="fw-bold d-flex align-items-center gap-2"
                          onClick={() => handleNotifClick(notif)}
                        >
                          <FileText size={14} className="text-primary" /> Go to page
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        className="fw-bold text-danger d-flex align-items-center gap-2"
                        onClick={() => deleteNotification(notif.id)}
                      >
                        <Trash2 size={14} /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="p-3 text-center bg-surface-alt">
              <Button
                variant="link"
                className="extra-small fw-bold text-primary text-decoration-none"
                onClick={() => setVisibleCount(c => c + 20)}
              >
                <RefreshCcw size={14} className="me-2" />
                Show more ({filtered.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default NotificationsPage;
