import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Star, Send, CheckCircle, 
  AlertCircle, Edit3, Save, Search, 
  Filter, Share2, Eye, Download, FileText, FileDown
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

// Student list fetched from context

const AdminGrades = () => {
  const { 
    scores, saveScore, isGradesPublished, publishGrades, 
    pfeWeights, updatePfeWeights, 
    juryCriteriaWeights, updateJuryCriteriaWeights, 
    supervisorCriteriaWeights, updateSupervisorCriteriaWeights,
    students, updateStudentEvaluation 
  } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({ supervisor: '', jury: '' });
  const [weightForm, setWeightForm] = useState({ supervisor: 50, jury: 50 });
  const [juryCriteriaWeightForm, setJuryCriteriaWeightForm] = useState({});
  const [supervisorCriteriaWeightForm, setSupervisorCriteriaWeightForm] = useState({});
  const [selectedGrades, setSelectedGrades] = useState([]);

  const toggleSelectAll = () => {
    if (selectedGrades.length === filteredStudents.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades(filteredStudents.map(s => s.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedGrades.includes(id)) {
      setSelectedGrades(selectedGrades.filter(sId => sId !== id));
    } else {
      setSelectedGrades([...selectedGrades, id]);
    }
  };

  const handleExport = (format) => {
    const count = selectedGrades.length;
    alert(`Exportation des notes de ${count} étudiant(s) au format ${format} en cours...`);
    setSelectedGrades([]);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenWeights = () => {
    setWeightForm({ ...pfeWeights });
    setShowWeightModal(true);
  };

  const handleSaveWeights = () => {
    if (parseInt(weightForm.supervisor) + parseInt(weightForm.jury) !== 100) {
      alert("Le total des pourcentages doit être égal à 100%");
      return;
    }
    updatePfeWeights(parseInt(weightForm.supervisor), parseInt(weightForm.jury));
    updateJuryCriteriaWeights(juryCriteriaWeightForm);
    updateSupervisorCriteriaWeights(supervisorCriteriaWeightForm);
    setShowWeightModal(false);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setEditForm({ 
      supervisor: student.supervisorScore || '', 
      jury: student.juryScore || '' 
    });
    setShowEditModal(true);
  };

  const handleOpenView = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const handleSaveEdit = () => {
    updateStudentEvaluation(selectedStudent.id, { 
      supervisorScore: editForm.supervisor === '' ? null : Number(editForm.supervisor),
      juryScore: editForm.jury === '' ? null : Number(editForm.jury),
      isSupervisorEvaluated: editForm.supervisor !== '',
      isJuryEvaluated: editForm.jury !== ''
    });
    setShowEditModal(false);
  };

  const calculateFinal = (s, j) => {
    if (s === '' || j === '') return '--';
    const final = (parseFloat(s) * (pfeWeights.supervisor / 100)) + (parseFloat(j) * (pfeWeights.jury / 100));
    return final.toFixed(2);
  };

  return (
    <div className="admin-grades-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Gestion des Notes PFE</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Validez, modifiez et publiez les résultats finaux des étudiants
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary"
              className="d-flex align-items-center gap-2 px-4 rounded-pill border-2 fw-bold extra-small shadow-none"
              onClick={() => {
                setWeightForm({ ...pfeWeights });
                setJuryCriteriaWeightForm({ ...juryCriteriaWeights });
                setSupervisorCriteriaWeightForm({ ...supervisorCriteriaWeights });
                setShowWeightModal(true);
              }}
            >
              <Filter size={18} /> Barèmes & Coefs
            </Button>
            <Button 
              className={`btn-premium d-flex align-items-center gap-2 shadow-sm border-0 ${isGradesPublished ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={publishGrades}
              disabled={isGradesPublished}
            >
              <Share2 size={18} /> {isGradesPublished ? 'Notes Publiées' : 'Publier les Notes Finales'}
            </Button>
          </div>
        </header>

        {/* Status Alert */}
        <AnimatePresence>
          {isGradesPublished && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card mb-4 p-4 rounded-4 border-start-4 border-success bg-white shadow-sm"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Publication Active</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">
                    Toutes les notes sont désormais visibles par les étudiants, les encadrants et les membres du jury.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <div className="d-flex align-items-center gap-3 flex-grow-1">
              <div className="position-relative" style={{ width: '300px' }}>
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50" size={18} />
                <Form.Control 
                  type="text" 
                  placeholder="Rechercher un étudiant..." 
                  className="rounded-pill ps-5 bg-surface-alt border-0 shadow-none extra-small fw-bold py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <AnimatePresence>
                {selectedGrades.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="d-flex gap-2 bg-success-soft p-1 rounded-pill border border-success border-opacity-10 px-2 shadow-sm"
                  >
                    <div className="extra-small fw-bold text-success px-2 border-end border-success border-opacity-25 d-flex align-items-center">
                      {selectedGrades.length} sélectionnés
                    </div>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-success extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-success hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('PDF')}
                    >
                      <FileDown size={14} /> PDF
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-success extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-success hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('Word')}
                    >
                      <FileText size={14} /> Word
                    </Button>
                    <Button 
                      variant="link" 
                      className="p-1 px-2 text-success extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 hover-bg-success hover-text-white rounded-pill transition-all"
                      onClick={() => handleExport('CSV')}
                    >
                      <Download size={14} /> CSV
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">Session Juin 2026</Badge>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3" style={{ width: '40px' }}>
                    <Form.Check 
                      type="checkbox"
                      className="custom-checkbox-premium mb-0"
                      checked={selectedGrades.length === filteredStudents.length && filteredStudents.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Note Encadrant ({pfeWeights.supervisor}%)</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Note Jury ({pfeWeights.jury}%)</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Remarques Jury</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note Générale</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Décision</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-bottom border-light border-opacity-10">
                    <td className="px-4 py-3">
                      <Form.Check 
                        type="checkbox"
                        className="custom-checkbox-premium mb-0"
                        checked={selectedGrades.includes(student.id)}
                        onChange={() => toggleSelect(student.id)}
                      />
                    </td>
                    <td className="py-3">
                      <div className="fw-bold text-navy small">{student.name}</div>
                      <div className="extra-small text-muted fw-bold opacity-50">{student.project}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-primary small">
                          {student.supervisorScore !== null ? `${student.supervisorScore}/20` : '--'}
                        </span>
                        <Badge className={`extra-small border-0 ${student.isSupervisorEvaluated ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                          {student.isSupervisorEvaluated ? 'Évalué' : 'À faire'}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-success small">
                          {student.juryScore !== null ? `${student.juryScore}/20` : '--'}
                        </span>
                        <Badge className={`extra-small border-0 ${student.isJuryEvaluated ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                          {student.isJuryEvaluated ? 'Évalué' : 'À faire'}
                        </Badge>
                      </div>
                    </td>
                    <td>
                      <div className="extra-small text-muted fw-bold opacity-75 text-truncate" style={{maxWidth: '150px'}} title={student.juryRemarks}>
                        {student.juryRemarks || '--'}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="h5 fw-bold text-navy mb-0">
                        {calculateFinal(student.supervisorScore ?? '', student.juryScore ?? '')}
                      </div>
                    </td>
                    <td className="text-center">
                      {student.supervisorScore !== null && student.juryScore !== null ? (
                        Number(calculateFinal(student.supervisorScore, student.juryScore)) >= 10 ? (
                          <Badge className="bg-success text-white border-0 px-3 py-1 rounded-pill extra-small fw-bold shadow-sm">ADMIS</Badge>
                        ) : (
                          <Badge className="bg-danger text-white border-0 px-3 py-1 rounded-pill extra-small fw-bold shadow-sm">AJOURNÉ</Badge>
                        )
                      ) : (
                        <Badge className="bg-surface-alt text-muted border-0 px-3 py-1 rounded-pill extra-small fw-bold">EN ATTENTE</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button 
                          variant="link" 
                          className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                          onClick={() => handleOpenView(student)}
                        >
                          <Eye size={18} />
                        </Button>
                        <Button 
                          variant="link" 
                          className="p-2 text-success hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                          onClick={() => handleOpenEdit(student)}
                        >
                          <Edit3 size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        <Row className="mt-4 g-4">
          <Col lg={6}>
            <Card className="glass-card border-0 shadow-sm border p-4 bg-primary text-white h-100">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <AlertCircle size={18} /> Règle de Publication
              </h6>
              <p className="small mb-0 opacity-75">
                Une fois les notes publiées, les étudiants pourront consulter leurs résultats détaillés. 
                <strong> Attention :</strong> Cette action est irréversible pour la session en cours.
              </p>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="glass-card border shadow-sm border p-4 h-100">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-navy">
                <Filter size={18} className="text-primary" /> Barème des Critères Actuels
              </h6>
              <Row>
                <Col xs={6} className="border-end">
                  <div className="extra-small fw-bold text-muted text-uppercase mb-3 opacity-50">Jury ({pfeWeights.jury}%)</div>
                  <div className="d-flex flex-column gap-2">
                    {Object.entries(juryCriteriaWeights).map(([key, val]) => (
                      <div key={key} className="d-flex justify-content-between extra-small">
                        <span className="text-navy fw-bold text-capitalize">{key}</span>
                        <span className="text-primary fw-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="extra-small fw-bold text-muted text-uppercase mb-3 opacity-50">Encadrant ({pfeWeights.supervisor}%)</div>
                  <div className="d-flex flex-column gap-2">
                    {Object.entries(supervisorCriteriaWeights).map(([key, val]) => (
                      <div key={key} className="d-flex justify-content-between extra-small">
                        <span className="text-navy fw-bold text-capitalize">{key}</span>
                        <span className="text-success fw-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Edit Grade Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Modifier les Notes : {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-4 mb-4">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Note Encadrant (/20)</Form.Label>
                  <Form.Control 
                    type="number" 
                    max={20} min={0} step="0.25"
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    value={editForm.supervisor}
                    onChange={(e) => setEditForm({...editForm, supervisor: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Note Jury (/20)</Form.Label>
                  <Form.Control 
                    type="number" 
                    max={20} min={0} step="0.25"
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    value={editForm.jury}
                    onChange={(e) => setEditForm({...editForm, jury: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="p-3 bg-primary-soft rounded-4 mb-4 border border-primary border-opacity-10 text-center">
              <div className="extra-small text-muted fw-bold text-uppercase mb-1">Moyenne Finale Calculée</div>
              <div className="h2 fw-bold text-primary mb-0">
                {calculateFinal(editForm.supervisor, editForm.jury)}
              </div>
            </div>

            <Button className="btn-premium w-100 py-3 rounded-pill fw-bold shadow-sm border-0" onClick={handleSaveEdit}>
              <Save size={18} className="me-2" /> Enregistrer les modifications
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Weight Management Modal */}
      <Modal show={showWeightModal} onHide={() => setShowWeightModal(false)} centered className="glass-modal" size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Configuration des Coefficients</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="p-3 bg-primary-soft rounded-4 mb-4 border border-primary border-opacity-10">
            <p className="extra-small text-primary fw-bold mb-0">
              Définissez l'importance relative de chaque évaluation dans le calcul de la note finale. Le total doit être de 100%.
            </p>
          </div>
          
          <Form>
            <Row className="g-4 mb-4">
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Coefficient Encadrant (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    max={100} min={0}
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    value={weightForm.supervisor}
                    onChange={(e) => setWeightForm({...weightForm, supervisor: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Coefficient Jury (%)</Form.Label>
                  <Form.Control 
                    type="number" 
                    max={100} min={0}
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                    value={weightForm.jury}
                    onChange={(e) => setWeightForm({...weightForm, jury: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <hr className="my-4 opacity-10" />
            
            <h6 className="fw-bold text-navy mb-3 extra-small text-uppercase tracking-wider">Barème des Critères Jury</h6>
            <Row className="g-3 mb-4">
              {[
                { id: 'innovation', label: 'Innovation' },
                { id: 'methodology', label: 'Méthodologie' },
                { id: 'quality', label: 'Qualité Technique' },
                { id: 'presentation', label: 'Présentation' },
                { id: 'docs', label: 'Documentation' },
              ].map(crit => (
                <Col sm={4} key={crit.id}>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted opacity-75">{crit.label}</Form.Label>
                    <Form.Control 
                      type="number" 
                      className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none"
                      value={juryCriteriaWeightForm[crit.id] || 0}
                      onChange={(e) => setJuryCriteriaWeightForm({...juryCriteriaWeightForm, [crit.id]: Number(e.target.value)})}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <hr className="my-4 opacity-10" />
            
            <h6 className="fw-bold text-navy mb-3 extra-small text-uppercase tracking-wider">Barème des Critères Encadrant</h6>
            <Row className="g-3 mb-4">
              {[
                { id: 'report', label: 'Qualité du Rapport' },
                { id: 'progress', label: 'Avancement' },
                { id: 'autonomy', label: 'Autonomie' },
                { id: 'professionalism', label: 'Professionnalisme' },
              ].map(crit => (
                <Col sm={6} key={crit.id}>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted opacity-75">{crit.label}</Form.Label>
                    <Form.Control 
                      type="number" 
                      className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none"
                      value={supervisorCriteriaWeightForm[crit.id] || 0}
                      onChange={(e) => setSupervisorCriteriaWeightForm({...supervisorCriteriaWeightForm, [crit.id]: Number(e.target.value)})}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <Button className="btn-premium w-100 py-3 rounded-pill fw-bold shadow-sm border-0" onClick={handleSaveWeights}>
              <Save size={18} className="me-2" /> Appliquer tous les barèmes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* View Details Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered className="glass-modal" size="lg">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Détails de l'Évaluation : {selectedStudent?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Row className="g-4 mb-4">
            <Col md={6}>
              <Card className="rounded-4 border-light-soft bg-surface-alt p-4 h-100 shadow-none">
                <h6 className="extra-small fw-bold text-primary text-uppercase mb-3">Évaluation Encadrant</h6>
                <div className="h3 fw-bold text-navy mb-2">{selectedStudent?.supervisorScore !== null ? `${selectedStudent?.supervisorScore}/20` : 'Non noté'}</div>
                <div className="p-3 bg-white rounded-3 border-start border-4 border-primary">
                  <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Remarques Encadrant</div>
                  <p className="extra-small text-navy mb-0 fw-bold">{selectedStudent?.supervisorRemarks || 'Aucune remarque.'}</p>
                </div>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="rounded-4 border-light-soft bg-surface-alt p-4 h-100 shadow-none">
                <h6 className="extra-small fw-bold text-success text-uppercase mb-3">Évaluation Jury</h6>
                <div className="h3 fw-bold text-navy mb-2">{selectedStudent?.juryScore !== null ? `${selectedStudent?.juryScore}/20` : 'Non noté'}</div>
                <div className="p-3 bg-white rounded-3 border-start border-4 border-success mb-3">
                  <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Consignes de présentation</div>
                  <p className="extra-small text-navy mb-0 fw-bold">{selectedStudent?.juryRespectInstructions || 'Aucune remarque.'}</p>
                </div>
                <div className="p-3 bg-white rounded-3 border-start border-4 border-success">
                  <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Observations générales</div>
                  <p className="extra-small text-navy mb-0 fw-bold">{selectedStudent?.juryObservations || 'Aucune observation.'}</p>
                </div>
              </Card>
            </Col>
          </Row>
          <Card className="rounded-4 border-primary border-opacity-25 bg-primary-soft p-4 shadow-none mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="extra-small fw-bold text-primary text-uppercase mb-1">Résultat Général Final</h6>
                <p className="extra-small text-muted mb-0 fw-bold opacity-75">Calcul : ({pfeWeights.jury}% Jury) + ({pfeWeights.supervisor}% Encadrant)</p>
              </div>
              <div className="text-end">
                <div className="h2 fw-bold text-navy mb-0">
                  {selectedStudent?.juryScore !== null && selectedStudent?.supervisorScore !== null 
                    ? calculateFinal(selectedStudent.supervisorScore, selectedStudent.juryScore)
                    : '--'}
                  <small className="h6 text-muted ms-1 opacity-50">/20</small>
                </div>
                {selectedStudent?.juryScore !== null && selectedStudent?.supervisorScore !== null && (
                  <Badge className={`mt-1 border-0 extra-small fw-bold ${Number(calculateFinal(selectedStudent.supervisorScore, selectedStudent.juryScore)) >= 10 ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                    {Number(calculateFinal(selectedStudent.supervisorScore, selectedStudent.juryScore)) >= 10 ? 'ADMIS' : 'AJOURNÉ'}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminGrades;
