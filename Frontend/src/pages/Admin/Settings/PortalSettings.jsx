import React, { useState, useRef } from 'react';
import { 
  Settings, Monitor, Bell, Shield, 
  Puzzle, Globe, Clock, Moon, 
  Sun, Check, Save, Upload,
  AlertTriangle, ChevronRight, Mail, Lock, Key, Server, Smartphone, RefreshCcw, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Form, Badge, Nav } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

const PortalSettings = () => {
  const { theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const fileInputRef = useRef(null);

  const tabs = [
    { id: 'general', label: 'Général', icon: <Globe size={18} /> },
    { id: 'appearance', label: 'Apparence', icon: <Monitor size={18} /> },
    { id: 'profile', label: 'Mon Profil', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={18} /> },
    { id: 'integrations', label: 'Intégrations', icon: <Puzzle size={18} /> },
  ];

  return (
    <div className="settings-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1">Paramètres du Portail</h2>
          <p className="text-muted small mb-0">Gestion avancée de la plateforme MediSync et de ses services.</p>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <div className="settings-glass-card shadow-sm rounded-4 overflow-hidden mb-4">
              <div className="p-3 border-bottom opacity-50">
                <span className="extra-small fw-bold text-muted text-uppercase tracking-wider">Menu Configuration</span>
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
                    {tab.icon}
                    <span className="flex-grow-1">{tab.label}</span>
                    <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-25'} />
                  </Nav.Link>
                ))}
              </Nav>
            </div>

            <div className="settings-glass-card p-4 rounded-4 border-primary border-opacity-10 bg-primary bg-opacity-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                  <Server size={20} />
                </div>
                <h6 className="fw-bold mb-0">État Système</h6>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="extra-small text-muted fw-bold">Version</span>
                <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">v2.4.1</Badge>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span className="extra-small text-muted fw-bold">Uptime</span>
                <span className="extra-small fw-bold text-success">99.9%</span>
              </div>
            </div>
          </Col>

          {/* Settings Content */}
          <Col lg={9}>
            <div className="settings-glass-card shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
              <div className="border-bottom p-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon}
                  {tabs.find(t => t.id === activeTab)?.label}
                </h5>
              </div>
              
              <div className="p-4 p-md-5 flex-grow-1">
                {activeTab === 'general' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Informations de base</h6>
                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom de l'Institution</Form.Label>
                        <Form.Control defaultValue="Université EMSI - Portails PFE" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Email Administrateur</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Langue d'Interface</Form.Label>
                        <Form.Select className="settings-input">
                          <option>Français (FR)</option>
                          <option>English (US)</option>
                          <option>Arabe (MA)</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Format de Date</Form.Label>
                        <Form.Select className="settings-input">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Contrôles Globaux</h6>
                    <div className="d-flex flex-column gap-4">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt">
                        <div>
                          <div className="small fw-bold">Maintenance Système</div>
                          <div className="extra-small text-muted">Affiche une page de maintenance pour tous les utilisateurs.</div>
                        </div>
                        <Form.Check type="switch" id="maintenance-switch" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt">
                        <div>
                          <div className="small fw-bold">Inscriptions Ouvertes</div>
                          <div className="extra-small text-muted">Permettre aux nouveaux étudiants de créer un compte.</div>
                        </div>
                        <Form.Check type="switch" id="register-switch" defaultChecked />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Thème & Identité Visuelle</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Mode d'affichage</Form.Label>
                      <Row className="g-3">
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('light')}
                            className={`p-3 border rounded-4 text-center cursor-pointer transition-all ${theme === 'light' ? 'border-primary border-2 shadow-sm bg-primary bg-opacity-10' : 'opacity-50'}`}
                          >
                            <Sun size={24} className={`mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted'}`} />
                            <div className="extra-small fw-bold">Mode Clair</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('dark')}
                            className={`p-3 border rounded-4 text-center cursor-pointer transition-all ${theme === 'dark' ? 'border-primary border-2 shadow-sm bg-primary bg-opacity-10' : 'opacity-50'}`}
                          >
                            <Moon size={24} className={`mb-2 ${theme === 'dark' ? 'text-primary' : ''}`} />
                            <div className="extra-small fw-bold">Mode Sombre</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('system')}
                            className={`p-3 border rounded-4 text-center cursor-pointer transition-all ${theme === 'system' ? 'border-primary border-2 shadow-sm bg-primary bg-opacity-10' : 'opacity-50'}`}
                          >
                            <Monitor size={24} className={`mb-2 ${theme === 'system' ? 'text-primary' : 'text-muted'}`} />
                            <div className="extra-small fw-bold">Système</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Couleur d'accentuation</Form.Label>
                      <div className="d-flex gap-3">
                        {['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map(color => (
                          <div 
                            key={color} 
                            onClick={() => setSelectedColor(color)}
                            className="rounded-circle cursor-pointer border transition-all" 
                            style={{ 
                              backgroundColor: color, 
                              width: '32px', 
                              height: '32px',
                              border: selectedColor === color ? '3px solid var(--primary)' : 'none',
                              transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)'
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Logo de la plateforme</Form.Label>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="d-none" 
                        accept="image/*"
                        onChange={() => alert("Nouveau logo sélectionné !")} 
                      />
                      <div className="d-flex align-items-center gap-4 p-4 rounded-4 border border-dashed bg-surface-alt">
                        <div className="p-4 bg-white rounded-3 shadow-sm border">
                          <Globe size={40} className="text-primary" />
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="fw-bold mb-2 rounded-pill"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Changer le logo
                          </Button>
                          <div className="extra-small text-muted">Recommandé : PNG ou SVG, min 512x512px.</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Informations Personnelles</h6>
                    <div className="d-flex align-items-center gap-4 mb-5">
                      <div className="position-relative">
                        <div className="avatar-preview rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-2 border border-primary border-opacity-25" style={{ width: '100px', height: '100px' }}>
                          AS
                        </div>
                        <Button size="sm" variant="light" className="position-absolute bottom-0 end-0 p-1 rounded-circle shadow border"><Upload size={14}/></Button>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1">Admin System</h5>
                        <p className="extra-small text-muted mb-0">Rôle : Super Administrateur</p>
                      </div>
                    </div>

                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Prénom</Form.Label>
                        <Form.Control defaultValue="Admin" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom</Form.Label>
                        <Form.Control defaultValue="System" className="settings-input" />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Poste Administratif</Form.Label>
                        <Form.Control defaultValue="Responsable Portails Académiques" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Adresse Email</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Téléphone</Form.Label>
                        <Form.Control defaultValue="+212 6 00 00 00 00" className="settings-input" />
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Équipe Administrative</h6>
                    <div className="d-flex flex-column gap-3">
                      {[
                        { name: 'Dr. Ahmed Mansouri', role: 'Administrateur Jury', status: 'En ligne' },
                        { name: 'Mme. Sara Alami', role: 'Gestionnaire Projets', status: 'Hors ligne' },
                        { name: 'Mr. Khalid Tazi', role: 'Support Technique', status: 'En ligne' }
                      ].map((member, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-4 border bg-surface-alt shadow-sm transition-all hover-bg-surface">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                              {member.name[0]}
                            </div>
                            <div>
                              <div className="small fw-bold">{member.name}</div>
                              <div className="extra-small text-muted">{member.role}</div>
                            </div>
                          </div>
                          <Badge bg={member.status === 'En ligne' ? 'success' : 'secondary'} className="extra-small rounded-pill">
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Préférences & Activités</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Configuration des Alertes</Form.Label>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-primary bg-opacity-10 border rounded-circle text-primary"><Mail size={18}/></div>
                            <div>
                              <div className="small fw-bold">Rapports par Email</div>
                              <div className="extra-small text-muted">Résumé hebdomadaire de l'activité du portail.</div>
                            </div>
                          </div>
                          <Form.Check type="switch" defaultChecked />
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-primary bg-opacity-10 border rounded-circle text-primary"><Bell size={18}/></div>
                            <div>
                              <div className="small fw-bold">Alertes de Bureau</div>
                              <div className="extra-small text-muted">Notifications instantanées lors de nouvelles soumissions.</div>
                            </div>
                          </div>
                          <Form.Check type="switch" defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Notifications Récentes</Form.Label>
                      <div className="d-flex flex-column gap-2">
                        {[
                          { title: '📅 Jury #15 assigné', time: '10 min', color: 'primary', icon: <Clock size={16}/>, desc: 'La session de jury pour le groupe Alpha a été programmée.' },
                          { title: '✅ Rapport validé', time: '2h', color: 'success', icon: <Check size={16}/>, desc: 'Le rapport final de Youssef M. a été approuvé par le superviseur.' },
                          { title: '⚠️ Alerte Système', time: '5h', color: 'danger', icon: <AlertTriangle size={16}/>, desc: 'Une tentative de connexion inhabituelle a été détectée.' }
                        ].map((n, idx) => (
                          <div key={idx} className="d-flex align-items-start gap-3 p-3 rounded-4 border transition-all hover-bg-surface bg-surface-alt">
                            <div className={`p-2 rounded-circle bg-light text-${n.color}`}>
                              {n.icon}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="small fw-bold">{n.title}</div>
                                <div className="extra-small text-muted">{n.time}</div>
                              </div>
                              <div className="extra-small text-muted lh-sm">{n.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="link" className="w-100 mt-3 extra-small fw-bold text-primary text-decoration-none">Voir toutes les notifications</Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    {/* Gestion du Mot de Passe */}
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Gestion du Mot de Passe</h6>
                    <Row className="g-4 mb-5">
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Mot de passe actuel</Form.Label>
                        <Form.Control type="password" placeholder="••••••••••••" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="settings-input" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Confirmer le mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="settings-input" />
                      </Col>
                      <Col md={12}>
                        <Button variant="outline-primary" className="fw-bold extra-small rounded-pill">Mettre à jour le mot de passe</Button>
                      </Col>
                    </Row>

                    {/* Double Authentification */}
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Double Authentification (2FA)</h6>
                    <div className="p-4 rounded-4 border mb-5 shadow-sm bg-surface-alt">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary bg-opacity-10 border rounded-3 text-primary">
                            <Smartphone size={24} />
                          </div>
                          <div>
                            <div className="small fw-bold">Application d'authentification</div>
                            <div className="extra-small text-muted">Utilisez Google Authenticator pour sécuriser votre accès.</div>
                          </div>
                        </div>
                        <Button variant="primary" size="sm" className="fw-bold extra-small px-4 rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }}>Configurer</Button>
                      </div>
                    </div>

                    {/* Sessions Actives */}
                    <h6 className="fw-bold mb-4 pb-2 border-bottom">Sessions Actives</h6>
                    <div className="table-responsive">
                      <table className="table table-borderless align-middle mb-0">
                        <thead className="opacity-50">
                          <tr>
                            <th className="extra-small fw-bold text-muted py-3 px-3">APPAREIL</th>
                            <th className="extra-small fw-bold text-muted py-3 px-3">LOCALISATION</th>
                            <th className="extra-small fw-bold text-muted py-3 px-3 text-end">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-bottom border-light border-opacity-10">
                            <td className="py-3 px-3">
                              <div className="d-flex align-items-center gap-3">
                                <Monitor size={18} className="text-muted" />
                                <div>
                                  <div className="small fw-bold">Windows 11 • Chrome</div>
                                  <div className="extra-small text-primary fw-bold">Session actuelle</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 small text-muted">Casablanca, Maroc</td>
                            <td className="py-3 px-3 text-end">
                              <Badge bg="success" className="extra-small rounded-pill">Actif</Badge>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3">
                              <div className="d-flex align-items-center gap-3">
                                <Smartphone size={18} className="text-muted" />
                                <div>
                                  <div className="small fw-bold">iPhone 13 • App Mobile</div>
                                  <div className="extra-small text-muted">Il y a 2 jours</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 small text-muted">Rabat, Maroc</td>
                            <td className="py-3 px-3 text-end">
                              <Button variant="link" className="p-0 text-danger extra-small fw-bold text-decoration-none">Déconnecter</Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 border-top text-end bg-surface-alt">
                <Button variant="primary" className="fw-bold px-4 py-2 rounded-3 shadow-sm border-0" style={{ backgroundColor: '#2563eb' }}>
                  <Save size={18} className="me-2" />
                  Enregistrer les modifications
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .settings-modern-layout {
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
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
        .settings-input {
          background-color: var(--background) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
          font-size: 0.875rem;
          padding: 0.6rem 1rem;
          border-radius: 10px;
        }
        .settings-input:focus {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .border-bottom {
          border-bottom: 1px solid var(--border) !important;
        }
        .border {
          border: 1px solid var(--border) !important;
        }
        /* Global Typography Overrides for Dark Mode Visibility */
        h2, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .nav-link.text-muted:not(.active) {
          color: var(--text-secondary) !important;
        }
        .nav-link.active {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default PortalSettings;
