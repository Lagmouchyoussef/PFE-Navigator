import React from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Award, TrendingUp, CheckCircle, Clock, Activity, Star, FileText } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Radar, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useApp } from '../../../context/AppContext';

// ── helpers ───────────────────────────────────────────────────────────────────

const toNum = (v) => {
  const n = Number.parseFloat(v);
  return Number.isNaN(n) ? null : n;
};

const computeFinal = (sup, jury, supW, juryW) => {
  if (sup !== null && jury !== null) return sup * (supW / 100) + jury * (juryW / 100);
  if (sup !== null) return sup;
  if (jury !== null) return jury;
  return null;
};

const gradeVariant = (score) => {
  if (score === null) return 'secondary';
  if (score >= 16) return 'success';
  if (score >= 12) return 'primary';
  if (score >= 10) return 'warning';
  return 'danger';
};

const buildScoreIcon = (isPublished, grade) => {
  if (!isPublished || grade === null) return <Activity size={28} className="text-muted mx-auto mb-2" />;
  return grade >= 10
    ? <CheckCircle size={28} className="text-success mx-auto mb-2" />
    : <Clock size={28} className="text-danger mx-auto mb-2" />;
};

const buildResultLabel = (isPublished, grade) => {
  if (!isPublished || grade === null) return 'Pending';
  return grade >= 10 ? 'PASSED' : 'FAILED';
};

const buildResultVariant = (isPublished, grade) => {
  if (!isPublished || grade === null) return 'muted';
  return grade >= 10 ? 'success' : 'danger';
};

// ── component ─────────────────────────────────────────────────────────────────

const EvaluationPage = () => {
  const { evaluations: rawEvals, currentProject, user, isGradesPublished, pfeWeights } = useApp();
  const evaluations = Array.isArray(rawEvals) ? rawEvals : [];

  const evaluation = evaluations[0] ?? null;
  const supScore  = evaluation ? toNum(evaluation.supervisor_score) : null;
  const juryScore = evaluation ? toNum(evaluation.jury_score) : null;
  const supW  = pfeWeights?.supervisor ?? 50;
  const juryW = pfeWeights?.jury ?? 50;
  const pfeFinal = computeFinal(supScore, juryScore, supW, juryW);
  const isPublished = evaluation?.is_published || isGradesPublished;

  const performanceData = [
    { name: 'Supervisor', score: supScore  ? (supScore  / 20) * 100 : 0 },
    { name: 'Jury',       score: juryScore ? (juryScore / 20) * 100 : 0 },
    { name: 'Final',      score: pfeFinal  ? (pfeFinal  / 20) * 100 : 0 },
  ];

  const criteriaData = [
    { subject: 'Technical',       A: evaluation?.technical_quality ?? 0, fullMark: 100 },
    { subject: 'Innovation',      A: evaluation?.innovation        ?? 0, fullMark: 100 },
    { subject: 'Documentation',   A: evaluation?.documentation     ?? 0, fullMark: 100 },
    { subject: 'Implementation',  A: evaluation?.implementation    ?? 0, fullMark: 100 },
    { subject: 'Presentation',    A: evaluation?.presentation      ?? 0, fullMark: 100 },
  ];

  const scoreDisplay = (score) =>
    score === null ? '—' : `${score}/20`;

  const resultIcon    = buildScoreIcon(isPublished, pfeFinal);
  const resultLabel   = buildResultLabel(isPublished, pfeFinal);
  const resultVariant = buildResultVariant(isPublished, pfeFinal);

  return (
    <div className="evaluation-page-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Evaluation &amp; Performance</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Track your project assessments — {user?.name}
            </p>
          </motion.div>
          <div className="d-flex gap-2 align-items-center">
            {isPublished
              ? <Badge bg="success" className="px-3 py-2 rounded-pill">Grades Published</Badge>
              : <Badge bg="warning" className="px-3 py-2 rounded-pill">Pending Publication</Badge>
            }
          </div>
        </header>

        {/* Project Info */}
        {currentProject && (
          <Row className="g-4 mb-5">
            <Col>
              <Card className="glass-card border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3">
                  <FileText size={32} className="text-primary" />
                  <div>
                    <div className="fw-bold text-navy fs-5">{currentProject.title}</div>
                    <div className="small text-muted">
                      Supervisor: {currentProject.supervisor?.name || 'Not assigned'} &bull;
                      Status: <span className="text-capitalize">{currentProject.status}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Score Cards */}
        <Row className="g-4 mb-5">
          <Col lg={3} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <Award size={28} className="text-primary mx-auto mb-2" />
              <div className="small text-muted fw-bold mb-1">Supervisor Score</div>
              <div className={`fs-2 fw-bold text-${gradeVariant(supScore)}`}>
                {scoreDisplay(supScore)}
              </div>
            </Card>
          </Col>
          <Col lg={3} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <Star size={28} className="text-warning mx-auto mb-2" />
              <div className="small text-muted fw-bold mb-1">Jury Score</div>
              <div className={`fs-2 fw-bold text-${gradeVariant(juryScore)}`}>
                {scoreDisplay(juryScore)}
              </div>
            </Card>
          </Col>
          <Col lg={3} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              <TrendingUp size={28} className="text-success mx-auto mb-2" />
              <div className="small text-muted fw-bold mb-1">Final Grade</div>
              <div className={`fs-2 fw-bold text-${gradeVariant(isPublished ? pfeFinal : null)}`}>
                {isPublished && pfeFinal !== null ? `${pfeFinal.toFixed(2)}/20` : '—'}
              </div>
            </Card>
          </Col>
          <Col lg={3} sm={6}>
            <Card className="glass-card border-0 shadow-sm p-4 text-center">
              {resultIcon}
              <div className="small text-muted fw-bold mb-1">Result</div>
              <div className={`fw-bold text-${resultVariant}`}>{resultLabel}</div>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        {evaluation && (
          <Row className="g-4 mb-5">
            <Col lg={6}>
              <Card className="glass-card border-0 shadow-sm p-4 h-100">
                <h6 className="fw-bold text-navy mb-4">Score Overview</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [`${v.toFixed(1)}%`]} />
                    <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="glass-card border-0 shadow-sm p-4 h-100">
                <h6 className="fw-bold text-navy mb-4">Criteria Breakdown</h6>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={criteriaData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Score" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        )}

        {/* Weights & Comments */}
        {evaluation && (
          <Row className="g-4 mb-5">
            <Col lg={6}>
              <Card className="glass-card border-0 shadow-sm p-4">
                <h6 className="fw-bold text-navy mb-4">Grading Weights</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">Supervisor</span>
                    <span className="small text-muted">{evaluation.supervisor_weight ?? supW}%</span>
                  </div>
                  <ProgressBar now={evaluation.supervisor_weight ?? supW} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">Jury</span>
                    <span className="small text-muted">{evaluation.jury_weight ?? juryW}%</span>
                  </div>
                  <ProgressBar now={evaluation.jury_weight ?? juryW} variant="warning" className="rounded-pill" style={{ height: '8px' }} />
                </div>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="glass-card border-0 shadow-sm p-4 h-100">
                <h6 className="fw-bold text-navy mb-3">Evaluator Comments</h6>
                {evaluation.supervisor_comment && (
                  <div className="mb-3">
                    <div className="small fw-bold text-muted mb-1">Supervisor</div>
                    <p className="small text-navy mb-0">{evaluation.supervisor_comment}</p>
                  </div>
                )}
                {evaluation.jury_comment && (
                  <div>
                    <div className="small fw-bold text-muted mb-1">Jury</div>
                    <p className="small text-navy mb-0">{evaluation.jury_comment}</p>
                  </div>
                )}
                {!evaluation.supervisor_comment && !evaluation.jury_comment && (
                  <p className="text-muted small">No comments yet.</p>
                )}
              </Card>
            </Col>
          </Row>
        )}

        {/* Empty state */}
        {!evaluation && (
          <div className="text-center py-5">
            <Activity size={60} className="text-muted mb-3 opacity-30" />
            <h5 className="fw-bold text-muted">No evaluation available yet</h5>
            <p className="text-muted small">
              Your scores will appear here once your supervisor and jury submit their evaluations.
            </p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default EvaluationPage;
