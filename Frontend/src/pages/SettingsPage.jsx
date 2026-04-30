import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Tab, Table, InputGroup } from 'react-bootstrap';
import { 
  User, Bell, Shield, Moon, Sun, CheckCircle, Save, Camera, 
  ChevronRight, Lock, Smartphone,
  Languages, Eye, EyeOff, Globe2, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import './SettingsPage.css';

const SettingsPage = () => {
  const { session } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="settings-page-layout">
      <Container className="py-5">
        {/* Header Section */}
        <header className="d-flex justify-content-between align-items-end mb-5">
          <div>
            <h2 className="fw-bold text-navy mb-1">Account Settings</h2>
            <p className="text-muted mb-0">Manage your institutional identity and security preferences.</p>
          </div>
          <Button 
            className="btn-save-settings px-4 py-2 d-flex align-items-center gap-2"
            onClick={handleSave}
          >
            {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
            {isSaved ? 'All Changes Saved' : 'Save Changes'}
          </Button>
        </header>

        <Row className="g-4">
          {/* Settings Sidebar */}
          <Col lg={3}>
            <Card className="settings-nav-card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="p-2">
                {[
                  { id: 'profile', label: 'Public Profile', icon: <User size={20} /> },
                  { id: 'security', label: 'Login & Security', icon: <Lock size={20} /> },
                  { id: 'preferences', label: 'Preferences', icon: <Sun size={20} /> },
                  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  >
                    <span className="icon-wrap">{item.icon}</span>
                    <span className="label-wrap">{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={16} className="ms-auto opacity-50" />}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="mt-4 border-0 shadow-sm rounded-4 bg-navy text-white p-4">
              <h6 className="fw-bold mb-3 small d-flex align-items-center gap-2">
                <Shield size={18} className="text-primary" /> Security Status
              </h6>
              <div className="extra-small opacity-75 mb-3">Your account security is 85% complete. Enable 2FA for maximum protection.</div>
              <div className="progress bg-white bg-opacity-10 mb-4" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
              </div>
              <Button variant="link" className="text-white extra-small p-0 fw-bold text-decoration-none">Review Security <ChevronRight size={12} /></Button>
            </Card>
          </Col>

          {/* Settings Content Area */}
          <Col lg={9}>
            <Tab.Container activeKey={activeTab}>
              <Card className="settings-content-card border-0 shadow-sm rounded-4 overflow-hidden">
                <Card.Body className="p-4 p-md-5">
                  <Tab.Content>
                    {/* Profile Section */}
                    <Tab.Pane eventKey="profile">
                      <div className="d-flex align-items-center gap-4 mb-5">
                        <div className="position-relative">
                          <div className="profile-avatar-large bg-primary bg-opacity-10 text-primary">
                            {session?.name?.charAt(0)}
                          </div>
                          <Button className="avatar-upload-btn shadow-sm"><Camera size={16} /></Button>
                        </div>
                        <div>
                          <h4 className="fw-bold text-navy mb-1">{session?.name}</h4>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Badge className="badge-role">{session?.role?.toUpperCase()}</Badge>
                            <span className="extra-small text-muted fw-medium">EMSI University Portal</span>
                          </div>
                          <p className="extra-small text-muted mb-0">Profile picture should be at least 400x400px.</p>
                        </div>
                      </div>

                      <Form>
                        <Row className="g-4">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Full Name</Form.Label>
                              <Form.Control defaultValue={session?.name} className="settings-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Email Address</Form.Label>
                              <Form.Control defaultValue={session?.email} className="settings-input" readOnly />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">University ID</Form.Label>
                              <Form.Control defaultValue="EMSI-2026-9482" className="settings-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Major / Department</Form.Label>
                              <Form.Control defaultValue="Software Engineering" className="settings-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="settings-label">Professional Bio</Form.Label>
                              <Form.Control as="textarea" rows={4} placeholder="Tell us about your academic interests..." className="settings-input" />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </Tab.Pane>

                    {/* Security Section */}
                    <Tab.Pane eventKey="security">
                      <h5 className="fw-bold text-navy mb-4">Password Management</h5>
                      <div className="mb-5">
                        <Form>
                          <Row className="g-3">
                            <Col md={12}>
                              <Form.Group>
                                <Form.Label className="settings-label">Current Password</Form.Label>
                                <InputGroup className="settings-input-group">
                                  <Form.Control type={showPassword ? 'text' : 'password'} className="border-0 bg-transparent shadow-none" />
                                  <InputGroup.Text className="bg-transparent border-0 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                  </InputGroup.Text>
                                </InputGroup>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="settings-label">New Password</Form.Label>
                                <Form.Control type="password" className="settings-input" />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="settings-label">Confirm New Password</Form.Label>
                                <Form.Control type="password" className="settings-input" />
                              </Form.Group>
                            </Col>
                          </Row>
                        </Form>
                      </div>

                      <h5 className="fw-bold text-navy mb-4">Two-Factor Authentication</h5>
                      <div className="p-4 rounded-4 bg-light border border-dashed mb-5">
                        <div className="d-flex gap-3">
                          <div className="p-2 rounded bg-primary bg-opacity-10 text-primary h-auto d-flex align-items-center"><Smartphone size={24} /></div>
                          <div>
                            <div className="fw-bold text-navy small mb-1">Authenticator App (Recommended)</div>
                            <p className="extra-small text-muted mb-3">Use an app like Google Authenticator or Microsoft Authenticator to generate verification codes.</p>
                            <Button variant="primary" size="sm" className="fw-bold px-4">Setup App</Button>
                          </div>
                        </div>
                      </div>

                      <h5 className="fw-bold text-navy mb-4">Recent Sessions</h5>
                      <div className="table-responsive">
                        <Table hover className="settings-table align-middle">
                          <thead>
                            <tr>
                              <th className="extra-small fw-bold text-muted">DEVICE</th>
                              <th className="extra-small fw-bold text-muted">LOCATION</th>
                              <th className="extra-small fw-bold text-muted">LAST ACTIVITY</th>
                              <th className="extra-small fw-bold text-muted">STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><div className="extra-small fw-bold text-navy">Windows 11 • Chrome</div></td>
                              <td><div className="extra-small text-muted">Casablanca, Morocco</div></td>
                              <td><div className="extra-small text-muted">Active Now</div></td>
                              <td><Badge bg="success" className="badge-status">Current</Badge></td>
                            </tr>
                            <tr>
                              <td><div className="extra-small fw-bold text-navy">iPhone 13 • Safari</div></td>
                              <td><div className="extra-small text-muted">Rabat, Morocco</div></td>
                              <td><div className="extra-small text-muted">2 days ago</div></td>
                              <td><Button variant="link" className="p-0 text-danger extra-small fw-bold text-decoration-none">Revoke</Button></td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </Tab.Pane>

                    {/* Preferences Section */}
                    <Tab.Pane eventKey="preferences">
                      <h5 className="fw-bold text-navy mb-4">Interface Preferences</h5>
                      <Row className="g-4 mb-5">
                        <Col md={4}>
                          <div className="p-4 rounded-4 bg-light border transition-all hover-shadow text-center cursor-pointer">
                            <Sun size={32} className="text-warning mb-3" />
                            <h6 className="fw-bold text-navy small mb-2">Light Mode</h6>
                            <Form.Check type="radio" name="theme" id="theme-light" label="Clean White" />
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-4 rounded-4 bg-light border transition-all hover-shadow text-center cursor-pointer active-theme">
                            <Moon size={32} className="text-primary mb-3" />
                            <h6 className="fw-bold text-navy small mb-2">Dark Mode</h6>
                            <Form.Check type="radio" name="theme" id="theme-dark" label="Institutional Dark" defaultChecked />
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-4 rounded-4 bg-light border transition-all hover-shadow text-center cursor-pointer">
                            <Smartphone size={32} className="text-secondary mb-3" />
                            <h6 className="fw-bold text-navy small mb-2">System Mode</h6>
                            <Form.Check type="radio" name="theme" id="theme-system" label="Follow OS" />
                          </div>
                        </Col>
                      </Row>

                      <h5 className="fw-bold text-navy mb-4">Localization & Time</h5>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="settings-label">Language</Form.Label>
                            <InputGroup className="settings-input-group p-1">
                              <InputGroup.Text className="bg-transparent border-0"><Languages size={18} className="text-primary" /></InputGroup.Text>
                              <Form.Select className="border-0 bg-transparent shadow-none small fw-medium">
                                <option>English (US)</option>
                                <option>French (FR)</option>
                                <option>Arabic (MA)</option>
                              </Form.Select>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="settings-label">Timezone</Form.Label>
                            <InputGroup className="settings-input-group p-1">
                              <InputGroup.Text className="bg-transparent border-0"><Globe2 size={18} className="text-primary" /></InputGroup.Text>
                              <Form.Select className="border-0 bg-transparent shadow-none small fw-medium">
                                <option>(GMT+01:00) Casablanca</option>
                                <option>(GMT+00:00) London</option>
                                <option>(GMT+01:00) Paris</option>
                              </Form.Select>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Tab.Pane>

                    {/* Notifications Section */}
                    <Tab.Pane eventKey="notifications">
                      <h5 className="fw-bold text-navy mb-4">Communication Channels</h5>
                      <div className="d-flex flex-column gap-3">
                        {[
                          { title: 'Project Feedback', desc: 'Notify me when my supervisor leaves feedback.', channels: ['Email', 'Push'] },
                          { title: 'Grade Published', desc: 'Immediate alert when a final grade is released.', channels: ['Email', 'SMS', 'Push'] },
                          { title: 'Upcoming Deadlines', desc: 'Reminders 48h and 24h before submission.', channels: ['Push'] },
                          { title: 'Security Alerts', desc: 'Notifications about new logins and password changes.', channels: ['Email'] },
                        ].map((item, i) => (
                          <div key={i} className="p-4 rounded-4 bg-light border d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold text-navy small mb-1">{item.title}</div>
                              <p className="extra-small text-muted mb-0">{item.desc}</p>
                              <div className="d-flex gap-2 mt-2">
                                {item.channels.map((c, ci) => (
                                  <Badge key={ci} bg="white" text="primary" className="border extra-small">{c}</Badge>
                                ))}
                              </div>
                            </div>
                            <Form.Check type="switch" defaultChecked />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
