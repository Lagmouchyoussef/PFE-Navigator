import React, { useState } from 'react';
import { 
  Archive, Search, Filter, Download, 
  FileText, MapPin, Calendar, Clock,
  ChevronRight, BookOpen, Briefcase, 
  CheckCircle, XCircle
} from 'lucide-react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';

const ARCHIVE_DATA = [
  { id: 'A', name: 'Projet Alpha', desc: 'Développement d\'une application mobile pour la gestion des ressources.', date: '15 Avr 2026', files: 12, status: 'Completed', type: 'Mobile' },
  { id: 'B', name: 'Projet Beta', desc: 'Interface web de visualisation de données en temps réel.', date: '28 Mar 2026', files: 8, status: 'Completed', type: 'Web' },
  { id: 'G', name: 'Projet Gamma', desc: 'Système automatique d\'analyse de performance.', date: '10 Mar 2026', files: 15, status: 'Completed', type: 'System' },
  { id: 'D', name: 'Projet Delta', desc: 'Plateforme e-learning interactive avec IA.', date: '22 Fév 2026', files: 20, status: 'Completed', type: 'AI' },
  { id: 'E', name: 'Projet Epsilon', desc: 'Solution de cybersécurité pour entreprise.', date: '05 Fév 2026', files: 6, status: 'Cancelled', type: 'Security' },
  { id: 'Z', name: 'Projet Zeta', desc: 'Optimisation énergétique pour bâtiments intelligents.', date: '18 Jan 2026', files: 9, status: 'Completed', type: 'IoT' },
];

const ProjectsArchive = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = ARCHIVE_DATA.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-simple-layout p-4">
      <Container>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold text-dark mb-1">Archives des Projets</h2>
            <p className="text-muted small mb-0">Consultez et gérez l'historique de tous les projets passés.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="d-flex align-items-center gap-2 px-3 py-2 fw-bold small border">
              <Filter size={16} /> Filtrer
            </Button>
            <Button variant="outline-secondary" className="d-flex align-items-center gap-2 px-3 py-2 fw-bold small border">
              <Download size={16} /> Exporter
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border shadow-sm rounded-3 mb-5 p-3 bg-white">
          <InputGroup className="bg-light rounded-2 overflow-hidden border-0">
            <InputGroup.Text className="bg-transparent border-0 ps-3">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Rechercher un projet, un rapport ou une thématique..."
              className="bg-transparent border-0 py-2 small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Card>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project, i) => (
            <Col key={project.id} lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="project-simple-card border shadow-sm rounded-3 overflow-hidden h-100 bg-white">
                  <div className="card-header-accent"></div>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-2 bg-light rounded-2 text-primary">
                        <Briefcase size={20} />
                      </div>
                      <Badge className={project.status === 'Completed' ? 'badge-success-simple' : 'badge-danger-simple'}>
                        {project.status === 'Completed' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                        {project.status}
                      </Badge>
                    </div>
                    
                    <h5 className="fw-bold text-dark mb-2">{project.name}</h5>
                    <p className="text-muted small mb-4 line-clamp-2" style={{ minHeight: '40px' }}>
                      {project.desc}
                    </p>

                    <div className="d-flex flex-wrap gap-2 mb-4">
                      <Badge bg="light" className="text-muted border fw-normal">{project.type}</Badge>
                      <Badge bg="light" className="text-muted border fw-normal">{project.files} Fichiers</Badge>
                    </div>

                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <Calendar size={14} />
                        <span className="extra-small fw-medium">{project.date}</span>
                      </div>
                      <Button variant="link" className="p-0 text-primary fw-bold extra-small text-decoration-none d-flex align-items-center gap-1">
                        Détails <ChevronRight size={14} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
          {filteredProjects.length === 0 && (
            <Col xs={12} className="text-center py-5">
              <div className="text-muted mb-2"><Search size={40} className="opacity-20" /></div>
              <h5 className="text-muted fw-bold">Aucun projet trouvé</h5>
              <p className="text-muted small">Essayez de modifier vos critères de recherche.</p>
            </Col>
          )}
        </Row>
      </Container>

      <style>{`
        .projects-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .project-simple-card {
          transition: all 0.2s ease;
          position: relative;
        }
        .project-simple-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
          border-color: #2563eb !important;
        }
        .card-header-accent {
          height: 4px;
          background-color: #e2e8f0;
          transition: background-color 0.2s ease;
        }
        .project-simple-card:hover .card-header-accent {
          background-color: #2563eb;
        }
        .badge-success-simple {
          background-color: #dcfce7 !important;
          color: #166534 !important;
          font-weight: 600;
          display: flex;
          align-items: center;
          padding: 5px 10px;
        }
        .badge-danger-simple {
          background-color: #fee2e2 !important;
          color: #991b1b !important;
          font-weight: 600;
          display: flex;
          align-items: center;
          padding: 5px 10px;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectsArchive;
