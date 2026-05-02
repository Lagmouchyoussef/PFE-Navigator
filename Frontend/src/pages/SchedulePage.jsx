import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Modal, Form 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  Plus, ChevronLeft, ChevronRight, 
  MoreVertical, CheckCircle, AlertCircle,
  Users, Info, Bell, Activity, X
} from 'lucide-react';
import './SchedulePage.css';

const SchedulePage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'Meeting' });

  const handleAddEvent = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    alert('Event added successfully! (Demo Mode)');
  };
  const milestones = [
    { name: 'Project Proposal', date: '2026-03-15', status: 'completed' },
    { name: 'Interim Report', date: '2026-04-20', status: 'completed' },
    { name: 'Final Report', date: '2026-05-15', status: 'pending' },
    { name: 'Defense', date: '2026-05-20', status: 'pending' },
  ];

  const upcomingEvents = [
    { title: 'Supervisor Meeting', date: '2026-05-02', time: '10:00 AM', loc: 'Office 302' },
    { title: 'Code Review Session', date: '2026-05-05', time: '2:00 PM', loc: 'Lab 201' },
    { title: 'Documentation Deadline', date: '2026-05-08', time: '11:59 PM', loc: 'Online Portal' },
    { title: 'Final Report Submission', date: '2026-05-15', time: '11:59 PM', loc: 'Online Portal' },
    { title: 'Defense Presentation', date: '2026-05-20', time: '10:00 AM', loc: 'Auditorium A' },
  ];

  const allEvents = [
    {
      title: 'Supervisor Meeting',
      status: 'Upcoming',
      date: '2026-05-02',
      time: '10:00 AM',
      loc: 'Office 302',
      with: 'Dr. Sarah Smith',
      desc: 'Weekly progress review and discussion of interim report feedback'
    },
    {
      title: 'Final Report Submission',
      status: 'Upcoming',
      date: '2026-05-15',
      time: '11:59 PM',
      loc: 'Online Portal',
      with: 'PFE Portal',
      desc: 'Submit complete final report with all revisions'
    },
    {
      title: 'Defense Presentation',
      status: 'Upcoming',
      date: '2026-05-20',
      time: '10:00 AM',
      loc: 'Auditorium A - Room 304',
      with: 'Evaluation Committee',
      desc: 'Final project defense - 30 minutes presentation + 15 minutes Q&A'
    },
    {
      title: 'Code Review Session',
      status: 'Upcoming',
      date: '2026-05-05',
      time: '2:00 PM',
      loc: 'Lab 201',
      with: 'Dr. Sarah Smith',
      desc: 'Technical implementation review and code quality assessment'
    },
    {
      title: 'Documentation Deadline',
      status: 'Upcoming',
      date: '2026-05-08',
      time: '11:59 PM',
      loc: 'Online Portal',
      with: 'PFE Portal',
      desc: 'Submit technical documentation and user manual'
    },
    {
      title: 'Interim Report Submission',
      status: 'Completed',
      date: '2026-04-20',
      time: '11:59 PM',
      loc: 'Online Portal',
      with: 'PFE Portal',
      desc: 'Submitted interim progress report'
    }
  ];

  // Calendar Logic for May 2026 (Starts on Friday, 31 days)
  const days = [];
  // Empty slots for May 2026 (Starts on Friday, so 5 empty days: Sun-Thu)
  for (let i = 0; i < 5; i++) days.push(null);
  for (let i = 1; i <= 31; i++) days.push(i);

  const getEventForDay = (day) => {
    if (day === 2) return { name: 'Supervisor Meeting', type: 'meeting' };
    if (day === 5) return { name: 'Code Review Session', type: 'meeting' };
    if (day === 8) return { name: 'Documentation Deadline', type: 'deadline' };
    if (day === 15) return { name: 'Final Report Submission', type: 'submission' };
    if (day === 20) return { name: 'Defense Presentation', type: 'submission' };
    return null;
  };

  return (
    <div className="schedule-page-layout p-4">
      <Container fluid className="px-0">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="schedule-title mb-1">Schedule & Calendar</h1>
            <p className="schedule-subtitle text-muted mb-0">Manage your deadlines, meetings, and milestones</p>
          </motion.div>
          <Button 
            className="btn-add-event d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Add Event
          </Button>
        </header>

        {/* Add Event Modal */}
        <Modal 
          show={showAddModal} 
          onHide={() => setShowAddModal(false)}
          centered
          className="schedule-modal"
        >
          <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-center">
            <Modal.Title className="fw-black text-navy h5 mb-0">Create New Event</Modal.Title>
            <Button variant="link" className="text-muted p-0 border-0" onClick={() => setShowAddModal(false)}>
              <X size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleAddEvent}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-navy">Event Title</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. Meeting with Supervisor" 
                  className="rounded-3 border-light-soft bg-light py-2"
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-navy">Date</Form.Label>
                    <Form.Control 
                      type="date" 
                      className="rounded-3 border-light-soft bg-light py-2"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="small fw-bold text-navy">Time</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="rounded-3 border-light-soft bg-light py-2"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="small fw-bold text-navy">Event Type</Form.Label>
                <Form.Select className="rounded-3 border-light-soft bg-light py-2 shadow-none">
                  <option>Meeting</option>
                  <option>Deadline</option>
                  <option>Code Review</option>
                  <option>Defense Prep</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-add-event w-100 py-2 fw-bold rounded-3">
                Schedule Event
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Upcoming Events', value: '5', icon: <Bell size={24} />, color: 'primary' },
            { label: 'Pending Deadlines', value: '2', icon: <AlertCircle size={24} />, color: 'danger' },
            { label: 'This Month', value: '5', icon: <CalendarIcon size={24} />, color: 'info' },
          ].map((stat, i) => (
            <Col key={i} lg={4}>
              <Card className="schedule-stat-card border-0 shadow-sm h-100">
                <Card.Body className="p-4 d-flex align-items-center gap-3">
                  <div className={`schedule-icon-wrap bg-${stat.color}-soft text-${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="small text-muted fw-bold tracking-wider">{stat.label}</div>
                    <h2 className="fw-bold mb-0 text-navy">{stat.value}</h2>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Main Calendar Content */}
          <Col lg={8}>
            <Card className="schedule-calendar-card border-0 shadow-sm mb-5">
              <Card.Body className="p-0">
                <div className="p-4 d-flex justify-content-between align-items-center border-bottom">
                  <h5 className="fw-bold text-navy mb-0">May 2026</h5>
                  <div className="d-flex gap-2">
                    <Button variant="light" size="sm" className="rounded-circle p-2" onClick={() => alert("Navigation vers le mois précédent (Simulé)")}><ChevronLeft size={16} /></Button>
                    <Button variant="light" size="sm" className="rounded-circle p-2" onClick={() => alert("Navigation vers le mois suivant (Simulé)")}><ChevronRight size={16} /></Button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                  ))}
                  {days.map((day, i) => {
                    const event = getEventForDay(day);
                    return (
                      <div key={i} className={`calendar-cell ${day ? '' : 'empty'} ${event ? `has-event event-${event.type}` : ''}`}>
                        {day && <span className="day-number">{day}</span>}
                        {event && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }}
                            className={`day-event-tag tag-${event.type}`}
                          >
                            <div className="tag-dot"></div>
                            {event.name}
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>

            {/* All Events - Detailed Card List (Matched to Image Design) */}
            <Card className="schedule-main-card border-0 shadow-sm mt-4">
              <Card.Body className="p-0">
                <div className="p-4 border-bottom">
                  <h6 className="fw-bold text-navy mb-0">All Events</h6>
                </div>
                <div className="events-list-container">
                  {allEvents.map((ev, i) => {
                    // Categorize icons based on event type
                    let icon = <Users size={20} />;
                    let iconBg = 'bg-primary';
                    if (ev.title.toLowerCase().includes('report') || ev.title.toLowerCase().includes('deadline')) {
                      icon = <AlertCircle size={20} />;
                      iconBg = 'bg-danger';
                    } else if (ev.title.toLowerCase().includes('defense') || ev.title.toLowerCase().includes('presentation')) {
                      icon = <CalendarIcon size={20} />;
                      iconBg = 'bg-warning';
                    }

                    return (
                      <div key={i} className="event-item-row p-4 border-bottom">
                        <div className="d-flex gap-4">
                          <div className={`event-type-icon ${iconBg} text-white flex-shrink-0 d-flex align-items-center justify-content-center`}>
                            {icon}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-2">
                              <h6 className="fw-bold text-navy mb-0">{ev.title}</h6>
                              <Badge className="badge-upcoming-blue">{ev.status}</Badge>
                            </div>
                            
                            <Row className="g-3 mb-3">
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium mb-2">
                                  <CalendarIcon size={16} /> {ev.date}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium">
                                  <MapPin size={16} /> {ev.loc}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium mb-2">
                                  <Clock size={16} /> {ev.time}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium">
                                  <Users size={16} /> {ev.with}
                                </div>
                              </Col>
                            </Row>
                            
                            <p className="small text-muted mb-0">{ev.desc}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar Widgets */}
          <Col lg={4}>
            <Card className="schedule-side-card border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                  <Activity size={18} className="text-primary" /> Project Milestones
                </h6>
                <div className="milestones-list">
                  {milestones.map((m, i) => (
                    <div key={i} className="milestone-item d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom-dashed">
                      <div>
                        <div className="small fw-bold text-navy">{m.name}</div>
                        <div className="extra-small text-muted">{m.date}</div>
                      </div>
                      {m.status === 'completed' ? (
                        <CheckCircle size={18} className="text-success" />
                      ) : (
                        <Clock size={18} className="text-muted opacity-50" />
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="schedule-side-card border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="p-4 border-bottom">
                  <h6 className="fw-bold text-navy mb-0">Upcoming Events</h6>
                </div>
                <div className="upcoming-list-image-match">
                  {upcomingEvents.map((ue, i) => {
                    let icon = <Users size={18} />;
                    let iconBg = 'bg-primary';
                    if (ue.title.toLowerCase().includes('report') || ue.title.toLowerCase().includes('deadline')) {
                      icon = <AlertCircle size={18} />;
                      iconBg = 'bg-danger';
                    } else if (ue.title.toLowerCase().includes('defense') || ue.title.toLowerCase().includes('presentation')) {
                      icon = <CalendarIcon size={18} />;
                      iconBg = 'bg-warning';
                    }

                    return (
                      <div key={i} className="upcoming-item-row p-4 border-bottom">
                        <div className="d-flex gap-3">
                          <div className={`upcoming-icon-square ${iconBg} text-white flex-shrink-0 d-flex align-items-center justify-content-center`}>
                            {icon}
                          </div>
                          <div className="flex-grow-1">
                            <div className="small fw-bold text-navy mb-1">{ue.title}</div>
                            <div className="extra-small text-muted d-flex align-items-center gap-2 mb-1">
                              <Clock size={14} /> {ue.date} - {ue.time}
                            </div>
                            <div className="extra-small text-muted d-flex align-items-center gap-2">
                              <MapPin size={14} /> {ue.loc}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SchedulePage;

