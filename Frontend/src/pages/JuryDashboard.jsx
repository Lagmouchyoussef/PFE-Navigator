import React from 'react';
import { Container, Row, Col, Card, Badge, Button, Table } from 'react-bootstrap';
import { Briefcase, Clock, Calendar, Star, GanttChart, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext.jsx';

const JuryDashboard = () => {
  const { assignedProjects = [] } = useApp();
  const evalStats = [{v: 12, c: '#10b981'}, {v: 5, c: '#f59e0b'}, {v: 3, c: '#6366f1'}];

  return (
    <div className="dashboard-container min-vh-100 pb-5">
      <Container fluid className="px-4 px-xl-5 pt-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="d-flex justify-content-between align-items-end mb-5"
        >
          <div>
            <Badge className="badge-premium mb-2">Evaluation Panel</Badge>
            <h1 className="fw-black display-5 mb-1 tracking-tighter text-white">Academic <span className="text-gradient">Board</span></h1>
            <p className="text-muted small mb-0">Managing evaluations and defense schedules for {assignedProjects.length} PFE projects.</p>
          </div>
          <Button variant="primary" className="bg-gradient-primary border-0 rounded-pill px-4 shadow-lg d-flex align-items-center gap-2">
            <GanttChart size={18} /> Review Planning
          </Button>
        </motion.div>

        <Row className="g-4 mb-5">
          {[
            { label: 'Assigned Projects', val: assignedProjects.length, icon: <Briefcase />, color: 'primary' },
            { label: 'Pending Reviews', val: '05', icon: <Clock />, color: 'warning' },
            { label: 'Avg. Grade', val: '16.4', icon: <Star />, color: 'info' },
          ].map((stat, i) => (
            <Col key={i} md={4}>
              <Card className="glass-card border-0 p-4 h-100">
                <div className={`p-3 rounded-xl bg-${stat.color} bg-opacity-10 text-${stat.color} mb-3 d-inline-block`}>
                  {stat.icon}
                </div>
                <h3 className="fw-black mb-1 text-white">{stat.val}</h3>
                <div className="text-muted extra-small fw-bold text-uppercase tracking-wider">{stat.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <Card className="glass-card border-0 overflow-hidden shadow-sm">
              <div className="p-4 border-bottom bg-white bg-opacity-05">
                <h5 className="fw-bold mb-0 text-white">Projects Under Review</h5>
              </div>
              <Table responsive hover className="mb-0 custom-table-modern">
                <thead>
                  <tr>
                    <th className="ps-4">Candidate</th>
                    <th>Status</th>
                    <th className="text-end pe-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedProjects.map((project, i) => (
                    <tr key={i} className="align-middle">
                      <td className="ps-4 py-4">
                        <div className="fw-bold small text-white">{project.studentName}</div>
                        <div className="extra-small text-muted">{project.topic}</div>
                      </td>
                      <td>
                        <Badge className={`rounded-pill px-3 py-1 extra-small bg-${project.status === 'completed' ? 'success' : 'warning'} bg-opacity-10 text-${project.status === 'completed' ? 'success' : 'warning'}`}>
                          {project.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="text-end pe-4">
                        <Button variant="primary" size="sm" className="bg-gradient-primary border-0 rounded-pill px-3 extra-small fw-bold shadow-sm">Evaluate</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 bg-gradient-primary text-white position-relative overflow-hidden shadow-lg">
              <Shield className="position-absolute top-0 end-0 opacity-10 m-n3" size={100} />
              <h5 className="fw-black mb-3">Integrity Check</h5>
              <div style={{ height: 120 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={evalStats} innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="v">
                      {evalStats.map((e, index) => <Cell key={index} fill={e.c} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="extra-small opacity-75 mt-3">All reports are audited for academic integrity.</p>
            </Card>
          </Col>
        </Row>
      </Container>
      <style>{`
        .custom-table-modern thead th { background: rgba(255,255,255, 0.02); border-bottom: 2px solid rgba(255,255,255,0.05); color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 1.25rem 1rem; }
      `}</style>
    </div>
  );
};

export default JuryDashboard;
