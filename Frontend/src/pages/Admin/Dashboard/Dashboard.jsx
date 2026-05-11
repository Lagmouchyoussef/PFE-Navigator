import React from 'react';
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
import { Card, Row, Col, Badge, Button, ProgressBar, Table, Form, InputGroup, Container, Dropdown } from 'react-bootstrap';

const ACTIVITY_DATA = [
  { day: 'Mon', projects: 4, users: 12, logins: 45 },
  { day: 'Tue', projects: 2, users: 8, logins: 52 },
  { day: 'Wed', projects: 5, users: 15, logins: 38 },
  { day: 'Thu', projects: 3, users: 10, logins: 65 },
  { day: 'Fri', projects: 6, users: 18, logins: 48 },
  { day: 'Sat', projects: 1, users: 4, logins: 20 },
  { day: 'Sun', projects: 0, users: 2, logins: 15 },
];

const STATUS_DISTRIBUTION = [
  { name: 'Approuvé', value: 45, color: '#10b981' },
  { name: 'En attente', value: 25, color: '#f59e0b' },
  { name: 'En révision', value: 20, color: '#3b82f6' },
  { name: 'Rejeté', value: 10, color: '#ef4444' },
];

const GRADE_DISTRIBUTION = [
  { range: '0-10', count: 5 },
  { range: '10-12', count: 15 },
  { range: '12-14', count: 35 },
  { range: '14-16', count: 85 },
  { range: '16-18', count: 42 },
  { range: '18-20', count: 12 },
];

const PERFORMANCE_CRITERIA = [
  { subject: 'Innovation', A: 120, B: 110, fullMark: 150 },
  { subject: 'Technologie', A: 98, B: 130, fullMark: 150 },
  { subject: 'Méthodologie', A: 86, B: 130, fullMark: 150 },
  { subject: 'Présentation', A: 99, B: 100, fullMark: 150 },
  { subject: 'Rapport', A: 85, B: 90, fullMark: 150 },
  { subject: 'Assiduité', A: 65, B: 85, fullMark: 150 },
];

const StatCard = ({ label, value, trend, trendValue, color, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="h-100"
  >
    <Card className="border-0 shadow-sm rounded-4 h-100 theme-card">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
            {React.cloneElement(icon, { size: 24 })}
          </div>
          <Badge bg="transparent" className={`text-${trend === 'up' ? 'success' : 'danger'} fw-bold border-0 p-0 d-flex align-items-center gap-1`}>
            {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {trendValue}
          </Badge>
        </div>
        <h3 className="fw-bold mb-1" style={{ fontSize: '1.75rem' }}>{value}</h3>
        <p className="text-muted small fw-bold text-uppercase tracking-wider mb-0">{label}</p>
      </Card.Body>
    </Card>
  </motion.div>
);

const ManagementAction = ({ title, desc, icon, color, onClick }) => (
  <Col md={6} xl={3}>
    <Card className="border-0 shadow-sm rounded-4 h-100 theme-card hover-shadow transition-all cursor-pointer" onClick={onClick}>
      <Card.Body className="p-4">
        <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color} d-inline-block mb-3`}>
          {React.cloneElement(icon, { size: 20 })}
        </div>
        <h6 className="fw-bold mb-1">{title}</h6>
        <p className="extra-small text-muted mb-0">{desc}</p>
      </Card.Body>
    </Card>
  </Col>
);

const Dashboard = () => {
  return (
    <div className="admin-dashboard-simple py-4 pb-5">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Panneau de Contrôle Global</h2>
            <div className="d-flex align-items-center gap-2 text-muted small">
              <Badge bg="primary" className="bg-opacity-10 text-primary rounded-pill px-2 py-1 extra-small fw-bold">Monitoring Multi-Interfaces</Badge>
              <span>•</span>
              <span>Dernière mise à jour: 14:52</span>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="rounded-3 shadow-sm extra-small fw-bold px-4 theme-btn-secondary">
              <Download size={16} className="me-2" /> Exporter Rapport PDF
            </Button>
            <Button variant="primary" className="rounded-3 shadow-sm extra-small fw-bold px-4 theme-btn-primary border-0">
              <RefreshCw size={16} className="me-2" /> Actualiser Données
            </Button>
          </div>
        </div>

        {/* Global Statistics Grid */}
        <Row className="g-4 mb-5">
          <Col xl={3} md={6}>
            <StatCard label="Étudiants Actifs" value="1,248" trend="up" trendValue="+12%" color="primary" icon={<Users />} delay={0.1} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Projets Déposés" value="342" trend="up" trendValue="+8%" color="info" icon={<FileText />} delay={0.2} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Soutenances Validées" value="156" trend="up" trendValue="+24" color="success" icon={<Award />} delay={0.3} />
          </Col>
          <Col xl={3} md={6}>
            <StatCard label="Engagement Moyen" value="8.4/10" trend="down" trendValue="-0.2" color="warning" icon={<Activity />} delay={0.4} />
          </Col>
        </Row>

        {/* Quick Management Section */}
        <div className="mb-5">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
            <Settings size={20} className="text-primary"/> Raccourcis de Gestion
          </h5>
          <Row className="g-4">
            <ManagementAction title="Comptes Utilisateurs" desc="Gérer 1,450+ comptes étudiants" icon={<UserPlus />} color="primary" onClick={() => {}} />
            <ManagementAction title="Calendrier Académique" desc="Modifier les échéances du PFE" icon={<Clock />} color="warning" onClick={() => {}} />
            <ManagementAction title="Logistique des Jurys" desc="Salles, dates et convocations" icon={<Layers />} color="info" onClick={() => {}} />
            <ManagementAction title="Rapports & Archives" desc="Consulter l'historique des PFE" icon={<BookOpen />} color="success" onClick={() => {}} />
          </Row>
        </div>

        {/* Charts Row 1: Core Activity */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 h-100 theme-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="fw-bold mb-1">Tendance d'Activité Multi-Rôle</h5>
                  <p className="extra-small text-muted mb-0">Comparaison des dépôts de projets et des connexions utilisateurs</p>
                </div>
                <div className="d-flex gap-2">
                  <Badge bg="primary" className="bg-opacity-10 text-primary border-0 px-2 py-1 extra-small">Projets</Badge>
                  <Badge bg="secondary" className="bg-opacity-10 text-secondary border-0 px-2 py-1 extra-small">Connexions</Badge>
                </div>
              </div>
              <div style={{ height: '320px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ACTIVITY_DATA}>
                    <defs>
                      <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 600 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="logins" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLogins)" name="Connexions" />
                    <Area type="monotone" dataKey="projects" stroke="#10b981" strokeWidth={3} fill="transparent" strokeDasharray="5 5" name="Dépôts Projets" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 h-100 theme-card p-4">
              <h5 className="fw-bold mb-4">Statuts des Soumissions</h5>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DISTRIBUTION} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                      {STATUS_DISTRIBUTION.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="extra-small fw-bold text-muted">Progression du Programme</span>
                  <span className="extra-small fw-bold text-success">82% complété</span>
                </div>
                <ProgressBar now={82} variant="success" style={{ height: '6px' }} className="rounded-pill shadow-none theme-bg-light" />
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Row 2: Performance & Grades */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 theme-card p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Award size={18} className="text-warning"/> Distribution des Notes
              </h5>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GRADE_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 600 }} />
                    <Tooltip cursor={{fill: 'var(--background)', opacity: 0.2}} contentStyle={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Nombre d'étudiants" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="border-0 shadow-sm rounded-4 h-100 theme-card p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-info"/> Analyse des Critères PFE
              </h5>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={PERFORMANCE_CRITERIA}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                    <Radar name="Promotion 2026" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Radar name="Moyenne 2025" dataKey="B" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                    <Legend iconType="circle" />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Extended Data Table */}
        <Card className="border-0 shadow-sm rounded-4 theme-card overflow-hidden mb-5">
          <div className="p-4 border-bottom border-secondary border-opacity-25 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h5 className="fw-bold mb-0">Détails des Sessions de Soutenance</h5>
              <p className="extra-small text-muted mb-0">Vue globale sur l'organisation des jurys et l'état des évaluations</p>
            </div>
              <div className="d-flex gap-2">
                <InputGroup size="sm" className="theme-bg-light rounded-pill px-2 border">
                  <InputGroup.Text className="bg-transparent border-0 text-theme opacity-75"><Search size={14}/></InputGroup.Text>
                  <Form.Control placeholder="Rechercher étudiant ou jury..." className="bg-transparent border-0 shadow-none extra-small text-theme placeholder-theme" />
                </InputGroup>
                <Button variant="outline-secondary" size="sm" className="rounded-pill theme-btn-outline px-3 extra-small fw-bold">
                  <Filter size={14} className="me-1" /> Filtrer
                </Button>
              </div>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0 theme-table">
              <thead>
                <tr>
                  <th className="border-0 py-3 ps-4 extra-small text-uppercase text-muted fw-bold">ID Session</th>
                  <th className="border-0 py-3 extra-small text-uppercase text-muted fw-bold">Étudiant</th>
                  <th className="border-0 py-3 extra-small text-uppercase text-muted fw-bold">Composition du Jury</th>
                  <th className="border-0 py-3 extra-small text-uppercase text-muted fw-bold">Date & Lieu</th>
                  <th className="border-0 py-3 extra-small text-uppercase text-muted fw-bold">État Evaluation</th>
                  <th className="border-0 py-3 text-end pe-4 extra-small text-uppercase text-muted fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'JR-1024', student: 'Ahmed Benali', jury: 'Dr. Wilson, Dr. Smith', date: '15 Mai, 09:00', room: 'A-202', status: 'Confirmé', color: 'success', progress: 100 },
                  { id: 'JR-1025', student: 'Sara Kamali', jury: 'Prof. Miller, Dr. Chen', date: '16 Mai, 14:00', room: 'B-105', status: 'En attente', color: 'warning', progress: 45 },
                  { id: 'JR-1026', student: 'Mohamed Alaoui', jury: 'Dr. Thompson, Prof. Vales', date: '20 Mai, 11:00', room: 'A-304', status: 'Planifié', color: 'primary', progress: 0 },
                ].map((item, i) => (
                  <tr key={i} className="align-middle border-secondary border-opacity-10">
                    <td className="ps-4 py-3 small fw-bold text-primary">{item.id}</td>
                    <td className="small fw-bold">{item.student}</td>
                    <td className="extra-small text-muted">{item.jury}</td>
                    <td className="extra-small">
                      <div className="fw-bold">{item.date}</div>
                      <div className="text-muted">Salle {item.room}</div>
                    </td>
                    <td style={{ width: '180px' }}>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <Badge className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-pill px-2 py-0 extra-small fw-bold`}>
                          {item.status}
                        </Badge>
                        <span className="extra-small text-muted fw-bold">{item.progress}%</span>
                      </div>
                      <ProgressBar now={item.progress} variant={item.color} style={{ height: '4px' }} className="rounded-pill shadow-none theme-bg-light" />
                    </td>
                    <td className="text-end pe-4">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-0 no-caret text-muted border-0 shadow-none">
                          <MoreHorizontal size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg extra-small">
                          <Dropdown.Item className="d-flex align-items-center gap-2"><FileText size={14}/> Voir Rapport</Dropdown.Item>
                          <Dropdown.Item className="d-flex align-items-center gap-2"><Calendar size={14}/> Reprogrammer</Dropdown.Item>
                          <Dropdown.Item className="d-flex align-items-center gap-2 text-danger"><Trash2 size={14}/> Annuler Session</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>

        {/* Infrastructure & System Monitoring */}
        <Row className="g-4">
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-4 theme-card p-4 h-100">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                <Activity size={18} className="text-primary" /> Santé Infrastructure
              </h6>
              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary border-opacity-10">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary"><Database size={16}/></div>
                    <div className="extra-small fw-bold">Base de Données PFE</div>
                  </div>
                  <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-2 py-1 extra-small">Stable</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary border-opacity-10">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info"><Globe size={16}/></div>
                    <div className="extra-small fw-bold">Serveur de Fichiers</div>
                  </div>
                  <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-2 py-1 extra-small">99.9% Up</Badge>
                </div>
                <div className="pt-3">
                  <div className="d-flex justify-content-between align-items-center extra-small mb-2">
                    <span className="text-muted fw-bold">Charge CPU</span>
                    <span className="fw-bold">24%</span>
                  </div>
                  <ProgressBar now={24} variant="primary" style={{ height: '6px' }} className="rounded-pill shadow-none theme-bg-light" />
                </div>
              </div>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-4 theme-card p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Bell size={18} className="text-warning" /> Alertes & Activités Multi-Interfaces
                </h6>
                <Button variant="link" className="text-primary extra-small fw-bold text-decoration-none p-0">Journal Complet</Button>
              </div>
              <div className="d-flex flex-column gap-3">
                {[
                  { title: 'Évaluation Jury #1024 Terminée', detail: 'Dr. Wilson a validé le projet de Ahmed Benali', time: '12m', color: 'success' },
                  { title: 'Nouveau dépôt de rapport (Final)', detail: 'Étudiant: Sara Kamali - Fichier: rapport_final_v1.pdf', time: '45m', color: 'info' },
                  { title: 'Alerte Délai (J-3)', detail: '54 étudiants n\'ont pas encore déposé leur rapport de mi-parcours', time: '2h', color: 'warning' },
                ].map((log, i) => (
                  <div key={i} className="p-3 rounded-3 theme-bg-light border-start border-4 transition-all" style={{ borderLeftColor: `var(--bs-${log.color})` }}>
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="extra-small fw-bold">{log.title}</div>
                      <div className="extra-small text-muted">{log.time}</div>
                    </div>
                    <div className="extra-small text-muted opacity-75">{log.detail}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .admin-dashboard-simple {
          background-color: var(--background);
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
        }
        .theme-card {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
        }
        .theme-bg-light {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid var(--border) !important;
          transition: all 0.2s ease;
        }
        .theme-bg-light:focus-within {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        .theme-btn-primary {
          background-color: var(--primary) !important;
          color: white !important;
          transition: all 0.2s ease;
        }
        .theme-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3) !important;
        }
        .theme-btn-secondary {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
          transition: all 0.2s ease;
        }
        .theme-btn-secondary:hover {
          background-color: var(--border) !important;
          color: var(--text-primary) !important;
        }
        .theme-btn-outline {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
        }
        .theme-btn-outline:hover {
          background-color: var(--border) !important;
        }
        .theme-table th {
          background-color: var(--surface) !important;
          color: var(--text-secondary) !important;
        }
        .theme-table td {
          color: var(--text-primary) !important;
          border-bottom-color: var(--border) !important;
        }
        .text-theme { color: var(--text-primary) !important; }
        .placeholder-theme::placeholder { color: var(--text-secondary) !important; opacity: 0.6; }
        .bg-navy { background-color: #0f172a !important; }
        .extra-small { font-size: 0.75rem; }
        .hover-shadow:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .transition-all { transition: all 0.2s ease; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Dashboard;
