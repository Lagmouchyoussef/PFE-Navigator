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
import './JuryProjectsPage.css';

const PROJECTS_DATA = [
  { 
    id: 'STU-2024-001', 
    student: 'Ahmed Benali', 
    title: 'Système de Gestion Intelligent basé sur l\'IA', 
    supervisor: 'Prof. Martin', 
    defenseDate: '2026-05-05', 
    progress: 85, 
    status: 'Ready for Review',
    score: null,
    avatar: 'AB',
    avatarColor: '#0046ad'
  },
  { 
    id: 'STU-2024-002', 
    student: 'Sara Kamali', 
    title: 'Vérification de Certificats par Blockchain', 
    supervisor: 'Dr. Chen', 
    defenseDate: '2026-05-06', 
    progress: 60, 
    status: 'Pending',
    score: null,
    avatar: 'SK',
    avatarColor: '#3b82f6'
  },
  { 
    id: 'STU-2024-003', 
    student: 'Mohamed Alaoui', 
    title: 'Solution IoT pour Campus Intelligent', 
    supervisor: 'Prof. Smith', 
    defenseDate: '2026-04-28', 
    progress: 100, 
    status: 'Evaluated',
    score: '17.5/20',
    avatar: 'MA',
    avatarColor: '#10b981'
  },
  { 
    id: 'STU-2024-004', 
    student: 'Fatima Zahra', 
    title: 'Application Mobile pour Inscription aux Cours', 
    supervisor: 'Dr. Johnson', 
    defenseDate: '2026-05-07', 
    progress: 90, 
    status: 'Ready for Review',
    score: null,
    avatar: 'FZ',
    avatarColor: '#8b5cf6'
  },
  { 
    id: 'STU-2024-005', 
    student: 'Youssef Idrissi', 
    title: 'Modèles de Prédiction Machine Learning', 
    supervisor: 'Prof. Garcia', 
    defenseDate: '2026-04-30', 
    progress: 100, 
    status: 'Evaluated',
    score: '16.8/20',
    avatar: 'YI',
    avatarColor: '#f59e0b'
  }
];

const JuryProjectsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEvaluate = (project) => {
    navigate('/jury/evaluation', { state: { project } });
  };

  const handleOpenDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="jp-page-layout">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="jp-header-section mb-4">
          <h1 className="mb-1">Projets Assignés</h1>
          <p className="text-muted fw-medium small">Gérez et évaluez les projets qui vous sont assignés</p>
        </header>

        {/* Stats Grid */}
        <Row className="g-3 mb-4">
          {[
            { label: 'Total des projets', value: 45, color: 'blue' },
            { label: 'En attente', value: 12, color: 'yellow' },
            { label: 'Complétés', value: 28, color: 'green' },
            { label: 'Haute priorité', value: 5, color: 'red' }
          ].map((stat, i) => (
            <Col lg={3} md={6} key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`jp-stat-card-match jp-stat-${stat.color} shadow-sm`}
              >
                <div className="jp-stat-value h2 mb-1">{stat.value}</div>
                <div className="jp-stat-label extra-small">{stat.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Search Bar */}
        <Card className="jp-controls-card mb-4 border-0 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
              <div className="jp-search-match d-flex align-items-center flex-grow-1">
                <Search size={16} className="text-muted me-2" />
                <Form.Control 
                  placeholder="Rechercher par étudiant ou projet..." 
                  className="border-0 bg-transparent shadow-none extra-small fw-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="d-flex gap-2">
              <Button className="jp-btn-match d-flex align-items-center gap-2 py-1 px-3 extra-small border">
                <Download size={14} /> Exporter la liste
              </Button>
            </div>
          </div>
        </Card>

        {/* Table */}
        <div className="jp-table-match shadow-sm overflow-hidden">
          <Table className="mb-0 align-middle">
            <thead>
              <tr>
                <th className="ps-3" style={{width: '30px'}}><Form.Check size="sm" /></th>
                <th style={{width: '22%'}}>Étudiant</th>
                <th style={{width: '25%'}}>Titre du Projet</th>
                <th style={{width: '15%'}}>Encadrant</th>
                <th style={{width: '15%'}}>Progression</th>
                <th style={{width: '10%'}}>Statut</th>
                <th style={{width: '13%'}} className="text-end pe-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS_DATA.filter(p => 
                p.student.toLowerCase().includes(searchTerm.toLowerCase()) || 
                p.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((proj) => (
                <tr key={proj.id} className="hover-bg-light">
                  <td className="ps-3"><Form.Check size="sm" /></td>
                  <td>
                    <div className="d-flex align-items-center gap-2 py-1">
                      <div className="jp-avatar-circle flex-shrink-0" style={{ backgroundColor: proj.avatarColor }}>{proj.avatar}</div>
                      <div className="overflow-hidden">
                        <div className="fw-bold text-navy text-truncate" style={{maxWidth: '140px'}}>{proj.student}</div>
                        <div className="extra-small text-muted">{proj.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="jp-title-col">
                    <div className="fw-bold text-navy jp-title-text" title={proj.title}>{proj.title}</div>
                    <div className="extra-small text-muted d-flex align-items-center gap-1">
                      <Calendar size={12} className="opacity-50" /> Soutenance: {proj.defenseDate}
                    </div>
                  </td>
                  <td><div className="fw-bold text-navy text-truncate" style={{maxWidth: '120px'}}>{proj.supervisor}</div></td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <ProgressBar now={proj.progress} className="jp-progress-thin flex-grow-1" variant="primary" />
                      <span className="extra-small text-muted fw-bold">{proj.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <Badge className={`jp-status-badge extra-small bg-${proj.status === 'Evaluated' ? 'success' : proj.status === 'Ready for Review' ? 'success' : 'warning'}`}>
                      {proj.status === 'Ready for Review' ? 'Ready' : proj.status}
                    </Badge>
                  </td>
                  <td className="pe-3">
                    <div className="d-flex justify-content-end align-items-center gap-1">
                      <Button 
                        className="jp-eval-btn d-flex align-items-center gap-1"
                        onClick={() => handleEvaluate(proj)}
                      >
                        <Edit size={12} /> Évaluer
                      </Button>
                      
                      <div 
                        className="jp-icon-box" 
                        onClick={() => handleOpenDetails(proj)}
                        title="Voir Détails"
                      >
                        <Eye size={14} />
                      </div>

                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                          <MoreVertical size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg small py-1">
                          <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                            <Mail size={14} className="text-primary" /> Envoyer message
                          </Dropdown.Item>
                          <Dropdown.Item className="d-flex align-items-center gap-2 py-2">
                            <ExternalLink size={14} className="text-success" /> Documents
                          </Dropdown.Item>
                          <Dropdown.Divider className="my-1" />
                          <Dropdown.Item className="d-flex align-items-center gap-2 py-2 text-danger">
                            <Trash2 size={14} /> Retirer du jury
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Project Details Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)}
          centered
          className="jp-details-modal"
          backdropClassName="jp-modal-backdrop"
        >
          <Modal.Header className="border-0 pb-0">
            <Modal.Title className="fw-black text-navy h5 d-flex align-items-center gap-2">
              <Briefcase size={20} className="text-primary" /> Détails du Projet
            </Modal.Title>
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setShowModal(false)}>
              <X size={20} />
            </Button>
          </Modal.Header>
          <Modal.Body className="pt-4 px-4 pb-5">
            {selectedProject && (
              <div className="animate-fade-in">
                <div className="d-flex align-items-center gap-3 mb-4 p-3 bg-light rounded-4">
                  <div className="jp-avatar-circle" style={{ backgroundColor: selectedProject.avatarColor, width: '50px', height: '50px', fontSize: '1.2rem' }}>
                    {selectedProject.avatar}
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-navy">{selectedProject.student}</h5>
                    <div className="text-muted small">Identifiant: {selectedProject.id}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="extra-small text-muted fw-bold text-uppercase tracking-wider mb-2 d-block">Titre du Projet</label>
                  <p className="fw-bold text-navy lh-base">{selectedProject.title}</p>
                </div>

                <Row className="g-4 mb-4">
                  <Col sm={6}>
                    <label className="extra-small text-muted fw-bold text-uppercase tracking-wider mb-1 d-block">Encadrant</label>
                    <div className="d-flex align-items-center gap-2 fw-bold text-navy">
                      <User size={16} className="text-primary" /> {selectedProject.supervisor}
                    </div>
                  </Col>
                  <Col sm={6}>
                    <label className="extra-small text-muted fw-bold text-uppercase tracking-wider mb-1 d-block">Soutenance</label>
                    <div className="d-flex align-items-center gap-2 fw-bold text-navy">
                      <Calendar size={16} className="text-primary" /> {selectedProject.defenseDate}
                    </div>
                  </Col>
                </Row>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <label className="extra-small text-muted fw-bold text-uppercase tracking-wider">Progression des livrables</label>
                    <span className="fw-black text-primary">{selectedProject.progress}%</span>
                  </div>
                  <ProgressBar now={selectedProject.progress} className="jp-progress-thin w-100" style={{ height: '8px' }} />
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <label className="extra-small text-muted fw-bold text-uppercase tracking-wider mb-1 d-block">Statut Actuel</label>
                    <Badge className={`px-3 py-2 bg-${selectedProject.status === 'Evaluated' ? 'success' : 'primary'} bg-opacity-10 text-${selectedProject.status === 'Evaluated' ? 'success' : 'primary'}`}>
                      {selectedProject.status}
                    </Badge>
                  </div>
                  {selectedProject.score && (
                    <div className="text-end">
                      <label className="extra-small text-muted fw-bold text-uppercase tracking-wider mb-1 d-block">Score Attribué</label>
                      <div className="h4 mb-0 fw-black text-success">{selectedProject.score}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0 px-4">
            <Button variant="light" className="flex-grow-1 py-2 fw-bold rounded-3" onClick={() => setShowModal(false)}>Fermer</Button>
            <Button className="jp-eval-btn flex-grow-1 py-2" onClick={() => handleEvaluate(selectedProject)}>Ouvrir l'Évaluation</Button>
          </Modal.Footer>
        </Modal>

      </Container>
    </div>
  );
};

export default JuryProjectsPage;
