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
  AlertCircle, Activity, ExternalLink
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="sd-page-container">
      <Container fluid className="px-0">
        
        {/* EXECUTIVE HEADER */}
        <div className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h1 className="sd-welcome-title mb-1">Ahmed Khalil</h1>
            <p className="text-muted small mb-0 fw-medium">PFE Management System • CS Department</p>
          </div>
          <div className="d-flex gap-2">
            <Button className="btn-exe-outline d-flex align-items-center gap-2 small">
              <MessageSquare size={16} /> Contact Support
            </Button>
            <Button className="btn-exe-primary d-flex align-items-center gap-2 small shadow-sm">
              <FileUp size={16} /> New Submission
            </Button>
          </div>
        </div>

        {/* MINIMALIST METRIC TILES */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Project Status', value: 'In Progress', sub: 'Active', color: '#10b981' },
            { label: 'Submission Deadline', value: '15 Days', sub: 'Until final report', color: '#f59e0b' },
            { label: 'Documents Submitted', value: '8/10', sub: 'Approved versions', color: '#3b82f6' },
            { label: 'Current Grade', value: '85/100', sub: 'Project estimation', color: '#6366f1' }
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <Card className="sd-exe-card sd-stat-tile">
                <span className="sd-stat-label">{stat.label}</span>
                <div className="sd-stat-value">{stat.value}</div>
                <div className="d-flex align-items-center gap-2">
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: stat.color }}></div>
                  <span className="text-muted extra-small fw-bold uppercase">{stat.sub}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* REFINED TIMELINE */}
        <Card className="sd-exe-card mb-5 border-0 bg-transparent shadow-none">
          <div className="d-flex justify-content-between align-items-center mb-4 px-2">
            <h6 className="sd-widget-title mb-0">Project Progress</h6>
            <Badge bg="light" className="text-dark border small fw-normal">Step 3 of 4</Badge>
          </div>
          <div className="sd-timeline-wrapper position-relative">
            <div className="sd-timeline-line-base"></div>
            <div className="sd-timeline-line-fill"></div>
            <Row className="justify-content-between">
              {[
                { name: 'Proposal', status: 'completed' },
                { name: 'Interim Report', status: 'completed' },
                { name: 'Final Report', status: 'active' },
                { name: 'Defense', status: 'pending' }
              ].map((step, i) => (
                <Col key={i} className={`sd-timeline-step ${step.status}`}>
                  <div className={`sd-timeline-node ${step.status}`}>
                    {step.status === 'completed' ? <Check size={16} /> : <span>{i + 1}</span>}
                  </div>
                  <div className="sd-timeline-label">{step.name}</div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>

        {/* WORKSPACE & ANALYTICS */}
        <Row className="g-5">
          
          <Col lg={8}>
            <div className="d-flex flex-column gap-5">
              
              <section>
                <h6 className="sd-widget-title">Deliverable Submission</h6>
                <div className="sd-upload-area">
                  <div className="mx-auto mb-3 text-muted opacity-25">
                    <FileUp size={48} />
                  </div>
                  <h6 className="fw-bold mb-2">Upload Final Report</h6>
                  <p className="text-muted small mb-4">Drag and drop your report files here (PDF, DOCX)</p>
                  <Button className="btn-exe-outline px-5">Select Files</Button>
                </div>
              </section>

              <section>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="sd-widget-title mb-0">Submission History</h6>
                  <Button variant="link" className="text-primary small p-0 text-decoration-none fw-bold">View Archive</Button>
                </div>
                <div className="sd-exe-card overflow-hidden">
                  {[
                    { name: 'Interim_Report_v2.pdf', date: 'Apr 20, 2026', size: '2.4 MB', status: 'Approved' },
                    { name: 'Project_Proposal_v1.pdf', date: 'Mar 15, 2026', size: '1.8 MB', status: 'Approved' }
                  ].map((doc, i) => (
                    <div key={i} className="sd-doc-row px-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="sd-doc-icon">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="fw-bold small">{doc.name}</div>
                          <div className="text-muted extra-small">{doc.date} • {doc.size}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-4">
                        <Badge bg="success" className="bg-opacity-10 text-success rounded-pill px-3 py-1 extra-small fw-bold">{doc.status}</Badge>
                        <Button variant="link" className="p-0 text-muted"><ChevronRight size={18} /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </Col>

          <Col lg={4}>
            <div className="d-flex flex-column gap-5">
              
              <section>
                <h6 className="sd-widget-title">Executive Summary</h6>
                <Card className="sd-exe-card p-4">
                  <div className="d-flex align-items-center gap-4 mb-4">
                    <div className="exe-circle-progress">
                      <svg className="exe-circle-svg" width="100" height="100">
                        <circle className="exe-circle-bg" cx="50" cy="50" r="45" />
                        <circle className="exe-circle-fill" cx="50" cy="50" r="45" style={{ strokeDasharray: '283', strokeDashoffset: '70' }} />
                      </svg>
                      <div className="exe-circle-text">75%</div>
                    </div>
                    <div>
                      <div className="fw-bold h6 mb-1">Overall Progress</div>
                      <p className="text-muted extra-small mb-0">15 of 20 tasks completed successfully.</p>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <div className="flex-grow-1 p-3 bg-light rounded text-center">
                      <div className="fw-bold small">15</div>
                      <div className="text-muted extra-small fw-bold">DONE</div>
                    </div>
                    <div className="flex-grow-1 p-3 bg-light rounded text-center">
                      <div className="fw-bold small">05</div>
                      <div className="text-muted extra-small fw-bold">LEFT</div>
                    </div>
                  </div>
                </Card>
              </section>

              <section>
                <h6 className="sd-widget-title">Academic Support</h6>
                <Card className="sd-exe-card p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="rounded-circle bg-navy text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontWeight: '700' }}>SS</div>
                    <div>
                      <div className="fw-bold small">Dr. Sarah Smith</div>
                      <div className="text-muted extra-small">CS Department Supervisor</div>
                    </div>
                  </div>
                  <div className="sd-feedback-strip mb-4">
                    <p className="extra-small text-muted mb-0">"The current architecture is solid. Focus on documentation."</p>
                  </div>
                  <Button className="btn-exe-primary w-100 py-2 small">Message Supervisor</Button>
                </Card>
              </section>

              <section>
                <h6 className="sd-widget-title">Quick Actions</h6>
                <div className="d-grid gap-2">
                  {[
                    { label: 'Review Guidelines', icon: <AlertCircle size={16} /> },
                    { label: 'Download Template', icon: <FileText size={16} /> },
                    { label: 'View Evaluation', icon: <Activity size={16} /> }
                  ].map((action, i) => (
                    <Button key={i} className="btn-exe-outline w-100 d-flex align-items-center justify-content-between py-2 text-muted">
                      <div className="d-flex align-items-center gap-2 small fw-bold">
                        {action.icon} {action.label}
                      </div>
                      <ExternalLink size={14} className="opacity-50" />
                    </Button>
                  ))}
                </div>
              </section>

            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;