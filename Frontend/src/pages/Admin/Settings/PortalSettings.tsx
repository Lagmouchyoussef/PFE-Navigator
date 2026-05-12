import React, { useState, useRef } from 'react';
import { 
  Monitor, Bell, Shield, 
  Puzzle, Globe, Clock, Moon, 
  Sun, Check, Save, Upload,
  AlertTriangle, ChevronRight, Mail, Server, Smartphone, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Form, Badge, Nav } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

type SettingsTab = 'general' | 'appearance' | 'profile' | 'notifications' | 'security' | 'integrations';

const PortalSettings: React.FC = () => {
  const { theme, setTheme } = useApp();
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [selectedColor, setSelectedColor] = useState('#2563eb');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactElement }[] = [
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
          <h2 className="fw-bold mb-1 text-gradient">Paramètres du Portail</h2>
          <p className="text-muted small mb-0">Gestion avancée de la plateforme et de ses services.</p>
        </div>

        <Row className="g-4">
          {/* Navigation Sidebar */}
          <Col lg={3}>
            <div className="glass-card shadow-sm rounded-4 overflow-hidden mb-4">
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

            <div className="glass-card p-4 rounded-4 border-primary border-opacity-10 bg-primary bg-opacity-5">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-circle text-primary">
                  <Server size={20} />
                </div>
                <h6 className="fw-bold mb-0 text-navy">État Système</h6>
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
            <div className="glass-card shadow-sm rounded-4 h-100 overflow-hidden d-flex flex-column">
              <div className="border-bottom p-4">
                <h5 className="fw-bold mb-0 d-flex align-items-center gap-2 text-navy">
                  {tabs.find(t => t.id === activeTab)?.icon}
                  {tabs.find(t => t.id === activeTab)?.label}
                </h5>
              </div>
              
              <div className="p-4 p-md-5 flex-grow-1">
                {activeTab === 'general' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Informations de base</h6>
                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom de l'Institution</Form.Label>
                        <Form.Control defaultValue="Université EMSI - Portails PFE" className="form-control-premium" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Email Administrateur</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="form-control-premium" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Langue d'Interface</Form.Label>
                        <Form.Select className="form-control-premium">
                          <option>Français (FR)</option>
                          <option>English (US)</option>
                          <option>Arabe (MA)</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Format de Date</Form.Label>
                        <Form.Select className="form-control-premium">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Contrôles Globaux</h6>
                    <div className="d-flex flex-column gap-4">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt">
                        <div>
                          <div className="small fw-bold text-navy">Maintenance Système</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Affiche une page de maintenance pour tous les utilisateurs.</div>
                        </div>
                        <Form.Check type="switch" id="maintenance-switch" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt">
                        <div>
                          <div className="small fw-bold text-navy">Inscriptions Ouvertes</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Permettre aux nouveaux étudiants de créer un compte.</div>
                        </div>
                        <Form.Check type="switch" id="register-switch" defaultChecked />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Thème & Identité Visuelle</h6>
                    
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
                              border: selectedColor === color ? '3px solid var(--color-primary)' : 'none',
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
                      />
                      <div className="d-flex align-items-center gap-4 p-4 rounded-4 border border-dashed bg-surface-alt">
                        <div className="p-4 bg-white rounded-3 shadow-sm border">
                          <Globe size={40} className="text-primary" />
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            className="btn-premium mb-2"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Changer le logo
                          </Button>
                          <div className="extra-small text-muted fw-bold">Recommandé : PNG ou SVG, min 512x512px.</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Informations Personnelles</h6>
                    <div className="d-flex align-items-center gap-4 mb-5">
                      <div className="position-relative">
                        <div className="avatar-preview rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold fs-2 border border-primary border-opacity-25" style={{ width: '100px', height: '100px' }}>
                          AS
                        </div>
                        <Button size="sm" variant="light" className="position-absolute bottom-0 end-0 p-1 rounded-circle shadow border"><Upload size={14}/></Button>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-1 text-navy">Admin System</h5>
                        <p className="extra-small text-muted mb-0 fw-bold">Rôle : Super Administrateur</p>
                      </div>
                    </div>

                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Prénom</Form.Label>
                        <Form.Control defaultValue="Admin" className="form-control-premium" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nom</Form.Label>
                        <Form.Control defaultValue="System" className="form-control-premium" />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Poste Administratif</Form.Label>
                        <Form.Control defaultValue="Responsable Portails Académiques" className="form-control-premium" />
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Préférences & Activités</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted uppercase mb-3">Configuration des Alertes</Form.Label>
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-primary bg-opacity-10 border rounded-circle text-primary"><Mail size={18}/></div>
                            <div>
                              <div className="small fw-bold text-navy">Rapports par Email</div>
                              <div className="extra-small text-muted fw-bold opacity-75">Résumé hebdomadaire de l'activité du portail.</div>
                            </div>
                          </div>
                          <Form.Check type="switch" defaultChecked />
                        </div>
                        <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 bg-primary bg-opacity-10 border rounded-circle text-primary"><Bell size={18}/></div>
                            <div>
                              <div className="small fw-bold text-navy">Alertes de Bureau</div>
                              <div className="extra-small text-muted fw-bold opacity-75">Notifications instantanées lors de nouvelles soumissions.</div>
                            </div>
                          </div>
                          <Form.Check type="switch" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Gestion du Mot de Passe</h6>
                    <Row className="g-4 mb-5">
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Mot de passe actuel</Form.Label>
                        <Form.Control type="password" placeholder="••••••••••••" className="form-control-premium" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="form-control-premium" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted uppercase">Confirmer le mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="form-control-premium" />
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Double Authentification (2FA)</h6>
                    <div className="p-4 rounded-4 border mb-5 shadow-sm bg-surface-alt">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary bg-opacity-10 border rounded-3 text-primary">
                            <Smartphone size={24} />
                          </div>
                          <div>
                            <div className="small fw-bold text-navy">Application d'authentification</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Utilisez Google Authenticator pour sécuriser votre accès.</div>
                          </div>
                        </div>
                        <Button className="btn-premium px-4">Configurer</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 border-top text-end bg-surface-alt">
                <Button className="btn-premium">
                  <Save size={18} className="me-2" />
                  Enregistrer les modifications
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
