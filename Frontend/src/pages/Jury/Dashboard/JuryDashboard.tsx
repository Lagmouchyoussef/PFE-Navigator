import React from 'react';
import { Container, Row, Col, Badge, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  Star, Calendar, GraduationCap, ArrowRightCircle, Briefcase,
  CheckCircle, Clock, MessageSquare, Activity, Bell, AlertCircle,
  MapPin, Target, Users,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const timeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1)    return 'Just now';
  if (diff < 60)   return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
};

const NOTIF_COLOR: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'info'> = {
  grade: 'warning', defense: 'primary', message: 'info', approved: 'success', rejected: 'danger',
};
const NOTIF_ICON: Record<string, React.ReactNode> = {
  grade:    <Clock size={14} />,
  defense:  <Calendar size={14} />,
  message:  <MessageSquare size={14} />,
  approved: <CheckCircle size={14} />,
  rejected: <AlertCircle size={14} />,
};

const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, notifications, evaluations, appointments } = useApp() as any;

  const evals: any[] = Array.isArray(evaluations)   ? evaluations   : [];
  const appts: any[] = Array.isArray(appointments)  ? appointments  : [];
  const notifs: any[] = Array.isArray(notifications) ? notifications : [];

  const evaluatedCount = evals.filter((e: any) => e?.jury_score !== null && e?.jury_score !== undefined).length;
  const pendingEvals   = evals.filter((e: any) => e?.jury_score === null || e?.jury_score === undefined);
  const avgGrade       = evaluatedCount > 0
    ? (evals.filter((e: any) => e?.jury_score != null)
        .reduce((acc: number, e: any) => acc + Number.parseFloat(e.jury_score), 0) / evaluatedCount)
    : null;

  const today       = new Date();
  const defenses    = appts
    .filter((a: any) => a?.type?.toLowerCase() === 'defense' && a?.status !== 'Cancelled')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcoming    = defenses.filter((a: any) => new Date(a.date) >= today);
  const totalDefenses = appts.filter((a: any) => a?.type?.toLowerCase() === 'defense').length;

  const pct = evals.length > 0 ? Math.round((evaluatedCount / evals.length) * 100) : 0;
  const donutData = [
    { value: pct,               color: 'var(--color-success)' },
    { value: Math.max(0, 100 - pct), color: 'var(--color-surface-alt)' },
  ];

  const recentNotifs = notifs.slice(0, 5);

  const stats = [
    { label: 'Assigned Projects', value: evals.length,       icon: Briefcase,    color: 'primary', link: '/jury/projects'    },
    { label: 'Evaluations Done',  value: evaluatedCount,     icon: CheckCircle,  color: 'success', link: '/jury/evaluation'  },
    { label: 'Defenses',          value: totalDefenses,      icon: Calendar,     color: 'warning', link: '/jury/schedule'    },
    {
      label: 'Avg Grade Given',
      value: avgGrade !== null ? `${avgGrade.toFixed(1)}/20` : '—',
      icon: Star, color: 'info', link: '/jury/evaluation',
    },
  ];

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="fw-bold mb-1 text-navy">Jury Dashboard</h4>
            <p className="text-muted small mb-0">
              Track your evaluations and defense schedule{user?.name ? ` — Prof. ${user.name}` : ''}.
            </p>
          </motion.div>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold d-flex align-items-center gap-2 px-3"
              onClick={() => navigate('/jury/schedule')}>
              <Calendar size={15} /> My Calendar
            </Button>
            <Button size="sm" className="btn-premium d-flex align-items-center gap-2 px-3"
              onClick={() => navigate('/jury/evaluation')}>
              <GraduationCap size={15} /> Evaluate Project
            </Button>
          </div>
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────────────────── */}
        <Row className="g-3 mb-5">
          {stats.map((s, i) => (
            <Col key={i} lg={3} sm={6}>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <div className="glass-card p-4 rounded-4 shadow-sm h-100"
                  style={{ cursor: 'pointer', borderLeft: `4px solid var(--color-${s.color})` }}
                  onClick={() => navigate(s.link)}>
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div className={`p-2 rounded-3 bg-${s.color}-soft`}>
                      <s.icon size={18} className={`text-${s.color}`} />
                    </div>
                  </div>
                  <div className={`fs-3 fw-bold text-${s.color} mb-1`}>{s.value}</div>
                  <div className="small fw-bold text-muted">{s.label}</div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* ── Main Layout ─────────────────────────────────────────────────────── */}
        <Row className="g-4">

          {/* ════════ Left (8) ════════ */}
          <Col lg={8}>

            {/* Pending Evaluations Table */}
            <div className="glass-card rounded-4 shadow-sm mb-4 overflow-hidden">
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-warning-soft">
                    <Target size={15} className="text-warning" />
                  </div>
                  <span className="fw-bold text-navy">Projects Pending Evaluation</span>
                  {pendingEvals.length > 0 && (
                    <Badge bg="warning" pill className="extra-small">{pendingEvals.length}</Badge>
                  )}
                </div>
                <Button variant="link" size="sm"
                  className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/jury/projects')}>
                  All projects <ArrowRightCircle size={14} />
                </Button>
              </div>

              {evals.length === 0 ? (
                <div className="p-5 text-center">
                  <Briefcase size={38} className="text-muted opacity-25 mb-3" />
                  <p className="fw-bold text-muted mb-0">No projects assigned yet.</p>
                </div>
              ) : pendingEvals.length === 0 ? (
                <div className="p-5 text-center">
                  <CheckCircle size={38} className="text-success opacity-50 mb-3" />
                  <p className="fw-bold text-success mb-0">All evaluations completed!</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead>
                      <tr className="bg-surface-alt">
                        <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0">Student</th>
                        <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Project</th>
                        <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Status</th>
                        <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0 text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingEvals.slice(0, 6).map((ev: any) => {
                        const proj = ev.project_detail || {};
                        const studentName  = proj.student?.name || 'Student';
                        const projectTitle = proj.title || `Project #${ev.project}`;
                        return (
                          <tr key={ev.id} className="border-bottom">
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                  style={{ width: '34px', height: '34px', fontSize: '13px' }}>
                                  {studentName.charAt(0).toUpperCase()}
                                </div>
                                <span className="small fw-bold text-navy">{studentName}</span>
                              </div>
                            </td>
                            <td style={{ maxWidth: '200px' }}>
                              <span className="extra-small fw-bold text-navy opacity-75 text-wrap">{projectTitle}</span>
                            </td>
                            <td>
                              <Badge className="bg-warning-soft text-warning extra-small px-2 py-1 rounded-pill fw-bold border-0">
                                Pending
                              </Badge>
                            </td>
                            <td className="px-4 text-end">
                              <Button variant="outline-primary" size="sm"
                                className="rounded-pill extra-small fw-bold px-3 d-inline-flex align-items-center gap-1"
                                onClick={() => navigate('/jury/evaluation')}>
                                Evaluate <ArrowRightCircle size={12} />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>

            {/* Upcoming Defenses */}
            <div className="glass-card rounded-4 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary-soft">
                    <Calendar size={15} className="text-primary" />
                  </div>
                  <span className="fw-bold text-navy">Upcoming Defenses</span>
                  {upcoming.length > 0 && (
                    <Badge bg="primary" pill className="extra-small">{upcoming.length}</Badge>
                  )}
                </div>
                <Button variant="link" size="sm"
                  className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/jury/schedule')}>
                  Full calendar <ArrowRightCircle size={14} />
                </Button>
              </div>

              {upcoming.length === 0 ? (
                <div className="p-5 text-center">
                  <Calendar size={36} className="text-muted opacity-25 mb-2" />
                  <p className="extra-small fw-bold text-muted mb-0">No upcoming defenses scheduled.</p>
                </div>
              ) : (
                <div>
                  {upcoming.slice(0, 4).map((a: any, i: number) => (
                    <div key={a.id}
                      className={`px-4 py-3 d-flex align-items-center gap-4 hover-bg-surface-alt ${i < upcoming.slice(0, 4).length - 1 ? 'border-bottom' : ''}`}>
                      <div className="text-center rounded-3 p-2 bg-primary-soft flex-shrink-0" style={{ minWidth: '52px' }}>
                        <div className="fw-bold text-primary" style={{ fontSize: '1.3rem', lineHeight: 1 }}>
                          {new Date(a.date).getDate()}
                        </div>
                        <div className="extra-small text-muted fw-bold text-uppercase">
                          {new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-navy">{a.title}</div>
                        <div className="extra-small text-muted d-flex align-items-center gap-3 flex-wrap mt-1">
                          {a.time     && <span className="d-flex align-items-center gap-1"><Clock    size={10} />{a.time}</span>}
                          {a.location && <span className="d-flex align-items-center gap-1"><MapPin   size={10} />{a.location}</span>}
                          {a.student_name && <span className="d-flex align-items-center gap-1"><Users size={10} />{a.student_name}</span>}
                        </div>
                      </div>
                      <Badge bg="primary" className="extra-small rounded-pill px-2 flex-shrink-0">Defense</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* ════════ Right (4) ════════ */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">

              {/* Evaluation Progress Donut */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-success-soft">
                    <Activity size={15} className="text-success" />
                  </div>
                  <span className="fw-bold text-navy">Evaluation Progress</span>
                </div>

                <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={donutData} innerRadius={50} outerRadius={66} paddingAngle={4} dataKey="value" stroke="none">
                        {donutData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 600 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="position-absolute text-center">
                    <div className="h4 fw-bold mb-0 text-success">{pct}%</div>
                    <div className="extra-small text-muted fw-bold">Done</div>
                  </div>
                </div>

                <Row className="g-2 text-center pt-3 border-top mt-2">
                  <Col>
                    <div className="fw-bold text-success">{evaluatedCount}</div>
                    <div className="extra-small text-muted">Evaluated</div>
                  </Col>
                  <Col>
                    <div className="fw-bold text-warning">{pendingEvals.length}</div>
                    <div className="extra-small text-muted">Pending</div>
                  </Col>
                  <Col>
                    <div className="fw-bold text-info">{avgGrade !== null ? avgGrade.toFixed(1) : '—'}</div>
                    <div className="extra-small text-muted">Avg /20</div>
                  </Col>
                </Row>
              </div>

              {/* Recent Notifications */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="p-2 rounded-3 bg-info-soft">
                      <Bell size={15} className="text-info" />
                    </div>
                    <span className="fw-bold text-navy">Recent Notifications</span>
                  </div>
                  <Button variant="link" size="sm"
                    className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none"
                    onClick={() => navigate('/jury/notifications')}>
                    All
                  </Button>
                </div>

                {recentNotifs.length === 0 ? (
                  <div className="py-4 text-center">
                    <Bell size={32} className="text-muted opacity-25 mb-2" />
                    <p className="extra-small fw-bold text-muted mb-0">No notifications yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {recentNotifs.map((n: any) => {
                      const c = NOTIF_COLOR[n.type] || 'primary';
                      const icon = NOTIF_ICON[n.type] || <Activity size={14} />;
                      return (
                        <div key={n.id}
                          className={`d-flex align-items-start gap-3 p-3 rounded-3 bg-${c}-soft border-start border-${c} border-2`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => navigate(n.link || '/jury/notifications')}>
                          <div className={`text-${c} flex-shrink-0 mt-1`}>{icon}</div>
                          <div className="overflow-hidden flex-grow-1">
                            <div className="extra-small fw-bold text-navy">{n.title || n.type}</div>
                            <div className="extra-small text-muted text-truncate">{n.message}</div>
                          </div>
                          <div className="extra-small text-muted flex-shrink-0">
                            {n.created_at ? timeAgo(n.created_at) : ''}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JuryDashboard;
