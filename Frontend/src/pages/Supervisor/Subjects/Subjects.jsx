import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, 
  CheckCircle, Clock, AlertCircle, 
  MoreVertical, Edit3, Trash2, 
  ChevronRight, Users, Target, Layout
} from 'lucide-react';
import '../SupervisorStyles.css';

const SUBJECTS_DATA = [
  {
    id: 1,
    title: "AI-Driven Cybersecurity Threat Detection",
    description: "Developing a real-time system using LSTM networks to detect network intrusions.",
    category: "AI / Security",
    difficulty: "Advanced",
    status: "Approved",
    students: 2,
    date: "2026-04-10"
  },
  {
    id: 2,
    title: "Blockchain for Supply Chain Transparency",
    description: "Implementing a decentralized ledger for tracking pharmaceutical products.",
    category: "Blockchain",
    difficulty: "Intermediate",
    status: "Pending",
    students: 0,
    date: "2026-05-02"
  },
  {
    id: 3,
    title: "Microservices Orchestration with Kubernetes",
    description: "Optimizing resource allocation in a high-traffic e-commerce environment.",
    category: "Cloud / DevOps",
    difficulty: "Intermediate",
    status: "Approved",
    students: 1,
    date: "2026-04-15"
  },
  {
    id: 4,
    title: "Edge Computing for Smart Cities",
    description: "Low-latency processing for urban traffic management using Raspberry Pi clusters.",
    category: "IoT / Edge",
    difficulty: "Advanced",
    status: "Revision",
    students: 0,
    date: "2026-05-10"
  }
];

const Subjects = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = SUBJECTS_DATA.filter(sub => 
    sub.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Revision': return 'danger';
      default: return 'primary';
    }
  };

  return (
    <div className="sv-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        
        {/* Header */}
        <header className="sv-welcome-header mb-5 d-flex justify-content-between align-items-end">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-2">Thesis Subjects</h1>
            <p className="sv-welcome-subtitle mb-0">
              Propose and manage research topics for the current academic session
            </p>
          </motion.div>
          <Button className="sv-btn-gradient d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Propose New Subject
          </Button>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Subjects', value: '12', icon: <BookOpen />, color: 'primary' },
            { label: 'Approved', value: '8', icon: <CheckCircle />, color: 'success' },
            { label: 'Pending Review', value: '3', icon: <Clock />, color: 'warning' },
            { label: 'Taken By Students', value: '5', icon: <Users />, color: 'purple' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="sv-stat-card border-0 shadow-sm"
              >
                <div className={`sv-stat-icon-wrapper bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="sv-stat-value h4 mb-0 fw-black text-navy">{stat.value}</div>
                <div className="sv-stat-label extra-small text-muted fw-bold uppercase">{stat.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Content Section */}
        <Card className="sv-card-premium border-0 shadow-sm overflow-hidden">
          <div className="p-4 border-bottom bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <h5 className="mb-0 fw-black text-navy d-flex align-items-center gap-2">
              <Layout size={20} className="text-primary" />
              Active Proposals
            </h5>
            <div className="d-flex gap-2">
              <InputGroup className="sv-search-group" style={{ width: '250px' }}>
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Filter subjects..." 
                  className="sv-search-input border-0 shadow-none extra-small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          </div>

          <div className="table-responsive">
            <Table className="sv-table mb-0 align-middle">
              <thead>
                <tr>
                  <th>Subject Title & Description</th>
                  <th>Category</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredSubjects.map((subject, index) => (
                    <motion.tr 
                      key={subject.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td style={{ maxWidth: '400px' }}>
                        <div className="fw-black text-navy small mb-1">{subject.title}</div>
                        <div className="extra-small text-muted text-truncate-2" style={{ lineHeight: '1.4' }}>
                          {subject.description}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="extra-small fw-bold text-navy">{subject.category}</span>
                          <span className="extra-small text-muted" style={{ fontSize: '10px' }}>{subject.difficulty}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="sv-avatar sm shadow-none" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                            {subject.students}
                          </div>
                          <span className="extra-small text-muted fw-bold">Enrolled</span>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getStatusStyle(subject.status)} className="bg-opacity-10 text-capitalize px-3 py-2 rounded-pill fw-bold" style={{ color: `var(--bs-${getStatusStyle(subject.status)})`, fontSize: '10px' }}>
                          {subject.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button variant="link" className="p-2 text-primary hover-bg-light rounded-3 border-0">
                            <Edit3 size={16} />
                          </Button>
                          <Button variant="link" className="p-2 text-danger hover-bg-light rounded-3 border-0">
                            <Trash2 size={16} />
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

      {/* Add Subject Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)}
        centered
        contentClassName="border-0 shadow-lg rounded-4"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-black text-navy">Propose New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted uppercase">Subject Title</Form.Label>
              <Form.Control placeholder="e.g. Machine Learning in Healthcare" className="sv-form-control py-2 extra-small" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted uppercase">Category / Technology</Form.Label>
              <Form.Control placeholder="e.g. Python, TensorFlow, React" className="sv-form-control py-2 extra-small" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted uppercase">Description & Objectives</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Describe the project scope and expected outcomes..." className="sv-form-control extra-small" />
            </Form.Group>
            <Row className="mb-4">
              <Col>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Difficulty</Form.Label>
                <Form.Select className="sv-form-control extra-small">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Max Students</Form.Label>
                <Form.Control type="number" defaultValue={1} className="sv-form-control extra-small" />
              </Col>
            </Row>
            <Button className="sv-btn-gradient w-100 py-2 fw-bold" onClick={() => setShowAddModal(false)}>
              Submit Proposal
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Subjects;
