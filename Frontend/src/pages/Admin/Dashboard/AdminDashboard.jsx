import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Table, 
  Form, InputGroup, Dropdown, Nav, Navbar, ProgressBar,
  Pagination
} from 'react-bootstrap';
import { 
  Users, Briefcase, Calendar, Shield, Activity, Plus, Search, 
  Bell, Settings, Archive, BarChart3, Database, History,
  Filter, Download, MoreVertical, Edit, Trash2, Lock,
  RefreshCw, MapPin, CheckCircle, Clock, AlertCircle,
  FileText, ExternalLink, Mail, UserCheck, UserX,
  Eye, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, LineChart, Line,
  ComposedChart
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '../../../context/AppContext.jsx';

// --- Mock Data ---
const USER_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@emsi.ma', role: 'Student', status: 'Active', lastLogin: '2026-04-29 10:30' },
  { id: 2, name: 'Dr. Robert Smith', email: 'r.smith@emsi.ma', role: 'Supervisor', status: 'Active', lastLogin: '2026-04-29 09:15' },
  { id: 3, name: 'Jean Dupont', email: 'j.dupont@jury.fr', role: 'Jury', status: 'Active', lastLogin: '2026-04-28 16:45' },
  { id: 4, name: 'Admin Sarah', email: 'admin@emsi.ma', role: 'Admin', status: 'Active', lastLogin: '2026-04-29 08:00' },
  { id: 5, name: 'Kevin Lee', email: 'k.lee@emsi.ma', role: 'Student', status: 'Pending', lastLogin: 'N/A' },
  { id: 6, name: 'Marc Vales', email: 'm.vales@emsi.ma', role: 'Student', status: 'Suspended', lastLogin: '2026-04-20 11:20' },
];

const SUBMISSION_DATA = [
  { name: 'Jan', count: 45 },
  { name: 'Feb', count: 52 },
  { name: 'Mar', count: 85 },
  { name: 'Apr', count: 120 },
  { name: 'May', count: 98 },
];

const STATUS_DATA = [
  { name: 'Pending', value: 15, color: '#f39c12' },
  { name: 'Approved', value: 45, color: '#27ae60' },
  { name: 'In Progress', value: 25, color: '#3498db' },
  { name: 'Completed', value: 10, color: '#2c3e50' },
  { name: 'Archived', value: 5, color: '#95a5a6' },
];

const DEPARTMENT_DATA = [
  { dept: 'IT', perf: 88 },
  { dept: 'Civil', perf: 76 },
  { dept: 'Electrical', perf: 82 },
  { dept: 'Mechanical', perf: 79 },
  { dept: 'Management', perf: 91 },
];

const ARCHIVE_PROJECTS = [
  { title: 'AI-Driven Logistics', student: 'Alice Johnson', grade: '18.5/20', date: '2025-06-15', dept: 'IT' },
  { title: 'Smart Grid Optimization', student: 'Marc Vales', grade: '16.0/20', date: '2025-06-18', dept: 'Electrical' },
  { title: 'Bridge Structural Health', student: 'Kevin Lee', grade: '17.2/20', date: '2025-06-20', dept: 'Civil' },
];

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');

  const renderDashboard = () => (
    <div className="admin-content-fade">
      {/* Metrics Cards */}
      <Row className="g-4 mb-4">
        {[
          { label: 'Total Users', val: '1,248', icon: <Users />, color: 'var(--navy)', sub: '+12% from last month' },
          { label: 'Active Projects', val: '842', icon: <Briefcase />, color: 'var(--light-blue)', sub: '92.4% validation rate' },
          { label: 'Pending Actions', val: '24', icon: <Clock />, color: 'var(--warning-orange)', sub: 'Requires admin review' },
          { label: 'System Storage', val: '64.2%', icon: <Database />, color: 'var(--danger-red)', sub: '420GB of 1TB used' },
        ].map((stat, i) => (
          <Col key={i} xl={3} md={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 p-3 transition-hover">
              <div className="d-flex align-items-center gap-3">
                <div className="p-3 rounded-4 bg-light d-flex align-items-center justify-content-center" style={{ color: stat.color, background: `${stat.color}15` }}>
                  {React.cloneElement(stat.icon, { size: 24 })}
                </div>
                <div>
                  <h4 className="fw-bold mb-0">{stat.val}</h4>
                  <p className="extra-small text-muted fw-bold text-uppercase mb-0 tracking-wider">{stat.label}</p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-top">
                <span className="extra-small text-muted">{stat.sub}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        {/* User Management Table */}
        <Col xl={12}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white p-4 border-bottom d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">User Management</h5>
                <p className="extra-small text-muted mb-0">Manage global accounts and privileged access</p>
              </div>
              <div className="d-flex gap-2">
                <InputGroup size="sm" className="bg-light rounded-pill px-2 border">
                  <InputGroup.Text className="bg-transparent border-0 text-muted"><Search size={14}/></InputGroup.Text>
                  <Form.Control placeholder="Search users..." className="bg-transparent border-0 shadow-none extra-small" style={{ width: '200px' }} />
                </InputGroup>
                <Button variant="light" size="sm" className="rounded-pill border px-3 extra-small fw-bold">
                  <Filter size={14} className="me-1" /> Filter
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="rounded-pill px-3 extra-small fw-bold bg-navy border-0"
                  onClick={() => alert("Formulaire d'ajout d'utilisateur (Simulé)")}
                >
                  <Plus size={14} className="me-1" /> Add User
                </Button>
              </div>
            </Card.Header>
            <Table responsive hover className="mb-0 admin-table">
              <thead className="bg-light-soft">
                <tr>
                  <th className="ps-4"><Form.Check type="checkbox" /></th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {USER_DATA.map(user => (
                  <tr key={user.id}>
                    <td className="ps-4"><Form.Check type="checkbox" /></td>
                    <td><div className="small fw-bold text-navy">{user.name}</div></td>
                    <td><div className="extra-small text-muted">{user.email}</div></td>
                    <td>
                      <Badge className={`rounded-pill px-3 py-1 extra-small fw-bold bg-${user.role === 'Admin' ? 'navy' : 'primary'} bg-opacity-10 text-${user.role === 'Admin' ? 'navy' : 'primary'}`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1">
                        <div className={`dot bg-${user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'danger'}`}></div>
                        <span className="extra-small fw-bold">{user.status}</span>
                      </div>
                    </td>
                    <td><span className="extra-small text-muted">{user.lastLogin}</span></td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="link" className="p-1 text-navy hover-bg-light"><Edit size={16}/></Button>
                        <Button variant="link" className="p-1 text-warning hover-bg-light"><Lock size={16}/></Button>
                        <Button variant="link" className="p-1 text-danger hover-bg-light"><Trash2 size={16}/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Card.Footer className="bg-white p-3 border-top d-flex justify-content-between align-items-center">
              <div className="extra-small text-muted">Showing 1-6 of 1,248 results</div>
              <Pagination size="sm" className="mb-0">
                <Pagination.Prev disabled />
                <Pagination.Item active>{1}</Pagination.Item>
                <Pagination.Item>{2}</Pagination.Item>
                <Pagination.Item>{3}</Pagination.Item>
                <Pagination.Next />
              </Pagination>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Jury Planning Widget */}
        <Col lg={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Jury Planning Widget</h5>
              <div className="d-flex gap-2">
                <Button variant="light" size="sm" className="rounded-3 border extra-small fw-bold">Conflict Check</Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="rounded-3 extra-small fw-bold bg-light-blue border-0"
                  onClick={() => alert("Interface de planification ouverte.")}
                >
                  Schedule Defense
                </Button>
              </div>
            </div>
            <div className="jury-planning-container bg-light rounded-4 p-3 mb-3">
              <div className="d-flex justify-content-between mb-3 px-2">
                <span className="fw-bold small">June 2026</span>
                <div className="d-flex gap-2">
                  <Button variant="white" size="sm" className="p-1 border"><ChevronRight size={14} style={{ transform: 'rotate(180deg)' }}/></Button>
                  <Button variant="white" size="sm" className="p-1 border"><ChevronRight size={14}/></Button>
                </div>
              </div>
              <Table borderless className="calendar-table mb-0 text-center">
                <thead>
                  <tr className="extra-small text-muted">
                    <th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th><th>SUN</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, r) => (
                    <tr key={r}>
                      {[...Array(7)].map((_, c) => {
                        const day = r * 7 + c + 1;
                        const hasEvent = day % 5 === 0;
                        return (
                          <td key={c} className="p-1">
                            <div className={`calendar-day p-2 rounded-3 small ${hasEvent ? 'bg-primary text-white shadow-sm' : 'hover-bg-white'}`}>
                              {day <= 30 ? day : ''}
                              {hasEvent && <div className="extra-small fw-normal mt-1 opacity-75">3 Def.</div>}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="assignment-matrix p-3 bg-light-soft rounded-4 border">
              <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Recent Assignments</h6>
              <div className="d-flex flex-column gap-2">
                <div className="p-2 bg-white rounded-3 shadow-xs d-flex justify-content-between align-items-center border-start border-4 border-primary">
                  <div className="extra-small fw-bold">Room A-202 | 09:00 - 11:00</div>
                  <Badge bg="light" text="dark" className="border extra-small">Jury: Dr. Smith + 2</Badge>
                </div>
                <div className="p-2 bg-white rounded-3 shadow-xs d-flex justify-content-between align-items-center border-start border-4 border-success-green">
                  <div className="extra-small fw-bold">Room B-105 | 14:00 - 16:00</div>
                  <Badge bg="light" text="dark" className="border extra-small">Jury: Prof. Vales + 1</Badge>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Analytics Section */}
        <Col lg={5}>
          <Card className="border-0 shadow-sm rounded-4 h-100 p-4">
            <h5 className="fw-bold mb-4">Analytics Center</h5>
            <div className="mb-4">
              <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Project Status Distribution</h6>
              <div style={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={STATUS_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {STATUS_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div>
              <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Submission Trends</h6>
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                  <AreaChart data={SUBMISSION_DATA}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--light-blue)" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="var(--light-blue)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="var(--light-blue)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="g-4 mb-4">
        {/* Project Archive Grid */}
        <Col xl={8}>
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-0">Projects Archive</h5>
                <p className="extra-small text-muted mb-0">Access and restore completed academic works</p>
              </div>
              <div className="d-flex gap-2">
                <Button variant="light" size="sm" className="rounded-3 border extra-small fw-bold">Batch Restore</Button>
                <Button variant="light" size="sm" className="rounded-3 border extra-small fw-bold text-danger">Permanent Clear</Button>
              </div>
            </div>
            <Row className="g-3">
              {ARCHIVE_PROJECTS.map((proj, i) => (
                <Col md={4} key={i}>
                  <div className="project-card-v2 p-3 rounded-4 bg-light border transition-hover h-100">
                    <div className="d-flex justify-content-between mb-2">
                      <Badge bg="white" text="dark" className="border extra-small fw-bold">{proj.dept}</Badge>
                      <span className="extra-small text-muted">{proj.date}</span>
                    </div>
                    <h6 className="fw-bold small mb-1 line-clamp-1">{proj.title}</h6>
                    <p className="extra-small text-muted mb-3">{proj.student}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-black text-navy small">{proj.grade}</span>
                      <div className="d-flex gap-1">
                        <Button variant="white" size="sm" className="p-1 border rounded-circle"><Eye size={12}/></Button>
                        <Button variant="white" size="sm" className="p-1 border rounded-circle"><RefreshCw size={12}/></Button>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* System Health */}
        <Col xl={4}>
          <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">System Health & Logs</h5>
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="extra-small fw-bold">Server Status</span>
                <Badge bg="success-green" className="bg-success bg-opacity-10 text-success rounded-pill px-2 py-1 extra-small">Operational</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="extra-small fw-bold">DB Sync</span>
                <span className="extra-small text-muted">Last sync 2m ago</span>
              </div>
              <ProgressBar now={98} variant="success" style={{ height: '6px' }} className="rounded-pill" />
            </div>
            <div className="audit-logs">
              <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Recent Audit Trail</h6>
              <div className="d-flex flex-column gap-3">
                {[
                  { action: 'User Suspended', user: 'Admin Sarah', time: '10m ago' },
                  { action: 'Jury Session Modified', user: 'Admin Sarah', time: '1h ago' },
                  { action: 'DB Backup Completed', user: 'System', time: '2h ago' },
                ].map((log, i) => (
                  <div key={i} className="d-flex align-items-start gap-3 pb-2 border-bottom border-light">
                    <div className={`p-2 rounded-circle bg-${log.user === 'System' ? 'info' : 'warning'} bg-opacity-10 text-${log.user === 'System' ? 'info' : 'warning'}`}>
                      <History size={14} />
                    </div>
                    <div>
                      <div className="extra-small fw-bold text-navy">{log.action}</div>
                      <div className="extra-small text-muted">by {log.user} • {log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="admin-shell d-flex min-vh-100 bg-light">
      {/* Sidebar (Mocked for layout) */}
      <div className="admin-sidebar bg-navy text-white p-4 d-none d-lg-block" style={{ width: '280px', flexShrink: 0 }}>
        <div className="d-flex align-items-center gap-2 mb-5 px-2">
          <div className="bg-light-blue rounded-3 p-2"><Shield size={24} /></div>
          <h4 className="fw-black mb-0 tracking-tighter">PFE Portal</h4>
        </div>
        <Nav className="flex-column gap-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <Activity /> },
            { id: 'users', label: 'User Management', icon: <Users /> },
            { id: 'jury', label: 'Jury Planning', icon: <Calendar /> },
            { id: 'archive', label: 'Projects Archive', icon: <Archive /> },
            { id: 'analytics', label: 'Analytics Center', icon: <BarChart3 /> },
            { id: 'settings', label: 'System Settings', icon: <Settings /> },
            { id: 'logs', label: 'Audit Logs', icon: <History /> },
          ].map(item => (
            <Nav.Link 
              key={item.id}
              active={activeView === item.id}
              onClick={() => setActiveView(item.id)}
              className={`d-flex align-items-center gap-3 px-3 py-3 rounded-4 transition-all ${activeView === item.id ? 'bg-light-blue text-white shadow-lg' : 'text-white-50 hover-bg-white-10'}`}
            >
              {React.cloneElement(item.icon, { size: 18 })}
              <span className="small fw-bold">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </div>

      <div className="flex-grow-1 overflow-hidden d-flex flex-column">
        {/* Header */}
        <Navbar className="bg-white border-bottom py-3 px-4 sticky-top">
          <Container fluid className="px-0 d-flex justify-content-between">
            <div className="d-flex align-items-center gap-4">
              <div className="d-lg-none me-2"><MoreVertical /></div>
              <InputGroup className="bg-light rounded-pill border-0 px-3 py-1" style={{ width: '350px' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-1"><Search size={18}/></InputGroup.Text>
                <Form.Control placeholder="Global search..." className="bg-transparent border-0 shadow-none small" />
              </InputGroup>
            </div>
            <div className="d-flex align-items-center gap-3">
              <Button variant="link" className="text-muted position-relative p-2">
                <Bell size={20} />
                <Badge bg="danger" className="position-absolute top-0 start-50 translate-middle rounded-circle p-1 border border-2 border-white" style={{ fontSize: '8px' }}> </Badge>
              </Button>
              <div className="d-flex align-items-center gap-2 ps-3 border-start">
                <div className="text-end d-none d-md-block">
                  <div className="small fw-bold text-navy">Admin Sarah</div>
                  <div className="extra-small text-muted">System Coordinator</div>
                </div>
                <div className="avatar-circle-sm bg-navy text-white fw-bold">S</div>
              </div>
              <Button variant="primary" size="sm" className="rounded-pill px-4 fw-bold bg-light-blue border-0 shadow-sm d-none d-md-block">
                Quick Action
              </Button>
            </div>
          </Container>
        </Navbar>

        {/* Main Content */}
        <div className="p-4 p-xl-5 overflow-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <Badge className="bg-light-blue bg-opacity-10 text-light-blue mb-2 px-3 py-2 rounded-pill fw-bold extra-small">
                SESSION ACTIVE: 2025/2026
              </Badge>
              <h2 className="fw-black text-navy display-6 tracking-tighter mb-0">Administration <span className="text-light-blue">Control Panel</span></h2>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="white" 
                className="border rounded-pill px-4 fw-bold extra-small shadow-sm"
                onClick={() => alert("Génération du rapport global...")}
              >
                <Download size={14} className="me-2" /> Export Summary
              </Button>
              <Button 
                variant="primary" 
                className="bg-navy border-0 rounded-pill px-4 fw-bold extra-small shadow-lg"
                onClick={() => alert("Synchronisation des données avec le serveur...")}
              >
                <RefreshCw size={14} className="me-2" /> Sync Data
              </Button>
            </div>
          </div>

          {activeView === 'dashboard' ? renderDashboard() : (
            <div className="text-center py-5">
              <Card className="border-0 shadow-sm rounded-4 p-5">
                <Archive size={64} className="text-muted opacity-20 mb-3 mx-auto" />
                <h4 className="fw-bold">Module Under Construction</h4>
                <p className="text-muted small">This module is currently being optimized for high-performance administrative tasks.</p>
                <Button variant="primary" onClick={() => setActiveView('dashboard')} className="rounded-pill px-4 bg-navy border-0">Return to Overview</Button>
              </Card>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-shell { font-family: 'Inter', sans-serif; letter-spacing: -0.01em; }
        .bg-navy { background-color: #2c3e50 !important; }
        .bg-light-blue { background-color: #3498db !important; }
        .text-navy { color: #2c3e50 !important; }
        .text-light-blue { color: #3498db !important; }
        .bg-light-soft { background-color: #ecf0f1; }
        .bg-success-green { background-color: #27ae60 !important; }
        
        .transition-hover { transition: all 0.3s ease; }
        .transition-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.1) !important; }
        
        .admin-table thead th { 
          font-size: 0.75rem; 
          font-weight: 700; 
          text-transform: uppercase; 
          letter-spacing: 0.05em; 
          color: #7f8c8d; 
          padding: 1.25rem 1rem; 
          border-top: none;
        }
        .admin-table tbody td { padding: 1rem; vertical-align: middle; border-bottom: 1px solid #f8f9fa; }
        
        .dot { height: 8px; width: 8px; border-radius: 50%; display: inline-block; margin-right: 5px; }
        .dot.bg-success { background-color: #27ae60 !important; }
        .dot.bg-warning { background-color: #f39c12 !important; }
        .dot.bg-danger { background-color: #e74c3c !important; }
        
        .hover-bg-white-10:hover { background: rgba(255,255,255,0.1); }
        .calendar-day { cursor: pointer; transition: all 0.2s; min-height: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .hover-bg-white:hover { background: white; }
        
        .project-card-v2 { border: 1px solid #eee; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        
        .shadow-xs { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .border-success-green { border-color: #27ae60 !important; }
        
        .admin-content-fade { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

