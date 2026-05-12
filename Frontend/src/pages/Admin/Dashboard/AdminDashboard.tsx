import React from 'react';
import { 
  Container, Row, Col, Badge, Button, Table, 
  Form, InputGroup
} from 'react-bootstrap';
import { 
  Users, Briefcase, Plus, Search, 
  Database, Download, Edit, Trash2, Lock,
  Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../../../components/shared/StatCard';

const USER_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@emsi.ma', role: 'Student', status: 'Active', color: 'primary' },
  { id: 2, name: 'Dr. Robert Smith', email: 'r.smith@emsi.ma', role: 'Supervisor', status: 'Active', color: 'success' },
  { id: 3, name: 'Jean Dupont', email: 'j.dupont@jury.fr', role: 'Jury', status: 'Active', color: 'warning' },
  { id: 4, name: 'Admin Sarah', email: 'admin@emsi.ma', role: 'Admin', status: 'Active', color: 'info' },
];

const SUBMISSION_DATA = [
  { name: 'Jan', count: 45 }, { name: 'Feb', count: 52 }, { name: 'Mar', count: 85 }, { name: 'Apr', count: 120 }, { name: 'May', count: 98 },
];

const STATUS_DATA = [
  { name: 'En attente', value: 15, color: '#f59e0b' },
  { name: 'Approuvé', value: 45, color: '#10b981' },
  { name: 'En cours', value: 25, color: '#3b82f6' },
  { name: 'Terminé', value: 10, color: '#6366f1' },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Panneau de Contrôle Admin</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Vue d'ensemble de la plateforme et gestion des ressources.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Rapport Global
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2">
              <Plus size={18} /> Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Utilisateurs" value="1,248" icon={<Users />} color="primary" trend="+12%" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Projets Actifs" value="842" icon={<Briefcase />} color="info" trend="92%" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Actions en Attente" value="24" icon={<Clock />} color="warning" trend="Urgent" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Stockage Système" value="64.2%" icon={<Database />} color="danger" trend="420GB" />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Tendances de Soumission</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
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
          <Col lg={4}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Répartition des Statuts</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
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
              <h5 className="fw-bold mb-0 text-navy">Gestion des Utilisateurs</h5>
              <p className="extra-small text-muted mb-0 fw-bold opacity-75">Gérez les comptes globaux et les accès privilégiés.</p>
            </div>
            <div className="d-flex gap-2">
              <InputGroup size="sm" className="glass-card rounded-pill border px-3" style={{ width: '250px', backgroundColor: 'var(--color-surface)' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                <Form.Control placeholder="Rechercher..." className="bg-transparent border-0 shadow-none py-2 extra-small fw-bold text-navy" />
              </InputGroup>
            </div>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 custom-table-modern">
              <thead>
                <tr>
                  <th className="px-4">Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {USER_DATA.map((user, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`avatar-sm bg-${user.color}-soft text-${user.color} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="small fw-bold text-navy">{user.name}</div>
                      </div>
                    </td>
                    <td className="small text-muted fw-bold">{user.email}</td>
                    <td>
                      <Badge className={`bg-${user.color}-soft text-${user.color} border border-${user.color} border-opacity-10 extra-small`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <span className="extra-small fw-bold text-muted">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3"><Edit size={16}/></Button>
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3"><Lock size={16}/></Button>
                        <Button variant="link" className="p-2 text-danger hover-bg-surface rounded-3"><Trash2 size={16}/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminDashboard;
