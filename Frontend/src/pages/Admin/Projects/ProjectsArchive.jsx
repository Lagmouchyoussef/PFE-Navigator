import React, { useState } from 'react';
import { 
  Archive, Search, Filter, Download, 
  FileText, MapPin, Calendar, Clock,
  ChevronRight, BookOpen, Briefcase, 
  CheckCircle, XCircle, MoreHorizontal
} from 'lucide-react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Modal, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';

const ARCHIVE_DATA = [
  { id: 'A', name: 'Projet Alpha', desc: 'Développement d\'une application mobile pour la gestion des ressources.', date: '15 Avr 2026', files: 12, status: 'Completed', type: 'Mobile', supervisor: 'Dr. Mansouri' },
  { id: 'B', name: 'Projet Beta', desc: 'Interface web de visualisation de données en temps réel.', date: '28 Mar 2026', files: 8, status: 'Completed', type: 'Web', supervisor: 'Mme. Alami' },
  { id: 'G', name: 'Projet Gamma', desc: 'Système automatique d\'analyse de performance.', date: '10 Mar 2026', files: 15, status: 'Completed', type: 'System', supervisor: 'Mr. Tazi' },
  { id: 'D', name: 'Projet Delta', desc: 'Plateforme e-learning interactive avec IA.', date: '22 Fév 2026', files: 20, status: 'Completed', type: 'AI', supervisor: 'Dr. Mansouri' },
  { id: 'E', name: 'Projet Epsilon', desc: 'Solution de cybersécurité pour entreprise.', date: '05 Fév 2026', files: 6, status: 'Cancelled', type: 'Security', supervisor: 'Mme. Alami' },
  { id: 'Z', name: 'Projet Zeta', desc: 'Optimisation énergétique pour bâtiments intelligents.', date: '18 Jan 2026', files: 9, status: 'Completed', type: 'IoT', supervisor: 'Mr. Tazi' },
];

const ProjectsArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredProjects = ARCHIVE_DATA.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Archives des Projets</h2>
            <p className="text-muted small mb-0">Consultez et gérez l'historique de tous les projets passés.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Filter size={18} /> Filtrer
            </Button>
            <Button variant="primary" className="fw-bold px-4 py-2 rounded-pill border-0 shadow-sm d-flex align-items-center gap-2" style={{ backgroundColor: '#2563eb' }}>
              <Download size={18} /> Exporter
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="projects-glass-card p-4 rounded-4 mb-5 shadow-sm">
          <InputGroup className="bg-surface-alt rounded-pill border px-2">
            <InputGroup.Text className="bg-transparent border-0 text-muted">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Rechercher un projet, un rapport ou une thématique..."
              className="bg-transparent border-0 py-2 small shadow-none text-primary-custom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project, i) => (
            <Col key={project.id} lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="h-100"
              >
                <div className="projects-glass-card rounded-4 overflow-hidden h-100 shadow-sm d-flex flex-column transition-all hover-translate">
                  <div className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                        <Briefcase size={20} />
                      </div>
                      <Badge bg={project.status === 'Completed' ? 'success' : 'danger'} className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small rounded-pill">
                        {project.status === 'Completed' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                        {project.status}
                      </Badge>
                    </div>
                    
                    <h5 className="fw-bold mb-2">{project.name}</h5>
                    <p className="text-muted extra-small mb-4 line-clamp-2" style={{ minHeight: '40px' }}>
                      {project.desc}
                    </p>
                    
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                        <Calendar size={14} className="text-primary" /> {project.date}
                      </div>
                      <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                        <FileText size={14} className="text-primary" /> {project.files} documents archivés
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-top bg-surface-alt d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                        {project.supervisor.charAt(0)}
                      </div>
                      <span className="extra-small fw-bold opacity-75">{project.supervisor}</span>
                    </div>
                    <Button variant="link" className="p-0 text-primary extra-small fw-bold text-decoration-none">Détails <ChevronRight size={14}/></Button>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>

      <style>{`
        .projects-modern-layout {
          color: var(--text-primary);
        }
        .projects-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .hover-translate:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          border-color: var(--primary) !important;
        }
        h2, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default ProjectsArchive;
