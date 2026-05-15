import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Badge, Button, Table, 
  Form, InputGroup
} from 'react-bootstrap';
import {
  Users, Briefcase, Plus, Search,
  Database, Download, Edit, Trash2,
  Clock, Trash, FileText, FileSpreadsheet, File, ShieldAlert
} from 'lucide-react';
import { Dropdown, Modal } from 'react-bootstrap';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const { appointments, deleteAppointment, projects, allUsers, deleteUser } = useApp();

  // Dynamic Charts Calculation
  const SUBMISSION_DATA = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const counts = new Array(12).fill(0);
    projects.forEach((p: any) => {
      const d = new Date(p.created_at || Date.now());
      counts[d.getMonth()]++;
    });
    return months.map((m, i) => ({ name: m, count: counts[i] }));
  }, [projects]);

  const STATUS_DATA = React.useMemo(() => {
    const statusMap: Record<string, number> = {};
    projects.forEach((p: any) => {
      const st = p.status || 'pending';
      statusMap[st] = (statusMap[st] || 0) + 1;
    });
    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];
    return Object.entries(statusMap).map(([name, value], i) => ({
      name, value, color: colors[i % colors.length]
    }));
  }, [projects]);

  const users = allUsers || [];
  const [visibleCount, setVisibleCount] = React.useState(5);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmConfig, setConfirmConfig] = React.useState({ title: '', message: '', action: '', user: null as any });

  const generateReport = (format: 'pdf' | 'csv' | 'word') => {
    const data = [
      ["Statistic", "Value"],
      ["Total Users", users.length.toString()],
      ["Total Projects", projects.length.toString()],
      ["Active Projects", projects.filter((p: any) => p.status === 'in_progress').length.toString()],
      ["Last Update", new Date().toLocaleDateString()]
    ];
    
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `global_report_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setConfirmConfig({
        title: 'Report Export',
        message: `Are you sure you want to generate the report in ${format.toUpperCase()} format?`,
        action: 'export',
        user: { name: format.toUpperCase() }
      });
      setShowConfirmModal(true);
    }
  };

  const handleAction = (action: string, user: any) => {
    if (action === 'edit') {
      navigate('/admin/users');
    } else {
      setConfirmConfig({
        title: action === 'delete' ? 'Deletion Confirmation' : 'System Action',
        message: action === 'delete' 
          ? `Are you sure you want to delete user "${user.name}"? This action is irreversible.`
          : `Do you confirm the action "${action}" for user "${user.name}"?`,
        action: action,
        user: user
      });
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = async () => {
    if (confirmConfig.action === 'delete' && confirmConfig.user) {
      await deleteUser(confirmConfig.user.id);
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Admin Control Panel</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Platform overview and resource management.</p>
          </div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 no-caret shadow-none"
              >
                <Download size={18} /> Global Report
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-lg rounded-4 overflow-hidden mt-2 p-1">
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('pdf')}>
                  <div className="p-1 rounded bg-danger-soft text-danger"><FileText size={14} /></div> Export to PDF
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('word')}>
                  <div className="p-1 rounded bg-primary-soft text-primary"><File size={14} /></div> Export to Word
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('csv')}>
                  <div className="p-1 rounded bg-success-soft text-success"><FileSpreadsheet size={14} /></div> Export to CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => navigate('/admin/users')}
            >
              <Plus size={18} /> New User
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Users" value={users.length.toString()} icon={<Users />} color="primary" trend="Global" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Active Projects" value={projects.filter((p: any) => p.status === 'in_progress').length.toString()} icon={<Briefcase />} color="info" trend="Live" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Pending Projects" value={projects.filter((p: any) => p.status === 'pending').length.toString()} icon={<Clock />} color="warning" trend="Action Required" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Total Projects" value={projects.length.toString()} icon={<Database />} color="danger" trend="All" />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Submission Trends</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={SUBMISSION_DATA}>
                    <defs>
                      <linearGradient id="adminColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#adminColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <span>Events & Meetings</span>
                  <Form.Control 
                    type="date" 
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none text-navy border-0"
                    style={{ maxWidth: '140px', cursor: 'pointer' }}
                  />
                </div>
                <Badge className="bg-primary-soft text-primary extra-small border-0 px-2 py-1 rounded-pill">{appointments.length}</Badge>
              </h5>
              <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '400px' }}>
                {appointments.slice(0, visibleCount).map((appt: any, i: number) => {
                  const statusColor = appt.status === 'confirmed' ? 'success'
                    : appt.status === 'rescheduled' ? 'info'
                    : appt.status === 'cancelled' ? 'danger'
                    : 'warning';
                  return (
                    <motion.div
                      key={appt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`p-3 rounded-3 border bg-surface-alt hover-bg-surface transition-all ${appt.status === 'cancelled' ? 'opacity-50' : ''}`}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <div className="small fw-bold text-navy">{appt.title}</div>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={`bg-${statusColor}-soft text-${statusColor} border-0 extra-small px-2 text-capitalize`}>
                            {appt.status}
                          </Badge>
                          <Button variant="link" className="p-0 text-danger border-0 shadow-none" onClick={() => deleteAppointment(appt.id)}>
                            <Trash size={12} />
                          </Button>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-3 extra-small text-muted fw-bold">
                        <span className="d-flex align-items-center gap-1"><Users size={12} /> {appt.student_name || appt.created_by_name || 'Student'}</span>
                        <span className="d-flex align-items-center gap-1"><Clock size={12} /> {appt.date} • {appt.time}</span>
                      </div>
                    </motion.div>
                  );
                })}
                {visibleCount < appointments.length && (
                  <Button 
                    variant="link" 
                    className="w-100 mt-2 extra-small fw-bold text-primary text-decoration-none border-0 shadow-none"
                    onClick={() => setVisibleCount(prev => prev + 5)}
                  >
                    Load More Events
                  </Button>
                )}
              </div>
              <Button variant="link" className="w-100 mt-2 extra-small fw-bold text-muted text-decoration-none border-0 shadow-none opacity-50">Manage full schedule</Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={4}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Status Distribution</h5>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={STATUS_DATA} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>

        {/* User Management Table */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <div>
              <h5 className="fw-bold mb-0 text-navy">User Management</h5>
              <p className="extra-small text-muted mb-0 fw-bold opacity-75">Manage global accounts and privileged access.</p>
            </div>
            <div className="d-flex gap-2">
              <InputGroup size="sm" className="glass-card rounded-pill border px-3" style={{ width: '250px', backgroundColor: 'var(--color-surface)' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                <Form.Control placeholder="Search..." className="bg-transparent border-0 shadow-none py-2 extra-small fw-bold text-navy" />
              </InputGroup>
            </div>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 custom-table-modern">
              <thead>
                <tr>
                  <th className="px-4">User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-5 opacity-50 fw-bold small">No users registered in the system</td></tr>
                ) : (
                  users.map((u: any) => {
                    const roleColor = u.role === 'admin' ? 'danger' : u.role === 'supervisor' ? 'info' : u.role === 'jury' ? 'warning' : 'primary';
                    return (
                      <tr key={u.id}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className={`avatar-sm bg-${roleColor}-soft text-${roleColor} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px' }}>
                              {u.name?.charAt(0) || '?'}
                            </div>
                            <div className="small fw-bold text-navy">{u.name}</div>
                          </div>
                        </td>
                        <td className="small text-muted fw-bold">{u.email}</td>
                        <td>
                          <Badge className={`bg-${roleColor}-soft text-${roleColor} border border-${roleColor} border-opacity-10 extra-small text-capitalize`}>
                            {u.role}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }} />
                            <span className="extra-small fw-bold text-muted">Active</span>
                          </div>
                        </td>
                        <td className="px-4 text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3" onClick={() => handleAction('edit', u)}><Edit size={16} /></Button>
                            <Button variant="link" className="p-2 text-danger hover-bg-surface rounded-3" onClick={() => handleAction('delete', u)}><Trash2 size={16} /></Button>
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

      {/* Confirmation Modal (La Carte demandée) */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered className="delete-modal-premium">
        <Modal.Body className="p-4 text-center">
          <div className={`${confirmConfig.action === 'delete' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'} rounded-circle p-3 d-inline-block mb-4 shadow-sm`}>
            {confirmConfig.action === 'delete' ? <Trash2 size={40} /> : <ShieldAlert size={40} />}
          </div>
          <h4 className="fw-bold text-navy mb-3">{confirmConfig.title}</h4>
          <p className="text-muted small mb-4 px-3">
            {confirmConfig.message}
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="outline-secondary" className="px-4 py-2 rounded-3 fw-bold border-2" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button 
              variant={confirmConfig.action === 'delete' ? 'danger' : 'primary'} 
              className="px-4 py-2 rounded-3 fw-bold shadow-sm" 
              onClick={handleConfirm}
            >
              {confirmConfig.action === 'delete' ? 'Delete' : 'Confirm'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
