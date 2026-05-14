import React from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar, Nav, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  User, Mail, Book, Calendar, ChevronLeft, 
  FileText, Award, Phone, MapPin, Download, 
  ExternalLink, MessageSquare, CheckCircle, Clock,
  Activity, Target, Shield, Briefcase
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data for a single student - in a real app this would fetch by ID
  const student = {
    id: id || 1,
    name: 'Ahmed Khalil',
    email: 'ahmed.khalil@emsi.ma',
    phone: '+212 6 12 34 56 78',
    department: 'Software Engineering',
    type: 'PFE',
    status: 'In Progress',
    progress: 75,
    projectTitle: 'AI-Powered Student Performance Prediction System',
    supervisor: 'Dr. Sofia Drissi',
    institution: 'EMSI - École Marocaine des Sciences de l\'Ingénieur',
    startDate: '2025-10-15',
    endDate: '2026-06-30',
    description: 'Ce projet vise à développer un système basé sur l\'intelligence artificielle capable de prédire les performances académiques des étudiants en se basant sur leurs comportements d\'apprentissage et leurs résultats passés.',
    deliverables: [
      { id: 1, name: 'Cahier des Charges', date: '2025-11-20', status: 'Validated', size: '2.4 MB' },
      { id: 2, name: 'Rapport d\'analyse', date: '2026-01-15', status: 'Validated', size: '4.1 MB' },
      { id: 3, name: 'Rapport de mi-parcours', date: '2026-03-10', status: 'Pending', size: '5.8 MB' },
    ],
    milestones: [
      { id: 1, title: 'Validation du Sujet', date: '2025-10-20', completed: true },
      { id: 2, title: 'Analyse & Conception', date: '2026-01-05', completed: true },
      { id: 3, title: 'Implémentation Phase 1', date: '2026-03-15', completed: false },
      { id: 4, title: 'Dépôt Rapport Final', date: '2026-05-20', completed: false },
    ]
  };

  return (
    <div className="supervisor-student-detail-layout py-4 bg-surface-alt min-vh-100">
      <Container fluid className="px-4">
        {/* Navigation & Header */}
        <header className="mb-4">
          <Button 
            variant="link" 
            className="p-0 text-muted extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 mb-3 hover-text-primary transition-all shadow-none border-0"
            onClick={() => navigate('/supervisor/students')}
          >
            <ChevronLeft size={14} /> Retour à la liste
          </Button>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-4"
          >
            <div className="d-flex align-items-center gap-4">
              <div className="avatar-xl bg-primary text-white rounded-4 d-flex align-items-center justify-content-center shadow-lg position-relative" style={{ width: '80px', height: '80px', fontSize: '2rem', fontWeight: 800 }}>
                {student.name.charAt(0)}
                <div className="position-absolute bottom-0 end-0 p-1 bg-success rounded-circle border border-3 border-white" style={{ width: '18px', height: '18px' }}></div>
              </div>
              <div>
                <h2 className="fw-bold mb-1 text-navy">{student.name}</h2>
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <Badge className="bg-primary-soft text-primary border-0 extra-small px-3 py-1 fw-bold rounded-pill">
                    {student.department}
                  </Badge>
                  <Badge className="bg-success-soft text-success border-0 extra-small px-3 py-1 fw-bold rounded-pill">
                    {student.type}
                  </Badge>
                  <div className="text-muted extra-small fw-bold opacity-75 ms-2 d-flex align-items-center gap-1">
                    <MapPin size={12} /> Casablanca, EMSI
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <Button className="btn-pro-outline d-flex align-items-center gap-2 border-2 px-4 py-2 small fw-bold">
                <MessageSquare size={18} /> Message
              </Button>
              <Button className="btn-premium d-flex align-items-center gap-2 shadow-sm px-4 py-2 small">
                <Award size={18} /> Évaluer
              </Button>
            </div>
          </motion.div>
        </header>

        <Row className="g-4">
          {/* Left Column: Details & Progress */}
          <Col lg={8}>
            <Tab.Container defaultActiveKey="overview">
              <Nav variant="pills" className="nav-premium mb-4 gap-2">
                <Nav.Item>
                  <Nav.Link eventKey="overview" className="rounded-pill px-4 py-2 small fw-bold border-0 shadow-none">Aperçu</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="deliverables" className="rounded-pill px-4 py-2 small fw-bold border-0 shadow-none">Livrables</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="timeline" className="rounded-pill px-4 py-2 small fw-bold border-0 shadow-none">Timeline</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Project Card */}
                    <Card className="glass-card border-0 p-4 shadow-sm mb-4 rounded-4">
                      <div className="d-flex justify-content-between align-items-start mb-4">
                        <div>
                          <h6 className="fw-bold text-navy mb-1">Titre du Projet</h6>
                          <h4 className="fw-bold text-primary mb-0">{student.projectTitle}</h4>
                        </div>
                        <div className="p-3 rounded-4 bg-surface-alt text-primary">
                          <Book size={24} />
                        </div>
                      </div>
                      <p className="text-muted small mb-4 lh-lg">
                        {student.description}
                      </p>
                      <div className="bg-surface-alt p-3 rounded-4 border-start border-primary border-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="small fw-bold text-navy">Progression Globale</span>
                          <span className="small fw-bold text-primary">{student.progress}%</span>
                        </div>
                        <ProgressBar now={student.progress} variant="primary" style={{ height: '8px' }} className="rounded-pill bg-transparent" />
                      </div>
                    </Card>

                    <Row className="g-4">
                      <Col md={6}>
                        <Card className="glass-card border-0 p-4 shadow-sm rounded-4 h-100">
                          <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                            <Activity size={18} className="text-primary" /> Informations Académiques
                          </h6>
                          <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Statut</span>
                              <Badge className="bg-warning-soft text-warning border-0 extra-small px-2 py-1 rounded-pill">{student.status}</Badge>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Encadrant</span>
                              <span className="extra-small text-navy fw-bold">{student.supervisor}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Début</span>
                              <span className="extra-small text-navy fw-bold">{student.startDate}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Date Limite</span>
                              <span className="extra-small text-navy fw-bold">{student.endDate}</span>
                            </div>
                          </div>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card className="glass-card border-0 p-4 shadow-sm rounded-4 h-100">
                          <h6 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
                            <Shield size={18} className="text-primary" /> Certification & Accès
                          </h6>
                          <div className="d-flex flex-column gap-3">
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">ID Institutionnel</span>
                              <span className="extra-small text-navy fw-bold">STU-2026-00105</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Accès Documents</span>
                              <span className="extra-small text-success fw-bold">Autorisé</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="extra-small text-muted fw-bold">Vérification</span>
                              <span className="extra-small text-info fw-bold">Complétée</span>
                            </div>
                          </div>
                        </Card>
                      </Col>
                    </Row>
                  </motion.div>
                </Tab.Pane>

                <Tab.Pane eventKey="deliverables">
                  <Card className="glass-card border-0 p-0 shadow-sm rounded-4 overflow-hidden">
                    <Table responsive hover className="mb-0 align-middle">
                      <thead className="bg-surface-alt border-bottom">
                        <tr>
                          <th className="px-4 py-3 text-muted extra-small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Document</th>
                          <th className="px-4 py-3 text-muted extra-small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Date</th>
                          <th className="px-4 py-3 text-muted extra-small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Statut</th>
                          <th className="px-4 py-3 text-muted extra-small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {student.deliverables.map((doc) => (
                          <tr key={doc.id}>
                            <td className="px-4 py-3">
                              <div className="d-flex align-items-center gap-2">
                                <div className="p-2 rounded bg-surface-alt text-primary">
                                  <FileText size={18} />
                                </div>
                                <div>
                                  <div className="small fw-bold text-navy">{doc.name}</div>
                                  <div className="extra-small text-muted">{doc.size}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 small text-muted">{doc.date}</td>
                            <td className="px-4 py-3">
                              <Badge className={`bg-${doc.status === 'Validated' ? 'success' : 'warning'}-soft text-${doc.status === 'Validated' ? 'success' : 'warning'} border-0 extra-small px-3 py-1 fw-bold rounded-pill`}>
                                {doc.status === 'Validated' ? 'Validé' : 'En attente'}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Button variant="link" className="p-0 text-primary shadow-none border-0">
                                <Download size={18} />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="timeline">
                  <Card className="glass-card border-0 p-4 shadow-sm rounded-4">
                    <div className="position-relative ms-4 border-start border-2 border-primary border-opacity-10 py-2">
                      {student.milestones.map((ms, i) => (
                        <div key={ms.id} className="position-relative mb-5 ps-4">
                          <div 
                            className={`position-absolute start-0 top-0 translate-middle-x rounded-circle border border-4 border-white shadow-sm d-flex align-items-center justify-content-center ${ms.completed ? 'bg-success text-white' : 'bg-white text-muted'}`}
                            style={{ width: '28px', height: '28px', left: '-1px' }}
                          >
                            {ms.completed ? <CheckCircle size={14} /> : <div className="rounded-circle bg-surface-alt" style={{ width: '8px', height: '8px' }}></div>}
                          </div>
                          <div>
                            <div className="small fw-bold text-navy mb-1">{ms.title}</div>
                            <div className="extra-small text-muted fw-bold opacity-75">{ms.date}</div>
                            <p className="extra-small text-muted mt-2 mb-0">
                              {ms.completed ? "Étape validée avec succès par l'encadrant et l'administration." : "Cette étape nécessite le dépôt des documents requis."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>

          {/* Right Column: Contact & Stats */}
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Performance Indicators Card */}
              <Card className="glass-card border-0 p-4 shadow-sm bg-white rounded-4 overflow-hidden position-relative">
                <h6 className="fw-bold mb-4 text-navy d-flex align-items-center gap-2">
                  <Target size={18} className="text-primary" /> Indicateurs de Performance
                </h6>
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-4 bg-primary-soft border border-primary border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="extra-small text-muted fw-bold">Note Moyenne</div>
                        <div className="h3 fw-bold mb-0 text-navy">16,5<span className="small opacity-50">/20</span></div>
                      </div>
                      <Badge className="bg-success-soft text-success border-0 extra-small">+1,2</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-4 bg-info-soft border border-info border-opacity-10">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="extra-small text-muted fw-bold">Taux de Complétion</div>
                        <div className="h3 fw-bold mb-0 text-navy">75%</div>
                      </div>
                      <Badge className="bg-info-soft text-info border-0 extra-small">En bonne voie</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Information */}
              <Card className="glass-card border-0 p-4 shadow-sm rounded-4">
                <h6 className="fw-bold text-navy mb-4">Informations de Contact</h6>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-surface-alt text-primary">
                      <Mail size={18} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="extra-small text-muted fw-bold">Email Académique</div>
                      <div className="small fw-bold text-navy text-truncate">{student.email}</div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="p-2 rounded bg-surface-alt text-success">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="extra-small text-muted fw-bold">Téléphone</div>
                      <div className="small fw-bold text-navy">{student.phone}</div>
                    </div>
                  </div>
                  <Button className="btn-pro-outline w-100 d-flex align-items-center justify-content-center gap-2 mt-2 border-2 small fw-bold">
                    <ExternalLink size={16} /> Contacter via MS Teams
                  </Button>
                </div>
              </Card>

            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDetail;
