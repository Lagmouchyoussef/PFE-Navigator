import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Table, Button, Dropdown 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Users, CheckCircle, 
  Clock, Download, Calendar, MessageSquare,
  Activity, Star, ChevronRight, FileText, 
  Table as TableIcon, File as FileIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Radar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { useApp } from '../../../context/AppContext';

const EvaluationPage = () => {
  const { scores, pfeFinalGrade, isGradesPublished, pfeWeights } = useApp();
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
    <div className="evaluation-page-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Evaluation & Performance</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Track your project assessments and academic performance</p>
          </motion.div>
          <Dropdown align="end">
            <Dropdown.Toggle 
              className="btn-premium d-flex align-items-center gap-2 px-4 shadow-sm border-0 no-caret"
            >
              <Download size={18} /> Export Results
            </Dropdown.Toggle>

            <Dropdown.Menu className="border-0 shadow-lg rounded-4 p-2 mt-2">
              <Dropdown.Item 
                className="d-flex align-items-center gap-3 py-2 rounded-3"
                onClick={() => alert("Génération du rapport PDF...")}
              >
                <div className="p-2 bg-danger-soft text-danger rounded-3">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="fw-bold small">Export PDF</div>
                  <div className="extra-small text-muted fw-bold">Document Portable</div>
                </div>
              </Dropdown.Item>

              <Dropdown.Item 
                className="d-flex align-items-center gap-3 py-2 rounded-3"
                onClick={() => alert("Exportation CSV en cours...")}
              >
                <div className="p-2 bg-success-soft text-success rounded-3">
                  <TableIcon size={18} />
                </div>
                <div>
                  <div className="fw-bold small">Export CSV</div>
                  <div className="extra-small text-muted fw-bold">Feuille de calcul</div>
                </div>
              </Dropdown.Item>

              <Dropdown.Item 
                className="d-flex align-items-center gap-3 py-2 rounded-3"
                onClick={() => alert("Génération du document Word...")}
              >
                <div className="p-2 bg-primary-soft text-primary rounded-3">
                  <FileIcon size={18} />
                </div>
                <div>
                  <div className="fw-bold small">Export Word</div>
                  <div className="extra-small text-muted fw-bold">Document Microsoft</div>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
                <Card className="glass-card border-0 shadow-sm border p-3">
                  <Card.Body className="p-2">
                    <div className="d-flex justify-content-between mb-4">
                      <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color}`}>
                        {stat.icon}
                      </div>
                      <div className="extra-small text-muted fw-bold opacity-50">LIVE</div>
                    </div>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-75">{stat.label}</div>
                    <div className="d-flex align-items-baseline gap-2">
                      <h3 className="fw-bold mb-0 text-navy">{stat.value}</h3>
                      <span className="extra-small text-muted fw-bold opacity-50">{stat.sub}</span>
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
            <Card className="glass-card border shadow-sm border p-4 h-100">
              <Card.Body className="p-2">
                <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                  <Activity size={18} className="text-primary" /> Performance Overview
                </h6>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 600 }}
                      />
                      <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="glass-card border shadow-sm border p-4 h-100">
              <Card.Body className="p-2">
                <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                  <Star size={18} className="text-warning" /> Criteria Assessment
                </h6>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={criteriaData}>
                      <PolarGrid stroke="var(--color-border)" opacity={0.5} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Student" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Grade Breakdown Table */}
        <Card className="glass-card border shadow-sm border overflow-hidden mb-5">
          <Card.Body className="p-0">
            <div className="p-4 border-bottom bg-white">
              <h6 className="fw-bold text-navy mb-0">Grade Breakdown</h6>
            </div>
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Component</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Weight</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Score</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Points Earned</th>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {!isGradesPublished ? (
                    <tr>
                      <td colSpan="5" className="py-5 text-center">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <div className="p-3 bg-warning-soft text-warning rounded-circle shadow-sm">
                            <Clock size={32} />
                          </div>
                          <h6 className="fw-bold text-navy mb-1">En attente de publication officielle</h6>
                          <p className="extra-small text-muted fw-bold mb-0 opacity-75 max-w-400 mx-auto">
                            Vos notes de PFE (Encadrant et Jury) ont été soumises mais restent confidentielles jusqu'à la validation finale par l'administration.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      <tr className="border-bottom border-light border-opacity-10 bg-primary-soft bg-opacity-10">
                        <td className="px-4 py-4">
                          <div className="fw-bold small text-primary">Note Encadrant (Contrôle Continu)</div>
                        </td>
                        <td><span className="extra-small fw-bold text-muted">{pfeWeights.supervisor}%</span></td>
                        <td>
                          <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${scores.pfeSupervisor === null ? 'bg-surface-alt text-muted' : 'bg-success-soft text-success'}`}>
                            {scores.pfeSupervisor !== null ? `${scores.pfeSupervisor}/20` : 'En attente'}
                          </Badge>
                        </td>
                        <td><span className="fw-bold text-navy small">{scores.pfeSupervisor !== null ? (scores.pfeSupervisor * (pfeWeights.supervisor / 100)).toFixed(2) : '--'}</span></td>
                        <td className="px-4 py-4 text-end" style={{ width: '200px' }}>
                          <ProgressBar now={scores.pfeSupervisor ? (scores.pfeSupervisor / 20) * 100 : 0} variant="success" style={{ height: '6px' }} className="rounded-pill bg-white border-0" />
                        </td>
                      </tr>
                      <tr className="border-bottom border-light border-opacity-10 bg-info-soft bg-opacity-10">
                        <td className="px-4 py-4">
                          <div className="fw-bold small text-info">Note Jury (Soutenance PFE)</div>
                        </td>
                        <td><span className="extra-small fw-bold text-muted">{pfeWeights.jury}%</span></td>
                        <td>
                          <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${scores.pfeJury === null ? 'bg-surface-alt text-muted' : 'bg-success-soft text-success'}`}>
                            {scores.pfeJury !== null ? `${scores.pfeJury}/20` : 'En attente'}
                          </Badge>
                        </td>
                        <td><span className="fw-bold text-navy small">{scores.pfeJury !== null ? (scores.pfeJury * (pfeWeights.jury / 100)).toFixed(2) : '--'}</span></td>
                        <td className="px-4 py-4 text-end" style={{ width: '200px' }}>
                          <ProgressBar now={scores.pfeJury ? (scores.pfeJury / 20) * 100 : 0} variant="info" style={{ height: '6px' }} className="rounded-pill bg-white border-0" />
                        </td>
                      </tr>
                      <tr className="bg-surface-alt align-middle">
                        <td colSpan="3" className="px-4 py-4 fw-bold text-navy">Note Finale PFE (Moyenne Consolidée)</td>
                        <td colSpan="2" className="px-4 py-4 text-end">
                          <div className="d-flex align-items-baseline justify-content-end gap-2">
                            <h3 className="fw-bold text-primary mb-0">{pfeFinalGrade !== null ? pfeFinalGrade.toFixed(2) : '--'}</h3>
                            <span className="text-muted extra-small fw-bold">/ 20</span>
                          </div>
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Evaluation History Section */}
        <h4 className="fw-bold text-navy mb-4">Evaluation History</h4>
        <div className="eval-history-grid d-flex flex-column gap-4">
          {history.map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="glass-card border shadow-sm border p-4">
                <Card.Body className="p-0">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <div className="d-flex align-items-center gap-3 mb-4">
                        <h5 className="fw-bold text-navy mb-0">{item.title}</h5>
                        <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${item.status === 'Completed' ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="d-flex flex-wrap gap-4 mb-4">
                        <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                          <Users size={14} className="text-primary" /> {item.evaluator}
                        </div>
                        <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                          <Calendar size={14} className="text-primary" /> {item.date}
                        </div>
                        {item.status === 'Completed' && (
                          <div className="d-flex align-items-center gap-2 extra-small text-success fw-bold">
                            <Star size={14} /> Score: {item.score}/100
                          </div>
                        )}
                      </div>
                      <div className="p-3 bg-surface-alt rounded-4 border-start border-4 border-primary shadow-sm">
                        <div className="extra-small fw-bold text-muted text-uppercase mb-2 opacity-75">Supervisor Comments:</div>
                        <p className="small text-navy mb-0 fw-bold italic opacity-75">"{item.comments}"</p>
                      </div>
                    </Col>
                    <Col md={4} className="text-center mt-4 mt-md-0">
                      {item.status === 'Completed' ? (
                        <div className="p-4 rounded-circle border border-primary border-4 d-flex flex-column align-items-center justify-content-center mx-auto shadow-sm" style={{ width: '120px', height: '120px' }}>
                          <div className="h2 fw-bold text-primary mb-0">{item.score}</div>
                          <div className="extra-small text-muted fw-bold">/ 100</div>
                        </div>
                      ) : (
                        <div className="p-4 rounded-4 bg-surface-alt border d-flex flex-column align-items-center justify-content-center mx-auto shadow-sm" style={{ width: '120px', height: '120px' }}>
                          <Clock size={32} className="text-muted opacity-25 mb-2" />
                          <div className="extra-small text-muted fw-bold text-center">PENDING</div>
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


