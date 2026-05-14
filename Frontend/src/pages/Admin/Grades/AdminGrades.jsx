import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Star, Send, CheckCircle, 
  AlertCircle, Edit3, Save, Search, 
  Filter, Share2, Eye
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const STUDENTS_MOCK = [
  { id: 1, name: "Ahmed Khalil", pfeTitle: "AI in healthcare", supervisor: "Dr. Sofia Drissi", jury: "Prof. Youssef Lagmouch" },
  { id: 2, name: "Sara Bennani", pfeTitle: "Blockchain Logistics", supervisor: "Dr. Sofia Drissi", jury: "Prof. Youssef Lagmouch" },
  { id: 3, name: "Mehdi Alami", pfeTitle: "Smart Grids Optimization", supervisor: "Dr. Sofia Drissi", jury: "Prof. Youssef Lagmouch" }
];

const AdminGrades = () => {
  const { scores, saveScore, isGradesPublished, publishGrades, pfeWeights, updatePfeWeights } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editForm, setEditForm] = useState({ supervisor: '', jury: '' });
  const [weightForm, setWeightForm] = useState({ supervisor: 50, jury: 50 });

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
    setShowWeightModal(false);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    // In a real app, scores would be keyed by student ID. 
    // Here we use the global scores for demo.
    setEditForm({ 
      supervisor: scores.pfeSupervisor || '', 
      jury: scores.pfeJury || '' 
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    saveScore('pfeSupervisor', editForm.supervisor);
    saveScore('pfeJury', editForm.jury);
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
              onClick={handleOpenWeights}
            >
              <Filter size={18} /> Coefficients ({pfeWeights.supervisor}% / {pfeWeights.jury}%)
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
            <div className="d-flex align-items-center gap-3 flex-grow-1 max-w-400">
              <div className="position-relative w-100">
                <Search className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted opacity-50" size={18} />
                <Form.Control 
                  type="text" 
                  placeholder="Rechercher un étudiant..." 
                  className="rounded-pill ps-5 bg-surface-alt border-0 shadow-none extra-small fw-bold py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">Session Juin 2026</Badge>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Note Encadrant ({pfeWeights.supervisor}%)</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Note Jury ({pfeWeights.jury}%)</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note Finale</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS_MOCK.map((student) => (
                  <tr key={student.id} className="border-bottom border-light border-opacity-10">
                    <td className="px-4 py-3">
                      <div className="fw-bold text-navy small">{student.name}</div>
                      <div className="extra-small text-muted fw-bold opacity-50">{student.pfeTitle}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-primary small">
                          {scores.pfeSupervisor !== null ? `${scores.pfeSupervisor}/20` : '--'}
                        </span>
                        <div className="extra-small text-muted fw-bold opacity-50">({student.supervisor})</div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fw-bold text-success small">
                          {scores.pfeJury !== null ? `${scores.pfeJury}/20` : '--'}
                        </span>
                        <div className="extra-small text-muted fw-bold opacity-50">({student.jury})</div>
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="h5 fw-bold text-navy mb-0">
                        {calculateFinal(scores.pfeSupervisor || '', scores.pfeJury || '')}
                      </div>
                    </td>
                    <td className="text-center">
                      <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${isGradesPublished ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                        {isGradesPublished ? 'Publié' : 'Brouillon'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button 
                          variant="link" 
                          className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
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

        {/* Summary Info */}
        <Row className="mt-4 g-4">
          <Col md={6}>
            <Card className="glass-card border-0 shadow-sm border p-4 bg-primary text-white">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <AlertCircle size={18} /> Règle de Publication
              </h6>
              <p className="small mb-0 opacity-75">
                Une fois les notes publiées, les étudiants pourront consulter leurs résultats détaillés. 
                <strong> Attention :</strong> Cette action est irréversible pour la session en cours.
              </p>
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
      <Modal show={showWeightModal} onHide={() => setShowWeightModal(false)} centered className="glass-modal">
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

            <div className="p-3 bg-white rounded-4 mb-4 border border-light-soft text-center d-flex justify-content-between align-items-center">
              <span className="extra-small text-muted fw-bold text-uppercase">Total des coefficients</span>
              <Badge className={`px-3 py-2 rounded-pill border-0 ${parseInt(weightForm.supervisor) + parseInt(weightForm.jury) === 100 ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                {parseInt(weightForm.supervisor || 0) + parseInt(weightForm.jury || 0)} %
              </Badge>
            </div>

            <Button className="btn-premium w-100 py-3 rounded-pill fw-bold shadow-sm border-0" onClick={handleSaveWeights}>
              <Save size={18} className="me-2" /> Appliquer les nouveaux coefficients
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminGrades;
