import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Button, Table
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Check, Clock, FileText, GraduationCap, 
  LayoutDashboard, FileUp, Calendar, 
  ChevronRight, Mail, MessageSquare,
  AlertCircle, Activity, ExternalLink,
  Info
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="sd-page-container">
      <Container fluid className="px-0">
        
        {/* HEADER SECTION */}
        <header className="sd-welcome-header">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Welcome, Ahmed Khalil
          </motion.h1>
          <p className="text-muted small fw-medium">Student Management System • CS Department</p>
        </header>

        {/* TOP STATS GRID */}
        <Row className="g-4 mb-4">
          {[
            { label: 'Project Status', value: 'In Progress', badge: 'Active', color: '#3498db', icon: <Activity size={20} /> },
            { label: 'Submission Deadline', value: '15 Days', color: '#f39c12', icon: <Calendar size={20} /> },
            { label: 'Documents Submitted', value: '8 / 10', color: '#27ae60', icon: <FileText size={20} /> },
            { label: 'Current Grade', value: '85 / 100', color: '#2c3e50', icon: <GraduationCap size={20} /> }
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <Card className="sd-premium-card sd-card-body sd-stat-tile">
                <div>
                  <span className="sd-stat-label">{stat.label}</span>
                  <div className="sd-stat-value">{stat.value}</div>
                  {stat.badge && <Badge className="badge-sd-active">{stat.badge}</Badge>}
                </div>
                <div className="sd-stat-icon-wrapper shadow-sm" style={{ backgroundColor: stat.color }}>
                  {stat.icon}
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* PROGRESS TIMELINE (FULL WIDTH) */}
        <Card className="sd-premium-card mb-4">
          <Card.Header className="sd-card-header">
            <h5>Project Progress</h5>
          </Card.Header>
          <Card.Body className="sd-stepper-container">
            <div className="sd-stepper-line"></div>
            <div className="sd-stepper-line-progress"></div>
            <div className="sd-stepper-row">
              {[
                { name: 'Proposal', status: 'completed' },
                { name: 'Interim Report', status: 'completed' },
                { name: 'Final Report', status: 'active' },
                { name: 'Defense', status: 'pending' }
              ].map((step, i) => (
                <div key={i} className="sd-stepper-item">
                  <div className={`sd-stepper-circle ${step.status}`}>
                    {step.status === 'completed' ? <Check size={20} /> : <span>{i + 1}</span>}
                  </div>
                  <span className="sd-step-label fw-bold small text-navy">{step.name}</span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* MAIN WORKSPACE & SIDEBAR */}
        <Row className="g-4">
          
          {/* Workspace (Left) */}
          <Col lg={8}>
            <Card className="sd-premium-card sd-card-body mb-4">
              <h5 className="fw-bold mb-4">Upload Documents</h5>
              <div className="sd-drop-zone">
                <FileUp size={48} className="text-muted mb-3 opacity-25" />
                <h6 className="fw-bold mb-2">Drag and drop your files here</h6>
                <p className="text-muted small">or</p>
                <Button variant="outline-primary" className="rounded-pill px-5 mb-2">Browse Files</Button>
                <p className="text-muted extra-small">Supported formats: PDF, DOCX (Max 10MB)</p>
              </div>
            </Card>

            <Card className="sd-premium-card sd-card-body">
              <h5 className="fw-bold mb-4">Uploaded Documents</h5>
              <Table responsive hover className="sd-table mb-0">
                <thead>
                  <tr>
                    <th>Document Name</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Interim_Report_v2.pdf', date: '2026-04-20', size: '2.4 MB' },
                    { name: 'Project_Proposal_v1.pdf', date: '2026-03-15', size: '1.8 MB' }
                  ].map((doc, i) => (
                    <tr key={i} className="sd-table-row align-middle border-bottom">
                      <td className="py-3 ps-0">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-light rounded text-primary">
                            <FileText size={20} />
                          </div>
                          <div>
                            <div className="fw-bold small">{doc.name}</div>
                            <div className="text-muted extra-small">{doc.date} • {doc.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-end pe-0">
                        <Button variant="link" className="text-primary text-decoration-none fw-bold small">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Col>

          {/* Sidebar (Right) */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              
              <Card className="sd-premium-card sd-card-body">
                <h6 className="fw-bold mb-3">Upcoming Defense</h6>
                <div className="sd-widget-highlight d-flex gap-3">
                  <Calendar size={22} className="text-primary" />
                  <div>
                    <div className="fw-bold small">Final Defense Presentation</div>
                    <div className="text-muted extra-small">May 20, 2026</div>
                    <div className="text-muted extra-small">10:00 AM - Room 304</div>
                  </div>
                </div>
              </Card>

              <Card className="sd-premium-card sd-card-body">
                <h6 className="fw-bold mb-3">Recent Feedback</h6>
                <div className="sd-feedback-border">
                  <div className="fw-bold small">Interim Report Revision</div>
                  <p className="text-muted extra-small mb-1">"Please revise sections 3.2 and 4.1. Good progress overall!"</p>
                  <div className="text-primary fw-bold extra-small">2 days ago</div>
                </div>
              </Card>

              <Card className="sd-premium-card sd-card-body">
                <span className="sd-stat-label mb-3 d-block">Your Supervisor</span>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="sd-avatar-lg">SS</div>
                  <div>
                    <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
                    <div className="extra-small text-muted">CS Department</div>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="extra-small text-muted d-flex align-items-center gap-2"><Mail size={14} /> s.smith@university.edu</div>
                  <div className="extra-small text-muted d-flex align-items-center gap-2"><MessageSquare size={14} /> +1 (555) 123-4567</div>
                </div>
                <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold small border-0 shadow-sm">Contact Supervisor</Button>
              </Card>

              <Card className="sd-premium-card sd-card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0">Overall Progress</h6>
                  <span className="text-primary fw-bold">75%</span>
                </div>
                <ProgressBar now={75} className="mb-3 rounded-pill" style={{ height: '8px' }} />
                <Row className="g-2 text-center">
                  <Col xs={6}>
                    <div className="bg-light py-2 rounded">
                      <div className="text-success fw-bold small">15/20</div>
                      <div className="text-muted extra-small">Completed</div>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="bg-light py-2 rounded">
                      <div className="text-warning fw-bold small">5/20</div>
                      <div className="text-muted extra-small">Remaining</div>
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