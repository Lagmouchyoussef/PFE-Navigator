import React, { useState } from 'react';
import { 
  Search, Filter, Download, 
  FileText, Calendar, 
  ChevronRight, Briefcase, 
  CheckCircle, XCircle
} from 'lucide-react';
import { Container, Row, Col, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { motion } from 'framer-motion';

interface ArchiveItem {
  id: string;
  name: string;
  desc: string;
  date: string;
  files: number;
  status: 'Completed' | 'Cancelled';
  type: string;
  supervisor: string;
}

const ARCHIVE_DATA: ArchiveItem[] = [
  { id: 'A', name: 'Projet Alpha', desc: 'Développement d\'une application mobile pour la gestion des ressources.', date: '15 Avr 2026', files: 12, status: 'Completed', type: 'Mobile', supervisor: 'Dr. Mansouri' },
  { id: 'B', name: 'Projet Beta', desc: 'Interface web de visualisation de données en temps réel.', date: '28 Mar 2026', files: 8, status: 'Completed', type: 'Web', supervisor: 'Mme. Alami' },
  { id: 'G', name: 'Projet Gamma', desc: 'Système automatique d\'analyse de performance.', date: '10 Mar 2026', files: 15, status: 'Completed', type: 'System', supervisor: 'Mr. Tazi' },
  { id: 'D', name: 'Projet Delta', desc: 'Plateforme e-learning interactive avec IA.', date: '22 Fév 2026', files: 20, status: 'Completed', type: 'AI', supervisor: 'Dr. Mansouri' },
  { id: 'E', name: 'Projet Epsilon', desc: 'Solution de cybersécurité pour entreprise.', date: '5 Fév 2026', files: 6, status: 'Cancelled', type: 'Security', supervisor: 'Mme. Alami' },
  { id: 'Z', name: 'Projet Zeta', desc: 'Optimisation énergétique pour bâtiments intelligents.', date: '18 Jan 2026', files: 9, status: 'Completed', type: 'IoT', supervisor: 'Mr. Tazi' },
];

const ProjectsArchive: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = ARCHIVE_DATA.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Archives des Projets</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Consultez et gérez l'historique de tous les projets passés.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Filter size={18} /> Filtrer
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2">
              <Download size={18} /> Exporter
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 rounded-4 mb-5 shadow-sm">
          <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Rechercher un projet, un rapport ou une thématique..."
              className="bg-transparent border-0 py-2 text-navy fw-bold small shadow-none"
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
                whileHover={{ y: -5 }}
                className="h-100"
              >
                <div className="glass-card rounded-4 overflow-hidden h-100 shadow-sm d-flex flex-column transition-all border">
                  <div className="p-4 flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="p-2 bg-primary-soft text-primary rounded-3">
                        <Briefcase size={20} />
                      </div>
                      <Badge className={`bg-${project.status === 'Completed' ? 'success' : 'danger'}-soft text-${project.status === 'Completed' ? 'success' : 'danger'} border border-${project.status === 'Completed' ? 'success' : 'danger'} border-opacity-10 extra-small px-2`}>
                        {project.status === 'Completed' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                        {project.status === 'Completed' ? 'Terminé' : 'Annulé'}
                      </Badge>
                    </div>
                    
                    <h5 className="fw-bold mb-2 text-navy">{project.name}</h5>
                    <p className="text-muted extra-small mb-4 fw-bold opacity-75 line-clamp-2" style={{ minHeight: '40px' }}>
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
                      <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                        {project.supervisor.split('. ')[1]?.charAt(0) || project.supervisor.charAt(0)}
                      </div>
                      <span className="extra-small fw-bold text-navy opacity-75">{project.supervisor}</span>
                    </div>
                    <Button variant="link" className="p-0 text-primary extra-small fw-bold text-decoration-none border-0 shadow-none">Détails <ChevronRight size={14}/></Button>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default ProjectsArchive;
