import React from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, Badge } from 'react-bootstrap';
import { 
  Bell, CheckCircle, Mail, AlertCircle, Calendar, 
  Settings, Clock, MessageSquare, Activity, RefreshCcw, Search, MoreVertical
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

const NOTIFICATIONS_DATA = [
  { id: 1, title: 'New evaluation assigned', time: '2 hours ago', desc: 'The project "Blockchain Certificate Verification" requires your evaluation', type: 'eval', unread: true, icon: <Activity size={20} />, color: 'primary' as const },
  { id: 2, title: 'Defense scheduled', time: '5 hours ago', desc: 'Defense scheduled for May 5th at 9:00 in Room A-204', type: 'sched', unread: true, icon: <Calendar size={20} />, color: 'info' as const },
  { id: 3, title: 'New message', time: 'Yesterday', desc: 'Prof. Martin sent you a message regarding the evaluation grid', type: 'msg', unread: false, icon: <MessageSquare size={20} />, color: 'success' as const },
  { id: 4, title: 'System Update', time: '2 days ago', desc: 'New predictive analysis features available', type: 'system', unread: false, icon: <RefreshCcw size={20} />, color: 'warning' as const },
  { id: 5, title: 'Evaluation completed', time: '3 days ago', desc: 'Your evaluation for Mohamed Alaoui has been submitted successfully', type: 'eval', unread: false, icon: <CheckCircle size={20} />, color: 'success' as const },
  { id: 6, title: 'Deadline approaching', time: '3 days ago', desc: 'The evaluation for Fatima Zahra must be completed by May 7th', type: 'urgent', unread: false, icon: <AlertCircle size={20} />, color: 'danger' as const },
];

const NotificationsPage: React.FC = () => {
  const { session } = useApp();
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
            <p className="text-muted small mb-0">Stay informed about all important activities on your platform, {session?.name}.</p>
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
            <StatCard label="Unread" value="2" color="primary" icon={<Bell />} trend="Now" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Total" value="7" color="info" icon={<Activity />} trend="Overall" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="This Week" value="24" color="success" icon={<RefreshCcw />} trend="+5" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Urgent" value="3" color="danger" icon={<AlertCircle />} trend="Critical" />
          </Col>
        </Row>

        {/* Notifications List */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Recent Notifications</h5>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none">Mark all as read</Button>
          </div>
          <div className="d-flex flex-column">
            {NOTIFICATIONS_DATA.map((notif) => (
              <div key={notif.id} className={`p-4 d-flex gap-4 border-bottom transition-all ${notif.unread ? 'border-start border-primary border-3 bg-surface-alt' : 'hover-bg-surface'}`}>
                <div className={`p-3 rounded-4 bg-${notif.color}-soft text-${notif.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                  {notif.icon}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className={`mb-0 small ${notif.unread ? 'fw-bold text-primary' : 'fw-semibold text-muted'}`}>{notif.title}</h6>
                    <span className="extra-small text-muted fw-bold" style={{ whiteSpace: 'nowrap' }}>{notif.time}</span>
                  </div>
                  <p className={`extra-small mb-0 lh-base ${notif.unread ? 'text-navy' : 'text-muted'}`}>{notif.desc}</p>
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg rounded-3 extra-small bg-surface">
                    <Dropdown.Item className="fw-bold">Mark as read</Dropdown.Item>
                    <Dropdown.Item className="fw-bold text-danger">Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ))}
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
