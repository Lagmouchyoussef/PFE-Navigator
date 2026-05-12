import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Form, Modal, InputGroup } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, 
  CheckCircle, Clock, AlertCircle, 
  MoreVertical, Edit3, Trash2, 
  ChevronRight, Users, Target, Layout
} from 'lucide-react';

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
    <div className="supervisor-subjects-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy">Thesis Subjects</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Propose and manage research topics for the current academic session
            </p>
          </motion.div>
          <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> Propose New Subject
          </Button>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total Subjects', value: '12', icon: <BookOpen />, color: 'primary' },
            { label: 'Approved', value: '8', icon: <CheckCircle />, color: 'success' },
            { label: 'Pending Review', value: '3', icon: <Clock />, color: 'warning' },
            { label: 'Taken By Students', value: '5', icon: <Users />, color: 'info' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card border-0 shadow-sm border p-3"
              >
                <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color} mb-3 d-inline-block shadow-sm`}>
                  {stat.icon}
                </div>
                <div className="h3 mb-0 fw-bold text-navy">{stat.value}</div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-75">{stat.label}</div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Content Section */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <h5 className="mb-0 fw-bold text-navy d-flex align-items-center gap-2">
              <Layout size={20} className="text-primary" />
              Active Proposals
            </h5>
            <div className="d-flex gap-2">
              <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '250px' }}>
                <InputGroup.Text className="bg-transparent border-0 pe-0">
                  <Search size={16} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Filter subjects..." 
                  className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </div>
          </Card.Header>

          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Subject Title & Description</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Category</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Students</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
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
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3" style={{ maxWidth: '400px' }}>
                        <div className="fw-bold text-navy small mb-1">{subject.title}</div>
                        <div className="extra-small text-muted fw-bold opacity-75 text-truncate-2" style={{ lineHeight: '1.4' }}>
                          {subject.description}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="extra-small fw-bold text-navy">{subject.category}</span>
                          <span className="extra-small text-muted fw-bold opacity-50" style={{ fontSize: '10px' }}>{subject.difficulty}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-xs bg-surface-alt text-navy rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '28px', height: '28px', fontSize: '10px' }}>
                            {subject.students}
                          </div>
                          <span className="extra-small text-muted fw-bold opacity-75">Enrolled</span>
                        </div>
                      </td>
                      <td>
                        <Badge className={`bg-${getStatusStyle(subject.status)}-soft text-${getStatusStyle(subject.status)} border-0 px-3 py-1 extra-small fw-bold d-inline-flex align-items-center gap-1`}>
                          {subject.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button variant="link" className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none">
                            <Edit3 size={18} />
                          </Button>
                          <Button variant="link" className="p-2 text-danger hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none">
                            <Trash2 size={18} />
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
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Propose New Subject</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Subject Title</Form.Label>
              <Form.Control placeholder="e.g. Machine Learning in Healthcare" className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Category / Technology</Form.Label>
              <Form.Control placeholder="e.g. Python, TensorFlow, React" className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description & Objectives</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Describe the project scope and expected outcomes..." className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
            </Form.Group>
            <Row className="mb-4">
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Difficulty</Form.Label>
                <Form.Select className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Max Students</Form.Label>
                <Form.Control type="number" defaultValue={1} className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" />
              </Col>
            </Row>
            <Button className="btn-premium w-100 py-3 fw-bold rounded-4 shadow-sm" onClick={() => setShowAddModal(false)}>
              Submit Proposal
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Subjects;
