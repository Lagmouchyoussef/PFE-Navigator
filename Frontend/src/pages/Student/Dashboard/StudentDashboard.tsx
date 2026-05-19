import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, Bell, CheckCircle, AlertCircle,
  Clock, Target, GraduationCap, TrendingUp,
  MessageSquare, Mail, Users, BookOpen,
  ChevronRight, Activity, Plus, Trash2, Star,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary';

const STATUS_COLOR: Record<string, string> = {
  draft: 'secondary', submitted: 'info', under_review: 'warning',
  approved: 'success', in_progress: 'primary', completed: 'success', rejected: 'danger',
};
const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft', submitted: 'Submitted', under_review: 'Under Review',
  approved: 'Approved', in_progress: 'In Progress', completed: 'Completed', rejected: 'Rejected',
};
const MILE_COLOR: Record<string, string> = {
  completed: 'success', in_progress: 'primary', pending: 'secondary',
};

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    user, currentProject,
    documents, milestones, appointments, juryAssignments,
    evaluations, notifications, unreadNotificationsCount,
    messages, pfeFinalGrade, deleteDocument,
  } = useApp() as any;

  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [docToDelete, setDocToDelete] = React.useState<number | null>(null);

  // ── Normalise arrays ────────────────────────────────────────────────────────
  const docs:    any[] = Array.isArray(documents)       ? documents       : [];
  const miles:   any[] = Array.isArray(milestones)      ? milestones      : [];
  const appts:   any[] = Array.isArray(appointments)    ? appointments    : [];
  const juries:  any[] = Array.isArray(juryAssignments) ? juryAssignments : [];
  const notifs:  any[] = Array.isArray(notifications)   ? notifications   : [];
  const msgs:    any[] = Array.isArray(messages)        ? messages        : [];
  const feedbacks: any[] = Array.isArray(currentProject?.feedbacks) ? currentProject.feedbacks : [];
  const evaluation: any = evaluations?.[0] ?? currentProject?.evaluation ?? null;

  // ── Derived metrics ─────────────────────────────────────────────────────────
  const completedMiles = miles.filter((m: any) => m.status === 'completed').length;
  const progressPct    = miles.length > 0 ? Math.round((completedMiles / miles.length) * 100) : 0;
  const pendingDocs    = docs.filter((d: any) => d.status === 'pending').length;
  const approvedDocs   = docs.filter((d: any) => d.status === 'approved').length;
  const unreadMsgs     = msgs.filter((m: any) => m.recipient === user?.id && !m.is_read).length;
  const recentAlerts   = notifs.filter((n: any) => !n.is_read).slice(0, 3);

  const today       = new Date();
  const upcomingAppts = [...appts]
    .filter((a: any) => new Date(a.date) >= today && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const defenseAppt = upcomingAppts.find((a: any) => a.type?.toLowerCase() === 'defense')
    ?? appts.find((a: any) => a.type?.toLowerCase() === 'defense');

  // Final grade computation (mirrors EvaluationSerializer logic)
  const finalScore: number | null = (() => {
    if (pfeFinalGrade !== null && pfeFinalGrade !== undefined) return pfeFinalGrade;
    if (!evaluation?.is_published) return null;
    const s  = parseFloat(evaluation.supervisor_score);
    const j  = parseFloat(evaluation.jury_score);
    const sw = (evaluation.supervisor_weight ?? 50) / 100;
    const jw = (evaluation.jury_weight ?? 50) / 100;
    if (!isNaN(s) && !isNaN(j)) return s * sw + j * jw;
    if (!isNaN(s)) return s;
    if (!isNaN(j)) return j;
    return null;
  })();
  const passed = finalScore !== null && finalScore >= 10;

  // ── Stat cards ──────────────────────────────────────────────────────────────
  const stats = [
    { label: 'Documents',    value: docs.length,           sub: `${pendingDocs} pending`,          icon: FileText,      color: 'primary', link: '/student/reports'      },
    { label: 'Appointments', value: upcomingAppts.length,  sub: `${appts.length} total`,            icon: Calendar,      color: 'info',    link: '/student/schedule'     },
    { label: 'Progress',     value: `${completedMiles}/${miles.length}`, sub: `${progressPct}% done`, icon: Target,    color: 'success', link: '/student/dashboard'    },
    {
      label: 'Grade',
      value: finalScore !== null ? `${finalScore.toFixed(1)}/20` : '—',
      sub: evaluation?.is_published ? (passed ? 'PASSED ✓' : 'FAILED ✗') : 'Pending',
      icon: GraduationCap,
      color: finalScore !== null ? (passed ? 'success' : 'danger') : 'warning',
      link: '/student/evaluation',
    },
  ];

  const donutData = [
    { value: progressPct,              color: 'var(--color-primary)' },
    { value: Math.max(0, 100 - progressPct), color: 'var(--color-surface-alt)' },
  ];

  return (
    <div className="student-dashboard-layout py-4">
      <Container fluid className="px-4">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <header className="mb-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="fw-bold mb-1 text-navy">Welcome, {user?.name}</h2>
              <p className="text-muted small mb-0 fw-bold opacity-75">
                {currentProject?.title ? `Project: ${currentProject.title}` : 'No project assigned yet'}
                {' '}• {new Date().getFullYear()}
              </p>
            </motion.div>
            <div className="d-flex gap-2 flex-wrap">
              {unreadMsgs > 0 && (
                <Button variant="outline-primary" size="sm" className="rounded-pill d-flex align-items-center gap-2 fw-bold"
                  onClick={() => navigate('/student/messages')}>
                  <MessageSquare size={14} /> {unreadMsgs} new message{unreadMsgs > 1 ? 's' : ''}
                </Button>
              )}
              <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => navigate('/student/reports')}>
                <Plus size={18} /> New Submission
              </Button>
            </div>
          </div>
        </header>

        {/* ── Result Banner (only when published) ────────────────────────────── */}
        {evaluation?.is_published && finalScore !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className={`mb-5 p-4 rounded-4 border ${passed ? 'bg-success-soft border-success border-opacity-25' : 'bg-danger-soft border-danger border-opacity-25'}`}>
            <div className="d-flex align-items-center gap-3">
              <div className={`p-3 rounded-circle ${passed ? 'bg-success' : 'bg-danger'} text-white flex-shrink-0`}>
                {passed ? <CheckCircle size={26} /> : <AlertCircle size={26} />}
              </div>
              <div>
                <h5 className={`fw-bold mb-0 ${passed ? 'text-success' : 'text-danger'}`}>
                  {passed ? `Congratulations ${user?.name} — you passed!` : `${user?.name} — not yet passed`}
                </h5>
                <p className="text-muted small mb-0">
                  Final score: <strong>{finalScore.toFixed(2)}/20</strong> •{' '}
                  {passed ? 'Congratulations on completing your PFE!' : 'Please contact the administration for more details.'}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Stats Row ───────────────────────────────────────────────────────── */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col key={i} lg={3} sm={6}>
              <div
                className={`glass-card p-4 rounded-4 shadow-sm border-start border-4 border-${s.color} d-flex align-items-center gap-3`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(s.link)}
              >
                <div className={`p-3 rounded-4 bg-${s.color}-soft text-${s.color} flex-shrink-0`}>
                  <s.icon size={22} />
                </div>
                <div>
                  <div className="fs-4 fw-bold text-navy">{s.value}</div>
                  <div className="small fw-bold text-muted">{s.label}</div>
                  <div className="extra-small text-muted opacity-60">{s.sub}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* ══════════════ Left Column ══════════════ */}
          <Col lg={8}>

            {/* Project Overview */}
            {currentProject && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="fw-bold text-navy mb-1">{currentProject.title}</h6>
                    {currentProject.subject_title && (
                      <div className="extra-small text-muted fw-bold">{currentProject.subject_title}</div>
                    )}
                  </div>
                  <Badge bg={STATUS_COLOR[currentProject.status] || 'secondary'} className="text-capitalize">
                    {STATUS_LABEL[currentProject.status] || currentProject.status}
                  </Badge>
                </div>

                {currentProject.description && (
                  <p className="extra-small text-muted lh-base mb-3">
                    {currentProject.description.length > 200
                      ? `${currentProject.description.substring(0, 200)}…`
                      : currentProject.description}
                  </p>
                )}

                <div className="d-flex flex-wrap gap-4 mb-3">
                  {currentProject.start_date && (
                    <span className="extra-small fw-bold text-muted d-flex align-items-center gap-1">
                      <Calendar size={12} />
                      Start: {new Date(currentProject.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {currentProject.end_date && (
                    <span className="extra-small fw-bold text-muted d-flex align-items-center gap-1">
                      <Clock size={12} />
                      End: {new Date(currentProject.end_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {currentProject.supervisor && (
                    <span className="extra-small fw-bold text-muted d-flex align-items-center gap-1">
                      <Users size={12} /> {currentProject.supervisor.name}
                    </span>
                  )}
                </div>

                {miles.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="extra-small fw-bold text-muted">Overall Progress</span>
                      <span className="extra-small fw-bold text-primary">{progressPct}%</span>
                    </div>
                    <ProgressBar now={progressPct} variant="primary" className="rounded-pill" style={{ height: '6px' }} />
                  </>
                )}
              </div>
            )}

            {/* Milestones */}
            {miles.length > 0 && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                    <Target size={16} className="text-primary" /> Milestones
                  </h6>
                  <span className="extra-small text-muted fw-bold">{completedMiles}/{miles.length} completed</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {miles.map((m: any) => (
                    <div key={m.id} className={`d-flex align-items-center gap-3 p-3 rounded-3 bg-${MILE_COLOR[m.status] || 'secondary'}-soft`}>
                      <div className={`text-${MILE_COLOR[m.status] || 'secondary'} flex-shrink-0`}>
                        {m.status === 'completed'  ? <CheckCircle size={16} /> :
                         m.status === 'in_progress' ? <Activity   size={16} /> :
                                                      <Clock       size={16} />}
                      </div>
                      <div className="flex-grow-1">
                        <div className="small fw-bold text-navy">{m.title}</div>
                        {m.date && (
                          <div className="extra-small text-muted">
                            {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                      <Badge bg={MILE_COLOR[m.status] || 'secondary'} className="text-capitalize extra-small">
                        {(m.status || 'pending').replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Documents */}
            <div className="glass-card rounded-4 shadow-sm mb-4 overflow-hidden">
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <h6 className="fw-bold mb-0 text-navy d-flex align-items-center gap-2">
                  <FileText size={16} className="text-primary" /> Recent Documents
                </h6>
                <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/student/reports')}>
                  View all <ChevronRight size={14} />
                </Button>
              </div>
              {docs.length === 0 ? (
                <div className="p-5 text-center text-muted">
                  <FileText size={36} className="mb-2 opacity-25" />
                  <p className="extra-small fw-bold mb-0">No documents uploaded yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  {docs.slice(0, 4).map((doc: any) => (
                    <div key={doc.id} className="p-3 px-4 border-bottom d-flex align-items-center gap-3 hover-bg-surface transition-all">
                      <div className="p-2 rounded-3 bg-primary-soft text-primary flex-shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-navy text-truncate">{doc.title}</div>
                        <div className="extra-small text-muted">
                          {doc.target === 'jury' ? 'For Jury' : 'For Supervisor'} •{' '}
                          {doc.created_at
                            ? new Date(doc.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
                            : '—'}
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge
                          bg={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}
                          className="extra-small text-capitalize"
                        >
                          {doc.status}
                        </Badge>
                        {doc.file_url && (
                          <a href={doc.file_url} target="_blank" rel="noreferrer"
                            className="btn btn-link btn-sm p-1 text-primary border-0 shadow-none">
                            <TrendingUp size={14} />
                          </a>
                        )}
                        <Button variant="link" size="sm" className="p-1 text-danger border-0 shadow-none"
                          onClick={() => { setDocToDelete(doc.id); setShowDeleteModal(true); }}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Unread Notifications */}
            {recentAlerts.length > 0 && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                    <Bell size={16} className="text-warning" /> Recent Alerts
                    <Badge bg="danger" pill className="extra-small">{unreadNotificationsCount}</Badge>
                  </h6>
                  <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                    onClick={() => navigate('/student/notifications')}>
                    All notifications <ChevronRight size={14} />
                  </Button>
                </div>
                <div className="d-flex flex-column gap-2">
                  {recentAlerts.map((n: any) => (
                    <div key={n.id} className="d-flex align-items-start gap-3 p-3 rounded-3 bg-primary-soft border-start border-primary border-3"
                      style={{ cursor: n.link ? 'pointer' : 'default' }}
                      onClick={() => n.link && navigate(n.link)}>
                      <Bell size={14} className="text-primary mt-1 flex-shrink-0" />
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-navy">{n.title}</div>
                        <div className="extra-small text-muted text-truncate">{n.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* ══════════════ Right Column ══════════════ */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">

              {/* Progress Donut */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-navy">Global Progress</h6>
                  <Activity size={16} className="text-primary" />
                </div>
                <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                  <ErrorBoundary>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={donutData} innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                          {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ErrorBoundary>
                  <div className="position-absolute text-center">
                    <div className="h4 fw-bold mb-0 text-navy">{progressPct}%</div>
                    <div className="extra-small text-muted fw-bold">DONE</div>
                  </div>
                </div>
                <div className="d-flex justify-content-around pt-3 border-top">
                  {[
                    { label: 'Approved', value: approvedDocs, color: 'success' },
                    { label: 'Pending',  value: pendingDocs,  color: 'warning' },
                    { label: 'Steps',    value: completedMiles, color: 'primary' },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <div className={`fw-bold text-${item.color}`}>{item.value}</div>
                      <div className="extra-small text-muted">{item.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Evaluation Summary */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-navy d-flex align-items-center gap-2">
                    <GraduationCap size={16} className="text-primary" /> Evaluation
                  </h6>
                  <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                    onClick={() => navigate('/student/evaluation')}>
                    View <ChevronRight size={14} />
                  </Button>
                </div>
                {evaluation?.is_published ? (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="extra-small fw-bold text-muted">Supervisor</span>
                      <span className="extra-small fw-bold text-primary">
                        {evaluation.supervisor_score !== null ? `${evaluation.supervisor_score}/20` : '—'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="extra-small fw-bold text-muted">Jury</span>
                      <span className="extra-small fw-bold text-success">
                        {evaluation.jury_score !== null ? `${evaluation.jury_score}/20` : '—'}
                      </span>
                    </div>
                    {finalScore !== null && (
                      <div className={`p-3 rounded-3 text-center ${passed ? 'bg-success-soft' : 'bg-danger-soft'}`}>
                        <div className={`fw-bold fs-5 ${passed ? 'text-success' : 'text-danger'}`}>
                          {finalScore.toFixed(2)}/20
                        </div>
                        <Badge bg={passed ? 'success' : 'danger'} className="mt-1 px-3">
                          {passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : evaluation ? (
                  <div className="p-3 rounded-3 bg-warning-soft text-center">
                    <Clock size={20} className="text-warning mb-2" />
                    <div className="small fw-bold text-warning mb-1">Evaluation in progress</div>
                    <div className="extra-small text-muted">
                      {evaluation.supervisor_scored ? '✓ Supervisor scored' : '○ Supervisor pending'}<br />
                      {evaluation.jury_scored ? '✓ Jury scored' : '○ Jury pending'}
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-3 bg-surface-alt text-center extra-small text-muted fw-bold opacity-60">
                    No evaluation assigned yet.
                  </div>
                )}
              </Card>

              {/* Defense Widget */}
              <Card className={`border p-4 shadow-sm ${defenseAppt ? 'bg-primary text-white border-0' : 'glass-card'}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className={`fw-bold mb-0 d-flex align-items-center gap-2 ${defenseAppt ? 'text-white' : 'text-navy'}`}>
                    <Star size={16} className={defenseAppt ? 'opacity-75' : 'text-warning'} /> Defense Date
                  </h6>
                  <Calendar size={16} className={defenseAppt ? 'opacity-75' : 'text-muted'} />
                </div>
                {defenseAppt ? (
                  <>
                    <div className="fw-bold mb-1">{defenseAppt.title}</div>
                    <div className="small opacity-90 mb-1">
                      {new Date(defenseAppt.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="extra-small opacity-75 mb-3 d-flex align-items-center gap-1">
                      <Clock size={12} /> {defenseAppt.time || '--:--'} — {defenseAppt.location || 'TBD'}
                    </div>
                    {juries.length > 0 && (
                      <div className="p-2 rounded-3 bg-white bg-opacity-15 mb-3">
                        <div className="extra-small fw-bold opacity-75 mb-1">Jury Committee</div>
                        {juries.map((j: any) => (
                          <div key={j.id} className="extra-small d-flex align-items-center gap-1">
                            <Users size={10} className="opacity-75" />
                            {j.jury_member_name}
                            <span className="opacity-50">({j.role})</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="light" size="sm" className="w-100 rounded-pill fw-bold extra-small text-primary border-0"
                      onClick={() => navigate('/student/schedule')}>
                      View Full Schedule
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-2">
                    <Calendar size={28} className="text-muted opacity-30 mb-2" />
                    <div className="extra-small fw-bold text-muted">No defense scheduled yet.</div>
                    <Button variant="outline-primary" size="sm" className="rounded-pill mt-3 fw-bold extra-small"
                      onClick={() => navigate('/student/schedule')}>
                      View Schedule
                    </Button>
                  </div>
                )}
              </Card>

              {/* Recent Feedback */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-navy d-flex align-items-center gap-2">
                    <MessageSquare size={16} className="text-primary" /> Recent Feedback
                  </h6>
                  <span className="extra-small text-muted fw-bold">{feedbacks.length} total</span>
                </div>
                {feedbacks.length > 0 ? (
                  <div className="d-flex flex-column gap-2">
                    {feedbacks.slice(0, 2).map((f: any) => (
                      <div key={f.id} className="p-3 rounded-3 bg-surface-alt border-start border-primary border-3">
                        <div className="small fw-bold text-navy mb-1">{f.title}</div>
                        <p className="extra-small text-muted mb-1 opacity-75 lh-base">
                          "{f.comment?.length > 90 ? `${f.comment.substring(0, 90)}…` : f.comment}"
                        </p>
                        <div className="extra-small text-primary fw-bold">{f.author_name}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-3 bg-surface-alt text-center">
                    <p className="extra-small text-muted mb-0 fw-bold opacity-60">No feedback received yet.</p>
                  </div>
                )}
              </Card>

              {/* Supervisor Card */}
              <Card className="glass-card border p-4 shadow-sm">
                <h6 className="fw-bold mb-3 text-navy">Academic Supervisor</h6>
                {currentProject?.supervisor ? (
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="bg-primary text-white rounded-4 d-flex align-items-center justify-content-center fw-bold shadow-sm flex-shrink-0"
                      style={{ width: '44px', height: '44px', fontSize: '16px' }}
                    >
                      {(currentProject.supervisor.name || 'S').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="fw-bold small text-navy">{currentProject.supervisor.name}</div>
                      <div className="extra-small text-muted">{currentProject.supervisor.email}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-3 mb-3">
                    <div className="extra-small text-muted fw-bold opacity-50">No supervisor assigned yet.</div>
                  </div>
                )}
                <Button
                  variant="outline-primary" size="sm"
                  className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill fw-bold"
                  onClick={() => navigate('/student/messages')}
                  disabled={!currentProject?.supervisor}
                >
                  <Mail size={14} /> Send Message
                </Button>
              </Card>

              {/* Quick Links */}
              <Card className="glass-card border p-4 shadow-sm">
                <h6 className="fw-bold mb-3 text-navy d-flex align-items-center gap-2">
                  <BookOpen size={16} className="text-primary" /> Quick Access
                </h6>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: 'My Documents',    icon: FileText,      link: '/student/reports',       color: 'primary' },
                    { label: 'Schedule',         icon: Calendar,      link: '/student/schedule',      color: 'info'    },
                    { label: 'Evaluation',       icon: GraduationCap, link: '/student/evaluation',    color: 'success' },
                    { label: 'Messages',         icon: MessageSquare, link: '/student/messages',      color: 'teal',   badge: unreadMsgs    },
                    { label: 'Notifications',    icon: Bell,          link: '/student/notifications', color: 'warning', badge: unreadNotificationsCount },
                    { label: 'Admin Notes',      icon: BookOpen,      link: '/student/notes',         color: 'secondary' },
                    { label: 'Resource Hub',     icon: TrendingUp,    link: '/resources',             color: 'orange'  },
                  ].map((item, i) => (
                    <button
                      key={i}
                      type="button"
                      className="d-flex align-items-center gap-3 p-2 rounded-3 border-0 bg-transparent text-start hover-bg-surface-alt transition-all"
                      onClick={() => navigate(item.link)}
                    >
                      <div className={`p-2 rounded-3 bg-${item.color}-soft text-${item.color} flex-shrink-0`}>
                        <item.icon size={14} />
                      </div>
                      <span className="small fw-bold text-navy flex-grow-1">{item.label}</span>
                      {(item as any).badge > 0 && (
                        <Badge bg="danger" pill className="extra-small">{(item as any).badge}</Badge>
                      )}
                      <ChevronRight size={14} className="text-muted opacity-40" />
                    </button>
                  ))}
                </div>
              </Card>

            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-inline-block mb-3">
            <Trash2 size={28} />
          </div>
          <h6 className="fw-bold text-navy mb-2">Delete this document?</h6>
          <p className="text-muted extra-small mb-4">This action is irreversible.</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-secondary" size="sm" className="rounded-pill px-4 fw-bold"
              onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" size="sm" className="rounded-pill px-4 fw-bold"
              onClick={() => { if (docToDelete !== null) deleteDocument(docToDelete); setShowDeleteModal(false); }}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
