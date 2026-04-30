import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Tabs, Tab, Dropdown, Form } from 'react-bootstrap';
import { 
  Bell, CheckCircle, Mail, AlertCircle, Trash2, Filter, 
  Search, Star, MoreVertical, Calendar, MessageSquare,
  FileText, Clock, Archive
} from 'lucide-react';
import { motion } from 'framer-motion';
import './NotificationsPage.css';

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      title: 'Final Report Feedback',
      desc: 'Dr. Sarah Smith has left a comment on your final report draft.',
      time: '10 minutes ago',
      type: 'feedback',
      unread: true,
      category: 'Academic'
    },
    {
      id: 2,
      title: 'Meeting Scheduled',
      desc: 'A new meeting for "Code Review" has been scheduled for tomorrow at 10:00 AM.',
      time: '2 hours ago',
      type: 'meeting',
      unread: true,
      category: 'Calendar'
    },
    {
      id: 3,
      title: 'Submission Confirmed',
      desc: 'Your interim report has been successfully received by the coordination office.',
      time: 'Yesterday',
      type: 'submission',
      unread: false,
      category: 'System'
    },
    {
      id: 4,
      title: 'Defense Schedule Updated',
      desc: 'The defense schedule for June 2026 has been published. Please check your slot.',
      time: '2 days ago',
      type: 'urgent',
      unread: false,
      category: 'Academic'
    },
    {
      id: 5,
      title: 'New Resource Available',
      desc: 'The "PFE Presentation Template v2" has been added to the Resource Hub.',
      time: '3 days ago',
      type: 'system',
      unread: false,
      category: 'General'
    }
  ];

  const getNotifIcon = (type) => {
    switch (type) {
      case 'feedback': return <MessageSquare size={18} />;
      case 'meeting': return <Calendar size={18} />;
      case 'submission': return <FileText size={18} />;
      case 'urgent': return <AlertCircle size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getNotifColor = (type) => {
    switch (type) {
      case 'feedback': return 'primary';
      case 'meeting': return 'info';
      case 'submission': return 'success';
      case 'urgent': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="notifications-page-layout">
      <Container className="py-5">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold text-navy mb-1">Notifications</h2>
            <p className="text-muted mb-0">Manage your alerts and stay updated with project activity.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="light" className="fw-bold small border text-navy">
              Mark all as read
            </Button>
            <Button variant="primary" className="fw-bold small px-4">
              Clear History
            </Button>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            {/* Tabs for Filtering */}
            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom">
              <Tabs 
                activeKey={activeTab} 
                onSelect={(k) => setActiveTab(k)}
                className="notif-tabs border-0"
              >
                <Tab eventKey="all" title="All Notifications" />
                <Tab eventKey="unread" title="Unread" />
                <Tab eventKey="archived" title="Archived" />
              </Tabs>
              <div className="extra-small text-muted fw-bold pb-2">
                Showing {notifications.length} results
              </div>
            </div>

            {/* Notifications List */}
            <div className="notifications-feed d-flex flex-column gap-3">
              {notifications.map((n, i) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className={`notif-card border-0 shadow-sm ${n.unread ? 'unread' : ''}`}>
                    <Card.Body className="p-4">
                      <div className="d-flex gap-4">
                        <div className={`notif-icon-box bg-${getNotifColor(n.type)} bg-opacity-10 text-${getNotifColor(n.type)}`}>
                          {getNotifIcon(n.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <div>
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <h6 className="fw-bold text-navy mb-0">{n.title}</h6>
                                {n.unread && <Badge bg="primary" className="unread-dot-badge">New</Badge>}
                              </div>
                              <p className="small text-muted mb-3">{n.desc}</p>
                            </div>
                            <div className="text-end">
                              <div className="extra-small text-muted mb-2 d-flex align-items-center gap-1">
                                <Clock size={12} /> {n.time}
                              </div>
                              <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none no-caret">
                                  <MoreVertical size={18} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="border-0 shadow-lg small">
                                  <Dropdown.Item className="py-2"><Star size={14} className="me-2" /> Star notification</Dropdown.Item>
                                  <Dropdown.Item className="py-2"><Archive size={14} className="me-2" /> Archive</Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item className="py-2 text-danger"><Trash2 size={14} className="me-2" /> Delete</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between pt-2">
                            <Badge bg="light" text="dark" className="category-tag border">{n.category}</Badge>
                            <div className="d-flex gap-2">
                              {n.unread && (
                                <Button variant="link" className="p-0 extra-small fw-bold text-primary text-decoration-none">
                                  Mark as read
                                </Button>
                              )}
                              <Button variant="link" className="p-0 extra-small fw-bold text-muted text-decoration-none">
                                View Activity
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Col>

          {/* Sidebar / Preferences */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
              <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                <Bell size={18} className="text-primary" /> Settings
              </h6>
              <div className="notification-settings d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="extra-small fw-bold text-navy">Email Notifications</div>
                  <Form.Check type="switch" defaultChecked />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="extra-small fw-bold text-navy">Desktop Alerts</div>
                  <Form.Check type="switch" defaultChecked />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="extra-small fw-bold text-navy">Weekly Reports</div>
                  <Form.Check type="switch" />
                </div>
              </div>
              <hr />
              <Button variant="outline-primary" className="w-100 fw-bold small py-2">
                Notification Preferences
              </Button>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 p-4 bg-navy text-white overflow-hidden position-relative">
              <div className="position-relative z-index-2">
                <h6 className="fw-bold mb-3">Priority Support</h6>
                <p className="extra-small opacity-75 mb-4">Need help with your project? Contact the administration directly for urgent matters.</p>
                <Button variant="light" className="w-100 fw-bold small text-navy py-2">
                  Contact Support
                </Button>
              </div>
              <div className="decor-circle"></div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotificationsPage;
