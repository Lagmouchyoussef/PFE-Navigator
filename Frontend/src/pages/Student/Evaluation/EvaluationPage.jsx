import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Table, Button 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Users, CheckCircle, 
  Clock, Download, Calendar, MessageSquare,
  Activity, Star, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import './EvaluationPage.css';

const EvaluationPage = () => {
  const performanceData = [
    { name: 'Proposal', score: 85 },
    { name: 'Interim', score: 88 },
    { name: 'Final', score: 0 },
    { name: 'Defense', score: 0 },
  ];

  const criteriaData = [
    { subject: 'Technical Quality', A: 90, fullMark: 100 },
    { subject: 'Innovation', A: 75, fullMark: 100 },
    { subject: 'Documentation', A: 85, fullMark: 100 },
    { subject: 'Implementation', A: 95, fullMark: 100 },
    { subject: 'Presentation', A: 80, fullMark: 100 },
  ];

  const breakdownData = [
    { component: 'Proposal', weight: '15%', score: '85/100', points: '12.75', progress: 85, status: 'Completed' },
    { component: 'Interim Report', weight: '20%', score: '88/100', points: '17.60', progress: 88, status: 'Completed' },
    { component: 'Final Report', weight: '35%', score: 'Pending', points: '0.00', progress: 0, status: 'Pending' },
    { component: 'Defense Presentation', weight: '20%', score: 'Pending', points: '0.00', progress: 0, status: 'Pending' },
    { component: 'Supervisor Evaluation', weight: '10%', score: 'Pending', points: '0.00', progress: 0, status: 'Pending' },
  ];

  const history = [
    {
      title: 'Project Proposal',
      status: 'Completed',
      evaluator: 'Dr. Sarah Smith',
      date: '2026-03-20',
      score: '85',
      comments: 'Excellent problem statement and methodology. Good research background.'
    },
    {
      title: 'Interim Report',
      status: 'Completed',
      evaluator: 'Dr. Sarah Smith',
      date: '2026-04-22',
      score: '88',
      comments: 'Strong progress on implementation. Technical sections are well-written.'
    },
    {
      title: 'Final Report',
      status: 'Pending',
      evaluator: 'Dr. Sarah Smith',
      date: '2026-05-15',
      score: '-',
      comments: 'Awaiting submission'
    },
    {
      title: 'Final Defense',
      status: 'Pending',
      evaluator: 'Evaluation Committee',
      date: '2026-05-20',
      score: '-',
      comments: 'Scheduled for May 20, 2026'
    }
  ];

  return (
    <div className="eval-page-layout p-4">
      <Container fluid className="px-0">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="eval-title mb-1">Evaluation & Grading</h1>
            <p className="eval-subtitle text-muted mb-0">Track your project assessments and academic performance</p>
          </motion.div>
          <Button 
            className="btn-export d-flex align-items-center gap-2 px-4 py-2"
            onClick={() => alert("Génération du rapport de notes PDF...")}
          >
            <Download size={18} /> Export Results
          </Button>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Current Grade', value: '30.4', sub: 'out of 100', icon: <Award size={24} />, color: 'primary' },
            { label: 'Completed', value: '2/4', sub: 'Evaluations', icon: <CheckCircle size={24} />, color: 'success' },
            { label: 'Average Score', value: '86.5', sub: '%', icon: <TrendingUp size={24} />, color: 'info' },
            { label: 'Class Rank', value: '12th', sub: 'out of 45', icon: <Users size={24} />, color: 'warning' },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="eval-stat-card border-0 shadow-sm h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <div className={`eval-icon-wrap bg-${stat.color}-soft text-${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="text-muted extra-small fw-bold">LIVE DATA</div>
                    </div>
                    <div className="small text-muted fw-medium mb-1">{stat.label}</div>
                    <div className="d-flex align-items-baseline gap-2">
                      <h2 className="fw-bold mb-0 text-navy">{stat.value}</h2>
                      <span className="extra-small text-muted">{stat.sub}</span>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mb-5">
          {/* Charts Section */}
          <Col lg={7}>
            <Card className="eval-main-card border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                  <Activity size={18} className="text-primary" /> Performance Overview
                </h6>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="eval-main-card border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                  <Star size={18} className="text-warning" /> Criteria Assessment
                </h6>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={criteriaData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Student" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Grade Breakdown Table */}
        <Card className="eval-main-card border-0 shadow-sm mb-5">
          <Card.Body className="p-0">
            <div className="p-4 border-bottom">
              <h6 className="fw-bold text-navy mb-0">Grade Breakdown</h6>
            </div>
            <div className="table-responsive">
              <Table hover className="mb-0 eval-table">
                <thead>
                  <tr>
                    <th className="ps-4">COMPONENT</th>
                    <th>WEIGHT</th>
                    <th>SCORE</th>
                    <th>POINTS EARNED</th>
                    <th className="pe-4">PROGRESS</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdownData.map((row, i) => (
                    <tr key={i} className="align-middle">
                      <td className="ps-4 py-3">
                        <div className="fw-bold small text-navy">{row.component}</div>
                      </td>
                      <td><span className="small text-muted">{row.weight}</span></td>
                      <td>
                        <Badge className={`px-3 py-1 fw-bold ${row.score === 'Pending' ? 'bg-light text-muted' : 'badge-score'}`}>
                          {row.score}
                        </Badge>
                      </td>
                      <td><span className="fw-bold text-navy small">{row.points}</span></td>
                      <td className="pe-4" style={{ width: '200px' }}>
                        <ProgressBar now={row.progress} variant="primary" style={{ height: '6px' }} className="rounded-pill bg-light" />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-light-soft align-middle">
                    <td colSpan="3" className="ps-4 py-4 fw-bold text-navy">Total Points Calculated</td>
                    <td colSpan="2" className="pe-4 py-4">
                      <div className="d-flex align-items-baseline gap-2">
                        <h4 className="fw-bold text-primary mb-0">30.35</h4>
                        <span className="text-muted small">/ 100</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Evaluation History Section */}
        <h5 className="fw-bold text-navy mb-4">Evaluation History</h5>
        <div className="eval-history-grid">
          {history.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="eval-history-card border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <h5 className="fw-bold text-navy mb-0">{item.title}</h5>
                        <Badge className={`px-3 py-1 fw-bold ${item.status === 'Completed' ? 'badge-completed' : 'badge-pending'}`}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="d-flex flex-wrap gap-4 mb-4">
                        <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium">
                          <Users size={14} className="text-primary" /> {item.evaluator}
                        </div>
                        <div className="d-flex align-items-center gap-2 extra-small text-muted fw-medium">
                          <Calendar size={14} className="text-primary" /> {item.date}
                        </div>
                        {item.status === 'Completed' && (
                          <div className="d-flex align-items-center gap-2 extra-small text-success fw-bold">
                            <Star size={14} /> Score: {item.score}/100
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-light-soft rounded-lg border-start border-4 border-primary">
                        <div className="extra-small fw-bold text-muted text-uppercase mb-2">Comments:</div>
                        <p className="small text-navy mb-0 italic">"{item.comments}"</p>
                      </div>
                    </Col>
                    <Col md={4} className="text-center mt-4 mt-md-0">
                      {item.status === 'Completed' ? (
                        <div className="eval-score-circle mx-auto">
                          <div className="eval-score-value">{item.score}</div>
                          <div className="eval-score-label">out of 100</div>
                        </div>
                      ) : (
                        <div className="eval-pending-box mx-auto d-flex flex-column align-items-center justify-content-center">
                          <Clock size={32} className="text-muted opacity-25 mb-2" />
                          <div className="extra-small text-muted fw-bold">AWAITING EVALUATION</div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default EvaluationPage;


