import React, { useState, useRef } from 'react';
import { 
  Monitor, Bell, Shield, 
  Puzzle, Globe, Clock, 
  Moon, Sun, Save, Upload,
  ChevronRight, Mail, Server, Smartphone, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Form, Badge, Nav } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

type SettingsTab = 'general' | 'appearance' | 'profile' | 'notifications' | 'security';

const PortalSettings: React.FC = () => {
  const { user, setTheme, theme } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactElement }[] = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  ];

  return (
    <div className="settings-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1 text-navy">Portal Settings</h2>
          <p className="text-muted small mb-0 fw-bold opacity-75">Advanced management of the platform and its services.</p>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <div className="glass-card shadow-sm rounded-4 overflow-hidden mb-4 border">
              <div className="p-3 border-bottom bg-surface-alt">
                <span className="extra-small fw-bold text-muted text-uppercase">Configuration</span>
              </div>
              <Nav className="flex-column p-2">
                {tabs.map((tab) => (
                  <Nav.Link
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`d-flex align-items-center gap-3 px-3 py-3 rounded-3 fw-bold small transition-all mb-1 border-0 ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-muted hover-bg-surface'
                    }`}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      {tab.icon}
                    </div>
                    <span className="flex-grow-1">{tab.label}</span>
                    <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-25'} />
                  </Nav.Link>
                ))}
              </Nav>
            </div>


          </Col>

          {/* Settings Content */}
          <Col lg={9}>
            <div className="glass-card shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column border">
              <div className="border-bottom p-4 bg-surface-alt">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-navy">
                  <div className="text-primary d-flex align-items-center justify-content-center">
                    {tabs.find(t => t.id === activeTab)?.icon}
                  </div>
                  {tabs.find(t => t.id === activeTab)?.label}
                </h5>
              </div>
              
              <div className="p-4 p-md-5 flex-grow-1">
                {activeTab === 'general' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Basic Information</h6>
                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Institution Name</Form.Label>
                        <Form.Control defaultValue="EMSI University - PFE Portals" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Admin Email</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Interface Language</Form.Label>
                        <div className="form-control-premium fw-bold d-flex align-items-center justify-content-between bg-surface-alt">
                          <span>{navigator.language === 'fr-FR' || navigator.language === 'fr' ? 'French (FR)' : navigator.language === 'en-US' || navigator.language === 'en' ? 'English (US)' : navigator.language}</span>
                          <Badge className="bg-success-soft text-success border-0 extra-small px-2">System Connected</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Date Format</Form.Label>
                        <Form.Select className="form-control-premium fw-bold">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Global Controls</h6>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt border">
                        <div>
                          <div className="small fw-bold text-navy">System Maintenance</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Displays a maintenance page for all users.</div>
                        </div>
                        <Form.Check type="switch" id="maintenance-switch" className="custom-switch-lg" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt border">
                        <div>
                          <div className="small fw-bold text-navy">Open Registrations</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Allow new students to create an account.</div>
                        </div>
                        <Form.Check type="switch" id="register-switch" defaultChecked className="custom-switch-lg" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Theme & Visual Identity</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-3">Display Mode</Form.Label>
                      <Row className="g-3">
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all border-primary bg-primary-soft shadow-sm">
                            <Sun size={24} className="mb-2 text-primary" />
                            <div className="extra-small fw-bold text-navy">Light Mode</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all opacity-50 bg-surface-alt">
                            <Moon size={24} className="mb-2 text-muted" />
                            <div className="extra-small fw-bold text-muted">Dark Mode</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all opacity-50 bg-surface-alt">
                            <Monitor size={24} className="mb-2 text-muted" />
                            <div className="extra-small fw-bold text-muted">System</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-3">Platform Logo</Form.Label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="d-none" 
                        accept="image/*"
                      />
                      <div className="d-flex align-items-center gap-4 p-4 rounded-4 border border-dashed bg-surface-alt">
                        <div className="p-4 bg-white rounded-3 shadow-sm border d-flex align-items-center justify-content-center">
                          <img src="/logo_emsi.png" alt="EMSI" style={{ maxHeight: '40px' }} />
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            className="btn-premium mb-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Change Logo
                          </Button>
                          <div className="extra-small text-muted fw-bold opacity-75">Recommended: PNG or SVG, transparent background.</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="d-flex align-items-center gap-4 mb-5 p-4 rounded-4 bg-surface-alt border">
                      <div className="position-relative">
                        <div className="rounded-circle bg-primary shadow-lg text-white d-flex align-items-center justify-content-center fw-bold border border-4 border-white" style={{ width: '120px', height: '120px', fontSize: '2.5rem' }}>
                          {user?.name?.charAt(0) || 'A'}
                        </div>
                        <Button size="sm" variant="primary" className="position-absolute bottom-0 end-0 p-2 rounded-circle shadow-lg border border-2 border-white translate-middle-x mb-1">
                          <Upload size={16}/>
                        </Button>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="fw-bold mb-1 text-navy">{user?.name || 'Administrator'}</h4>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Badge className="bg-primary-soft text-primary border-0 extra-small px-3 py-1 rounded-pill fw-bold text-uppercase">Role: {user?.role || 'Admin'}</Badge>
                          <Badge className="bg-success-soft text-success border-0 extra-small px-3 py-1 rounded-pill fw-bold text-uppercase">Verified Account</Badge>
                        </div>
                        <p className="extra-small text-muted mb-0 fw-bold opacity-75">User ID: #AD-2026-991</p>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy d-flex align-items-center gap-2">
                      <User size={18} className="text-primary" /> Account Details
                    </h6>
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">First Name</Form.Label>
                        <Form.Control defaultValue={user?.name?.split(' ')[0] || 'Admin'} className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Last Name</Form.Label>
                        <Form.Control defaultValue={user?.name?.split(' ')[1] || 'System'} className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Professional Email</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="form-control-premium fw-bold" readOnly />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Phone Number</Form.Label>
                        <Form.Control defaultValue="+212 6 00 00 00 00" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Department</Form.Label>
                        <Form.Select className="form-control-premium fw-bold">
                          <option>Computer Engineering</option>
                          <option>Civil Engineering</option>
                          <option>Management</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Position / Role</Form.Label>
                        <Form.Control defaultValue="Portal Manager" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Biography / Description</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          className="form-control-premium fw-bold" 
                          placeholder="Tell us about yourself..."
                          defaultValue="Responsible for coordinating graduation projects at EMSI."
                        />
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Notification Preferences</h6>
                    
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-circle text-primary"><Mail size={18}/></div>
                          <div>
                            <div className="small fw-bold text-navy">Email Reports</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Weekly summary of portal activity.</div>
                          </div>
                        </div>
                        <Form.Check type="switch" defaultChecked className="custom-switch-lg" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-circle text-primary"><Bell size={18}/></div>
                          <div>
                            <div className="small fw-bold text-navy">Desktop Alerts</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Instant notifications for new submissions.</div>
                          </div>
                        </div>
                        <Form.Check type="switch" defaultChecked className="custom-switch-lg" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Account Security</h6>
                    <Row className="g-4 mb-5">
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Current Password</Form.Label>
                        <Form.Control type="password" placeholder="••••••••••••" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">New Password</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 characters" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 characters" className="form-control-premium fw-bold" />
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Two-Factor Authentication</h6>
                    <div className="p-4 rounded-4 border bg-surface-alt shadow-sm">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-3 text-primary">
                            <Smartphone size={24} />
                          </div>
                          <div>
                            <div className="small fw-bold text-navy">Authenticator App</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Secure your account with Google Authenticator or Authy.</div>
                          </div>
                        </div>
                        <Button className="btn-premium px-4">Enable 2FA</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 border-top text-end bg-surface-alt">
                <Button className="btn-premium px-4">
                  <Save size={18} className="me-2" />
                  Save Settings
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PortalSettings;
