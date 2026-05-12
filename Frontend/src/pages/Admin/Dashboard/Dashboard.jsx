import React, { useState } from 'react';
import { 
  Users, Briefcase, Calendar, TrendingUp, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Plus, ExternalLink, Activity, Shield, Clock,
  FileText, CheckCircle, AlertCircle, Database,
  RefreshCw, Filter, Search, Download, ChevronRight,
  UserPlus, Settings, Bell, Lock, Trash2, 
  Layers, HardDrive, Cpu, Globe, Award, BookOpen,
  PieChart as PieIcon, BarChart3, LineChart as LineIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend, LineChart, Line,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { motion } from 'framer-motion';
import { Card, Row, Col, Badge, Button, ProgressBar, Table, Form, InputGroup, Container, Dropdown, Modal } from 'react-bootstrap';

const ACTIVITY_DATA = [
  { day: 'Lun', projects: 4, users: 12, logins: 45 },
  { day: 'Mar', projects: 2, users: 8, logins: 52 },
  { day: 'Mer', projects: 5, users: 15, logins: 38 },
  { day: 'Jeu', projects: 3, users: 10, logins: 65 },
  { day: 'Ven', projects: 6, users: 18, logins: 48 },
  { day: 'Sam', projects: 1, users: 4, logins: 20 },
  { day: 'Dim', projects: 0, users: 2, logins: 15 },
];

const STATUS_DISTRIBUTION = [
  { name: 'Approuvé', value: 45, color: '#10b981' },
  { name: 'En attente', value: 25, color: '#f59e0b' },
  { name: 'En révision', value: 20, color: '#3b82f6' },
  { name: 'Rejeté', value: 10, color: '#ef4444' },
];

const StatCard = ({ label, value, trend, trendValue, color, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="h-100"
  >
    <div className={`dashboard-glass-card p-4 rounded-4 h-100 border-start-4 border-${color}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 fw-bold extra-small px-2 py-1">
          {trend === 'up' ? <ArrowUpRight size={14} className="me-1" /> : <ArrowDownRight size={14} className="me-1" />}
          {trendValue}
        </Badge>
      </div>
      <h3 className="fw-bold mb-1">{value}</h3>
      <p className="text-muted small fw-bold text-uppercase tracking-wider mb-0">{label}</p>
    </div>
  </motion.div>
);

const ManagementAction = ({ title, desc, icon, color, onClick }) => (
  <Col md={6} xl={3}>
    <div className="dashboard-glass-card p-4 rounded-4 h-100 hover-translate transition-all cursor-pointer" onClick={onClick}>
      <div className={`p-2 rounded-2 bg-${color} bg-opacity-10 text-${color} d-inline-block mb-3`}>
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <h6 className="fw-bold mb-1">{title}</h6>
      <p className="extra-small text-muted mb-0">{desc}</p>
    </div>
  </Col>
);

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    alert("Préparation de l'exportation du rapport PDF...");
  };

  return (
    <div className="dashboard-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Panneau de Contrôle</h2>
            <p className="text-muted small mb-0">Vue d'ensemble de l'activité académique et système.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-3 rounded-pill" onClick={handleExport}>
              <Download size={16} className="me-2" /> Export
            </Button>
            <Button 
              variant="primary" 
              className="fw-bold small px-4 rounded-pill shadow-sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`me-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Actualisation...' : 'Rafraîchir'}
            </Button>
          </div>
        </div>

        {/* Top Stats */}
        <Row className="g-4 mb-5">
          <Col xl={3} md={6}>
            <StatCard label="Étudiants Actifs" value="1,284" trend="up" trendValue="+12%" color="primary" icon={<Users />} delay={0.1} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Projets PFE" value="456" trend="up" trendValue="+5%" color="success" icon={<Briefcase />} delay={0.2} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Sessions Jury" value="82" trend="down" trendValue="-2%" color="warning" icon={<Calendar />} delay={0.3} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Taux de Réussite" value="94.2%" trend="up" trendValue="+1.5%" color="info" icon={<TrendingUp />} delay={0.4} />
          </Col>
        </Row>

        {/* Activity & Distribution Charts */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <div className="dashboard-glass-card p-4 rounded-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Activité Hebdomadaire</h5>
                <Form.Select className="w-auto extra-small fw-bold border-0 bg-light-soft">
                  <option>7 derniers jours</option>
                  <option>30 derniers jours</option>
                </Form.Select>
              </div>
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Area type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="dashboard-glass-card p-4 rounded-4 h-100 text-center">
              <h5 className="fw-bold mb-4 text-start">États des Projets</h5>
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={STATUS_DISTRIBUTION}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {STATUS_DISTRIBUTION.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3">
                {STATUS_DISTRIBUTION.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color }}></div>
                      <span className="extra-small fw-bold text-muted">{item.name}</span>
                    </div>
                    <span className="small fw-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Quick Actions */}
        <h5 className="fw-bold mb-4">Actions de Gestion</h5>
        <Row className="g-4 mb-5">
          <ManagementAction title="Nouvel Utilisateur" desc="Ajouter un étudiant ou professeur" icon={<UserPlus />} color="primary" />
          <ManagementAction title="Assigner Jury" desc="Planifier une nouvelle session" icon={<Award />} color="success" />
          <ManagementAction title="Archive Archive" desc="Exporter des projets archivés" icon={<HardDrive />} color="warning" />
          <ManagementAction title="Sécurité" desc="Gérer les accès et logs" icon={<Shield />} color="danger" />
        </Row>

        {/* Recent Submissions Table */}
        <div className="dashboard-glass-card p-0 rounded-4 overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <h5 className="fw-bold mb-0">Soumissions Récentes</h5>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none">Voir tout</Button>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="mb-0 align-middle dashboard-table">
              <thead>
                <tr className="opacity-50">
                  <th className="extra-small fw-bold py-3 px-4">ÉTUDIANT</th>
                  <th className="extra-small fw-bold py-3">PROJET</th>
                  <th className="extra-small fw-bold py-3">DATE</th>
                  <th className="extra-small fw-bold py-3">STATUT</th>
                  <th className="extra-small fw-bold py-3 px-4 text-end">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Youssef Lagmouchy', project: 'MediSync AI Dashboard', date: 'Aujourd\'hui', status: 'Approuvé' },
                  { name: 'Amin Mansouri', project: 'EcoTrack Blockchain', date: 'Hier', status: 'En attente' },
                  { name: 'Sara Bennani', project: 'Smart City API', date: 'Il y a 2j', status: 'En révision' },
                  { name: 'Khalid Tazi', project: 'CyberSafe VPN', date: 'Il y a 3j', status: 'Approuvé' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10">
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {row.name.charAt(0)}
                        </div>
                        <span className="small fw-bold">{row.name}</span>
                      </div>
                    </td>
                    <td className="py-3 small">{row.project}</td>
                    <td className="py-3 small text-muted">{row.date}</td>
                    <td className="py-3">
                      <Badge bg={row.status === 'Approuvé' ? 'success' : (row.status === 'En attente' ? 'warning' : 'info')} className="extra-small rounded-pill">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <Button variant="link" className="p-0 text-muted"><MoreHorizontal size={18} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <style>{`
        .dashboard-modern-layout {
          color: var(--text-primary);
        }
        .dashboard-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .bg-light-soft {
          background-color: var(--background) !important;
          border: 1px solid var(--border) !important;
          color: var(--text-primary) !important;
        }
        .hover-translate:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .dashboard-table thead th {
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dashboard-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        h2, h3, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
