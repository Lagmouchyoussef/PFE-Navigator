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
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Supervisor</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS_LIST.map((p, i) => (
                  <tr key={i} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                    <td className="px-4 py-3 fw-bold small text-navy">{p.name}</td>
                    <td className="py-3 small text-muted text-truncate fw-bold opacity-75" style={{maxWidth: '300px'}}>{p.title}</td>
                    <td className="py-3 small text-navy fw-bold opacity-75">{p.sup}</td>
                    <td className="px-4 py-3 text-end">
                      <Button 
                        variant="link" 
                        className="p-0 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center justify-content-end gap-1 hover-gap-2 transition-all shadow-none border-0"
                        onClick={() => handleOpenEvaluation(p)}
                      >
                        Evaluate <ChevronRight size={14} />
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
                <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Total Score</div>
                <div className="h2 fw-bold mb-0 text-primary">{totalScore}<small className="h6 text-muted ms-1 fw-bold opacity-50">/100</small></div>
              </div>
            </div>

            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 border-bottom border-light border-opacity-10 pb-2 text-navy">
              <Target size={18} className="text-primary" /> Scoring Rubric
            </h6>

            <div className="table-responsive mb-5">
              <Table borderless className="align-middle">
                <thead className="bg-surface-alt">
                  <tr className="border-bottom opacity-50">
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Criterion</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Score (0-20)</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CRITERIA.map(item => (
                    <tr key={item.id} className="border-bottom border-light border-opacity-10">
                      <td className="py-4">
                        <div className="fw-bold small text-navy">{item.label}</div>
                        <div className="extra-small text-muted fw-bold opacity-50">Evaluation of relevance and rigor of the criterion.</div>
                      </td>
                      <td className="py-4">
                        <Form.Control 
                          type="number" 
                          className="bg-surface-alt border-0 rounded-4 text-center fw-bold mx-auto text-navy shadow-none" 
                          style={{ width: '80px', height: '45px' }}
                          value={scores[item.id]}
                          onChange={(e) => handleScoreChange(item.id, e.target.value)}
                        />
                      </td>
                      <td className="py-4 text-end">
                        <Badge className={`bg-${scores[item.id] >= 14 ? 'success' : 'primary'}-soft text-${scores[item.id] >= 14 ? 'success' : 'primary'} border-0 px-3 py-1 extra-small fw-bold`}>
                          {scores[item.id] >= 18 ? 'Excellent' : scores[item.id] >= 14 ? 'Good' : 'Pending'}
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
                <Col md={8}>
                  <Form.Group className="mb-4">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Respect des consignes de présentation</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      className="rounded-4 border-light-soft bg-white py-3 extra-small fw-bold shadow-none" 
                      placeholder="L'étudiant a-t-il respecté les consignes du PFE devant le jury ?"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Observations générales du Jury</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2} 
                      className="rounded-4 border-light-soft bg-white py-3 extra-small fw-bold shadow-none" 
                      placeholder="Forces, points à améliorer..."
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <div className="h-100 p-4 rounded-4 bg-white border border-light-soft d-flex flex-column align-items-center justify-content-center text-center">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Note du Jury</Form.Label>
                    <Form.Control 
                      type="number" 
                      max={20} min={0} 
                      className="h1 fw-bold text-center border-0 bg-transparent text-success shadow-none mb-0" 
                      style={{ fontSize: '3rem' }}
                      placeholder="00"
                    />
                    <div className="h5 text-muted opacity-25 fw-bold mt-n2">/ 20</div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="d-flex justify-content-end gap-3 pt-4 border-top border-light border-opacity-10">
              <Button variant="outline-secondary" className="px-4 py-2 fw-bold extra-small rounded-pill border-2 opacity-50 hover-opacity-100 transition-all">Brouillon</Button>
              <Button className="btn-premium px-5 py-3 d-flex align-items-center gap-2 fw-bold rounded-pill shadow-sm border-0" onClick={handleSubmit}>
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
