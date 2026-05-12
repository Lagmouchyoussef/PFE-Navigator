import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Table, 
  Form, InputGroup, Dropdown, ProgressBar, Pagination
} from 'react-bootstrap';
import { 
  Users, Briefcase, Calendar, Shield, Activity, Plus, Search, 
  Bell, Settings, Archive, BarChart as BarChartIcon, Database, History,
  Filter, Download, MoreVertical, Edit, Trash2, Lock,
  RefreshCw, MapPin, CheckCircle, Clock, AlertCircle,
  FileText, ExternalLink, Mail, UserCheck, UserX,
  Eye, ChevronRight, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '../../../context/AppContext.jsx';

const USER_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@emsi.ma', role: 'Student', status: 'Active', lastLogin: '2026-04-29 10:30', color: 'primary' },
  { id: 2, name: 'Dr. Robert Smith', email: 'r.smith@emsi.ma', role: 'Supervisor', status: 'Active', lastLogin: '2026-04-29 09:15', color: 'success' },
  { id: 3, name: 'Jean Dupont', email: 'j.dupont@jury.fr', role: 'Jury', status: 'Active', lastLogin: '2026-04-28 16:45', color: 'warning' },
  { id: 4, name: 'Admin Sarah', email: 'admin@emsi.ma', role: 'Admin', status: 'Active', lastLogin: '2026-04-29 08:00', color: 'info' },
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

const AdminDashboard = () => {
  const { theme } = useApp();

  return (
    <div className="admin-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Panneau de Contrôle Admin</h2>
            <p className="text-muted small mb-0">Vue d'ensemble de la plateforme et gestion des ressources.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Rapport Global
            </Button>
            <Button variant="primary" className="fw-bold small px-4 py-2 border-0 shadow-sm rounded-pill d-flex align-items-center gap-2" style={{ backgroundColor: '#2563eb' }}>
              <Plus size={18} /> Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Utilisateurs', value: '1,248', icon: <Users />, color: 'primary', trend: '+12%' },
            { label: 'Projets Actifs', value: '842', icon: <Briefcase />, color: 'info', trend: '92%' },
            { label: 'Actions en Attente', value: '24', icon: <Clock />, color: 'warning', trend: 'Urgent' },
            { label: 'Stockage Système', value: '64.2%', icon: <Database />, color: 'danger', trend: '420GB' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`admin-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 fw-bold extra-small">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="extra-small fw-bold text-muted text-uppercase mb-1">{stat.label}</div>
                <h3 className="fw-bold mb-0">{stat.value}</h3>
              </div>
            </Col>
          ))}
        </Row>

        {/* Charts Section */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <div className="admin-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Tendances de Soumission</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SUBMISSION_DATA}>
                    <defs>
                      <linearGradient id="adminColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#adminColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="admin-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Répartition des Statuts</h5>
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
        <div className="admin-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <div>
              <h5 className="fw-bold mb-0">Gestion des Utilisateurs</h5>
              <p className="extra-small text-muted mb-0">Gérez les comptes globaux et les accès privilégiés.</p>
            </div>
            <div className="d-flex gap-2">
              <InputGroup size="sm" className="bg-surface rounded-pill border px-3" style={{ width: '250px' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                <Form.Control placeholder="Rechercher..." className="bg-transparent border-0 shadow-none py-2 extra-small fw-bold text-primary-custom" />
              </InputGroup>
            </div>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 admin-table">
              <thead>
                <tr className="border-bottom opacity-50 bg-surface-alt">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Utilisateur</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Email</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Rôle</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {USER_DATA.map((user, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`avatar-sm bg-${user.color} bg-opacity-10 text-${user.color} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="small fw-bold">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-3 small text-muted">{user.email}</td>
                    <td className="py-3">
                      <Badge bg={user.role === 'Admin' ? 'danger' : 'primary'} className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <span className="extra-small fw-bold opacity-75">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-end">
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

      <style>{`
        .admin-modern-layout {
          color: var(--text-primary);
        }
        .admin-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .bg-surface {
          background-color: var(--surface) !important;
        }
        .admin-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        
        h2, h3, h4, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
