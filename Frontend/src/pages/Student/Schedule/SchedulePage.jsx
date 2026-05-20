import { useState, useEffect, useRef } from 'react';
import {
  Container, Row, Col, Card, Badge,
  Button, Modal, Form, Spinner
} from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon, Clock, MapPin,
  Plus, ChevronLeft, ChevronRight,
  CheckCircle, Info, Trash2,
  Users, Award, Shield
} from 'lucide-react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const statusBadge = {
  confirmed: 'success', Confirmed: 'success',
  pending:   'warning', Pending:   'warning',
  cancelled: 'secondary', Cancelled: 'secondary',
  rescheduled: 'info',  Rescheduled: 'info',
  completed: 'dark',
};

const milestoneClass = (status) => {
  if (status === 'completed') return 'border-success bg-success-soft';
  if (status === 'in_progress' || status === 'current') return 'border-primary bg-primary-soft';
  return 'border-secondary';
};

const milestoneIcon = (status) => {
  if (status === 'completed') return <CheckCircle size={16} className="text-success" />;
  if (status === 'in_progress' || status === 'current') return <Info size={16} className="text-primary" />;
  return <Clock size={16} className="text-muted" />;
};

const fmtDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
};

const SchedulePage = () => {
  const {
    user,
    currentProject,
    appointments: rawAppointments,
    createAppointment,
    deleteAppointment,
    milestones,
    juryAssignments,
    refreshProject,
  } = useApp();

  useEffect(() => {
    refreshProject();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Context appointments are polled every 10s by AppContext — always use them directly
  const appointments = Array.isArray(rawAppointments) ? rawAppointments : [];
  const allJury = Array.isArray(juryAssignments) ? juryAssignments : [];

  // split into supervisor meetings vs defense/jury
  const supervisorAppts  = appointments.filter(a => a && a.type?.toLowerCase() !== 'defense');
  const defenseAppts     = appointments.filter(a => a && a.type?.toLowerCase() === 'defense');

  const [viewDate, setViewDate] = useState(new Date());

  // Auto-navigate calendar to the first upcoming defense month (only once)
  const hasAutoNavigated = useRef(false);
  useEffect(() => {
    if (hasAutoNavigated.current || defenseAppts.length === 0) return;
    const upcoming = defenseAppts
      .filter(a => a.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .find(a => new Date(a.date + 'T00:00:00') >= new Date());
    if (upcoming) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setViewDate(new Date(upcoming.date + 'T00:00:00'));
      hasAutoNavigated.current = true;
    }
  }, [defenseAppts.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const juryMembers = allJury;
  const [showAddModal, setShowAddModal]   = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent]  = useState(null);
  const [saving, setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '', date: '', time: '09:00', location: '', notes: ''
  });

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [...new Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(ev => ev.date === dateStr);
  };

  const dotColor = (events) => {
    if (events.some(e => e.type === 'defense')) return 'success';
    return 'primary';
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAppointment({
        ...newEvent,
        type: 'meeting',
        status: 'Pending',
        project: currentProject?.id,
        student: user?.id,
      });
      setShowAddModal(false);
      setNewEvent({ title: '', date: '', time: '09:00', location: '', notes: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteAppointment(id);
      setShowEventModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const upcomingSupervisor = [...supervisorAppts]
    .filter(a => a.status !== 'Cancelled' && a.status !== 'cancelled' && new Date(`${a.date}T${a.time}`) >= new Date())
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  return (
    <div className="schedule-page-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">My Schedule</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Supervisor meetings &amp; defense — {user?.name}
            </p>
          </motion.div>
          <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Request Meeting
          </Button>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Meetings',  value: supervisorAppts.length, color: 'primary', icon: <CalendarIcon size={20}/> },
            { label: 'Upcoming',        value: upcomingSupervisor.length, color: 'success', icon: <Clock size={20}/> },
            { label: 'Defense Planned', value: defenseAppts.length,    color: 'warning', icon: <Award size={20}/> },
            { label: 'Jury Members',    value: juryMembers.length,     color: 'info',    icon: <Users size={20}/> },
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

        <Row className="g-4 mb-5">
          {/* Calendar */}
          <Col lg={7}>
            <Card className="glass-card border-0 shadow-sm">
              <Card.Header className="bg-transparent border-bottom p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <Button variant="link" className="p-0 text-navy border-0 shadow-none"
                      onClick={() => setViewDate(new Date(year, month - 1, 1))}>
                      <ChevronLeft size={20} />
                    </Button>
                    <h5 className="fw-bold text-navy mb-0" style={{ minWidth: '140px', textAlign: 'center' }}>
                      {MONTHS[month]} {year}
                    </h5>
                    <Button variant="link" className="p-0 text-navy border-0 shadow-none"
                      onClick={() => setViewDate(new Date(year, month + 1, 1))}>
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                  <div className="d-flex gap-3 extra-small fw-bold text-muted">
                    <span className="d-flex align-items-center gap-1">
                      <span className="rounded-circle bg-primary d-inline-block" style={{ width: 8, height: 8 }} /> Meeting
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <span className="rounded-circle bg-success d-inline-block" style={{ width: 8, height: 8 }} /> Defense
                    </span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-0 mb-2">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                    <Col key={d} className="text-center extra-small fw-bold text-muted py-1">{d}</Col>
                  ))}
                </Row>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {days.map((day, idx) => {
                    const events  = getEventsForDay(day);
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                    const key     = day ? `day-${day}` : `empty-${idx}`;
                    const cell    = day ? (
                      <>
                        <div className="small fw-bold">{day}</div>
                        {events.length > 0 && (
                          <div className={`rounded-circle mx-auto mt-1 bg-${dotColor(events)}`}
                            style={{ width: 6, height: 6 }} />
                        )}
                      </>
                    ) : null;

                    return events.length > 0 ? (
                      <button key={key} type="button"
                        className={`rounded-3 p-2 text-center border-0 w-100 ${isToday ? 'bg-primary text-white fw-bold' : 'hover-bg-surface bg-transparent'}`}
                        style={{ minHeight: '48px' }}
                        onClick={() => { setSelectedEvent(events[0]); setShowEventModal(true); }}>
                        {cell}
                      </button>
                    ) : (
                      <div key={key}
                        className={`rounded-3 p-2 text-center ${isToday ? 'bg-primary text-white fw-bold' : ''}`}
                        style={{ minHeight: '48px' }}>
                        {cell}
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Upcoming supervisor meetings */}
          <Col lg={5}>
            <Card className="glass-card border-0 shadow-sm h-100">
              <Card.Header className="bg-transparent border-bottom p-4 d-flex align-items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                <h6 className="fw-bold text-navy mb-0">Upcoming Meetings</h6>
              </Card.Header>
              <Card.Body className="p-0 overflow-auto" style={{ maxHeight: '380px' }}>
                {upcomingSupervisor.length === 0 && (
                  <div className="text-center py-5 text-muted">
                    <CalendarIcon size={40} className="mb-3 opacity-30" />
                    <p className="small fw-bold">No upcoming meetings</p>
                  </div>
                )}
                {upcomingSupervisor.map(ev => (
                  <button key={ev.id} type="button"
                    className="w-100 text-start border-0 bg-transparent p-4 border-bottom hover-bg-surface"
                    onClick={() => { setSelectedEvent(ev); setShowEventModal(true); }}>
                    <div className="d-flex align-items-start gap-3">
                      <div className="p-2 rounded-3 bg-primary-soft text-primary shrink-0">
                        <CalendarIcon size={16} />
                      </div>
                      <div className="grow overflow-hidden">
                        <div className="small fw-bold text-navy text-truncate">{ev.title}</div>
                        <div className="extra-small text-muted mt-1 d-flex align-items-center gap-1">
                          <Clock size={11} /> {fmtDate(ev.date)} {ev.time && `at ${ev.time}`}
                        </div>
                        {ev.location && (
                          <div className="extra-small text-muted d-flex align-items-center gap-1">
                            <MapPin size={11} /> {ev.location}
                          </div>
                        )}
                        {ev.supervisor_name && (
                          <div className="extra-small text-muted opacity-75">{ev.supervisor_name}</div>
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

        {/* Defense / Soutenance section */}
        <Card className="glass-card border-0 shadow-sm mb-5">
          <Card.Header className="bg-transparent border-bottom p-4 d-flex align-items-center gap-2">
            <Award size={18} className="text-success" />
            <h6 className="fw-bold text-navy mb-0">Defense / Soutenance</h6>
          </Card.Header>
          <Card.Body className="p-4">
            {defenseAppts.length === 0 && juryMembers.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <Shield size={48} className="mb-3 opacity-25" />
                <p className="small fw-bold mb-1">No defense scheduled yet</p>
                <p className="extra-small opacity-50">The defense date will appear here once the administration sets it.</p>
              </div>
            ) : (
              <Row className="g-4">
                {/* Defense appointment(s) */}
                {defenseAppts.length > 0 && (
                  <Col lg={juryMembers.length > 0 ? 6 : 12}>
                    <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Date &amp; Location</h6>
                    {defenseAppts.map(ev => (
                      <div key={ev.id}
                        className="p-4 rounded-4 border border-success border-opacity-25 bg-success-soft mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <Award size={20} className="text-success" />
                            <span className="fw-bold text-navy">{ev.title}</span>
                          </div>
                          <Badge bg={statusBadge[ev.status] || 'secondary'} className="extra-small text-capitalize">
                            {ev.status}
                          </Badge>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <div className="small d-flex align-items-center gap-2 text-navy fw-bold">
                            <CalendarIcon size={14} className="text-success" />
                            {fmtDate(ev.date)}
                          </div>
                          {ev.time && (
                            <div className="small d-flex align-items-center gap-2 text-navy fw-bold">
                              <Clock size={14} className="text-success" />
                              {ev.time}
                            </div>
                          )}
                          {ev.location && (
                            <div className="small d-flex align-items-center gap-2 text-navy fw-bold">
                              <MapPin size={14} className="text-success" />
                              {ev.location}
                            </div>
                          )}
                          {ev.notes && (
                            <p className="extra-small text-muted mt-2 mb-0 fw-bold">{ev.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </Col>
                )}

                {/* Jury members */}
                {juryMembers.length > 0 && (
                  <Col lg={defenseAppts.length > 0 ? 6 : 12}>
                    <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Jury Committee</h6>
                    <div className="d-flex flex-column gap-2">
                      {juryMembers.map(ja => (
                        <div key={ja.id}
                          className="p-3 rounded-3 bg-surface-alt d-flex align-items-center gap-3">
                          <div className="bg-warning-soft text-warning rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: 36, height: 36, fontSize: '0.7rem', flexShrink: 0 }}>
                            {(ja.jury_member_name || 'J').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="grow">
                            <div className="small fw-bold text-navy">{ja.jury_member_name}</div>
                            <div className="extra-small text-muted fw-bold opacity-75 text-capitalize">{ja.role}</div>
                          </div>
                          <Badge bg="warning" className="extra-small text-dark">Jury</Badge>
                        </div>
                      ))}
                    </div>
                  </Col>
                )}
              </Row>
            )}
          </Card.Body>
        </Card>

        {/* All supervisor meetings history */}
        {supervisorAppts.length > 0 && (
          <Card className="glass-card border-0 shadow-sm mb-5">
            <Card.Header className="bg-transparent border-bottom p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <CalendarIcon size={16} className="text-primary" />
                <h6 className="fw-bold text-navy mb-0">All Supervisor Meetings ({supervisorAppts.length})</h6>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {supervisorAppts.map(ev => (
                <button key={ev.id} type="button"
                  className="w-100 text-start border-0 bg-transparent p-4 border-bottom hover-bg-surface"
                  onClick={() => { setSelectedEvent(ev); setShowEventModal(true); }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className={`p-2 rounded-3 bg-primary-soft text-primary shrink-0`}>
                      <CalendarIcon size={16} />
                    </div>
                    <div className="grow overflow-hidden">
                      <div className="small fw-bold text-navy">{ev.title}</div>
                      <div className="extra-small text-muted d-flex align-items-center gap-2 mt-1">
                        <Clock size={11} /> {fmtDate(ev.date)} {ev.time && `at ${ev.time}`}
                        {ev.location && <><MapPin size={11} />{ev.location}</>}
                      </div>
                      {ev.supervisor_name && (
                        <div className="extra-small text-muted opacity-75">{ev.supervisor_name}</div>
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
        )}

        {/* Milestones */}
        {milestones?.length > 0 && (
          <Card className="glass-card border-0 shadow-sm">
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
                      {m.date && <div className="extra-small text-muted">Date: {fmtDate(m.date)}</div>}
                    </div>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Request Meeting Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6 d-flex align-items-center gap-2">
            <CalendarIcon size={18} className="text-primary" /> Request Meeting with Supervisor
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAdd}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Meeting Title</Form.Label>
              <Form.Control placeholder="e.g. Progress Review" value={newEvent.title}
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
              <Form.Label className="small fw-bold">Location (optional)</Form.Label>
              <Form.Control placeholder="e.g. Office B204 / Online" value={newEvent.location}
                onChange={e => setNewEvent(p => ({ ...p, location: e.target.value }))} />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold">Notes (optional)</Form.Label>
              <Form.Control as="textarea" rows={2} value={newEvent.notes}
                onChange={e => setNewEvent(p => ({ ...p, notes: e.target.value }))} />
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
                <Badge bg={selectedEvent.type === 'defense' ? 'success' : 'primary'} className="text-capitalize">
                  {selectedEvent.type === 'defense' ? 'Defense' : 'Meeting'}
                </Badge>
                <Badge bg={statusBadge[selectedEvent.status] || 'secondary'} className="text-capitalize">
                  {selectedEvent.status}
                </Badge>
              </div>
              <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                <CalendarIcon size={16} /> {fmtDate(selectedEvent.date)}
              </div>
              {selectedEvent.time && (
                <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                  <Clock size={16} /> {selectedEvent.time}
                </div>
              )}
              {selectedEvent.location && (
                <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                  <MapPin size={16} /> {selectedEvent.location}
                </div>
              )}
              {selectedEvent.supervisor_name && (
                <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                  <Users size={16} /> Supervisor: {selectedEvent.supervisor_name}
                </div>
              )}
              {selectedEvent.notes && (
                <p className="small text-navy mt-3 mb-0">{selectedEvent.notes}</p>
              )}
            </Modal.Body>
            <Modal.Footer className="border-0">
              <Button variant="outline-secondary" onClick={() => setShowEventModal(false)}>Close</Button>
              {selectedEvent.type !== 'defense' && (
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
