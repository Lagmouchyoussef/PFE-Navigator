import React from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Award, TrendingUp, CheckCircle, Clock, Activity, Star, FileText, Lock, Eye } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { useApp } from '../../../context/AppContext';

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

const EvaluationPage = () => {
  const { evaluations: rawEvals, currentProject, user, pfeWeights } = useApp();
  const evaluations = Array.isArray(rawEvals) ? rawEvals : [];

  const evaluation = evaluations[0] ?? null;
  const isPublished = evaluation?.is_published ?? false;

  // Scores are null when not published (backend masks them)
  const supScore  = evaluation ? toNum(evaluation.supervisor_score) : null;
  const juryScore = evaluation ? toNum(evaluation.jury_score) : null;
  const supW  = evaluation?.supervisor_weight ?? pfeWeights?.supervisor ?? 50;
  const juryW = evaluation?.jury_weight       ?? pfeWeights?.jury       ?? 50;
  const pfeFinal = isPublished ? computeFinal(supScore, juryScore, supW, juryW) : null;

  // Status flags from backend (available even before publication)
  const supervisorScored = evaluation?.supervisor_scored ?? false;
  const juryScored       = evaluation?.jury_scored       ?? false;

  const performanceData = [
    { name: 'Supervisor', score: supScore  ? (supScore  / 20) * 100 : 0 },
    { name: 'Jury',       score: juryScore ? (juryScore / 20) * 100 : 0 },
    { name: 'Final',      score: pfeFinal  ? (pfeFinal  / 20) * 100 : 0 },
  ];

  const criteriaData = [
    { subject: 'Technical',      A: 0, fullMark: 100 },
    { subject: 'Innovation',     A: 0, fullMark: 100 },
    { subject: 'Documentation',  A: 0, fullMark: 100 },
    { subject: 'Implementation', A: 0, fullMark: 100 },
    { subject: 'Presentation',   A: 0, fullMark: 100 },
  ];

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
              ? <Badge bg="success" className="px-3 py-2 rounded-pill d-flex align-items-center gap-2"><Eye size={14}/> Grades Published</Badge>
              : <Badge bg="warning" className="px-3 py-2 rounded-pill d-flex align-items-center gap-2"><Lock size={14}/> Awaiting Publication</Badge>
            }
          </div>
        </header>

        {/* Project Info */}
        {currentProject && (
          <Row className="g-4 mb-4">
            <Col>
              <Card className="glass-card border-0 shadow-sm p-4">
                <div className="d-flex align-items-center gap-3">
                  <FileText size={32} className="text-primary" />
                  <div>
                    <div className="fw-bold text-navy fs-5">{currentProject.title}</div>
                    <div className="small text-muted">
                      Supervisor: {currentProject.supervisor?.name || 'Not assigned'} &bull; Status: <span className="text-capitalize">{currentProject.status}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Not-published banner */}
        {evaluation && !isPublished && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card mb-5 p-4 rounded-4 shadow-sm border-start border-warning border-4 d-flex align-items-start gap-3"
          >
            <Lock size={22} className="text-warning shrink-0 mt-1" />
            <div>
              <div className="fw-bold text-navy mb-1">Grades not yet published</div>
              <p className="small text-muted mb-2 fw-bold opacity-75">
                Your supervisor and jury have submitted their evaluations. The admin will publish the final grades when ready.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Badge bg={supervisorScored ? 'success' : 'secondary'} className="px-3 py-1 rounded-pill d-flex align-items-center gap-1">
                  {supervisorScored ? <CheckCircle size={12}/> : <Clock size={12}/>}
                  Supervisor {supervisorScored ? 'scored' : 'pending'}
                </Badge>
                <Badge bg={juryScored ? 'success' : 'secondary'} className="px-3 py-1 rounded-pill d-flex align-items-center gap-1">
                  {juryScored ? <CheckCircle size={12}/> : <Clock size={12}/>}
                  Jury {juryScored ? 'scored' : 'pending'}
                </Badge>
              </div>
            </div>
          </motion.div>
        )}

        {/* Score Cards */}
        {evaluation && (
          <Row className="g-4 mb-5">
            <Col lg={3} sm={6}>
              <Card className={`glass-card border-0 shadow-sm p-4 text-center ${!isPublished ? 'opacity-50' : ''}`}>
                <Award size={28} className={`mx-auto mb-2 ${isPublished ? 'text-primary' : 'text-muted'}`} />
                <div className="small text-muted fw-bold mb-1">Supervisor Score</div>
                {isPublished ? (
                  <div className={`fs-2 fw-bold text-${gradeVariant(supScore)}`}>
                    {supScore !== null ? `${supScore}/20` : '—'}
                  </div>
                ) : (
                  <div className="fs-2 fw-bold text-muted d-flex align-items-center justify-content-center gap-1">
                    <Lock size={18} className="opacity-50" /> <span className="fs-5">Hidden</span>
                  </div>
                )}
                {supervisorScored && !isPublished && (
                  <div className="extra-small text-success mt-1 fw-bold d-flex align-items-center justify-content-center gap-1">
                    <CheckCircle size={11}/> Score submitted
                  </div>
                )}
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className={`glass-card border-0 shadow-sm p-4 text-center ${!isPublished ? 'opacity-50' : ''}`}>
                <Star size={28} className={`mx-auto mb-2 ${isPublished ? 'text-warning' : 'text-muted'}`} />
                <div className="small text-muted fw-bold mb-1">Jury Score</div>
                {isPublished ? (
                  <div className={`fs-2 fw-bold text-${gradeVariant(juryScore)}`}>
                    {juryScore !== null ? `${juryScore}/20` : '—'}
                  </div>
                ) : (
                  <div className="fs-2 fw-bold text-muted d-flex align-items-center justify-content-center gap-1">
                    <Lock size={18} className="opacity-50" /> <span className="fs-5">Hidden</span>
                  </div>
                )}
                {juryScored && !isPublished && (
                  <div className="extra-small text-success mt-1 fw-bold d-flex align-items-center justify-content-center gap-1">
                    <CheckCircle size={11}/> Score submitted
                  </div>
                )}
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className={`glass-card border-0 shadow-sm p-4 text-center ${!isPublished ? 'opacity-50' : ''}`}>
                <TrendingUp size={28} className={`mx-auto mb-2 ${isPublished ? 'text-success' : 'text-muted'}`} />
                <div className="small text-muted fw-bold mb-1">Final Grade</div>
                {isPublished && pfeFinal !== null ? (
                  <div className={`fs-2 fw-bold text-${gradeVariant(pfeFinal)}`}>
                    {pfeFinal.toFixed(2)}/20
                  </div>
                ) : (
                  <div className="fs-2 fw-bold text-muted d-flex align-items-center justify-content-center gap-1">
                    <Lock size={18} className="opacity-50" /> <span className="fs-5">Hidden</span>
                  </div>
                )}
              </Card>
            </Col>
            <Col lg={3} sm={6}>
              <Card className={`glass-card border-0 shadow-sm p-4 text-center ${!isPublished ? 'opacity-50' : ''}`}>
                {isPublished && pfeFinal !== null ? (
                  pfeFinal >= 10
                    ? <CheckCircle size={28} className="text-success mx-auto mb-2" />
                    : <Clock size={28} className="text-danger mx-auto mb-2" />
                ) : (
                  <Lock size={28} className="text-muted mx-auto mb-2 opacity-50" />
                )}
                <div className="small text-muted fw-bold mb-1">Result</div>
                <div className={`fw-bold text-${isPublished && pfeFinal !== null ? (pfeFinal >= 10 ? 'success' : 'danger') : 'muted'}`}>
                  {isPublished && pfeFinal !== null ? (pfeFinal >= 10 ? 'PASSED' : 'FAILED') : 'Pending'}
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* Charts — only when published */}
        {isPublished && evaluation && (
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

        {/* Weights & Comments — only when published */}
        {isPublished && evaluation && (
          <Row className="g-4 mb-5">
            <Col lg={6}>
              <Card className="glass-card border-0 shadow-sm p-4">
                <h6 className="fw-bold text-navy mb-4">Grading Weights</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">Supervisor</span>
                    <span className="small text-muted">{supW}%</span>
                  </div>
                  <ProgressBar now={supW} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                </div>
                <div>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">Jury</span>
                    <span className="small text-muted">{juryW}%</span>
                  </div>
                  <ProgressBar now={juryW} variant="warning" className="rounded-pill" style={{ height: '8px' }} />
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
