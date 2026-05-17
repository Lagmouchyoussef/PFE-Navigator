import React, { useState } from 'react';
import {
  Container, Row, Col, Card, Badge,
  Button, Form, Modal, Spinner, ProgressBar
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck, Clock, CheckCircle, AlertCircle,
  Send, FileText, Edit3, Target, Award, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const CRITERIA = [
  { id: 'innovation',   label: 'Innovation' },
  { id: 'methodology',  label: 'Methodology' },
  { id: 'quality',      label: 'Technical Quality' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'docs',         label: 'Documentation' },
];

const gradeLabel = (score) => {
  if (score === null || score === '') return 'Pending';
  const n = Number.parseFloat(score);
  if (n < 10) return 'Poor';
  if (n < 12) return 'Passable';
  if (n < 14) return 'Fairly Good';
  if (n < 16) return 'Good';
  if (n < 18) return 'Very Good';
  return 'Excellent';
};

const gradeColor = (score) => {
  if (score === null || score === '') return 'secondary';
  const n = Number.parseFloat(score);
  if (n < 10) return 'danger';
  if (n < 12) return 'warning';
  if (n < 14) return 'info';
  if (n < 16) return 'primary';
  return 'success';
};

const JuryEvaluationPage = () => {
  const { evaluations, projects, submitJuryScore, isGradesPublished } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({
    innovation: 0, methodology: 0, quality: 0, presentation: 0, docs: 0,
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [msgVariant, setMsgVariant] = useState('success');

  const flash = (msg, variant = 'success') => {
    setSuccessMsg(msg);
    setMsgVariant(variant);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const projectMap = Object.fromEntries((projects || []).map(p => [p.id, p]));

  const openEval = (ev) => {
    setSelectedEval(ev);
    setScore(ev.jury_score?.toString() ?? '');
    setComment(ev.jury_comment ?? '');
    setCriteria({
      innovation: 0, methodology: 0, quality: 0, presentation: 0, docs: 0,
      ...(ev.jury_criteria || {}),
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEval) return;
    if (!score) { flash('Please enter a score.', 'danger'); return; }
    setSaving(true);
    try {
      await submitJuryScore(selectedEval.id, Number(score), comment, criteria);
      flash('Jury evaluation submitted successfully!');
      setShowModal(false);
    } catch (err) {
      flash(`Error: ${err?.message || 'Could not submit evaluation.'}`, 'danger');
    } finally {
      setSaving(false);
    }
  };

  const evaluated = (evaluations || []).filter(e => e && e.jury_score !== null);
  const pending   = (evaluations || []).filter(e => e && e.jury_score === null);

  const stats = [
    { label: 'Total Assigned', value: (evaluations || []).length, color: 'primary',  icon: <ClipboardCheck size={28} /> },
    { label: 'Evaluated',      value: evaluated.length,   color: 'success',  icon: <CheckCircle size={28} /> },
    { label: 'Pending',        value: pending.length,      color: 'warning',  icon: <Clock size={28} /> },
  ];

  return (
    <div className="jury-evaluation-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Evaluation Center</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Submit and manage your jury evaluations.</p>
          </motion.div>
        </header>

        {/* Flash Message */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className={`glass-card mb-4 p-3 rounded-4 border-start border-${msgVariant} border-4 d-flex align-items-center gap-3`}
            >
              {msgVariant === 'success'
                ? <CheckCircle size={18} className="text-success shrink-0" />
                : <AlertCircle size={18} className="text-danger shrink-0" />}
              <span className="small fw-bold">{successMsg}</span>
              <button type="button" className="ms-auto btn btn-sm p-0 border-0 bg-transparent" onClick={() => setSuccessMsg('')}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {stats.map(s => (
            <Col lg={4} sm={6} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mx-auto mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Evaluation List */}
        {evaluations.length === 0 && (
          <div className="text-center py-5 text-muted">
            <FileText size={48} className="mb-3 opacity-30" />
            <h5 className="fw-bold">No evaluations assigned yet</h5>
            <p className="small">Projects will appear here once the jury committee is configured.</p>
          </div>
        )}

        <Row className="g-4">
          {evaluations.map(ev => {
            const project = projectMap[ev.project] || projects.find(p => p.evaluation?.id === ev.id);
            const studentName  = project?.student?.name || 'Unknown Student';
            const projectTitle = project?.title || `Project #${ev.project}`;
            const isEvaluated  = ev.jury_score !== null;
            const supScore     = ev.supervisor_score;
            return (
              <Col lg={6} key={ev.id}>
                <Card className="glass-card border-0 shadow-sm p-4 h-100">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h6 className="fw-bold text-navy mb-1">{projectTitle}</h6>
                      <div className="small text-muted">{studentName}</div>
                    </div>
                    <Badge bg={isEvaluated ? 'success' : 'warning'}>
                      {isEvaluated ? 'Evaluated' : 'Pending'}
                    </Badge>
                  </div>

                  {isEvaluated && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-bold">Jury Score</span>
                        <span className="small text-success fw-bold">{ev.jury_score}/20</span>
                      </div>
                      <ProgressBar
                        now={(Number.parseFloat(ev.jury_score) / 20) * 100}
                        variant="success"
                        className="rounded-pill"
                        style={{ height: '6px' }}
                      />
                      {ev.jury_comment && (
                        <p className="extra-small text-muted mt-2 mb-0">{ev.jury_comment}</p>
                      )}
                    </div>
                  )}

                  {isGradesPublished && supScore !== null && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-bold">Supervisor Score</span>
                        <span className="small text-primary fw-bold">{supScore}/20</span>
                      </div>
                      <ProgressBar
                        now={(Number.parseFloat(supScore) / 20) * 100}
                        variant="primary"
                        className="rounded-pill"
                        style={{ height: '6px' }}
                      />
                    </div>
                  )}

                  <Button
                    variant={isEvaluated ? 'outline-success' : 'success'}
                    size="sm"
                    className="rounded-pill d-flex align-items-center gap-2 mt-auto"
                    onClick={() => openEval(ev)}
                  >
                    <Edit3 size={14} />
                    {isEvaluated ? 'Update Evaluation' : 'Submit Evaluation'}
                  </Button>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* Evaluation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6 d-flex align-items-center gap-2">
            <Award size={20} className="text-success" /> Jury Evaluation
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-4">
              <Col md={6}>
                <h6 className="fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                  <Target size={18} className="text-success" /> Criteria Scores (0–20 each)
                </h6>
                {CRITERIA.map(c => (
                  <div key={c.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <label className="small fw-bold">{c.label}</label>
                      <span className={`small fw-bold text-${gradeColor(criteria[c.id])}`}>
                        {criteria[c.id]} — {gradeLabel(criteria[c.id])}
                      </span>
                    </div>
                    <Form.Range
                      min={0} max={20} step={0.5}
                      value={criteria[c.id]}
                      onChange={e => setCriteria(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                    />
                  </div>
                ))}
              </Col>
              <Col md={6}>
                <h6 className="fw-bold text-navy mb-3">Overall Score &amp; Comments</h6>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Final Score (0–20)</Form.Label>
                  <Form.Control
                    type="number" min="0" max="20" step="0.5"
                    value={score}
                    onChange={e => setScore(e.target.value)}
                    required
                    placeholder="e.g. 16.5"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="small fw-bold">Jury Comment</Form.Label>
                  <Form.Control
                    as="textarea" rows={5}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="General remarks on the defense presentation..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="success" type="submit" disabled={saving} className="d-flex align-items-center gap-2">
              {saving ? <Spinner size="sm" /> : <Send size={16} />}
              {saving ? 'Submitting…' : 'Submit Evaluation'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default JuryEvaluationPage;
