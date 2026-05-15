import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Dropdown, Modal, Form } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  ChevronLeft, ChevronRight, Plus, 
  Users, Video, MoreHorizontal,
  Bell, CheckCircle, AlertTriangle, X, Trash2, ChevronDown
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';


const Planning = () => {
  const navigate = useNavigate();
  const { user, appointments, reminders, rescheduleAppointment, cancelAppointment, deleteAppointment, sendReminder } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [visibleCount, setVisibleCount] = useState(5);
  const [viewMode, setViewMode] = useState('month'); // 'week' | 'month'
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', type: 'Meeting', target: 'all', selectedStudents: [] });
  const students = [
    { id: 1, name: 'Ahmed Khalil' },
    { id: 2, name: 'Sara Kamali' },
    { id: 3, name: 'Mehdi Alami' },
    { id: 4, name: 'Fatima Zahra Mansouri' }
  ];

  const handleAction = (msg) => {
    setSuccessMsg(msg);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const openReschedule = (event) => {
    setSelectedEvent(event);
    setNewDate(event.date);
    setNewTime(event.time);
    setShowRescheduleModal(true);
  };

  const confirmReschedule = (e) => {
    e.preventDefault();
    rescheduleAppointment(selectedEvent.id, newDate, newTime);
    setShowRescheduleModal(false);
    handleAction(`The appointment with ${selectedEvent.studentName} has been rescheduled to ${newDate} at ${newTime}.`);
  };

  const filteredAppointments = appointments.filter(app => {
    if (viewMode === 'month') return true;
    // For 'week', show only events in May 2026 within a certain range (demo logic)
    const day = parseInt(app.date.split('-')[2]);
    return day >= 12 && day <= 19; // Current week demo range
  });

  return (
    <div className="supervisor-planning-layout py-4" style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Container fluid className="px-4">
        
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center bg-white"
              style={{ position: 'sticky', top: '20px', zIndex: 1000 }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Action Successful</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none border-0 hover-bg-surface-alt rounded-circle" onClick={() => setShowSuccess(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Academic Planning</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Hello {user?.name}, manage your appointments, defenses and track critical deadlines.
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2"
              onClick={() => navigate('/supervisor/notifications')}
            >
              <Bell size={18} /> Notifications
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2 shadow-sm"
              onClick={() => setShowNewEventModal(true)}
            >
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
                <div className="d-flex justify-content-center mb-3">
                  <Form.Control 
                    type="date" 
                    value="2026-05-22"
                    className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none text-navy border-0"
                    style={{ maxWidth: '180px', cursor: 'pointer' }}
                    onChange={(e) => alert(`Navigation to ${e.target.value}`)}
                  />
                </div>
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
                <h6 className="extra-small fw-bold text-navy text-uppercase mb-3 opacity-50">Daily Reminders</h6>
                {reminders.map(r => (
                  <div key={r.id} className="d-flex align-items-center gap-3 mb-3">
                    <div className={`text-${r.type}`}><Clock size={16} /></div>
                    <div className="extra-small fw-bold text-navy opacity-75">{r.text} • {r.time}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="border shadow-sm rounded-4 p-4 bg-surface">
              <h6 className="fw-bold mb-3 text-primary extra-small text-uppercase">Next Deadline</h6>
              <div className="h2 fw-bold mb-1 text-navy">12 Days</div>
              <p className="extra-small mb-0 text-muted fw-bold">Final Report Deadline</p>
            </Card>
          </Col>

          {/* Timeline / Events List */}
          <Col lg={8}>
            <Card className="border shadow-sm rounded-4 overflow-hidden bg-surface">
              <Card.Header className="p-4 bg-surface-alt d-flex justify-content-between align-items-center border-bottom">
                <h6 className="mb-0 fw-bold text-navy">Events Timeline</h6>
                <div className="d-flex gap-2">
                  <Badge 
                    className={`${viewMode === 'week' ? 'bg-primary text-white' : 'bg-light text-muted'} border-0 px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer transition-all`}
                    onClick={() => setViewMode('week')}
                  >
                    Week
                  </Badge>
                  <Badge 
                    className={`${viewMode === 'month' ? 'bg-primary text-white' : 'bg-light text-muted'} border-0 px-3 py-2 rounded-pill extra-small fw-bold cursor-pointer transition-all`}
                    onClick={() => setViewMode('month')}
                  >
                    Month
                  </Badge>
                </div>
              </Card.Header>
              <div className="p-0">
                {filteredAppointments.length === 0 ? (
                  <div className="p-5 text-center text-muted">
                    <CalendarIcon size={40} className="mb-3 opacity-25" />
                    <p className="fw-bold mb-0">No events scheduled for this period.</p>
                  </div>
                ) : (
                  filteredAppointments.slice(0, visibleCount).map((event, index) => (
                    <div 
                      key={event.id}
                      className={`p-4 border-bottom hover-bg-light transition-all ${event.status === 'Cancelled' ? 'bg-light opacity-50' : ''}`}
                    >
                      <Row className="align-items-center">
                        <Col md={2} className="text-center text-md-start border-md-end mb-3 mb-md-0">
                          <div className="fw-bold text-navy h4 mb-0">{event.date.split('-')[2]}</div>
                          <div className="extra-small text-muted fw-bold text-uppercase opacity-50">{new Date(event.date).toLocaleDateString('en-US', {month: 'short'}).toUpperCase()}</div>
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
                              <Users size={12} className="text-primary" /> {event.studentName}
                            </div>
                            <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-75">
                              <MapPin size={12} className="text-danger" /> {event.location}
                            </div>
                          </div>
                        </Col>
                        <Col md={3} className="text-md-end mt-3 mt-md-0">
                          <Badge className={`bg-${event.status === 'Confirmed' ? 'success' : event.status === 'Rescheduled' ? 'info' : event.status === 'Cancelled' ? 'danger' : 'warning'}-soft text-${event.status === 'Confirmed' ? 'success' : event.status === 'Rescheduled' ? 'info' : event.status === 'Cancelled' ? 'danger' : 'warning'} border-0 px-3 py-1 extra-small fw-bold`}>
                            {event.status}
                          </Badge>
                        </Col>
                        <Col md={1} className="text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-primary-soft rounded-circle transition-all">
                              <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                              <Dropdown.Item className="py-2 fw-bold text-navy" onClick={() => navigate(`/supervisor/student/${event.id || 1}`)}>
                                <ChevronRight size={14} className="text-primary" /> Timeline
                              </Dropdown.Item>
                              {event.status !== 'Cancelled' && (
                                <>
                                  <Dropdown.Item className="py-2 fw-bold text-navy" onClick={() => openReschedule(event)}>
                                    <Clock size={14} className="text-info me-2" /> Reschedule
                                  </Dropdown.Item>
                                  <Dropdown.Item className="py-2 fw-bold text-danger" onClick={() => { cancelAppointment(event.id); handleAction(`The appointment with ${event.studentName} has been cancelled.`); }}>
                                    <X size={14} className="text-danger me-2" /> Cancel appointment
                                  </Dropdown.Item>
                                  <Dropdown.Divider />
                                  <Dropdown.Item className="py-2 text-primary fw-bold" onClick={() => { sendReminder(event.id); handleAction(`A reminder has been sent to the student ${event.studentName}.`); }}>
                                    <Bell size={14} className="text-primary me-2" /> Send reminder
                                  </Dropdown.Item>
                                </>
                              )}
                              <Dropdown.Item className="py-2 fw-bold text-danger" onClick={() => { deleteAppointment(event.id); handleAction(`The appointment has been deleted from history.`); }}>
                                <Trash2 size={14} className="text-danger me-2" /> Delete permanently
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </Col>
                      </Row>
                    </div>
                  ))
                )}
              </div>
               {visibleCount < filteredAppointments.length && (
                <div className="p-4 text-center">
                  <Button 
                    variant="link" 
                    className="text-primary extra-small fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-1 hover-gap-2 transition-all"
                    onClick={() => setVisibleCount(prev => prev + 5)}
                  >
                    Load More Events <ChevronRight size={14} />
                  </Button>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Reschedule Modal */}
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)} centered className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Reschedule appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={confirmReschedule}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-navy opacity-75">NEW DATE</Form.Label>
              <Form.Control 
                type="date" 
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                required
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-navy opacity-75">NEW TIME SLOT</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="example: 14:00 - 15:30"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                required
              />
            </Form.Group>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm border-0">
              Confirm Rescheduling
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* New Event Modal */}
      <Modal show={showNewEventModal} onHide={() => setShowNewEventModal(false)} centered className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Create new event</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={(e) => {
            e.preventDefault();
            setShowNewEventModal(false);
            handleAction(`Event "${newEvent.title}" has been successfully created.`);
          }}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-navy opacity-75">EVENT TITLE</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="example: Follow-up Meeting"
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                required
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-navy opacity-75">RECIPIENT(S)</Form.Label>
              <Form.Select 
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                required
                onChange={(e) => setNewEvent({...newEvent, target: e.target.value})}
              >
                <option value="all">All supervised students</option>
                <option value="1">Ahmed Khalil</option>
                <option value="2">Sara Kamali</option>
                <option value="3">Mehdi Alami</option>
                <option value="4">Fatima Zahra Mansouri</option>
                <option value="group">Specific Group...</option>
              </Form.Select>
            </Form.Group>

            {newEvent.target === 'group' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                className="mb-4 p-3 rounded-4 bg-light-soft border border-light border-opacity-10"
              >
                <Form.Label className="extra-small fw-bold text-navy opacity-75 mb-3">SELECT STUDENTS</Form.Label>
                <div className="d-flex flex-column gap-2">
                  {students.map(s => (
                    <Form.Check 
                      key={s.id}
                      type="checkbox"
                      id={`student-${s.id}`}
                      label={s.name}
                      className="extra-small fw-bold text-navy custom-checkbox"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setNewEvent(prev => ({
                          ...prev,
                          selectedStudents: checked 
                            ? [...prev.selectedStudents, s.id]
                            : prev.selectedStudents.filter(id => id !== s.id)
                        }));
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="extra-small fw-bold text-navy opacity-75">DATE</Form.Label>
                  <Form.Control 
                    type="date" 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    required
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="extra-small fw-bold text-navy opacity-75">TIME</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="10:00 AM"
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    required
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-navy opacity-75">LOCATION / LINK</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Room 302 or Zoom"
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                required
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </Form.Group>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm border-0">
              Save event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Planning;
