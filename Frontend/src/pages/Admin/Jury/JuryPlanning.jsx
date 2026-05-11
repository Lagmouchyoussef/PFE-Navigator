import React, { useState } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, MapPin, Users, X, Clock, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Modal, Form } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

const INITIAL_JURIES = [
  { id: 1, title: 'Introduction au Jury', day: 1, date: '1 Jan 2025', location: 'Salle A' },
  { id: 2, title: 'Session Technique', day: 3, date: '3 Jan 2025', location: 'Salle B' },
  { id: 3, title: 'Revue de Projet', day: 6, date: '6 Jan 2025', location: 'Amphi C' },
  { id: 4, title: 'Design UX/UI', day: 7, date: '7 Jan 2025', location: 'Salle D' },
  { id: 5, title: 'Audit Final', day: 12, date: '12 Jan 2025', location: 'Salle A' },
  { id: 6, title: 'Soutenance Oral', day: 15, date: '15 Jan 2025', location: 'Amphi B' },
  { id: 7, title: 'Clôture de Session', day: 17, date: '17 Jan 2025', location: 'Salle C' },
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
    };
    setJuries([...juries, newJury]);
    setShowModal(false);
    setFormData({ title: '', day: 1, location: '' });
  };

  return (
    <div className="jury-zen-layout p-4">
      <Container>
        {/* Simple Header */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold text-dark mb-0">Jury Planning</h2>
          <Button 
            className="btn-classic-primary px-4 py-2 fw-bold d-flex align-items-center gap-2 border-0 shadow-sm"
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
                <Button variant="link" className="p-1 text-dark border-0"><ChevronLeft size={24} /></Button>
                <h4 className="fw-bold text-dark mb-0 mx-2">Janvier 2025</h4>
                <Button variant="link" className="p-1 text-dark border-0"><ChevronRight size={24} /></Button>
              </div>
              <ButtonGroup className="bg-light p-1 rounded-2 border">
                {['Mois', 'Semaine'].map(view => (
                  <Button 
                    key={view}
                    variant={activeView === view ? 'white' : 'transparent'}
                    className={`px-3 py-1 extra-small rounded-2 border-0 fw-bold ${activeView === view ? 'shadow-sm text-dark bg-white' : 'text-muted'}`}
                    onClick={() => setActiveView(view)}
                  >
                    {view}
                  </Button>
                ))}
              </ButtonGroup>
            </div>

            <Card className="border shadow-sm rounded-4 bg-white overflow-hidden">
              <div className="calendar-header d-flex border-bottom bg-light text-center fw-bold extra-small text-muted py-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="flex-grow-1">{d}</div>
                ))}
              </div>
              <div className="calendar-body d-flex flex-wrap">
                {days.map((item, idx) => {
                  const dayJuries = juries.filter(j => j.day === item.day && item.current);
                  return (
                    <div key={idx} className={`day-cell border-end border-bottom ${!item.current ? 'bg-light opacity-50' : 'bg-white'}`}>
                      <div className="text-end p-2 extra-small fw-bold text-muted">{item.day}</div>
                      <div className="px-1 d-flex flex-column gap-1 pb-2">
                        {dayJuries.map(j => (
                          <div 
                            key={j.id} 
                            className="jury-bar p-1 px-2 rounded-1 extra-small fw-bold text-dark text-truncate border cursor-pointer"
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
            </Card>
          </Col>

          {/* Right Sidebar: Jurys à venir */}
          <Col lg={4}>
            <div className="ps-lg-3">
              <h5 className="fw-bold text-dark mb-4">Jurys à venir</h5>
              <div className="d-flex flex-column gap-3">
                {juries.slice(0, 5).map(j => (
                  <motion.div 
                    key={j.id} 
                    whileHover={{ x: 3 }}
                    onClick={() => {
                      setSelectedJury(j);
                      setShowDetailsModal(true);
                    }}
                    className="cursor-pointer"
                  >
                    <Card className="upcoming-jury-card border shadow-sm rounded-3 p-3 bg-white">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold small text-dark mb-0">{j.title}</h6>
                        <Badge className="badge-simple-blue extra-small">{j.date}</Badge>
                      </div>
                      <div className="d-flex align-items-center gap-3 mt-2 extra-small text-muted fw-medium">
                        <div className="d-flex align-items-center gap-1"><MapPin size={12} className="text-primary" /> {j.location}</div>
                        <div className="d-flex align-items-center gap-1"><Clock size={12} className="text-primary" /> 09:00</div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* MODAL AJOUT JURY */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Programmer un Jury</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="small fw-bold text-muted">Titre de la session</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Soutenance PFE"
                className="bg-light border-0 p-2 rounded-3 small"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Jour (Janvier)</Form.Label>
                  <Form.Control 
                    type="number" min="1" max="31"
                    className="bg-light border-0 p-2 rounded-3 small"
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Lieu / Salle</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Salle B2"
                    className="bg-light border-0 p-2 rounded-3 small"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button 
              className="btn-classic-primary w-100 py-2 mt-3 fw-bold border-0"
              onClick={handleAddJury}
              disabled={!formData.title || !formData.location}
            >
              Créer la session
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* MODAL DETAILS JURY */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Détails de la Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedJury && (
            <div className="d-flex flex-column gap-4">
              <div>
                <h4 className="fw-bold text-primary mb-1">{selectedJury.title}</h4>
                <Badge className="badge-simple-blue">Confirmé</Badge>
              </div>
              
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light rounded-circle"><Calendar size={18} className="text-primary" /></div>
                  <div>
                    <div className="extra-small fw-bold text-muted text-uppercase">Date & Heure</div>
                    <div className="small fw-bold">{selectedJury.date} à 09:00</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light rounded-circle"><MapPin size={18} className="text-primary" /></div>
                  <div>
                    <div className="extra-small fw-bold text-muted text-uppercase">Localisation</div>
                    <div className="small fw-bold">{selectedJury.location}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 bg-light rounded-circle"><Users size={18} className="text-primary" /></div>
                  <div>
                    <div className="extra-small fw-bold text-muted text-uppercase">Membres du Jury</div>
                    <div className="small fw-bold text-muted">Dr. Ahmed L. (Président), Pr. Sara M., Dr. Karim B.</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                <div className="extra-small fw-bold text-primary text-uppercase mb-1">Note administrative</div>
                <div className="small text-muted italic">Cette session nécessite la présence de tous les membres 15 minutes avant le début.</div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-danger" className="extra-small fw-bold border-0" onClick={() => {
            setJuries(juries.filter(j => j.id !== selectedJury.id));
            setShowDetailsModal(false);
          }}>
            Supprimer la session
          </Button>
          <Button className="btn-classic-primary px-4 py-2" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .jury-zen-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .btn-classic-primary {
          background-color: #2563eb !important;
          color: white;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        .btn-classic-primary:hover {
          background-color: #1d4ed8 !important;
          transform: translateY(-1px);
        }
        .day-cell {
          width: calc(100% / 7);
          min-height: 110px;
          transition: background-color 0.2s ease;
        }
        .day-cell:hover {
          background-color: #f1f5f9 !important;
        }
        .jury-bar {
          background-color: #eff6ff;
          border: 1px solid #bfdbfe !important;
          color: #1e40af !important;
          font-size: 0.7rem;
          padding: 4px 8px !important;
          border-left: 3px solid #2563eb !important;
        }
        .extra-small { font-size: 0.75rem; }
        .calendar-body div:nth-child(7n) {
          border-right: none !important;
        }
        .calendar-header {
          background-color: #f1f5f9 !important;
          color: #475569 !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .upcoming-jury-card {
          border-left: 4px solid #2563eb !important;
          transition: all 0.2s ease;
        }
        .upcoming-jury-card:hover {
          background-color: #f8fafc !important;
          transform: translateX(5px);
        }
        .badge-simple-blue {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600;
        }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default JuryPlanning;
