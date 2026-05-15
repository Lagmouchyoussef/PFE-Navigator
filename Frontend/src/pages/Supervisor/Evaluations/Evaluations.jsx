import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  Container, Row, Col, Card, Badge, Button,
  Form, Modal, Spinner, ProgressBar
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  CheckCircle, Clock, Award, Star, X, Edit3
} from 'lucide-react';

const CRITERIA = [
  { key: 'report',          label: 'Report Quality',   max: 5 },
  { key: 'progress',        label: 'Progress',          max: 5 },
  { key: 'autonomy',        label: 'Autonomy',          max: 5 },
  { key: 'professionalism', label: 'Professionalism',   max: 5 },
];

const Evaluations = () => {
  const { evaluations, projects, submitSupervisorScore, user } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [selectedEval, setSelectedEval] = useState(null);
  const [score, setScore] = useState('');
  const [comment, setComment] = useState('');
  const [criteria, setCriteria] = useState({ report: 0, progress: 0, autonomy: 0, professionalism: 0 });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const flash = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };

  const openEval = (ev) => {
    setSelectedEval(ev);
    setScore(ev.supervisor_score?.toString() ?? '');
    setComment(ev.supervisor_comment ?? '');
    setCriteria({ report: 0, progress: 0, autonomy: 0, professionalism: 0,
      ...(ev.supervisor_criteria || {}) });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEval) return;
    setSaving(true);
    try {
      await submitSupervisorScore(selectedEval.id, Number(score), comment, criteria);
      flash('Evaluation submitted successfully!');
      setShowModal(false);
    } catch (err) {
      flash(`Error: ${err?.message || 'Could not submit evaluation.'}`);
    } finally {
      setSaving(false);
    }
  };

  // Map evaluation → project for title/student name
  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]));

  const evaluated  = evaluations.filter(e => e.supervisor_score !== null);
  const pending    = evaluations.filter(e => e.supervisor_score === null);

  return (
    <div className="evaluations-page-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Student Evaluations</h2>
            <p className="text-muted small mb-0">Submit and manage your evaluations — {user?.name}</p>
          </motion.div>
        </div>

        {successMsg && (
          <div className="glass-card mb-4 p-3 rounded-4 border-start border-success border-4 d-flex align-items-center gap-3">
            <CheckCircle size={18} className="text-success shrink-0" />
            <span className="small fw-bold">{successMsg}</span>
            <button type="button" className="ms-auto btn btn-sm p-0 border-0 bg-transparent" onClick={() => setSuccessMsg('')}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <Row className="g-4 mb-5">
          <Col lg={4} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <Award size={28} className="text-primary mx-auto mb-2" />
              <div className="fs-2 fw-bold text-primary">{evaluations.length}</div>
              <div className="small text-muted fw-bold">Total Assigned</div>
            </Card>
          </Col>
          <Col lg={4} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <CheckCircle size={28} className="text-success mx-auto mb-2" />
              <div className="fs-2 fw-bold text-success">{evaluated.length}</div>
              <div className="small text-muted fw-bold">Evaluated</div>
            </Card>
          </Col>
          <Col lg={4} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <Clock size={28} className="text-warning mx-auto mb-2" />
              <div className="fs-2 fw-bold text-warning">{pending.length}</div>
              <div className="small text-muted fw-bold">Pending</div>
            </Card>
          </Col>
        </Row>

        {/* Evaluations List */}
        {evaluations.length === 0 && (
          <div className="text-center py-5 text-muted">
            <Star size={48} className="mb-3 opacity-30" />
            <h5 className="fw-bold">No evaluations assigned yet</h5>
            <p className="small">Projects will appear here once assigned to you.</p>
          </div>
        )}

        <Row className="g-4">
          {evaluations.map(ev => {
            const project = projectMap[ev.project] || projects.find(p => p.evaluation?.id === ev.id);
            const studentName = project?.student?.name || 'Unknown Student';
            const projectTitle = project?.title || `Project #${ev.project}`;
            const isEvaluated = ev.supervisor_score !== null;
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
                        <span className="small fw-bold">Score</span>
                        <span className="small text-primary fw-bold">{ev.supervisor_score}/20</span>
                      </div>
                      <ProgressBar now={(parseFloat(ev.supervisor_score) / 20) * 100} variant="primary" className="rounded-pill" style={{ height: '6px' }} />
                      {ev.supervisor_comment && (
                        <p className="extra-small text-muted mt-2 mb-0">{ev.supervisor_comment}</p>
                      )}
                    </div>
                  )}

                  <Button
                    variant={isEvaluated ? 'outline-primary' : 'primary'}
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
          <Modal.Title className="fw-bold fs-6">
            Submit Supervisor Evaluation
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-4">
              <Col md={6}>
                <h6 className="fw-bold text-navy mb-3">Criteria Scores</h6>
                {CRITERIA.map(c => (
                  <div key={c.key} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <label className="small fw-bold">{c.label}</label>
                      <span className="small text-primary fw-bold">{criteria[c.key]}/{c.max}</span>
                    </div>
                    <Form.Range
                      min={0} max={c.max} step={0.5}
                      value={criteria[c.key]}
                      onChange={e => setCriteria(prev => ({ ...prev, [c.key]: Number(e.target.value) }))}
                    />
                  </div>
                ))}
              </Col>
              <Col md={6}>
                <h6 className="fw-bold text-navy mb-3">Overall Score</h6>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">Score (0–20)</Form.Label>
                  <Form.Control
                    type="number" min="0" max="20" step="0.5"
                    value={score}
                    onChange={e => setScore(e.target.value)}
                    required
                    placeholder="e.g. 15.5"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="small fw-bold">Comment</Form.Label>
                  <Form.Control
                    as="textarea" rows={4}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add your evaluation comments..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Submit Evaluation'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Evaluations;
