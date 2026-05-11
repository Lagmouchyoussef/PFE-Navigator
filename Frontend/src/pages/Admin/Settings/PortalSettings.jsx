import React, { useState, useRef } from 'react';
import { 
  Settings, Monitor, Bell, Shield, 
  Puzzle, Globe, Clock, Moon, 
  Sun, Check, Save, Upload,
  AlertTriangle, ChevronRight, Mail, Lock, Key, Server, Smartphone, RefreshCcw, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Nav, Tab, Modal } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

const PortalSettings = () => {
  const { theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState('general');
  const [showAddModal, setShowAddModal] = useState(false);
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
    <div className="settings-simple-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="mb-5">
          <h2 className="fw-bold text-dark mb-1">Paramètres du Portail</h2>
          <p className="text-muted small mb-0">Gestion avancée de la plateforme MediSync et de ses services.</p>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <Card className="border shadow-sm rounded-4 overflow-hidden bg-white mb-4">
              <div className="p-3 bg-light border-bottom">
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
                        : 'text-muted hover-bg-light'
                    }`}
                  >
                    {tab.icon}
                    <span className="flex-grow-1">{tab.label}</span>
                    <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-25'} />
                  </Nav.Link>
                ))}
              </Nav>
            </Card>

            <Card className="border shadow-sm rounded-4 bg-primary bg-opacity-5 border-primary border-opacity-10">
              <Card.Body className="p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                    <Server size={20} />
                  </div>
                  <h6 className="fw-bold mb-0 text-dark">État Système</h6>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="extra-small text-muted fw-bold">Version</span>
                  <Badge bg="light" className="text-primary border extra-small">v2.4.1</Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="extra-small text-muted fw-bold">Uptime</span>
                  <span className="extra-small fw-bold text-success">99.9%</span>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Settings Content */}
          <Col lg={9}>
            <Card className="border shadow-sm rounded-4 bg-white h-100 overflow-hidden">
              <Card.Header className="bg-white border-bottom p-4">
                <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                  {tabs.find(t => t.id === activeTab)?.icon}
                  {tabs.find(t => t.id === activeTab)?.label}
                </h5>
              </Card.Header>
              <Card.Body className="p-4 p-md-5">
                {activeTab === 'general' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Informations de base</h6>
                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom de l'Institution</Form.Label>
                        <Form.Control defaultValue="Université EMSI - Portails PFE" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Email Administrateur</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Langue d'Interface</Form.Label>
                        <Form.Select className="bg-light border-0 small py-2 shadow-none fw-bold">
                          <option>Français (FR)</option>
                          <option>English (US)</option>
                          <option>Arabe (MA)</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Format de Date</Form.Label>
                        <Form.Select className="bg-light border-0 small py-2 shadow-none fw-bold">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Contrôles Globaux</h6>
                    <div className="d-flex flex-column gap-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="small fw-bold">Maintenance Système</div>
                          <div className="extra-small text-muted">Affiche une page de maintenance pour tous les utilisateurs.</div>
                        </div>
                        <Form.Check type="switch" id="maintenance-switch" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
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
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Thème & Identité Visuelle</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Mode d'affichage</Form.Label>
                      <Row className="g-3">
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('light')}
                            className={`p-3 border rounded-4 bg-light text-center cursor-pointer transition-all ${theme === 'light' ? 'border-primary border-2 shadow-sm' : 'opacity-50'}`}
                          >
                            <Sun size={24} className={`mb-2 ${theme === 'light' ? 'text-primary' : 'text-muted'}`} />
                            <div className="extra-small fw-bold">Mode Clair</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('dark')}
                            className={`p-3 border rounded-4 bg-dark text-white text-center cursor-pointer transition-all ${theme === 'dark' ? 'border-primary border-2 shadow-sm' : 'opacity-50'}`}
                          >
                            <Moon size={24} className={`mb-2 ${theme === 'dark' ? 'text-primary' : ''}`} />
                            <div className="extra-small fw-bold">Mode Sombre</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div 
                            onClick={() => setTheme('system')}
                            className={`p-3 border rounded-4 bg-white text-center cursor-pointer transition-all ${theme === 'system' ? 'border-primary border-2 shadow-sm' : 'opacity-50'}`}
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
                              border: selectedColor === color ? '3px solid #cbd5e1' : 'none',
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
                      <div className="d-flex align-items-center gap-4 p-4 bg-light bg-opacity-50 rounded-4 border border-dashed">
                        <div className="p-4 bg-white rounded-3 shadow-sm border">
                          <Globe size={40} className="text-primary" />
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            className="fw-bold mb-2"
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
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Informations Personnelles</h6>
                    <div className="d-flex align-items-center gap-4 mb-5">
                      <div className="position-relative">
                        <div className="avatar-xl rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-2 border border-primary border-opacity-25" style={{ width: '100px', height: '100px' }}>
                          AS
                        </div>
                        <Button size="sm" variant="white" className="position-absolute bottom-0 end-0 p-1 rounded-circle shadow border"><Upload size={14}/></Button>
                      </div>
                      <div>
                        <h5 className="fw-bold text-dark mb-1">Admin System</h5>
                        <p className="extra-small text-muted mb-0">Rôle : Super Administrateur</p>
                      </div>
                    </div>

                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom Complet</Form.Label>
                        <Form.Control defaultValue="Admin System" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Adresse Email</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Poste / Titre</Form.Label>
                        <Form.Control defaultValue="Responsable Portails Académiques" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Téléphone</Form.Label>
                        <Form.Control defaultValue="+212 6 00 00 00 00" className="bg-light border-0 small py-2 shadow-none fw-bold" />
                      </Col>
                    </Row>

                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Équipe Administrative</h6>
                    <div className="d-flex flex-column gap-3">
                      {[
                        { name: 'Dr. Ahmed Mansouri', role: 'Administrateur Jury', status: 'En ligne' },
                        { name: 'Mme. Sara Alami', role: 'Gestionnaire Projets', status: 'Hors ligne' },
                        { name: 'Mr. Khalid Tazi', role: 'Support Technique', status: 'En ligne' }
                      ].map((member, idx) => (
                        <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-4 border bg-white shadow-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm bg-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                              {member.name[0]}
                            </div>
                            <div>
                              <div className="small fw-bold text-dark">{member.name}</div>
                              <div className="extra-small text-muted">{member.role}</div>
                            </div>
                          </div>
                          <Badge bg={member.status === 'En ligne' ? 'success' : 'light'} text={member.status === 'En ligne' ? 'white' : 'dark'} className="extra-small rounded-pill border">
                            {member.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Préférences & Activités</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Configuration des Alertes</Form.Label>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light bg-opacity-50 rounded-4 border">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-white border rounded-circle text-primary"><Mail size={18}/></div>
                            <div>
                              <div className="small fw-bold">Rapports par Email</div>
                              <div className="extra-small text-muted">Résumé hebdomadaire de l'activité du portail.</div>
                            </div>
                          </div>
                          <Form.Check type="switch" defaultChecked />
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-3 bg-light bg-opacity-50 rounded-4 border">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-white border rounded-circle text-primary"><Bell size={18}/></div>
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
                          <div key={idx} className="d-flex align-items-start gap-3 p-3 rounded-4 border bg-white hover-bg-light cursor-pointer transition-all">
                            <div className={`p-2 rounded-circle bg-light text-${n.color}`}>
                              {n.icon}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <div className="small fw-bold text-dark">{n.title}</div>
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
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Gestion du Mot de Passe</h6>
                    <Row className="g-4 mb-5">
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Mot de passe actuel</Form.Label>
                        <Form.Control type="password" placeholder="••••••••••••" className="bg-light border-0 small py-2 shadow-none" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="bg-light border-0 small py-2 shadow-none" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Confirmer le mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="bg-light border-0 small py-2 shadow-none" />
                      </Col>
                      <Col md={12}>
                        <Button variant="outline-primary" className="fw-bold extra-small rounded-3">Mettre à jour le mot de passe</Button>
                      </Col>
                    </Row>

                    {/* Double Authentification */}
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Double Authentification (2FA)</h6>
                    <div className="p-4 bg-light bg-opacity-50 rounded-4 border mb-5">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-white border rounded-3 text-primary">
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
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Sessions Actives</h6>
                    <div className="table-responsive">
                      <table className="table table-borderless align-middle mb-0">
                        <thead className="bg-light bg-opacity-50">
                          <tr>
                            <th className="extra-small fw-bold text-muted py-3 px-3 rounded-start-3">APPAREIL</th>
                            <th className="extra-small fw-bold text-muted py-3 px-3">LOCALISATION</th>
                            <th className="extra-small fw-bold text-muted py-3 px-3 rounded-end-3 text-end">ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
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
                          <tr className="border-top border-light">
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

                {activeTab === 'integrations' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold text-dark mb-4 pb-2 border-bottom">Services Externes</h6>
                    <div className="d-flex flex-column gap-3 mb-5">
                      <Card className="border bg-light bg-opacity-50 p-3 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-white border rounded-3 text-primary fw-black small">B.</div>
                            <div>
                              <div className="small fw-bold">Brevo (Sendinblue)</div>
                              <div className="extra-small text-muted">Service de messagerie transactionnelle activé.</div>
                            </div>
                          </div>
                          <Badge bg="success" className="extra-small">Connecté</Badge>
                        </div>
                      </Card>
                      <Card className="border bg-light bg-opacity-50 p-3 rounded-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3 opacity-50">
                            <div className="p-2 bg-white border rounded-3 text-dark fw-black small">G.</div>
                            <div>
                              <div className="small fw-bold">Google Drive API</div>
                              <div className="extra-small text-muted">Stockage externe pour les rapports volumineux.</div>
                            </div>
                          </div>
                          <Button variant="link" className="text-primary fw-bold extra-small text-decoration-none">Configurer</Button>
                        </div>
                      </Card>
                    </div>
                  </motion.div>
                )}
              </Card.Body>
              <Card.Footer className="bg-light bg-opacity-50 border-top p-4 d-flex justify-content-end gap-3">
                <Button variant="outline-secondary" className="fw-bold small px-4 rounded-pill border shadow-sm bg-white">Annuler</Button>
                <Button className="fw-bold small px-5 rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }}>
                  <Save size={18} className="me-2" /> Enregistrer les changements
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .settings-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .hover-bg-light:hover { background-color: #f1f5f9; color: #2563eb; }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .bg-primary { background-color: #2563eb !important; }
        .transition-all { transition: all 0.2s ease; }
        .cursor-pointer { cursor: pointer; }
        .uppercase { text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
    </div>
  );
};

export default PortalSettings;
