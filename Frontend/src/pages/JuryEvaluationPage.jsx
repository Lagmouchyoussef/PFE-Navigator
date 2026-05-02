import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, Dropdown, ProgressBar 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  ClipboardCheck, Clock, CheckCircle, AlertCircle, 
  Send, Save, FileText, User, ChevronRight, Edit3, Target, Activity, MoreVertical
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import './JuryEvaluationPage.css';

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
  { id: 'methodology', label: 'Methodology' },
  { id: 'quality', label: 'Technical Quality' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'docs', label: 'Documentation' },
];

const JuryEvaluationPage = () => {
  const { session } = useApp();
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
    <div className="ev-page-layout">
      <Container fluid className="px-0">
        
        {/* Success Notification Card */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="ev-success-card mb-4 d-flex align-items-center justify-content-between shadow-lg"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="icon-box bg-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <CheckCircle size={24} color="#ffffff" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: 'var(--jd-text)' }}>Évaluation Enregistrée</h6>
                  <p className="extra-small mb-0 opacity-75" style={{ color: 'var(--jd-text-muted)' }}>{successMsg}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                    <MoreVertical size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0 rounded-3">
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Supprimer</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Archiver</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Mettre en favori</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button size="sm" variant="link" className="text-muted p-0" onClick={() => setShowSuccessCard(false)}>Fermer</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="ev-header-section mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-1 text-navy">Centre d'Évaluation</h1>
            <p className="fw-medium text-muted">Gérez toutes vos évaluations de projets et suivis académiques</p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="En attente" value="12" icon={<Clock size={24} className="text-warning" />} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Complétées" value="28" icon={<CheckCircle size={24} className="text-success" />} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="En cours" value="5" icon={<Activity size={24} className="text-primary" />} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Urgentes" value="3" icon={<AlertCircle size={24} className="text-danger" />} />
          </Col>
        </Row>

        {/* Chart Section */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card className="ev-chart-card shadow-sm border-0">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Clock size={18} className="text-warning" />
                    <span className="fw-bold extra-small text-navy">Heures de Session</span>
                  </div>
                  <p className="extra-small text-muted mb-0">Comparaison mensuelle des projets complétés vs en attente</p>
                </div>
                <Badge bg="light" text="dark" className="border px-3 py-2 rounded-pill">Année 2025/2026</Badge>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Complétées" />
                    <Line type="monotone" dataKey="pending" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} name="En attente" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Projects List Table */}
        <div className="ev-table-card shadow-sm border-0 mb-5">
          <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-navy mb-0">Projets à Évaluer</h5>
            <Button variant="light" className="extra-small fw-bold border shadow-none">Voir tout <ChevronRight size={14} className="text-primary" /></Button>
          </div>
          <Table className="ev-table mb-0">
            <thead>
              <tr>
                <th style={{ width: '25%' }} className="ps-4">Student Name</th>
                <th style={{ width: '35%' }}>Project Title</th>
                <th style={{ width: '20%' }}>Supervisor</th>
                <th style={{ width: '20%' }} className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS_LIST.map((p, i) => (
                <tr key={i} className={`align-middle ${activeStudent?.id === p.id ? 'bg-primary bg-opacity-5' : ''}`}>
                  <td className="fw-bold text-navy px-4 text-truncate">{p.name}</td>
                  <td className="small text-muted text-truncate">{p.title}</td>
                  <td className="small fw-medium text-truncate">{p.sup}</td>
                  <td className="text-end px-4">
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                        <MoreVertical size={18} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                        <Dropdown.Item onClick={() => handleOpenEvaluation(p)}>Ouvrir l'évaluation</Dropdown.Item>
                        <Dropdown.Item>Détails du projet</Dropdown.Item>
                        <Dropdown.Item>Télécharger le rapport</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Active Evaluation Panel */}
        <section ref={evaluationRef} className="animate-slide-up">
          <div className="ev-active-panel">
            <Row className="align-items-start mb-5">
              <Col md={8}>
                <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill bg-opacity-10 text-primary">Évaluation en Cours</Badge>
                <h2 className="fw-black mb-1" style={{ color: 'var(--jd-text)' }}>{activeStudent?.name}</h2>
                <p className="fw-medium fs-5 opacity-75" style={{ color: 'var(--jd-text-muted)' }}>{activeStudent?.title}</p>
              </Col>
              <Col md={4} className="text-end">
                <div className="ev-total-box d-inline-block text-center shadow-sm">
                  <div className="extra-small text-muted fw-bold mb-1">TOTAL SCORE</div>
                  <div className="h2 fw-black text-primary mb-0">{totalScore}<small className="h6 text-muted">/100</small></div>
                </div>
              </Col>
            </Row>

            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--jd-text)' }}>
              <Target size={20} className="text-primary" /> Scoring Rubric
            </h6>
            
            <Table responsive borderless className="ev-scoring-table mb-5">
              <thead>
                <tr>
                  <th style={{ width: '40%', color: 'var(--jd-text)' }}>CRITERIA</th>
                  <th className="text-center" style={{ color: 'var(--jd-text)' }}>SCORE (0-20)</th>
                  <th style={{ color: 'var(--jd-text)' }}>RATING</th>
                </tr>
              </thead>
              <tbody>
                {CRITERIA.map(item => (
                  <tr key={item.id} className="align-middle border-bottom-dashed">
                    <td className="py-3">
                      <div className="fw-bold small" style={{ color: 'var(--jd-text)' }}>{item.label}</div>
                      <div className="extra-small opacity-75" style={{ color: 'var(--jd-text-muted)' }}>Detailed assessment of the {item.label.toLowerCase()}</div>
                    </td>
                    <td className="text-center">
                      <Form.Control 
                        type="number" 
                        className="ev-score-input mx-auto" 
                        value={scores[item.id]}
                        onChange={(e) => handleScoreChange(item.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <Badge bg="transparent" className="border px-3 py-2 extra-small fw-bold" style={{ color: 'var(--jd-text)' }}>
                        {scores[item.id] >= 18 ? 'Excellent' : scores[item.id] >= 14 ? 'Good' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Form.Group className="mb-5">
              <Form.Label className="fw-bold small d-flex align-items-center gap-2" style={{ color: 'var(--jd-text)' }}>
                <FileText size={18} className="text-primary" /> Evaluation Comments
              </Form.Label>
              <Form.Control 
                as="textarea" 
                rows={5} 
                className="rounded-4 border-0 p-4 small shadow-none"
                placeholder="Provide detailed feedback on the project strengths, weaknesses, and recommendations..."
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-3 border-top pt-5">
              <Button variant="light" className="px-4 py-2 fw-bold rounded-3">Enregistrer Brouillon</Button>
              <Button className="ev-submit-btn px-5 py-3 d-flex align-items-center gap-2" onClick={handleSubmit}>
                <Send size={18} className="text-info" /> Soumettre l'Évaluation
              </Button>
            </div>
          </div>
        </section>

      </Container>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <Card className="ev-stat-card shadow-sm border-0">
    <div className="d-flex justify-content-between align-items-start">
      <div>
        <div className="ev-stat-val">{value}</div>
        <div className="ev-stat-label">{label}</div>
      </div>
      <div className="p-3 rounded-4 bg-light">
        {icon}
      </div>
    </div>
  </Card>
);

export default JuryEvaluationPage;
