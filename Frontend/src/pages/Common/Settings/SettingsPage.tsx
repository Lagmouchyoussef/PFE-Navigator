import React, { useState, useRef } from 'react';
import {
  Container, Row, Col, Form, Button,
  Badge, Table, ProgressBar, InputGroup, Modal
} from 'react-bootstrap';
import {
  User, Bell, Shield, Moon, Sun, CheckCircle, AlertCircle, Save, Camera,
  ChevronRight, Lock, Smartphone, Eye, EyeOff,
  Briefcase, X, Monitor, Copy, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences';

const SettingsPage: React.FC = () => {
  const { user, theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2FA modal
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState<'setup' | 'verify' | 'done'>('setup');
  const [twoFACode, setTwoFACode] = useState('');
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [copied2FA, setCopied2FA] = useState(false);
  const twoFASecret = 'JBSWY3DPEHPK3PXP';

  const handle2FAVerify = () => {
    if (twoFACode.length === 6) {
      setTwoFAStep('done');
      setTwoFAEnabled(true);
    }
  };

  const handle2FAClose = () => {
    setShow2FA(false);
    setTwoFAStep('setup');
    setTwoFACode('');
  };

  const copySecret = () => {
    navigator.clipboard.writeText(twoFASecret);
    setCopied2FA(true);
    setTimeout(() => setCopied2FA(false), 2000);
  };

  // Notification preferences
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>({
    'Project Feedback': true,
    'Deadlines': true,
    'System Announcements': true,
  });

  const toggleNotif = (key: string) => setNotifPrefs(p => ({ ...p, [key]: !p[key] }));

  // Password form
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const handleChangePassword = async () => {
    setPwdError('');
    if (!currentPwd || !newPwd || !confirmPwd) { setPwdError('Please fill in all fields.'); return; }
    if (newPwd.length < 8) { setPwdError('New password must be at least 8 characters.'); return; }
    if (newPwd !== confirmPwd) { setPwdError('Passwords do not match.'); return; }
    setIsSavingPwd(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSavingPwd(false);
    setPwdSuccess(true);
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setTimeout(() => setPwdSuccess(false), 4000);
  };

  const handleSave = () => {
    setSuccessMsg("Your settings have been saved successfully.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const navItems = [
    { id: 'profile', label: 'Public Profile', icon: <User size={20} /> },
    { id: 'security', label: 'Security & Access', icon: <Shield size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'preferences', label: 'UI Preferences', icon: <Sun size={20} /> },
  ];

  return (
    <div className="settings-modern-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card mb-4 p-4 border-start border-4 border-success d-flex justify-content-between align-items-center shadow-sm"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Settings Saved</h6>
                  <p className="extra-small text-muted mb-0">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setShowSuccessCard(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Account Settings</h2>
            <p className="text-muted small mb-0">Manage your institutional identity and security preferences.</p>
          </div>
          {user?.role === 'admin' && (
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={handleSave}
            >
              <Save size={18} /> Save Changes
            </Button>
          )}
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <div className="glass-card rounded-4 overflow-hidden mb-4">
              <div className="d-flex flex-column">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as SettingsTab)}
                    className={`settings-nav-btn p-3 d-flex align-items-center gap-3 border-0 transition-all text-start bg-transparent ${activeTab === item.id ? 'active-nav' : 'hover-bg-surface'}`}
                  >
                    <div className={`${activeTab === item.id ? 'text-primary' : 'text-muted'}`}>{item.icon}</div>
                    <span className={`small fw-bold ${activeTab === item.id ? 'text-primary' : 'text-muted'}`}>{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={16} className="ms-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-4 rounded-4 bg-primary-soft border-primary">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Lock size={18} className="text-primary" />
                <h6 className="fw-bold mb-0 small text-navy">Security Status</h6>
              </div>
              <div className="extra-small fw-bold text-muted mb-2">Protection Score: 85%</div>
              <ProgressBar now={85} variant="primary" className="bg-surface-alt mb-3" style={{ height: '6px' }} />
              <p className="extra-small text-muted mb-0 opacity-75 fw-bold text-center">Enable 2FA to reach 100%.</p>
            </div>
          </Col>

          {/* Content Area */}
          <Col lg={9}>
            <div className="glass-card p-5 rounded-4 shadow-sm min-vh-50">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="d-flex align-items-center gap-4 mb-5 p-4 rounded-4 bg-surface-alt border">
                      <div className="position-relative">
                        <div className="avatar-xl bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold h2 mb-0" style={{ width: '100px', height: '100px' }}>
                          {user?.name?.charAt(0)}
                        </div>
                        {user?.role === 'admin' && (
                          <Button className="position-absolute bottom-0 end-0 p-2 rounded-circle bg-primary border-0 shadow-sm" style={{ width: '36px', height: '36px' }} onClick={() => fileInputRef.current?.click()}>
                            <Camera size={16} color="white" />
                          </Button>
                        )}
                        <input type="file" ref={fileInputRef} className="d-none" />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-navy">{user?.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="primary" className="bg-primary-soft text-primary border border-primary extra-small fw-bold">{user?.role?.toUpperCase()}</Badge>
                          <span className="extra-small text-muted fw-bold">ID: {user?.institutionalId || 'PENDING-ID'}</span>
                        </div>
                        <div className="extra-small text-muted fw-bold mt-2 d-flex align-items-center gap-1">
                          <Briefcase size={12}/> Academic Role: <span className="text-primary">{user?.role === 'admin' ? 'PFE Coordinator' : user?.role}</span>
                        </div>
                      </div>
                    </div>

                    <Form>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Last Name</Form.Label>
                            <Form.Control defaultValue={user?.name?.split(' ')[1] || ''} placeholder="Ex: Smith" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">First Name</Form.Label>
                            <Form.Control defaultValue={user?.name?.split(' ')[0] || ''} placeholder="Ex: John" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Phone Number</Form.Label>
                            <Form.Control type="tel" defaultValue="+212 600 000 000" placeholder="+212 6..." className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Institutional Email</Form.Label>
                            <Form.Control 
                              defaultValue={user?.email} 
                              className="form-control-premium" 
                              readOnly={user?.role !== 'admin'} 
                              title={user?.role !== 'admin' ? "Only administrators can modify the email" : ""}
                            />
                          </Form.Group>
                        </Col>
                        {/* Section: Personal Information */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Personal Information</h6></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">National Identity Card (CIN)</Form.Label>
                            <Form.Control placeholder="Ex: AB123456" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Residential Address</Form.Label>
                            <Form.Control placeholder="Ex: 123 Liberty Street, Casablanca" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        {(user?.role === 'jury' || user?.role === 'supervisor' || user?.role === 'admin') && (
                          <>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-muted mb-2">Social Security Code (CNSS)</Form.Label>
                                <Form.Control placeholder="Ex: 123456789" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label className="small fw-bold text-muted mb-2">Family Status</Form.Label>
                                <Form.Select className="form-control-premium" disabled={user?.role !== 'admin'}>
                                  <option>Single</option>
                                  <option>Married</option>
                                  <option>Divorced</option>
                                  <option>Widowed</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </>
                        )}

                        {/* Section: Academic Information */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Academic Information</h6></Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Academic Year</Form.Label>
                            <Form.Control defaultValue="2025/2026" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        {user?.role !== 'jury' && user?.role !== 'supervisor' && (
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="small fw-bold text-muted mb-2">National Student Code (CNE)</Form.Label>
                              <Form.Control placeholder="Ex: G130000000" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                            </Form.Group>
                          </Col>
                        )}
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Section / Group</Form.Label>
                            <Form.Control placeholder="Ex: 5IIR-G1" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">
                              {user?.role === 'jury' || user?.role === 'supervisor' ? 'Degree Earned' : 'Degree Grade (Final Year)'}
                            </Form.Label>
                            <Form.Control 
                              type={user?.role === 'jury' || user?.role === 'supervisor' ? 'text' : 'number'} 
                              step="0.01" 
                              placeholder={user?.role === 'jury' || user?.role === 'supervisor' ? 'Ex: PhD in Computer Science' : 'Ex: 16.50'} 
                              className="form-control-premium" 
                              readOnly={user?.role !== 'admin'} 
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Field / Specialty</Form.Label>
                            <Form.Select className="form-control-premium" disabled={user?.role !== 'admin'}>
                              <option>Computer Engineering and Networks (IIR)</option>
                              <option>Automation and Industrial Computing (IAII)</option>
                              <option>Civil Engineering</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {/* Section: Parent Information */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Parent Information</h6></Col>
                        
                        {/* Father */}
                        <Col md={12} className="mb-2"><span className="extra-small fw-bold text-primary text-uppercase tracking-wider">Father Details</span></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Father's Full Name</Form.Label>
                            <Form.Control placeholder="Father's name..." className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Job / Profession</Form.Label>
                            <Form.Control placeholder="Ex: Bank Manager" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Father's Phone</Form.Label>
                            <Form.Control type="tel" placeholder="+212 6..." className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Father's Email</Form.Label>
                            <Form.Control type="email" placeholder="father@email.com" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>

                        {/* Mother */}
                        <Col md={12} className="mt-4 mb-2"><span className="extra-small fw-bold text-primary text-uppercase tracking-wider">Mother Details</span></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Mother's Full Name</Form.Label>
                            <Form.Control placeholder="Mother's name..." className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Job / Profession</Form.Label>
                            <Form.Control placeholder="Ex: Teacher" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Mother's Phone</Form.Label>
                            <Form.Control type="tel" placeholder="+212 6..." className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Mother's Email</Form.Label>
                            <Form.Control type="email" placeholder="mother@email.com" className="form-control-premium" readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>

                        <Col md={12} className="mt-5">
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Additional Notes</Form.Label>
                            <Form.Control as="textarea" rows={3} className="form-control-premium" placeholder="Other relevant information..." readOnly={user?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                      </Row>

                      {user?.role !== 'admin' && (
                        <div className="mt-5 pt-4 border-top">
                          {!isReporting ? (
                            <div className="d-flex flex-column gap-3">
                              <AnimatePresence>
                                {isConfirmed && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-success-soft p-4 rounded-4 border border-success border-opacity-25 mb-3 d-flex align-items-center gap-3"
                                  >
                                    <div className="p-2 bg-success text-white rounded-circle">
                                      <CheckCircle size={20} />
                                    </div>
                                    <div>
                                      <h6 className="fw-bold mb-0 text-navy">Information Confirmed</h6>
                                      <p className="extra-small text-success mb-0 fw-bold">Thank you! Your information has been successfully confirmed.</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              <div className="d-flex flex-column flex-md-row gap-3">
                                <Button 
                                  variant="success" 
                                  className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-bold border-0 shadow-sm transition-all"
                                  onClick={() => setIsConfirmed(true)}
                                  disabled={isConfirmed}
                                  style={{ backgroundColor: isConfirmed ? '#6ee7b7' : '#10b981', opacity: isConfirmed ? 0.7 : 1 }}
                                >
                                  <CheckCircle size={18} /> {isConfirmed ? 'Already confirmed' : 'All information is correct'}
                                </Button>
                                {!isConfirmed && (
                                  <Button 
                                    variant="outline-danger" 
                                    className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-bold shadow-sm"
                                    onClick={() => setIsReporting(true)}
                                  >
                                    <AlertCircle size={18} /> Report incorrect information
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} 
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-danger-soft p-4 rounded-4 border border-danger border-opacity-25"
                            >
                              <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-2 bg-danger text-white rounded-3">
                                  <AlertCircle size={20} />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-0 text-navy">Report an error</h6>
                                  <p className="extra-small text-muted mb-0">Describe the changes to be made (Data or Photo)</p>
                                </div>
                              </div>
                              
                              <Form.Group className="mb-4">
                                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Description of corrections</Form.Label>
                                <Form.Control 
                                  as="textarea" 
                                  rows={3} 
                                  placeholder="Ex: My address is incorrect, or I wish to change my profile photo..."
                                  className="form-control-premium border-danger border-opacity-10 shadow-none"
                                  value={reportMessage}
                                  onChange={(e) => setReportMessage(e.target.value)}
                                />
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="extra-small fw-bold text-muted text-uppercase">New Photo (Optional)</Form.Label>
                                <div 
                                  className="border-dashed rounded-4 p-4 text-center cursor-pointer hover-bg-surface-alt transition-all"
                                  onClick={() => document.getElementById('report-photo-input')?.click()}
                                >
                                  <Camera size={24} className="text-muted mb-2" />
                                  <div className="small fw-bold text-navy">Click to upload your new photo</div>
                                  <div className="extra-small text-muted">The admin will validate this change</div>
                                  {newPhoto && <Badge bg="success" className="mt-2">{newPhoto.name}</Badge>}
                                  <input 
                                    id="report-photo-input" 
                                    type="file" 
                                    className="d-none" 
                                    accept="image/*"
                                    onChange={(e) => setNewPhoto(e.target.files?.[0] || null)}
                                  />
                                </div>
                              </Form.Group>

                              <div className="d-flex gap-2 justify-content-end">
                                <Button variant="link" className="text-muted small fw-bold text-decoration-none" onClick={() => setIsReporting(false)}>Cancel</Button>
                                <Button 
                                  className="btn-premium bg-danger border-0 px-4"
                                  onClick={() => {
                                    setReportSuccess(true);
                                    setIsReporting(false);
                                    setTimeout(() => setReportSuccess(false), 5000);
                                  }}
                                >
                                  Send report
                                </Button>
                              </div>
                            </motion.div>
                          )}
                          
                          <AnimatePresence>
                            {reportSuccess && (
                              <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="mt-3 p-3 bg-success-soft text-success rounded-3 border border-success border-opacity-25 d-flex align-items-center gap-3 fw-bold small"
                              >
                                <CheckCircle size={18} /> Report sent successfully! The administrator will process your request.
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </Form>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Password Management</h5>
                    <Form className="mb-5" onSubmit={e => { e.preventDefault(); handleChangePassword(); }}>
                      <Row className="g-4">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Current Password</Form.Label>
                            <InputGroup className="overflow-hidden">
                              <Form.Control type={showPassword ? 'text' : 'password'} className="form-control-premium shadow-none" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} />
                              <Button variant="link" className="text-muted p-2" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </Button>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">New Password</Form.Label>
                            <Form.Control type="password" className="form-control-premium" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Confirm Password</Form.Label>
                            <Form.Control type="password" className="form-control-premium" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} isInvalid={!!pwdError} />
                            {pwdError && <Form.Control.Feedback type="invalid" className="fw-bold extra-small">{pwdError}</Form.Control.Feedback>}
                          </Form.Group>
                        </Col>
                        {pwdSuccess && (
                          <Col md={12}>
                            <div className="p-3 rounded-3 bg-success-soft text-success d-flex align-items-center gap-2 fw-bold small">
                              <CheckCircle size={18} /> Password changed successfully!
                            </div>
                          </Col>
                        )}
                        <Col md={12}>
                          <Button type="submit" className="btn-premium px-4" disabled={isSavingPwd}>
                            {isSavingPwd ? 'Saving...' : 'Update Password'}
                          </Button>
                        </Col>
                      </Row>
                    </Form>

                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Two-Factor Authentication (2FA)</h5>
                    <div className="p-4 rounded-4 bg-surface-alt border border-dashed d-flex align-items-center justify-content-between mb-5">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-primary-soft text-primary"><Smartphone size={28} /></div>
                        <div>
                          <div className="fw-bold small text-navy">Authentication App</div>
                          <div className="extra-small text-muted fw-bold">Use Google Authenticator to secure your account.</div>
                        </div>
                      </div>
                      <Button className="btn-premium" onClick={() => { setTwoFAStep('setup'); setShow2FA(true); }}>
                        {twoFAEnabled ? 'Reconfigure' : 'Configure'}
                      </Button>
                    </div>

                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Active users</h5>
                    <div className="table-responsive">
                      <Table borderless className="align-middle mb-0">
                        <thead>
                          <tr className="border-bottom opacity-50 bg-surface-alt">
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase">Device</th>
                            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Location</th>
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-bottom border-muted">
                            <td className="px-3 py-3">
                              <div className="fw-bold small text-navy">Windows 11 • Chrome</div>
                              <div className="extra-small text-success fw-bold">Current user</div>
                            </td>
                            <td className="py-3 extra-small text-muted fw-bold">Casablanca, Morocco</td>
                            <td className="px-3 py-3 text-end"><Badge bg="success" className="bg-success-soft text-success border border-success extra-small">Active</Badge></td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Notification Preferences</h5>
                    <div className="d-flex flex-column gap-3">
                      {[
                        { title: 'Project Feedback', desc: 'Alerts when comments are made on reports.', channels: ['Email', 'App'] },
                        { title: 'Deadlines', desc: 'Reminders 48h before submission ends.', channels: ['Email', 'SMS'] },
                        { title: 'System Announcements', desc: 'Information about platform updates.', channels: ['App'] },
                      ].map((n, i) => (
                        <div key={i} className="p-4 rounded-4 bg-surface-alt border d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold small mb-1 text-navy">{n.title}</div>
                            <div className="extra-small text-muted fw-bold mb-2 opacity-75">{n.desc}</div>
                            <div className="d-flex gap-2">
                              {n.channels.map(c => <Badge key={c} bg="primary" className="bg-primary-soft text-primary border border-primary extra-small">{c}</Badge>)}
                            </div>
                          </div>
                          <Form.Check type="switch" checked={notifPrefs[n.title] !== false} onChange={() => toggleNotif(n.title)} className="settings-switch" />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'preferences' && (
                  <motion.div key="preferences" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Interface Theme</h5>
                    <Row className="g-4 mb-5">
                      {[
                        { id: 'light', label: 'Light Theme', icon: <Sun size={32} className="text-warning" />, desc: 'Institutional' },
                        { id: 'dark', label: 'Dark Theme', icon: <Moon size={32} className="text-primary" />, desc: 'Midnight Blue' },
                        { id: 'system', label: 'System Mode', icon: <Monitor size={32} className="text-muted" />, desc: 'Auto-sync with OS' },
                      ].map((t) => (
                        <Col md={4} key={t.id}>
                          <div 
                            className={`p-4 rounded-4 text-center cursor-pointer border-2 transition-all h-100 ${theme === t.id ? 'bg-primary-soft border-primary shadow-sm' : 'bg-surface-alt border-transparent hover-bg-surface'}`}
                            onClick={() => setTheme(t.id as any)}
                          >
                            <div className="mb-3">{t.icon}</div>
                            <h6 className="fw-bold mb-1 text-navy">{t.label}</h6>
                            <p className="extra-small text-muted fw-bold mb-0 opacity-75">{t.desc}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 2FA Setup Modal */}
      <Modal show={show2FA} onHide={handle2FAClose} centered size="sm">
        <Modal.Body className="p-4">
          {twoFAStep === 'setup' && (
            <>
              <div className="text-center mb-4">
                <div className="p-3 rounded-circle bg-primary-soft text-primary d-inline-flex mb-3"><Smartphone size={32} /></div>
                <h5 className="fw-bold text-navy mb-1">Enable 2FA</h5>
                <p className="extra-small text-muted fw-bold mb-0">Scan the QR code with Google Authenticator</p>
              </div>
              <div className="text-center p-4 rounded-4 bg-surface-alt border mb-3">
                <QrCode size={96} className="text-primary mb-3" />
                <div className="extra-small text-muted fw-bold mb-2">Or enter this key manually:</div>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <code className="small fw-bold text-primary">{twoFASecret}</code>
                  <Button variant="link" className="p-0 text-muted shadow-none" onClick={copySecret}>
                    {copied2FA ? <CheckCircle size={16} className="text-success" /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
              <Button className="btn-premium w-100" onClick={() => setTwoFAStep('verify')}>Next — Enter Code</Button>
            </>
          )}
          {twoFAStep === 'verify' && (
            <>
              <div className="text-center mb-4">
                <h5 className="fw-bold text-navy mb-1">Verify Code</h5>
                <p className="extra-small text-muted fw-bold mb-0">Enter the 6-digit code from your app</p>
              </div>
              <Form.Control
                type="text"
                maxLength={6}
                placeholder="000000"
                className="form-control-premium text-center fs-4 fw-bold letter-spacing-wide mb-3"
                value={twoFACode}
                onChange={e => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <Button className="btn-premium w-100" disabled={twoFACode.length !== 6} onClick={handle2FAVerify}>Verify & Activate</Button>
            </>
          )}
          {twoFAStep === 'done' && (
            <div className="text-center py-3">
              <div className="p-3 rounded-circle bg-success-soft text-success d-inline-flex mb-3"><CheckCircle size={40} /></div>
              <h5 className="fw-bold text-navy mb-2">2FA Activated!</h5>
              <p className="extra-small text-muted fw-bold mb-4">Your account is now protected with two-factor authentication.</p>
              <Button className="btn-premium w-100" onClick={handle2FAClose}>Done</Button>
            </div>
          )}
          {twoFAStep !== 'done' && (
            <Button variant="link" className="w-100 text-muted extra-small fw-bold text-decoration-none mt-2 shadow-none" onClick={handle2FAClose}>Cancel</Button>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SettingsPage;
