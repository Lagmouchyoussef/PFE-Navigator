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
    <Card className={`border-0 shadow-sm rounded-3 h-100 dashboard-simple-card border-${color}`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`p-3 rounded-2 bg-light text-${color}`}>
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <Badge bg="light" className={`text-${trend === 'up' ? 'success' : 'danger'} fw-bold border extra-small px-2 py-1`}>
            {trend === 'up' ? <ArrowUpRight size={14} className="me-1" /> : <ArrowDownRight size={14} className="me-1" />}
            {trendValue}
          </Badge>
        </div>
        <h3 className="fw-bold text-dark mb-1">{value}</h3>
        <p className="text-muted small fw-bold text-uppercase tracking-wider mb-0">{label}</p>
      </Card.Body>
    </Card>
  </motion.div>
);

const ManagementAction = ({ title, desc, icon, color, onClick }) => (
  <Col md={6} xl={3}>
    <Card className="border shadow-sm rounded-3 h-100 bg-white hover-translate transition-all cursor-pointer" onClick={onClick}>
      <Card.Body className="p-4">
        <div className={`p-2 rounded-2 bg-light text-${color} d-inline-block mb-3`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <h6 className="fw-bold text-dark mb-1">{title}</h6>
        <p className="extra-small text-muted mb-0">{desc}</p>
      </Card.Body>
    </Card>
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
    <div className="dashboard-simple-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Panneau de Contrôle</h2>
            <p className="text-muted small mb-0">Vue d'ensemble de l'activité académique et système.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="bg-white text-dark fw-bold small px-3 border shadow-sm" onClick={handleExport}>
              <Download size={16} className="me-2" /> Exporter Rapport
            </Button>
            <Button 
              variant="primary" 
              className="fw-bold small px-3 border-0 shadow-sm d-flex align-items-center" 
              style={{ backgroundColor: '#2563eb' }}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={`me-2 ${isRefreshing ? 'spin-anim' : ''}`} /> 
              {isRefreshing ? 'Chargement...' : 'Actualiser'}
            </Button>
          </div>
        </div>

        {/* Statistics Grid */}
        <Row className="g-4 mb-5">
          <Col xl={3} md={6}>
            <StatCard label="Étudiants Actifs" value="1,248" trend="up" trendValue="+12%" color="blue-custom" icon={<Users />} delay={0.1} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Projets Déposés" value="342" trend="up" trendValue="+8%" color="purple-custom" icon={<FileText />} delay={0.2} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Soutenances Validées" value="156" trend="up" trendValue="+24" color="indigo-custom" icon={<Award />} delay={0.3} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Engagement" value="8.4/10" trend="down" trendValue="-0.2" color="rose-custom" icon={<Activity />} delay={0.4} />
          </Col>
        </Row>

        {/* Quick Actions */}
        <div className="mb-5">
          <h5 className="fw-bold text-dark mb-4">Gestion Rapide</h5>
          <Row className="g-4">
            <ManagementAction title="Utilisateurs" desc="Gérer les comptes étudiants" icon={<UserPlus />} color="primary" onClick={() => {}} />
            <ManagementAction title="Calendrier" desc="Dates et échéances PFE" icon={<Clock />} color="primary" onClick={() => {}} />
            <ManagementAction title="Logistique" desc="Jurys et salles" icon={<Layers />} color="primary" onClick={() => {}} />
            <ManagementAction title="Archives" desc="Historique des projets" icon={<BookOpen />} color="primary" onClick={() => {}} />
          </Row>
        </div>

        {/* Charts Row */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="border shadow-sm rounded-3 p-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-dark mb-0">Activité des Utilisateurs</h5>
                <Badge className="badge-simple-blue">7 derniers jours</Badge>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="logins" stroke="#2563eb" strokeWidth={3} fill="url(#colorBlue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border shadow-sm rounded-3 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-4">Statuts Projets</h5>
              <div style={{ height: '220px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {STATUS_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-3 border-top">
                <div className="d-flex justify-content-between extra-small mb-2 fw-bold">
                  <span className="text-muted">Progression Globale</span>
                  <span className="text-primary">82%</span>
                </div>
                <ProgressBar now={82} variant="primary" style={{ height: '6px' }} className="rounded-pill shadow-none bg-light" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Table */}
        <Card className="border shadow-sm rounded-3 overflow-hidden bg-white mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-dark mb-0">Sessions Récentes</h5>
            <Button variant="link" className="text-primary fw-bold small text-decoration-none p-0">Voir tout</Button>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="border-0 py-3 ps-4 extra-small text-muted text-uppercase fw-bold">ID</th>
                  <th className="border-0 py-3 extra-small text-muted text-uppercase fw-bold">Étudiant</th>
                  <th className="border-0 py-3 extra-small text-muted text-uppercase fw-bold">Jury</th>
                  <th className="border-0 py-3 extra-small text-muted text-uppercase fw-bold">Date & Lieu</th>
                  <th className="border-0 py-3 extra-small text-muted text-uppercase fw-bold">État</th>
                  <th className="border-0 py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'JR-1024', student: 'Ahmed Benali', jury: 'Dr. Wilson, Dr. Smith', date: '15 Mai, 09:00', room: 'A-202', status: 'Confirmé', color: 'success' },
                  { id: 'JR-1025', student: 'Sara Kamali', jury: 'Prof. Miller, Dr. Chen', date: '16 Mai, 14:00', room: 'B-105', status: 'En attente', color: 'warning' },
                  { id: 'JR-1026', student: 'Mohamed Alaoui', jury: 'Dr. Thompson, Prof. Vales', date: '20 Mai, 11:00', room: 'A-304', status: 'Planifié', color: 'primary' },
                ].map((item, i) => (
                  <tr key={i} className="align-middle">
                    <td className="ps-4 py-3 small fw-bold text-primary">{item.id}</td>
                    <td className="small fw-bold">{item.student}</td>
                    <td className="extra-small text-muted">{item.jury}</td>
                    <td className="extra-small">
                      <div className="fw-bold">{item.date}</div>
                      <div className="text-muted">Salle {item.room}</div>
                    </td>
                    <td>
                      <Badge className={`badge-${item.color}-simple`}>{item.status}</Badge>
                    </td>
                    <td className="text-end pe-4">
                      <Button 
                        variant="light" 
                        size="sm" 
                        className="rounded-2"
                        onClick={() => {
                          setSelectedSession(item);
                          setShowSessionModal(true);
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* SESSION DETAILS MODAL */}
      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Détails de la Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedSession && (
            <div className="d-flex flex-column gap-3">
              <div className="p-3 bg-light rounded-3 border-start border-4 border-primary">
                <div className="extra-small text-muted fw-bold mb-1">{selectedSession.id}</div>
                <h5 className="fw-bold text-dark mb-0">{selectedSession.student}</h5>
              </div>
              
              <div className="row g-3">
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Jury</div>
                  <div className="small fw-bold">{selectedSession.jury}</div>
                </div>
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Statut</div>
                  <Badge className={`badge-${selectedSession.color}-simple`}>{selectedSession.status}</Badge>
                </div>
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Date</div>
                  <div className="small fw-bold">{selectedSession.date}</div>
                </div>
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Salle</div>
                  <div className="small fw-bold">{selectedSession.room}</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top">
                <Button className="w-100 fw-bold border-0" style={{ backgroundColor: '#2563eb' }}>
                  Ouvrir le Dossier Complet
                </Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <style>{`
        .dashboard-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .dashboard-simple-card {
          border-left: 4px solid #2563eb !important;
          transition: transform 0.2s ease;
        }
        .border-blue-custom { border-left-color: #3b82f6 !important; }
        .border-purple-custom { border-left-color: #8b5cf6 !important; }
        .border-indigo-custom { border-left-color: #6366f1 !important; }
        .border-rose-custom { border-left-color: #f43f5e !important; }

        .text-blue-custom { color: #3b82f6 !important; }
        .text-purple-custom { color: #8b5cf6 !important; }
        .text-indigo-custom { color: #6366f1 !important; }
        .text-rose-custom { color: #f43f5e !important; }

        .dashboard-simple-card:hover {
          transform: translateY(-5px);
        }
        .hover-translate:hover {
          transform: translateY(-5px);
          border-color: #2563eb !important;
        }
        .badge-simple-blue {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600;
          padding: 5px 10px;
        }
        .badge-success-simple {
          background-color: #dcfce7 !important;
          color: #166534 !important;
          font-weight: 600;
        }
        .badge-warning-simple {
          background-color: #fef9c3 !important;
          color: #854d0e !important;
          font-weight: 600;
        }
        .badge-primary-simple {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .bg-primary { background-color: #2563eb !important; }
        .transition-all { transition: all 0.2s ease; }
        .spin-anim {
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
