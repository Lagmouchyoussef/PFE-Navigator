import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Table, Dropdown } from 'react-bootstrap';
import { Search, Filter, MoreVertical, Play, Eye, Calendar, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react';

const JuryProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const assignedProjects = [
    { id: 1, student: 'Ahmed Benali', title: 'AI-based Academic Integrity System', domain: 'Artificial Intelligence', supervisor: 'Dr. S. Miller', date: 'May 10, 2026', status: 'Ready for Review', progress: 100 },
    { id: 2, student: 'Fatima Zahra', title: 'Smart Campus IoT Architecture', domain: 'IoT Networks', supervisor: 'Pr. A. Dupont', date: 'May 12, 2026', status: 'Pending', progress: 60 },
    { id: 3, student: 'Youssef Alaoui', title: 'Blockchain Voting Mechanism', domain: 'Cybersecurity', supervisor: 'Dr. K. Smith', date: 'May 05, 2026', status: 'Evaluated', progress: 100 },
    { id: 4, student: 'Sarah Mansour', title: 'Predictive Maintenance in Industry 4.0', domain: 'Data Science', supervisor: 'Dr. H. El Fassi', date: 'May 18, 2026', status: 'Ready for Review', progress: 100 },
    { id: 5, student: 'Omar Tazi', title: 'E-Commerce Recommendation Engine', domain: 'Web Development', supervisor: 'Pr. L. Gomez', date: 'May 20, 2026', status: 'Pending', progress: 40 },
    { id: 6, student: 'Nadia Karim', title: 'Autonomous Drone Navigation System', domain: 'Robotics', supervisor: 'Dr. S. Miller', date: 'May 02, 2026', status: 'Evaluated', progress: 100 },
  ];

  const filteredProjects = assignedProjects.filter(proj => {
    const matchesSearch = proj.student.toLowerCase().includes(searchTerm.toLowerCase()) || proj.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Evaluated': return <Badge bg="success" className="bg-opacity-10 text-success px-3 py-1 rounded-pill small fw-bold">Evaluated</Badge>;
      case 'Ready for Review': return <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-1 rounded-pill small fw-bold">Ready for Review</Badge>;
      case 'Pending': return <Badge bg="warning" className="bg-opacity-10 text-warning px-3 py-1 rounded-pill small fw-bold">Pending</Badge>;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Assigned PFE Projects</h3>
            <p className="text-muted small mb-0">Browse and manage candidate evaluations assigned to you.</p>
          </div>
          <Button variant="outline-primary" className="fw-bold px-3 small d-flex align-items-center gap-2 shadow-sm">
            <Filter size={16} /> Advanced Search
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-4 rounded-3 bg-white p-3">
           <Row className="g-3 align-items-center">
             <Col lg={4}>
                <InputGroup size="sm" className="bg-light rounded-pill px-3 border shadow-inner">
                  <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                  <Form.Control 
                    placeholder="Search candidate or topic..." 
                    className="bg-transparent border-0 shadow-none py-2 small fw-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
             </Col>
             <Col lg={8}>
                <div className="d-flex gap-2 flex-wrap justify-content-lg-end">
                   {['All', 'Pending', 'Ready for Review', 'Evaluated'].map(s => (
                      <Button 
                        key={s}
                        variant={statusFilter === s ? 'primary' : 'white'}
                        size="sm"
                        className={`rounded-pill px-3 fw-bold border-0 ${statusFilter === s ? 'shadow-sm' : 'text-muted hover-bg-light'}`}
                        onClick={() => setStatusFilter(s)}
                      >
                        {s}
                      </Button>
                   ))}
                </div>
             </Col>
           </Row>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-muted extra-small text-uppercase">
              <tr>
                <th className="ps-4 py-3 border-0">Candidate & Project</th>
                <th className="py-3 border-0">Domain</th>
                <th className="py-3 border-0">Advisor</th>
                <th className="py-3 border-0">Defense Date</th>
                <th className="py-3 border-0">Status</th>
                <th className="text-end pe-4 py-3 border-0">Action</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {filteredProjects.map(proj => (
                <tr key={proj.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="avatar-circle-sm bg-primary bg-opacity-10 text-primary fw-bold">{proj.student.charAt(0)}</div>
                      <div>
                        <div className="small fw-bold text-dark">{proj.student}</div>
                        <div className="extra-small text-muted text-truncate" style={{ maxWidth: '200px' }}>{proj.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge bg="light" text="dark" className="border extra-small rounded-pill px-2">{proj.domain}</Badge>
                  </td>
                  <td className="py-3 small text-muted fw-medium">{proj.supervisor}</td>
                  <td className="py-3 small fw-bold text-dark">
                    <Calendar size={14} className="text-primary me-2 opacity-75" /> {proj.date}
                  </td>
                  <td className="py-3">
                    {getStatusBadge(proj.status)}
                  </td>
                  <td className="text-end pe-4 py-3">
                    <Dropdown align="end">
                       <Dropdown.Toggle variant="link" className="p-1 text-muted border-0 shadow-none hide-caret">
                          <MoreVertical size={18} />
                       </Dropdown.Toggle>
                       <Dropdown.Menu className="border shadow-sm rounded-3">
                          <Dropdown.Item className="small fw-bold py-2 text-primary d-flex align-items-center gap-2"><Play size={14} /> Evaluate</Dropdown.Item>
                          <Dropdown.Item className="small fw-bold py-2 d-flex align-items-center gap-2"><Eye size={14} /> View Report</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="small fw-bold py-2 d-flex align-items-center gap-2"><Calendar size={14} /> Schedule</Dropdown.Item>
                       </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </div>
  );
};

export default JuryProjectsPage;
