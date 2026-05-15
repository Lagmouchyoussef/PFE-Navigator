import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Modal, Form, Dropdown 
} from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  Plus, ChevronLeft, ChevronRight, 
  MoreVertical, CheckCircle, AlertCircle,
  Users, Info, Bell, Activity, X, Trash2
} from 'lucide-react';

const SchedulePage = () => {
  const { user, appointments, addAppointment, deleteAppointment, projectMilestones } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'Meeting' });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    addAppointment({
      ...newEvent,
      studentName: user?.name || 'Ahmed Khalil',
      location: 'Online Portal',
      status: 'Confirmed'
    });
    setShowAddModal(false);
    setNewEvent({ title: '', date: '', time: '', type: 'Meeting' });
  };

  const [viewDate, setViewDate] = useState(new Date(2026, 4, 1)); // Default to May 2026 as per user projects

  const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const handleNextYear = () => {
    setViewDate(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  // Calendar Logic
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getEventForDay = (day) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.find(ev => ev.date === dateStr);
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
                <Form.Label className="extra-small fw-bold text-navy opacity-75">TITRE DE L'ÉVÉNEMENT</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="ex: Réunion avec Encadrant" 
                  className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
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
                      value={newEvent.date}
                      onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small fw-bold text-navy opacity-75">HEURE</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                      value={newEvent.time}
                      onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-4">
                <Form.Label className="extra-small fw-bold text-navy opacity-75">TYPE D'ÉVÉNEMENT</Form.Label>
                <Form.Select 
                  className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                  value={newEvent.type}
                  onChange={e => setNewEvent({...newEvent, type: e.target.value})}
                >
                  <option>Réunion</option>
                  <option>Date Limite</option>
                  <option>Revue de Code</option>
                  <option>Soutenance</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm">
                Programmer l'événement
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Événements à venir', value: appointments.length.toString(), icon: <Bell size={24} />, color: 'primary' },
            { label: 'Échéances en attente', value: '2', icon: <AlertCircle size={24} />, color: 'danger' },
            { label: 'Ce mois-ci', value: appointments.filter(a => a.date.startsWith('2026-05')).length.toString(), icon: <CalendarIcon size={24} />, color: 'info' },
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
            <Card className="glass-card border shadow-sm border mb-5">
              <Card.Body className="p-0">
                <div className="p-4 d-flex justify-content-between align-items-center border-bottom bg-white">
                    <div className="d-flex align-items-center gap-3">
                      <div className="d-flex gap-1">
                        <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={handlePrevYear} title="Année précédente"><ChevronLeft size={20} /><ChevronLeft size={20} style={{marginLeft: '-12px'}} /></Button>
                        <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={handlePrevMonth} title="Mois précédent"><ChevronLeft size={20} /></Button>
                      </div>

                      <Form.Control 
                        type="date" 
                        className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none text-navy border-0"
                        style={{ maxWidth: '180px', cursor: 'pointer' }}
                        onChange={(e) => setViewDate(new Date(e.target.value))}
                        value={viewDate.toISOString().split('T')[0]}
                      />
                    </div>
                    
                    <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill bg-surface-alt border cursor-pointer hover-bg-surface transition-all shadow-sm">
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-navy fw-bold p-0 border-0 shadow-none no-caret" style={{ fontSize: '1.1rem', textDecoration: 'none' }}>
                          {months[month]}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 overflow-hidden extra-small dropdown-menu-scrollable">
                          {months.map((m, i) => (
                            <Dropdown.Item key={m} active={i === month} onClick={() => setViewDate(new Date(year, i, 1))}>
                              {m}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      
                      <Dropdown>
                        <Dropdown.Toggle variant="link" className="text-navy fw-bold p-0 border-0 shadow-none no-caret" style={{ fontSize: '1.1rem', textDecoration: 'none', opacity: 0.6 }}>
                          {year}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small dropdown-menu-scrollable">
                          {Array.from({ length: 21 }, (_, i) => 2015 + i).map(y => (
                            <Dropdown.Item key={y} active={y === year} onClick={() => setViewDate(new Date(y, month, 1))}>
                              {y}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>

                    <div className="d-flex gap-1">
                      <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={handleNextMonth} title="Mois suivant"><ChevronRight size={20} /></Button>
                      <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface-alt" onClick={handleNextYear} title="Année suivante"><ChevronRight size={20} /><ChevronRight size={20} style={{marginLeft: '-12px'}} /></Button>
                    </div>
                  </div>
                  <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold extra-small border-2" onClick={() => setViewDate(new Date(2026, 4, 1))}>Aujourd'hui</Button>
                </div>
                <div className="p-4">
                  <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--color-border)', border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
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
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleEventClick(event)}
                              className={`p-2 rounded-3 extra-small fw-bold d-flex align-items-center gap-2 shadow-sm bg-${event.status === 'Upcoming' ? 'primary' : 'success'}-soft text-${event.status === 'Upcoming' ? 'primary' : 'success'} cursor-pointer`}
                              style={{ fontSize: '9px' }}
                            >
                              <div className="rounded-circle" style={{ width: '6px', height: '6px', backgroundColor: 'currentColor' }}></div>
                              {event.title}
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
                  {appointments.slice(0, visibleCount).map((ev, i) => {
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
                      <div key={i} className={`p-4 border-bottom border-light border-opacity-10 hover-bg-surface-alt transition-all ${ev.status === 'Cancelled' ? 'opacity-50 bg-light' : ''}`}>
                        <div className="d-flex gap-4">
                          <div className={`p-3 rounded-4 bg-${iconColor}-soft text-${iconColor} flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '48px', height: '48px' }}>
                            {icon}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <h6 className="fw-bold text-navy mb-0">{ev.title}</h6>
                              <div className="d-flex align-items-center gap-2">
                                <Badge className={`bg-${ev.status === 'Confirmed' ? 'primary' : ev.status === 'Rescheduled' ? 'info' : ev.status === 'Cancelled' ? 'danger' : 'success'}-soft text-${ev.status === 'Confirmed' ? 'primary' : ev.status === 'Rescheduled' ? 'info' : ev.status === 'Cancelled' ? 'danger' : 'success'} border-0 extra-small px-3 py-1 fw-bold`}>{ev.status}</Badge>
                                <Button variant="link" className="p-1 text-danger border-0 shadow-none hover-bg-danger-soft rounded-circle" onClick={() => deleteAppointment(ev.id)}>
                                  <Trash2 size={14} />
                                </Button>
                              </div>
                            </div>
                            
                            <Row className="g-3 mb-3">
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                                  <CalendarIcon size={14} className="text-primary" /> {ev.date}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                                  <MapPin size={14} className="text-primary" /> {ev.location}
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                                  <Clock size={14} className="text-primary" /> {ev.time}
                                </div>
                                <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                                  <Users size={14} className="text-primary" /> {ev.studentName}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {visibleCount < appointments.length && (
                  <div className="p-4 text-center border-top bg-light-soft">
                    <Button 
                      variant="link" 
                      className="text-primary extra-small fw-bold text-decoration-none d-flex align-items-center justify-content-center gap-2 hover-gap-3 transition-all"
                      onClick={() => setVisibleCount(prev => prev + 5)}
                    >
                      Charger plus d'événements <ChevronRight size={14} />
                    </Button>
                  </div>
                )}
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
                    {projectMilestones.map((m, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-surface-alt border-0 shadow-sm">
                        <div>
                          <div className="extra-small fw-bold text-navy">{m.title}</div>
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
                    <h6 className="fw-bold text-navy mb-0">Focus à venir</h6>
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {appointments.slice(0, 5).map((ue, i) => {
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

      {/* Event Details Modal */}
      <Modal 
        show={showEventModal} 
        onHide={() => setShowEventModal(false)} 
        centered 
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <div className="d-flex align-items-center gap-3">
            <div className={`p-2 rounded-3 bg-${selectedEvent?.title.toLowerCase().includes('report') ? 'danger' : 'primary'}-soft text-${selectedEvent?.title.toLowerCase().includes('report') ? 'danger' : 'primary'}`}>
              <CalendarIcon size={24} />
            </div>
            <Modal.Title className="fw-bold text-navy h5 mb-0">{selectedEvent?.title}</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex flex-column gap-4">
            <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-surface-alt border">
              <div className="p-2 rounded-circle bg-white text-primary shadow-sm">
                <Clock size={20} />
              </div>
              <div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-50">Date & Heure</div>
                <div className="small fw-bold text-navy">
                  {selectedEvent && new Date(selectedEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  <span className="mx-2 opacity-25">|</span>
                  {selectedEvent?.time}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-surface-alt border">
              <div className="p-2 rounded-circle bg-white text-danger shadow-sm">
                <MapPin size={20} />
              </div>
              <div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-50">Localisation / Lien</div>
                <div className="small fw-bold text-navy">{selectedEvent?.loc || 'Online Portal'}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-surface-alt border">
              <div className="p-2 rounded-circle bg-white text-success shadow-sm">
                <Users size={20} />
              </div>
              <div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-50">Intervenants</div>
                <div className="small fw-bold text-navy">{selectedEvent?.with || 'Equipe PFE'}</div>
              </div>
            </div>

            <div className="p-3 rounded-4 bg-surface-alt border">
              <div className="extra-small text-muted fw-bold text-uppercase opacity-50 mb-2">Description / Consignes</div>
              <p className="small text-navy mb-0 lh-base">
                {selectedEvent?.desc || "Aucune description supplémentaire fournie pour cet événement."}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button 
            className="btn-premium w-100 py-3 rounded-pill fw-bold shadow-sm border-0" 
            onClick={() => setShowEventModal(false)}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SchedulePage;


