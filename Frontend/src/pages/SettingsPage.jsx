import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Badge, Tab, Table, InputGroup, ProgressBar 
} from 'react-bootstrap';
import { 
  User, Bell, Shield, Moon, Sun, CheckCircle, Save, Camera, 
  ChevronRight, Lock, Smartphone, Languages, Eye, EyeOff, 
  Globe2, Clock, Mail, Briefcase, MapPin, Hash, Trash2, Search, MoreVertical
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';
import './SettingsPage.css';

const SettingsPage = () => {
  const { session, theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef(null);

  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    setSuccessMsg("Vos paramètres ont été enregistrés avec succès.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const navItems = [
    { id: 'profile', label: 'Profil Public', icon: <User size={20} className="text-orange" style={{ color: '#f97316' }} /> },
    { id: 'security', label: 'Sécurité & Accès', icon: <Shield size={20} className="text-success" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} className="text-danger" /> },
    { id: 'preferences', label: 'Préférences UI', icon: <Sun size={20} className="text-purple" style={{ color: '#a855f7' }} /> },
  ];

  return (
    <div className="settings-page-layout">
      <Container className="py-5">
        
        {/* Success Notification Card */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="settings-success-card mb-4 d-flex align-items-center justify-content-between shadow-lg"
              style={{
                background: theme === 'dark' ? '#064e3b' : 'white',
                border: '1px solid #10b981',
                borderLeft: '5px solid #10b981',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                zIndex: 1000
              }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="icon-box bg-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <CheckCircle size={24} color="#ffffff" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold" style={{ color: theme === 'dark' ? '#ecfdf5' : 'inherit' }}>Succès</h6>
                  <p className="extra-small mb-0 opacity-75" style={{ color: theme === 'dark' ? '#ecfdf5' : 'inherit' }}>{successMsg}</p>
                </div>
              </div>
              <Button size="sm" variant="link" className="text-muted p-0" onClick={() => setShowSuccessCard(false)}>Fermer</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="fw-black text-navy mb-1">Paramètres du Compte</h1>
            <p className="text-muted fw-medium small mb-0">Gérez votre identité institutionnelle et vos préférences de sécurité</p>
          </motion.div>
          
          <div className="d-flex align-items-center gap-3 flex-grow-1 flex-md-grow-0 justify-content-end">
            <div className="settings-search-bar d-none d-md-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm" style={{ minWidth: '300px' }}>
              <Search size={18} className="text-muted me-2" />
              <Form.Control 
                type="text" 
                placeholder="Rechercher un paramètre..." 
                className="border-0 bg-transparent shadow-none extra-small fw-bold p-0"
              />
            </div>
            <Button 
              className="btn-save-settings px-4 py-2 d-flex align-items-center gap-2 shadow-sm"
              onClick={handleSave}
            >
              {showSuccessCard ? <CheckCircle size={18} className="text-success" /> : <Save size={18} style={{ color: '#ec4899' }} />}
              {showSuccessCard ? 'Modifications Enregistrées' : 'Enregistrer'}
            </Button>
          </div>
        </header>

        <Row className="g-4">
          {/* Sidebar */}
          <Col lg={3}>
            <Card className="settings-nav-card border-0 shadow-sm mb-4">
              <div className="d-flex flex-column">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`settings-nav-item ${activeTab === item.id ? 'active' : ''}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {activeTab === item.id && <ChevronRight size={16} className="ms-auto" />}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="border-0 shadow-sm rounded-4 bg-navy text-white p-4">
              <div className="d-flex align-items-center gap-2 mb-3">
                <Lock size={18} className="text-info" />
                <h6 className="fw-bold mb-0 small">État de Sécurité</h6>
              </div>
              <div className="extra-small opacity-75 mb-2">Votre score de protection: 85%</div>
              <ProgressBar now={85} variant="primary" className="bg-white bg-opacity-10 mb-3" style={{ height: '6px' }} />
              <p className="extra-small opacity-50 mb-0">Activez la 2FA pour atteindre 100%.</p>
            </Card>
          </Col>

          {/* Content */}
          <Col lg={9}>
            <Card className="settings-content-card border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                <AnimatePresence mode="wait">
                  {activeTab === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <div className="d-flex align-items-center gap-4 mb-5">
                        <div className="position-relative">
                          <div className="profile-avatar-large bg-primary bg-opacity-10 text-primary">
                            {session?.name?.charAt(0)}
                          </div>
                          <Button className="avatar-upload-btn shadow-sm" onClick={() => fileInputRef.current?.click()}>
                            <Camera size={16} color="white" />
                          </Button>
                        </div>
                        <div>
                          <h4 className="fw-bold text-navy mb-1">{session?.name}</h4>
                          <div className="d-flex align-items-center gap-2">
                            <Badge className="badge-role">{session?.role?.toUpperCase()}</Badge>
                            <span className="extra-small text-muted fw-bold">ID: EMSI-2026-9482</span>
                          </div>
                        </div>
                      </div>

                      <Form>
                        <Row className="g-4">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Nom Complet</Form.Label>
                              <InputGroup className="settings-input-group">
                                <Form.Control defaultValue={session?.name} className="settings-input" />
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Email Institutionnel</Form.Label>
                              <Form.Control defaultValue={session?.email} className="settings-input" readOnly />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Département</Form.Label>
                              <Form.Select className="settings-input">
                                <option>Génie Logiciel & Informatique</option>
                                <option>Systèmes & Réseaux</option>
                                <option>Intelligence Artificielle</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Bureau / Localisation</Form.Label>
                              <Form.Control defaultValue="B-204, Campus A" className="settings-input" />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="settings-label">Biographie Professionnelle</Form.Label>
                              <Form.Control as="textarea" rows={4} className="settings-input" placeholder="Décrivez votre expertise académique..." />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>
                    </motion.div>
                  )}

                  {activeTab === 'security' && (
                    <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h5 className="fw-bold text-navy mb-4">Gestion du Mot de Passe</h5>
                      <Form className="mb-5">
                        <Row className="g-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="settings-label">Mot de passe actuel</Form.Label>
                              <InputGroup className="settings-input">
                                <Form.Control type={showPassword ? 'text' : 'password'} className="border-0 bg-transparent p-0 shadow-none" />
                                <Button variant="link" className="p-0 text-muted" onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </Button>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Nouveau mot de passe</Form.Label>
                              <Form.Control type="password" className="settings-input" />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="settings-label">Confirmer le mot de passe</Form.Label>
                              <Form.Control type="password" className="settings-input" />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Form>

                      <h5 className="fw-bold text-navy mb-4">Double Authentification (2FA)</h5>
                      <div className="p-4 rounded-4 border border-dashed d-flex align-items-center justify-content-between mb-5">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-3 rounded-3 bg-light text-primary"><Smartphone size={24} className="text-primary" /></div>
                          <div>
                            <div className="fw-bold text-navy small">Application d'authentification</div>
                            <div className="extra-small text-muted">Utilisez Google Authenticator pour sécuriser votre accès.</div>
                          </div>
                        </div>
                        <Button variant="primary" className="fw-bold px-4 py-2 small">Configurer</Button>
                      </div>

                      <h5 className="fw-bold text-navy mb-4">Sessions Actives</h5>
                      <Table responsive borderless className="align-middle">
                        <thead>
                          <tr className="border-bottom">
                            <th className="settings-label pb-2">Appareil</th>
                            <th className="settings-label pb-2">Localisation</th>
                            <th className="settings-label pb-2 text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div className="fw-bold text-navy small">Windows 11 • Chrome</div>
                              <div className="extra-small text-success">Session actuelle</div>
                            </td>
                            <td className="small text-muted">Casablanca, Maroc</td>
                            <td className="text-end"><Badge bg="success" className="p-2">Actif</Badge></td>
                          </tr>
                          <tr>
                            <td>
                              <div className="fw-bold text-navy small">iPhone 13 • App Mobile</div>
                              <div className="extra-small text-muted">Il y a 2 jours</div>
                            </td>
                            <td className="small text-muted">Rabat, Maroc</td>
                            <td className="text-end">
                              <Dropdown align="end">
                                <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                                  <MoreVertical size={18} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                                  <Dropdown.Item>Détails de la session</Dropdown.Item>
                                  <Dropdown.Item className="text-danger">Déconnecter l'appareil</Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </motion.div>
                  )}

                  {activeTab === 'notifications' && (
                    <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h5 className="fw-bold text-navy mb-4">Préférences de Notification</h5>
                      <div className="d-flex flex-column gap-3">
                        {[
                          { title: 'Feedback de Projet', desc: 'Alertes lors des commentaires sur les rapports.', channels: ['Email', 'App'] },
                          { title: 'Dates Limites', desc: 'Rappels 48h avant la fin d\'une soumission.', channels: ['Email', 'SMS'] },
                          { title: 'Annonces Système', desc: 'Informations sur les mises à jour de la plateforme.', channels: ['App'] },
                          { title: 'Alertes de Sécurité', desc: 'Nouvelle connexion ou changement de mot de passe.', channels: ['Email', 'App'] }
                        ].map((n, i) => (
                          <div key={i} className="p-4 rounded-4 bg-light border-0 d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold text-navy small mb-1">{n.title}</div>
                              <div className="extra-small text-muted mb-2">{n.desc}</div>
                              <div className="d-flex gap-2">
                                {n.channels.map(c => <Badge key={c} bg="white" text="primary" className="border extra-small">{c}</Badge>)}
                              </div>
                            </div>
                            <Form.Check type="switch" defaultChecked className="settings-switch" />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'preferences' && (
                    <motion.div key="preferences" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                      <h5 className="fw-bold text-navy mb-4">Thème de l'Interface</h5>
                      <Row className="g-4 mb-5">
                        <Col md={4}>
                          <Card 
                            className={`theme-card p-4 text-center ${theme === 'light' ? 'active' : ''}`}
                            onClick={() => setTheme('light')}
                          >
                            <Sun size={32} className="text-warning mb-3 mx-auto" />
                            <h6 className="fw-bold text-navy small mb-2">Thème Clair</h6>
                            <Form.Check type="radio" name="theme" label="Institutionnel" checked={theme === 'light'} readOnly />
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card 
                            className={`theme-card p-4 text-center ${theme === 'dark' ? 'active' : ''}`}
                            onClick={() => setTheme('dark')}
                          >
                            <Moon size={32} className="text-primary mb-3 mx-auto" />
                            <h6 className="fw-bold text-navy small mb-2">Thème Sombre</h6>
                            <Form.Check type="radio" name="theme" label="Gris Noir" checked={theme === 'dark'} readOnly />
                          </Card>
                        </Col>
                        <Col md={4}>
                          <Card 
                            className={`theme-card p-4 text-center ${theme === 'system' ? 'active' : ''}`}
                            onClick={() => setTheme('system')}
                          >
                            <Smartphone size={32} className="text-secondary mb-3 mx-auto" />
                            <h6 className="fw-bold text-navy small mb-2">Mode Système</h6>
                            <Form.Check type="radio" name="theme" label="Automatique" checked={theme === 'system'} readOnly />
                          </Card>
                        </Col>
                      </Row>

                      <h5 className="fw-bold text-navy mb-4">Langue & Région</h5>
                      <Row className="g-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="settings-label">Langue de l'interface</Form.Label>
                            <Form.Select className="settings-input">
                              <option>Français (France)</option>
                              <option>English (US)</option>
                              <option>العربية (Maroc)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="settings-label">Fuseau Horaire</Form.Label>
                            <Form.Select className="settings-input">
                              <option>(GMT+01:00) Casablanca</option>
                              <option>(GMT+01:00) Paris</option>
                              <option>(GMT+00:00) London</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card.Body>
              <Card.Footer className="bg-light bg-opacity-50 border-0 p-4 text-end">
                <Button variant="outline-danger" className="fw-bold px-4 extra-small border-2 me-3">Désactiver le compte</Button>
                <Button className="btn-save-settings px-5" onClick={handleSave}>Enregistrer les modifications</Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SettingsPage;
