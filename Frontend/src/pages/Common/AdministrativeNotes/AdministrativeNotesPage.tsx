import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Bell, Filter
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

interface AdministrativeNote {
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

const AdministrativeNotesPage: React.FC = () => {
  const { theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const notes: AdministrativeNote[] = [
    { id: 1, title: 'Mise à jour du planning des soutenances', isNew: true, priority: 'HIGH', category: 'Soutenance', content: 'Les plannings définitifs seront publiés le 5 Mai 2026. Veuillez consulter régulièrement votre portail. Les salles seront affectées 48h avant.', author: 'Bureau Coordination PFE', date: '2026-04-28', pinned: true, unread: true },
    { id: 2, title: 'Rappel : Date limite de soumission', isNew: true, priority: 'HIGH', category: 'Deadlines', content: 'Les rapports finaux doivent être soumis avant le 15 Mai 2026 à 23:59. Tout retard entraînera une pénalité de 5 points par jour.', author: 'Affaires Académiques', date: '2026-04-27', pinned: true, unread: true },
    { id: 3, title: 'Atelier obligatoire : Techniques de présentation', isNew: true, priority: 'HIGH', category: 'Workshops', content: 'Atelier prévu le 8 Mai à 14:00 en Amphi B. Présence obligatoire pour tous les étudiants en fin de cycle.', author: 'Pôle Développement Pro', date: '2026-04-23', pinned: true, unread: true },
    { id: 4, title: 'Nouveaux critères d\'évaluation', isNew: false, priority: 'MEDIUM', category: 'Évaluation', content: 'La grille d\'évaluation 2026 a été mise à jour dans le Resource Hub. L\'innovation compte désormais pour 15% de la note finale.', author: 'Dr. Ahmed Mansouri', date: '2026-04-25', pinned: false, unread: false },
  ];

  return (
    <div className="notes-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notes Administratives</h2>
            <p className="text-muted small mb-0">Consultez les annonces et notes officielles de la coordination.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="glass-card rounded-pill border px-3 shadow-none" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Rechercher une note..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-navy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button className="btn-premium d-flex align-items-center gap-2">
              <Filter size={18} /> Filtrer
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Notes" value="8" icon={<FileText />} color="primary" trend="Docs" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Non lues" value="3" icon={<Bell />} color="danger" trend="Alert" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Épinglées" value="3" icon={<Pin />} color="warning" trend="Fav" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Prioritaires" value="4" icon={<AlertCircle />} color="danger" trend="Urgent" />
          </Col>
        </Row>

        {/* Notes Grid */}
        <Row className="g-4 mb-5">
          {notes.map((note) => (
            <Col key={note.id} lg={4} md={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm h-100 position-relative transition-all hover-translate ${note.pinned ? 'border-primary' : ''}`}>
                {note.pinned && (
                  <div className="position-absolute top-0 end-0 p-3">
                    <Pin size={16} className="text-primary" />
                  </div>
                )}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Badge bg={note.priority === 'HIGH' ? 'danger' : 'primary'} className="bg-opacity-10 text-danger border border-danger border-opacity-25 extra-small">
                    {note.priority}
                  </Badge>
                  <Badge bg="secondary" className="bg-opacity-10 text-muted border border-secondary border-opacity-25 extra-small">
                    {note.category}
                  </Badge>
                  {note.unread && <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                </div>
                <h6 className="fw-bold mb-2 lh-base text-navy">{note.title}</h6>
                <p className="extra-small text-muted mb-4 lh-lg fw-bold opacity-75">{note.content.substring(0, 150)}...</p>
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                      {note.author.charAt(0)}
                    </div>
                    <span className="extra-small fw-bold text-navy opacity-75">{note.author}</span>
                  </div>
                  <div className="extra-small text-muted fw-bold">{note.date}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdministrativeNotesPage;
