import React from 'react';
import { Container, Row, Col, Button, Badge, Table } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle, Clock,
  TrendingUp, FileText, MessageSquare, Plus,
  ChevronRight, Activity, Target,
  MapPin, GraduationCap,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const STATUS_COLOR: Record<string, string> = {
  completed: 'success', in_progress: 'primary', approved: 'success',
  submitted: 'info', draft: 'secondary', pending: 'warning', rejected: 'danger',
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });

const SupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, projects, appointments } = useApp() as any;

  const projs: any[] = Array.isArray(projects)    ? projects    : [];
  const appts: any[] = Array.isArray(appointments) ? appointments : [];

  const inProgress  = projs.filter((p: any) => p?.status === 'in_progress').length;
  const completed   = projs.filter((p: any) => p?.status === 'completed').length;
  const today       = new Date();
  const upcoming    = appts
    .filter((a: any) => a?.date && new Date(a.date) >= today && a.status !== 'Cancelled')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pieData = [
    { name: 'In Progress', value: projs.filter((p: any) => p?.status === 'in_progress').length,  color: 'var(--color-primary)' },
    { name: 'Completed',   value: projs.filter((p: any) => p?.status === 'completed').length,     color: 'var(--color-success)' },
    { name: 'Submitted',   value: projs.filter((p: any) => p?.status === 'submitted').length,     color: 'var(--color-info)'    },
    { name: 'Draft',       value: projs.filter((p: any) => p?.status === 'draft').length,         color: 'var(--color-text-muted)' },
    { name: 'Pending',     value: projs.filter((p: any) => p?.status === 'pending').length,       color: 'var(--color-warning)' },
  ].filter(d => d.value > 0);

  const stats = [
    { label: 'Total Projects', value: projs.length, icon: Users,       color: 'primary', link: '/supervisor/students'  },
    { label: 'In Progress',    value: inProgress,   icon: TrendingUp,  color: 'success', link: '/supervisor/students'  },
    { label: 'Appointments',   value: upcoming.length, icon: Calendar, color: 'info',    link: '/supervisor/schedule'  },
    { label: 'Completed',      value: completed,    icon: CheckCircle, color: 'warning', link: '/supervisor/students'  },
  ];

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="fw-bold mb-1 text-navy">Supervisor Dashboard</h4>
            <p className="text-muted small mb-0">
              Academic Year {(() => { const n = new Date(); const y = n.getFullYear(); return n.getMonth() >= 8 ? `${y}/${y+1}` : `${y-1}/${y}`; })()}
              {user?.name ? ` · Prof. ${user.name}` : ''}
            </p>
          </motion.div>
          <div className="d-flex gap-2 flex-wrap">
            <Button variant="outline-primary" size="sm" className="rounded-pill fw-bold d-flex align-items-center gap-2 px-3"
              onClick={() => navigate('/supervisor/schedule')}>
              <Calendar size={15} /> Planning
            </Button>
            <Button size="sm" className="btn-premium d-flex align-items-center gap-2 px-3"
              onClick={() => navigate('/supervisor/subjects')}>
              <Plus size={15} /> Propose Subject
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
                    <ChevronRight size={14} className="text-muted opacity-40 mt-1" />
                  </div>
                  <div className={`fs-3 fw-bold text-${s.color} mb-1`}>{s.value}</div>
                  <div className="small fw-bold text-muted">{s.label}</div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* ── Main Content ─────────────────────────────────────────────────────── */}
        <Row className="g-4">

          {/* ════════ Left Column (8) ════════ */}
          <Col lg={8}>

            {/* Students / Projects Table */}
            <div className="glass-card rounded-4 shadow-sm mb-4 overflow-hidden">
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-primary-soft">
                    <Users size={15} className="text-primary" />
                  </div>
                  <span className="fw-bold text-navy">Supervised Students</span>
                </div>
                <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/supervisor/students')}>
                  View all <ChevronRight size={14} />
                </Button>
              </div>

              {projs.length === 0 ? (
                <div className="p-5 text-center">
                  <Users size={40} className="text-muted opacity-25 mb-3" />
                  <p className="fw-bold text-muted mb-0">No supervised projects yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead>
                      <tr className="bg-surface-alt">
                        <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0">Student</th>
                        <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Project</th>
                        <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Status</th>
                        <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0 text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projs.map((proj: any) => {
                        if (!proj) return null;
                        const c = STATUS_COLOR[proj.status] || 'secondary';
                        return (
                          <tr key={proj.id} className="border-bottom">
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                                  style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                                  {proj.student?.name?.charAt(0)?.toUpperCase() || 'S'}
                                </div>
                                <div>
                                  <div className="small fw-bold text-navy">{proj.student?.name || 'Student'}</div>
                                  <div className="extra-small text-muted">PFE Candidate</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ maxWidth: '200px' }}>
                              <div className="extra-small fw-bold text-navy text-wrap lh-base">{proj.title}</div>
                            </td>
                            <td>
                              <Badge className={`bg-${c}-soft text-${c} extra-small px-2 py-1 rounded-pill fw-bold text-capitalize border-0`}>
                                {(proj.status || 'pending').replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <Button variant="outline-primary" size="sm"
                                  className="rounded-pill extra-small fw-bold px-2 py-1 d-flex align-items-center gap-1"
                                  onClick={() => navigate('/supervisor/students')}>
                                  <FileText size={11} /> View
                                </Button>
                                <Button variant="outline-secondary" size="sm"
                                  className="rounded-pill extra-small fw-bold px-2 py-1 d-flex align-items-center gap-1"
                                  onClick={() => navigate('/supervisor/messages')}>
                                  <MessageSquare size={11} /> Message
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="glass-card rounded-4 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-info-soft">
                    <Calendar size={15} className="text-info" />
                  </div>
                  <span className="fw-bold text-navy">Upcoming Appointments</span>
                </div>
                <Button variant="link" size="sm" className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/supervisor/schedule')}>
                  Full schedule <ChevronRight size={14} />
                </Button>
              </div>
              {upcoming.length === 0 ? (
                <div className="p-5 text-center">
                  <Calendar size={36} className="text-muted opacity-25 mb-2" />
                  <p className="extra-small fw-bold text-muted mb-0">No upcoming appointments.</p>
                </div>
              ) : (
                <div>
                  {upcoming.slice(0, 4).map((a: any, i: number) => (
                    <div key={a.id} className={`px-4 py-3 d-flex align-items-center gap-4 ${i < upcoming.length - 1 ? 'border-bottom' : ''} hover-bg-surface-alt`}>
                      <div className="text-center rounded-3 p-2 bg-info-soft flex-shrink-0" style={{ minWidth: '52px' }}>
                        <div className="fw-bold text-info" style={{ fontSize: '1.3rem', lineHeight: 1 }}>
                          {new Date(a.date).getDate()}
                        </div>
                        <div className="extra-small text-muted fw-bold text-uppercase">
                          {new Date(a.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-navy">{a.title}</div>
                        <div className="extra-small text-muted d-flex align-items-center gap-3 flex-wrap mt-1">
                          {a.time && <span className="d-flex align-items-center gap-1"><Clock size={10} />{a.time}</span>}
                          {a.location && <span className="d-flex align-items-center gap-1"><MapPin size={10} />{a.location}</span>}
                        </div>
                      </div>
                      {a.type && (
                        <Badge bg={a.type?.toLowerCase() === 'defense' ? 'danger' : 'info'}
                          className="extra-small text-capitalize rounded-pill px-2 flex-shrink-0">
                          {a.type}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* ════════ Right Column (4) ════════ */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">

              {/* Project Status Donut */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-primary-soft">
                    <Activity size={15} className="text-primary" />
                  </div>
                  <span className="fw-bold text-navy">Project Status</span>
                </div>

                {projs.length === 0 ? (
                  <div className="py-4 text-center extra-small text-muted fw-bold opacity-50">No projects yet.</div>
                ) : (
                  <>
                    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} innerRadius={52} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                            {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                          </Pie>
                          <Tooltip
                            contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 600 }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="position-absolute text-center">
                        <div className="h4 fw-bold mb-0 text-primary">{projs.length}</div>
                        <div className="extra-small text-muted fw-bold">Total</div>
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2 mt-3 pt-3 border-top">
                      {pieData.map((item, i) => (
                        <div key={i} className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center gap-2 extra-small fw-bold text-navy">
                            <div className="rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px', background: item.color }} />
                            {item.name}
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="extra-small fw-bold text-navy">{item.value}</span>
                            <span className="extra-small text-muted">
                              ({Math.round((item.value / projs.length) * 100)}%)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Next Defense */}
              {(() => {
                const defense = upcoming.find((a: any) => a.type?.toLowerCase() === 'defense');
                return defense ? (
                  <div className="p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #1972d2, #1e40af)', color: '#fff' }}>
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <GraduationCap size={15} className="opacity-75" />
                      <span className="fw-bold small">Upcoming Defense</span>
                    </div>
                    <div className="fw-bold mb-1">{defense.title}</div>
                    <div className="small opacity-90 mb-1">{formatDate(defense.date)}</div>
                    <div className="extra-small opacity-75 d-flex align-items-center gap-2">
                      {defense.time && <span className="d-flex align-items-center gap-1"><Clock size={10} />{defense.time}</span>}
                      {defense.location && <span className="d-flex align-items-center gap-1"><MapPin size={10} />{defense.location}</span>}
                    </div>
                    <Button variant="light" size="sm" className="w-100 rounded-pill fw-bold extra-small mt-3 border-0"
                      onClick={() => navigate('/supervisor/schedule')} style={{ color: '#1972d2' }}>
                      View Schedule
                    </Button>
                  </div>
                ) : null;
              })()}

              {/* Progress Overview */}
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <div className="p-2 rounded-3 bg-success-soft">
                    <Target size={15} className="text-success" />
                  </div>
                  <span className="fw-bold text-navy">Progress Overview</span>
                </div>
                <div className="d-flex flex-column gap-3">
                  {[
                    { label: 'Completed',   value: completed,  total: projs.length, color: 'success', bg: '#d1fae5', fg: '#059669' },
                    { label: 'In Progress', value: inProgress, total: projs.length, color: 'primary', bg: '#dbeafe', fg: '#1972d2' },
                    {
                      label: 'Pending',
                      value: projs.filter((p: any) => p?.status === 'pending' || p?.status === 'draft').length,
                      total: projs.length,
                      color: 'warning', bg: '#fef9c3', fg: '#ca8a04',
                    },
                  ].map((item, i) => {
                    const pct = projs.length > 0 ? Math.round((item.value / item.total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="d-flex align-items-center gap-2">
                            <span className="extra-small fw-bold" style={{ color: item.fg, minWidth: '80px' }}>{item.label}</span>
                            <span className="fw-bold small text-navy">{item.value}</span>
                          </div>
                          <span className="extra-small fw-bold" style={{ color: item.fg }}>{pct}%</span>
                        </div>
                        <div className="rounded-pill overflow-hidden" style={{ height: '10px', background: item.bg }}>
                          <div className="h-100 rounded-pill" style={{ width: `${pct}%`, background: item.fg, transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SupervisorDashboard;
