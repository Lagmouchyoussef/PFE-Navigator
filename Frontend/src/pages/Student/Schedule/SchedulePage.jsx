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
    <div className="schedule-page-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Schedule & Calendar</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Manage your deadlines, meetings, and project milestones</p>
          </motion.div>
          <Button 
            className="btn-premium d-flex align-items-center gap-2 px-4 shadow-sm"
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
          className="glass-modal"
        >
          <Modal.Header className="border-0 pb-0 d-flex justify-content-between align-items-center p-4">
            <Modal.Title className="fw-bold text-navy h5 mb-0">Create New Event</Modal.Title>
            <Button variant="link" className="text-muted p-0 border-0 shadow-none" onClick={() => setShowAddModal(false)}>
              <X size={24} />
            </Button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form onSubmit={handleAddEvent}>
              <Form.Group className="mb-3">
                <Form.Label className="extra-small fw-bold text-navy opacity-75">EVENT TITLE</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="e.g. Meeting with Supervisor" 
                  className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                  required
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small fw-bold text-navy opacity-75">DATE</Form.Label>
                    <Form.Control 
                      type="date" 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small fw-bold text-navy opacity-75">TIME</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="extra-small fw-bold text-navy opacity-75">EVENT TYPE</Form.Label>
                <Form.Select className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none">
                  <option>Meeting</option>
                  <option>Deadline</option>
                  <option>Code Review</option>
                  <option>Defense Prep</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm">
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
              <Card className="glass-card border-0 shadow-sm border p-3">
                <Card.Body className="p-2 d-flex align-items-center gap-4">
                  <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-75 tracking-wider">{stat.label}</div>
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
            <Card className="glass-card border shadow-sm border overflow-hidden mb-5">
              <Card.Body className="p-0">
                <div className="p-4 d-flex justify-content-between align-items-center border-bottom bg-white">
                  <h5 className="fw-bold text-navy mb-0">May 2026</h5>
                  <div className="d-flex gap-2">
                    <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={() => alert("Navigation vers le mois précédent (Simulé)")}><ChevronLeft size={20} /></Button>
                    <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={() => alert("Navigation vers le mois suivant (Simulé)")}><ChevronRight size={20} /></Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--color-border)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-surface-alt p-3 text-center extra-small fw-bold text-muted text-uppercase">{day}</div>
                    ))}
                    {days.map((day, i) => {
                      const event = getEventForDay(day);
                      return (
                        <div key={i} className={`bg-white p-2 min-vh-10 d-flex flex-column gap-2 ${day ? '' : 'bg-surface-alt'}`} style={{ minHeight: '100px' }}>
                          {day && <span className="extra-small fw-bold text-navy opacity-25">{day}</span>}
                          {event && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }} 
                              animate={{ scale: 1, opacity: 1 }}
                              className={`p-2 rounded-3 extra-small fw-bold d-flex align-items-center gap-2 shadow-sm bg-${event.type === 'meeting' ? 'primary' : event.type === 'deadline' ? 'danger' : 'warning'}-soft text-${event.type === 'meeting' ? 'primary' : event.type === 'deadline' ? 'danger' : 'warning'}`}
                              style={{ fontSize: '9px' }}
                            >
                              <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: 'currentColor' }}></div>
                              {event.name}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* All Events - Detailed Card List */}
            <Card className="glass-card border shadow-sm border overflow-hidden mt-4">
              <Card.Body className="p-0">
                <div className="p-4 border-bottom bg-white">
                  <h6 className="fw-bold text-navy mb-0">Upcoming Events Schedule</h6>
                </div>
                <div className="events-list">
                  {allEvents.map((ev, i) => {
                    let icon = <Users size={18} />;
                    let iconColor = 'primary';
                    if (ev.title.toLowerCase().includes('report') || ev.title.toLowerCase().includes('deadline')) {
                      icon = <AlertCircle size={18} />;
                      iconColor = 'danger';
                    } else if (ev.title.toLowerCase().includes('defense') || ev.title.toLowerCase().includes('presentation')) {
                      icon = <CalendarIcon size={18} />;
                      iconColor = 'warning';
                    }

                    return (
                      <div key={i} className="p-4 border-bottom border-light border-opacity-10 hover-bg-surface-alt transition-all">
                        <div className="d-flex gap-4">
                          <div className={`p-3 rounded-4 bg-${iconColor}-soft text-${iconColor} flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '48px', height: '48px' }}>
                            {icon}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <h6 className="fw-bold text-navy mb-0">{ev.title}</h6>
                              <Badge className={`bg-${ev.status === 'Upcoming' ? 'primary' : 'success'}-soft text-${ev.status === 'Upcoming' ? 'primary' : 'success'} border-0 extra-small px-3 py-1 fw-bold`}>{ev.status}</Badge>
                            </div>
                            
                            <Row className="g-3 mb-3">
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                                  <CalendarIcon size={14} className="text-primary" /> {ev.date}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                                  <MapPin size={14} className="text-primary" /> {ev.loc}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                                  <Clock size={14} className="text-primary" /> {ev.time}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                                  <Users size={14} className="text-primary" /> {ev.with}
                                </div>
                              </Col>
                            </Row>
                            
                            <p className="extra-small text-muted mb-0 fw-bold opacity-75">{ev.desc}</p>
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
            <div className="d-flex flex-column gap-4">
              <Card className="glass-card border shadow-sm border p-4">
                <Card.Body className="p-0">
                  <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                    <Activity size={18} className="text-primary" /> Project Milestones
                  </h6>
                  <div className="d-flex flex-column gap-3">
                    {milestones.map((m, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-surface-alt border-0 shadow-sm">
                        <div>
                          <div className="extra-small fw-bold text-navy">{m.name}</div>
                          <div className="extra-small text-muted fw-bold opacity-75">{m.date}</div>
                        </div>
                        {m.status === 'completed' ? (
                          <div className="p-1 rounded-circle bg-success-soft text-success shadow-sm">
                            <CheckCircle size={18} />
                          </div>
                        ) : (
                          <div className="p-1 rounded-circle bg-white text-muted opacity-25 shadow-sm">
                            <Clock size={18} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              <Card className="glass-card border shadow-sm border overflow-hidden">
                <Card.Body className="p-0">
                  <div className="p-4 border-bottom bg-white">
                    <h6 className="fw-bold text-navy mb-0">Upcoming Focus</h6>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {upcomingEvents.map((ue, i) => {
                      let iconColor = 'primary';
                      if (ue.title.toLowerCase().includes('report') || ue.title.toLowerCase().includes('deadline')) iconColor = 'danger';
                      else if (ue.title.toLowerCase().includes('defense') || ue.title.toLowerCase().includes('presentation')) iconColor = 'warning';

                      return (
                        <div key={i} className="p-3 border-bottom border-light border-opacity-10 hover-bg-surface-alt transition-all">
                          <div className="d-flex gap-3 align-items-center">
                            <div className={`p-2 rounded-3 bg-${iconColor}-soft text-${iconColor} shadow-sm`} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <CalendarIcon size={18} />
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="extra-small fw-bold text-navy text-truncate mb-1">{ue.title}</div>
                              <div className="extra-small text-muted fw-bold opacity-75 d-flex align-items-center gap-1">
                                <Clock size={12} /> {ue.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SchedulePage;


