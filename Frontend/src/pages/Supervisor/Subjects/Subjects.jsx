import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, 
  CheckCircle, Clock, AlertCircle, 
  MoreVertical, Edit3, Trash2, 
  ChevronRight, Users, Target, Layout, X, Eye, Download
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

// Custom Animated Trash Icon Component
const AnimatedTrash = ({ isDeleting, size = 32 }) => {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <motion.g
        animate={isDeleting ? { y: -4, rotate: -20, originX: '20px', originY: '6px' } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
};

const SUBJECTS_DATA = [
  {
    id: 1,
    title: "AI-Driven Cybersecurity Threat Detection",
    description: "Developing a real-time system using LSTM networks to detect network intrusions.",
    category: "AI / Security",
    difficulty: "Advanced",
    status: "Approved",
    students: 2,
    date: "2026-04-10"
  },
  {
    id: 2,
    title: "Blockchain for Supply Chain Transparency",
    description: "Implementing a decentralized ledger for tracking pharmaceutical products.",
    category: "Blockchain",
    difficulty: "Intermediate",
    status: "Pending",
    students: 0,
    date: "2026-05-02"
  },
  {
    id: 3,
    title: "Microservices Orchestration with Kubernetes",
    description: "Optimizing resource allocation in a high-traffic e-commerce environment.",
    category: "Cloud / DevOps",
    difficulty: "Intermediate",
    status: "Approved",
    students: 1,
    date: "2026-04-15"
  },
  {
    id: 4,
    title: "Edge Computing for Smart Cities",
    description: "Low-latency processing for urban traffic management using Raspberry Pi clusters.",
    category: "IoT / Edge",
    difficulty: "Advanced",
    status: "Revision",
    students: 0,
    date: "2026-05-10"
  }
];

const Subjects = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalSubject, setDeleteModalSubject] = useState(null);
  const [viewModalSubject, setViewModalSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showOtherObjective, setShowOtherObjective] = useState(false);
  const [selectedObjectives, setSelectedObjectives] = useState([]);
  const [editModalSubject, setEditModalSubject] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredSubjects = SUBJECTS_DATA.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSubjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSubjects.map(s => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setSuccessMsg("Votre proposition de sujet a été soumise avec succès au département.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleEditSubject = (sub) => {
    setEditModalSubject(sub);
    // Mock pre-fill of objectives based on existing data
    setSelectedObjectives(['Étude de l\'existant', 'Conception UML/SI']);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditModalSubject(null);
    setSuccessMsg(`Le sujet "${editModalSubject.title}" a été mis à jour avec succès.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleDeleteSubject = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setSuccessMsg(`Le sujet "${deleteModalSubject.title}" a été supprimé avec succès.`);
      setDeleteModalSubject(null);
      setIsDeleting(false);
      setShowSuccessCard(true);
      setTimeout(() => setShowSuccessCard(false), 5000);
    }, 800);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Revision': return 'danger';
      default: return 'primary';
    }
  };

  const translateStatus = (s) => {
    if (s === 'Approved') return 'Accepté';
    if (s === 'Pending') return 'En Attente';
    if (s === 'Revision') return 'Refusé';
    return s;
  };

  return (
    <div className="supervisor-subjects-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center bg-white"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Action Réussie</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none border-0 hover-bg-surface-alt rounded-circle" onClick={() => setShowSuccessCard(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Sujets de Thèse</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Proposez et gérez les thématiques de recherche pour la session actuelle
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 shadow-none"
              >
                <Download size={18} /> Exportation {selectedIds.length > 0 && `(${selectedIds.length})`}
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                <div className="px-3 py-2 text-muted fw-bold extra-small opacity-50 text-uppercase">Format d'export</div>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => {
                  setSuccessMsg(`L'exportation Excel a été lancée pour ${selectedIds.length > 0 ? selectedIds.length : 'tous les'} sujets.`);
                  setShowSuccessCard(true);
                  setTimeout(() => setShowSuccessCard(false), 5000);
                }}>
                  <FileText size={14} className="text-success" /> Liste Excel (.xlsx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => {
                  setSuccessMsg(`L'exportation Word a été lancée pour ${selectedIds.length > 0 ? selectedIds.length : 'tous les'} sujets.`);
                  setShowSuccessCard(true);
                  setTimeout(() => setShowSuccessCard(false), 5000);
                }}>
                  <FileText size={14} className="text-primary" /> Liste Word (.docx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => {
                  setSuccessMsg(`L'exportation PDF a été lancée pour ${selectedIds.length > 0 ? selectedIds.length : 'tous les'} sujets.`);
                  setShowSuccessCard(true);
                  setTimeout(() => setShowSuccessCard(false), 5000);
                }}>
                  <FileText size={14} className="text-danger" /> Liste PDF (.pdf)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowAddModal(true)}>
              <Plus size={18} /> Proposer un nouveau sujet
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Sujets Totaux', value: '12', icon: <BookOpen />, color: 'primary' },
            { label: 'Approuvés', value: '8', icon: <CheckCircle />, color: 'success' },
            { label: 'En Révision', value: '3', icon: <Clock />, color: 'warning' },
            { label: 'Pris par Étudiants', value: '5', icon: <Users />, color: 'info' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card border-0 shadow-sm border p-3"
              >
                <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color} mb-3 d-inline-block shadow-sm`}>
                  {stat.icon}
                </div>
                <div className="h3 mb-0 fw-bold text-navy">{stat.value}</div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-75">{stat.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Content Section */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <h5 className="mb-0 fw-bold text-navy d-flex align-items-center gap-2">
              <Layout size={20} className="text-primary" />
              Propositions Actives
            </h5>
            <div className="d-flex gap-2">
              <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '250px' }}>
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Filtrer les sujets..." 
                  className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3" style={{ width: '40px' }}>
                    <Form.Check 
                      type="checkbox" 
                      className="custom-checkbox shadow-none"
                      checked={selectedIds.length === filteredSubjects.length && filteredSubjects.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Titre & Description du Sujet</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Catégorie</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Étudiants</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredSubjects.map((subject, index) => (
                    <motion.tr 
                      key={subject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <Form.Check 
                          type="checkbox" 
                          className="custom-checkbox shadow-none"
                          checked={selectedIds.includes(subject.id)}
                          onChange={() => toggleSelectOne(subject.id)}
                        />
                      </td>
                      <td className="py-3" style={{ maxWidth: '400px' }}>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <div className={`p-1 rounded-circle bg-${getStatusStyle(subject.status)}`} style={{ width: '8px', height: '8px' }}></div>
                          <div className="fw-bold text-navy small">{subject.title}</div>
                        </div>
                        <div className="extra-small text-muted fw-bold opacity-75 text-truncate-2" style={{ lineHeight: '1.4' }}>
                          {subject.description}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="extra-small fw-bold text-navy">{subject.category}</span>
                          <span className="extra-small text-muted fw-bold opacity-50" style={{ fontSize: '10px' }}>{subject.difficulty}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div className="avatar-xs bg-surface-alt text-navy rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                            {subject.students}
                          </div>
                          <span className="extra-small text-muted fw-bold opacity-75">Inscrit(s)</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Badge className={`bg-${getStatusStyle(subject.status)}-soft text-${getStatusStyle(subject.status)} border-0 px-3 py-1 extra-small fw-bold d-inline-flex align-items-center gap-1`}>
                          {translateStatus(subject.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button 
                            variant="link" 
                            className="p-2 text-info hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => setViewModalSubject(subject)}
                            title="Voir les détails"
                          >
                            <Eye size={18} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => handleEditSubject(subject)}
                            title="Modifier"
                          >
                            <Edit3 size={18} />
                          </Button>
                          <Button 
                            variant="link" 
                            className="p-2 text-danger hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => setDeleteModalSubject(subject)}
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* Add Subject Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Proposer un nouveau sujet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre du sujet</Form.Label>
              <Form.Control placeholder="ex: Machine Learning dans le Cloud" className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Catégorie / Technologies</Form.Label>
              <Form.Control placeholder="ex: Python, React, AWS" className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description du sujet</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Décrivez la portée du projet..." className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Objectifs Clés (Sélectionnez)</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {['Étude de l\'existant', 'Conception UML/SI', 'Implémentation Tech', 'Tests & Validation', 'Rédaction Mémoire', 'Déploiement Cloud', 'Autre'].map((obj, i) => {
                  const isSelected = selectedObjectives.includes(obj);
                  return (
                    <div 
                      key={i}
                      onClick={() => toggleObjective(obj)}
                      className={`extra-small fw-bold transition-all px-3 py-2 rounded-pill border cursor-pointer unselectable ${
                        isSelected 
                        ? 'bg-primary-soft text-primary border-primary border-opacity-25 shadow-sm' 
                        : 'bg-surface-alt text-navy border-light-soft hover-bg-light'
                      }`}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {obj}
                    </div>
                  );
                })}
              </div>
              <AnimatePresence>
                {showOtherObjective && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      placeholder="Précisez votre objectif personnalisé ici..." 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none mt-2" 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Form.Group>
            <Row className="mb-4">
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Difficulté</Form.Label>
                <Form.Select className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none">
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nb. Max Étudiants</Form.Label>
                <Form.Control type="number" defaultValue={1} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
              </Col>
            </Row>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm">
              Soumettre la proposition
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Subject Modal */}
      <Modal 
        show={!!editModalSubject} 
        onHide={() => setEditModalSubject(null)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Modifier le Sujet</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre du sujet</Form.Label>
              <Form.Control 
                defaultValue={editModalSubject?.title} 
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Catégorie / Technologies</Form.Label>
              <Form.Control 
                defaultValue={editModalSubject?.category} 
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description du sujet</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                defaultValue={editModalSubject?.description} 
                className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Objectifs Clés (Sélectionnez)</Form.Label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {['Étude de l\'existant', 'Conception UML/SI', 'Implémentation Tech', 'Tests & Validation', 'Rédaction Mémoire', 'Déploiement Cloud', 'Autre'].map((obj, i) => {
                  const isSelected = selectedObjectives.includes(obj);
                  return (
                    <div 
                      key={i}
                      onClick={() => toggleObjective(obj)}
                      className={`extra-small fw-bold transition-all px-3 py-2 rounded-pill border cursor-pointer unselectable ${
                        isSelected 
                        ? 'bg-primary-soft text-primary border-primary border-opacity-25 shadow-sm' 
                        : 'bg-surface-alt text-navy border-light-soft hover-bg-light'
                      }`}
                      style={{ cursor: 'pointer', userSelect: 'none' }}
                    >
                      {obj}
                    </div>
                  );
                })}
              </div>
            </Form.Group>
            <Row className="mb-4">
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Difficulté</Form.Label>
                <Form.Select defaultValue={editModalSubject?.difficulty} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none">
                  <option>Débutant</option>
                  <option>Intermédiaire</option>
                  <option>Avancé</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nb. Max Étudiants</Form.Label>
                <Form.Control type="number" defaultValue={editModalSubject?.students} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
              </Col>
            </Row>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm">
              Enregistrer les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Details Modal */}
      <Modal 
        show={!!viewModalSubject} 
        onHide={() => setViewModalSubject(null)}
        centered
        size="lg"
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <div className="d-flex align-items-center gap-3">
            <div className={`p-3 rounded-4 bg-${getStatusStyle(viewModalSubject?.status)}-soft text-${getStatusStyle(viewModalSubject?.status)}`}>
              <BookOpen size={24} />
            </div>
            <div>
              <Modal.Title className="fw-bold text-navy h5 mb-0">Détails du Sujet</Modal.Title>
              <Badge className={`bg-${getStatusStyle(viewModalSubject?.status)}-soft text-${getStatusStyle(viewModalSubject?.status)} border-0 extra-small fw-bold`}>
                {translateStatus(viewModalSubject?.status)}
              </Badge>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4">
            <Col lg={7}>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-2 text-uppercase opacity-50">Titre du Projet</h6>
                <p className="fw-bold text-navy mb-0">{viewModalSubject?.title}</p>
              </div>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-2 text-uppercase opacity-50">Description Complète</h6>
                <p className="extra-small text-muted fw-bold opacity-75" style={{ lineHeight: '1.6', textAlign: 'justify' }}>
                  {viewModalSubject?.description}
                  <br /><br />
                  Ce projet vise à explorer les dernières avancées en {viewModalSubject?.category}. L'étudiant devra faire preuve d'autonomie et de rigueur technique pour mener à bien les objectifs fixés.
                </p>
              </div>
              <div className="p-3 bg-surface-alt rounded-4 border border-light-soft">
                <h6 className="fw-bold text-navy extra-small mb-3 d-flex align-items-center gap-2">
                  <Target size={14} className="text-primary" /> Objectifs Clés
                </h6>
                <ul className="extra-small text-muted fw-bold opacity-75 mb-0 ps-3">
                  <li className="mb-2">Analyse approfondie de l'existant</li>
                  <li className="mb-2">Conception d'une architecture robuste</li>
                  <li className="mb-2">Implémentation et tests unitaires</li>
                  <li>Rédaction du mémoire final</li>
                </ul>
              </div>
            </Col>
            <Col lg={5}>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-3 text-uppercase opacity-50 d-flex align-items-center gap-2">
                  <Users size={16} /> Étudiants Inscrits ({viewModalSubject?.students})
                </h6>
                {viewModalSubject?.students > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {[
                      { name: 'Ahmed Khalil', email: 'ahmed.khalil@emsi.ma', year: '5ème Année' },
                      { name: 'Sara Kamali', email: 'sara.kamali@emsi.ma', year: '5ème Année' }
                    ].slice(0, viewModalSubject?.students).map((stu, i) => (
                      <div key={i} className="p-3 bg-white rounded-4 border border-light-soft shadow-sm hover-shadow-md transition-all">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                            {stu.name.charAt(0)}
                          </div>
                          <div>
                            <div className="extra-small fw-bold text-navy">{stu.name}</div>
                            <div className="text-muted" style={{ fontSize: '10px', fontWeight: 'bold' }}>{stu.year}</div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted" style={{ fontSize: '10px', fontWeight: 'bold' }}>{stu.email}</span>
                          <Button variant="link" className="p-0 extra-small fw-bold text-primary text-decoration-none" onClick={() => navigate(`/supervisor/student/${i+1}`)}>
                            Profil <ChevronRight size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center bg-surface-alt rounded-4 border border-dashed border-light-soft">
                    <p className="extra-small text-muted fw-bold mb-0 opacity-50">Aucun étudiant inscrit pour le moment</p>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-2 text-uppercase opacity-50">Informations Complémentaires</h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-between extra-small fw-bold">
                    <span className="text-muted opacity-75">Difficulté :</span>
                    <span className="text-primary">{viewModalSubject?.difficulty}</span>
                  </div>
                  <div className="d-flex justify-content-between extra-small fw-bold">
                    <span className="text-muted opacity-75">Proposé le :</span>
                    <span className="text-navy">{viewModalSubject?.date}</span>
                  </div>
                  <div className="d-flex justify-content-between extra-small fw-bold">
                    <span className="text-muted opacity-75">Catégorie :</span>
                    <span className="text-navy">{viewModalSubject?.category}</span>
                  </div>
                </div>
              </div>
              <Button variant="primary" className="w-100 py-3 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => setViewModalSubject(null)}>
                Fermer les détails
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={!!deleteModalSubject} 
        onHide={() => setDeleteModalSubject(null)}
        centered
        className="extra-small"
      >
        <Modal.Body className="p-4 text-center">
          <div className="mb-4 d-flex justify-content-center">
            <div className={`p-4 rounded-circle ${isDeleting ? 'bg-danger text-white shadow-lg' : 'bg-danger-soft text-danger'} transition-all`}>
              <AnimatedTrash isDeleting={isDeleting} size={48} />
            </div>
          </div>
          <h5 className="fw-bold text-navy mb-2">
            {isDeleting ? 'Suppression...' : "Supprimer le sujet ?"}
          </h5>
          <p className="text-muted extra-small fw-bold mb-4">
            Voulez-vous vraiment supprimer le sujet <strong>{deleteModalSubject?.title}</strong> ?
          </p>
          <div className="d-flex gap-3">
            <Button variant="light" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0" onClick={() => setDeleteModalSubject(null)}>Annuler</Button>
            <Button variant="danger" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={handleDeleteSubject}>Supprimer</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Subjects;
