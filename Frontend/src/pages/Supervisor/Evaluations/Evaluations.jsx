import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar, Form, Dropdown } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, AlertCircle, Clock, 
  MessageSquare, Star, Download, Eye, 
  Filter, ChevronRight, Award, Edit3
} from 'lucide-react';

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
    <div className="supervisor-evaluations-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Evaluations & Feedback</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Review student submissions, provide feedback, and track milestones
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Batch Export
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm">
              <Award size={18} /> Final Grades
            </Button>
          </div>
        </header>

        {/* Evaluation Summary Cards */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="glass-card border-0 shadow-sm border p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-navy mb-0">Grading Progress</h6>
                <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">Semester 2</Badge>
              </div>
              <Row className="text-center g-4">
                <Col xs={4}>
                  <div className="h2 fw-bold text-navy mb-1">14</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Total Submissions</div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="h2 fw-bold text-success mb-1">8</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Evaluated</div>
                </Col>
                <Col xs={4}>
                  <div className="h2 fw-bold text-warning mb-1">6</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Remaining</div>
                </Col>
              </Row>
              <div className="mt-4">
                <div className="d-flex justify-content-between extra-small fw-bold text-navy mb-2">
                  <span className="opacity-75">Overall Correction Progress</span>
                  <span className="text-primary">57%</span>
                </div>
                <ProgressBar now={57} variant="primary" style={{ height: '8px' }} className="rounded-pill bg-surface-alt border-0" />
              </div>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="glass-card border-0 shadow-sm border p-4 h-100 bg-navy text-white text-center d-flex flex-column justify-content-center">
              <h6 className="fw-bold mb-3 text-white">AI Grading Assistant</h6>
              <p className="extra-small opacity-75 mb-4 fw-bold">
                Our AI has pre-analyzed <strong>4 new submissions</strong> for plagiarism and technical consistency. 
              </p>
              <Button variant="light" className="w-100 py-3 extra-small fw-bold text-navy rounded-pill shadow-sm border-0">
                View AI Insights
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Submissions List */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <h6 className="mb-0 fw-bold text-navy">Recent Submissions Queue</h6>
            <div className="d-flex gap-2">
              <Form.Select 
                className="bg-surface-alt border-0 shadow-none extra-small fw-bold py-2 rounded-pill border" 
                style={{ width: '150px' }}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Graded">Graded</option>
              </Form.Select>
            </div>
          </Card.Header>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student Name</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Deliverable</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Submitted On</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Grade</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
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
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                            {item.student.charAt(0)}
                          </div>
                          <span className="fw-bold text-navy small">{item.student}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="extra-small text-muted fw-bold opacity-75">{item.deliverable}</span>
                        </div>
                      </td>
                      <td><span className="extra-small text-muted fw-bold opacity-75">{item.submissionDate}</span></td>
                      <td>
                        <Badge className={`bg-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'}-soft text-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td>
                        {item.grade ? (
                          <span className="extra-small fw-bold text-success">{item.grade}</span>
                        ) : (
                          <span className="extra-small text-muted opacity-25 fw-bold">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button variant="link" className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none">
                            <Eye size={18} />
                          </Button>
                          <Button variant="link" className="p-2 text-success hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none">
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
        </Card>
      </Container>
    </div>
  );
};

export default Evaluations;
