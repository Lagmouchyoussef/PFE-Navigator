import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, Dropdown 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend, LabelList
} from 'recharts';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Star, Users, 
  Clock, Calendar, Activity, Brain, FileText, MessageSquare, CheckCircle,
  User, BookOpen, GraduationCap, ArrowRightCircle, MoreVertical
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';
import './JuryDashboard.css';

const PERFORMANCE_DATA = [
  { name: 'Jan', evaluations: 5, score: 14.2 },
  { name: 'Feb', evaluations: 8, score: 15.5 },
  { name: 'Mar', evaluations: 12, score: 14.8 },
  { name: 'Apr', evaluations: 18, score: 16.4 },
  { name: 'May', evaluations: 15, score: 17.2 },
];

const SUCCESS_RATE_DATA = [
  { name: 'Excellent (≥18)', value: 18, color: '#10b981' }, // Emerald 500
  { name: 'Très bien (16-17)', value: 27, color: '#3b82f6' }, // Blue 500
  { name: 'Bien (14-15)', value: 33, color: '#8b5cf6' }, // Violet 500
  { name: 'Passable (12-13)', value: 18, color: '#f59e0b' }, // Amber 500
  { name: 'Insuffisant (<12)', value: 4, color: '#ef4444' }, // Red 500
];

const GRADE_DISTRIBUTION = [
  { range: '0-5', count: 0, color: '#ef4444' }, // Red 500
  { range: '6-10', count: 5, color: '#f97316' }, // Orange 500
  { range: '11-15', count: 31, color: '#f59e0b' }, // Amber 500
  { range: '16-18', count: 51, color: '#3b82f6' }, // Blue 500
  { range: '19-20', count: 13, color: '#10b981' }, // Emerald 500
];

const CRITERIA_DATA = [
  { subject: 'Innovation', me: 18, avg: 14 },
  { subject: 'Méthodologie', me: 16, avg: 15 },
  { subject: 'Qualité Tech', me: 19, avg: 16 },
  { subject: 'Présentation', me: 17, avg: 16 },
  { subject: 'Documentation*', me: 15, avg: 15 },
];

const RECENT_ACTIVITIES = [
  {
    id: 1,
    title: 'Nouvelle évaluation assignée',
    time: 'Il y a 2 heures',
    desc: 'Le projet de Sara Kamali "Blockchain Certificate Verification" nécessite votre évaluation',
    icon: <Clock size={16} color="#f59e0b" />,
    color: '#f59e0b'
  },
  {
    id: 2,
    title: 'Soutenance programmée',
    time: 'Il y a 5 heures',
    desc: "Soutenance d'Ahmed Benali prévue le 5 Mai à 09:00 en salle A-204",
    icon: <Calendar size={16} color="#3b82f6" />,
    color: '#3b82f6'
  },
  {
    id: 3,
    title: 'Nouveau message',
    time: 'Hier',
    desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation',
    icon: <MessageSquare size={16} color="#6366f1" />,
    color: '#6366f1'
  },
  {
    id: 4,
    title: 'Mise à jour du système',
    time: 'Il y a 2 jours',
    desc: 'Nouvelles fonctionnalités d\'analyse prédictive disponibles dans le tableau de bord',
    icon: <Activity size={16} color="#10b981" />,
    color: '#10b981'
  },
  {
    id: 5,
    title: 'Évaluation complétée',
    time: 'Il y a 3 jours',
    desc: 'Votre évaluation pour Mohamed Alaoui a été soumise avec succès',
    icon: <CheckCircle size={16} color="#10b981" />,
    color: '#10b981'
  },
  {
    id: 6,
    title: 'Date limite proche',
    time: 'Il y a 3 jours',
    desc: 'L\'évaluation de Fatima Zahra doit être complétée avant le 7 Mai',
    icon: <Clock size={16} color="#ef4444" />,
    color: '#ef4444'
  },
  {
    id: 7,
    title: 'Paramètres modifiés',
    time: 'Il y a 1 semaine',
    desc: 'Vos préférences de notification ont été mises à jour',
    icon: <User size={16} color="#94a3b8" />,
    color: '#94a3b8'
  }
];

const JuryDashboard = () => {
  const { session, theme } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  // Resolve system theme if necessary
  const getResolvedTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  };

  const currentTheme = getResolvedTheme();

  // Helper to get high-contrast text color based on theme
  const getChartColors = () => {
    const isDark = currentTheme === 'dark';
    return {
      text: isDark ? '#FFFFFF' : '#000000',
      grid: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.2)',
      radarMe: isDark ? '#60a5fa' : '#000000',   // Noir pour la série principale en mode clair
      radarAvg: isDark ? '#94a3b8' : '#666666',
      tooltipBg: isDark ? '#1e293b' : '#000000',
      tooltipText: isDark ? '#f1f5f9' : '#ffffff'
    };
  };

  const colors = getChartColors();

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setShowSuccessCard(false);
    
    // Simulate API call for report generation
    setTimeout(() => {
      setIsGenerating(false);
      setShowSuccessCard(true);
      
      // Auto-hide after 10 seconds
      setTimeout(() => setShowSuccessCard(false), 10000);
    }, 2000);
  };

  const handleDownloadReport = () => {
    // Simulate downloading a PDF file
    alert('Le téléchargement de votre rapport (Format PDF) a commencé...');
    setShowSuccessCard(false);
  };

  return (
    <div className="jd-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Success Notification Card */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="jd-success-card-top mb-4 d-flex align-items-center justify-content-between shadow-lg"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="icon-box bg-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <CheckCircle size={24} color="#ffffff" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Rapport Prêt !</h6>
                  <p className="extra-small mb-0 opacity-75">Le rapport analytique a été généré avec succès et est prêt pour le téléchargement.</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Button 
                  size="sm" 
                  variant="success" 
                  className="extra-small fw-bold px-3 py-1 border-0 shadow-sm"
                  onClick={handleDownloadReport}
                >
                  Télécharger
                </Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                    <MoreVertical size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0 rounded-3">
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Supprimer</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Archiver</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Mettre en favori</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button size="sm" variant="link" className="text-muted p-0" onClick={() => setShowSuccessCard(false)}>Fermer</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Header Section */}
        <header className="jd-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-1">Tableau de Bord Analytique</h1>
            <p className="mb-0 fw-bold" style={{ color: 'var(--jd-text-muted)' }}>
              Bienvenue, Dr. {session?.name || 'Jane Doe'} • Dernière connexion : Aujourd'hui à 14:32
            </p>
          </motion.div>
          <div className="d-flex gap-3">
            <Button 
              className="btn-pro-outline d-flex align-items-center gap-2"
              onClick={() => navigate('/jury/schedule')}
            >
              <Calendar size={18} color="#8b5cf6" /> Programmer Soutenance
            </Button>
            <Button 
              className="btn-pro-primary d-flex align-items-center gap-2 shadow-sm border-0"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                  <Activity size={18} color="#f59e0b" />
                </motion.div>
              ) : (
                <Activity size={18} color="#f59e0b" />
              )}
              {isGenerating ? 'Génération...' : 'Générer Rapport'}
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
                  <p className="extra-small fw-bold mb-0" style={{ color: 'var(--jd-text-muted)' }}>Évolution mensuelle des évaluations et scores moyens</p>
                </div>
                <Form.Select 
                  size="sm" 
                  className="jd-select-match extra-small fw-bold border shadow-sm"
                  defaultValue="5months"
                >
                  <option value="1month">Dernier Mois</option>
                  <option value="5months">Derniers 5 Mois</option>
                  <option value="year">Cette Année</option>
                </Form.Select>
              </div>
              <div style={{ height: '300px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorEval" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} strokeWidth={1.5} />
                    <XAxis dataKey="name" axisLine={{ stroke: colors.grid }} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 800}} />
                    <YAxis axisLine={{ stroke: colors.grid }} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 800}} domain={[0, 20]} ticks={[0, 5, 10, 15, 20]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipText, border: `1px solid ${colors.grid}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="evaluations" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEval)" name="Évaluations" />
                    <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" name="Score" />
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
                <p className="extra-small fw-bold mb-0" style={{ color: 'var(--jd-text-muted)' }}>Répartition par niveau d'appréciation</p>
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
                      label={({ value }) => `${value}%`}
                      labelLine={false}
                      isAnimationActive={true}
                      label={{ fill: '#FFFFFF', fontSize: 12, fontWeight: 900 }}
                    >
                      {SUCCESS_RATE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="position-absolute top-50 start-50 translate-middle text-center" style={{ pointerEvents: 'none' }}>
                  <div className="h3 fw-black mb-0" style={{ color: colors.text }}>95.6%</div>
                  <div className="extra-small fw-bold" style={{ color: colors.text, opacity: 0.7 }}>GLOBAL</div>
                </div>
              </div>
              <div className="mt-3">
                {SUCCESS_RATE_DATA.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                    <div className="d-flex align-items-center gap-2 extra-small fw-bold" style={{ color: item.color }}>
                      <div className="dot" style={{ backgroundColor: item.color }}></div>
                      {item.name}
                    </div>
                    <span className="extra-small fw-black" style={{ color: item.color }}>{item.value}%</span>
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
                <p className="extra-small fw-bold mb-0" style={{ color: 'var(--jd-text-muted)' }}>Répartition des scores attribués</p>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={GRADE_DISTRIBUTION} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} strokeWidth={1.5} />
                    <XAxis dataKey="range" axisLine={{ stroke: colors.grid }} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 800}} />
                    <YAxis axisLine={{ stroke: colors.grid }} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 800}} domain={[0, 60]} ticks={[0, 15, 30, 45, 60]} />
                    <Tooltip 
                      cursor={{fill: 'rgba(0,0,0,0.05)'}} 
                      contentStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipText, border: `1px solid ${colors.grid}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40} name="Projets">
                      {GRADE_DISTRIBUTION.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color} 
                          fillOpacity={currentTheme === 'dark' ? 1 : 0.9} 
                        />
                      ))}
                      <LabelList 
                        dataKey="count" 
                        position="top" 
                        formatter={(val) => val > 0 ? `${val}%` : ''} 
                        style={{ 
                          fontSize: '12px', 
                          fontWeight: '800', 
                          fill: '#64748b'
                        }} 
                      />
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
                <p className="extra-small fw-bold mb-0" style={{ color: 'var(--jd-text-muted)' }}>Comparaison avec la moyenne</p>
              </div>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={CRITERIA_DATA}>
                    <PolarGrid strokeOpacity={0.35} stroke={currentTheme === 'light' ? '#94a3b8' : '#475569'} strokeWidth={1} />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 800, fill: '#64748b'}} />
                    <Radar name="Moi" dataKey="me" stroke={colors.radarMe} fill={colors.radarMe} fillOpacity={0.55} strokeWidth={3} />
                    <Radar name="Jury" dataKey="avg" stroke={currentTheme === 'light' ? '#64748b' : '#94a3b8'} fill={currentTheme === 'light' ? '#64748b' : '#94a3b8'} fillOpacity={0.25} strokeWidth={2} strokeDasharray="4 4" />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: '900', color: currentTheme === 'light' ? '#000000' : '#f1f5f9' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: colors.tooltipBg, color: colors.tooltipText, border: `1px solid ${colors.grid}`, borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
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
                {['Tous', 'Prêt', 'En attente', 'Évalué'].map((status) => {
                  const isActive = activeTab === status.toLowerCase();
                  return (
                    <Button 
                      key={status}
                      variant="none"
                      size="sm"
                      className={`rounded-pill px-4 py-2 extra-small fw-bold shadow-sm transition-all ${
                        isActive 
                          ? 'bg-primary text-white border-primary' 
                          : 'jd-filter-btn-inactive'
                      }`}
                      onClick={() => setActiveTab(status.toLowerCase())}
                    >
                      {status}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="d-block d-xl-none">
              <ProjectCard name="Ahmed Benali" title="AI-Powered Student System" sup="Prof. Martin" date="15/04/2026" status="Ready" onReview={() => navigate('/jury/evaluation')} />
              <ProjectCard name="Sara Kamali" title="Blockchain Certificate Verif." sup="Dr. Chen" date="18/04/2026" status="Pending" onReview={() => navigate('/jury/evaluation')} />
            </div>

            {/* Desktop Table */}
            <div className="d-none d-xl-block">
              <div className="table-responsive">
                <Table className="jd-table-pro">
                  <thead>
                    <tr>
                      <th style={{ color: 'var(--jd-text)' }}><User size={14} className="me-2 text-primary" />Étudiant</th>
                      <th style={{ color: 'var(--jd-text)' }}><BookOpen size={14} className="me-2 text-info" />Titre du Projet</th>
                      <th style={{ color: 'var(--jd-text)' }}><Users size={14} className="me-2 text-success" />Encadrant</th>
                      <th style={{ color: 'var(--jd-text)' }}><Calendar size={14} className="me-2 text-warning" />Date</th>
                      <th style={{ color: 'var(--jd-text)' }} className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <ProjectRow name="Ahmed Benali" title="AI-Powered Student System" sup="Prof. Martin" date="15/04/2026" status="Ready" onReview={() => navigate('/jury/evaluation')} />
                    <ProjectRow name="Sara Kamali" title="Blockchain Certificate Verif." sup="Dr. Chen" date="18/04/2026" status="Pending" onReview={() => navigate('/jury/evaluation')} />
                    <ProjectRow name="Mohamed Alaoui" title="IoT Smart Campus Solution" sup="Prof. Smith" date="10/04/2026" status="Evaluated" onReview={() => navigate('/jury/evaluation')} />
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <Card className="jd-chart-card h-100">
              <h5 className="jd-section-title d-flex align-items-center gap-2">
                <Activity size={20} color="#3b82f6" /> Dernières Activités
              </h5>
              <div className="jd-ai-insight mb-4">
                <div className="extra-small fw-black text-primary mb-1">ALERTE IA</div>
                <p className="extra-small mb-0 fw-bold" style={{ color: 'var(--jd-text)' }}>Le projet "IoT Smart Campus" nécessite votre attention.</p>
              </div>
              <div className="jd-activity-list">
                {RECENT_ACTIVITIES.map((activity) => (
                  <ActivityItem 
                    key={activity.id}
                    icon={activity.icon} 
                    title={activity.title} 
                    time={activity.time}
                    desc={activity.desc} 
                    color={activity.color}
                  />
                ))}
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
      <div className={`jd-trend-badge ${trendUp ? 'jd-trend-up' : 'jd-trend-down'} d-flex align-items-center fw-bold`}>
        {trendUp ? <TrendingUp size={14} className="me-1" /> : <TrendingDown size={14} className="me-1" />}
        {trend}
      </div>
    </div>
    <div className="extra-small fw-bold text-uppercase tracking-widest mb-1" style={{ color: 'var(--jd-text-muted)' }}>{label}</div>
    <div className="h2 fw-black mb-0" style={{ color: 'var(--jd-text)' }}>{value}</div>
  </motion.div>
);

const ActivityItem = ({ icon, title, time, desc, color }) => (
  <div className="jd-activity-item d-flex align-items-start gap-3 mb-3 position-relative">
    <div className="jd-activity-icon p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: `${color}15`, color: color, width: '36px', height: '36px' }}>
      {icon}
    </div>
    <div className="flex-grow-1 overflow-hidden pe-4">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="extra-small fw-bold text-navy">{title}</div>
        <div className="extra-small text-muted" style={{ fontSize: '10px' }}>{time}</div>
      </div>
      <div className="extra-small text-muted text-wrap" style={{ lineHeight: '1.4' }}>{desc}</div>
    </div>
    <div className="position-absolute top-0 end-0">
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
          <MoreVertical size={14} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
          <Dropdown.Item>Voir les détails</Dropdown.Item>
          <Dropdown.Item>Marquer comme lu</Dropdown.Item>
          <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

const ProjectRow = ({ name, title, sup, date, status, onReview }) => (
  <tr>
    <td>
      <div className="d-flex align-items-center gap-3">
        <div className="avatar-xs bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0" style={{ width: '28px', height: '28px', fontSize: '10px' }}>{name.charAt(0)}</div>
        <div className="small fw-bold text-navy">{name}</div>
      </div>
    </td>
    <td>
      <div className="d-flex align-items-center gap-2">
        <BookOpen size={14} className="text-info flex-shrink-0" />
        <div className="extra-small fw-black" style={{ color: 'var(--jd-text)', lineHeight: '1.4' }}>{title}</div>
      </div>
    </td>
    <td>
      <div className="d-flex align-items-center gap-2">
        <Users size={14} className="text-success flex-shrink-0" />
        <div className="extra-small fw-bold" style={{ color: 'var(--jd-text-muted)' }}>{sup}</div>
      </div>
    </td>
    <td>
      <div className="d-flex align-items-center gap-2">
        <Calendar size={14} className="text-warning flex-shrink-0" />
        <div className="extra-small fw-black" style={{ color: 'var(--jd-text-muted)' }}>{date}</div>
      </div>
    </td>
    <td className="text-end">
      <Button variant="link" className="p-0 text-primary fw-bold text-decoration-none extra-small d-inline-flex align-items-center gap-1" onClick={onReview}>
        Review <ArrowRightCircle size={14} style={{ color: '#ec4899' }} />
      </Button>
    </td>
  </tr>
);

const ProjectCard = ({ name, title, sup, date, status, onReview }) => (
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
    <div className="extra-small fw-black mb-2 text-wrap d-flex align-items-center gap-2" style={{ color: 'var(--jd-text)' }}>
      <BookOpen size={14} className="text-primary" /> {title}
    </div>
    <div className="d-flex justify-content-between align-items-center mt-3 border-top pt-2">
      <div className="extra-small opacity-75 d-flex flex-column gap-1" style={{ color: 'var(--jd-text-muted)' }}>
        <span className="d-flex align-items-center gap-1"><Users size={12} color="#6366f1" /> {sup}</span>
        <span className="d-flex align-items-center gap-1"><Calendar size={12} color="#6366f1" /> {date}</span>
      </div>
      <Button variant="primary" size="sm" className="rounded-3 extra-small px-3 py-1 shadow-sm border-0 d-flex align-items-center gap-2" onClick={onReview}>
        Ouvrir <ArrowRightCircle size={14} />
      </Button>
    </div>
  </Card>
);

export default JuryDashboard;

