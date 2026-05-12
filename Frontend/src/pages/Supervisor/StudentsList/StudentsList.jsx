import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, InputGroup, Dropdown, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MoreHorizontal, 
  MessageSquare, FileText, ChevronRight, 
  Mail, Phone, ExternalLink, Download,
  UserPlus, UserCheck, Clock, CheckCircle, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STUDENTS_DATA = [
  { 
    id: 1, 
    name: 'Ahmed Khalil', 
    email: 'ahmed.khalil@emsi-edu.ma',
    project: 'AI-Powered Student Performance Prediction System', 
    progress: 85, 
    status: 'Validated', 
    lastActivity: '2 hours ago',
    type: 'PFE',
    department: 'Software Engineering'
  },
  { 
    id: 2, 
    name: 'Sara Kamali', 
    email: 'sara.kamali@emsi-edu.ma',
    project: 'Blockchain-based Academic Certificate Verification', 
    progress: 60, 
    status: 'In Progress', 
    lastActivity: 'Yesterday',
    type: 'PFE',
    department: 'Cybersecurity'
  },
  { 
    id: 3, 
    name: 'Mohamed Alaoui', 
    email: 'm.alaoui@emsi-edu.ma',
    project: 'IoT Smart Campus Solution for Energy Management', 
    progress: 40, 
    status: 'Pending', 
    lastActivity: '3 days ago',
    type: 'Internship',
    department: 'Embedded Systems'
  },
  { 
    id: 4, 
    name: 'Fatima Zahra', 
    email: 'f.zahra@emsi-edu.ma',
    project: 'Cloud-Native Microservices Architecture for E-Health', 
    progress: 95, 
    status: 'Validated', 
    lastActivity: '5 hours ago',
    type: 'PFE',
    department: 'Cloud Computing'
  },
  { 
    id: 5, 
    name: 'Youssef Amrani', 
    email: 'y.amrani@emsi-edu.ma',
    project: 'Deep Learning for Medical Image Segmentation', 
    progress: 72, 
    status: 'In Progress', 
    lastActivity: '4 hours ago',
    type: 'PFE',
    department: 'AI & Data Science'
  },
  { 
    id: 6, 
    name: 'Laila Bennani', 
    email: 'l.bennani@emsi-edu.ma',
    project: 'Automated Penetration Testing Framework', 
    progress: 55, 
    status: 'In Progress', 
    lastActivity: '1 day ago',
    type: 'PFE',
    department: 'Cybersecurity'
  }
];

const StudentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredStudents = STUDENTS_DATA.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="supervisor-students-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Supervised Students</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Manage and track the progress of your supervised students
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Export List
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm">
              <UserPlus size={18} /> Add Student
            </Button>
          </div>
        </header>

        {/* Filters & Search */}
        <Card className="glass-card border-0 mb-4 p-3 border shadow-sm">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-3">
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search students or projects..." 
                  className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <Form.Select 
                className="bg-surface-alt border-0 shadow-none extra-small fw-bold py-2 rounded-pill border"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Validated">Validated</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </Form.Select>
            </Col>
            <Col md={3} lg={6} className="text-md-end">
              <div className="d-flex justify-content-md-end gap-3 align-items-center">
                <span className="extra-small text-muted fw-bold opacity-75">
                  Showing <strong>{filteredStudents.length}</strong> of {STUDENTS_DATA.length} students
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <div className="glass-card border shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student Information</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project Details</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Department</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Progress</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredStudents.map((student, index) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                             {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold small text-navy">{student.name}</div>
                            <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-75">
                              <Mail size={12} className="text-primary" /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="extra-small fw-bold text-navy opacity-75 text-wrap mb-1" style={{ maxWidth: '250px', lineHeight: '1.4' }}>
                          {student.project}
                        </div>
                        <Badge className="bg-surface-alt text-muted border-0 extra-small fw-bold rounded-pill px-3 py-1">
                          {student.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="extra-small fw-bold text-muted text-uppercase">
                          {student.department}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1" style={{ width: '120px' }}>
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="extra-small fw-bold text-navy">{student.progress}%</span>
                            <span className="extra-small text-muted fw-bold opacity-50" style={{ fontSize: '9px' }}>{student.lastActivity}</span>
                          </div>
                          <div className="bg-surface-alt rounded-pill overflow-hidden" style={{ height: '6px' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              className={`h-100 rounded-pill bg-${student.progress > 80 ? 'success' : student.progress > 40 ? 'primary' : 'warning'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge className={`bg-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'}-soft text-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold d-inline-flex align-items-center gap-1`}>
                          {student.status === 'Validated' ? <CheckCircle size={12} /> : student.status === 'In Progress' ? <Clock size={12} /> : <Clock size={12} />}
                          {student.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button 
                            variant="link" 
                            className="p-2 rounded-circle border-0 text-primary hover-bg-surface-alt"
                            onClick={() => navigate(`/supervisor/messages`)}
                            title="Message Student"
                          >
                            <MessageSquare size={18} />
                          </Button>
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-2 text-muted hover-bg-surface-alt rounded-circle no-caret shadow-none border-0">
                              <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => navigate(`/supervisor/student/${student.id}`)}>
                                <ChevronRight size={14} className="text-primary" /> View Full Profile
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2">
                                <FileText size={14} className="text-success" /> View Deliverables
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2 d-flex align-items-center gap-2">
                                <UserCheck size={14} className="text-info" /> Validate Phase
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="py-2 text-danger d-flex align-items-center gap-2">
                                <ExternalLink size={14} /> Request Update
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </div>

        {/* Summary Stats */}
        <Row className="mt-5 g-4">
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-primary-soft text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Supervision Load</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Current academic year</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">6/8 Students</div>
              <ProgressBar now={75} variant="primary" style={{ height: '8px' }} className="rounded-pill mb-3 bg-surface-alt border-0" />
              <div className="extra-small text-muted fw-bold">75% Capacity Utilized</div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Success Rate</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Validated milestones</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">92.4%</div>
              <div className="extra-small text-success fw-bold d-flex align-items-center gap-1">
                <TrendingUp size={14} /> +4.2% from last semester
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 p-4 shadow-sm border h-100">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="p-3 rounded-4 bg-warning-soft text-warning">
                  <Clock size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold text-navy">Pending Actions</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">Needs your attention</p>
                </div>
              </div>
              <div className="h3 fw-bold text-navy mb-2">12 Tasks</div>
              <div className="extra-small text-muted fw-bold text-danger">3 Urgent report reviews</div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentsList;
