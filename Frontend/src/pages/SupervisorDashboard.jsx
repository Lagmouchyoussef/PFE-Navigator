import React from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup, ProgressBar } from 'react-bootstrap';
import { 
  Users, CheckCircle, Clock, Calendar, ChevronRight, Activity, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext.jsx';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const { myStudents = [] } = useApp();
  const activityData = [{v: 12}, {v: 18}, {v: 15}, {v: 22}];

  return (
    <div className="dashboard-container min-vh-100 pb-5">
      <Container fluid className="px-4 px-xl-5 pt-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="d-flex justify-content-between align-items-end mb-5"
        >
          <div>
            <Badge className="badge-premium mb-2">Faculty Portal</Badge>
            <h1 className="fw-black display-5 mb-1 tracking-tighter text-white">Academic <span className="text-gradient">Supervision</span></h1>
            <p className="text-muted small mb-0">Managing {myStudents.length} research projects and monitoring student progress.</p>
          </div>
          <Button 
            variant="primary" 
            className="bg-gradient-primary border-0 rounded-pill px-4 shadow-lg d-flex align-items-center gap-2"
            onClick={() => navigate('/supervisor/schedule')}
          >
            <Calendar size={18} /> Schedule defense
          </Button>
        </motion.div>
 
        <Row className="g-4 mb-5">
          {[
            { label: 'Assigned Students', val: myStudents.length, icon: <Users />, color: 'primary' },
            { label: 'Pending Reviews', val: '08', icon: <Clock />, color: 'warning' },
            { label: 'Avg. Progress', val: '72%', icon: <Activity />, color: 'info' },
          ].map((stat, i) => (
            <Col key={i} md={4}>
              <Card className="glass-card border-0 p-4 h-100">
                <div className={`p-3 rounded-xl bg-${stat.color} bg-opacity-10 text-${stat.color} mb-3 d-inline-block w-auto`}>
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
            <Card className="glass-card border-0 p-4">
              <h5 className="fw-bold mb-4 text-white">Student Progress Matrix</h5>
              <ListGroup variant="flush">
                {myStudents.map((student, i) => (
                  <ListGroup.Item key={i} className="bg-transparent border-0 px-0 py-4 border-bottom border-white border-opacity-05">
                    <Row className="align-items-center">
                      <Col md={4}>
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold">{student.name.charAt(0)}</div>
                          <div>
                            <div className="fw-bold small text-white">{student.name}</div>
                            <div className="extra-small text-muted">{student.topic}</div>
                          </div>
                        </div>
                      </Col>
                      <Col md={4}>
                        <ProgressBar now={student.progress} className="bg-white bg-opacity-05" style={{ height: '6px' }}>
                          <ProgressBar now={student.progress} className="bg-gradient-primary" />
                        </ProgressBar>
                      </Col>
                      <Col md={4} className="text-end">
                        <Button 
                          variant="link" 
                          className="text-primary p-0 fw-bold extra-small text-decoration-none"
                          onClick={() => navigate('/supervisor/evaluation')}
                        >
                          Review <ChevronRight size={14} className="ms-1" />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 bg-gradient-primary text-white position-relative overflow-hidden shadow-lg">
              <Zap className="position-absolute top-0 end-0 opacity-10 m-n3" size={100} />
              <h5 className="fw-black mb-3">Review Velocity</h5>
              <div style={{ height: 100 }}>
                <ResponsiveContainer>
                  <AreaChart data={activityData}>
                    <Area type="monotone" dataKey="v" stroke="#fff" fill="rgba(255,255,255,0.1)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="extra-small opacity-75 mt-3">Your review turnaround time is optimized at 1.2 days.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SupervisorDashboard;
