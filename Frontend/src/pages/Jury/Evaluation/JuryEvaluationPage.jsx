import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, Dropdown, ProgressBar 
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ClipboardCheck, Clock, CheckCircle, AlertCircle, 
  Send, Save, FileText, User, ChevronRight, Edit3, Target, Activity, MoreVertical, X, Award
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

const CHART_DATA = [
  { name: 'Jan', completed: 5, pending: 15 },
  { name: 'Feb', completed: 8, pending: 12 },
  { name: 'Mar', completed: 15, pending: 10 },
  { name: 'Apr', completed: 22, pending: 8 },
  { name: 'May', completed: 28, pending: 12 },
];

// Projects list will be fetched from context

const CRITERIA = [
  { id: 'innovation', label: 'Innovation' },
  { id: 'methodology', label: 'Méthodologie' },
  { id: 'quality', label: 'Qualité Technique' },
  { id: 'presentation', label: 'Présentation' },
  { id: 'docs', label: 'Documentation' },
];

const JuryEvaluationPage = () => {
  const { theme, saveScore, isGradesPublished, juryCriteriaWeights, students, updateStudentEvaluation } = useApp();
  const evaluationRef = useRef(null);
  const [activeStudent, setActiveStudent] = useState(null);
  const [scores, setScores] = useState({
    innovation: 0, methodology: 0, quality: 0, presentation: 0, docs: 0
  });
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [juryNote, setJuryNote] = useState('');
  const [respectInstructions, setRespectInstructions] = useState('');
  const [observations, setObservations] = useState('');

  const handleScoreChange = (id, val) => {
    const num = Math.min(20, Math.max(0, parseFloat(val) || 0));
    setScores(prev => ({ ...prev, [id]: num }));
  };

  const handleOpenEvaluation = (student) => {
    setActiveStudent(student);
    setJuryNote(student.juryScore !== null ? student.juryScore.toString() : '');
    setRespectInstructions(student.juryRespectInstructions || '');
    setObservations(student.juryObservations || '');
    // Reset criteria scores to 0 for a "new" evaluation experience
    setScores({
      innovation: 0, methodology: 0, quality: 0, presentation: 0, docs: 0
    });
    evaluationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const calculateTotalJuryScore = () => {
    let weightedSum = 0;
    let weightTotal = 0;
    
    Object.keys(scores).forEach(key => {
      const weight = juryCriteriaWeights[key] || 0;
      weightedSum += (scores[key] * weight);
      weightTotal += weight;
    });

    if (weightTotal === 0) return 0;
    return (weightedSum / weightTotal).toFixed(2);
  };

  const calculatedFinalScore = calculateTotalJuryScore();

  const handleDraft = () => {
    if (!activeStudent) return;
    updateStudentEvaluation(activeStudent.id, { 
      juryScore: Number(calculatedFinalScore),
      juryRemarks: 'Brouillon - Notes en cours de saisie',
      juryRespectInstructions: respectInstructions,
      juryObservations: observations
    });
    setSuccessMsg(`Succès : Les notes pour ${activeStudent.name} ont été enregistrées en brouillon.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleSubmit = () => {
    if (!activeStudent) return;
    updateStudentEvaluation(activeStudent.id, { 
      juryScore: Number(calculatedFinalScore),
      isJuryEvaluated: true,
      juryRemarks: 'Évaluation finale confirmée et enregistrée.',
      juryRespectInstructions: respectInstructions,
      juryObservations: observations
    });
    setSuccessMsg(`Félicitations : L'évaluation finale pour ${activeStudent.name} a été enregistrée avec succès. Les notes sont soumises.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const totalScorePercentage = (Number(calculatedFinalScore) / 20) * 100;

  return (
    <div className="jury-evaluation-layout py-4">
      <Container fluid className="px-4">
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Evaluation Submitted</h6>
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
            <h2 className="fw-bold mb-1 text-navy text-gradient">Evaluation Center</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Manage project evaluations and academic tracking.</p>
          </motion.div>
        </header>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Pending', value: '12', icon: <Clock />, color: 'warning' },
            { label: 'Completed', value: '28', icon: <CheckCircle />, color: 'success' },
            { label: 'In Progress', value: '5', icon: <Activity />, color: 'primary' },
            { label: 'Urgent', value: '3', icon: <AlertCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border border-light border-opacity-10 border-start-4 border-${stat.color}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold mb-0 text-navy">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase opacity-50">{stat.label}</span>
                  </div>
                  <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Projects Table */}
        <Card className="glass-card rounded-4 overflow-hidden shadow-sm mb-5 border-light border-opacity-10">
          <Card.Header className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center border-0">
            <h5 className="fw-bold text-navy mb-0">Project List</h5>
          </Card.Header>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-surface-alt">
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project Title</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Score</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((p, i) => (
                  <tr key={i} className={`border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer ${activeStudent?.id === p.id ? 'bg-primary-soft border-primary border-opacity-25' : ''}`}>
                    <td className="px-4 py-3 fw-bold small text-navy">{p.name}</td>
                    <td className="py-3 small text-muted text-truncate fw-bold opacity-75" style={{maxWidth: '300px'}}>{p.project}</td>
                    <td className="py-3 small">
                      <Badge className={`bg-${p.isJuryEvaluated ? 'success' : 'warning'}-soft text-${p.isJuryEvaluated ? 'success' : 'warning'} border-0 px-2 py-1 extra-small fw-bold`}>
                        {p.isJuryEvaluated ? 'Évalué' : 'À Évaluer'}
                      </Badge>
                    </td>
                    <td className="py-3 small">
                      <div className="d-flex flex-column gap-1">
                        <div className="d-flex align-items-center gap-2">
                          <span className="extra-small text-muted fw-bold opacity-50">Jury:</span>
                          <span className="fw-bold text-navy">{p.juryScore !== null ? `${p.juryScore}/20` : '--'}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="extra-small text-muted fw-bold opacity-50">Encadrant:</span>
                          <span className={`fw-bold ${isGradesPublished ? 'text-primary' : 'text-muted opacity-25'}`}>
                            {isGradesPublished ? (p.supervisorScore !== null ? `${p.supervisorScore}/20` : '--') : '??'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Button 
                        variant="link" 
                        className="p-0 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center justify-content-end gap-1 hover-gap-2 transition-all shadow-none border-0"
                        onClick={() => handleOpenEvaluation(p)}
                      >
                        {p.isJuryEvaluated ? 'Réviser' : 'Évaluer'} <ChevronRight size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Evaluation Panel */}
        <section ref={evaluationRef} className="animate-fade-in">
          <div className="glass-card p-5 rounded-4 shadow-sm border border-light border-opacity-10">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-5 gap-4">
              <div>
                <Badge className="mb-2 px-3 py-1 rounded-pill bg-primary-soft text-primary extra-small fw-bold border-0">Evaluation Session</Badge>
                <h3 className="fw-bold mb-1 text-navy">{activeStudent?.name}</h3>
                <p className="text-muted small mb-0 fw-bold opacity-75">{activeStudent?.title}</p>
              </div>
              <div className="p-4 rounded-4 bg-surface-alt border border-light border-opacity-10 text-center shadow-sm" style={{ minWidth: '160px' }}>
                <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Note Finale Soutenance</div>
                <div className="h2 fw-bold mb-0 text-primary">{calculatedFinalScore}<small className="h6 text-muted ms-1 fw-bold opacity-50">/20</small></div>
              </div>
            </div>

            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom border-light border-opacity-10 pb-2 text-navy">
              <Target size={18} className="text-primary" /> Scoring Rubric
            </h6>

            <div className="table-responsive mb-5">
              <Table borderless className="align-middle">
                <thead className="bg-surface-alt">
                  <tr className="border-bottom opacity-50">
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Critère</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Coefficient (Barème)</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note (0-20)</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-end">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map(item => (
                    <tr key={item.id} className="border-bottom border-light border-opacity-10">
                      <td className="py-4">
                        <div className="fw-bold small text-navy">{item.label}</div>
                        <div className="extra-small text-muted fw-bold opacity-50">Évaluation de la pertinence et de la rigueur du critère.</div>
                      </td>
                      <td className="py-4 text-center">
                        <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 extra-small fw-bold rounded-pill">
                          Coef: {juryCriteriaWeights[item.id] || 0}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <Form.Control 
                          type="number" 
                          max={20} min={0}
                          className="bg-surface-alt border-0 rounded-4 text-center fw-bold mx-auto text-navy shadow-none" 
                          style={{ width: '80px', height: '45px' }}
                          value={scores[item.id]}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="py-4 text-end">
                        <Badge className={`bg-${scores[item.id] >= 14 ? 'success' : 'primary'}-soft text-${scores[item.id] >= 14 ? 'success' : 'primary'} border-0 px-3 py-1 extra-small fw-bold`}>
                          {scores[item.id] >= 18 ? 'Excellent' : scores[item.id] >= 14 ? 'Bon' : 'En attente'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="bg-surface-alt rounded-4 p-4 mb-5 border border-light border-opacity-10 shadow-sm">
              <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                <Award size={20} className="text-success" /> Évaluation Soutenance PFE (50%)
              </h6>
              <Row className="g-4">
                <Col md={6}>
                  <Form.Group className="mb-4">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Respect des consignes de présentation</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      className="rounded-4 border-light-soft bg-white py-3 extra-small fw-bold shadow-none" 
                      placeholder="L'étudiant a-t-il respecté les consignes du PFE devant le jury ?"
                      value={respectInstructions}
                      onChange={(e) => setRespectInstructions(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Observations générales du Jury</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      className="rounded-4 border-light-soft bg-white py-3 extra-small fw-bold shadow-none" 
                      placeholder="Forces, points à améliorer..."
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <div className="h-100 p-4 rounded-4 bg-white border border-light-soft d-flex flex-column align-items-center justify-content-center text-center shadow-sm">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Note Finale Calculée</Form.Label>
                    <div className="h1 fw-bold text-center border-0 bg-transparent text-success shadow-none mb-0" style={{ fontSize: '3rem' }}>
                      {calculatedFinalScore}
                    </div>
                    <div className="h5 text-muted opacity-25 fw-bold mt-n2">/ 20</div>
                    <div className="extra-small text-muted fw-bold mt-2 opacity-50">Générée par le programme</div>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="h-100 p-4 rounded-4 bg-surface-alt border border-light-soft d-flex flex-column align-items-center justify-content-center text-center opacity-75">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Note Encadrant</Form.Label>
                    <div className="h1 fw-bold text-navy mb-0">
                      {isGradesPublished 
                        ? (activeStudent?.supervisorScore !== null ? activeStudent?.supervisorScore : '--')
                        : '??'}
                    </div>
                    <div className="h5 text-muted opacity-25 fw-bold mt-n2">/ 20</div>
                    <Badge className={`mt-2 border-0 extra-small fw-bold ${isGradesPublished ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>
                      {isGradesPublished ? 'Public' : 'Confidentiel'}
                    </Badge>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-4 border-top border-light border-opacity-10">
              <Button 
                variant="outline-secondary" 
                className="px-4 py-2 fw-bold extra-small rounded-pill border-2 opacity-50 hover-opacity-100 transition-all shadow-none"
                onClick={handleDraft}
              >
                Brouillon
              </Button>
              <Button 
                className="btn-premium px-5 py-3 d-flex align-items-center gap-2 fw-bold rounded-pill shadow-sm border-0" 
                onClick={handleSubmit}
              >
                <Send size={18} /> Soumettre l'Évaluation Finale
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
};

export default JuryEvaluationPage;
