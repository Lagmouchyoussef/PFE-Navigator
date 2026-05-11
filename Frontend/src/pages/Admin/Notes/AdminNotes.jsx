import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Dropdown, Modal } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Calendar, Users, Bell, Bookmark, ChevronRight,
  MoreVertical, Filter, Clock, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminNotes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const stats = [
    { label: 'Total Notes', count: 8, icon: <FileText size={20} />, color: 'primary' },
    { label: 'Non lues', count: 3, icon: <Bell size={20} />, color: 'danger' },
    { label: 'Épinglées', count: 3, icon: <Pin size={20} />, color: 'warning' },
    { label: 'Priorité Haute', count: 4, icon: <AlertCircle size={20} />, color: 'danger' }
  ];

  const notes = [
    {
      id: 1,
      title: 'Publication du Planning des Soutenances',
      isNew: true,
      priority: 'HIGH',
      category: 'Soutenance',
      content: 'Les plannings finaux pour tous les étudiants seront publiés le 5 Mai 2026. Veuillez vérifier régulièrement votre portail. Les affectations de salles seront envoyées 48h avant.',
      author: 'Bureau PFE',
      date: '2026-04-28',
      pinned: true,
      unread: true
    },
    {
      id: 2,
      title: 'Rappel Limite de Dépôt',
      isNew: true,
      priority: 'HIGH',
      category: 'Délais',
      content: 'Les rapports finaux doivent être déposés avant le 15 Mai 2026 à 23h59. Tout retard entraînera une pénalité de 5 points par jour.',
      author: 'Affaires Académiques',
      date: '2026-04-27',
      pinned: true,
      unread: true
    },
    {
      id: 3,
      title: 'Atelier de Présentation Obligatoire',
      isNew: true,
      priority: 'HIGH',
      category: 'Ateliers',
      content: 'Tous les étudiants doivent assister à l\'atelier sur les techniques de présentation le 8 Mai à 14h00 dans l\'Amphi B.',
      author: 'Développement Pro',
      date: '2026-04-23',
      pinned: true,
      unread: true
    },
    {
      id: 4,
      title: 'Nouveaux Critères d\'Évaluation',
      isNew: false,
      priority: 'MEDIUM',
      category: 'Évaluation',
      content: 'La grille d\'évaluation 2026 a été mise à jour dans le Centre de Ressources. L\'innovation compte désormais pour 15%.',
      author: 'Dr. Ahmed Mansouri',
      date: '2026-04-25',
      pinned: false,
      unread: false
    }
  ];

  const pinnedNotes = notes.filter(n => n.pinned);
  const otherNotes = notes.filter(n => !n.pinned);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH': return <Badge bg="danger" className="extra-small fw-bold">HAUTE</Badge>;
      case 'MEDIUM': return <Badge bg="warning" className="extra-small fw-bold text-dark">MOYENNE</Badge>;
      case 'LOW': return <Badge bg="success" className="extra-small fw-bold">BASSE</Badge>;
      default: return null;
    }
  };

  return (
    <div className="admin-notes-pro-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Notes & Annonces Administratives</h2>
            <p className="text-muted small mb-0">Suivi des mises à jour et communications importantes.</p>
          </div>
          <Button 
            className="fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2" 
            style={{ backgroundColor: '#2563eb' }}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Nouvelle Note
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col lg={3} md={6} key={i}>
              <Card className="border shadow-sm rounded-4 p-3 h-100 bg-white">
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-circle bg-light text-${s.color}`}>
                    {React.cloneElement(s.icon, { size: 24 })}
                  </div>
                  <div>
                    <div className="extra-small text-muted fw-bold text-uppercase">{s.label}</div>
                    <h3 className="fw-bold text-dark mb-0">{s.count}</h3>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-5">
          <InputGroup className="bg-white rounded-3 shadow-sm border overflow-hidden" style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-transparent border-0">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Rechercher une note..." 
              className="border-0 shadow-none small fw-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <div className="d-flex bg-white rounded-3 shadow-sm border p-1">
            <Button 
              variant={filter === 'all' ? 'primary' : 'white'} 
              size="sm" 
              className={`rounded-2 px-4 fw-bold border-0 ${filter === 'all' ? '' : 'text-muted'}`}
              onClick={() => setFilter('all')}
              style={filter === 'all' ? { backgroundColor: '#2563eb' } : {}}
            >
              Toutes
            </Button>
            <Button 
              variant={filter === 'unread' ? 'primary' : 'white'} 
              size="sm" 
              className={`rounded-2 px-4 fw-bold border-0 ms-1 ${filter === 'unread' ? '' : 'text-muted'}`}
              onClick={() => setFilter('unread')}
              style={filter === 'unread' ? { backgroundColor: '#2563eb' } : {}}
            >
              Non lues
            </Button>
          </div>
        </div>

        {/* Pinned Notes Section */}
        <div className="mb-5">
          <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
            <Pin size={18} className="text-warning" /> Notes Épinglées
          </h5>
          <Row className="g-4">
            {pinnedNotes.map((note) => (
              <Col lg={4} md={6} key={note.id}>
                <NoteCard note={note} getPriorityBadge={getPriorityBadge} />
              </Col>
            ))}
          </Row>
        </div>

        {/* All Notes Section */}
        <div>
          <h5 className="fw-bold text-dark mb-4">Autres Notes</h5>
          <Row className="g-4">
            {otherNotes.map((note) => (
              <Col lg={4} md={6} key={note.id}>
                <NoteCard note={note} getPriorityBadge={getPriorityBadge} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>

      {/* MODAL AJOUT NOTE */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Nouvelle Note Administrative</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="small fw-bold text-muted">Titre</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Réunion de coordination"
                className="bg-light border-0 p-2 rounded-3 small"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="small fw-bold text-muted">Contenu</Form.Label>
              <Form.Control 
                as="textarea" rows={4}
                placeholder="Détails de l'annonce..."
                className="bg-light border-0 p-2 rounded-3 small"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Catégorie</Form.Label>
                  <Form.Select className="bg-light border-0 p-2 rounded-3 small">
                    <option>Soutenance</option>
                    <option>Délais</option>
                    <option>Ateliers</option>
                    <option>Évaluation</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-bold text-muted">Priorité</Form.Label>
                  <Form.Select className="bg-light border-0 p-2 rounded-3 small">
                    <option>HIGH</option>
                    <option>MEDIUM</option>
                    <option>LOW</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Button 
              className="w-100 py-2 mt-3 fw-bold border-0 shadow-sm"
              style={{ backgroundColor: '#2563eb' }}
              onClick={() => setShowAddModal(false)}
            >
              Publier la note
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .admin-notes-pro-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .note-card {
          transition: all 0.2s ease;
        }
        .note-card:hover {
          transform: translateY(-5px);
          border-color: #2563eb !important;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .no-caret::after { display: none; }
      `}</style>
    </div>
  );
};

const NoteCard = ({ note, getPriorityBadge }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <Card className={`note-card border shadow-sm rounded-4 h-100 bg-white ${note.unread ? 'border-primary border-opacity-25' : ''}`}>
      <Card.Body className="p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            {note.isNew && <Badge bg="primary" className="extra-small fw-bold">NOUVEAU</Badge>}
            {getPriorityBadge(note.priority)}
            <Badge bg="light" text="dark" className="extra-small fw-bold border">{note.category}</Badge>
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
              <MoreVertical size={18} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow-lg border-0 rounded-3 extra-small">
              <Dropdown.Item className="fw-bold">Marquer comme lu</Dropdown.Item>
              <Dropdown.Item>Désépingler</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        
        <h6 className="fw-bold text-dark mb-3">{note.title}</h6>
        <p className="small text-muted mb-4 lh-base flex-grow-1">{note.content}</p>
        
        <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-xs bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '10px' }}>{note.author[0]}</div>
            <div className="extra-small fw-bold text-dark">{note.author}</div>
          </div>
          <div className="extra-small text-muted d-flex align-items-center gap-2 fw-bold">
            <Clock size={12} /> {note.date}
          </div>
        </div>
      </Card.Body>
    </Card>
  </motion.div>
);

export default AdminNotes;
