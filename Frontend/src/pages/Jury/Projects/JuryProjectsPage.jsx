import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Form, Button, Table, ProgressBar, Dropdown, Modal
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Eye, MoreVertical, Download, Settings, ChevronDown, Edit, FileText,
  Trash2, Mail, Archive, ExternalLink, Calendar, User, Briefcase, X
} from 'lucide-react';

const PROJECTS_DATA = [
  { id: 'STU-2024-001', student: 'Ahmed Benali', title: 'Système de Gestion Intelligent basé sur l\'IA', supervisor: 'Prof. Martin', defenseDate: '2026-05-05', progress: 85, status: 'Ready for Review', score: null, avatar: 'AB', color: 'primary' },
  { id: 'STU-2024-002', student: 'Sara Kamali', title: 'Vérification de Certificats par Blockchain', supervisor: 'Dr. Chen', defenseDate: '2026-05-06', progress: 60, status: 'Pending', score: null, avatar: 'SK', color: 'info' },
  { id: 'STU-2024-003', student: 'Mohamed Alaoui', title: 'Solution IoT pour Campus Intelligent', supervisor: 'Prof. Smith', defenseDate: '2026-04-28', progress: 100, status: 'Evaluated', score: '17.5/20', avatar: 'MA', color: 'success' },
  { id: 'STU-2024-004', student: 'Fatima Zahra', title: 'Application Mobile pour Inscription aux Cours', supervisor: 'Dr. Johnson', defenseDate: '2026-05-07', progress: 90, status: 'Ready for Review', score: null, avatar: 'FZ', color: 'warning' },
  { id: 'STU-2024-005', student: 'Youssef Idrissi', title: 'Modèles de Prédiction Machine Learning', supervisor: 'Prof. Garcia', defenseDate: '2026-04-30', progress: 100, status: 'Evaluated', score: '16.8/20', avatar: 'YI', color: 'danger' }
];

const JuryProjectsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="jury-projects-modern py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Projets Assignés</h2>
            <p className="text-muted small mb-0">Gérez et évaluez les projets qui vous sont assignés.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Exporter la liste
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Projets', value: '45', color: 'primary' },
            { label: 'En attente', value: '12', color: 'warning' },
            { label: 'Complétés', value: '28', color: 'success' },
            { label: 'Priorité', value: '5', color: 'danger' }
          ].map((stat, i) => (
            <Col lg={3} md={6} key={i}>
              <div className={`projects-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <h4 className="fw-bold mb-1">{stat.value}</h4>
                <div className="extra-small text-muted fw-bold text-uppercase">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Search Bar */}
        <div className="projects-glass-card p-4 rounded-4 mb-5 shadow-sm">
          <InputGroup className="bg-surface-alt rounded-pill border px-2">
            <InputGroup.Text className="bg-transparent border-0 text-muted">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Rechercher par étudiant ou projet..." 
              className="bg-transparent border-0 shadow-none small py-2 text-primary-custom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Projects Table */}
        <div className="projects-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 jury-projects-table">
              <thead>
                <tr className="border-bottom opacity-50 bg-surface-alt">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Titre du Projet</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Encadrant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Progression</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS_DATA.filter(p => 
                  p.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  p.title.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((proj, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`avatar-sm bg-${proj.color} bg-opacity-10 text-${proj.color} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                          {proj.avatar}
                        </div>
                        <div>
                          <div className="small fw-bold">{proj.student}</div>
                          <div className="extra-small text-muted">{proj.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="small fw-bold text-truncate" style={{maxWidth: '250px'}} title={proj.title}>{proj.title}</div>
                      <div className="extra-small text-muted d-flex align-items-center gap-1 mt-1">
                        <Calendar size={12} className="opacity-50" /> Soutenance: {proj.defenseDate}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="small fw-bold opacity-75">{proj.supervisor}</span>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2" style={{ width: '120px' }}>
                        <ProgressBar now={proj.progress} className="flex-grow-1" style={{ height: '6px', backgroundColor: 'var(--background)' }} />
                        <span className="extra-small text-muted fw-bold">{proj.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg={proj.status === 'Evaluated' ? 'success' : 'warning'} className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small">
                        {proj.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                          <Dropdown.Item className="extra-small fw-bold" onClick={() => navigate('/jury/evaluation', { state: { project: proj } })}><Edit size={14} className="me-2"/> Évaluer</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold" onClick={() => { setSelectedProject(proj); setShowModal(true); }}><Eye size={14} className="me-2"/> Détails</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="extra-small fw-bold text-danger">Signaler</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="jury-modern-modal">
        <div className="projects-glass-card rounded-4 overflow-hidden border-0">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Détails du Projet</h5>
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setShowModal(false)}><X size={20}/></Button>
          </div>
          <div className="p-4">
            {selectedProject && (
              <div className="space-y-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className={`p-4 rounded-circle bg-${selectedProject.color} bg-opacity-10 text-${selectedProject.color} fw-bold h4 mb-0`}>
                    {selectedProject.avatar}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">{selectedProject.student}</h5>
                    <div className="extra-small text-muted fw-bold">ID: {selectedProject.id}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="extra-small text-muted fw-bold text-uppercase mb-1">Titre du Projet</div>
                  <div className="small fw-bold lh-base">{selectedProject.title}</div>
                </div>
                <Row className="g-4">
                  <Col xs={6}>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1">Encadrant</div>
                    <div className="small fw-bold">{selectedProject.supervisor}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1">Soutenance</div>
                    <div className="small fw-bold">{selectedProject.defenseDate}</div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div className="p-4 border-top bg-surface-alt d-flex gap-2">
            <Button variant="outline-secondary" className="flex-grow-1 rounded-pill fw-bold extra-small" onClick={() => setShowModal(false)}>Fermer</Button>
            <Button variant="primary" className="flex-grow-1 rounded-pill fw-bold extra-small" style={{ backgroundColor: '#2563eb' }} onClick={() => navigate('/jury/evaluation', { state: { project: selectedProject } })}>Évaluer</Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .jury-projects-modern {
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
        .jury-projects-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        
        h2, h4, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default JuryProjectsPage;
