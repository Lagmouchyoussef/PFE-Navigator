import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  ChevronLeft, ChevronRight, Plus, 
  Users, Video, MoreHorizontal,
  Bell, CheckCircle, AlertTriangle
} from 'lucide-react';
import '../SupervisorStyles.css';

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Mid-term Review: AI Project",
    student: "Ahmed Khalil",
    date: "2026-05-15",
    time: "10:00 AM - 11:30 AM",
    location: "Salle 402 / Online",
    type: "Review",
    status: "Confirmed"
  },
  {
    id: 2,
    title: "Technical Workshop: Blockchain",
    student: "Sara Kamali",
    date: "2026-05-18",
    time: "02:00 PM - 03:30 PM",
    location: "Lab A-12",
    type: "Meeting",
    status: "Pending"
  },
  {
    id: 3,
    title: "Final Defense Preparation",
    student: "Fatima Zahra",
    date: "2026-05-20",
    time: "09:00 AM - 10:00 AM",
    location: "Online (Teams)",
    type: "Defense Prep",
    status: "Confirmed"
  },
  {
    id: 4,
    title: "Literature Review Sync",
    student: "Mohamed Alaoui",
    date: "2026-05-22",
    time: "11:00 AM - 12:00 PM",
    location: "Professor Office",
    type: "Meeting",
    status: "Confirmed"
  }
];

const Planning = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="sv-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Header */}
        <header className="sv-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-2">Academic Planning</h1>
            <p className="sv-welcome-subtitle mb-0">
              Schedule meetings, defense sessions, and track critical deadlines
            </p>
          </motion.div>
          <div className="d-flex gap-3">
            <Button className="btn-pro-outline d-flex align-items-center gap-2">
              <Bell size={18} /> Manage Notifications
            </Button>
            <Button className="sv-btn-gradient d-flex align-items-center gap-2">
              <Plus size={18} /> New Event
            </Button>
          </div>
        </header>

        <Row className="g-4">
          {/* Calendar Sidebar / Mini-Calendar */}
          <Col lg={4}>
            <Card className="sv-card-premium border-0 shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-black text-navy mb-0">Calendar View</h6>
                <div className="d-flex gap-2">
                  <Button variant="light" className="p-1 rounded-circle border-0"><ChevronLeft size={16} /></Button>
                  <Button variant="light" className="p-1 rounded-circle border-0"><ChevronRight size={16} /></Button>
                </div>
              </div>
              <div className="calendar-grid-mini mb-4">
                {/* Simplified Calendar Placeholder */}
                <div className="text-center extra-small fw-bold text-muted mb-3">MAY 2026</div>
                <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center extra-small opacity-50 fw-black">{d}</div>
                  ))}
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className={`text-center py-1 rounded-pill extra-small fw-bold ${i+1 === 12 ? 'bg-primary text-white shadow-sm' : 'text-navy hover-bg-light'}`} style={{ cursor: 'pointer' }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <hr className="opacity-10" />
              <div className="upcoming-summary mt-4">
                <h6 className="extra-small fw-black text-muted uppercase mb-3">Today's Reminders</h6>
                <div className="d-flex gap-3 mb-3">
                  <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-3 h-fit">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="extra-small fw-black text-navy">Submit Defense Jury List</div>
                    <div className="extra-small text-muted">Due by 05:00 PM today</div>
                  </div>
                </div>
                <div className="d-flex gap-3">
                  <div className="bg-info bg-opacity-10 text-info p-2 rounded-3 h-fit">
                    <Video size={16} />
                  </div>
                  <div>
                    <div className="extra-small fw-black text-navy">Dept. Meeting</div>
                    <div className="extra-small text-muted">Starts in 45 minutes</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="sv-card-premium border-0 shadow-sm p-4 bg-gradient-navy text-white overflow-hidden position-relative">
              <div className="position-relative z-index-1">
                <h6 className="fw-bold mb-3">Next Milestone</h6>
                <div className="display-6 fw-black mb-1">12 Days</div>
                <p className="extra-small opacity-75 mb-0">Until Final Report Submission Deadline</p>
              </div>
              <CalendarIcon className="position-absolute end-0 bottom-0 mb-n4 me-n4 opacity-10" size={140} />
            </Card>
          </Col>

          {/* Timeline / Events List */}
          <Col lg={8}>
            <Card className="sv-card-premium border-0 shadow-sm overflow-hidden h-100">
              <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-black text-navy">Timeline</h5>
                <div className="d-flex gap-2">
                  <Badge bg="light" className="text-muted border px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer">Week</Badge>
                  <Badge bg="primary" className="bg-opacity-10 text-primary border-0 px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer">Month</Badge>
                </div>
              </div>
              <div className="p-0">
                {UPCOMING_EVENTS.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-bottom hover-bg-light transition-all"
                  >
                    <Row className="align-items-center">
                      <Col md={2} className="text-center text-md-start border-md-end mb-3 mb-md-0">
                        <div className="fw-black text-navy h5 mb-0">{event.date.split('-')[2]}</div>
                        <div className="extra-small text-muted fw-bold uppercase">MAY</div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Badge bg="light" className="text-primary extra-small border-0 px-2 py-1 rounded-pill">{event.type}</Badge>
                          <span className="extra-small text-muted fw-bold">• {event.time}</span>
                        </div>
                        <h6 className="fw-black text-navy mb-1">{event.title}</h6>
                        <div className="d-flex align-items-center gap-3">
                          <div className="extra-small text-muted d-flex align-items-center gap-1">
                            <Users size={12} /> {event.student}
                          </div>
                          <div className="extra-small text-muted d-flex align-items-center gap-1">
                            <MapPin size={12} /> {event.location}
                          </div>
                        </div>
                      </Col>
                      <Col md={3} className="text-md-end mt-3 mt-md-0">
                        <Badge bg={event.status === 'Confirmed' ? 'success' : 'warning'} className="bg-opacity-10 px-3 py-2 rounded-pill fw-bold" style={{ color: `var(--bs-${event.status === 'Confirmed' ? 'success' : 'warning'})`, fontSize: '10px' }}>
                          {event.status}
                        </Badge>
                      </Col>
                      <Col md={1} className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none">
                            <MoreHorizontal size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                            <Dropdown.Item className="py-2">Reschedule</Dropdown.Item>
                            <Dropdown.Item className="py-2">Cancel Event</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="py-2 text-primary fw-bold">Send Reminder</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Col>
                    </Row>
                  </motion.div>
                ))}
              </div>
              <div className="p-4 text-center">
                <Button variant="link" className="text-primary extra-small fw-black text-decoration-none">
                  Load More Events <ChevronRight size={14} />
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Planning;
