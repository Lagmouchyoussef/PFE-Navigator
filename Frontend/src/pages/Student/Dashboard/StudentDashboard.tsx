import React from 'react';
import { Container, Row, Col, Button, Badge, Modal, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Calendar, Bell, CheckCircle, AlertCircle,
  Clock, Target, GraduationCap, TrendingUp,
  MessageSquare, Mail, Users,
  ChevronRight, Activity, Trash2, Star,
  MapPin, Award, Layers,
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

const formatDate = (d: string | undefined, opts?: Intl.DateTimeFormatOptions) =>
  d ? new Date(d).toLocaleDateString('en-US', opts ?? { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const SectionTitle: React.FC<{ icon: React.ElementType; title: string; color?: string; right?: React.ReactNode }> = ({
  icon: Icon, title, color = 'primary', right,
}) => (
  <div className="d-flex align-items-center justify-content-between mb-3">
    <div className="d-flex align-items-center gap-2">
      <div className={`p-2 rounded-3 bg-${color}-soft`}>
        <Icon size={15} className={`text-${color}`} />
      </div>
      <span className="fw-bold text-navy">{title}</span>
    </div>
    {right}
  </div>
);

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

  const docs:     any[] = Array.isArray(documents)       ? documents       : [];
  const miles:    any[] = Array.isArray(milestones)      ? milestones      : [];
  const appts:    any[] = Array.isArray(appointments)    ? appointments    : [];
  const juries:   any[] = Array.isArray(juryAssignments) ? juryAssignments : [];
  const notifs:   any[] = Array.isArray(notifications)   ? notifications   : [];
  const msgs:     any[] = Array.isArray(messages)        ? messages        : [];
  const feedbacks: any[] = Array.isArray(currentProject?.feedbacks) ? currentProject.feedbacks : [];
  const evaluation: any = evaluations?.[0] ?? currentProject?.evaluation ?? null;

  const completedMiles = miles.filter((m: any) => m.status === 'completed').length;
  const progressPct    = miles.length > 0 ? Math.round((completedMiles / miles.length) * 100) : 0;
  const pendingDocs    = docs.filter((d: any) => d.status === 'pending').length;
  const approvedDocs   = docs.filter((d: any) => d.status === 'approved').length;
  const recentAlerts   = notifs.filter((n: any) => !n.is_read).slice(0, 3);

  const today         = new Date();
  const upcomingAppts = [...appts]
    .filter((a: any) => new Date(a.date) >= today && a.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextAppt      = upcomingAppts[0] ?? null;
  const defenseAppt   = upcomingAppts.find((a: any) => a.type?.toLowerCase() === 'defense')
    ?? appts.find((a: any) => a.type?.toLowerCase() === 'defense');

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

  const donutData = [
    { value: progressPct,                    color: 'var(--color-primary)' },
    { value: Math.max(0, 100 - progressPct), color: 'var(--color-surface-alt)' },
  ];

  const stats = [
    {
      label: 'Documents',
      value: docs.length,
      sub: `${approvedDocs} approved · ${pendingDocs} pending`,
      icon: FileText, color: 'primary',
      link: '/student/reports',
    },
    {
      label: 'Appointments',
      value: upcomingAppts.length,
      sub: upcomingAppts.length > 0 ? `Next: ${formatDate(upcomingAppts[0]?.date, { month: 'short', day: 'numeric' })}` : 'None scheduled',
      icon: Calendar, color: 'info',
      link: '/student/schedule',
    },
    {
      label: 'Milestones',
      value: `${completedMiles} / ${miles.length}`,
      sub: miles.length > 0 ? `${progressPct}% complete` : 'No milestones yet',
      icon: Target, color: 'success',
      link: '/student/dashboard',
    },
    {
      label: 'Final Grade',
      value: finalScore !== null ? `${finalScore.toFixed(1)} / 20` : '—',
      sub: evaluation?.is_published ? (passed ? 'PASSED' : 'FAILED') : 'Not published yet',
      icon: GraduationCap,
      color: finalScore !== null ? (passed ? 'success' : 'danger') : 'warning',
      link: '/student/evaluation',
    },
  ];

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* ── Result Banner ────────────────────────────────────────────────────── */}
        {evaluation?.is_published && finalScore !== null && (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
            className={`mb-5 p-4 rounded-4 border d-flex align-items-center gap-3 ${passed ? 'bg-success-soft border-success border-opacity-25' : 'bg-danger-soft border-danger border-opacity-25'}`}>
            <div className={`p-3 rounded-circle ${passed ? 'bg-success' : 'bg-danger'} text-white flex-shrink-0`}>
              {passed ? <Award size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h6 className={`fw-bold mb-1 ${passed ? 'text-success' : 'text-danger'}`}>
                {passed ? `Congratulations ${user?.first_name || user?.name} — you passed!` : 'Results published — not yet passed'}
              </h6>
              <p className="text-muted small mb-0">
                Final score: <strong>{finalScore.toFixed(2)} / 20</strong>
                {passed ? ' — Congratulations on completing your PFE!' : ' — Contact the administration for more information.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
        <Row className="g-3 mb-5">
          {stats.map((s, i) => (
            <Col key={i} lg={3} sm={6}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="glass-card p-4 rounded-4 shadow-sm h-100" style={{ cursor: 'pointer' }}
                  onClick={() => navigate(s.link)}>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className={`p-2 rounded-3 bg-${s.color}-soft`}>
                      <s.icon size={18} className={`text-${s.color}`} />
                    </div>
                    <ChevronRight size={14} className="text-muted opacity-40 mt-1" />
                  </div>
                  <div className={`fs-4 fw-bold text-${s.color} mb-1`}>{s.value}</div>
                  <div className="small fw-bold text-navy">{s.label}</div>
                  <div className="extra-small text-muted mt-1">{s.sub}</div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* ════════════════ Left Column (8) ════════════════ */}
          <Col lg={8}>

            {/* Project Overview */}
            {currentProject ? (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <SectionTitle icon={Layers} title="Project Overview" color="primary" />
                <Row className="g-3 mb-3">
                  <Col>
                    <div className="fw-bold text-navy mb-1">{currentProject.title}</div>
                    {currentProject.subject_title && (
                      <div className="extra-small text-muted mb-2">{currentProject.subject_title}</div>
                    )}
                    {currentProject.description && (
                      <p className="extra-small text-muted lh-base mb-0">
                        {currentProject.description.length > 180
                          ? `${currentProject.description.substring(0, 180)}…`
                          : currentProject.description}
                      </p>
                    )}
                  </Col>
                  <Col xs="auto">
                    <Badge bg={STATUS_COLOR[currentProject.status] || 'secondary'} className="px-3 py-2 text-capitalize rounded-pill">
                      {STATUS_LABEL[currentProject.status] || currentProject.status}
                    </Badge>
                  </Col>
                </Row>
                <div className="d-flex flex-wrap gap-3 mb-3 pt-2 border-top">
                  {currentProject.start_date && (
                    <span className="extra-small text-muted d-flex align-items-center gap-1">
                      <Calendar size={12} className="text-primary" /> Start: {formatDate(currentProject.start_date)}
                    </span>
                  )}
                  {currentProject.end_date && (
                    <span className="extra-small text-muted d-flex align-items-center gap-1">
                      <Clock size={12} className="text-danger" /> End: {formatDate(currentProject.end_date)}
                    </span>
                  )}
                  {currentProject.supervisor && (
                    <span className="extra-small text-muted d-flex align-items-center gap-1">
                      <Users size={12} className="text-info" /> {currentProject.supervisor.name}
                    </span>
                  )}
                </div>
                {miles.length > 0 && (
                  <>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="extra-small fw-bold text-muted">Overall Progress</span>
                      <span className="extra-small fw-bold text-primary">{progressPct}%</span>
                    </div>
                    <ProgressBar now={progressPct} variant="primary" className="rounded-pill" style={{ height: '8px' }} />
                  </>
                )}
              </div>
            ) : (
              <div className="glass-card p-5 rounded-4 shadow-sm mb-4 text-center">
                <Layers size={40} className="text-muted opacity-25 mb-3" />
                <p className="fw-bold text-muted mb-0">No project assigned yet.</p>
              </div>
            )}

            {/* Next Appointment */}
            {nextAppt && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4"
                style={{ borderLeft: '4px solid var(--color-info)' }}>
                <SectionTitle icon={Calendar} title="Next Appointment" color="info"
                  right={
                    <Button variant="link" size="sm" className="p-0 text-info fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                      onClick={() => navigate('/student/schedule')}>
                      All <ChevronRight size={14} />
                    </Button>
                  }
                />
                <div className="d-flex align-items-center gap-4">
                  <div className="text-center rounded-3 p-3 bg-info-soft flex-shrink-0" style={{ minWidth: '64px' }}>
                    <div className="fw-bold text-info" style={{ fontSize: '1.5rem', lineHeight: 1 }}>
                      {new Date(nextAppt.date).getDate()}
                    </div>
                    <div className="extra-small text-muted fw-bold text-uppercase">
                      {new Date(nextAppt.date).toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="fw-bold text-navy small mb-1">{nextAppt.title}</div>
                    <div className="extra-small text-muted d-flex align-items-center gap-3 flex-wrap">
                      {nextAppt.time && <span className="d-flex align-items-center gap-1"><Clock size={11} />{nextAppt.time}</span>}
                      {nextAppt.location && <span className="d-flex align-items-center gap-1"><MapPin size={11} />{nextAppt.location}</span>}
                      {nextAppt.type && <Badge bg="info" className="extra-small text-capitalize px-2">{nextAppt.type}</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones Timeline */}
            {miles.length > 0 && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <SectionTitle icon={Target} title="Milestones" color="success"
                  right={<span className="extra-small text-muted fw-bold">{completedMiles}/{miles.length} completed</span>}
                />
                <div className="d-flex flex-column" style={{ gap: '2px' }}>
                  {miles.map((m: any, idx: number) => (
                    <div key={m.id} className="d-flex gap-3 align-items-stretch">
                      {/* Timeline line */}
                      <div className="d-flex flex-column align-items-center flex-shrink-0">
                        <div className={`rounded-circle border-2 d-flex align-items-center justify-content-center flex-shrink-0
                          ${m.status === 'completed' ? 'bg-success text-white' : m.status === 'in_progress' ? 'bg-primary text-white' : 'bg-surface-alt text-muted'}`}
                          style={{ width: '28px', height: '28px', border: '2px solid transparent' }}>
                          {m.status === 'completed'   ? <CheckCircle size={13} /> :
                           m.status === 'in_progress' ? <Activity    size={13} /> :
                                                         <Clock       size={13} />}
                        </div>
                        {idx < miles.length - 1 && (
                          <div style={{ width: '2px', flex: 1, minHeight: '16px',
                            background: m.status === 'completed' ? 'var(--color-success)' : 'var(--color-border)',
                            opacity: 0.3, margin: '2px 0' }} />
                        )}
                      </div>
                      {/* Content */}
                      <div className={`flex-grow-1 p-3 rounded-3 mb-2 ${m.status === 'completed' ? 'bg-success-soft' : m.status === 'in_progress' ? 'bg-primary-soft' : 'bg-surface-alt'}`}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="small fw-bold text-navy">{m.title}</span>
                          <Badge bg={MILE_COLOR[m.status] || 'secondary'} className="extra-small text-capitalize rounded-pill px-2">
                            {(m.status || 'pending').replace('_', ' ')}
                          </Badge>
                        </div>
                        {m.date && <div className="extra-small text-muted mt-1">{formatDate(m.date)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            <div className="glass-card rounded-4 shadow-sm mb-4 overflow-hidden">
              <div className="px-4 pt-4 pb-3 d-flex justify-content-between align-items-center">
                <SectionTitle icon={FileText} title="Recent Documents" color="primary" right={null} />
                <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1 mb-3"
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
                <div>
                  {/* Header row */}
                  <div className="px-4 py-2 bg-surface-alt d-flex align-items-center gap-3 border-top border-bottom">
                    <span className="extra-small fw-bold text-muted text-uppercase" style={{ flex: '1' }}>Title</span>
                    <span className="extra-small fw-bold text-muted text-uppercase" style={{ width: '90px' }}>Target</span>
                    <span className="extra-small fw-bold text-muted text-uppercase" style={{ width: '90px' }}>Date</span>
                    <span className="extra-small fw-bold text-muted text-uppercase" style={{ width: '80px' }}>Status</span>
                    <span className="extra-small fw-bold text-muted text-uppercase" style={{ width: '60px' }}>Actions</span>
                  </div>
                  {docs.slice(0, 5).map((doc: any) => (
                    <div key={doc.id} className="px-4 py-3 border-bottom d-flex align-items-center gap-3 hover-bg-surface-alt">
                      <div className="d-flex align-items-center gap-2 flex-grow-1 overflow-hidden">
                        <div className="p-2 rounded-3 bg-primary-soft text-primary flex-shrink-0">
                          <FileText size={13} />
                        </div>
                        <span className="small fw-bold text-navy text-truncate">{doc.title}</span>
                      </div>
                      <span className="extra-small text-muted" style={{ width: '90px', flexShrink: 0 }}>
                        {doc.target === 'jury' ? 'Jury' : 'Supervisor'}
                      </span>
                      <span className="extra-small text-muted" style={{ width: '90px', flexShrink: 0 }}>
                        {formatDate(doc.created_at, { day: 'numeric', month: 'short' })}
                      </span>
                      <span style={{ width: '80px', flexShrink: 0 }}>
                        <Badge bg={doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}
                          className="extra-small text-capitalize rounded-pill px-2">
                          {doc.status}
                        </Badge>
                      </span>
                      <div className="d-flex align-items-center gap-1" style={{ width: '60px', flexShrink: 0 }}>
                        {doc.file_url && (
                          <a href={doc.file_url} target="_blank" rel="noreferrer"
                            className="btn btn-link btn-sm p-1 text-primary border-0 shadow-none">
                            <TrendingUp size={13} />
                          </a>
                        )}
                        <Button variant="link" size="sm" className="p-1 text-danger border-0 shadow-none"
                          onClick={() => { setDocToDelete(doc.id); setShowDeleteModal(true); }}>
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Unread Notifications */}
            {recentAlerts.length > 0 && (
              <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
                <SectionTitle icon={Bell} title="Recent Alerts" color="warning"
                  right={
                    <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                      onClick={() => navigate('/student/notifications')}>
                      All <ChevronRight size={14} />
                    </Button>
                  }
                />
                <div className="d-flex flex-column gap-2">
                  {recentAlerts.map((n: any) => (
                    <div key={n.id} className="d-flex align-items-start gap-3 p-3 rounded-3 bg-warning-soft border-start border-warning border-3"
                      style={{ cursor: n.link ? 'pointer' : 'default' }}
                      onClick={() => n.link && navigate(n.link)}>
                      <Bell size={13} className="text-warning mt-1 flex-shrink-0" />
                      <div className="overflow-hidden">
                        <div className="small fw-bold text-navy">{n.title}</div>
                        <div className="extra-small text-muted text-truncate">{n.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>

          {/* ════════════════ Right Column (4) ════════════════ */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">

              {/* Progress Donut */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <SectionTitle icon={Activity} title="Global Progress" color="primary" />
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
                    <div className="h4 fw-bold mb-0 text-primary">{progressPct}%</div>
                    <div className="extra-small text-muted fw-bold">DONE</div>
                  </div>
                </div>
                <Row className="g-2 pt-3 border-top text-center">
                  <Col>
                    <div className="fw-bold text-success">{approvedDocs}</div>
                    <div className="extra-small text-muted">Approved</div>
                  </Col>
                  <Col>
                    <div className="fw-bold text-warning">{pendingDocs}</div>
                    <div className="extra-small text-muted">Pending</div>
                  </Col>
                  <Col>
                    <div className="fw-bold text-primary">{completedMiles}</div>
                    <div className="extra-small text-muted">Steps</div>
                  </Col>
                </Row>
              </div>

              {/* Evaluation */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <SectionTitle icon={GraduationCap} title="Evaluation" color="primary"
                  right={
                    <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                      onClick={() => navigate('/student/evaluation')}>
                      View <ChevronRight size={14} />
                    </Button>
                  }
                />
                {evaluation?.is_published ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="extra-small fw-bold text-muted">Supervisor</span>
                      <span className="small fw-bold text-primary">
                        {evaluation.supervisor_score != null ? `${evaluation.supervisor_score} / 20` : '—'}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center py-2 mb-3">
                      <span className="extra-small fw-bold text-muted">Jury</span>
                      <span className="small fw-bold text-success">
                        {evaluation.jury_score != null ? `${evaluation.jury_score} / 20` : '—'}
                      </span>
                    </div>
                    {finalScore !== null && (
                      <div className={`p-3 rounded-3 text-center ${passed ? 'bg-success-soft' : 'bg-danger-soft'}`}>
                        <div className={`fw-bold fs-5 ${passed ? 'text-success' : 'text-danger'}`}>
                          {finalScore.toFixed(2)} / 20
                        </div>
                        <Badge bg={passed ? 'success' : 'danger'} className="mt-1 px-3 rounded-pill">
                          {passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                    )}
                  </>
                ) : evaluation ? (
                  <div className="p-3 rounded-3 bg-warning-soft text-center">
                    <Clock size={20} className="text-warning mb-2" />
                    <div className="small fw-bold text-warning mb-2">In progress</div>
                    <div className="extra-small text-muted">
                      <div className="mb-1">{evaluation.supervisor_scored ? '✔ Supervisor scored' : '○ Supervisor pending'}</div>
                      <div>{evaluation.jury_scored ? '✔ Jury scored' : '○ Jury pending'}</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-3 bg-surface-alt text-center extra-small text-muted fw-bold opacity-60">
                    No evaluation assigned yet.
                  </div>
                )}
              </div>

              {/* Defense Date */}
              {defenseAppt ? (
                <div className="p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #1972d2, #1e40af)', color: '#fff' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <Star size={15} className="opacity-75" />
                      <span className="fw-bold small">Defense Date</span>
                    </div>
                    <Calendar size={15} className="opacity-75" />
                  </div>
                  <div className="fw-bold mb-1">{defenseAppt.title}</div>
                  <div className="small opacity-90 mb-1">
                    {new Date(defenseAppt.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <div className="extra-small opacity-75 d-flex align-items-center gap-2 mb-3">
                    <Clock size={11} /> {defenseAppt.time || '--:--'}
                    {defenseAppt.location && <><MapPin size={11} /> {defenseAppt.location}</>}
                  </div>
                  {juries.length > 0 && (
                    <div className="p-2 rounded-3 mb-3" style={{ background: 'rgba(255,255,255,0.15)' }}>
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
                  <Button variant="light" size="sm" className="w-100 rounded-pill fw-bold extra-small border-0"
                    onClick={() => navigate('/student/schedule')} style={{ color: '#1972d2' }}>
                    View Full Schedule
                  </Button>
                </div>
              ) : (
                <div className="glass-card p-4 rounded-4 shadow-sm text-center">
                  <SectionTitle icon={Star} title="Defense Date" color="warning" />
                  <Calendar size={28} className="text-muted opacity-30 mb-2" />
                  <div className="extra-small fw-bold text-muted mb-3">No defense scheduled yet.</div>
                  <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold extra-small"
                    onClick={() => navigate('/student/schedule')}>
                    View Schedule
                  </Button>
                </div>
              )}

              {/* Supervisor */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <SectionTitle icon={Users} title="Academic Supervisor" color="info" />
                {currentProject?.supervisor ? (
                  <>
                    <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-3 bg-info-soft">
                      <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                        {(currentProject.supervisor.name || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold small text-navy">{currentProject.supervisor.name}</div>
                        <div className="extra-small text-muted">{currentProject.supervisor.email}</div>
                      </div>
                    </div>
                    <Button variant="outline-primary" size="sm"
                      className="w-100 d-flex align-items-center justify-content-center gap-2 rounded-pill fw-bold"
                      onClick={() => navigate('/student/messages')}>
                      <Mail size={13} /> Send Message
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-3">
                    <div className="extra-small text-muted fw-bold opacity-50">No supervisor assigned yet.</div>
                  </div>
                )}
              </div>

              {/* Recent Feedback */}
              {feedbacks.length > 0 && (
                <div className="glass-card p-4 rounded-4 shadow-sm">
                  <SectionTitle icon={MessageSquare} title="Recent Feedback" color="primary"
                    right={<span className="extra-small text-muted fw-bold">{feedbacks.length} total</span>}
                  />
                  <div className="d-flex flex-column gap-2">
                    {feedbacks.slice(0, 2).map((f: any) => (
                      <div key={f.id} className="p-3 rounded-3 bg-surface-alt border-start border-primary border-3">
                        <div className="small fw-bold text-navy mb-1">{f.title}</div>
                        <p className="extra-small text-muted mb-1 lh-base">
                          "{f.comment?.length > 90 ? `${f.comment.substring(0, 90)}…` : f.comment}"
                        </p>
                        <div className="extra-small text-primary fw-bold">{f.author_name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle p-3 d-inline-block mb-3">
            <Trash2 size={26} />
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
