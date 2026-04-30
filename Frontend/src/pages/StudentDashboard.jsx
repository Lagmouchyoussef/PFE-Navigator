import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Button, Table
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, FileText, GraduationCap, 
  LayoutDashboard, FileUp, Calendar, 
  ChevronRight, Mail, MessageSquare,
  AlertCircle, Search, Activity
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="sd-page-container">
      <Container fluid>
        
        {/* Welcome Header */}
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="sd-welcome-text"
        >
          Welcome, Ahmed Khalil
        </motion.h1>

        {/* 4 Stat Cards */}
        <Row className="g-4 mb-4">
          <Col lg={3} md={6}>
            <Card className="sd-card sd-stat-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-dark-muted mb-1">Project Status</div>
                  <h4 className="fw-bold mb-3">In Progress</h4>
                  <Badge className="badge-active">Active</Badge>
                </div>
                <div className="sd-icon-box bg-pfe-blue">
                  <Activity size={24} />
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="sd-card sd-stat-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-dark-muted mb-1">Submission Deadline</div>
                  <h4 className="fw-bold mb-3">15 Days</h4>
                </div>
                <div className="sd-icon-box bg-pfe-orange">
                  <Calendar size={24} />
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="sd-card sd-stat-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-dark-muted mb-1">Documents Submitted</div>
                  <h4 className="fw-bold mb-3">8/10</h4>
                </div>
                <div className="sd-icon-box bg-pfe-green">
                  <FileText size={24} />
                </div>
              </div>
            </Card>
          </Col>
          <Col lg={3} md={6}>
            <Card className="sd-card sd-stat-card">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <div className="text-dark-muted mb-1">Current Grade</div>
                  <h4 className="fw-bold mb-3">85/100</h4>
                </div>
                <div className="sd-icon-box bg-pfe-navy">
                  <GraduationCap size={24} />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Project Progress - Exactly like screenshot */}
        <Card className="sd-card mb-4">
          <Card.Header className="bg-transparent border-0 p-4 pb-0">
            <h5 className="fw-bold">Project Progress</h5>
          </Card.Header>
          <Card.Body className="sd-timeline-container">
            <div className="sd-timeline-line"></div>
            <div className="sd-timeline-progress-line"></div>
            <div className="sd-timeline-row">
              <div className="sd-step-item">
                <div className="sd-step-circle completed"><CheckCircle size={22} /></div>
                <div className="sd-step-label">Proposal</div>
              </div>
              <div className="sd-step-item">
                <div className="sd-step-circle completed"><CheckCircle size={22} /></div>
                <div className="sd-step-label">Interim Report</div>
              </div>
              <div className="sd-step-item">
                <div className="sd-step-circle active">3</div>
                <div className="sd-step-label">Final Report</div>
              </div>
              <div className="sd-step-item">
                <div className="sd-step-circle pending">4</div>
                <div className="sd-step-label">Defense</div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4">
          {/* Left Column */}
          <Col lg={8}>
            {/* Upload Area */}
            <Card className="sd-card mb-4">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold">Upload Documents</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="sd-upload-area text-center">
                  <FileUp size={48} className="text-muted mb-3" />
                  <h6 className="fw-bold mb-2">Drag and drop your files here</h6>
                  <p className="text-muted small">or</p>
                  <Button variant="outline-primary" className="rounded-pill px-5 mb-2">Browse Files</Button>
                  <p className="extra-small text-muted mb-0">Supported formats: PDF, DOCX (Max 10MB)</p>
                </div>
              </Card.Body>
            </Card>

            {/* Document Table */}
            <Card className="sd-card">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold">Uploaded Documents</h5>
              </Card.Header>
              <Card.Body className="p-4 pt-2">
                <Table responsive hover className="mb-0">
                  <tbody>
                    {[
                      { name: 'Interim_Report_v2.pdf', date: '2026-04-20', size: '2.4 MB' },
                      { name: 'Project_Proposal_v1.pdf', date: '2026-03-15', size: '1.8 MB' }
                    ].map((doc, i) => (
                      <tr key={i} className="align-middle border-bottom">
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-light"><FileText size={20} className="text-primary" /></div>
                            <div>
                              <div className="fw-bold small">{doc.name}</div>
                              <div className="extra-small text-muted">{doc.date} • {doc.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-end">
                          <Button variant="link" className="text-primary fw-bold text-decoration-none small">View</Button>
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
            <Card className="sd-card mb-4">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold">Upcoming Defense</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="sd-defense-box">
                  <div className="d-flex align-items-start gap-3">
                    <Calendar size={24} className="text-primary mt-1" />
                    <div>
                      <h6 className="fw-bold mb-1">Final Defense Presentation</h6>
                      <div className="small text-muted mb-1">May 20, 2026</div>
                      <div className="extra-small text-muted">10:00 AM - Room 304</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Feedback */}
            <Card className="sd-card mb-4">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold">Recent Feedback</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="border-start border-primary border-4 ps-3 mb-3">
                  <div className="fw-bold small mb-1">Interim Report Revision</div>
                  <p className="extra-small text-muted mb-1">"Please revise sections 3.2 and 4.1. Good progress overall!"</p>
                  <div className="extra-small text-primary fw-bold">2 days ago</div>
                </div>
              </Card.Body>
            </Card>

            {/* Supervisor */}
            <Card className="sd-card mb-4">
              <Card.Body className="p-4">
                <div className="text-muted extra-small text-uppercase fw-bold mb-3">Your Supervisor</div>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px', fontWeight: '800' }}>SS</div>
                  <div>
                    <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
                    <div className="extra-small text-muted">Computer Science Department</div>
                  </div>
                </div>
                <div className="d-grid gap-2 mb-4">
                  <div className="extra-small text-muted d-flex align-items-center gap-2"><Mail size={14} /> s.smith@university.edu</div>
                  <div className="extra-small text-muted d-flex align-items-center gap-2"><MessageSquare size={14} /> +1 (555) 123-4567</div>
                </div>
                <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold small">Contact Supervisor</Button>
              </Card.Body>
            </Card>

            {/* Progress Bar */}
            <Card className="sd-card mb-4">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Overall Progress</h6>
                  <span className="text-primary fw-bold">75%</span>
                </div>
                <ProgressBar now={75} className="mb-4 rounded-pill" style={{ height: '10px' }} />
                <div className="row g-2 text-center">
                  <div className="col-6">
                    <div className="bg-light p-2 rounded">
                      <div className="fw-bold text-success small">15/20</div>
                      <div className="extra-small text-muted">Completed</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-light p-2 rounded">
                      <div className="fw-bold text-warning small">5/20</div>
                      <div className="extra-small text-muted">Remaining</div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Links */}
            <Card className="sd-card">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Quick Links</h6>
                <div className="d-grid gap-2">
                  {[
                    { label: 'PFE Guidelines', icon: <FileText size={16} /> },
                    { label: 'Report Template', icon: <LayoutDashboard size={16} /> },
                    { label: 'Evaluation Criteria', icon: <CheckCircle size={16} /> },
                    { label: 'FAQ & Support', icon: <AlertCircle size={16} /> }
                  ].map((link, i) => (
                    <div key={i} className="d-flex align-items-center justify-content-between p-2 rounded hover-bg-light cursor-pointer">
                      <div className="d-flex align-items-center gap-2 small fw-medium text-muted">
                        {link.icon} {link.label}
                      </div>
                      <ChevronRight size={14} className="text-muted" />
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;