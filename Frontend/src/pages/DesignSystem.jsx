import React from 'react';
import { Container, Row, Col, Button, Form, Card, Table, Badge, Nav } from 'react-bootstrap';
import { 
  Home, Users, Book, CheckCircle, Clock, 
  AlertCircle, Settings, Mail, Search, ChevronDown 
} from 'lucide-react';
import './DesignSystem.css';

const DesignSystem = () => {
  const colors = [
    { name: 'Primary Navy', hex: '#2c3e50', label: 'Primary brand color for text and deep backgrounds.' },
    { name: 'Secondary Blue', hex: '#3498db', label: 'Primary action color for buttons and highlights.' },
    { name: 'Success Green', hex: '#27ae60', label: 'Used for approved status and positive feedback.' },
    { name: 'Warning Orange', hex: '#f39c12', label: 'Used for pending status and soft warnings.' },
    { name: 'Danger Red', hex: '#e74c3c', label: 'Used for rejected status and critical errors.' },
    { name: 'Light Gray', hex: '#ecf0f1', label: 'Backgrounds and subtle borders.' },
    { name: 'Medium Gray', hex: '#bdc3c7', label: 'Disabled states and icons.' },
    { name: 'Slate Gray', hex: '#95a5a6', label: 'Muted text and secondary information.' },
  ];

  return (
    <div className="ds-container">
      <Container fluid="xl">
        {/* Header */}
        <header className="ds-header">
          <h1 className="display-4 fw-bold mb-2">PFE Portal Design System</h1>
          <p className="text-muted fs-5">A comprehensive UI Kit for the Final Year Project Management Application.</p>
        </header>

        {/* 1. Color Palette */}
        <section className="ds-section">
          <h2 className="ds-section-title">01. Color Palette</h2>
          <div className="color-grid">
            {colors.map((color, index) => (
              <div key={index} className="color-card">
                <div className="color-preview" style={{ backgroundColor: color.hex }}></div>
                <div className="color-info">
                  <div className="color-name">{color.name}</div>
                  <div className="color-hex">{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography */}
        <section className="ds-section">
          <h2 className="ds-section-title">02. Typography Hierarchy</h2>
          <Card className="pfe-card border-0">
            <div className="typo-example">
              <span className="typo-label">Heading 1</span>
              <h1 className="m-0 fw-bold">Management Dashboard</h1>
            </div>
            <div className="typo-example">
              <span className="typo-label">Heading 2</span>
              <h2 className="m-0 fw-bold">Project Overview</h2>
            </div>
            <div className="typo-example">
              <span className="typo-label">Heading 3</span>
              <h3 className="m-0 fw-semibold">Recent Notifications</h3>
            </div>
            <div className="typo-example">
              <span className="typo-label">Body Text</span>
              <p className="m-0">This design system is built to provide a consistent and professional user experience for students, supervisors, and administrative staff managing academic projects.</p>
            </div>
            <div className="typo-example">
              <span className="typo-label">Caption</span>
              <small className="text-muted">Updated 2 minutes ago • Version 1.2.0</small>
            </div>
          </Card>
        </section>

        {/* 3. Buttons & Actions */}
        <section className="ds-section">
          <h2 className="ds-section-title">03. Button Library</h2>
          <Card className="pfe-card border-0">
            <div className="mb-4">
              <h6 className="text-muted mb-3 small fw-bold">BUTTON STYLES</h6>
              <div className="btn-demo-group">
                <Button className="btn-pfe-primary">Primary Action</Button>
                <Button className="btn-pfe-outline">Secondary Action</Button>
                <Button variant="danger" className="px-4 py-2 border-0" style={{ backgroundColor: '#e74c3c' }}>Delete Project</Button>
                <Button className="btn-pfe-ghost">Cancel</Button>
              </div>
            </div>
            <div className="mb-0">
              <h6 className="text-muted mb-3 small fw-bold">ICON BUTTONS</h6>
              <div className="btn-demo-group">
                <Button className="btn-pfe-primary d-flex align-items-center gap-2">
                  <Mail /> Send Message
                </Button>
                <Button className="btn-pfe-outline d-flex align-items-center gap-2">
                  <Book /> View Report
                </Button>
                <Button variant="light" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <Settings />
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* 4. Form Elements */}
        <section className="ds-section">
          <h2 className="ds-section-title">04. Form & Input Elements</h2>
          <Row>
            <Col md={6}>
              <Card className="pfe-card border-0 mb-4">
                <Form.Group className="mb-4">
                  <label className="pfe-label">Project Title</label>
                  <Form.Control type="text" className="pfe-input" placeholder="Enter project title..." />
                </Form.Group>
                <Form.Group className="mb-4">
                  <label className="pfe-label">Academic Year</label>
                  <div className="position-relative">
                    <Form.Select className="pfe-input appearance-none">
                      <option>2023-2024</option>
                      <option>2024-2025</option>
                    </Form.Select>
                  </div>
                </Form.Group>
                <div className="d-flex gap-4">
                  <Form.Check type="checkbox" label="Public View" id="check1" defaultChecked />
                  <Form.Check type="switch" label="Auto-Approve" id="switch1" />
                </div>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="pfe-card border-0 mb-4">
                <label className="pfe-label">Search Repository</label>
                <div className="position-relative">
                  <span className="position-absolute translate-middle-y top-50 ps-3 text-muted">
                    <Search />
                  </span>
                  <Form.Control type="text" className="pfe-input ps-5" placeholder="Keywords, students, or supervisors..." />
                </div>
                <div className="mt-4">
                  <label className="pfe-label">Project Status</label>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge className="pfe-badge pfe-badge-pending">Pending Review</Badge>
                    <Badge className="pfe-badge pfe-badge-approved">Approved</Badge>
                    <Badge className="pfe-badge pfe-badge-rejected">Rejected</Badge>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </section>

        {/* 5. UI Components */}
        <section className="ds-section">
          <h2 className="ds-section-title">05. Specialized UI Components</h2>
          <Row className="g-4">
            {/* Sidebar Preview */}
            <Col lg={4}>
              <h6 className="text-muted mb-3 small fw-bold">SIDEBAR NAVIGATION</h6>
              <div className="sidebar-preview shadow">
                <div className="px-4 mb-4">
                  <div className="fw-bold fs-5">PFE Portal</div>
                </div>
                <div className="sidebar-item active">
                  <Home /> Dashboard
                </div>
                <div className="sidebar-item">
                  <Users /> Students
                </div>
                <div className="sidebar-item">
                  <Book /> Projects
                </div>
                <div className="sidebar-item">
                  <CheckCircle /> Evaluations
                </div>
                <div className="mt-5 sidebar-item">
                  <Settings /> Settings
                </div>
              </div>
            </Col>

            {/* Data Table */}
            <Col lg={8}>
              <h6 className="text-muted mb-3 small fw-bold">DATA TABLES</h6>
              <Card className="pfe-card border-0 overflow-hidden p-0">
                <Table responsive hover className="m-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 py-3 ps-4 text-muted small text-uppercase">Student</th>
                      <th className="border-0 py-3 text-muted small text-uppercase">Project</th>
                      <th className="border-0 py-3 text-muted small text-uppercase">Deadline</th>
                      <th className="border-0 py-3 text-muted small text-uppercase">Status</th>
                      <th className="border-0 py-3 pe-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-4 py-3 align-middle">
                        <div className="fw-bold">Alice Johnson</div>
                        <div className="small text-muted">alice.j@university.edu</div>
                      </td>
                      <td className="py-3 align-middle">AI in Radiology</td>
                      <td className="py-3 align-middle">
                        <div className="d-flex align-items-center gap-1">
                          <Clock className="text-warning" /> May 15, 2024
                        </div>
                      </td>
                      <td className="py-3 align-middle">
                        <Badge className="pfe-badge pfe-badge-pending">Pending</Badge>
                      </td>
                      <td className="pe-4 py-3 align-middle text-end">
                        <Button variant="link" className="text-muted p-0"><ChevronDown /></Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="ps-4 py-3 align-middle">
                        <div className="fw-bold">Robert Smith</div>
                        <div className="small text-muted">r.smith@university.edu</div>
                      </td>
                      <td className="py-3 align-middle">Blockchain for Logistics</td>
                      <td className="py-3 align-middle">
                        <div className="d-flex align-items-center gap-1">
                          <Clock className="text-muted" /> Jun 02, 2024
                        </div>
                      </td>
                      <td className="py-3 align-middle">
                        <Badge className="pfe-badge pfe-badge-approved">Approved</Badge>
                      </td>
                      <td className="pe-4 py-3 align-middle text-end">
                        <Button variant="link" className="text-muted p-0"><ChevronDown /></Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </section>

        <footer className="text-center mt-5 pt-5 text-muted border-top">
          <p>© 2024 PFE Portal Management System • Built with React & Bootstrap 5</p>
        </footer>
      </Container>
    </div>
  );
};

export default DesignSystem;
