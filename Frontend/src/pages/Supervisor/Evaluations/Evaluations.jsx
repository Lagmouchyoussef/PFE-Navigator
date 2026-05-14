import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar, Form, Dropdown, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, AlertCircle, Clock, 
  MessageSquare, Star, Download, Eye, 
  Filter, ChevronRight, Award, Edit3, X
} from 'lucide-react';

// Data will be fetched from context

const Evaluations = () => {
  const { saveScore, isGradesPublished, scores, pfeWeights, students, updateStudentEvaluation } = useApp();
  const [filter, setFilter] = useState('All');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewSubmission, setSelectedViewSubmission] = useState(null);
  const [pfeNote, setPfeNote] = useState('');

  const handleOpenEval = (student) => {
    setSelectedStudent(student);
    setPfeNote(student.supervisorScore !== null ? student.supervisorScore.toString() : '0');
    setShowEvalModal(true);
  };

  const handleViewSubmission = (sub) => {
    setSelectedViewSubmission(sub);
    setShowViewModal(true);
  };

  const handleEvalSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    updateStudentEvaluation(selectedStudent.id, { 
      supervisorScore: pfeNote === '' ? 0 : Number(pfeNote),
      isSupervisorEvaluated: true 
    });
    setShowEvalModal(false);
    setSuccessMsg(`Confirmation : Les notes pour ${selectedStudent.name} ont été enregistrées avec succès.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleDraft = () => {
    if (!selectedStudent) return;
    updateStudentEvaluation(selectedStudent.id, { 
      supervisorScore: pfeNote === '' ? 0 : Number(pfeNote)
    });
    setShowEvalModal(false);
    setSuccessMsg(`Info : Brouillon pour ${selectedStudent.name} mis à jour.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleExport = (format) => {
    setSuccessMsg(`L'exportation au format ${format} a été lancée. Votre fichier sera prêt dans quelques secondes.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleFinalGrades = () => {
    setSuccessMsg("Les notes finales ont été consolidées et envoyées au département académique pour validation.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const filteredData = filter === 'All' ? students : students.filter(item => item.status === filter);

  return (
    <div className="supervisor-evaluations-layout py-4">
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
            <h2 className="fw-bold mb-1 text-navy text-gradient">Évaluations & Retours</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Consultez les soumissions des étudiants et gérez les notes de projet
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 shadow-none"
              >
                <Download size={18} /> Exportation
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Excel')}>
                  <FileText size={14} className="text-success" /> Format Excel (.xlsx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Word')}>
                  <FileText size={14} className="text-primary" /> Format Word (.docx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('PDF')}>
                  <FileText size={14} className="text-danger" /> Format PDF (.pdf)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button 
              className="btn-premium d-flex align-items-center gap-2 shadow-sm"
              onClick={handleFinalGrades}
            >
              <Award size={18} /> Notes Finales
            </Button>
          </div>
        </header>

        {/* Evaluation Summary Cards */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <Card className="glass-card border-0 shadow-sm border p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-navy mb-0">Progression de la Correction</h6>
                <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">Semestre 2</Badge>
              </div>
              <Row className="text-center g-4">
                <Col xs={4}>
                  <div className="h2 fw-bold text-navy mb-1">14</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Soumissions</div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="h2 fw-bold text-success mb-1">8</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Évaluées</div>
                </Col>
                <Col xs={4}>
                  <div className="h2 fw-bold text-warning mb-1">6</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Restantes</div>
                </Col>
              </Row>
              <div className="mt-4">
                <div className="d-flex justify-content-between extra-small fw-bold text-navy mb-2">
                  <span className="opacity-75">Progression globale</span>
                  <span className="text-primary">57%</span>
                </div>
                <ProgressBar now={57} variant="primary" style={{ height: '8px' }} className="rounded-pill bg-surface-alt border-0" />
              </div>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="glass-card border-0 shadow-sm border-start-4 border-primary p-4 h-100 bg-surface-alt">
              <h6 className="fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                <Star size={18} className="text-warning" /> Consolidation des Notes PFE
              </h6>
              <div className="p-3 bg-white rounded-4 shadow-sm mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="extra-small text-muted fw-bold">Note Jury (Soutenance)</span>
                  <Badge className={`extra-small fw-bold ${isGradesPublished ? 'text-navy' : 'text-danger bg-danger-soft border-0'}`}>
                    {isGradesPublished ? `Part Jury: ${pfeWeights.jury}%` : 'Masqué (Secret)'}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="extra-small text-muted fw-bold">Note Encadrant (Suivi)</span>
                  <span className="extra-small fw-bold text-navy">
                    {students.find(s => s.isSupervisorEvaluated)?.supervisorScore ? 'Notes assignées' : 'En attente'} 
                    <span className="opacity-50 ms-1">({pfeWeights.supervisor}%)</span>
                  </span>
                </div>
                <hr className="my-2 opacity-10" />
                <div className="d-flex justify-content-between align-items-center pt-1">
                  <span className="small fw-bold text-navy">Calcul Final</span>
                  <span className={`small fw-bold ${isGradesPublished ? 'text-primary' : 'text-muted opacity-50'}`}>
                    {isGradesPublished ? 'Moyenne Pondérée Appliquée' : 'En attente de publication'}
                  </span>
                </div>
              </div>
              <p className="extra-small text-muted fw-bold mb-0 opacity-75">
                {isGradesPublished 
                  ? "Les notes sont maintenant publiques et visibles par l'étudiant."
                  : "La note du jury reste secrète jusqu'à la publication officielle par l'administration."}
              </p>
            </Card>
          </Col>
        </Row>

        {/* Submissions List */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <h6 className="mb-0 fw-bold text-navy">Recent Submissions Queue</h6>
            <div className="d-flex gap-2">
              <Form.Select 
                className="bg-surface-alt border-0 shadow-none extra-small fw-bold py-2 rounded-pill border" 
                style={{ width: '150px' }}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Graded">Graded</option>
              </Form.Select>
            </div>
          </Card.Header>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Livrable</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Date de dépôt</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Ma Note</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Note Jury</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredData.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                            {item.name.charAt(0)}
                          </div>
                          <span className="fw-bold text-navy small">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="extra-small text-muted fw-bold opacity-75">{item.project}</span>
                        </div>
                      </td>
                      <td><span className="extra-small text-muted fw-bold opacity-75">{item.submissionDate}</span></td>
                      <td>
                        <Badge className={`bg-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'}-soft text-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td>
                        {item.supervisorScore !== null ? (
                          <span className="extra-small fw-bold text-navy">{item.supervisorScore}/20</span>
                        ) : (
                          <span className="extra-small text-muted opacity-50 fw-bold">Non noté</span>
                        )}
                      </td>
                      <td>
                        <Badge className={`bg-${item.isJuryEvaluated ? 'success' : 'warning'}-soft text-${item.isJuryEvaluated ? 'success' : 'warning'} border-0 extra-small px-3 py-1 fw-bold`}>
                          {item.isJuryEvaluated ? 'Jury Évalué' : 'Jury en attente'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button 
                            variant="link" 
                            className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => handleViewSubmission(item)}
                          >
                            <Eye size={18} />
                          </Button>
                          <Button 
                             variant="link" 
                             className="p-2 text-success hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                             onClick={() => handleOpenEval(item)}
                           >
                            <Edit3 size={18} />
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
      {/* Supervisor Final PFE Evaluation Modal */}
      <Modal 
        show={showEvalModal} 
        onHide={() => setShowEvalModal(false)}
        centered
        size="lg"
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5 d-flex align-items-center gap-2">
            <Award className="text-primary" /> Évaluation Encadrant PFE : {selectedStudent?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleEvalSubmit}>
            <div className="p-3 bg-primary-soft rounded-4 mb-4 border border-primary border-opacity-10">
              <p className="extra-small text-primary fw-bold mb-0">
                Projet : <span className="text-navy">{selectedStudent?.project}</span>
              </p>
            </div>
            
            <Row className="g-4">
              <Col lg={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Préparation du projet & Suivi</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                    placeholder="L'étudiant a-t-il bien préparé son projet ? Comment jugez-vous son assiduité ?"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Respect des consignes de l'encadrant</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                    placeholder="L'étudiant a-t-il respecté vos consignes techniques et méthodologiques ?"
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <div className="h-100 p-4 rounded-4 bg-surface-alt border border-light-soft d-flex flex-column align-items-center justify-content-center text-center">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Note de l'Encadrant</Form.Label>
                  <Form.Control 
                    type="number" 
                    max={20} min={0} 
                    step="0.25"
                    className="h1 fw-bold text-center border-0 bg-transparent text-primary shadow-none mb-0" 
                    style={{ fontSize: '3rem' }}
                    placeholder="00"
                    value={pfeNote}
                    onChange={(e) => setPfeNote(e.target.value)}
                    required
                  />
                  <div className="h5 text-muted opacity-25 fw-bold mt-n2">/ 20</div>
                  <div className="extra-small text-muted fw-bold mt-3 opacity-50">(Coef: 50%)</div>
                </div>
              </Col>
            </Row>

            <div className="mt-4 pt-4 border-top border-light border-opacity-10 d-flex gap-3">
              <Button 
                variant="outline-secondary" 
                className="flex-grow-1 py-3 rounded-pill fw-bold border-2 extra-small shadow-none"
                onClick={handleDraft}
              >
                Sauvegarder Brouillon
              </Button>
              <Button 
                type="submit" 
                className="btn-premium flex-grow-1 py-3 rounded-pill fw-bold shadow-sm border-0"
              >
                Enregistrer Évaluation Finale
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Submission Details Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Détails de la Soumission</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Informations Étudiant</h6>
            <div className="p-3 bg-surface-alt rounded-4 border border-light-soft d-flex align-items-center gap-3">
              <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px' }}>
                {selectedViewSubmission?.name.charAt(0)}
              </div>
              <div>
                <div className="fw-bold text-navy">{selectedViewSubmission?.name}</div>
                <div className="extra-small text-muted fw-bold opacity-75">ID: STU-2026-{selectedViewSubmission?.id}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Détails du Livrable</h6>
            <Card className="border-light-soft rounded-4 shadow-none bg-surface-alt">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="extra-small text-muted fw-bold">Nom du Projet :</span>
                  <span className="extra-small fw-bold text-navy">{selectedViewSubmission?.project}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="extra-small text-muted fw-bold">Date de dépôt :</span>
                  <span className="extra-small fw-bold text-navy">{selectedViewSubmission?.submissionDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="extra-small text-muted fw-bold">Statut actuel :</span>
                  <Badge className={`bg-${selectedViewSubmission?.status === 'Graded' ? 'success' : 'primary'}-soft text-${selectedViewSubmission?.status === 'Graded' ? 'success' : 'primary'} border-0 extra-small fw-bold`}>
                    {selectedViewSubmission?.status}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Progression du Projet</h6>
            <div className="p-3 bg-surface-alt rounded-4 border border-light-soft">
              <div className="d-flex justify-content-between extra-small fw-bold text-navy mb-2">
                <span>Avancement</span>
                <span>{selectedViewSubmission?.progress}%</span>
              </div>
              <ProgressBar now={selectedViewSubmission?.progress} variant="primary" style={{ height: '6px' }} className="rounded-pill bg-white border-0" />
            </div>
          </div>

          <div className="mt-4 pt-3 d-flex gap-2">
            <Button variant="outline-primary" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-2 d-flex align-items-center justify-content-center gap-2 shadow-none" onClick={() => handleExport('PDF')}>
              <Download size={16} /> Télécharger
            </Button>
            <Button variant="primary" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => { setShowViewModal(false); handleOpenEval(selectedViewSubmission); }}>
              Évaluer maintenant
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Evaluations;
