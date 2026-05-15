import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Form, Button, Table, ProgressBar, Dropdown, Modal, InputGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Download, Search, Calendar, MoreVertical, 
  Edit, Eye, X, ChevronRight, Activity, Clock
} from 'lucide-react';

import { useApp } from '../../../context/AppContext.jsx';

const PROJECTS_DATA = [];

const JuryProjectsPage = () => {
  const navigate = useNavigate();
  const { students = [] } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const stats = [
    { label: 'Total Assigned', value: students.length.toString(), color: 'primary' },
    { label: 'Pending Evaluation', value: students.filter((s) => !s.isJuryEvaluated).length.toString(), color: 'warning' },
    { label: 'Evaluated', value: students.filter((s) => s.isJuryEvaluated).length.toString(), color: 'success' },
  ];

  return (
    <div className="jury-projects-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Assigned Projects</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Manage and evaluate the projects assigned to you.</p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Export List
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {stats.map((stat, i) => (
            <Col lg={4} md={6} key={i}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border border-light border-opacity-10 border-start-4 border-${stat.color}`}>
                <div className="h3 fw-bold text-navy mb-1">{stat.value}</div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-50">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Search Bar */}
        <div className="glass-card p-4 rounded-4 mb-5 shadow-sm border border-light border-opacity-10">
          <InputGroup className="bg-surface-alt rounded-pill border px-3">
            <InputGroup.Text className="bg-transparent border-0 text-muted pe-1">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search by student or project..." 
              className="bg-transparent border-0 shadow-none small py-2 text-navy fw-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Projects Table */}
        <Card className="glass-card rounded-4 overflow-hidden shadow-sm mb-5 border-light border-opacity-10">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-surface-alt">
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project Title</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Supervisor</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Progress</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-5 opacity-50 fw-bold small">No projects assigned to your jury</td></tr>
                ) : (
                  students.filter(p => 
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    (p.project && p.project.toLowerCase().includes(searchTerm.toLowerCase()))
                  ).map((proj, idx) => (
                    <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className={`avatar-sm bg-${proj.color || 'primary'}-soft text-${proj.color || 'primary'} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px', fontSize: '0.75rem' }}>
                            {proj.name.charAt(0)}
                          </div>
                          <div>
                            <div className="small fw-bold text-navy">{proj.name}</div>
                            <div className="extra-small text-muted fw-bold opacity-50">{proj.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="small fw-bold text-navy text-truncate mb-1" style={{maxWidth: '250px'}} title={proj.project}>{proj.project}</div>
                        <div className="extra-small text-muted d-flex align-items-center gap-1 fw-bold opacity-50">
                          <Calendar size={12} className="text-primary" /> Defense: {proj.date || 'TBD'}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="small fw-bold text-navy opacity-75">{proj.supervisor || 'N/A'}</span>
                      </td>
                      <td className="py-3">
                        <div className="d-flex align-items-center gap-2" style={{ width: '120px' }}>
                          <ProgressBar now={proj.progress || 0} className="flex-grow-1" style={{ height: '6px' }} />
                          <span className="extra-small text-muted fw-bold opacity-75">{proj.progress || 0}%</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge className={`bg-${proj.isJuryEvaluated ? 'success' : 'warning'}-soft text-${proj.isJuryEvaluated ? 'success' : 'warning'} border-0 extra-small fw-bold px-3 py-1`}>
                          {proj.isJuryEvaluated ? 'Evaluated' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-primary-soft rounded-circle transition-all"><MoreVertical size={18}/></Dropdown.Toggle>
                          <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small p-2">
                            <Dropdown.Item className="py-2 fw-bold text-navy" onClick={() => navigate('/jury/evaluation', { state: { openStudentId: proj.id } })}><Edit size={14} className="me-2 text-primary"/> Evaluate</Dropdown.Item>
                            <Dropdown.Item className="py-2 fw-bold text-navy" onClick={() => { setSelectedProject(proj); setShowModal(true); }}><Eye size={14} className="me-2 text-info"/> Details</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="py-2 fw-bold text-danger"><X size={14} className="me-2"/> Report Issue</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="jury-modern-modal">
        <div className="glass-card rounded-4 overflow-hidden border-0 shadow-lg">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-navy mb-0">Project Details</h5>
            <Button variant="link" className="p-2 text-muted shadow-none border-0 hover-bg-surface-alt rounded-circle" onClick={() => setShowModal(false)}><X size={20}/></Button>
          </div>
          <div className="p-4">
            {selectedProject && (
              <div className="space-y-4">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className={`p-4 rounded-circle bg-${selectedProject.color || 'primary'}-soft text-${selectedProject.color || 'primary'} fw-bold h4 mb-0 d-flex align-items-center justify-content-center`} style={{ width: '64px', height: '64px' }}>
                    {selectedProject.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="fw-bold text-navy mb-0">{selectedProject.name}</h5>
                    <div className="extra-small text-muted fw-bold opacity-75">ID: {selectedProject.id}</div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Project Title</div>
                  <div className="small fw-bold text-navy lh-base">{selectedProject.project}</div>
                </div>
                <Row className="g-4">
                  <Col xs={6}>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Supervisor</div>
                    <div className="small fw-bold text-navy">{selectedProject.supervisor || 'N/A'}</div>
                  </Col>
                  <Col xs={6}>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-50">Defense Date</div>
                    <div className="small fw-bold text-navy">{selectedProject.date || 'TBD'}</div>
                  </Col>
                </Row>
              </div>
            )}
          </div>
          <div className="p-4 border-top bg-surface-alt d-flex gap-2">
            <Button variant="outline-secondary" className="flex-grow-1 rounded-pill fw-bold extra-small border-2" onClick={() => setShowModal(false)}>Close</Button>
            <Button className="btn-premium flex-grow-1 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => navigate('/jury/evaluation', { state: { openStudentId: selectedProject.id } })}>Evaluate</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JuryProjectsPage;
