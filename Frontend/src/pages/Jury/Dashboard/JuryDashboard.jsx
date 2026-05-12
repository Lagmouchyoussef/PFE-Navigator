import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, Dropdown 
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Star, Users, 
  Clock, Calendar, Activity, Brain, FileText, MessageSquare, CheckCircle,
  User, BookOpen, GraduationCap, ArrowRightCircle, MoreVertical, Briefcase
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

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
  { name: 'Bien (14-15)', value: 33, color: '#8b5cf6' },
  { name: 'Passable (12-13)', value: 18, color: '#f59e0b' },
  { name: 'Insuffisant (<12)', value: 4, color: '#ef4444' },
];

const RECENT_ACTIVITIES = [
  { id: 1, title: 'Nouvelle évaluation assignée', time: 'Il y a 2 heures', desc: 'Le projet "Blockchain Certificate Verification" nécessite votre évaluation', icon: <Clock size={16} />, color: 'warning' },
  { id: 2, title: 'Soutenance programmée', time: 'Il y a 5 heures', desc: "Soutenance prévue le 5 Mai à 09:00 en salle A-204", icon: <Calendar size={16} />, color: 'primary' },
  { id: 3, title: 'Nouveau message', time: 'Hier', desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation', icon: <MessageSquare size={16} />, color: 'info' },
  { id: 4, title: 'Mise à jour du système', time: 'Il y a 2 jours', desc: 'Nouvelles fonctionnalités disponibles dans le tableau de bord', icon: <Activity size={16} />, color: 'success' },
];

const JuryDashboard = () => {
  const { theme } = useApp();
  const navigate = useNavigate();

  return (
    <div className="jury-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Tableau de Bord Jury</h2>
            <p className="text-muted small mb-0">Suivez vos évaluations et plannings de soutenances.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Calendar size={18} /> Mon Calendrier
            </Button>
            <Button 
              variant="primary" 
              className="fw-bold small px-4 py-2 border-0 shadow-sm rounded-pill d-flex align-items-center gap-2"
              style={{ backgroundColor: '#2563eb' }}
              onClick={() => navigate('/jury/evaluation')}
            >
              <GraduationCap size={18} /> Évaluer un Projet
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Projets Assignés', value: '12', icon: <Briefcase />, color: 'primary', trend: '+2' },
            { label: 'Évaluations Faites', value: '8', icon: <CheckCircle />, color: 'success', trend: '66%' },
            { label: 'Soutenances', value: '4', icon: <Calendar />, color: 'warning', trend: 'Semaine' },
            { label: 'Moyenne Donnée', value: '15.4', icon: <Star />, color: 'info', trend: '+1.2' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`jury-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
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

        {/* Charts & Activities */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <div className="jury-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Activité d'Évaluation</h5>
              <div style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_DATA}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
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
                    <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={4}>
            <div className="jury-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Activités Récentes</h5>
              <div className="d-flex flex-column gap-3">
                {RECENT_ACTIVITIES.map((act) => (
                  <div key={act.id} className="p-3 rounded-4 border bg-surface-alt hover-bg-surface transition-all cursor-pointer">
                    <div className="d-flex gap-3">
                      <div className={`p-2 rounded-3 bg-${act.color} bg-opacity-10 text-${act.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                        {act.icon}
                      </div>
                      <div>
                        <div className="small fw-bold mb-1">{act.title}</div>
                        <p className="extra-small text-muted mb-1">{act.desc}</p>
                        <div className="extra-small text-muted opacity-75">{act.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-100 mt-4 extra-small fw-bold text-primary text-decoration-none">Voir tout l'historique</Button>
            </div>
          </Col>
        </Row>

        {/* Assigned Projects Table Preview */}
        <div className="jury-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <h5 className="fw-bold mb-0">Projets en Attente d'Évaluation</h5>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none">Gérer tous les projets</Button>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 jury-table">
              <thead>
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Étudiant / Projet</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Thématique</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Délai</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Amin Mansouri', project: 'EcoTrack Blockchain', category: 'Blockchain', deadline: 'Dans 2j', status: 'Pending' },
                  { name: 'Sara Bennani', project: 'Smart City API', category: 'IoT', deadline: 'Dans 5j', status: 'In Review' },
                  { name: 'Khalid Tazi', project: 'CyberSafe VPN', category: 'Security', deadline: 'Demain', status: 'Urgent' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div className="small fw-bold">{row.name}</div>
                          <div className="extra-small text-muted">{row.project}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {row.category}
                      </Badge>
                    </td>
                    <td className="py-3 small text-muted">{row.deadline}</td>
                    <td className="py-3">
                      <Badge bg={row.status === 'Urgent' ? 'danger' : 'warning'} className="extra-small rounded-pill">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Button variant="link" className="p-0 text-primary extra-small fw-bold text-decoration-none">Détails <ArrowRightCircle size={14} className="ms-1" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <style>{`
        .jury-modern-layout {
          color: var(--text-primary);
        }
        .jury-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .jury-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        
        h2, h3, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default JuryDashboard;
