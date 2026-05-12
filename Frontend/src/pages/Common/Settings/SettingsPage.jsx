import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Badge, Tab, Table, InputGroup, ProgressBar, Dropdown
} from 'react-bootstrap';
import { 
  User, Bell, Shield, Moon, Sun, CheckCircle, Save, Camera, 
  ChevronRight, Lock, Smartphone, Languages, Eye, EyeOff, 
  Globe2, Clock, Mail, Briefcase, MapPin, Hash, Trash2, Search, MoreVertical, X, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext.jsx';

const SettingsPage = () => {
  const { session, theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleSave = () => {
    setSuccessMsg("Vos paramètres ont été enregistrés avec succès.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const navItems = [
    { id: 'profile', label: 'Profil Public', icon: <User size={20} /> },
    { id: 'security', label: 'Sécurité & Accès', icon: <Shield size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'preferences', label: 'Préférences UI', icon: <Sun size={20} /> },
    { id: 'admins', label: 'Comptes Admin', icon: <Users size={20} /> },
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
              className="settings-alert-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Paramètres Enregistrés</h6>
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
            <h2 className="fw-bold mb-1">Paramètres du Compte</h2>
            <p className="text-muted small mb-0">Gérez votre identité institutionnelle et vos préférences de sécurité.</p>
          </div>
          <Button 
            className="px-5 py-2 fw-bold rounded-pill border-0 shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: '#2563eb' }}
            onClick={handleSave}
          >
            <Save size={18} /> Enregistrer les modifications
          </Button>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <div className="settings-glass-card rounded-4 overflow-hidden mb-4">
              <div className="d-flex flex-column">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`settings-nav-btn p-3 d-flex align-items-center gap-3 border-0 transition-all text-start ${activeTab === item.id ? 'active-nav' : 'hover-bg-surface'}`}
                  >
                    <div className={`${activeTab === item.id ? 'text-primary' : 'text-muted'}`}>{item.icon}</div>
                    <span className={`small fw-bold ${activeTab === item.id ? 'text-primary' : 'text-muted'}`}>{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={16} className="ms-auto text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-glass-card p-4 rounded-4 bg-primary bg-opacity-5 border-primary border-opacity-25">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Lock size={18} className="text-primary" />
                <h6 className="fw-bold mb-0 small">État de Sécurité</h6>
              </div>
              <div className="extra-small fw-bold text-muted mb-2">Score de protection: 85%</div>
              <ProgressBar now={85} variant="primary" className="bg-surface-alt mb-3" style={{ height: '6px' }} />
              <p className="extra-small text-muted mb-0 opacity-75">Activez la 2FA pour atteindre 100%.</p>
            </div>
          </Col>

          {/* Content Area */}
          <Col lg={9}>
            <div className="settings-glass-card p-5 rounded-4 shadow-sm min-vh-50">
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <div className="d-flex align-items-center gap-4 mb-5 p-4 rounded-4 bg-surface-alt border">
                      <div className="position-relative">
                        <div className="avatar-xl bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold h2 mb-0" style={{ width: '100px', height: '100px' }}>
                          {session?.name?.charAt(0)}
                        </div>
                        <Button className="position-absolute bottom-0 end-0 p-2 rounded-circle bg-primary border-0 shadow-sm" style={{ width: '36px', height: '36px' }} onClick={() => fileInputRef.current?.click()}>
                          <Camera size={16} color="white" />
                        </Button>
                        <input type="file" ref={fileInputRef} className="d-none" />
                      </div>
                      <div>
                        <h4 className="fw-bold mb-1">{session?.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small fw-bold">{session?.role?.toUpperCase()}</Badge>
                          <span className="extra-small text-muted fw-bold">ID: EMSI-2026-9482</span>
                        </div>
                        <div className="extra-small text-muted fw-bold mt-2 d-flex align-items-center gap-1">
                          <Briefcase size={12}/> Poste Administratif: <span className="text-primary">Coordinateur PFE</span>
                        </div>
                      </div>
                    </div>

                    <Form>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Prénom et Nom</Form.Label>
                            <Form.Control defaultValue={session?.name} className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Email Institutionnel</Form.Label>
                            <Form.Control defaultValue={session?.email} className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" readOnly />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Département</Form.Label>
                            <Form.Select className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom">
                              <option>Génie Logiciel & Informatique</option>
                              <option>Systèmes & Réseaux</option>
                              <option>Intelligence Artificielle</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Bureau / Localisation</Form.Label>
                            <Form.Control defaultValue="B-204, Campus A" className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" />
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Biographie Professionnelle</Form.Label>
                            <Form.Control as="textarea" rows={4} className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" placeholder="Décrivez votre expertise académique..." />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2">Gestion du Mot de Passe</h5>
                    <Form className="mb-5">
                      <Row className="g-4">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Mot de passe actuel</Form.Label>
                            <InputGroup className="bg-surface-alt rounded-3 border-0 overflow-hidden">
                              <Form.Control type={showPassword ? 'text' : 'password'} className="bg-transparent border-0 p-3 small text-primary-custom shadow-none" />
                              <Button variant="link" className="text-muted p-2" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </Button>
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Nouveau mot de passe</Form.Label>
                            <Form.Control type="password" className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="small fw-bold text-muted mb-2">Confirmer le mot de passe</Form.Label>
                            <Form.Control type="password" className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom" />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Form>

                    <h5 className="fw-bold mb-4 border-bottom pb-2">Double Authentification (2FA)</h5>
                    <div className="p-4 rounded-4 bg-surface-alt border border-dashed d-flex align-items-center justify-content-between mb-5">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-primary bg-opacity-10 text-primary"><Smartphone size={28} /></div>
                        <div>
                          <div className="fw-bold small">Application d'authentification</div>
                          <div className="extra-small text-muted fw-bold">Utilisez Google Authenticator pour sécuriser votre accès.</div>
                        </div>
                      </div>
                      <Button variant="primary" className="fw-bold px-4 py-2 small rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }}>Configurer</Button>
                    </div>

                    <h5 className="fw-bold mb-4 border-bottom pb-2">Sessions Actives</h5>
                    <div className="table-responsive">
                      <Table borderless className="align-middle mb-0 settings-table">
                        <thead>
                          <tr className="border-bottom opacity-50 bg-surface-alt">
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase">Appareil</th>
                            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Localisation</th>
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-bottom border-light border-opacity-10">
                            <td className="px-3 py-3">
                              <div className="fw-bold small">Windows 11 • Chrome</div>
                              <div className="extra-small text-success fw-bold">Session actuelle</div>
                            </td>
                            <td className="py-3 extra-small text-muted fw-bold">Casablanca, Maroc</td>
                            <td className="px-3 py-3 text-end"><Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small">Actif</Badge></td>
                          </tr>
                          <tr>
                            <td className="px-3 py-3">
                              <div className="fw-bold small">iPhone 13 • App Mobile</div>
                              <div className="extra-small text-muted fw-bold">Il y a 2 jours</div>
                            </td>
                            <td className="py-3 extra-small text-muted fw-bold">Rabat, Maroc</td>
                            <td className="px-3 py-3 text-end">
                              <Button variant="link" className="p-0 text-danger extra-small fw-bold text-decoration-none">Déconnecter</Button>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2">Préférences de Notification</h5>
                    <div className="d-flex flex-column gap-3">
                      {[
                        { title: 'Feedback de Projet', desc: 'Alertes lors des commentaires sur les rapports.', channels: ['Email', 'App'] },
                        { title: 'Dates Limites', desc: 'Rappels 48h avant la fin d\'une soumission.', channels: ['Email', 'SMS'] },
                        { title: 'Annonces Système', desc: 'Informations sur les mises à jour de la plateforme.', channels: ['App'] },
                      ].map((n, i) => (
                        <div key={i} className="p-4 rounded-4 bg-surface-alt border d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold small mb-1">{n.title}</div>
                            <div className="extra-small text-muted fw-bold mb-2 opacity-75">{n.desc}</div>
                            <div className="d-flex gap-2">
                              {n.channels.map(c => <Badge key={c} bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">{c}</Badge>)}
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
                    <h5 className="fw-bold mb-4 border-bottom pb-2">Thème de l'Interface</h5>
                    <Row className="g-4 mb-5">
                      {[
                        { id: 'light', label: 'Thème Clair', icon: <Sun size={32} className="text-warning" />, desc: 'Institutionnel' },
                        { id: 'dark', label: 'Thème Sombre', icon: <Moon size={32} className="text-primary" />, desc: 'Gris Noir' },
                      ].map((t) => (
                        <Col md={6} key={t.id}>
                          <div 
                            className={`p-4 rounded-4 text-center cursor-pointer border-2 transition-all ${theme === t.id ? 'bg-primary bg-opacity-5 border-primary shadow-sm' : 'bg-surface-alt border-transparent hover-bg-surface'}`}
                            onClick={() => setTheme(t.id)}
                          >
                            <div className="mb-3">{t.icon}</div>
                            <h6 className="fw-bold mb-1">{t.label}</h6>
                            <p className="extra-small text-muted fw-bold mb-0 opacity-75">{t.desc}</p>
                          </div>
                        </Col>
                      ))}
                    </Row>

                    <h5 className="fw-bold mb-4 border-bottom pb-2">Langue & Région</h5>
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-muted mb-2">Langue</Form.Label>
                          <Form.Select className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom">
                            <option>Français (France)</option>
                            <option>English (US)</option>
                            <option>العربية (Maroc)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="small fw-bold text-muted mb-2">Fuseau Horaire</Form.Label>
                          <Form.Select className="bg-surface-alt border-0 rounded-3 p-3 small text-primary-custom">
                            <option>(GMT+01:00) Casablanca</option>
                            <option>(GMT+01:00) Paris</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {activeTab === 'admins' && (
                  <motion.div key="admins" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <h5 className="fw-bold mb-4 border-bottom pb-2">Comptes Administration</h5>
                    <div className="table-responsive">
                      <Table borderless className="align-middle mb-0 settings-table">
                        <thead>
                          <tr className="border-bottom opacity-50 bg-surface-alt">
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase">Administrateur</th>
                            <th className="py-3 extra-small fw-bold text-muted text-uppercase">Département</th>
                            <th className="px-3 py-3 extra-small fw-bold text-muted text-uppercase text-end">Statut</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Dr. Sarah Smith', role: 'Super-Admin', dept: 'Informatique', status: 'En ligne' },
                            { name: 'Prof. Martin', role: 'Admin', dept: 'Génie Civil', status: 'Occupé' },
                            { name: 'Dr. Chen', role: 'Admin', dept: 'Mathématiques', status: 'Hors ligne' },
                          ].map((admin, idx) => (
                            <tr key={idx} className="border-bottom border-light border-opacity-10">
                              <td className="px-3 py-3">
                                <div className="d-flex align-items-center gap-2">
                                  <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>{admin.name.charAt(4)}</div>
                                  <div>
                                    <div className="fw-bold small">{admin.name}</div>
                                    <div className="extra-small text-muted fw-bold">{admin.role}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 extra-small text-muted fw-bold">{admin.dept}</td>
                              <td className="px-3 py-3 text-end">
                                <Badge bg={admin.status === 'En ligne' ? 'success' : 'secondary'} className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small">{admin.status}</Badge>
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

      <style>{`
        .settings-modern-layout {
          color: var(--text-primary);
        }
        .settings-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .settings-nav-btn {
          background: transparent;
          width: 100%;
        }
        .active-nav {
          background-color: rgba(var(--primary-rgb), 0.1) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-success { border-left-color: #10b981 !important; }
        .border-primary { border-left-color: var(--primary) !important; }
        
        h2, h4, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
        .border-bottom {
          border-color: var(--border) !important;
        }
        .border-dashed {
          border-style: dashed !important;
          border-color: var(--border) !important;
        }
        .avatar-xl {
          background-color: var(--background);
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
