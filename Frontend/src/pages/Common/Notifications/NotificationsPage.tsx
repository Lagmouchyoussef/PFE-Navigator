import React from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { 
  Bell, CheckCircle, Mail, AlertCircle, Calendar, 
  Settings, Clock, MessageSquare, Activity, RefreshCcw, Search, MoreVertical
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

const NotificationsPage: React.FC = () => {
  const { 
    notifications, 
    markNotificationRead, 
    deleteNotification, 
    markAllNotificationsRead,
    user,
    unreadNotificationsCount
  } = useApp();
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const handleShowMore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setHasMore(false);
      alert("All notifications have been loaded.");
    }, 800);
  };

  return (
    <div className="notifications-modern-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notification Center</h2>
            <p className="text-muted small mb-0">Stay informed about all important activities on your platform, {user?.name}.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="bg-surface rounded-pill border px-3 shadow-none" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Search notifications..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-primary-custom"
              />
            </InputGroup>
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Settings size={18} /> Manage
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} sm={6}>
            <StatCard label="Unread" value={unreadNotificationsCount.toString()} color="primary" icon={<Bell />} trend="New" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Total" value={notifications.length.toString()} color="info" icon={<Activity />} trend="Global" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Messages" value={notifications.filter(n => n.type === 'message').length.toString()} color="success" icon={<MessageSquare />} trend="Chat" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Urgent" value={notifications.filter(n => n.type === 'rejected').length.toString()} color="danger" icon={<AlertCircle />} trend="Critical" />
          </Col>
        </Row>

        {/* Notifications List */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <h5 className="fw-bold mb-0 text-navy">Recent Notifications</h5>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none shadow-none" onClick={markAllNotificationsRead}>
              Mark all as read
            </Button>
          </div>
          <div className="d-flex flex-column">
            {notifications.length === 0 && (
              <div className="p-5 text-center text-muted fw-bold extra-small opacity-50">
                You have no notifications at the moment.
              </div>
            )}
            {notifications.map((notif) => {
              const getIcon = () => {
                switch(notif.type) {
                  case 'approved': return <CheckCircle size={20} />;
                  case 'rejected': return <AlertCircle size={20} />;
                  case 'message': return <MessageSquare size={20} />;
                  case 'defense': return <Calendar size={20} />;
                  default: return <Bell size={20} />;
                }
              };
              const getColor = () => {
                switch(notif.type) {
                  case 'approved': return 'success';
                  case 'rejected': return 'danger';
                  case 'message': return 'primary';
                  case 'defense': return 'info';
                  default: return 'warning';
                }
              };

              return (
                <div key={notif.id} className={`p-4 d-flex gap-4 border-bottom transition-all ${!notif.read ? 'border-start border-primary border-3 bg-primary-soft' : 'hover-bg-surface'}`}>
                  <div className={`p-3 rounded-4 bg-${getColor()}-soft text-${getColor()} flex-shrink-0`} style={{ height: 'fit-content' }}>
                    {getIcon()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden" onClick={() => markNotificationRead(notif.id)}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className={`mb-0 small ${!notif.read ? 'fw-bold text-primary' : 'fw-semibold text-muted'}`}>
                        {notif.type === 'message' ? 'New Message' : notif.type === 'approved' ? 'Document Approved' : notif.type === 'rejected' ? 'Action Required' : 'Notification'}
                      </h6>
                      <span className="extra-small text-muted fw-bold" style={{ whiteSpace: 'nowrap' }}>
                        {new Date(notif.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className={`extra-small mb-0 lh-base ${!notif.read ? 'text-navy fw-bold' : 'text-muted fw-bold opacity-75'}`}>{notif.text}</p>
                  </div>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                    <Dropdown.Menu className="border-0 shadow-lg rounded-3 extra-small glass-card">
                      {!notif.read && <Dropdown.Item className="fw-bold" onClick={() => markNotificationRead(notif.id)}>Mark as read</Dropdown.Item>}
                      <Dropdown.Item className="fw-bold text-danger" onClick={() => deleteNotification(notif.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              );
            })}
          </div>
          <div className="p-3 text-center bg-surface-alt">
            <Button 
              variant="link" 
              className="extra-small fw-bold text-primary text-decoration-none"
              onClick={handleShowMore}
              disabled={loading || !hasMore}
            >
              {loading ? (
                <><RefreshCcw size={14} className="me-2 animate-spin" /> Loading...</>
              ) : hasMore ? (
                "Show more notifications"
              ) : (
                "No more notifications"
              )}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NotificationsPage;
