import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Badge,
  Button, Modal, Form, Spinner
} from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, MapPin,
  Plus, ChevronLeft, ChevronRight,
  CheckCircle, AlertCircle, Info, Trash2
} from 'lucide-react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const typeColor = { meeting: 'primary', deadline: 'danger', defense: 'success', code_review: 'warning' };
const statusBadge = { confirmed: 'success', pending: 'warning', rescheduled: 'info', cancelled: 'secondary', completed: 'dark' };

const milestoneClass = (status) => {
  if (status === 'completed') return 'border-success bg-success-soft';
  if (status === 'in_progress') return 'border-primary bg-primary-soft';
  return 'border-secondary';
};

const milestoneIcon = (status) => {
  if (status === 'completed') return <CheckCircle size={16} className="text-success" />;
  if (status === 'in_progress') return <Info size={16} className="text-primary" />;
  return <Clock size={16} className="text-muted" />;
};

const SchedulePage = () => {
  const { user, appointments, createAppointment, deleteAppointment, milestones } = useApp();
  const [viewDate, setViewDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '09:00', type: 'meeting', location: 'Online Portal', description: ''
  });

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [
    ...new Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(ev => ev.date === dateStr);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAppointment({
        ...newEvent,
        status: 'pending',
      });
      setShowAddModal(false);
      setNewEvent({ title: '', date: '', time: '09:00', type: 'meeting', location: 'Online Portal', description: '' });
    } catch (err) {
      console.error('Create appointment error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteAppointment(id);
      setShowEventModal(false);
    } catch (err) {
      console.error('Delete appointment error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const upcomingEvents = [...appointments]
    .filter(ev => ev.status !== 'cancelled' && new Date(`${ev.date}T${ev.time}`) >= new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
    .slice(0, 8);

  return (
    <div className="schedule-page-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Schedule &amp; Calendar</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Appointments and deadlines — {user?.name}
            </p>
          </motion.div>
          <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Request Appointment
          </Button>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Events', value: appointments.length, color: 'primary', icon: <CalendarIcon size={20}/> },
            { label: 'Upcoming',     value: upcomingEvents.length, color: 'success', icon: <Clock size={20}/> },
            { label: 'Milestones',   value: milestones?.length ?? 0, color: 'warning', icon: <CheckCircle size={20}/> },
            { label: 'Pending',      value: appointments.filter(a => a.status === 'pending').length, color: 'info', icon: <AlertCircle size={20}/> },
          ].map(s => (
            <Col lg={3} sm={6} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Calendar */}
          <Col lg={7}>
            <Card className="glass-card border-0 shadow-sm">
              <Card.Header className="bg-transparent border-bottom p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="link" className="p-0 text-navy border-0 shadow-none" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                    <ChevronLeft size={20} />
                  </Button>
                  <h5 className="fw-bold text-navy mb-0">{MONTHS[month]} {year}</h5>
                  <Button variant="link" className="p-0 text-navy border-0 shadow-none" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                {/* Day headers */}
                <Row className="g-0 mb-2">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <Col key={d} className="text-center extra-small fw-bold text-muted py-1">{d}</Col>
                  ))}
                </Row>
                {/* Day cells */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {days.map((day, idx) => {
                    const events = getEventsForDay(day);
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                    const cellKey = day ? `day-${day}` : `empty-${idx}`;
                    const cellContent = day ? (
                      <>
                        <div className="small fw-bold">{day}</div>
                        {events.length > 0 && (
                          <div
                            className={`rounded-circle mx-auto mt-1 bg-${typeColor[events[0].type] || 'primary'}`}
                            style={{ width: '6px', height: '6px' }}
                          />
                        )}
                      </>
                    ) : null;
                    return events.length > 0 ? (
                      <button
                        key={cellKey}
                        type="button"
                        className={`rounded-3 p-2 text-center border-0 w-100 ${isToday ? 'bg-primary text-white fw-bold' : 'hover-bg-surface bg-transparent'}`}
                        style={{ minHeight: '48px' }}
                        onClick={() => { setSelectedEvent(events[0]); setShowEventModal(true); }}
                      >
                        {cellContent}
                      </button>
                    ) : (
                      <div
                        key={cellKey}
                        className={`rounded-3 p-2 text-center ${isToday ? 'bg-primary text-white fw-bold' : ''}`}
                        style={{ minHeight: '48px' }}
                      >
                        {cellContent}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming Events */}
          <Col lg={5}>
            <Card className="glass-card border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent border-bottom p-4">
                <h6 className="fw-bold text-navy mb-0">Upcoming Events</h6>
              </Card.Header>
              <Card.Body className="p-0 overflow-auto" style={{ maxHeight: '420px' }}>
                {upcomingEvents.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <CalendarIcon size={40} className="mb-3 opacity-30" />
                    <p className="small fw-bold">No upcoming events</p>
                  </div>
                )}
                {upcomingEvents.map(ev => (
                  <button
                    key={ev.id}
                    type="button"
                    className="w-100 text-start border-0 bg-transparent p-4 border-bottom hover-bg-surface"
                    onClick={() => { setSelectedEvent(ev); setShowEventModal(true); }}
                  >
                    <div className="d-flex align-items-start gap-3">
                      <div className={`p-2 rounded-3 bg-${typeColor[ev.type] || 'primary'}-soft text-${typeColor[ev.type] || 'primary'} shrink-0`}>
                        <CalendarIcon size={18} />
                      </div>
                      <div className="grow overflow-hidden">
                        <div className="small fw-bold text-navy text-truncate">{ev.title}</div>
                        <div className="extra-small text-muted d-flex align-items-center gap-2 mt-1">
                          <Clock size={12} /> {ev.date} at {ev.time}
                        </div>
                        {ev.location && (
                          <div className="extra-small text-muted d-flex align-items-center gap-2">
                            <MapPin size={12} /> {ev.location}
                          </div>
                        )}
                      </div>
                      <Badge bg={statusBadge[ev.status] || 'secondary'} className="shrink-0 extra-small text-capitalize">
                        {ev.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Milestones */}
        {milestones?.length > 0 && (
          <Card className="glass-card border-0 shadow-sm mt-4">
            <Card.Header className="bg-transparent border-bottom p-4">
              <h6 className="fw-bold text-navy mb-0">Project Milestones</h6>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                {milestones.map(m => (
                  <Col md={4} key={m.id}>
                    <div className={`p-3 rounded-3 border ${milestoneClass(m.status)}`}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        {milestoneIcon(m.status)}
                        <span className="small fw-bold text-navy">{m.title}</span>
                      </div>
                      {m.due_date && (
                        <div className="extra-small text-muted">Due: {m.due_date}</div>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Add Event Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">Request Appointment</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAdd}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Title</Form.Label>
              <Form.Control placeholder="Appointment title" value={newEvent.title}
                onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} required />
            </Form.Group>
            <Row className="g-3 mb-3">
              <Col>
                <Form.Label className="small fw-bold">Date</Form.Label>
                <Form.Control type="date" value={newEvent.date}
                  onChange={e => setNewEvent(p => ({ ...p, date: e.target.value }))} required />
              </Col>
              <Col>
                <Form.Label className="small fw-bold">Time</Form.Label>
                <Form.Control type="time" value={newEvent.time}
                  onChange={e => setNewEvent(p => ({ ...p, time: e.target.value }))} required />
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Type</Form.Label>
              <Form.Select value={newEvent.type} onChange={e => setNewEvent(p => ({ ...p, type: e.target.value }))}>
                <option value="meeting">Meeting</option>
                <option value="deadline">Deadline</option>
                <option value="defense">Defense</option>
                <option value="code_review">Code Review</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Location</Form.Label>
              <Form.Control placeholder="Online Portal" value={newEvent.location}
                onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold">Description (optional)</Form.Label>
              <Form.Control as="textarea" rows={2} value={newEvent.description}
                onChange={e => setNewEvent(p => ({ ...p, description: e.target.value }))} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Submit Request'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Event Detail Modal */}
      <Modal show={showEventModal} onHide={() => setShowEventModal(false)} centered>
        {selectedEvent && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold fs-6">{selectedEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div className="d-flex gap-2 mb-3">
                <Badge bg={typeColor[selectedEvent.type] || 'primary'} className="text-capitalize">{selectedEvent.type}</Badge>
                <Badge bg={statusBadge[selectedEvent.status] || 'secondary'} className="text-capitalize">{selectedEvent.status}</Badge>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                <Clock size={16} /> {selectedEvent.date} at {selectedEvent.time}
              </div>
              {selectedEvent.location && (
                <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                  <MapPin size={16} /> {selectedEvent.location}
                </div>
              )}
              {selectedEvent.description && (
                <p className="small text-navy mt-3 mb-0">{selectedEvent.description}</p>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="outline-secondary" onClick={() => setShowEventModal(false)}>Close</Button>
              {selectedEvent.created_by === user?.id && (
                <Button variant="outline-danger" onClick={() => handleDelete(selectedEvent.id)} disabled={deleting}>
                  {deleting ? <Spinner size="sm" /> : <><Trash2 size={14} className="me-1" />Delete</>}
                </Button>
              )}
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default SchedulePage;
