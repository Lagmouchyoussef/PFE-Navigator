import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, LabelList
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Star, Users, 
  Clock, Calendar, Activity, Brain, FileText, MessageSquare, CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './JuryDashboard.css';

const PERFORMANCE_DATA = [
  { name: 'Jan', evaluations: 5, score: 14.2 },
  { name: 'Feb', evaluations: 8, score: 15.5 },
  { name: 'Mar', evaluations: 12, score: 14.8 },
  { name: 'Apr', evaluations: 18, score: 16.4 },
  { name: 'May', evaluations: 15, score: 17.2 },
];

const SUCCESS_RATE_DATA = [
  { name: 'Excellent (≥18)', value: 18, color: '#10b981' },
  { name: 'Très bien (16-17)', value: 27, color: '#3b82f6' },
  { name: 'Bien (14-15)', value: 33, color: '#6366f1' },
  { name: 'Passable (12-13)', value: 18, color: '#f59e0b' },
  { name: 'Insuffisant (<12)', value: 4, color: '#ef4444' },
];

const GRADE_DISTRIBUTION = [
  { range: '0-5', count: 0 },
  { range: '6-10', count: 2 },
  { range: '11-15', count: 12 },
  { range: '16-18', count: 20 },
  { range: '19-20', count: 5 },
];

const CRITERIA_DATA = [
  { subject: 'Innovation', me: 18, avg: 14 },
  { subject: 'Méthodologie', me: 16, avg: 15 },
  { subject: 'Qualité Tech', me: 19, avg: 16 },
  { subject: 'Présentation', me: 17, avg: 16 },
  { subject: 'Documentation', me: 15, avg: 15 },
];

const JuryDashboard = () => {
  const { session } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="jd-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Header Section */}
        <header className="jd-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-1">Tableau de Bord Analytique</h1>
            <p className="mb-0">
              Bienvenue, Dr. {session?.name || 'Jane Doe'} • Dernière connexion : Aujourd'hui à 14:32
            </p>
          </motion.div>
          <div className="d-flex gap-3">
            <Button className="btn-pro-outline d-flex align-items-center gap-2">
              <Calendar size={18} color="#6366f1" /> Programmer Soutenance
            </Button>
            <Button className="btn-pro-primary d-flex align-items-center gap-2 shadow-sm border-0">
              <Activity size={18} /> Générer Rapport
            </Button>
          </div>
        </header>

        {/* Global Statistics Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Évaluations ce mois" value="18" trend="+24%" trendUp={true} icon={<FileText size={24} color="#3b82f6" />} delay={0.1} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Score moyen attribué" value="16.4/20" trend="+1.2" trendUp={true} icon={<Star size={24} color="#f59e0b" />} delay={0.2} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Projets Excellents" value="8" trend="+3" trendUp={true} icon={<CheckCircle size={24} color="#10b981" />} delay={0.3} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Étudiants suivis" value="45" trend="-2" trendUp={false} icon={<Users size={24} color="#6366f1" />} delay={0.4} />
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {/* Performance des Évaluations */}
          <Col lg={8}>
            <Card className="jd-chart-card">
              <div className="jd-chart-header d-flex justify-content-between align-items-start">
                <div>
                  <h6>Performance des Évaluations</h6>
                  <p className="extra-small text-muted mb-0">Évolution mensuelle des évaluations et scores moyens</p>
                </div>
                <Badge bg="light" text="dark" className="border">Derniers 5 Mois</Badge>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="evaluations" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEval)" name="Évaluations" />
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fill="transparent" name="Score" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Taux de Réussite */}
          <Col lg={4}>
            <Card className="jd-chart-card">
              <div className="jd-chart-header">
                <h6>Taux de Réussite</h6>
                <p className="extra-small text-muted mb-0">Répartition par niveau d'appréciation</p>
              </div>
              <div className="position-relative d-flex justify-content-center" style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={SUCCESS_RATE_DATA} 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                      label={({ name, value }) => `${value}%`}
                    >
                      {SUCCESS_RATE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                  <div className="h3 fw-black mb-0">95.6%</div>
                  <div className="extra-small text-muted fw-bold">GLOBAL</div>
                </div>
              </div>
              <div className="mt-3">
                {SUCCESS_RATE_DATA.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2 extra-small fw-bold">
                      <div className="dot" style={{ backgroundColor: item.color }}></div>
                      {item.name}
                    </div>
                    <span className="extra-small text-muted fw-black">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {/* Distribution des Notes */}
          <Col lg={4}>
            <Card className="jd-chart-card">
              <div className="jd-chart-header">
                <h6>Distribution des Notes</h6>
                <p className="extra-small text-muted mb-0">Répartition des scores attribués</p>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GRADE_DISTRIBUTION}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} name="Projets">
                      <LabelList dataKey="count" position="top" formatter={(val) => `${((val/39)*100).toFixed(0)}%`} style={{ fontSize: '10px', fontWeight: 'bold', fill: 'var(--jd-text)' }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Analyse par Critères */}
          <Col lg={8}>
            <Card className="jd-chart-card">
              <div className="jd-chart-header">
                <h6>Analyse par Critères</h6>
                <p className="extra-small text-muted mb-0">Comparaison avec la moyenne</p>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={CRITERIA_DATA}>
                    <PolarGrid strokeOpacity={0.1} />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700}} />
                    <Radar name="Moi" dataKey="me" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Radar name="Jury" dataKey="avg" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.3} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3 mb-4">
              <h5 className="jd-section-title mb-0">Projets Assignés</h5>
              <div className="d-flex flex-wrap gap-2">
                {['Tous', 'Prêt', 'En attente', 'Évalué'].map((status) => (
                  <Button 
                    key={status}
                    variant={activeTab === status.toLowerCase() ? 'primary' : 'light'}
                    size="sm"
                    className={`rounded-pill px-3 py-1 extra-small fw-bold border-0 shadow-sm ${activeTab === status.toLowerCase() ? 'bg-primary text-white' : 'text-muted'}`}
                    onClick={() => setActiveTab(status.toLowerCase())}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="d-block d-xl-none">
              <ProjectCard name="Ahmed Benali" title="AI-Powered Student System" sup="Prof. Martin" date="2026-04-15" status="Ready" />
              <ProjectCard name="Sara Kamali" title="Blockchain Certificate Verif." sup="Dr. Chen" date="2026-04-18" status="Pending" />
            </div>

            {/* Desktop Table */}
            <div className="d-none d-xl-block">
              <div className="table-responsive">
                <Table className="jd-table-pro">
                  <thead>
                    <tr>
                      <th style={{ width: '25%' }}>Étudiant</th>
                      <th style={{ width: '35%' }}>Titre du Projet</th>
                      <th style={{ width: '20%' }}>Encadrant</th>
                      <th style={{ width: '10%' }}>Date</th>
                      <th style={{ width: '10%' }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ProjectRow name="Ahmed Benali" title="AI-Powered Student System" sup="Prof. Martin" date="2026-04-15" status="Ready" />
                    <ProjectRow name="Sara Kamali" title="Blockchain Certificate Verif." sup="Dr. Chen" date="2026-04-18" status="Pending" />
                    <ProjectRow name="Mohamed Alaoui" title="IoT Smart Campus Solution" sup="Prof. Smith" date="2026-04-10" status="Evaluated" />
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="jd-chart-card h-100">
              <h5 className="jd-section-title d-flex align-items-center gap-2">
                <Activity size={20} color="#3b82f6" /> Suivi Actif
              </h5>
              <div className="jd-ai-insight mb-4">
                <div className="extra-small fw-bold text-primary mb-1">ALERTE IA</div>
                <p className="extra-small mb-0 opacity-75">Le projet "IoT Smart Campus" nécessite votre attention.</p>
              </div>
              <div className="jd-activity-list">
                <ActivityItem icon={<Clock size={16} color="#f59e0b" />} title="Soutenance" desc="Demain à 09:00" />
                <ActivityItem icon={<MessageSquare size={16} color="#3b82f6" />} title="Message" desc="Nouveau commentaire" />
                <ActivityItem icon={<FileText size={16} color="#10b981" />} title="Rapport" desc="Version finale reçue" />
              </div>
            </Card>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendUp, icon, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="jd-stat-card">
    <div className="d-flex justify-content-between align-items-start mb-3">
      <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">{icon}</div>
      <Badge className={`jd-trend-badge ${trendUp ? 'jd-trend-up' : 'jd-trend-down'}`}>
        {trendUp ? <TrendingUp size={12} className="me-1" /> : <TrendingDown size={12} className="me-1" />}
        {trend}
      </Badge>
    </div>
    <div className="extra-small text-muted fw-bold text-uppercase tracking-widest mb-1">{label}</div>
    <div className="h2 fw-black text-navy mb-0">{value}</div>
  </motion.div>
);

const ActivityItem = ({ icon, title, desc }) => (
  <div className="jd-activity-item d-flex align-items-center gap-3 mb-3">
    <div className="jd-activity-icon bg-primary bg-opacity-10 text-primary p-2 rounded-circle">{icon}</div>
    <div className="overflow-hidden">
      <div className="extra-small fw-bold text-navy text-truncate">{title}</div>
      <div className="extra-small text-muted text-truncate">{desc}</div>
    </div>
  </div>
);

const ProjectRow = ({ name, title, sup, date, status }) => (
  <tr>
    <td>
      <div className="d-flex align-items-center gap-3">
        <div className="avatar-xs bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '10px' }}>{name.charAt(0)}</div>
        <div className="small fw-bold text-navy text-truncate">{name}</div>
      </div>
    </td>
    <td><div className="extra-small fw-bold text-muted text-truncate">{title}</div></td>
    <td><div className="extra-small text-muted text-truncate">{sup}</div></td>
    <td><div className="extra-small text-muted">{date}</div></td>
    <td className="text-end">
      <Button variant="link" className="p-0 text-primary fw-bold text-decoration-none extra-small">Review</Button>
    </td>
  </tr>
);

const ProjectCard = ({ name, title, sup, date, status }) => (
  <Card className="border-0 shadow-sm rounded-4 p-3 mb-3 jd-card-mobile">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center gap-2">
        <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '12px' }}>{name.charAt(0)}</div>
        <div className="small fw-bold text-navy">{name}</div>
      </div>
      <Badge className={`rounded-pill px-3 py-1 extra-small bg-${status === 'Evaluated' ? 'success' : status === 'Ready' ? 'primary' : 'warning'} bg-opacity-10 text-${status === 'Evaluated' ? 'success' : status === 'Ready' ? 'primary' : 'warning'}`}>
        {status}
      </Badge>
    </div>
    <div className="extra-small fw-bold text-muted mb-2 text-wrap">{title}</div>
    <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
      <div className="extra-small text-muted d-flex flex-column">
        <span className="d-flex align-items-center gap-1"><Users size={10} color="#6366f1" /> {sup}</span>
        <span className="mt-1">{date}</span>
      </div>
      <Button variant="primary" size="sm" className="rounded-3 extra-small px-3 py-1 shadow-sm border-0">Ouvrir</Button>
    </div>
  </Card>
);

export default JuryDashboard;
