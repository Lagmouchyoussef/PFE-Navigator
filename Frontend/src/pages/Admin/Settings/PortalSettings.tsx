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
    { id: 'general', label: 'Général', icon: <Globe size={18} /> },
    { id: 'appearance', label: 'Apparence', icon: <Monitor size={18} /> },
    { id: 'profile', label: 'Mon Profil', icon: <User size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Sécurité', icon: <Shield size={18} /> },
  ];

  return (
    <div className="settings-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="mb-5">
          <h2 className="fw-bold mb-1 text-navy">Paramètres du Portail</h2>
          <p className="text-muted small mb-0 fw-bold opacity-75">Gestion avancée de la plateforme et de ses services.</p>
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
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Informations de base</h6>
                    <Row className="g-4 mb-5">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom de l'Institution</Form.Label>
                        <Form.Control defaultValue="Université EMSI - Portails PFE" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Email Administrateur</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Langue d'Interface</Form.Label>
                        <div className="form-control-premium fw-bold d-flex align-items-center justify-content-between bg-surface-alt">
                          <span>{navigator.language === 'fr-FR' || navigator.language === 'fr' ? 'Français (FR)' : navigator.language === 'en-US' || navigator.language === 'en' ? 'English (US)' : navigator.language}</span>
                          <Badge className="bg-success-soft text-success border-0 extra-small px-2">Système Connecté</Badge>
                        </div>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Format de Date</Form.Label>
                        <Form.Select className="form-control-premium fw-bold">
                          <option>DD/MM/YYYY</option>
                          <option>MM/DD/YYYY</option>
                          <option>YYYY-MM-DD</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Contrôles Globaux</h6>
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt border">
                        <div>
                          <div className="small fw-bold text-navy">Maintenance Système</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Affiche une page de maintenance pour tous les utilisateurs.</div>
                        </div>
                        <Form.Check type="switch" id="maintenance-switch" className="custom-switch-lg" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 bg-surface-alt border">
                        <div>
                          <div className="small fw-bold text-navy">Inscriptions Ouvertes</div>
                          <div className="extra-small text-muted fw-bold opacity-75">Permettre aux nouveaux étudiants de créer un compte.</div>
                        </div>
                        <Form.Check type="switch" id="register-switch" defaultChecked className="custom-switch-lg" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appearance' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Thème & Identité Visuelle</h6>
                    
                    <div className="mb-5">
                      <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-3">Mode d'affichage</Form.Label>
                      <Row className="g-3">
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all border-primary bg-primary-soft shadow-sm">
                            <Sun size={24} className="mb-2 text-primary" />
                            <div className="extra-small fw-bold text-navy">Mode Clair</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all opacity-50 bg-surface-alt">
                            <Moon size={24} className="mb-2 text-muted" />
                            <div className="extra-small fw-bold text-muted">Mode Sombre</div>
                          </div>
                        </Col>
                        <Col md={4}>
                          <div className="p-3 border rounded-4 text-center cursor-pointer transition-all opacity-50 bg-surface-alt">
                            <Monitor size={24} className="mb-2 text-muted" />
                            <div className="extra-small fw-bold text-muted">Système</div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-3">Logo de la plateforme</Form.Label>
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
                            Changer le logo
                          </Button>
                          <div className="extra-small text-muted fw-bold opacity-75">Recommandé : PNG ou SVG, fond transparent.</div>
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
                        <h4 className="fw-bold mb-1 text-navy">{user?.name || 'Administrateur'}</h4>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <Badge className="bg-primary-soft text-primary border-0 extra-small px-3 py-1 rounded-pill fw-bold text-uppercase">Rôle : {user?.role || 'Admin'}</Badge>
                          <Badge className="bg-success-soft text-success border-0 extra-small px-3 py-1 rounded-pill fw-bold text-uppercase">Compte Vérifié</Badge>
                        </div>
                        <p className="extra-small text-muted mb-0 fw-bold opacity-75">ID Utilisateur : #AD-2026-991</p>
                      </div>
                    </div>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy d-flex align-items-center gap-2">
                      <User size={18} className="text-primary" /> Détails du Compte
                    </h6>
                    <Row className="g-4">
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Prénom</Form.Label>
                        <Form.Control defaultValue={user?.name?.split(' ')[0] || 'Admin'} className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom</Form.Label>
                        <Form.Control defaultValue={user?.name?.split(' ')[1] || 'System'} className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Email Professionnel</Form.Label>
                        <Form.Control defaultValue="admin@emsi.ma" className="form-control-premium fw-bold" readOnly />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Numéro de Téléphone</Form.Label>
                        <Form.Control defaultValue="+212 6 00 00 00 00" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Département</Form.Label>
                        <Form.Select className="form-control-premium fw-bold">
                          <option>Ingénierie Informatique</option>
                          <option>Génie Civil</option>
                          <option>Management</option>
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Poste / Fonction</Form.Label>
                        <Form.Control defaultValue="Responsable des Portails" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Biographie / Description</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          className="form-control-premium fw-bold" 
                          placeholder="Parlez-nous de vous..."
                          defaultValue="Responsable de la coordination des projets de fin d'études à l'EMSI."
                        />
                      </Col>
                    </Row>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Préférences de Notification</h6>
                    
                    <div className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-circle text-primary"><Mail size={18}/></div>
                          <div>
                            <div className="small fw-bold text-navy">Rapports par Email</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Résumé hebdomadaire de l'activité du portail.</div>
                          </div>
                        </div>
                        <Form.Check type="switch" defaultChecked className="custom-switch-lg" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-4 border bg-surface-alt shadow-sm">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-circle text-primary"><Bell size={18}/></div>
                          <div>
                            <div className="small fw-bold text-navy">Alertes de Bureau</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Notifications instantanées lors de nouvelles soumissions.</div>
                          </div>
                        </div>
                        <Form.Check type="switch" defaultChecked className="custom-switch-lg" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Sécurité du Compte</h6>
                    <Row className="g-4 mb-5">
                      <Col md={12}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Mot de passe actuel</Form.Label>
                        <Form.Control type="password" placeholder="••••••••••••" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nouveau mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="form-control-premium fw-bold" />
                      </Col>
                      <Col md={6}>
                        <Form.Label className="extra-small fw-bold text-muted text-uppercase">Confirmer le mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Min. 12 caractères" className="form-control-premium fw-bold" />
                      </Col>
                    </Row>

                    <h6 className="fw-bold mb-4 pb-2 border-bottom text-navy">Authentification à deux facteurs</h6>
                    <div className="p-4 rounded-4 border bg-surface-alt shadow-sm">
                      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div className="d-flex align-items-center gap-3">
                          <div className="p-2 bg-primary-soft border border-primary border-opacity-10 rounded-3 text-primary">
                            <Smartphone size={24} />
                          </div>
                          <div>
                            <div className="small fw-bold text-navy">Application d'authentification</div>
                            <div className="extra-small text-muted fw-bold opacity-75">Sécurisez votre compte avec Google Authenticator ou Authy.</div>
                          </div>
                        </div>
                        <Button className="btn-premium px-4">Activer 2FA</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="p-4 border-top text-end bg-surface-alt">
                <Button className="btn-premium px-4">
                  <Save size={18} className="me-2" />
                  Sauvegarder les paramètres
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
