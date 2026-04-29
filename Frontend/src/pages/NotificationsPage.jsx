import React from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup } from 'react-bootstrap';
import { Bell, CheckCircle, Mail, AlertCircle, Trash2, Filter, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

const NotificationsPage = () => {
  const { notifications = [], markNotificationRead, markAllNotificationsRead } = useApp();

  const getNotifIcon = (type) => {
    switch (type) {
      case 'approved': return <CheckCircle className="text-success" />;
      case 'rejected': return <AlertCircle className="text-danger" />;
      case 'grade':    return <Star className="text-warning" />;
      case 'message':  return <Mail className="text-info" />;
      default:         return <Bell className="text-primary" />;
    }
  };

  return (
    <div className="dashboard-container min-vh-100 pb-5">
      <Container fluid className="px-4 px-xl-5">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="d-flex justify-content-between align-items-end mb-5 pt-4"
        >
          <div>
            <Badge className="badge-premium mb-2">Alert Center</Badge>
            <h1 className="fw-black display-5 mb-1 tracking-tighter text-white">System <span className="text-gradient">Notifications</span></h1>
            <p className="text-muted small mb-0">Stay updated with the latest activity from your supervisor and the jury members.</p>
          </div>
          <div className="d-flex gap-3">
            <Button variant="link" className="text-primary fw-bold text-decoration-none p-0" onClick={markAllNotificationsRead}>
              Mark all as read
            </Button>
            <Button variant="primary" className="bg-gradient-primary border-0 rounded-pill px-4 shadow-lg d-flex align-items-center gap-2">
              <Filter size={18} /> Filter Alerts
            </Button>
          </div>
        </motion.div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="glass-card border-0 overflow-hidden">
              <div className="p-4 border-bottom bg-white bg-opacity-05 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-white">
                  <Bell size={20} className="text-primary" /> Active Notifications
                </h5>
                <div className="search-box-inner px-3 py-1 rounded-pill d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <Search size={14} className="text-muted" />
                  <input type="text" placeholder="Search alerts..." className="bg-transparent border-0 extra-small text-white" style={{ outline: 'none' }} />
                </div>
              </div>
              
              <ListGroup variant="flush">
                {notifications.length === 0 ? (
                  <div className="text-center py-5 text-muted opacity-50">
                    <Bell size={64} className="mb-3" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <ListGroup.Item 
                      key={n.id} 
                      className={`bg-transparent border-0 p-4 transition-all hover-bg-glass ${!n.read ? 'border-start border-primary border-4' : ''}`}
                      onClick={() => markNotificationRead(n.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Row className="align-items-center">
                        <Col xs="auto">
                          <div className={`p-3 rounded-xl bg-opacity-10 bg-${n.type === 'approved' ? 'success' : n.type === 'rejected' ? 'danger' : 'primary'}`}>
                            {getNotifIcon(n.type)}
                          </div>
                        </Col>
                        <Col>
                          <div className="d-flex justify-content-between mb-1">
                            <div className={`fw-bold ${!n.read ? 'text-white' : 'text-muted'}`}>{n.text}</div>
                            <div className="extra-small text-muted">{new Date(n.date).toLocaleString()}</div>
                          </div>
                          <p className="extra-small text-muted mb-0">Action Required: Review recent updates to your PFE workspace.</p>
                        </Col>
                        <Col xs="auto">
                          <Button variant="link" className="text-muted p-0"><Trash2 size={16} /></Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .hover-bg-glass:hover { background: rgba(255,255,255,0.02) !important; }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
