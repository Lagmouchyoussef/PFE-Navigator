import React, { useState } from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, MapPin, Users, Clock,
  MoreVertical, Calendar, XCircle, Trash2, Edit, AlertTriangle
} from 'lucide-react';
import { Container, Row, Col, Button, Badge, Modal, Form, Dropdown } from 'react-bootstrap';

interface JurySession {
  id: number;
  title: string;
  day: number;
  date: string;
  location: string;
  time: string;
  members: string[];
  status?: 'Active' | 'Cancelled';
}

const AVAILABLE_JURIES = [
  { id: 'j1', name: 'Dr. Sofia Drissi', dept: 'Informatique' },
  { id: 'j2', name: 'Pr. Youssef Lagmouch', dept: 'Génie Logiciel' },
  { id: 'j3', name: 'Dr. Ahmed Mansouri', dept: 'Cyber-sécurité' },
  { id: 'j4', name: 'Pr. Sara Kamali', dept: 'Intelligence Artificielle' },
  { id: 'j5', name: 'Dr. Karim Tazi', dept: 'Réseaux & Télécoms' },
];

const INITIAL_JURIES: JurySession[] = [
  { id: 1, title: 'Introduction au Jury', day: 1, date: '1 Jan 2025', location: 'Salle A', time: '09:00', members: ['Dr. Sofia Drissi', 'Dr. Ahmed Mansouri'] },
  { id: 2, title: 'Session Technique', day: 3, date: '3 Jan 2025', location: 'Salle B', time: '14:00', members: ['Pr. Youssef Lagmouch'] },
  { id: 3, title: 'Revue de Projet', day: 6, date: '6 Jan 2025', location: 'Amphi C', time: '11:00', members: ['Pr. Sara Kamali', 'Dr. Karim Tazi'] },
  { id: 4, title: 'Design UX/UI', day: 7, date: '7 Jan 2025', location: 'Salle D', time: '10:30', members: ['Dr. Sofia Drissi'] },
  { id: 5, title: 'Audit Final', day: 12, date: '12 Jan 2025', location: 'Salle A', time: '15:00', members: ['Dr. Ahmed Mansouri', 'Pr. Youssef Lagmouch'] },
  { id: 6, title: 'Soutenance Oral', day: 15, date: '15 Jan 2025', location: 'Amphi B', time: '09:30', members: ['Pr. Sara Kamali'] },
  { id: 7, title: 'Clôture de Session', day: 17, date: '17 Jan 2025', location: 'Salle C', time: '16:30', members: ['Dr. Karim Tazi', 'Dr. Sofia Drissi'] },
];

const JuryPlanning: React.FC = () => {
  const [activeView, setActiveView] = useState('Mois');
  const [juries, setJuries] = useState<JurySession[]>(INITIAL_JURIES);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    day: 1, 
    location: '', 
    time: '09:00',
    selectedMembers: [] as string[]
  });
  const [showReschedule, setShowReschedule] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<JurySession | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);

  const handleCancelSession = (id: number) => {
    setJuries(juries.map(j => j.id === id ? { ...j, status: 'Cancelled' as const } : j));
  };

  const handleDeleteSession = (id: number) => {
    setSessionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (sessionToDelete !== null) {
      setJuries(juries.filter(j => j.id !== sessionToDelete));
      setShowDeleteModal(false);
      setSessionToDelete(null);
    }
  };

  const openReschedule = (session: JurySession) => {
    setSessionToReschedule(session);
    setFormData({
      title: session.title,
      day: session.day,
      location: session.location,
      time: session.time,
      selectedMembers: session.members
    });
    setShowReschedule(true);
  };

  const handleConfirmReschedule = () => {
    if (sessionToReschedule) {
      setJuries(juries.map(j => j.id === sessionToReschedule.id ? {
        ...j,
        day: formData.day,
        time: formData.time,
        location: formData.location,
        members: formData.selectedMembers,
        status: 'Active' as const
      } : j));
      setShowReschedule(false);
    }
  };

  const toggleMemberSelection = (name: string) => {
    if (formData.selectedMembers.includes(name)) {
      setFormData({ ...formData, selectedMembers: formData.selectedMembers.filter(m => m !== name) });
    } else {
      setFormData({ ...formData, selectedMembers: [...formData.selectedMembers, name] });
    }
  };

  const days: { day: number, current: boolean }[] = [];
  for (let i = 27; i <= 30; i++) days.push({ day: i, current: false });
  for (let i = 1; i <= 31; i++) days.push({ day: i, current: true });
  while (days.length < 35) days.push({ day: days.length - 31 - 4 + 1, current: false });

  const handleAddJury = () => {
    const newJury: JurySession = {
      id: juries.length + 1,
      title: formData.title,
      day: formData.day,
      date: `${formData.day} Jan 2025`,
      location: formData.location,
      time: formData.time,
      members: formData.selectedMembers
    };
    setJuries([...juries, newJury]);
    setShowModal(false);
    setFormData({ title: '', day: 1, location: '', time: '09:00', selectedMembers: [] });
  };

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Planning des Juries</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Organisez et gérez les sessions d'évaluation académique.</p>
          </div>
          <Button 
            className="btn-premium d-flex align-items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            <Plus size={20} /> Nouveau jury
          </Button>
        </div>

        <Row className="g-4">
          {/* Main Calendar Grid */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <Button variant="link" className="p-1 text-primary border-0 shadow-none"><ChevronLeft size={24} /></Button>
                  <h4 className="fw-bold mb-0 mx-2 text-navy text-nowrap">Janvier 2025</h4>
                  <Button variant="link" className="p-1 text-primary border-0 shadow-none"><ChevronRight size={24} /></Button>
                </div>
                <Form.Control 
                  type="date" 
                  defaultValue="2025-01-01"
                  className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none text-navy border-0"
                  style={{ maxWidth: '180px', cursor: 'pointer' }}
                />
              </div>
              <div className="d-flex gap-2 bg-surface p-1 rounded-pill border">
                {['Mois', 'Semaine'].map(view => (
                  <Button 
                    key={view}
                    variant={activeView === view ? 'primary' : 'link'}
                    className={`px-4 py-1 extra-small rounded-pill border-0 fw-bold text-decoration-none shadow-none ${activeView === view ? 'shadow-sm text-white' : 'text-muted'}`}
                    onClick={() => setActiveView(view)}
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-4 overflow-hidden border shadow-sm">
              <div className="d-flex border-bottom bg-surface-alt text-center fw-bold extra-small text-muted py-3">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => (
                  <div key={d} className="flex-grow-1">{d}</div>
                ))}
              </div>
              <div className="d-flex flex-wrap">
                {days.map((item, idx) => {
                  const dayJuries = juries.filter(j => j.day === item.day && item.current);
                  return (
                    <div key={idx} className={`day-cell border-end border-bottom ${!item.current ? 'opacity-25 bg-surface-alt' : 'bg-surface'}`}>
                      <div className="text-end p-2 extra-small fw-bold text-muted">{item.day}</div>
                      <div className="px-1 d-flex flex-column gap-1 pb-2" style={{ minHeight: '80px' }}>
                        {dayJuries.map(j => (
                          <div 
                            key={j.id} 
                            className={`p-1 px-2 rounded-2 extra-small fw-bold text-truncate cursor-pointer ${j.status === 'Cancelled' ? 'bg-secondary text-white opacity-50' : 'bg-primary text-white'}`}
                            onClick={() => openReschedule(j)}
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
            <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-navy">
                <Clock size={18} className="text-primary" /> Sessions Prochaines
              </h6>
              <div className="d-flex flex-column gap-3">
                {juries.filter(j => j.day >= 1).slice(0, 4).map(j => (
                  <div key={j.id} className={`p-3 rounded-3 border bg-surface-alt hover-bg-surface transition-all cursor-pointer shadow-sm-hover ${j.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <div className="small fw-bold text-navy">{j.title}</div>
                        <Badge className={`bg-${j.status === 'Cancelled' ? 'secondary' : 'primary'}-soft text-${j.status === 'Cancelled' ? 'secondary' : 'primary'} border border-opacity-10 extra-small px-2 mt-1`}>
                          {j.day} Jan {j.status === 'Cancelled' && '• ANNULÉ'}
                        </Badge>
                      </div>
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none hover-bg-surface rounded-circle">
                          <MoreVertical size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small">
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2" onClick={() => openReschedule(j)}>
                            <Calendar size={14} className="text-primary" /> Reporter
                          </Dropdown.Item>
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-warning" onClick={() => handleCancelSession(j.id)}>
                            <XCircle size={14} /> Annuler
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-danger" onClick={() => handleDeleteSession(j.id)}>
                            <Trash2 size={14} /> Supprimer
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                      <MapPin size={12} className="text-primary" /> {j.location} • <Clock size={12} className="text-primary" /> {j.time}
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {j.members.map((m, idx) => (
                        <div key={idx} className="extra-small px-2 py-0 bg-white border rounded text-navy opacity-75 fw-bold">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-100 mt-4 extra-small fw-bold text-primary text-decoration-none border-0 shadow-none">Voir tout le calendrier</Button>
            </div>

            <div className="glass-card p-4 rounded-4 shadow-sm bg-primary-soft border-primary border-opacity-10">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary-soft rounded-circle text-primary">
                  <Users size={20} />
                </div>
                <h6 className="fw-bold mb-0 text-navy">Disponibilité Jury</h6>
              </div>
              <div className="extra-small text-muted mb-3 fw-bold opacity-75">Taux d'occupation des examinateurs pour cette semaine.</div>
              <div className="mb-2 d-flex justify-content-between align-items-center extra-small fw-bold">
                <span className="text-muted">Occupation</span>
                <span className="text-primary">78%</span>
              </div>
              <div className="progress rounded-pill shadow-none bg-surface" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary rounded-pill" style={{ width: '78%' }}></div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal Planifier */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Planifier une Session de Jury</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre de la session</Form.Label>
                  <Form.Control 
                    placeholder="Ex: Soutenance Finale Groupe A" 
                    className="form-control-premium fw-bold py-3"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </Form.Group>
                
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Jour (Janvier)</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" max="31" 
                      className="form-control-premium fw-bold"
                      value={formData.day}
                      onChange={(e) => setFormData({...formData, day: parseInt(e.target.value)})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Heure</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="form-control-premium fw-bold"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Salle / Lieu</Form.Label>
                    <Form.Control 
                      placeholder="Ex: Salle B2" 
                      className="form-control-premium fw-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <div className="p-3 bg-surface-alt rounded-4 border h-100">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Membres du Jury</h6>
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
                    {AVAILABLE_JURIES.map(jury => (
                      <div 
                        key={jury.id} 
                        className={`p-2 rounded-3 border cursor-pointer transition-all ${formData.selectedMembers.includes(jury.name) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-navy'}`}
                        onClick={() => toggleMemberSelection(jury.name)}
                      >
                        <div className="extra-small fw-bold">{jury.name}</div>
                        <div className={`extra-small opacity-75 ${formData.selectedMembers.includes(jury.name) ? 'text-white' : 'text-muted'}`}>{jury.dept}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 extra-small fw-bold text-primary">
                    {formData.selectedMembers.length} membres sélectionnés
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowModal(false)}>Annuler</Button>
          <Button className="btn-premium px-4 py-2" onClick={handleAddJury}>Confirmer le Planning</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Reporter / Modifier */}
      <Modal show={showReschedule} onHide={() => setShowReschedule(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Reporter / Modifier la Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre de la session</Form.Label>
                  <Form.Control 
                    className="form-control-premium fw-bold py-3"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </Form.Group>
                
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nouveau Jour</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" max="31" 
                      className="form-control-premium fw-bold"
                      value={formData.day}
                      onChange={(e) => setFormData({...formData, day: parseInt(e.target.value)})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nouvelle Heure</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="form-control-premium fw-bold"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nouvelle Salle</Form.Label>
                    <Form.Control 
                      className="form-control-premium fw-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <div className="p-3 bg-surface-alt rounded-4 border h-100">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Ajuster le Jury</h6>
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
                    {AVAILABLE_JURIES.map(jury => (
                      <div 
                        key={jury.id} 
                        className={`p-2 rounded-3 border cursor-pointer transition-all ${formData.selectedMembers.includes(jury.name) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-navy'}`}
                        onClick={() => toggleMemberSelection(jury.name)}
                      >
                        <div className="extra-small fw-bold">{jury.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowReschedule(false)}>Annuler</Button>
          <Button className="btn-premium px-4 py-2" onClick={handleConfirmReschedule}>Enregistrer les modifications</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered 
        className="glass-modal"
        size="sm"
      >
        <Modal.Body className="p-4 text-center">
          <div className="mb-4 d-flex justify-content-center">
            <div className="p-3 bg-danger-soft text-danger rounded-circle shadow-sm" style={{ width: 'fit-content' }}>
              <AlertTriangle size={40} />
            </div>
          </div>
          <h5 className="fw-bold text-navy mb-3">Confirmation</h5>
          <p className="small text-muted mb-4 fw-bold opacity-75">
            Êtes-vous sûr de vouloir supprimer cette session ? Cette action est irréversible.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="link" 
              className="text-muted fw-bold text-decoration-none border-0 px-4 shadow-none" 
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              className="rounded-pill px-4 fw-bold shadow-sm border-0 bg-danger"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .day-cell {
          width: calc(100% / 7);
          min-height: 120px;
          border-color: var(--color-border) !important;
          transition: background-color 0.2s;
        }
        .day-cell:hover {
          background-color: var(--color-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default JuryPlanning;
