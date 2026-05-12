import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Target, Clock, 
  Award, PieChart as PieChartIcon, ArrowUpRight,
  Download, Filter, ChevronRight, BarChart as BarChartIcon, Activity
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, ProgressBar, Modal, Form } from 'react-bootstrap';

const CATEGORY_DATA = [
  { name: 'Technologie', value: 142, color: '#3b82f6' },
  { name: 'Design', value: 89, color: '#8b5cf6' },
  { name: 'Recherche', value: 67, color: '#10b981' },
  { name: 'Sciences', value: 44, color: '#f59e0b' },
];

const SCORE_DISTRIBUTION = [
  { range: '18-20', count: 15, color: '#10b981' },
  { range: '14-17', count: 45, color: '#3b82f6' },
  { range: '10-13', count: 30, color: '#f59e0b' },
  { range: '0-9', count: 10, color: '#ef4444' },
];

const MONTHLY_SUBMISSIONS = [
  { month: 'Jan', count: 30 }, { month: 'Fév', count: 45 }, { month: 'Mar', count: 55 },
  { month: 'Avr', count: 40 }, { month: 'Mai', count: 75 }, { month: 'Juin', count: 60 },
  { month: 'Juil', count: 50 }, { month: 'Août', count: 35 }, { month: 'Sep', count: 65 },
  { month: 'Oct', count: 80 }, { month: 'Nov', count: 90 }, { month: 'Déc', count: 100 },
];

const AnalyticsCenter = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div className="analytics-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Centre d'Analyses</h2>
            <p className="text-muted small mb-0">Statistiques détaillées et indicateurs de performance académique.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Exporter
            </Button>
            <Button 
              variant="primary" 
              className="fw-bold small px-4 py-2 border-0 shadow-sm rounded-pill d-flex align-items-center gap-2" 
              style={{ backgroundColor: '#2563eb' }} 
              onClick={() => setShowFilterModal(true)}
            >
              <Filter size={18} /> Filtrer par période
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Taux de Réussite', value: '87.5%', icon: <Target />, color: 'primary', trend: '+2.4%' },
            { label: 'Temps d\'Éval.', value: '4.2j', icon: <Clock />, color: 'info', trend: '-12%' },
            { label: 'Moyenne Générale', value: '14.8/20', icon: <Award />, color: 'warning', trend: '+3%' },
            { label: 'Participation', value: '92.1%', icon: <Activity />, color: 'danger', trend: '+5%' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`analytics-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
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

        {/* Charts Section 1 */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <div className="analytics-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Distribution des Notes</h5>
              <div className="space-y-4">
                {SCORE_DISTRIBUTION.map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between extra-small mb-2 fw-bold">
                      <span className="text-muted">Plage {item.range}</span>
                      <span className="opacity-75">{item.count}% des étudiants</span>
                    </div>
                    <ProgressBar now={item.count} style={{ height: '8px', backgroundColor: 'var(--background)' }} className="rounded-pill">
                      <ProgressBar now={item.count} style={{ backgroundColor: item.color }} className="rounded-pill" />
                    </ProgressBar>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-4 bg-surface-alt border text-center">
                <div className="extra-small text-muted fw-bold text-uppercase mb-1">Observation Globale</div>
                <div className="small fw-bold">Performance supérieure de 12% par rapport à l'année dernière.</div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="analytics-glass-card p-4 rounded-4 shadow-sm h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Evolution des Soumissions</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MONTHLY_SUBMISSIONS}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .analytics-modern-layout {
          color: var(--text-primary);
        }
        .analytics-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        
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

export default AnalyticsCenter;
