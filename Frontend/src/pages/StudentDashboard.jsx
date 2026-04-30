import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Button
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Check, Clock, FileText, GraduationCap, 
  LayoutDashboard, FileUp, Calendar, 
  ChevronRight, Mail, MessageSquare,
  AlertCircle, Search, Activity
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="sd-page-container">
      <Container fluid className="px-0">
        
        {/* SECTION 1: HEADER */}
        <header className="sd-header-section">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sd-welcome-title"
          >
            Welcome, Ahmed Khalil
          </motion.h1>
        </header>

        {/* SECTION 2: STATS SUMMARY */}
        <Row className="g-4 mb-4">
          <Col xl={3} md={6}>
            <Card className="sd-premium-card sd-stat-card">
              <div className="sd-stat-info">
                <span className="sd-stat-label">Project Status</span>
                <h4>In Progress</h4>
                <Badge bg="success" className="rounded-pill px-3">Active</Badge>
              </div>
              <div className="sd-stat-icon" style={{ backgroundColor: '#3498db' }}>
                <Activity size={24} />
              </div>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="sd-premium-card sd-stat-card">
              <div className="sd-stat-info">
                <span className="sd-stat-label">Submission Deadline</span>
                <h4>15 Days</h4>
              </div>
              <div className="sd-stat-icon" style={{ backgroundColor: '#f39c12' }}>
                <Calendar size={24} />
              </div>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="sd-premium-card sd-stat-card">
              <div className="sd-stat-info">
                <span className="sd-stat-label">Documents Submitted</span>
                <h4>8/10</h4>
              </div>
              <div className="sd-stat-icon" style={{ backgroundColor: '#27ae60' }}>
                <FileText size={24} />
              </div>
            </Card>
          </Col>
          <Col xl={3} md={6}>
            <Card className="sd-premium-card sd-stat-card">
              <div className="sd-stat-info">
                <span className="sd-stat-label">Current Grade</span>
                <h4>85/100</h4>
              </div>
              <div className="sd-stat-icon" style={{ backgroundColor: '#2c3e50' }}>
                <GraduationCap size={24} />
              </div>
            </Card>
          </Col>
        </Row>

        {/* SECTION 3: PROJECT PROGRESS (FULL WIDTH) */}
        <Card className="sd-premium-card mb-4">
          <Card.Header className="bg-transparent border-0 p-4 pb-0">
            <h5 className="fw-bold mb-0">Project Progress</h5>
          </Card.Header>
          <Card.Body className="sd-progress-section">
            <div className="sd-step-line-bg"></div>
            <div className="sd-step-line-active"></div>
            <div className="sd-stepper">
              <div className="sd-step-node-wrapper">
                <div className="sd-step-circle completed"><Check size={20} /></div>
                <span className="sd-step-label">Proposal</span>
              </div>
              <div className="sd-step-node-wrapper">
                <div className="sd-step-circle completed"><Check size={20} /></div>
                <span className="sd-step-label">Interim Report</span>
              </div>
              <div className="sd-step-node-wrapper">
                <div className="sd-step-circle active">3</div>
                <span className="sd-step-label">Final Report</span>
              </div>
              <div className="sd-step-node-wrapper">
                <div className="sd-step-circle pending">4</div>
                <span className="sd-step-label">Defense</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* SECTION 4: WORKSPACE & SIDEBAR */}
        <Row className="g-4">
          
          {/* Main Content Area */}
          <Col lg={8}>
            <Card className="sd-premium-card mb-4 p-4">
              <h5 className="fw-bold mb-4">Upload Documents</h5>
              <div className="sd-upload-box">
                <FileUp size={48} className="text-muted mb-3 opacity-50" />
                <h6 className="fw-bold">Drag and drop your files here</h6>
                <p className="text-muted small">or</p>
                <Button variant="outline-primary" className="rounded-pill px-5 mb-2">Browse Files</Button>
                <p className="text-muted extra-small">Supported formats: PDF, DOCX (Max 10MB)</p>
              </div>
            </Card>

            <Card className="sd-premium-card p-4">
              <h5 className="fw-bold mb-4">Uploaded Documents</h5>
              <div className="sd-doc-list">
                {[
                  { name: 'Interim_Report_v2.pdf', date: '2026-04-20', size: '2.4 MB' },
                  { name: 'Project_Proposal_v1.pdf', date: '2026-03-15', size: '1.8 MB' }
                ].map((doc, i) => (
                  <div key={i} className="sd-list-item d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="sd-doc-preview text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="fw-bold small">{doc.name}</div>
                        <div className="text-muted extra-small">{doc.date} • {doc.size}</div>
                      </div>
                    </div>
                    <Button variant="link" className="text-primary text-decoration-none fw-bold small">View</Button>
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          {/* Sidebar Widgets Area */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              
              <Card className="sd-premium-card p-4">
                <h6 className="fw-bold mb-3">Upcoming Defense</h6>
                <div className="sd-widget-defense d-flex gap-3">
                  <Calendar size={22} className="text-primary" />
                  <div>
                    <div className="fw-bold small">Final Defense Presentation</div>
                    <div className="text-muted extra-small">May 20, 2026</div>
                    <div className="text-muted extra-small">10:00 AM - Room 304</div>
                  </div>
                </div>
              </Card>

              <Card className="sd-premium-card p-4">
                <h6 className="fw-bold mb-3">Recent Feedback</h6>
                <div className="sd-feedback-note">
                  <div className="fw-bold small">Interim Report Revision</div>
                  <p className="text-muted extra-small mb-1">"Please revise sections 3.2 and 4.1. Good progress overall!"</p>
                  <div className="text-primary fw-bold extra-small">2 days ago</div>
                </div>
              </Card>

              <Card className="sd-premium-card p-4">
                <span className="sd-stat-label mb-3 d-block">Your Supervisor</span>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="sd-avatar-initials">SS</div>
                  <div>
                    <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
                    <div className="text-muted extra-small">Computer Science Department</div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="text-muted extra-small d-flex align-items-center gap-2"><Mail size={14} /> s.smith@university.edu</div>
                  <div className="text-muted extra-small d-flex align-items-center gap-2"><MessageSquare size={14} /> +1 (555) 123-4567</div>
                </div>
                <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold small border-0">Contact Supervisor</Button>
              </Card>

              {/* Overall Progress Section */}
              <Card className="sd-premium-card p-4">
                <h6 className="fw-bold mb-4">Overall Progress</h6>
                <div className="d-flex align-items-center justify-content-between gap-4 mb-4">
                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                    <svg viewBox="0 0 36 36" className="circular-chart-pfe" style={{ width: '80px', height: '80px' }}>
                      <path className="circle-bg"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path className="circle"
                        strokeDasharray="75, 100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">75%</text>
                    </svg>
                  </div>
                  <div className="flex-grow-1">
                    <div className="text-muted extra-small fw-bold text-uppercase mb-2">Project Completion</div>
                    <ProgressBar now={75} className="rounded-pill" style={{ height: '8px' }} />
                    <div className="mt-2 extra-small text-muted fw-medium">
                      You are ahead of <span className="text-success">82%</span> of other students
                    </div>
                  </div>
                </div>
                <Row className="g-2">
                  <Col xs={6}>
                    <div className="bg-light-soft py-3 rounded-3 text-center border">
                      <div className="text-success fw-bold h5 mb-0">15/20</div>
                      <div className="text-muted extra-small fw-bold">COMPLETED</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-light-soft py-3 rounded-3 text-center border">
                      <div className="text-warning fw-bold h5 mb-0">5/20</div>
                      <div className="text-muted extra-small fw-bold">REMAINING</div>
                    </div>
                  </Col>
                </Row>
              </Card>

            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default StudentDashboard;