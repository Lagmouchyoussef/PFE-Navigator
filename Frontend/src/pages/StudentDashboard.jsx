import React from 'react';
import { 
  Container, Row, Col, Badge, 
  ProgressBar, Button
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Check, Clock, FileText, GraduationCap, 
  LayoutDashboard, FileUp, Calendar, 
  ChevronRight, Mail, MessageSquare,
  AlertCircle, Activity, ExternalLink,
  Target, Zap, Bell, User
} from 'lucide-react';
import './StudentDashboard.css';

const StudentDashboard = () => {
  return (
    <div className="sd-page-container">
      <Container fluid className="px-0">
        
        {/* HEADER AREA */}
        <div className="bento-profile-top">
          <div className="bento-avatar">AK</div>
          <div>
            <h5 className="fw-black mb-0">Ahmed Khalil</h5>
            <p className="text-muted extra-small mb-0 fw-bold">CS Department • Final Year Project</p>
          </div>
          <div className="ms-auto d-flex gap-2">
            <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-light"><Bell size={20} /></Button>
            <Button className="btn-bento shadow-sm">Submit Deliverable</Button>
          </div>
        </div>

        {/* BENTO GRID */}
        <div className="bento-grid">
          
          {/* 1. Large Card: Project Progression (Vertical Timeline) */}
          <div className="bento-item bento-tall">
            <span className="bento-stat-label">Project Progression</span>
            <div className="bento-timeline">
              {[
                { name: 'Research & Proposal', status: 'done', desc: 'Validated Feb 12' },
                { name: 'System Architecture', status: 'done', desc: 'Validated Mar 05' },
                { name: 'Core Development', status: 'active', desc: 'Phase 2 in progress' },
                { name: 'Testing & QA', status: 'next', desc: 'Scheduled May 10' },
                { name: 'Final Defense', status: 'next', desc: 'Scheduled Jun 15' }
              ].map((step, i) => (
                <div key={i} className="timeline-item-bento">
                  <div className={`bento-dot ${step.status}`}>
                    {step.status === 'done' ? <Check size={14} /> : <span>{i + 1}</span>}
                  </div>
                  <div>
                    <div className={`fw-bold small ${step.status === 'next' ? 'text-muted' : ''}`}>{step.name}</div>
                    <div className="extra-small text-muted opacity-75">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-4 bg-light border border-white">
              <div className="d-flex justify-content-between mb-2">
                <span className="extra-small fw-bold text-muted">CURRENT PHASE</span>
                <Badge bg="primary" className="extra-small">On Track</Badge>
              </div>
              <ProgressBar now={65} className="rounded-pill" style={{ height: '6px' }} />
            </div>
          </div>

          {/* 2. Stat Card: Deadline */}
          <div className="bento-item">
            <span className="bento-stat-label">Submission Deadline</span>
            <div className="bento-stat-value text-warning">15 Days</div>
            <div className="extra-small text-muted fw-bold">UNTIL FINAL REPORT</div>
            <div className="mt-3 text-warning-custom d-flex align-items-center gap-1 extra-small fw-bold">
              <Clock size={12} /> May 20, 2026
            </div>
          </div>

          {/* 3. Stat Card: Documents */}
          <div className="bento-item">
            <span className="bento-stat-label">Deliverables</span>
            <div className="bento-stat-value text-primary">8 / 10</div>
            <div className="extra-small text-muted fw-bold">VERSIONS VALIDATED</div>
            <div className="mt-3 text-primary d-flex align-items-center gap-1 extra-small fw-bold">
              <FileText size={12} /> 2 Pending Review
            </div>
          </div>

          {/* 4. Large Card: Overall Performance Ring */}
          <div className="bento-item bento-tall text-center">
            <span className="bento-stat-label">Overall Completion</span>
            <div className="bento-ring-wrapper my-4">
              <svg className="bento-ring-svg" width="120" height="120">
                <circle className="bento-ring-bg" cx="60" cy="60" r="54" />
                <circle className="bento-ring-fill" cx="60" cy="60" r="54" style={{ strokeDasharray: '339', strokeDashoffset: '84' }} />
              </svg>
              <div className="bento-ring-text">75%</div>
            </div>
            <div className="d-grid gap-2 text-start">
              <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center">
                <span className="extra-small fw-bold text-muted">COMPLETED TASKS</span>
                <span className="fw-black small text-success">15</span>
              </div>
              <div className="p-3 rounded-4 bg-light d-flex justify-content-between align-items-center">
                <span className="extra-small fw-bold text-muted">REMAINING</span>
                <span className="fw-black small text-warning">05</span>
              </div>
            </div>
            <Button className="btn-bento w-100 mt-4 py-2 small">Task Management</Button>
          </div>

          {/* 5. Stat Card: Current Grade */}
          <div className="bento-item">
            <span className="bento-stat-label">Project Score</span>
            <div className="bento-stat-value text-success">85 / 100</div>
            <div className="extra-small text-muted fw-bold">ESTIMATED PERFORMANCE</div>
          </div>

          {/* 6. Stat Card: Status */}
          <div className="bento-item">
            <span className="bento-stat-label">System Status</span>
            <div className="d-flex align-items-center gap-2 mt-2">
              <div className="status-pulse"></div>
              <span className="fw-black h5 mb-0">Active</span>
            </div>
            <div className="extra-small text-muted fw-bold mt-1">CONNECTED TO SERVER</div>
          </div>

          {/* 7. Wide Card: Workspace / History */}
          <div className="bento-item bento-wide">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="bento-stat-label mb-0">Submission History</span>
              <Button variant="link" className="text-primary small p-0 text-decoration-none fw-bold">View Repository</Button>
            </div>
            <div className="d-grid gap-3">
              {[
                { name: 'Interim_Report_v2.pdf', date: 'Yesterday', type: 'Report' },
                { name: 'Architecture_Docs.zip', date: '3 days ago', type: 'Tech' }
              ].map((doc, i) => (
                <div key={i} className="p-3 rounded-4 bg-light d-flex align-items-center justify-content-between hover-bg-white border-white border">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 bg-white rounded-3 shadow-sm text-primary"><FileText size={18} /></div>
                    <div>
                      <div className="fw-bold small">{doc.name}</div>
                      <div className="extra-small text-muted">{doc.date} • {doc.type}</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-muted opacity-50" />
                </div>
              ))}
            </div>
          </div>

          {/* 8. Card: Supervisor info */}
          <div className="bento-item">
            <span className="bento-stat-label">Supervisor</span>
            <div className="d-flex align-items-center gap-3 mt-2 mb-3">
              <div className="avatar-circle-sm bg-navy text-white">SS</div>
              <div>
                <div className="fw-bold small">Dr. Sarah Smith</div>
                <div className="extra-small text-muted">CS Dept</div>
              </div>
            </div>
            <Button className="btn-bento-outline w-100 py-2 small fw-bold">Message</Button>
          </div>

          {/* 9. Card: Feedback */}
          <div className="bento-item">
            <span className="bento-stat-label">Last Feedback</span>
            <p className="extra-small text-muted mb-0 italic mt-2">
              "The architecture is solid. Focus on the testing phase results."
            </p>
            <div className="text-primary fw-bold extra-small mt-2">2 days ago</div>
          </div>

        </div>

      </Container>
    </div>
  );
};

export default StudentDashboard;