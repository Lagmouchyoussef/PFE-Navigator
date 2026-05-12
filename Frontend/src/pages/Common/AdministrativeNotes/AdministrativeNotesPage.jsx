import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Calendar, Users, Bell, Bookmark, ChevronRight,
  MoreVertical, Filter, Clock, X
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdministrativeNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const stats = [
    { label: 'Total Notes', count: 8, icon: <FileText size={20} />, color: 'primary' },
    { label: 'Non lues', count: 3, icon: <Bell size={20} />, color: 'danger' },
    { label: 'Épinglées', count: 3, icon: <Pin size={20} />, color: 'warning' },
    { label: 'Prioritaires', count: 4, icon: <AlertCircle size={20} />, color: 'danger' }
  ];

  const notes = [
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
            <h2 className="fw-bold mb-1">Notes Administratives</h2>
            <p className="text-muted small mb-0">Consultez les annonces et notes officielles de la coordination.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="bg-surface rounded-pill border px-3 shadow-none" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Rechercher une note..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-primary-custom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Button variant="primary" className="fw-bold small px-4 py-2 rounded-pill border-0 shadow-sm d-flex align-items-center gap-2" style={{ backgroundColor: '#2563eb' }}>
              <Filter size={18} /> Filtrer
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {stats.map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <div className={`notes-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.count}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{stat.label}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Notes Grid */}
        <Row className="g-4 mb-5">
          {notes.map((note) => (
            <Col key={note.id} lg={4} md={6}>
              <div className={`notes-glass-card p-4 rounded-4 shadow-sm h-100 position-relative transition-all hover-bg-surface ${note.pinned ? 'border-primary' : ''}`}>
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
                <h6 className="fw-bold mb-2 lh-base">{note.title}</h6>
                <p className="extra-small text-muted mb-4 lh-lg opacity-75">{note.content.substring(0, 150)}...</p>
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                      {note.author.charAt(0)}
                    </div>
                    <span className="extra-small fw-bold opacity-75">{note.author}</span>
                  </div>
                  <div className="extra-small text-muted fw-bold">{note.date}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <style>{`
        .notes-modern-layout {
          color: var(--text-primary);
        }
        .notes-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        
        h2, h4, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
        .border-top {
          border-color: var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default AdministrativeNotesPage;
