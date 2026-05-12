import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  ChevronLeft, ChevronRight, Plus, 
  Users, Video, MoreHorizontal,
  Bell, CheckCircle, AlertTriangle
} from 'lucide-react';

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
    <div className="supervisor-planning-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Academic Planning</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Schedule meetings, defense sessions, and track critical deadlines
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Bell size={18} /> Notifications
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm">
              <Plus size={18} /> New Event
            </Button>
          </div>
        </header>

        <Row className="g-4">
          {/* Calendar Sidebar / Mini-Calendar */}
          <Col lg={4}>
            <Card className="glass-card border-0 shadow-sm border p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-navy mb-0">Calendar View</h6>
                <div className="d-flex gap-2">
                  <Button variant="link" className="p-1 rounded-circle border-0 text-muted hover-bg-surface-alt"><ChevronLeft size={16} /></Button>
                  <Button variant="link" className="p-1 rounded-circle border-0 text-muted hover-bg-surface-alt"><ChevronRight size={16} /></Button>
                </div>
              </div>
              <div className="calendar-grid-mini mb-4">
                <div className="text-center extra-small fw-bold text-muted mb-3 opacity-75 uppercase">May 2026</div>
                <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center extra-small opacity-25 fw-bold">{d}</div>
                  ))}
                  {[...Array(31)].map((_, i) => (
                    <div key={i} className={`text-center py-2 rounded-pill extra-small fw-bold transition-all ${i+1 === 12 ? 'bg-primary text-white shadow-sm' : 'text-navy hover-bg-surface-alt opacity-75'}`} style={{ cursor: 'pointer' }}>
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
              <hr className="opacity-10" />
              <div className="upcoming-summary mt-4">
                <h6 className="extra-small fw-bold text-muted text-uppercase mb-3 opacity-50">Today's Reminders</h6>
                <div className="d-flex gap-3 mb-3 p-3 rounded-4 bg-warning-soft">
                  <div className="text-warning">
                    <Clock size={16} />
                  </div>
                  <div>
                    <div className="extra-small fw-bold text-navy">Submit Defense Jury List</div>
                    <div className="extra-small text-muted fw-bold opacity-75">Due by 05:00 PM today</div>
                  </div>
                </div>
                <div className="d-flex gap-3 p-3 rounded-4 bg-primary-soft">
                  <div className="text-primary">
                    <Video size={16} />
                  </div>
                  <div>
                    <div className="extra-small fw-bold text-navy">Dept. Meeting</div>
                    <div className="extra-small text-muted fw-bold opacity-75">Starts in 45 minutes</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass-card border-0 shadow-sm border p-4 bg-navy text-white overflow-hidden position-relative">
              <div className="position-relative z-index-1">
                <h6 className="fw-bold mb-3 text-white">Next Milestone</h6>
                <div className="h1 fw-bold mb-1 text-white">12 Days</div>
                <p className="extra-small opacity-75 mb-0 fw-bold">Until Final Report Submission Deadline</p>
              </div>
              <CalendarIcon className="position-absolute end-0 bottom-0 mb-n4 me-n4 opacity-10 text-white" size={140} />
            </Card>
          </Col>

          {/* Timeline / Events List */}
          <Col lg={8}>
            <Card className="glass-card border shadow-sm border overflow-hidden h-100">
              <Card.Header className="p-4 bg-white d-flex justify-content-between align-items-center border-0">
                <h6 className="mb-0 fw-bold text-navy">Timeline</h6>
                <div className="d-flex gap-2">
                  <Badge className="bg-surface-alt text-muted border-0 px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer transition-all hover-bg-primary-soft hover-text-primary">Week</Badge>
                  <Badge className="bg-primary-soft text-primary border-0 px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer shadow-sm">Month</Badge>
                </div>
              </Card.Header>
              <div className="p-0">
                {UPCOMING_EVENTS.map((event, index) => (
                  <motion.div 
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-bottom border-light border-opacity-10 hover-bg-surface-alt transition-all cursor-pointer group"
                  >
                    <Row className="align-items-center">
                      <Col md={2} className="text-center text-md-start border-md-end mb-3 mb-md-0">
                        <div className="fw-bold text-navy h4 mb-0">{event.date.split('-')[2]}</div>
                        <div className="extra-small text-muted fw-bold text-uppercase opacity-50">MAY</div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Badge className="bg-primary-soft text-primary extra-small border-0 px-2 py-1 rounded-pill fw-bold">{event.type}</Badge>
                          <span className="extra-small text-muted fw-bold opacity-75 d-flex align-items-center gap-1">
                             <Clock size={12} /> {event.time}
                          </span>
                        </div>
                        <h6 className="fw-bold text-navy mb-2">{event.title}</h6>
                        <div className="d-flex align-items-center gap-3">
                          <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-75">
                            <Users size={12} className="text-primary" /> {event.student}
                          </div>
                          <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-75">
                            <MapPin size={12} className="text-danger" /> {event.location}
                          </div>
                        </div>
                      </Col>
                      <Col md={3} className="text-md-end mt-3 mt-md-0">
                        <Badge className={`bg-${event.status === 'Confirmed' ? 'success' : 'warning'}-soft text-${event.status === 'Confirmed' ? 'success' : 'warning'} border-0 px-3 py-1 extra-small fw-bold`}>
                          {event.status}
                        </Badge>
                      </Col>
                      <Col md={1} className="text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-primary-soft rounded-circle transition-all">
                            <MoreHorizontal size={20} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                            <Dropdown.Item className="py-2 fw-bold text-navy">Reschedule</Dropdown.Item>
                            <Dropdown.Item className="py-2 fw-bold text-danger">Cancel Event</Dropdown.Item>
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
                <Button variant="link" className="text-primary extra-small fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-1 hover-gap-2 transition-all">
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
