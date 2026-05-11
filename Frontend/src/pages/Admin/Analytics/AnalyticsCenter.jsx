import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Target, Clock, 
  Award, PieChart as PieChartIcon, ArrowUpRight,
  Download, Filter, ChevronRight, BarChart3, Activity
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

  const handleExport = () => {
    alert("Exportation des données analytiques en cours...");
  };

  return (
    <div className="analytics-simple-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Centre d'Analyses</h2>
            <p className="text-muted small mb-0">Statistiques détaillées et indicateurs de performance académique.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="bg-white text-dark fw-bold small px-3 border shadow-sm" onClick={handleExport}>
              <Download size={16} className="me-2" /> Exporter les données
            </Button>
            <Button variant="primary" className="fw-bold small px-3 border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }} onClick={() => setShowFilterModal(true)}>
              <Filter size={16} className="me-2" /> Filtrer par période
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Taux de Réussite', value: '87.5%', icon: <Target />, color: 'blue-custom', trend: '+2.4%' },
            { label: 'Temps d\'Éval.', value: '4.2j', icon: <Clock />, color: 'purple-custom', trend: '-12%' },
            { label: 'Moyenne Générale', value: '14.8/20', icon: <Award />, color: 'indigo-custom', trend: '+3%' },
            { label: 'Participation', value: '92.1%', icon: <Activity />, color: 'rose-custom', trend: '+5%' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <Card className={`border shadow-sm rounded-3 p-3 bg-white h-100 analytics-stat-card border-${stat.color}`}>
                <Card.Body className="p-0">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className={`p-2 rounded-2 bg-light text-${stat.color}`}>
                      {React.cloneElement(stat.icon, { size: 20 })}
                    </div>
                    <Badge bg="light" className={`text-${stat.trend.startsWith('+') ? 'success' : 'primary'} extra-small border`}>
                      {stat.trend}
                    </Badge>
                  </div>
                  <div className="extra-small fw-bold text-muted text-uppercase mb-1">{stat.label}</div>
                  <h3 className="fw-bold text-dark mb-0">{stat.value}</h3>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Section 1 */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <Card className="border shadow-sm rounded-3 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-4">Distribution des Notes</h5>
              <div className="space-y-4">
                {SCORE_DISTRIBUTION.map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between extra-small mb-2 fw-bold">
                      <span className="text-muted">Plage {item.range}</span>
                      <span className="text-dark">{item.count}% des étudiants</span>
                    </div>
                    <ProgressBar now={item.count} style={{ height: '8px', backgroundColor: '#f1f5f9' }} className="rounded-pill">
                      <ProgressBar now={item.count} style={{ backgroundColor: item.color }} />
                    </ProgressBar>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
          <Col lg={6}>
            <Card className="border shadow-sm rounded-3 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-4">Projets par Thématique</h5>
              <div className="d-flex flex-column flex-md-row align-items-center gap-4">
                <div style={{ height: '240px', width: '240px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={CATEGORY_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {CATEGORY_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-grow-1 w-100">
                  {CATEGORY_DATA.map((item, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between p-2 mb-2 rounded-2 bg-light border">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: item.color }}></div>
                        <span className="extra-small fw-bold text-muted">{item.name}</span>
                      </div>
                      <span className="small fw-bold text-dark">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Monthly Submissions Area Chart */}
        <Card className="border shadow-sm rounded-3 p-4 bg-white mb-5">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <div>
              <h5 className="fw-bold text-dark mb-1">Évolution des Dépôts</h5>
              <p className="extra-small text-muted mb-0">Volume de soumissions par mois sur l'année académique.</p>
            </div>
            <Badge className="badge-simple-blue">Année 2026</Badge>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SUBMISSIONS}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Container>

      {/* FILTER MODAL */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Filtrer les Analyses</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Période</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Année Académique 2026</option>
                <option>Semestre 1</option>
                <option>Semestre 2</option>
              </Form.Select>
            </Form.Group>
            <Button className="w-100 mt-3 fw-bold border-0" style={{ backgroundColor: '#2563eb' }} onClick={() => setShowFilterModal(false)}>
              Appliquer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .analytics-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .analytics-stat-card {
          border-left: 4px solid #2563eb !important;
          transition: transform 0.2s ease;
        }
        .border-blue-custom { border-left-color: #3b82f6 !important; }
        .border-purple-custom { border-left-color: #8b5cf6 !important; }
        .border-emerald-custom { border-left-color: #10b981 !important; }
        .border-amber-custom { border-left-color: #f59e0b !important; }

        .text-blue-custom { color: #3b82f6 !important; }
        .text-purple-custom { color: #8b5cf6 !important; }
        .text-emerald-custom { color: #10b981 !important; }
        .text-amber-custom { color: #f59e0b !important; }

        .analytics-stat-card:hover {
          transform: translateY(-5px);
        }
        .badge-simple-blue {
          background-color: #dbeafe !important;
          color: #1e40af !important;
          font-weight: 600;
          padding: 5px 10px;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
      `}</style>
    </div>
  );
};

export default AnalyticsCenter;
