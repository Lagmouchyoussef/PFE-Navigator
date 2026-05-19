import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Badge, Button, Table,
  Form, InputGroup, Modal, Dropdown,
} from 'react-bootstrap';
import {
  Users, Briefcase, Plus, Search,
  Database, Download, Edit, Trash2,
  Clock, Trash, FileText, FileSpreadsheet, File, ShieldAlert,
  Calendar, Activity, ChevronRight, MapPin,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, deleteAppointment, projects, allUsers, deleteUser } = useApp() as any;

  const users: any[]    = allUsers   || [];
  const projs: any[]    = projects   || [];
  const appts: any[]    = appointments || [];

  const [visibleCount,    setVisibleCount]    = React.useState(5);
  const [searchQuery,     setSearchQuery]     = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmConfig, setConfirmConfig]     = React.useState({ title: '', message: '', action: '', user: null as any });

  const SUBMISSION_DATA = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);
    projs.forEach((p: any) => {
      if (!p) return;
      const d = new Date(p.created_at || '');
      if (!isNaN(d.getTime())) counts[d.getMonth()]++;
    });
    return months.map((m, i) => ({ name: m, count: counts[i] }));
  }, [projs]);

  const STATUS_DATA = React.useMemo(() => {
    const map: Record<string, number> = {};
    projs.forEach((p: any) => { if (!p) return; const s = p.status || 'pending'; map[s] = (map[s] || 0) + 1; });
    const colors = ['#1972d2', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [projs]);

  const today       = new Date();
  const upcoming    = appts
    .filter((a: any) => a?.date && new Date(a.date) >= today && a.status !== 'cancelled')
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filteredUsers = searchQuery.trim()
    ? users.filter((u: any) =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase()))
    : users;

  const generateReport = (format: 'pdf' | 'csv' | 'word') => {
    const rows = [
      ['Statistic', 'Value'],
      ['Total Users', users.length.toString()],
      ['Total Projects', projs.length.toString()],
      ['Active Projects', projs.filter((p: any) => p.status === 'in_progress').length.toString()],
      ['Completed Projects', projs.filter((p: any) => p.status === 'completed').length.toString()],
      ['Last Update', new Date().toLocaleDateString()],
    ];
    if (format === 'csv') {
      const csv = 'data:text/csv;charset=utf-8,' + rows.map(r => r.join(',')).join('\n');
      const a = document.createElement('a'); a.href = encodeURI(csv); a.download = `report_${Date.now()}.csv`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a); return;
    }
    const tableRows = rows.map(r => `<tr><td style="padding:8px 16px;border:1px solid #e2e8f0;">${r[0]}</td><td style="padding:8px 16px;border:1px solid #e2e8f0;font-weight:700;">${r[1]}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html><head><title>Report</title></head><body style="font-family:Arial;padding:40px"><h1>Platform Report</h1><p style="color:#64748b">Generated ${new Date().toLocaleString()}</p><table style="border-collapse:collapse;width:100%"><thead><tr><th style="background:#0f172a;color:white;padding:10px 16px">Statistic</th><th style="background:#0f172a;color:white;padding:10px 16px">Value</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`;
    if (format === 'pdf') { const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); } return; }
    const blob = new Blob(['﻿', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `report_${Date.now()}.doc`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const handleAction = (action: string, user: any) => {
    if (action === 'edit') { navigate('/admin/users'); return; }
    setConfirmConfig({
      title: action === 'delete' ? 'Delete User' : 'System Action',
      message: action === 'delete'
        ? `Are you sure you want to delete "${user.name}"? This action is irreversible.`
        : `Confirm action "${action}" for "${user.name}"?`,
      action, user,
    });
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (confirmConfig.action === 'delete' && confirmConfig.user) await deleteUser(confirmConfig.user.id);
    setShowConfirmModal(false);
  };

  const stats = [
    { label: 'Total Users',     value: users.length,                                                     icon: Users,    color: 'primary', link: '/admin/users'        },
    { label: 'Active Projects', value: projs.filter((p: any) => p.status === 'in_progress').length,      icon: Briefcase,color: 'info',    link: '/admin/projects'     },
    { label: 'Pending',         value: projs.filter((p: any) => p.status === 'pending').length,          icon: Clock,    color: 'warning', link: '/admin/projects'     },
    { label: 'Total Projects',  value: projs.length,                                                     icon: Database, color: 'danger',  link: '/admin/projects'     },
  ];

  return (
    <div className="py-4">
      <Container fluid className="px-4">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}>
            <h4 className="fw-bold mb-1 text-navy">Admin Control Panel</h4>
            <p className="text-muted small mb-0">Platform overview and resource management.</p>
          </motion.div>
          <div className="d-flex gap-2 flex-wrap">
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" size="sm"
                className="rounded-pill fw-bold d-flex align-items-center gap-2 px-3 shadow-none">
                <Download size={15} /> Export Report
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg rounded-4 overflow-hidden mt-2 p-1">
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('pdf')}>
                  <div className="p-1 rounded bg-danger-soft text-danger"><FileText size={13} /></div> PDF
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('word')}>
                  <div className="p-1 rounded bg-primary-soft text-primary"><File size={13} /></div> Word
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('csv')}>
                  <div className="p-1 rounded bg-success-soft text-success"><FileSpreadsheet size={13} /></div> CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button size="sm" className="btn-premium d-flex align-items-center gap-2 px-3"
              onClick={() => navigate('/admin/users')}>
              <Plus size={15} /> New User
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

        {/* ── Charts Row ───────────────────────────────────────────────────────── */}
        <Row className="g-4 mb-4">

          {/* Submission Trends */}
          <Col lg={8}>
            <div className="glass-card p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="p-2 rounded-3 bg-primary-soft">
                  <Activity size={15} className="text-primary" />
                </div>
                <span className="fw-bold text-navy">Submission Trends</span>
                <span className="extra-small text-muted ms-1">— by month</span>
              </div>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={SUBMISSION_DATA}>
                    <defs>
                      <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="var(--color-primary)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false}
                      tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '10px', fontWeight: 600, fontSize: '12px' }} />
                    <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={3}
                      fillOpacity={1} fill="url(#adminGrad)" name="Projects" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>

          {/* Status Distribution */}
          <Col lg={4}>
            <div className="glass-card p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="p-2 rounded-3 bg-info-soft">
                  <Database size={15} className="text-info" />
                </div>
                <span className="fw-bold text-navy">Status Distribution</span>
              </div>

              {STATUS_DATA.length === 0 ? (
                <div className="py-5 text-center extra-small text-muted fw-bold opacity-50">No project data.</div>
              ) : (
                <>
                  <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={STATUS_DATA} innerRadius={50} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                          {STATUS_DATA.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid var(--color-border)', fontSize: '12px', fontWeight: 600 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="position-absolute text-center">
                      <div className="h4 fw-bold mb-0 text-navy">{projs.length}</div>
                      <div className="extra-small text-muted fw-bold">Total</div>
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2 mt-3 pt-3 border-top">
                    {STATUS_DATA.map((item, i) => (
                      <div key={i} className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2 extra-small fw-bold text-navy">
                          <div className="rounded-circle" style={{ width: '8px', height: '8px', background: item.color, flexShrink: 0 }} />
                          <span className="text-capitalize">{item.name.replace('_', ' ')}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="extra-small fw-bold text-navy">{item.value}</span>
                          <span className="extra-small text-muted">({Math.round((item.value / projs.length) * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Col>
        </Row>

        {/* ── Events & Appointments ────────────────────────────────────────────── */}
        <Row className="g-4 mb-4">
          <Col lg={12}>
            <div className="glass-card rounded-4 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3 bg-info-soft">
                    <Calendar size={15} className="text-info" />
                  </div>
                  <span className="fw-bold text-navy">Upcoming Events & Appointments</span>
                  <Badge bg="primary" pill className="extra-small">{upcoming.length}</Badge>
                </div>
                <Button variant="link" size="sm"
                  className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none d-flex align-items-center gap-1"
                  onClick={() => navigate('/admin/jury-planning')}>
                  Manage schedule <ChevronRight size={14} />
                </Button>
              </div>

              {upcoming.length === 0 ? (
                <div className="p-5 text-center">
                  <Calendar size={36} className="text-muted opacity-25 mb-2" />
                  <p className="extra-small fw-bold text-muted mb-0">No upcoming appointments.</p>
                </div>
              ) : (
                <Row className="g-0">
                  {upcoming.slice(0, visibleCount).map((appt: any, i: number) => {
                    const sc = appt.status === 'confirmed' ? 'success'
                      : appt.status === 'rescheduled'     ? 'info'
                      : appt.status === 'cancelled'       ? 'danger'
                      : 'warning';
                    return (
                      <Col key={appt.id} lg={4} md={6}>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`p-4 border-end border-bottom ${appt.status === 'cancelled' ? 'opacity-50' : ''}`}>
                          <div className="d-flex align-items-start gap-3">
                            <div className="text-center rounded-3 p-2 bg-info-soft flex-shrink-0" style={{ minWidth: '48px' }}>
                              <div className="fw-bold text-info" style={{ fontSize: '1.2rem', lineHeight: 1 }}>
                                {new Date(appt.date).getDate()}
                              </div>
                              <div className="extra-small text-muted fw-bold text-uppercase">
                                {new Date(appt.date).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                            </div>
                            <div className="flex-grow-1 overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between mb-1">
                                <span className="small fw-bold text-navy text-truncate">{appt.title}</span>
                                <Button variant="link" size="sm" className="p-0 text-danger border-0 shadow-none ms-2 flex-shrink-0"
                                  onClick={() => deleteAppointment(appt.id)}>
                                  <Trash size={12} />
                                </Button>
                              </div>
                              <div className="extra-small text-muted d-flex align-items-center gap-2 flex-wrap">
                                {appt.time && <span className="d-flex align-items-center gap-1"><Clock size={10} />{appt.time}</span>}
                                {appt.location && <span className="d-flex align-items-center gap-1"><MapPin size={10} />{appt.location}</span>}
                              </div>
                              <div className="extra-small text-muted mt-1">
                                {appt.student_name || appt.created_by_name || ''}
                                {appt.supervisor_name ? ` → ${appt.supervisor_name}` : ''}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Badge className={`bg-${sc}-soft text-${sc} extra-small px-2 py-1 rounded-pill fw-bold border-0 text-capitalize`}>
                              {appt.status}
                            </Badge>
                          </div>
                        </motion.div>
                      </Col>
                    );
                  })}
                </Row>
              )}

              {visibleCount < upcoming.length && (
                <div className="px-4 py-3 border-top text-center">
                  <Button variant="link" size="sm"
                    className="fw-bold text-primary text-decoration-none extra-small shadow-none border-0"
                    onClick={() => setVisibleCount(v => v + 6)}>
                    Load more ({upcoming.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* ── User Management Table ────────────────────────────────────────────── */}
        <div className="glass-card rounded-4 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <div className="d-flex align-items-center gap-2">
              <div className="p-2 rounded-3 bg-primary-soft">
                <Users size={15} className="text-primary" />
              </div>
              <div>
                <span className="fw-bold text-navy">User Management</span>
                <span className="extra-small text-muted ms-2">({filteredUsers.length} users)</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <InputGroup size="sm" style={{ width: '220px' }}>
                <InputGroup.Text className="bg-surface border-end-0 text-muted">
                  <Search size={14} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search users…"
                  className="bg-surface border-start-0 shadow-none extra-small fw-bold text-navy"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Button size="sm" variant="outline-primary" className="rounded-pill fw-bold extra-small px-3 d-flex align-items-center gap-1"
                onClick={() => navigate('/admin/users')}>
                <Plus size={13} /> Add
              </Button>
            </div>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead>
                <tr className="bg-surface-alt">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0">User</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Email</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Role</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase border-0">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase border-0 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-5">
                      <Users size={36} className="text-muted opacity-25 mb-2" />
                      <p className="extra-small fw-bold text-muted mb-0">
                        {searchQuery ? 'No users match your search.' : 'No users registered yet.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u: any) => {
                    const rc = u.role === 'admin' ? 'danger' : u.role === 'supervisor' ? 'info' : u.role === 'jury' ? 'warning' : 'primary';
                    return (
                      <tr key={u.id} className="border-bottom">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            {u.avatar
                              ? <img src={u.avatar} alt={u.name} className="rounded-circle flex-shrink-0"
                                  style={{ width: '36px', height: '36px', objectFit: 'cover' }} />
                              : <div className={`bg-${rc}-soft text-${rc} rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0`}
                                  style={{ width: '36px', height: '36px', fontSize: '14px' }}>
                                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                            }
                            <span className="small fw-bold text-navy">{u.name}</span>
                          </div>
                        </td>
                        <td className="small text-muted fw-bold">{u.email}</td>
                        <td>
                          <Badge className={`bg-${rc}-soft text-${rc} extra-small px-2 py-1 rounded-pill fw-bold text-capitalize border-0`}>
                            {u.role}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-success" style={{ width: '8px', height: '8px' }} />
                            <span className="extra-small fw-bold text-muted">Active</span>
                          </div>
                        </td>
                        <td className="px-4 text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button variant="outline-secondary" size="sm"
                              className="rounded-3 p-1 d-flex align-items-center"
                              onClick={() => handleAction('edit', u)}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="outline-danger" size="sm"
                              className="rounded-3 p-1 d-flex align-items-center"
                              onClick={() => handleAction('delete', u)}>
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>

      </Container>

      {/* Delete / Action Confirm Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div className={`rounded-circle p-3 d-inline-block mb-3 ${confirmConfig.action === 'delete' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'}`}>
            {confirmConfig.action === 'delete' ? <Trash2 size={32} /> : <ShieldAlert size={32} />}
          </div>
          <h6 className="fw-bold text-navy mb-2">{confirmConfig.title}</h6>
          <p className="text-muted extra-small mb-4">{confirmConfig.message}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-secondary" size="sm" className="px-4 rounded-pill fw-bold"
              onClick={() => setShowConfirmModal(false)}>Cancel</Button>
            <Button variant={confirmConfig.action === 'delete' ? 'danger' : 'primary'} size="sm"
              className="px-4 rounded-pill fw-bold"
              onClick={handleConfirm}>
              {confirmConfig.action === 'delete' ? 'Delete' : 'Confirm'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
