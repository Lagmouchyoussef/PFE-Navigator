import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, ListGroup, InputGroup } from 'react-bootstrap';
import { 
  User, Bell, Shield, Moon, Sun, CheckCircle, Save, Camera, 
  Mail, Building, Briefcase, GraduationCap, Microscope,
  ChevronRight, Settings, Globe, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const SettingsPage = () => {
  const { session } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme && currentTheme !== theme) {
      setTheme(currentTheme || 'light');
    }
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isJury = session?.role === 'jury';
  const roleLabel = session?.role?.charAt(0).toUpperCase() + session?.role?.slice(1);
  const department = isJury ? 'Computer Science & Networks' : 'Computer Engineering';

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Account Settings</h3>
            <p className="text-muted small mb-0">Manage your profile, appearance, and security preferences.</p>
          </div>
          <Button 
            variant="primary" 
            className="rounded-3 px-4 py-2 fw-bold d-flex align-items-center gap-2"
            onClick={handleSave}
          >
            {saved ? <CheckCircle size={18} /> : <Save size={18} />}
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
              <div className="p-2">
                {[
                  { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
                  { id: 'appearance', label: 'Appearance', icon: <Moon size={18} /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
                  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-100 d-flex align-items-center gap-3 px-3 py-3 rounded-3 border-0 transition-all fw-semibold small mb-1 ${activeTab === tab.id ? 'bg-primary bg-opacity-10 text-primary' : 'bg-transparent text-muted hover-bg-light'}`}
                  >
                    {tab.icon} {tab.label}
                    {activeTab === tab.id && <ChevronRight size={14} className="ms-auto" />}
                  </button>
                ))}
              </div>
            </Card>
          </Col>

          {/* Main Content Area */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
              <div className="p-4 border-bottom bg-light bg-opacity-50">
                <h6 className="fw-bold mb-0">
                  {activeTab === 'profile' && 'Account Information'}
                  {activeTab === 'appearance' && 'Interface Customization'}
                  {activeTab === 'notifications' && 'Communication Preferences'}
                  {activeTab === 'security' && 'Privacy & Security'}
                </h6>
              </div>

              <div className="p-4 p-md-5">
                {activeTab === 'profile' && (
                  <div>
                    <div className="d-flex align-items-center gap-4 mb-5 pb-5 border-bottom">
                      <div className="position-relative">
                        <div className="avatar-circle-xl bg-primary bg-opacity-10 text-primary fw-bold border">
                          {session?.name?.charAt(0)}
                        </div>
                        <Button variant="white" size="sm" className="position-absolute bottom-0 end-0 rounded-circle border shadow-sm p-1">
                          <Camera size={16} />
                        </Button>
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-1">{session?.name}</h5>
                        <p className="text-muted small mb-3">{session?.email}</p>
                        <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1 rounded-pill extra-small fw-bold">
                          {roleLabel} Portal
                        </Badge>
                      </div>
                    </div>

                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Display Name</Form.Label>
                          <Form.Control defaultValue={session?.name} className="bg-light border shadow-none p-2 small fw-semibold" />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Institutional Email</Form.Label>
                          <Form.Control defaultValue={session?.email} className="bg-light border shadow-none p-2 small fw-semibold" />
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Department / Office</Form.Label>
                          <Form.Control defaultValue={department} className="bg-light border shadow-none p-2 small fw-semibold" />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div>
                    <h6 className="fw-bold small text-dark mb-4">Choose your workspace theme</h6>
                    <Row className="g-3">
                      <Col md={6}>
                        <div 
                          className={`p-4 rounded-3 border-2 border-dashed transition-all text-center cursor-pointer ${theme === 'light' ? 'border-primary bg-primary bg-opacity-5' : 'bg-light'}`}
                          onClick={() => {setTheme('light'); document.documentElement.setAttribute('data-theme', 'light')}}
                        >
                          <Sun size={24} className={theme === 'light' ? 'text-primary' : 'text-muted'} />
                          <div className="mt-2 small fw-bold">Classic Light</div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div 
                          className={`p-4 rounded-3 border-2 border-dashed transition-all text-center cursor-pointer ${theme === 'dark' ? 'border-primary bg-primary bg-opacity-5' : 'bg-light'}`}
                          onClick={() => {setTheme('dark'); document.documentElement.setAttribute('data-theme', 'dark')}}
                        >
                          <Moon size={24} className={theme === 'dark' ? 'text-primary' : 'text-muted'} />
                          <div className="mt-2 small fw-bold">Professional Dark</div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="d-flex flex-column gap-3">
                    {[
                      { title: 'System Updates', desc: 'Notify me of major platform changes.' },
                      { title: 'Project Alerts', desc: 'Notify me when a report is validated.' },
                      { title: 'Messages', desc: 'Notify me of new direct communications.' },
                    ].map((n, i) => (
                      <div key={i} className="p-3 rounded-3 bg-light d-flex justify-content-between align-items-center">
                        <div>
                          <div className="small fw-bold">{n.title}</div>
                          <div className="extra-small text-muted">{n.desc}</div>
                        </div>
                        <Form.Check type="switch" defaultChecked className="custom-switch" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <div className="p-4 rounded-3 bg-primary bg-opacity-5 border border-primary border-opacity-10 mb-4">
                      <div className="d-flex align-items-center gap-2 mb-2 text-primary">
                        <Shield size={20} />
                        <h6 className="fw-bold mb-0 small">Active Session Protection</h6>
                      </div>
                      <p className="extra-small text-muted mb-4 fw-medium">Your account uses institutional encryption for all data transmissions.</p>
                      <Button variant="primary" size="sm" className="rounded-pill px-4 fw-bold small">Update Password</Button>
                    </div>
                    <div className="p-3 rounded-3 border-danger border-opacity-20 border bg-danger bg-opacity-5 d-flex justify-content-between align-items-center">
                      <div>
                        <div className="small fw-bold text-danger">Terminate Session</div>
                        <p className="extra-small text-muted mb-0">Logout from all other devices.</p>
                      </div>
                      <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold small">Log Out</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
