import React, { useState } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, MapPin, Users, X, Clock, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

const INITIAL_JURIES = [
  { id: 1, title: 'Introduction au Jury', day: 1, date: '1 Jan 2025', location: 'Salle A', time: '09:00' },
  { id: 2, title: 'Session Technique', day: 3, date: '3 Jan 2025', location: 'Salle B', time: '14:00' },
  { id: 3, title: 'Revue de Projet', day: 6, date: '6 Jan 2025', location: 'Amphi C', time: '11:00' },
  { id: 4, title: 'Design UX/UI', day: 7, date: '7 Jan 2025', location: 'Salle D', time: '10:30' },
  { id: 5, title: 'Audit Final', day: 12, date: '12 Jan 2025', location: 'Salle A', time: '15:00' },
  { id: 6, title: 'Soutenance Oral', day: 15, date: '15 Jan 2025', location: 'Amphi B', time: '09:30' },
  { id: 7, title: 'Clôture de Session', day: 17, date: '17 Jan 2025', location: 'Salle C', time: '16:30' },
];

const JuryPlanning = () => {
  const { theme } = useApp();
  const [activeView, setActiveView] = useState('Mois');
  const [juries, setJuries] = useState(INITIAL_JURIES);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJury, setSelectedJury] = useState(null);
  const [formData, setFormData] = useState({ title: '', day: 1, location: '' });

  const days = [];
  for (let i = 27; i <= 30; i++) days.push({ day: i, current: false });
  for (let i = 1; i <= 31; i++) days.push({ day: i, current: true });
  while (days.length < 35) days.push({ day: days.length - 31 - 4 + 1, current: false });

  const handleAddJury = () => {
    const newJury = {
      ...formData,
      id: juries.length + 1,
      date: `${formData.day} Jan 2025`,
      time: '09:00'
    };
    setJuries([...juries, newJury]);
    setShowModal(false);
    setFormData({ title: '', day: 1, location: '' });
  };

  return (
    <div className="jury-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1">Planning des Juries</h2>
            <p className="text-muted small mb-0">Organisez et gérez les sessions d'évaluation académique.</p>
          </div>
          <Button 
            className="fw-bold px-4 py-2 d-flex align-items-center gap-2 border-0 shadow-sm rounded-pill"
            style={{ backgroundColor: '#2563eb' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Nouveau jury
          </Button>
        </div>

        <Row className="g-4">
          {/* Main Calendar Grid */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <Button variant="link" className="p-1 text-primary border-0"><ChevronLeft size={24} /></Button>
                <h4 className="fw-bold mb-0 mx-2">Janvier 2025</h4>
                <Button variant="link" className="p-1 text-primary border-0"><ChevronRight size={24} /></Button>
              </div>
              <div className="d-flex gap-2 bg-surface p-1 rounded-pill border">
                {['Mois', 'Semaine'].map(view => (
                  <Button 
                    key={view}
                    variant={activeView === view ? 'primary' : 'link'}
                    className={`px-4 py-1 extra-small rounded-pill border-0 fw-bold text-decoration-none ${activeView === view ? 'shadow-sm text-white' : 'text-muted'}`}
                    onClick={() => setActiveView(view)}
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>

            <div className="jury-glass-card rounded-4 overflow-hidden shadow-sm">
              <div className="calendar-header d-flex border-bottom bg-surface-alt text-center fw-bold extra-small text-muted py-3">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="flex-grow-1">{d}</div>
                ))}
              </div>
              <div className="calendar-body d-flex flex-wrap">
                {days.map((item, idx) => {
                  const dayJuries = juries.filter(j => j.day === item.day && item.current);
                  return (
                    <div key={idx} className={`day-cell border-end border-bottom ${!item.current ? 'opacity-25 bg-surface-alt' : 'bg-surface'}`}>
                      <div className="text-end p-2 extra-small fw-bold text-muted">{item.day}</div>
                      <div className="px-1 d-flex flex-column gap-1 pb-2" style={{ minHeight: '80px' }}>
                        {dayJuries.map(j => (
                          <div 
                            key={j.id} 
                            className="jury-bar p-1 px-2 rounded-2 extra-small fw-bold text-truncate cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJury(j);
                              setShowDetailsModal(true);
                            }}
                          >
                            {j.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Sidebar Info */}
          <Col lg={4}>
            <div className="jury-glass-card p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Clock size={18} className="text-primary" /> Sessions Prochaines
              </h6>
              <div className="d-flex flex-column gap-3">
                {juries.slice(0, 4).map(j => (
                  <div key={j.id} className="p-3 rounded-4 border bg-surface-alt hover-bg-surface transition-all cursor-pointer">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="small fw-bold">{j.title}</div>
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {j.day} Jan
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center gap-2 extra-small text-muted">
                      <MapPin size={12} /> {j.location} • {j.time}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-100 mt-4 extra-small fw-bold text-primary text-decoration-none">Voir tout le calendrier</Button>
            </div>

            <div className="jury-glass-card p-4 rounded-4 shadow-sm bg-primary bg-opacity-5 border-primary border-opacity-10">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                  <Users size={20} />
                </div>
                <h6 className="fw-bold mb-0">Disponibilité Jury</h6>
              </div>
              <div className="extra-small text-muted mb-3">Taux d'occupation des examinateurs pour cette semaine.</div>
              <div className="mb-2 d-flex justify-content-between align-items-center extra-small fw-bold">
                <span>Occupation</span>
                <span className="text-primary">78%</span>
              </div>
              <div className="progress rounded-pill shadow-none bg-surface" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary rounded-pill" style={{ width: '78%' }}></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modals */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="jury-modal">
        <Modal.Header closeButton className="border-bottom p-4">
          <Modal.Title className="fw-bold fs-5">Planifier un Jury</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-muted uppercase">Titre de la session</Form.Label>
              <Form.Control 
                placeholder="Ex: Soutenance Finale Groupe A" 
                className="settings-input"
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Form.Group>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Jour (Janvier)</Form.Label>
                <Form.Control 
                  type="number" 
                  min="1" 
                  max="31" 
                  className="settings-input"
                  onChange={(e) => setFormData({...formData, day: parseInt(e.target.value)})}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Salle / Lieu</Form.Label>
                <Form.Control 
                  placeholder="Ex: Salle B2" 
                  className="settings-input"
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button variant="primary" className="fw-bold px-4 rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }} onClick={handleAddJury}>Créer la session</Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .jury-modern-layout {
          color: var(--text-primary);
        }
        .jury-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .bg-surface {
          background-color: var(--surface) !important;
        }
        .day-cell {
          width: calc(100% / 7);
          min-height: 120px;
          border-color: var(--border) !important;
        }
        .jury-bar {
          background-color: var(--primary);
          color: #ffffff;
          font-size: 0.65rem;
          box-shadow: 0 2px 4px rgba(var(--primary-rgb), 0.2);
        }
        .settings-input {
          background-color: var(--background) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
          border-radius: 10px;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        h2, h4, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .jury-modal .modal-content {
          background-color: var(--surface);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: 1rem;
        }
        .jury-modal .modal-header, .jury-modal .modal-footer {
          border-color: var(--border) !important;
        }
        .jury-modal .btn-close {
          filter: var(--theme-filter, invert(1));
        }
      `}</style>
    </div>
  );
};

export default JuryPlanning;
