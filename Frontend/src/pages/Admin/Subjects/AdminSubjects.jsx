import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Search, CheckCircle, XCircle,
  Clock, AlertCircle, Layout, Eye, Check, X,
  Filter, MoreVertical, MessageSquare, Edit3, Trash2, Edit,
  Download, FileText, FileDown, Share2, Printer
} from 'lucide-react';

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

const INITIAL_PROPOSALS = [
  {
    id: 1,
    title: "AI-Driven Cybersecurity Threat Detection",
    supervisor: "Dr. Ahmed Mansouri",
    category: "AI / Security",
    difficulty: "Advanced",
    status: "Pending",
    date: "2026-05-12",
    description: "Developing a real-time system using LSTM networks to detect network intrusions."
  },
  {
    id: 2,
    title: "Blockchain for Supply Chain Transparency",
    supervisor: "Pr. Sara Kamali",
    category: "Blockchain",
    difficulty: "Intermediate",
    status: "Pending",
    date: "2026-05-13",
    description: "Implementing a decentralized ledger for tracking pharmaceutical products."
  },
  {
    id: 3,
    title: "Edge Computing for Smart Cities",
    supervisor: "Dr. Yassine Alami",
    category: "IoT / Edge",
    difficulty: "Advanced",
    status: "Pending",
    date: "2026-05-14",
    description: "Low-latency processing for urban traffic management using Raspberry Pi clusters."
  }
];

const AdminSubjects = () => {
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewModalSubject, setViewModalSubject] = useState(null);
  const [editModalSubject, setEditModalSubject] = useState(null);
  const [deleteModalSubject, setDeleteModalSubject] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [selectedProposals, setSelectedProposals] = useState([]);

  const toggleSelectAll = () => {
    if (selectedProposals.length === filteredProposals.length) {
      setSelectedProposals([]);
    } else {
      setSelectedProposals(filteredProposals.map(p => p.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedProposals.includes(id)) {
      setSelectedProposals(selectedProposals.filter(pId => pId !== id));
    } else {
      setSelectedProposals([...selectedProposals, id]);
    }
  };

  const handleExport = (format) => {
    const count = selectedProposals.length;
    alert(`Exportation de ${count} sujet(s) au format ${format} en cours...`);
    // Simulated export logic
    setSelectedProposals([]);
  };

  const handleAction = (id, newStatus) => {
    const statusLabel = newStatus === 'Approved' ? 'approuvé' : 'refusé';
    const sub = proposals.find(p => p.id === id);
    
    setProposals(proposals.map(p => p.id === id ? { ...p, status: newStatus } : p));
    setSuccessMsg(`Le sujet "${sub.title}" a été ${statusLabel} avec succès.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setEditModalSubject(null);
    setSuccessMsg(`Le sujet "${editModalSubject.title}" a été mis à jour par l'administration.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleDeleteSubject = () => {
    setIsDeleting(true);
    setTimeout(() => {
      setSuccessMsg(`Le sujet "${deleteModalSubject.title}" a été définitivement supprimé.`);
      setProposals(proposals.filter(p => p.id !== deleteModalSubject.id));
      setDeleteModalSubject(null);
      setIsDeleting(false);
      setShowSuccessCard(true);
      setTimeout(() => setShowSuccessCard(false), 5000);
    }, 800);
  };

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.supervisor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      case 'Pending': return 'warning';
      default: return 'primary';
    }
  };

  const translateStatus = (s) => {
    if (s === 'Approved') return 'Approuvé';
    if (s === 'Rejected') return 'Refusé';
    if (s === 'Pending') return 'En Attente';
    return s;
  };

  return (
    <div className="admin-subjects-layout py-4">
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
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Approbation des Sujets</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Examinez et validez les propositions de sujets soumises par les encadrants
            </p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'En Attente', value: proposals.filter(p => p.status === 'Pending').length, icon: <Clock />, color: 'warning' },
            { label: 'Approuvés', value: proposals.filter(p => p.status === 'Approved').length, icon: <CheckCircle />, color: 'success' },
            { label: 'Refusés', value: proposals.filter(p => p.status === 'Rejected').length, icon: <XCircle />, color: 'danger' },
            { label: 'Total Reçus', value: proposals.length, icon: <BookOpen />, color: 'primary' },
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
              Propositions à Examiner
            </h5>
            <div className="d-flex gap-3 align-items-center">
              <AnimatePresence>
                {selectedProposals.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="d-flex gap-2 bg-primary-soft p-1 rounded-pill border border-primary border-opacity-10 px-2 shadow-sm"
                  >
                    <div className="extra-small fw-bold text-primary px-2 border-end border-primary border-opacity-25 d-flex align-items-center">
                      {selectedProposals.length} sélectionnés
                    </div>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-primary hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('PDF')}
                    >
                      <FileDown size={14} /> PDF
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-primary hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('Word')}
                    >
                      <FileText size={14} /> Word
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-primary hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('CSV')}
                    >
                      <Download size={14} /> CSV
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
              <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '300px' }}>
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher par titre ou encadrant..." 
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
                      className="custom-checkbox-premium mb-0"
                      checked={selectedProposals.length === filteredProposals.length && filteredProposals.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Sujet & Encadrant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Catégorie</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Difficulté</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions de Décision</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredProposals.map((subject, index) => (
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
                          className="custom-checkbox-premium mb-0"
                          checked={selectedProposals.includes(subject.id)}
                          onChange={() => toggleSelect(subject.id)}
                        />
                      </td>
                      <td className="py-3">
                        <div className="fw-bold text-navy small mb-1">{subject.title}</div>
                        <div className="extra-small text-primary fw-bold d-flex align-items-center gap-1">
                          <MessageSquare size={12} /> {subject.supervisor}
                        </div>
                      </td>
                      <td>
                        <span className="extra-small fw-bold text-navy">{subject.category}</span>
                      </td>
                      <td>
                        <span className="extra-small text-muted fw-bold opacity-75">{subject.difficulty}</span>
                      </td>
                      <td className="text-center">
                        <Badge className={`bg-${getStatusStyle(subject.status)}-soft text-${getStatusStyle(subject.status)} border-0 px-3 py-1 extra-small fw-bold`}>
                          {translateStatus(subject.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <Button 
                            variant="link" 
                            className="p-2 text-info hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => setViewModalSubject(subject)}
                            title="Voir détails"
                          >
                            <Eye size={18} />
                          </Button>
                          
                          <Button 
                            variant="link" 
                            className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => setEditModalSubject(subject)}
                            title="Modifier"
                          >
                            <Edit3 size={18} />
                          </Button>

                          <div className="ms-2 d-flex gap-1">
                            {subject.status === 'Pending' ? (
                              <>
                                <Button 
                                  variant="link" 
                                  className="p-2 text-success hover-bg-success-soft rounded-circle transition-all border-0 shadow-none"
                                  onClick={() => handleAction(subject.id, 'Approved')}
                                  title="Accepter"
                                >
                                  <Check size={18} />
                                </Button>
                                <Button 
                                  variant="link" 
                                  className="p-2 text-danger hover-bg-danger-soft rounded-circle transition-all border-0 shadow-none"
                                  onClick={() => handleAction(subject.id, 'Rejected')}
                                  title="Refuser"
                                >
                                  <X size={18} />
                                </Button>
                              </>
                            ) : (
                              <Button 
                                variant="link" 
                                className="p-2 text-warning hover-bg-warning-soft rounded-circle transition-all border-0 shadow-none"
                                onClick={() => handleAction(subject.id, 'Pending')}
                                title="Remettre en attente"
                              >
                                <Clock size={18} />
                              </Button>
                            )}
                          </div>

                          <Button 
                            variant="link" 
                            className="p-2 text-danger hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none ms-2"
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

      {/* Details Modal */}
      <Modal 
        show={!!viewModalSubject} 
        onHide={() => setViewModalSubject(null)}
        centered
        size="lg"
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Détails de la Proposition</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4">
            <Col lg={8}>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-2 text-uppercase opacity-50">Titre du Sujet</h6>
                <p className="fw-bold text-navy">{viewModalSubject?.title}</p>
              </div>
              <div className="mb-4">
                <h6 className="fw-bold text-navy small mb-2 text-uppercase opacity-50">Description du Projet</h6>
                <p className="extra-small text-muted fw-bold opacity-75" style={{ lineHeight: '1.6' }}>
                  {viewModalSubject?.description}
                </p>
              </div>
              <div className="p-3 bg-surface-alt rounded-4 border border-light-soft">
                <h6 className="fw-bold text-navy extra-small mb-2 text-uppercase opacity-50">Note de l'Administrateur</h6>
                <Form.Control as="textarea" rows={2} placeholder="Ajouter un commentaire ou une raison pour la décision..." className="bg-white border-light-soft extra-small fw-bold shadow-none" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="p-4 bg-surface-alt rounded-4 border border-light-soft h-100">
                <h6 className="fw-bold text-navy small mb-4 text-uppercase opacity-50">Informations</h6>
                <div className="d-flex flex-column gap-3">
                  <div>
                    <span className="extra-small text-muted d-block mb-1">Encadrant</span>
                    <span className="small fw-bold text-navy">{viewModalSubject?.supervisor}</span>
                  </div>
                  <div>
                    <span className="extra-small text-muted d-block mb-1">Date Soumission</span>
                    <span className="small fw-bold text-navy">{viewModalSubject?.date}</span>
                  </div>
                  <div>
                    <span className="extra-small text-muted d-block mb-1">Statut Actuel</span>
                    <Badge className={`bg-${getStatusStyle(viewModalSubject?.status)}-soft text-${getStatusStyle(viewModalSubject?.status)} border-0 extra-small fw-bold`}>
                      {translateStatus(viewModalSubject?.status)}
                    </Badge>
                  </div>
                  <div>
                    <span className="extra-small text-muted d-block mb-1">Difficulté</span>
                    <Badge className="bg-primary-soft text-primary border-0 fw-bold">{viewModalSubject?.difficulty}</Badge>
                  </div>
                </div>
                <div className="mt-5 d-flex flex-column gap-2">
                  {viewModalSubject?.status !== 'Approved' && (
                    <Button variant="success" className="w-100 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => { handleAction(viewModalSubject.id, 'Approved'); setViewModalSubject(null); }}>Approuver</Button>
                  )}
                  {viewModalSubject?.status !== 'Rejected' && (
                    <Button variant="danger" className="w-100 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => { handleAction(viewModalSubject.id, 'Rejected'); setViewModalSubject(null); }}>Refuser</Button>
                  )}
                  {viewModalSubject?.status !== 'Pending' && (
                    <Button variant="warning" className="w-100 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm text-white" onClick={() => { handleAction(viewModalSubject.id, 'Pending'); setViewModalSubject(null); }}>Remettre en attente</Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        show={!!editModalSubject} 
        onHide={() => setEditModalSubject(null)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Modifier la Proposition</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre du sujet</Form.Label>
              <Form.Control defaultValue={editModalSubject?.title} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Encadrant Responsable</Form.Label>
              <Form.Control defaultValue={editModalSubject?.supervisor} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description du sujet</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={editModalSubject?.description} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
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
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Catégorie</Form.Label>
                <Form.Control defaultValue={editModalSubject?.category} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" required />
              </Col>
            </Row>
            <Button type="submit" className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm">
              Enregistrer les modifications admin
            </Button>
          </Form>
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
            {isDeleting ? 'Suppression...' : "Supprimer la proposition ?"}
          </h5>
          <p className="text-muted extra-small fw-bold mb-4">
            Voulez-vous vraiment supprimer définitivement le sujet <strong>{deleteModalSubject?.title}</strong> ? Cette action est irréversible.
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

export default AdminSubjects;
