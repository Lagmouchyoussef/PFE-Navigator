import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, ProgressBar, Form, InputGroup, Modal, Dropdown } from 'react-bootstrap';
import { 
  Search, Filter, MessageSquare, Eye, FileText, 
  MoreVertical, Download, ExternalLink, UserCheck, Clock,
  Calendar, GraduationCap, ChevronRight, AlertCircle, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const MyStudentsPage = () => {
  const { documents, progressPct } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 1, name: 'Youssef Mansouri', email: 'student@mail.com', project: 'Neural Network Optimization for Edge Computing', progress: progressPct, status: progressPct > 80 ? 'On Track' : 'Needs Review', lastSubmission: '2026-04-22', color: 'success' },
    { id: 2, name: 'Sarah El Amrani', email: 'sarah.e@mail.com', project: 'IoT Smart Grid for Urban Energy Management', progress: 45, status: 'Delayed', lastSubmission: '2026-04-15', color: 'danger' },
    { id: 3, name: 'Omar Jabri', email: 'omar.j@mail.com', project: 'Fintech Security Protocol using Blockchain', progress: 88, status: 'On Track', lastSubmission: '2026-04-28', color: 'success' },
    { id: 4, name: 'Layla Bennani', email: 'layla.b@mail.com', project: 'Renewable Energy ERP System', progress: 62, status: 'Revision Needed', lastSubmission: '2026-04-20', color: 'warning' },
    { id: 5, name: 'Ahmed Khalil', email: 'ahmed.k@mail.com', project: 'Autonomous Delivery Drone Pathfinding', progress: 30, status: 'At Risk', lastSubmission: '2026-04-10', color: 'danger' }
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">My Mentored Cohort</h3>
            <p className="text-muted small mb-0">Managing {students.length} active students and their PFE progress.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-3 small d-flex align-items-center gap-2 shadow-sm">
              <Download size={16} /> Export List
            </Button>
            <Button variant="primary" className="fw-bold px-3 shadow-sm d-flex align-items-center gap-2">
              <MessageSquare size={16} /> Group Announcement
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="border-0 shadow-sm mb-4 rounded-3 bg-white p-3">
          <InputGroup size="sm" className="bg-light rounded-pill px-3 border shadow-inner">
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
            <Form.Control 
              placeholder="Search by student name or topic..." 
              className="bg-transparent border-0 shadow-none py-2 small fw-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white mb-4">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-muted extra-small text-uppercase">
              <tr>
                <th className="ps-4 py-3 border-0">Student</th>
                <th className="py-3 border-0">PFE Topic</th>
                <th className="py-3 border-0">Progress</th>
                <th className="py-3 border-0">Status</th>
                <th className="text-end pe-4 py-3 border-0">Action</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {filteredStudents.map(s => (
                <tr key={s.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className={`avatar-circle-sm bg-${s.color} bg-opacity-10 text-${s.color} fw-bold`}>{s.name.charAt(0)}</div>
                      <div>
                        <div className="small fw-bold text-dark">{s.name}</div>
                        <div className="extra-small text-muted">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="small text-muted text-truncate fw-medium" style={{ maxWidth: '200px' }}>{s.project}</div>
                  </td>
                  <td className="py-3" style={{ width: '150px' }}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                       <span className="extra-small fw-bold text-dark">{s.progress}%</span>
                       <ProgressBar now={s.progress} variant={s.color} className="flex-grow-1 rounded-pill" style={{ height: '4px' }} />
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge bg={s.color} className="bg-opacity-10 text-opacity-100 rounded-pill px-3 py-1 extra-small" style={{ color: `var(--bs-${s.color})` }}>
                       {s.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="text-end pe-4 py-3">
                    <div className="d-flex justify-content-end gap-2">
                       <Button variant="link" className="p-1 text-muted" onClick={() => {setSelectedStudent(s); setShowProfile(true)}}><Eye size={18}/></Button>
                       <Button variant="link" className="p-1 text-primary" onClick={() => navigate('/supervisor/messages')}><MessageSquare size={18}/></Button>
                       <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-1 text-muted hide-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                          <Dropdown.Menu className="border shadow-sm rounded-3">
                             <Dropdown.Item className="small fw-bold py-2"><Download size={14} className="me-2" /> Download Files</Dropdown.Item>
                             <Dropdown.Item className="small fw-bold py-2 text-danger"><AlertCircle size={14} className="me-2" /> Mark At Risk</Dropdown.Item>
                          </Dropdown.Menu>
                       </Dropdown>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Lower Grid */}
        <Row className="g-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm rounded-3 p-4 bg-primary text-white">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Calendar size={18} /> Group Sessions</h6>
              <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 mb-4">
                 <div className="extra-small fw-bold uppercase opacity-75 mb-1">Next Meeting</div>
                 <h6 className="fw-bold mb-1">Methodology Sync</h6>
                 <p className="extra-small mb-0 opacity-75">May 02, 2026 • Lab 404</p>
              </div>
              <Button variant="white" className="w-100 rounded-pill py-2 fw-bold small text-primary">Manage Agenda</Button>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="border-0 shadow-sm rounded-3 p-4 bg-white">
               <h6 className="fw-bold mb-4">Cohort Health Overview</h6>
               <Row className="g-3">
                  {[
                    { label: 'On Track', count: 3, color: 'success' },
                    { label: 'Needs Help', count: 1, color: 'warning' },
                    { label: 'Critical', count: 1, color: 'danger' },
                  ].map((stat, i) => (
                    <Col key={i} sm={4}>
                      <div className="p-3 rounded-3 bg-light text-center">
                        <div className={`h4 fw-bold text-${stat.color} mb-1`}>{stat.count}</div>
                        <div className="extra-small text-muted fw-bold uppercase">{stat.label}</div>
                      </div>
                    </Col>
                  ))}
               </Row>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Profile Modal */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered contentClassName="border-0 shadow-lg rounded-4 overflow-hidden">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold h5">Student Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedStudent && (
            <>
              <div className="text-center mb-4">
                <div className={`avatar-circle mx-auto bg-${selectedStudent.color} bg-opacity-10 text-${selectedStudent.color} fw-bold mb-3`} style={{ width: '64px', height: '64px', fontSize: '1.5rem' }}>
                  {selectedStudent.name.charAt(0)}
                </div>
                <h5 className="fw-bold mb-1">{selectedStudent.name}</h5>
                <p className="text-muted small mb-0">{selectedStudent.email}</p>
              </div>
              <div className="bg-light rounded-3 p-3 mb-4">
                <h6 className="extra-small fw-bold text-muted text-uppercase mb-2">Topic</h6>
                <p className="small fw-bold text-dark mb-0">{selectedStudent.project}</p>
              </div>
              <Row className="g-3">
                <Col xs={6}>
                  <div className="border rounded-3 p-3 text-center">
                    <FileText size={20} className="text-primary mb-2" />
                    <div className="small fw-bold">4 Milestones</div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="border rounded-3 p-3 text-center">
                    <Clock size={20} className="text-warning mb-2" />
                    <div className="small fw-bold">2 Days Ago</div>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0 gap-2">
          <Button variant="light" className="flex-grow-1 rounded-3 fw-bold small py-2" onClick={() => setShowProfile(false)}>Close</Button>
          <Button variant="primary" className="flex-grow-1 rounded-3 fw-bold small py-2 shadow-sm" onClick={() => navigate('/supervisor/messages')}>Send Message</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MyStudentsPage;
