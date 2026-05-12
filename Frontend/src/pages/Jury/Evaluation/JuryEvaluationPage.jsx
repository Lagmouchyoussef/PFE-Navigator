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
  Send, Save, FileText, User, ChevronRight, Edit3, Target, Activity, MoreVertical, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

const CHART_DATA = [
  { name: 'Jan', completed: 5, pending: 15 },
  { name: 'Feb', completed: 8, pending: 12 },
  { name: 'Mar', completed: 15, pending: 10 },
  { name: 'Apr', completed: 22, pending: 8 },
  { name: 'May', completed: 28, pending: 12 },
];

const PROJECTS_LIST = [
  { id: 'STU-01', name: 'Ahmed Benali', title: 'AI-Powered Student Management System', sup: 'Prof. Martin', date: '2026-04-15', status: 'Ready for Review' },
  { id: 'STU-02', name: 'Sara Kamali', title: 'Blockchain-based Certificate Verification', sup: 'Dr. Chen', date: '2026-04-18', status: 'Pending' },
  { id: 'STU-03', name: 'Mohamed Alaoui', title: 'IoT Smart Campus Solution', sup: 'Prof. Smith', date: '2026-04-10', status: 'Evaluated' },
  { id: 'STU-04', name: 'Fatima Zahra', title: 'Mobile App for Course Registration', sup: 'Dr. Johnson', date: '2026-04-20', status: 'Ready for Review' },
  { id: 'STU-05', name: 'Youssef Idrissi', title: 'Machine Learning Prediction Models', sup: 'Prof. Garcia', date: '2026-04-12', status: 'Evaluated' },
];

const CRITERIA = [
  { id: 'innovation', label: 'Innovation' },
  { id: 'methodology', label: 'Méthodologie' },
  { id: 'quality', label: 'Qualité Technique' },
  { id: 'presentation', label: 'Présentation' },
  { id: 'docs', label: 'Documentation' },
];

const JuryEvaluationPage = () => {
  const { theme } = useApp();
  const evaluationRef = useRef(null);
  const [activeStudent, setActiveStudent] = useState(PROJECTS_LIST[0]);
  const [scores, setScores] = useState({
    innovation: 0, methodology: 0, quality: 0, presentation: 0, docs: 0
  });
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleScoreChange = (id, val) => {
    const num = Math.min(20, Math.max(0, parseFloat(val) || 0));
    setScores(prev => ({ ...prev, [id]: num }));
  };

  const handleOpenEvaluation = (student) => {
    setActiveStudent(student);
    evaluationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmit = () => {
    setSuccessMsg(`L'évaluation pour ${activeStudent.name} a été soumise avec succès.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  return (
    <div className="evaluation-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="eval-alert-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Évaluation Soumise</h6>
                  <p className="extra-small text-muted mb-0">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setShowSuccessCard(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Centre d'Évaluation</h2>
            <p className="text-muted small mb-0">Gérez toutes vos évaluations de projets et suivis académiques.</p>
          </div>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'En attente', value: '12', icon: <Clock />, color: 'warning' },
            { label: 'Complétées', value: '28', icon: <CheckCircle />, color: 'success' },
            { label: 'En cours', value: '5', icon: <Activity />, color: 'primary' },
            { label: 'Urgentes', value: '3', icon: <AlertCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`eval-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{stat.label}</span>
                  </div>
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Projects Table */}
        <div className="eval-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Liste des Projets</h5>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 eval-table">
              <thead>
                <tr className="border-bottom opacity-50 bg-surface-alt">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Titre du Projet</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Encadrant</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS_LIST.map((p, i) => (
                  <tr key={i} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3 fw-bold small">{p.name}</td>
                    <td className="py-3 small text-muted text-truncate" style={{maxWidth: '300px'}}>{p.title}</td>
                    <td className="py-3 small opacity-75">{p.sup}</td>
                    <td className="px-4 py-3 text-end">
                      <Button 
                        variant="link" 
                        className="p-0 text-primary extra-small fw-bold text-decoration-none"
                        onClick={() => handleOpenEvaluation(p)}
                      >
                        Évaluer <ChevronRight size={14} className="ms-1" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Evaluation Panel */}
        <section ref={evaluationRef} className="animate-fade-in">
          <div className="eval-glass-card p-5 rounded-4 shadow-sm">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-5 gap-4">
              <div>
                <Badge bg="primary" className="mb-2 px-3 py-1 rounded-pill bg-opacity-10 text-primary extra-small fw-bold">Session d'Évaluation</Badge>
                <h3 className="fw-bold mb-1">{activeStudent?.name}</h3>
                <p className="text-muted small mb-0">{activeStudent?.title}</p>
              </div>
              <div className="p-4 rounded-4 bg-surface-alt border text-center shadow-sm" style={{ minWidth: '160px' }}>
                <div className="extra-small text-muted fw-bold text-uppercase mb-1">Score Total</div>
                <div className="h2 fw-bold mb-0 text-primary">{totalScore}<small className="h6 text-muted ms-1">/100</small></div>
              </div>
            </div>

            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom pb-2">
              <Target size={18} className="text-primary" /> Rubrique de Notation
            </h6>

            <div className="table-responsive mb-5">
              <Table borderless className="align-middle eval-scoring-table">
                <thead>
                  <tr className="border-bottom opacity-50">
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Critère</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Note (0-20)</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-end">Observation</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map(item => (
                    <tr key={item.id} className="border-bottom border-light border-opacity-10">
                      <td className="py-4">
                        <div className="fw-bold small">{item.label}</div>
                        <div className="extra-small text-muted">Évaluation de la pertinence et de la rigueur du critère.</div>
                      </td>
                      <td className="py-4">
                        <Form.Control 
                          type="number" 
                          className="bg-surface-alt border-0 rounded-3 text-center fw-bold mx-auto text-primary-custom" 
                          style={{ width: '80px', height: '45px' }}
                          value={scores[item.id]}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="py-4 text-end">
                        <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                          {scores[item.id] >= 18 ? 'Excellent' : scores[item.id] >= 14 ? 'Bien' : 'En attente'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold small d-flex align-items-center gap-2 text-muted mb-3">
                <FileText size={18} className="text-primary" /> Commentaires de l'Évaluateur
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                className="bg-surface-alt border-0 rounded-4 p-4 small text-primary-custom shadow-none"
                placeholder="Détaillez ici les points forts, les axes d'amélioration et vos recommandations pour l'étudiant..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 pt-4 border-top">
              <Button variant="outline-secondary" className="px-4 py-2 fw-bold extra-small rounded-pill border-2">Brouillon</Button>
              <Button className="px-5 py-3 d-flex align-items-center gap-2 fw-bold rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }} onClick={handleSubmit}>
                <Send size={18} /> Soumettre l'Évaluation
              </Button>
            </div>
          </div>
        </section>
      </Container>

      <style>{`
        .evaluation-modern-layout {
          color: var(--text-primary);
        }
        .eval-glass-card, .eval-alert-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .eval-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        
        h2, h3, h4, h5, h6, .fw-bold {
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

export default JuryEvaluationPage;
