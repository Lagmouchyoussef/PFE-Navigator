import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Badge, Table, ProgressBar, InputGroup
} from 'react-bootstrap';
import { 
  User, Bell, Shield, Moon, Sun, CheckCircle, AlertCircle, Save, Camera, 
  ChevronRight, Lock, Smartphone, Eye, EyeOff, 
  Briefcase, X, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences' | 'admins';

const SettingsPage: React.FC = () => {
  const { session, theme, setTheme } = useApp();
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

  const handleSave = () => {
    setSuccessMsg("Your settings have been saved successfully.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const navItems: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Public Profile', icon: <User size={20} /> },
    { id: 'security', label: 'Security & Access', icon: <Shield size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'preferences', label: 'UI Preferences', icon: <Sun size={20} /> },
    { id: 'admins', label: 'Admin Accounts', icon: <Users size={20} /> },
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
          {session?.role === 'admin' && (
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
                    onClick={() => setActiveTab(item.id)}
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
                          {session?.name?.charAt(0)}
                        </div>
                        {session?.role === 'admin' && (
                          <Button className="position-absolute bottom-0 end-0 p-2 rounded-circle bg-primary border-0 shadow-sm" style={{ width: '36px', height: '36px' }} onClick={() => fileInputRef.current?.click()}>
                            <Camera size={16} color="white" />
                          </Button>
                        )}
                        <input type="file" ref={fileInputRef} className="d-none" />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1 text-navy">{session?.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="primary" className="bg-primary-soft text-primary border border-primary extra-small fw-bold">{session?.role?.toUpperCase()}</Badge>
                          <span className="extra-small text-muted fw-bold">ID: {session?.institutionalId || 'PENDING-ID'}</span>
                        </div>
                        <div className="extra-small text-muted fw-bold mt-2 d-flex align-items-center gap-1">
                          <Briefcase size={12}/> Academic Role: <span className="text-primary">{session?.role === 'admin' ? 'PFE Coordinator' : session?.role}</span>
                        </div>
                      </div>
                    </div>

                    <Form>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Nom</Form.Label>
                            <Form.Control defaultValue={session?.name?.split(' ')[1] || ''} placeholder="Ex: Benali" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Prénom</Form.Label>
                            <Form.Control defaultValue={session?.name?.split(' ')[0] || ''} placeholder="Ex: Ahmed" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Numéro de téléphone</Form.Label>
                            <Form.Control type="tel" defaultValue="+212 600 000 000" placeholder="+212 6..." className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Email Institutionnel</Form.Label>
                            <Form.Control 
                              defaultValue={session?.email} 
                              className="form-control-premium" 
                              readOnly={session?.role !== 'admin'} 
                              title={session?.role !== 'admin' ? "Seul l'administrateur peut modifier l'email" : ""}
                            />
                          </Form.Group>
                        </Col>
                        {/* Section: Informations Personnelles */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Informations Personnelles</h6></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">CIN (Carte d'Identité Nationale)</Form.Label>
                            <Form.Control placeholder="Ex: AB123456" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Adresse de Résidence</Form.Label>
                            <Form.Control placeholder="Ex: 123 Rue de la Liberté, Casablanca" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>

                        {/* Section: Informations Académiques */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Informations Académiques</h6></Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Année Universitaire</Form.Label>
                            <Form.Control defaultValue="2025/2026" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Code National (CNE/Massar)</Form.Label>
                            <Form.Control placeholder="Ex: G130000000" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Section / Groupe</Form.Label>
                            <Form.Control placeholder="Ex: 5IIR-G1" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Note du Diplôme (Dernière année)</Form.Label>
                            <Form.Control type="number" step="0.01" placeholder="Ex: 16.50" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Filière / Spécialité</Form.Label>
                            <Form.Select className="form-control-premium" disabled={session?.role !== 'admin'}>
                              <option>Ingénierie Informatique et Réseaux (IIR)</option>
                              <option>Ingénierie Automatismes et Informatique Industrielle (IAII)</option>
                              <option>Génie Civil</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        {/* Section: Informations des Parents */}
                        <Col md={12} className="mt-5"><h6 className="fw-bold text-navy border-bottom pb-2 mb-3">Informations des Parents</h6></Col>
                        
                        {/* Père */}
                        <Col md={12} className="mb-2"><span className="extra-small fw-bold text-primary text-uppercase tracking-wider">Détails du Père (Papa)</span></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Nom & Prénom du Père</Form.Label>
                            <Form.Control placeholder="Nom du père..." className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Fonction / Profession</Form.Label>
                            <Form.Control placeholder="Ex: Cadre Bancaire" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Tél. du Père</Form.Label>
                            <Form.Control type="tel" placeholder="+212 6..." className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Email du Père</Form.Label>
                            <Form.Control type="email" placeholder="papa@email.com" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>

                        {/* Mère */}
                        <Col md={12} className="mt-4 mb-2"><span className="extra-small fw-bold text-primary text-uppercase tracking-wider">Détails de la Mère (Maman)</span></Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Nom & Prénom de la Mère</Form.Label>
                            <Form.Control placeholder="Nom de la mère..." className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Fonction / Profession</Form.Label>
                            <Form.Control placeholder="Ex: Enseignante" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Tél. de la Mère</Form.Label>
                            <Form.Control type="tel" placeholder="+212 6..." className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Email de la Mère</Form.Label>
                            <Form.Control type="email" placeholder="maman@email.com" className="form-control-premium" readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>

                        <Col md={12} className="mt-5">
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Notes Additionnelles</Form.Label>
                            <Form.Control as="textarea" rows={3} className="form-control-premium" placeholder="Autres informations pertinentes..." readOnly={session?.role !== 'admin'} />
                          </Form.Group>
                        </Col>
                      </Row>

                      {session?.role !== 'admin' && (
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
                                      <h6 className="fw-bold mb-0 text-navy">Informations Confirmées</h6>
                                      <p className="extra-small text-success mb-0 fw-bold">Merci ! Vos informations ont été confirmées avec succès.</p>
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
                                  <CheckCircle size={18} /> {isConfirmed ? 'Déjà confirmé' : 'Tout les informations sont correct'}
                                </Button>
                                {!isConfirmed && (
                                  <Button 
                                    variant="outline-danger" 
                                    className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-3 fw-bold shadow-sm"
                                    onClick={() => setIsReporting(true)}
                                  >
                                    <AlertCircle size={18} /> Signaler des informations incorrectes
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
                                  <h6 className="fw-bold mb-0 text-navy">Signaler une erreur</h6>
                                  <p className="extra-small text-muted mb-0">Décrivez les modifications à apporter (Données ou Photo)</p>
                                </div>
                              </div>
                              
                              <Form.Group className="mb-4">
                                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Description des corrections</Form.Label>
                                <Form.Control 
                                  as="textarea" 
                                  rows={3} 
                                  placeholder="Ex: Mon adresse est incorrecte, ou Je souhaite changer ma photo de profil..."
                                  className="form-control-premium border-danger border-opacity-10 shadow-none"
                                  value={reportMessage}
                                  onChange={(e) => setReportMessage(e.target.value)}
                                />
                              </Form.Group>

                              <Form.Group className="mb-4">
                                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nouvelle Photo (Optionnel)</Form.Label>
                                <div 
                                  className="border-dashed rounded-4 p-4 text-center cursor-pointer hover-bg-surface-alt transition-all"
                                  onClick={() => document.getElementById('report-photo-input')?.click()}
                                >
                                  <Camera size={24} className="text-muted mb-2" />
                                  <div className="small fw-bold text-navy">Cliquez pour téléverser votre nouvelle photo</div>
                                  <div className="extra-small text-muted">L'admin validera ce changement</div>
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
                                <Button variant="link" className="text-muted small fw-bold text-decoration-none" onClick={() => setIsReporting(false)}>Annuler</Button>
                                <Button 
                                  className="btn-premium bg-danger border-0 px-4"
                                  onClick={() => {
                                    setReportSuccess(true);
                                    setIsReporting(false);
                                    setTimeout(() => setReportSuccess(false), 5000);
                                  }}
                                >
                                  Envoyer le signalement
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
                                <CheckCircle size={18} /> Signalement envoyé avec succès ! L'administrateur traitera votre demande.
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
                    <Form className="mb-5">
                      <Row className="g-4">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Current Password</Form.Label>
                            <InputGroup className="overflow-hidden">
                              <Form.Control type={showPassword ? 'text' : 'password'} className="form-control-premium shadow-none" />
                              <Button variant="link" className="text-muted p-2" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </Button>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">New Password</Form.Label>
                            <Form.Control type="password" className="form-control-premium" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Confirm Password</Form.Label>
                            <Form.Control type="password" className="form-control-premium" />
                          </Form.Group>
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
                      <Button className="btn-premium">Configure</Button>
                    </div>

                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Active Sessions</h5>
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
                              <div className="extra-small text-success fw-bold">Current session</div>
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
                          <Form.Check type="switch" defaultChecked className="settings-switch" />
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
                      ].map((t) => (
                        <Col md={6} key={t.id}>
                          <div 
                            className={`p-4 rounded-4 text-center cursor-pointer border-2 transition-all ${theme === t.id ? 'bg-primary-soft border-primary shadow-sm' : 'bg-surface-alt border-transparent hover-bg-surface'}`}
                            onClick={() => setTheme(t.id)}
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

                {activeTab === 'admins' && (
                  <motion.div key="admins" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Administration Accounts</h5>
                    <div className="table-responsive">
                      <Table borderless className="align-middle mb-0">
                        <thead>
                          <tr className="border-bottom opacity-50 bg-surface-alt">
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase">Admin</th>
                            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Department</th>
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase text-end">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Dr. Sarah Smith', role: 'Super-Admin', dept: 'CS', status: 'Online' },
                            { name: 'Prof. Martin', role: 'Admin', dept: 'Civil Engineering', status: 'Busy' },
                          ].map((admin, idx) => (
                            <tr key={idx} className="border-bottom border-muted">
                              <td className="px-3 py-3">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{admin.name.charAt(4)}</div>
                                  <div>
                                    <div className="fw-bold small text-navy">{admin.name}</div>
                                    <div className="extra-small text-muted fw-bold">{admin.role}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 extra-small text-muted fw-bold">{admin.dept}</td>
                              <td className="px-3 py-3 text-end">
                                <Badge bg={admin.status === 'Online' ? 'success' : 'secondary'} className="bg-success-soft text-success border border-success extra-small">{admin.status}</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
