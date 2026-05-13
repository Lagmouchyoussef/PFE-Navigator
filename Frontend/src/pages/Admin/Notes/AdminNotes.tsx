import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Bell, MoreVertical, Clock, Plus
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

interface Note {
  id: number;
  title: string;
  isNew: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  content: string;
  author: string;
  date: string;
  pinned: boolean;
  unread: boolean;
}

const AdminNotes: React.FC = () => {
  const { theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const notes: Note[] = [
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

  const getPriorityBadge = (priority: Note['priority']) => {
    switch (priority) {
      case 'HIGH': return <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 extra-small fw-bold">HAUTE</Badge>;
      case 'MEDIUM': return <Badge bg="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-25 extra-small fw-bold">MOYENNE</Badge>;
      case 'LOW': return <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small fw-bold">BASSE</Badge>;
      default: return null;
    }
  };

  return (
    <div className="admin-notes-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notes & Annonces</h2>
            <p className="text-muted small mb-0">Suivi des mises à jour et communications importantes.</p>
          </div>
          <Button 
            className="btn-premium d-flex align-items-center gap-2" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> Nouvelle Note
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Notes" value="8" icon={<FileText />} color="primary" trend="Overall" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Non lues" value="3" icon={<Bell />} color="danger" trend="Action" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Épinglées" value="3" icon={<Pin />} color="warning" trend="Fav" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Priorité Haute" value="4" icon={<AlertCircle />} color="danger" trend="Urgent" />
          </Col>
        </Row>

        {/* Search & Filter */}
        <div className="glass-card p-4 rounded-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher une note..." 
                  className="bg-transparent border-0 shadow-none small py-2 text-primary-custom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Toutes</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Épinglées</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Priorité Haute</Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Notes Feed */}
        <div className="notes-feed">
          <Row className="g-4">
            {notes.map((note) => (
              <Col key={note.id} lg={6}>
                <div className={`glass-card p-4 rounded-4 shadow-sm h-100 border-start-4 ${note.pinned ? 'border-warning' : 'border-primary'}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {getPriorityBadge(note.priority)}
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small fw-bold">{note.category}</Badge>
                      {note.pinned && <Pin size={14} className="text-warning fill-warning" />}
                    </div>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                      <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                        <Dropdown.Item className="extra-small fw-bold">Modifier</Dropdown.Item>
                        <Dropdown.Item className="extra-small fw-bold">Épingler</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="extra-small fw-bold text-danger">Supprimer</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  
                  <h5 className="fw-bold mb-3 text-navy">{note.title}</h5>
                  <p className="small text-muted mb-4 lh-base fw-bold opacity-75">{note.content}</p>
                  
                  <div className="p-3 bg-surface-alt rounded-4 border d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                        {note.author.charAt(0)}
                      </div>
                      <span className="extra-small fw-bold text-navy opacity-75">{note.author}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                      <Clock size={14} className="text-primary" /> {note.date}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      <style>{`
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--color-primary) !important; }
        .border-danger { border-left-color: var(--color-danger) !important; }
        .border-warning { border-left-color: var(--color-warning) !important; }
        .fill-warning { fill: var(--color-warning); }
      `}</style>
    </div>
  );
};

export default AdminNotes;
