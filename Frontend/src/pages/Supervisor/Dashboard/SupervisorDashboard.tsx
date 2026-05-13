import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, CheckCircle, Clock, 
  TrendingUp, FileText, MessageSquare, Plus,
  ChevronRight, MoreHorizontal, Activity, Star
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';
import PerformanceChart from '../../../components/features/supervisor/PerformanceChart';
import StatusDistribution from '../../../components/features/supervisor/StatusDistribution';

const WEEKLY_ACTIVITY = [
  { day: 'Mon', meetings: 4, feedback: 12 },
  { day: 'Tue', meetings: 2, feedback: 8 },
  { day: 'Wed', meetings: 5, feedback: 15 },
  { day: 'Thu', meetings: 3, feedback: 10 },
  { day: 'Fri', meetings: 6, feedback: 18 },
  { day: 'Sat', meetings: 1, feedback: 4 },
];

const DELIVERABLE_STATUS = [
  { name: 'Abstract', value: 90, color: 'var(--color-success)' },
  { name: 'Interim', value: 65, color: 'var(--color-primary)' },
  { name: 'Final', value: 20, color: 'var(--color-warning)' },
  { name: 'Slides', value: 10, color: 'var(--color-info)' },
];

const SKILLS_DISTRIBUTION = [
  { subject: 'Analysis', A: 120, B: 110, fullMark: 150 },
  { subject: 'Coding', A: 98, B: 130, fullMark: 150 },
  { subject: 'Design', A: 86, B: 130, fullMark: 150 },
  { subject: 'Docs', A: 99, B: 100, fullMark: 150 },
  { subject: 'Research', A: 85, B: 90, fullMark: 150 },
  { subject: 'Testing', A: 65, B: 85, fullMark: 150 },
];

const RECENT_STUDENTS = [
  { id: 1, name: 'Ahmed Khalil', project: 'AI-Powered Student System', progress: 85, status: 'Validated', date: '2026-05-15' },
  { id: 2, name: 'Sara Kamali', project: 'Blockchain Certificate Verif.', progress: 60, status: 'In Progress', date: '2026-05-18' },
  { id: 3, name: 'Mohamed Alaoui', project: 'IoT Smart Campus Solution', progress: 40, status: 'Pending', date: '2026-05-20' },
  { id: 4, name: 'Fatima Zahra', project: 'Cybersecurity Audit Tool', progress: 95, status: 'Validated', date: '2026-05-12' },
];

const SupervisorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useApp();
  const [showSuccessCard, setShowSuccessCard] = useState(true);

  return (
    <div className="supervisor-dashboard-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Notification Card */}
        {showSuccessCard && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 mb-4 d-flex align-items-center justify-content-between shadow-sm bg-success-soft text-success border border-success border-opacity-25 rounded-4"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                <CheckCircle size={20} />
              </div>
              <div>
                <h6 className="mb-0 fw-bold small">Reports Validated Successfully</h6>
                <p className="extra-small mb-0 opacity-75 fw-bold">3 new reports from your students have been automatically pre-validated by the system.</p>
              </div>
            </div>
            <Button variant="link" className="text-success p-0 extra-small fw-bold text-decoration-none" onClick={() => setShowSuccessCard(false)}>Dismiss</Button>
          </motion.div>
        )}
        
        {/* Welcome Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Supervisor Dashboard</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Academic Year 2025/2026 • Welcome back, Prof. {session?.name}
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2" onClick={() => navigate('/supervisor/schedule')}>
              <Calendar size={18} /> Defense Planning
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm" onClick={() => navigate('/supervisor/subjects')}>
              <Plus size={18} /> Propose Subject
            </Button>
          </div>
        </header>

        {/* Global Statistics Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard 
              label="Total Students" 
              value="24" 
              color="primary" 
              icon={<Users />} 
              trend="+3 month" 
              onClick={() => navigate('/supervisor/students')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Avg Progress" value="72%" color="success" icon={<TrendingUp />} trend="+12% week" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Meeting Hours" value="142h" color="info" icon={<Clock />} trend="Semester" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard 
              label="Active Projects" 
              value="18" 
              color="warning" 
              icon={<Activity />} 
              trend="4 Ending" 
              onClick={() => navigate('/supervisor/subjects')}
            />
          </Col>
        </Row>

        {/* AI Insight Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 mb-5 d-flex align-items-center gap-4 bg-primary-soft border border-primary border-opacity-10 rounded-4 shadow-sm"
        >
          <div className="p-3 rounded-4 bg-surface shadow-sm text-primary">
            <Activity size={32} />
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <Badge className="bg-primary text-white border-0 rounded-pill extra-small px-3 py-1 fw-bold">AI COPILOT</Badge>
              <span className="extra-small text-primary fw-bold opacity-75">PROJECTED SUCCESS RATE: 98.2%</span>
            </div>
            <p className="extra-small text-primary-custom opacity-85 mb-0 fw-bold">
              Based on recent submissions, <strong>Ahmed Khalil</strong> and <strong>Fatima Zahra</strong> are ready for defense. 
              Consider scheduling a review session for <strong>Mohamed Alaoui</strong> who is slightly behind schedule.
            </p>
          </div>
          <Button variant="link" className="text-primary fw-bold text-decoration-none extra-small d-flex align-items-center gap-1">
            View Analytics <ChevronRight size={14} />
          </Button>
        </motion.div>

        <Row className="g-4 mb-5">
          <Col lg={8}>
            <PerformanceChart />
          </Col>
          <Col lg={4}>
            <StatusDistribution />
          </Col>
        </Row>

        <Row className="g-4 mb-5">
          {/* Weekly Activity Bar Chart */}
          <Col lg={4}>
            <Card className="glass-card border p-4 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 className="fw-bold text-navy mb-1">Weekly Activity</h6>
                  <p className="extra-small text-muted mb-0 fw-bold">Meetings and feedback sessions</p>
                </div>
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={WEEKLY_ACTIVITY}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 700}} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 600, color: 'var(--color-text-primary)' }} />
                    <Bar dataKey="meetings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} name="Meetings" barSize={12} />
                    <Bar dataKey="feedback" fill="var(--color-info)" radius={[4, 4, 0, 0]} name="Feedback" barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Skills Radar Chart */}
          <Col lg={4}>
            <Card className="glass-card border p-4 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 className="fw-bold text-navy mb-1">Skills Analysis</h6>
                  <p className="extra-small text-muted mb-0 fw-bold">Cohort strengths vs target</p>
                </div>
              </div>
              <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={SKILLS_DISTRIBUTION}>
                    <PolarGrid strokeOpacity={0.1} />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fontWeight: 700, fill: 'var(--color-text-muted)'}} />
                    <Radar name="Current" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                    <Radar name="Target" dataKey="B" stroke="var(--color-success)" fill="var(--color-success)" fillOpacity={0.2} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-primary)' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Deliverables Pie Chart */}
          <Col lg={4}>
            <Card className="glass-card border p-4 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h6 className="fw-bold text-navy mb-1">Deliverables</h6>
                  <p className="extra-small text-muted mb-0 fw-bold">Submission status by phase</p>
                </div>
              </div>
              <div style={{ height: '200px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={DELIVERABLE_STATUS}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {DELIVERABLE_STATUS.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', fontWeight: 600, color: 'var(--color-text-primary)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="d-flex flex-wrap gap-2 justify-content-center mt-4">
                {DELIVERABLE_STATUS.map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-1 extra-small fw-bold px-3 py-1 rounded-pill bg-surface-alt text-navy">
                    <div style={{ backgroundColor: item.color, width: '8px', height: '8px', borderRadius: '50%' }}></div>
                    {item.name}
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <div className="glass-card border shadow-sm rounded-4 overflow-hidden">
              <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
                <h5 className="mb-0 fw-bold text-navy">Supervised Students</h5>
                <Button variant="link" className="text-primary p-0 fw-bold text-decoration-none extra-small" onClick={() => navigate('/supervisor/students')}>
                  View Full List <ChevronRight size={14} />
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-surface-alt">
                    <tr>
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project Title</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Progression</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT_STUDENTS.map((student) => (
                      <tr key={student.id} className="border-bottom border-light border-opacity-10">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                               {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="fw-bold small text-navy">{student.name}</div>
                              <div className="extra-small text-muted opacity-75 fw-bold">PFE CANDIDATE</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="extra-small fw-bold text-navy opacity-75 text-wrap" style={{ maxWidth: '220px', lineHeight: '1.4' }}>
                            {student.project}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-3" style={{ width: '140px' }}>
                            <div className="flex-grow-1 bg-surface-alt rounded-pill overflow-hidden" style={{ height: '8px' }}>
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${student.progress}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className={`h-100 rounded-pill bg-${student.progress > 80 ? 'success' : 'primary'}`}
                              />
                            </div>
                            <span className="extra-small fw-bold text-navy">{student.progress}%</span>
                          </div>
                        </td>
                        <td>
                          <Badge className={`bg-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'}-soft text-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold`}>
                            {student.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-2 text-muted hover-bg-surface rounded-circle no-caret shadow-none border-0">
                              <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => navigate(`/supervisor/student/${student.id}`)}>
                                <ChevronRight size={14} className="text-primary" /> View Details
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => navigate('/supervisor/messages')}>
                                <MessageSquare size={14} className="text-info" /> Send Message
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2">
                                <FileText size={14} className="text-success" /> Evaluate Report
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="py-2 text-danger d-flex align-items-center gap-2">
                                <Activity size={14} /> Edit Progress
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>

          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Upcoming Deadlines */}
              <Card className="glass-card border p-4 shadow-sm border-0">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 text-primary">Upcoming Deadlines</h6>
                  <Clock size={18} className="text-warning" />
                </div>
                <div className="mb-4 pb-3 border-bottom border-muted">
                  <div className="extra-small text-warning fw-bold mb-1">MAY 15, 2026</div>
                  <div className="small fw-bold mb-1">Final Report Submission</div>
                  <div className="extra-small text-muted fw-bold">12 students remaining</div>
                </div>
                <div className="deadline-item">
                  <div className="extra-small text-warning fw-bold mb-1">MAY 20, 2026</div>
                  <div className="small fw-bold mb-1">Defense Session A</div>
                  <div className="extra-small text-muted fw-bold">Salle 304 - 9:00 AM</div>
                </div>
              </Card>

              {/* Message Preview */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 text-navy">Recent Messages</h6>
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div className="d-flex flex-column gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="d-flex gap-3 pb-3 border-bottom border-light border-opacity-10">
                      <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                        {i === 1 ? 'AA' : 'SK'}
                      </div>
                      <div className="overflow-hidden flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="extra-small fw-bold text-navy">{i === 1 ? 'Ahmed Ben Ali' : 'Sara Kamali'}</div>
                          <div className="extra-small text-muted fw-bold">2h ago</div>
                        </div>
                        <div className="extra-small text-muted text-truncate fw-medium">I have updated the implementation part...</div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-100 text-primary extra-small fw-bold text-decoration-none mt-2" onClick={() => navigate('/supervisor/messages')}>
                  Go to Messages
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SupervisorDashboard;
