import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, InputGroup, Dropdown, ProgressBar } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MoreHorizontal, 
  MessageSquare, FileText, ChevronRight, 
  Mail, Phone, ExternalLink, Download,
  UserPlus, UserCheck, Clock, CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../SupervisorStyles.css';

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
    <div className="sv-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Header */}
        <header className="sv-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-2">My Students</h1>
            <p className="sv-welcome-subtitle mb-0">
              Manage and track the progress of your supervised students
            </p>
          </motion.div>
          <div className="d-flex gap-3">
            <Button className="btn-pro-outline d-flex align-items-center gap-2">
              <Download size={18} /> Export List
            </Button>
            <Button className="sv-btn-gradient d-flex align-items-center gap-2">
              <UserPlus size={18} /> Add Student
            </Button>
          </div>
        </header>

        {/* Filters & Search */}
        <Card className="sv-card-premium border-0 mb-4 p-3">
          <Row className="g-3 align-items-center">
            <Col md={6} lg={4}>
              <InputGroup className="sv-search-group">
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search students or projects..." 
                  className="sv-search-input border-0 shadow-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <Form.Select 
                className="sv-filter-select border-0 shadow-sm extra-small fw-bold"
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
                <span className="extra-small text-muted fw-bold">
                  Showing {filteredStudents.length} of {STUDENTS_DATA.length} students
                </span>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Students Table */}
        <div className="sv-table-container">
          <div className="table-responsive">
            <Table className="sv-table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Student Information</th>
                  <th>Project Details</th>
                  <th>Department</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
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
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="sv-avatar shadow-sm fw-black" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-black small text-navy">{student.name}</div>
                            <div className="extra-small text-muted d-flex align-items-center gap-1">
                              <Mail size={12} /> {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="extra-small fw-black text-navy opacity-75 text-wrap mb-1" style={{ maxWidth: '250px', lineHeight: '1.4' }}>
                          {student.project}
                        </div>
                        <Badge bg="light" className="text-muted extra-small border fw-bold rounded-pill">
                          {student.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="extra-small fw-bold text-muted">
                          {student.department}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1" style={{ width: '120px' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="extra-small fw-black text-navy">{student.progress}%</span>
                            <span className="extra-small text-muted" style={{ fontSize: '10px' }}>{student.lastActivity}</span>
                          </div>
                          <div className="bg-light rounded-pill overflow-hidden" style={{ height: '6px' }}>
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${student.progress}%` }}
                              className={`h-100 rounded-pill bg-${student.progress > 80 ? 'success' : student.progress > 40 ? 'primary' : 'warning'}`}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`sv-status-badge shadow-none sv-badge-${student.status === 'Validated' ? 'success' : student.status === 'In Progress' ? 'primary' : 'warning'}`}>
                          {student.status === 'Validated' ? <CheckCircle size={12} /> : student.status === 'In Progress' ? <Clock size={12} /> : <Clock size={12} />}
                          {student.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <Button 
                            variant="light" 
                            className="p-2 rounded-circle border-0 shadow-sm text-primary"
                            onClick={() => navigate(`/supervisor/messages`)}
                            title="Message Student"
                          >
                            <MessageSquare size={18} />
                          </Button>
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-2 text-muted hover-bg-light rounded-circle no-caret shadow-none border-0">
                              <MoreHorizontal size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow border-0 rounded-4 extra-small">
                              <Dropdown.Item className="py-2" onClick={() => navigate(`/supervisor/student/${student.id}`)}>
                                <ChevronRight size={14} className="me-2 text-primary" /> View Full Profile
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2">
                                <FileText size={14} className="me-2 text-success" /> View Deliverables
                              </Dropdown.Item>
                              <Dropdown.Item className="py-2">
                                <UserCheck size={14} className="me-2 text-info" /> Validate Phase
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="py-2 text-danger">
                                <ExternalLink size={14} className="me-2" /> Request Report Update
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
        <Row className="mt-4 g-4">
          <Col lg={4}>
            <Card className="sv-card-premium border-0 p-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary">
                  <Users size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-black text-navy">Supervision Load</h6>
                  <p className="extra-small text-muted mb-0">Current academic year</p>
                </div>
              </div>
              <div className="h3 fw-black text-navy mb-1">6/8 Students</div>
              <ProgressBar now={75} variant="primary" style={{ height: '8px' }} className="rounded-pill mb-2" />
              <div className="extra-small text-muted fw-bold">75% Capacity Utilized</div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="sv-card-premium border-0 p-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-4 bg-success bg-opacity-10 text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-black text-navy">Success Rate</h6>
                  <p className="extra-small text-muted mb-0">Validated milestones</p>
                </div>
              </div>
              <div className="h3 fw-black text-navy mb-1">92.4%</div>
              <div className="extra-small text-success fw-bold">+4.2% from last semester</div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="sv-card-premium border-0 p-4 shadow-sm h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 rounded-4 bg-warning bg-opacity-10 text-warning">
                  <Clock size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-black text-navy">Pending Actions</h6>
                  <p className="extra-small text-muted mb-0">Needs your attention</p>
                </div>
              </div>
              <div className="h3 fw-black text-navy mb-1">12 Tasks</div>
              <div className="extra-small text-muted fw-bold">3 Urgent report reviews</div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentsList;
