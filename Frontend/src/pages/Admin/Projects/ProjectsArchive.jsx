import React, { useState } from 'react';
import { 
  Archive, Search, Filter, Download, 
  FileText, MapPin, Calendar, Clock,
  ChevronRight, BookOpen, Briefcase, 
  CheckCircle, XCircle
} from 'lucide-react';
import { Container, Row, Col, Card, Button, Badge, Form, InputGroup, Modal } from 'react-bootstrap';
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ARCHIVE_DATA));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "archives_projets.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

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
            <Button variant="outline-secondary" className="d-flex align-items-center gap-2 px-3 py-2 fw-bold small border" onClick={() => setShowFilterModal(true)}>
              <Filter size={16} /> Filtrer
            </Button>
            <Button variant="outline-secondary" className="d-flex align-items-center gap-2 px-3 py-2 fw-bold small border" onClick={handleExport}>
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
                      <Button 
                        variant="link" 
                        className="p-0 text-primary fw-bold extra-small text-decoration-none d-flex align-items-center gap-1"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDetailsModal(true);
                        }}
                      >
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

      {/* DETAILS MODAL */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Détails du Projet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedProject && (
            <Row className="g-4">
              <Col md={12}>
                <div className="p-3 bg-light rounded-3 mb-3 border-start border-4 border-primary">
                  <h4 className="fw-bold text-dark mb-1">{selectedProject.name}</h4>
                  <Badge className={selectedProject.status === 'Completed' ? 'badge-success-simple' : 'badge-danger-simple'}>
                    {selectedProject.status}
                  </Badge>
                </div>
              </Col>
              <Col md={8}>
                <h6 className="fw-bold text-dark">Description</h6>
                <p className="text-muted small">{selectedProject.desc}</p>
                
                <h6 className="fw-bold text-dark mt-4 mb-3">Documents joints</h6>
                <div className="d-flex flex-column gap-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-2 border rounded-2 d-flex justify-content-between align-items-center bg-white">
                      <div className="d-flex align-items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        <span className="small fw-medium">Document_Final_Partie_{i}.pdf</span>
                      </div>
                      <Button variant="light" size="sm"><Download size={14} /></Button>
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={4}>
                <Card className="bg-light border-0 p-3">
                  <h6 className="fw-bold extra-small text-muted text-uppercase mb-3">Informations Clés</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <div className="extra-small fw-bold">{selectedProject.date}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      <div className="extra-small fw-bold">{selectedProject.type}</div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      <div className="extra-small fw-bold">{selectedProject.files} Fichiers</div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" className="extra-small fw-bold" onClick={() => setShowDetailsModal(false)}>Fermer</Button>
          <Button className="btn-classic-primary px-4 py-2" onClick={handleExport}>Télécharger l'Archive</Button>
        </Modal.Footer>
      </Modal>

      {/* FILTER MODAL */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold small">Filtrer les Archives</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Statut</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Tous les statuts</option>
                <option>Terminé</option>
                <option>Annulé</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Thématique</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Toutes les thématiques</option>
                <option>Web</option>
                <option>Mobile</option>
                <option>IA</option>
                <option>Système</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Année</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </Form.Select>
            </Form.Group>
            <Button className="w-100 mt-3 fw-bold border-0" style={{ backgroundColor: '#2563eb' }} onClick={() => setShowFilterModal(false)}>
              Appliquer les filtres
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

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
