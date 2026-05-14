import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, InputGroup, Dropdown, ProgressBar, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MoreHorizontal, 
  MessageSquare, FileText, ChevronRight, 
  Mail, Phone, ExternalLink, Download,
  UserPlus, UserCheck, Clock, CheckCircle, TrendingUp, X, Trash2, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom Animated Trash Icon Component
const AnimatedTrash = ({ isDeleting, size = 32 }) => {
  return (
    <svg 
      width={size} height={size} viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      {/* Lid & Handle */}
      <motion.g
        animate={isDeleting ? { y: -4, rotate: -20, originX: '20px', originY: '6px' } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      {/* Body */}
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
};

const STUDENTS_DATA = [
  { 
    id: 1, 
    name: 'Ahmed Khalil', 
    email: 'ahmed.khalil@emsi-edu.ma',
    project: 'AI-Powered Student Performance Prediction System', 
    progress: 85, 
    status: 'Validated', 
    lastActivity: '2 hours ago',
    type: 'PFE',
    department: 'Software Engineering'
  },
  { 
    id: 2, 
    name: 'Sara Kamali', 
    email: 'sara.kamali@emsi-edu.ma',
    project: 'Blockchain-based Academic Certificate Verification', 
    progress: 60, 
    status: 'In Progress', 
    lastActivity: 'Yesterday',
    type: 'PFE',
    department: 'Cybersecurity'
  },
  { 
    id: 3, 
    name: 'Mohamed Alaoui', 
    email: 'm.alaoui@emsi-edu.ma',
    project: 'IoT Smart Campus Solution for Energy Management', 
    progress: 40, 
    status: 'Pending', 
    lastActivity: '3 days ago',
    type: 'Internship',
    department: 'Embedded Systems'
  },
  { 
    id: 4, 
    name: 'Fatima Zahra', 
    email: 'f.zahra@emsi-edu.ma',
    project: 'Cloud-Native Microservices Architecture for E-Health', 
    progress: 95, 
    status: 'Validated', 
    lastActivity: '5 hours ago',
    type: 'PFE',
    department: 'Cloud Computing'
  },
  { 
    id: 5, 
    name: 'Youssef Amrani', 
    email: 'y.amrani@emsi-edu.ma',
    project: 'Deep Learning for Medical Image Segmentation', 
    progress: 72, 
    status: 'In Progress', 
    lastActivity: '4 hours ago',
    type: 'PFE',
    department: 'AI & Data Science'
  },
  { 
    id: 6, 
    name: 'Laila Bennani', 
    email: 'l.bennani@emsi-edu.ma',
    project: 'Automated Penetration Testing Framework', 
    progress: 55, 
    status: 'In Progress', 
    lastActivity: '1 day ago',
    type: 'PFE',
    department: 'Cybersecurity'
  }
];

const StudentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteModalStudent, setDeleteModalStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showDeliverables, setShowDeliverables] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleExport = (format) => {
    setSuccessMsg(`L'exportation de la liste des étudiants au format ${format} a été lancée.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    setShowAddModal(false);
    setSuccessMsg("L'étudiant a été ajouté avec succès à votre liste de supervision.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleDeleteStudent = () => {
    setIsDeleting(true);
    
    // Simulate deletion delay for animation
    setTimeout(() => {
      setSuccessMsg(`L'étudiant ${deleteModalStudent.name} a été retiré de votre liste de supervision.`);
      setDeleteModalStudent(null);
      setIsDeleting(false);
      setShowSuccessCard(true);
      setTimeout(() => setShowSuccessCard(false), 5000);
    }, 800);
  };

  const filteredStudents = STUDENTS_DATA.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="supervisor-students-layout py-4">
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
            <h2 className="fw-bold mb-1 text-navy text-gradient">Étudiants Supervisés</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Gérez et suivez la progression de vos étudiants en PFE
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
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Excel')}>
                  <FileText size={14} className="text-success" /> Liste Excel (.xlsx) {selectedIds.length > 0 ? 'Selectionnée' : 'Totale'}
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Word')}>
                  <FileText size={14} className="text-primary" /> Liste Word (.docx) {selectedIds.length > 0 ? 'Selectionnée' : 'Totale'}
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('PDF')}>
                  <FileText size={14} className="text-danger" /> Liste PDF (.pdf) {selectedIds.length > 0 ? 'Selectionnée' : 'Totale'}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button 
              className="btn-premium d-flex align-items-center gap-2 shadow-sm"
              onClick={() => setShowAddModal(true)}
            >
              <UserPlus size={18} /> Ajouter un Étudiant
            </Button>
          </div>
        </header>

        {/* Filters & Search */}
        <Card className="glass-card mb-4 p-3 border-0 shadow-sm">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-3">
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search students or projects..." 
                  className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <Form.Select 
                className="bg-surface-alt border-0 shadow-none extra-small fw-bold py-2 rounded-pill border"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Validated">Validated</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Col>
            <Col md={3} lg={6} className="text-md-end">
              <div className="d-flex justify-content-md-end gap-3 align-items-center">
                <span className="extra-small text-muted fw-bold opacity-75">
                  Showing <strong>{filteredStudents.length}</strong> of {STUDENTS_DATA.length} students
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <div className="glass-card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3" style={{ width: '40px' }}>
                    <Form.Check 
                      type="checkbox" 
                      className="custom-checkbox shadow-none"
                      checked={selectedIds.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Student Information</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project Details</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Department</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Progress</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredStudents.map((student, index) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-bottom border-light border-opacity-5"
                    >
                      <td className="px-4 py-3">
                        <Form.Check 
                          type="checkbox" 
                          className="custom-checkbox shadow-none"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleSelectOne(student.id)}
                        />
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                             {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold small text-navy">{student.name}</div>
                            <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-75">
                              <Mail size={12} className="text-primary" /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="extra-small fw-bold text-navy opacity-75 text-wrap mb-1" style={{ maxWidth: '250px', lineHeight: '1.4' }}>
                          {student.project}
                        </div>
                        <Badge className="bg-surface-alt text-muted border-0 extra-small fw-bold rounded-pill px-3 py-1">
                          {student.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="extra-small fw-bold text-muted text-uppercase">
                          {student.department}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1" style={{ width: '120px' }}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="extra-small fw-bold text-navy">{student.progress}%</span>
                            <span className="extra-small text-muted fw-bold opacity-50" style={{ fontSize: '9px' }}>{student.lastActivity}</span>
                          </div>
                          <div className="bg-surface-alt rounded-pill overflow-hidden" style={{ height: '6px' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              className={`h-100 rounded-pill bg-${student.progress > 80 ? 'success' : student.progress > 40 ? 'primary' : 'warning'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge className={`bg-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'}-soft text-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold d-inline-flex align-items-center gap-1`}>
                          {student.status === 'Validated' ? <CheckCircle size={12} /> : student.status === 'In Progress' ? <Clock size={12} /> : <Clock size={12} />}
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button 
                            variant="link" 
                            className="p-2 rounded-circle border-0 text-primary hover-bg-surface-alt"
                            onClick={() => navigate(`/supervisor/messages`)}
                            title="Message Student"
                          >
                            <MessageSquare size={18} />
                          </Button>
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-2 text-muted hover-bg-surface-alt rounded-circle no-caret shadow-none border-0">
                              <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => navigate(`/supervisor/student/${student.id}`)}>
                                <User size={14} className="text-primary" /> Voir le profil
                              </Dropdown.Item>
                               <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => { setSelectedStudent(student); setShowDeliverables(true); }}>
                                <FileText size={14} className="text-success" /> Voir les livrables
                               </Dropdown.Item>
                               <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => { setSelectedStudent(student); setShowValidation(true); }}>
                                <UserCheck size={14} className="text-info" /> Valider une phase
                               </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="py-2 text-danger d-flex align-items-center gap-2" onClick={() => setDeleteModalStudent(student)}>
                                <Trash2 size={14} /> Supprimer l'Étudiant
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </div>

        {/* Summary Stats */}
        <Row className="mt-5 g-4">
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-primary-soft text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Supervision Load</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Current academic year</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">6/8 Students</div>
              <ProgressBar now={75} variant="primary" style={{ height: '8px' }} className="rounded-pill mb-3 bg-surface-alt border-0" />
              <div className="extra-small text-muted fw-bold">75% Capacity Utilized</div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Success Rate</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Validated milestones</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">92.4%</div>
              <div className="extra-small text-success fw-bold d-flex align-items-center gap-1">
                <TrendingUp size={14} /> +4.2% from last semester
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-warning-soft text-warning">
                  <Clock size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Pending Actions</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Needs your attention</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">12 Tasks</div>
              <div className="extra-small text-muted fw-bold text-danger">3 Urgent report reviews</div>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Student Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        centered
        className="extra-small"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Ajouter un Étudiant</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleAddStudent}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted extra-small">Nom</Form.Label>
                  <Form.Control type="text" placeholder="Ex: Dupont" className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-muted extra-small">Prénom</Form.Label>
                  <Form.Control type="text" placeholder="Ex: Jean" className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none" required />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-muted extra-small">Email Académique</Form.Label>
              <Form.Control type="email" placeholder="email@emsi-edu.ma" className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-muted extra-small">Téléphone</Form.Label>
              <Form.Control type="tel" placeholder="+212 6 XX XX XX XX" className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold text-muted extra-small">Titre du Projet</Form.Label>
              <Form.Control type="text" placeholder="Titre du PFE" className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none" required />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted extra-small">Département</Form.Label>
                  <Form.Select className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none">
                    <option>Génie Logiciel</option>
                    <option>Cyber-sécurité</option>
                    <option>IoT</option>
                    <option>Cloud Computing</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-muted extra-small">Type</Form.Label>
                  <Form.Select className="rounded-3 extra-small py-2 bg-surface-alt border-0 shadow-none">
                    <option>PFE</option>
                    <option>Stage</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-grid">
              <Button type="submit" className="btn-premium py-2 rounded-pill fw-bold border-0 shadow-sm">
                Enregistrer l'Étudiant
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={!!deleteModalStudent} 
        onHide={() => setDeleteModalStudent(null)}
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
            {isDeleting ? 'Suppression en cours...' : "Supprimer l'Étudiant ?"}
          </h5>
          <p className="text-muted extra-small fw-bold mb-4">
            Êtes-vous sûr de vouloir retirer <strong>{deleteModalStudent?.name}</strong> de votre liste de supervision ? Cette action est irréversible.
          </p>
          <div className="d-flex gap-3">
            <Button 
              variant="light" 
              className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0"
              onClick={() => setDeleteModalStudent(null)}
            >
              Annuler
            </Button>
            <Button 
              variant="danger" 
              className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm"
              onClick={handleDeleteStudent}
            >
              Confirmer la suppression
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Deliverables Modal */}
      <Modal 
        show={showDeliverables} 
        onHide={() => setShowDeliverables(false)}
        centered
        size="lg"
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Livrables de {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="glass-card border-0 p-0 overflow-hidden rounded-4">
            <Table hover responsive className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Document</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Date de Dépôt</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Taille</th>
                  <th className="px-4 py-3 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, name: 'Cahier des Charges', date: '2025-11-20', size: '2.4 MB' },
                  { id: 2, name: 'Rapport Technique v1', date: '2026-02-15', size: '4.8 MB' },
                  { id: 3, name: 'Présentation Mi-parcours', date: '2026-03-01', size: '1.2 MB' }
                ].map(doc => (
                  <tr key={doc.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        <span className="small fw-bold text-navy">{doc.name}</span>
                      </div>
                    </td>
                    <td className="py-3 small text-muted">{doc.date}</td>
                    <td className="py-3 small text-muted">{doc.size}</td>
                    <td className="px-4 py-3 text-end">
                      <Button variant="link" className="p-1 text-primary shadow-none border-0"><Download size={18}/></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>

      {/* Validation Modal */}
      <Modal 
        show={showValidation} 
        onHide={() => setShowValidation(false)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Valider une Phase</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="small text-muted mb-4 fw-bold opacity-75">Sélectionnez la phase à valider pour <strong>{selectedStudent?.name}</strong> :</p>
          <div className="d-flex flex-column gap-3">
            {[
              { id: 1, name: 'Proposition / Sujet', status: 'completed' },
              { id: 2, name: 'Cahier des Charges', status: 'completed' },
              { id: 3, name: 'Rapport Intérimaire', status: 'current' },
              { id: 4, name: 'Rapport Final', status: 'pending' }
            ].map(phase => (
              <Button 
                key={phase.id}
                variant="outline-primary"
                className={`text-start p-3 rounded-4 d-flex justify-content-between align-items-center border-2 transition-all ${phase.status === 'completed' ? 'border-success text-success bg-success-soft' : phase.status === 'current' ? 'border-primary' : 'opacity-50'}`}
                onClick={() => {
                  if(phase.status !== 'completed') {
                    setSuccessMsg(`La phase "${phase.name}" a été validée avec succès pour ${selectedStudent.name}.`);
                    setShowValidation(false);
                    setShowSuccessCard(true);
                    setTimeout(() => setShowSuccessCard(false), 5000);
                  }
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-2 rounded-circle ${phase.status === 'completed' ? 'bg-success text-white' : 'bg-surface-alt text-primary'}`}>
                    {phase.status === 'completed' ? <CheckCircle size={16}/> : <Clock size={16}/>}
                  </div>
                  <span className="fw-bold small">{phase.name}</span>
                </div>
                {phase.status === 'completed' && <Badge className="bg-success text-white rounded-pill">Validé</Badge>}
              </Button>
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentsList;
