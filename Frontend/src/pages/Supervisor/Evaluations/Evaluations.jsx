import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar, Form, Dropdown } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, AlertCircle, Clock, 
  MessageSquare, Star, Download, Eye, 
  Filter, ChevronRight, Award, Edit3
} from 'lucide-react';
import '../SupervisorStyles.css';

const EVALUATIONS_DATA = [
  {
    id: 1,
    student: "Ahmed Khalil",
    deliverable: "Interim Report - Chapter 1 & 2",
    submissionDate: "2026-05-10",
    status: "Pending",
    grade: null,
    progress: 45
  },
  {
    id: 2,
    student: "Fatima Zahra",
    deliverable: "Final Codebase & Documentation",
    submissionDate: "2026-05-08",
    status: "Graded",
    grade: "18.5/20",
    progress: 100
  },
  {
    id: 3,
    student: "Sara Kamali",
    deliverable: "Technical Specifications",
    submissionDate: "2026-05-05",
    status: "Reviewing",
    grade: null,
    progress: 75
  },
  {
    id: 4,
    student: "Youssef Amrani",
    deliverable: "Project Proposal & Planning",
    submissionDate: "2026-05-12",
    status: "Pending",
    grade: null,
    progress: 20
  }
];

const Evaluations = () => {
  const [filter, setFilter] = useState('All');

  const filteredData = filter === 'All' ? EVALUATIONS_DATA : EVALUATIONS_DATA.filter(item => item.status === filter);

  return (
    <div className="sv-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Header */}
        <header className="sv-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-2">Evaluations & Feedback</h1>
            <p className="sv-welcome-subtitle mb-0">
              Review student submissions, provide feedback, and track milestones
            </p>
          </motion.div>
          <div className="d-flex gap-3">
            <Button className="btn-pro-outline d-flex align-items-center gap-2">
              <Download size={18} /> Batch Export
            </Button>
            <Button className="sv-btn-gradient d-flex align-items-center gap-2">
              <Award size={18} /> Final Grades
            </Button>
          </div>
        </header>

        {/* Evaluation Summary Cards */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="sv-card-premium border-0 shadow-sm p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="sv-card-title mb-0">Grading Progress</h5>
                <Badge bg="primary" className="bg-opacity-10 text-primary border-0 px-3 py-1 rounded-pill extra-small">Semester 2</Badge>
              </div>
              <Row className="text-center g-4">
                <Col xs={4}>
                  <div className="h2 fw-black text-navy mb-1">14</div>
                  <div className="extra-small text-muted fw-bold uppercase">Total Submissions</div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="h2 fw-black text-success mb-1">8</div>
                  <div className="extra-small text-muted fw-bold uppercase">Evaluated</div>
                </Col>
                <Col xs={4}>
                  <div className="h2 fw-black text-warning mb-1">6</div>
                  <div className="extra-small text-muted fw-bold uppercase">Remaining</div>
                </Col>
              </Row>
              <div className="mt-4">
                <div className="d-flex justify-content-between extra-small fw-black text-navy mb-2">
                  <span>Overall Correction Progress</span>
                  <span>57%</span>
                </div>
                <ProgressBar now={57} variant="success" style={{ height: '8px' }} className="rounded-pill shadow-none" />
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="sv-card-premium border-0 shadow-sm p-4 h-100 bg-navy text-white">
              <h5 className="fw-bold mb-4">AI Grading Assistant</h5>
              <p className="extra-small opacity-75 mb-4">
                Our AI has pre-analyzed <strong>4 new submissions</strong> for plagiarism and technical consistency. 
                Reports are ready for your review.
              </p>
              <Button variant="light" className="w-100 py-2 extra-small fw-black text-navy rounded-pill shadow-sm">
                View AI Insights
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Submissions List */}
        <div className="sv-table-container shadow-sm border-0">
          <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-black text-navy">Recent Submissions</h5>
            <div className="d-flex gap-2">
              <Form.Select 
                className="sv-filter-select extra-small border-0 shadow-none bg-light" 
                style={{ width: '150px' }}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Graded">Graded</option>
              </Form.Select>
            </div>
          </div>
          <div className="table-responsive">
            <Table className="sv-table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Deliverable Name</th>
                  <th>Submitted On</th>
                  <th>Status</th>
                  <th>Grade</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredData.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="sv-avatar sm">{item.student.charAt(0)}</div>
                          <span className="fw-black text-navy small">{item.student}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="extra-small text-muted fw-bold">{item.deliverable}</span>
                        </div>
                      </td>
                      <td><span className="extra-small text-muted fw-medium">{item.submissionDate}</span></td>
                      <td>
                        <span className={`sv-status-badge shadow-none sv-badge-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        {item.grade ? (
                          <span className="extra-small fw-black text-success">{item.grade}</span>
                        ) : (
                          <span className="extra-small text-muted opacity-50">--</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button variant="link" className="p-2 text-primary hover-bg-light border-0">
                            <Eye size={18} />
                          </Button>
                          <Button variant="link" className="p-2 text-success hover-bg-light border-0">
                            <Edit3 size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Evaluations;
