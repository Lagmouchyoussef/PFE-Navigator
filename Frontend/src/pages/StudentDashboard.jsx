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

/**
 * StudentDashboard Component
 * High-fidelity PFE management interface for students.
 * Organized into logical sections for better maintainability.
 */

const StatCard = ({ label, value, sub, color, icon }) => (
  <Col lg={3} md={6}>
    <Card className="sd-card sd-stat-card shadow-sm border-0">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="text-dark-muted mb-1">{label}</div>
          <h4 className="fw-bold mb-3">{value}</h4>
          {sub && <Badge className="badge-active">{sub}</Badge>}
        </div>
        <div className={`sd-icon-box bg-pfe-${color} shadow-sm`}>
          {icon}
        </div>
      </div>
    </Card>
  </Col>
);

const StudentDashboard = () => {
  const steps = [
    { name: 'Proposal', status: 'completed' },
    { name: 'Interim Report', status: 'completed' },
    { name: 'Final Report', status: 'active' },
    { name: 'Defense', status: 'pending' },
  ];

  const documents = [
    { name: 'Interim_Report_v2.pdf', date: '2026-04-20', size: '2.4 MB' },
    { name: 'Project_Proposal_v1.pdf', date: '2026-03-15', size: '1.8 MB' }
  ];

  return (
    <div className="sd-page-container">
      <Container fluid className="px-4">
        
        {/* HEADER */}
        <section className="mb-5">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sd-welcome-text mb-1"
          >
            Welcome, Ahmed Khalil
          </motion.h1>
          <p className="text-muted small fw-medium">Academic Year 2025/2026 • Computer Science Department</p>
        </section>

        {/* SECTION 1: KEY METRICS */}
        <Row className="g-4 mb-5">
          <StatCard label="Project Status" value="In Progress" sub="Active" color="blue" icon={<Activity size={24} />} />
          <StatCard label="Submission Deadline" value="15 Days" color="orange" icon={<Calendar size={24} />} />
          <StatCard label="Documents Submitted" value="8/10" color="green" icon={<FileText size={24} />} />
          <StatCard label="Current Grade" value="85/100" color="navy" icon={<GraduationCap size={24} />} />
        </Row>

        {/* SECTION 2: PROJECT PROGRESS */}
        <Card className="sd-card mb-5 shadow-sm border-0">
          <Card.Header className="bg-transparent border-0 p-4 pb-0">
            <h5 className="fw-bold mb-0">Project Progress</h5>
          </Card.Header>
          <Card.Body className="sd-timeline-container">
            <div className="sd-timeline-line"></div>
            <div className="sd-timeline-progress-line"></div>
            <div className="sd-timeline-row">
              {steps.map((step, i) => (
                <div key={i} className="sd-step-item">
                  <div className={`sd-step-circle ${step.status}`}>
                    {step.status === 'completed' ? <CheckCircle size={22} /> : <span>{i + 1}</span>}
                  </div>
                  <div className="sd-step-label">{step.name}</div>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* SECTION 3: WORKSPACE & SIDEBAR */}
        <Row className="g-4">
          
          {/* Main Content Area (Workspace) */}
          <Col lg={8}>
            <Card className="sd-card mb-4 shadow-sm border-0">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold mb-0">Upload Documents</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="sd-upload-area text-center">
                  <FileUp size={48} className="text-muted mb-3 opacity-25" />
                  <h6 className="fw-bold mb-2">Drag and drop your files here</h6>
                  <p className="text-muted small">or</p>
                  <Button variant="outline-primary" className="rounded-pill px-5 mb-2">Browse Files</Button>
                  <p className="extra-small text-muted mb-0">Supported formats: PDF, DOCX (Max 10MB)</p>
                </div>
              </Card.Body>
            </Card>

            <Card className="sd-card shadow-sm border-0">
              <Card.Header className="bg-transparent border-0 p-4 pb-0">
                <h5 className="fw-bold mb-0">Uploaded Documents</h5>
              </Card.Header>
              <Card.Body className="p-4 pt-2">
                <Table responsive hover className="mb-0">
                  <tbody>
                    {documents.map((doc, i) => (
                      <tr key={i} className="align-middle border-bottom">
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded bg-light">
                              <FileText size={20} className="text-primary" />
                            </div>
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

          {/* Sidebar Widgets */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              
              <Card className="sd-card shadow-sm border-0">
                <Card.Header className="bg-transparent border-0 p-4 pb-0">
                  <h6 className="fw-bold mb-0">Upcoming Defense</h6>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="sd-defense-box shadow-none">
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

              <Card className="sd-card shadow-sm border-0">
                <Card.Header className="bg-transparent border-0 p-4 pb-0">
                  <h6 className="fw-bold mb-0">Recent Feedback</h6>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="border-start border-primary border-4 ps-3">
                    <div className="fw-bold small mb-1">Interim Report Revision</div>
                    <p className="extra-small text-muted mb-1">"Please revise sections 3.2 and 4.1. Good progress overall!"</p>
                    <div className="extra-small text-primary fw-bold">2 days ago</div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="sd-card shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="text-muted extra-small text-uppercase fw-bold mb-3">Your Supervisor</div>
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '45px', height: '45px' }}>SS</div>
                    <div>
                      <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
                      <div className="extra-small text-muted">Computer Science Department</div>
                    </div>
                  </div>
                  <Button variant="primary" className="w-100 rounded-pill py-2 fw-bold small shadow-sm border-0">Contact Supervisor</Button>
                </Card.Body>
              </Card>

              <Card className="sd-card shadow-sm border-0">
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0">Overall Progress</h6>
                    <span className="text-primary fw-bold">75%</span>
                  </div>
                  <ProgressBar now={75} className="mb-4 rounded-pill" style={{ height: '10px' }} />
                  <Row className="g-2 text-center">
                    <Col xs={6}>
                      <div className="bg-light p-2 rounded">
                        <div className="text-success fw-bold small">15/20</div>
                        <div className="text-muted extra-small">Completed</div>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="bg-light p-2 rounded">
                        <div className="text-warning fw-bold small">5/20</div>
                        <div className="text-muted extra-small">Remaining</div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;