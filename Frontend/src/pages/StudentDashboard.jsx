import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Button, 
  ProgressBar, Badge, Table, ListGroup 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileUp, GraduationCap, Calendar, 
  CheckCircle, Clock, Target, Star, 
  Plus, Download, MoreVertical, Search,
  MessageSquare, FileText, UploadCloud, Info,
  ExternalLink, User, Phone, Mail
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const [dragActive, setDragActive] = useState(false);

  const steps = [
    { name: 'Proposal', status: 'completed' },
    { name: 'Interim Report', status: 'completed' },
    { name: '3 Final Report', status: 'active' },
    { name: '4 Defense', status: 'pending' },
  ];

  const documents = [
    { name: 'Interim_Report_v2.pdf', date: '2026-04-20', size: '2.4 MB' },
    { name: 'Project_Proposal_v1.pdf', date: '2026-03-15', size: '1.8 MB' },
  ];

  return (
    <div className="sd-page-container">
      <Container fluid className="px-4 py-4">
        
        {/* Header Area */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="d-flex justify-content-between align-items-center mb-4"
        >
          <div>
            <h2 className="fw-black text-gradient-primary mb-1">Student Dashboard</h2>
            <p className="text-muted extra-small mb-0">Welcome back! Here is an overview of your PFE progress.</p>
          </div>
          <Button variant="primary" className="bg-gradient-primary border-0 rounded-pill px-4 py-2 d-flex align-items-center gap-2 shadow-sm">
            <Plus size={18} /> New Submission
          </Button>
        </motion.div>

        {/* 4 Metric Cards */}
        <Row className="g-4 mb-4">
          {[
            { title: 'Project Status', value: 'In Progress', sub: 'Active', icon: <Target />, color: 'primary' },
            { title: 'Submission Deadline', value: '15 Days', sub: 'Remaining', icon: <Clock />, color: 'warning' },
            { title: 'Documents Submitted', value: '8/10', sub: 'Validated', icon: <FileText />, color: 'success' },
            { title: 'Current Grade', value: '85/100', sub: 'Latest Score', icon: <Star />, color: 'info' }
          ].map((item, i) => (
            <Col key={i} lg={3} md={6}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
                <Card className="glass-card border-0 h-100">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between mb-3">
                      <div className={`p-2 rounded-3 bg-${item.color} bg-opacity-10 text-${item.color}`}>
                        {item.icon}
                      </div>
                      <Badge className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-pill px-3 py-1 extra-small`}>
                        {item.sub}
                      </Badge>
                    </div>
                    <h3 className="fw-black mb-1">{item.value}</h3>
                    <p className="text-muted extra-small mb-0 fw-bold text-uppercase tracking-wider">{item.title}</p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Left Column */}
          <Col lg={8}>
            
            {/* Project Progress (Timeline) */}
            <Card className="glass-card border-0 mb-4">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold mb-0">Project Progress</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="sd-timeline">
                  {steps.map((step, i) => (
                    <div key={i} className={`sd-step ${step.status}`}>
                      <div className="sd-step-node">
                        {step.status === 'completed' ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
                      </div>
                      <div className="sd-step-label">{step.name}</div>
                      {i < steps.length - 1 && <div className="sd-step-line"></div>}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Upload Area */}
            <Card className="glass-card border-0 mb-4 overflow-hidden">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Upload Documents</h5>
                <div 
                  className={`sd-upload-zone ${dragActive ? 'active' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
                >
                  <UploadCloud size={40} className="text-primary mb-3 opacity-50" />
                  <h6 className="fw-bold">Drag and drop your files here</h6>
                  <p className="text-muted small">or</p>
                  <Button variant="outline-primary" className="rounded-pill px-4 mb-2">Browse Files</Button>
                  <p className="extra-small text-muted mb-0">Supported formats: PDF, DOCX (Max 10MB)</p>
                </div>
              </Card.Body>
            </Card>

            {/* Uploaded Documents List */}
            <Card className="glass-card border-0">
              <Card.Header className="bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="fw-bold mb-0">Uploaded Documents</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Table responsive hover className="sd-table mb-0">
                  <tbody>
                    {documents.map((doc, i) => (
                      <tr key={i} className="align-middle">
                        <td className="ps-0 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="sd-doc-icon bg-primary bg-opacity-10 text-primary">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="fw-bold small">{doc.name}</div>
                              <div className="extra-small text-muted">{doc.date} • {doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end pe-0">
                          <Button variant="link" className="text-primary fw-bold text-decoration-none small d-flex align-items-center gap-1 ms-auto">
                            View <ExternalLink size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column */}
          <Col lg={4}>
            
            {/* Upcoming Defense */}
            <Card className="glass-card border-0 mb-4 bg-gradient-primary text-white overflow-hidden position-relative">
              <div className="decorative-circle-1"></div>
              <Card.Body className="p-4 position-relative">
                <h6 className="fw-bold mb-4 text-white-50 extra-small text-uppercase tracking-wider">Upcoming Defense</h6>
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="p-3 rounded-3 bg-white bg-opacity-20">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">Final Defense Presentation</h5>
                    <p className="small mb-0">May 20, 2026</p>
                    <p className="extra-small text-white-50">10:00 AM - Room 304</p>
                  </div>
                </div>
                <Button variant="light" className="w-100 rounded-pill fw-bold small py-2 border-0 mt-2">Add to Calendar</Button>
              </Card.Body>
            </Card>

            {/* Recent Feedback */}
            <Card className="glass-card border-0 mb-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <MessageSquare size={18} className="text-primary" /> Recent Feedback
                </h6>
                <div className="p-3 rounded-3 bg-light-soft border-start border-primary border-4">
                  <div className="fw-bold small mb-1">Interim Report Revision</div>
                  <p className="extra-small text-muted mb-2">"Please revise sections 3.2 and 4.1. Good progress overall!"</p>
                  <div className="extra-small text-primary-custom fw-bold">2 days ago</div>
                </div>
              </Card.Body>
            </Card>

            {/* Supervisor Card */}
            <Card className="glass-card border-0 mb-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-4 text-muted extra-small text-uppercase tracking-wider">Supervisor</h6>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="avatar-circle-sm bg-primary" style={{ width: '50px', height: '50px', fontSize: '1.2rem' }}>SS</div>
                  <div>
                    <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
                    <p className="extra-small text-muted mb-0">Computer Science Department</p>
                  </div>
                </div>
                <div className="d-grid gap-2 mb-4">
                  <div className="d-flex align-items-center gap-2 extra-small text-muted">
                    <Mail size={14} /> s.smith@university.edu
                  </div>
                  <div className="d-flex align-items-center gap-2 extra-small text-muted">
                    <Phone size={14} /> +1 (555) 123-4567
                  </div>
                </div>
                <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold small bg-gradient-primary border-0">Contact Supervisor</Button>
              </Card.Body>
            </Card>

            {/* Overall Progress */}
            <Card className="glass-card border-0 mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Overall Progress</h6>
                  <span className="text-primary fw-bold">75%</span>
                </div>
                <ProgressBar now={75} className="mb-4 rounded-pill" style={{ height: '10px' }} />
                <div className="d-flex justify-content-between text-center gap-2">
                  <div className="flex-grow-1 p-2 rounded-3 bg-light-soft">
                    <div className="fw-bold text-success small">15/20</div>
                    <div className="extra-small text-muted">Completed Tasks</div>
                  </div>
                  <div className="flex-grow-1 p-2 rounded-3 bg-light-soft">
                    <div className="fw-bold text-warning small">5/20</div>
                    <div className="extra-small text-muted">Remaining Tasks</div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Links */}
            <Card className="glass-card border-0">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Quick Links</h6>
                <ListGroup variant="flush" className="bg-transparent border-0">
                  {[
                    { label: 'PFE Guidelines', icon: <FileText size={16} /> },
                    { label: 'Report Template', icon: <Plus size={16} /> },
                    { label: 'Evaluation Criteria', icon: <Target size={16} /> },
                    { label: 'FAQ & Support', icon: <Info size={16} /> },
                  ].map((link, i) => (
                    <ListGroup.Item key={i} action className="bg-transparent border-0 px-0 py-2 d-flex align-items-center justify-content-between text-muted hover-primary">
                      <div className="d-flex align-items-center gap-2 small fw-medium">
                        {link.icon} {link.label}
                      </div>
                      <ChevronRight size={14} className="opacity-50" />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

// Internal component for the right chevron
const ChevronRight = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" 
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default StudentDashboard;