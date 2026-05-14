import React, { useState } from 'react';
import { 
  Search, Edit2, Trash2, Mail, Shield, 
  Clock, XCircle, UserCheck, UserPlus, Users, 
  MoreHorizontal, Camera, AlertCircle, CheckCircle, Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown, Modal, Tabs, Tab } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';

interface UserData {
  id: number;
  institutionalId: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  lastLogin: string;
  avatar: string;
  // New Fields
  cin?: string;
  address?: string;
  academicYear?: string;
  nationalCode?: string;
  section?: string;
  diplomaGrade?: string;
  diplomaObtained?: string;
  cnss?: string;
  familyStatus?: string;
  fatherName?: string;
  fatherProfession?: string;
  fatherPhone?: string;
  fatherEmail?: string;
  motherName?: string;
  motherProfession?: string;
  motherPhone?: string;
  motherEmail?: string;
  password?: string;
  history?: { action: string, date: string }[];
  activeSessions?: { device: string, ip: string, lastActive: string }[];
  // Feedback Fields
  confirmationStatus?: 'None' | 'Confirmed' | 'Reported';
  reportDetails?: {
    message: string;
    suggestedPhoto?: string;
    date: string;
  };
}

const INITIAL_USERS: UserData[] = [
  { 
    id: 1, 
    institutionalId: 'ADM-2026-00412', 
    name: 'Marie Dupont', 
    email: 'marie.dupont@email.com', 
    role: 'Admin', 
    status: 'Active', 
    lastLogin: '2 min ago', 
    avatar: 'https://ui-avatars.com/api/?name=Marie+Dupont&background=3b82f6&color=fff',
    confirmationStatus: 'Confirmed'
  },
  { 
    id: 4, 
    institutionalId: 'STU-2026-00105', 
    name: 'Lucas Petit', 
    email: 'lucas.petit@email.com', 
    role: 'Student', 
    status: 'Active', 
    lastLogin: '3 days ago', 
    avatar: 'https://ui-avatars.com/api/?name=Lucas+Petit&background=3b82f6&color=fff',
    confirmationStatus: 'Reported',
    reportDetails: {
      message: "Mon adresse a changé, je suis maintenant au 45 Rue Hassan II, Rabat. Et je voudrais changer ma photo.",
      date: "2026-05-14",
      suggestedPhoto: "https://ui-avatars.com/api/?name=LP&background=random"
    },
    activeSessions: [
      { device: 'Windows 11 - Chrome', ip: '196.200.14.52', lastActive: '2 mins ago' },
      { device: 'iPhone 15 - Safari', ip: '105.158.102.1', lastActive: '1 day ago' }
    ]
  },
  { 
    id: 2, 
    institutionalId: 'JRY-2026-00951', 
    name: 'Jean Martin', 
    email: 'jean.martin@email.com', 
    role: 'Jury Member', 
    status: 'Active', 
    lastLogin: '1 hour ago', 
    avatar: 'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=fff', 
    confirmationStatus: 'None',
    activeSessions: [
      { device: 'macOS - Firefox', ip: '197.252.33.10', lastActive: 'Active now' }
    ]
  },
  { id: 3, institutionalId: 'SUP-2026-00842', name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'Supervisor', status: 'Pending', lastLogin: 'Never', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=f59e0b&color=fff', confirmationStatus: 'None' },
  { id: 5, institutionalId: 'JRY-2026-00234', name: 'Emma Leroy', email: 'emma.leroy@email.com', role: 'Jury Member', status: 'Inactive', lastLogin: '30 days ago', avatar: 'https://ui-avatars.com/api/?name=Emma+Leroy&background=64748b&color=fff', confirmationStatus: 'None' },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [isOtherDiploma, setIsOtherDiploma] = useState(false);

  const handleOpenModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
      const standardDiplomas = ['Doctorat', 'Master', "Ingénieur d'État", 'Licence'];
      setIsOtherDiploma(user.diplomaObtained ? !standardDiplomas.includes(user.diplomaObtained) : false);
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Student', status: 'Active' });
      setIsOtherDiploma(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleProcessReport = (userId: number) => {
    setUsers(users.map(u => u.id === userId ? { ...u, confirmationStatus: 'None', reportDetails: undefined } as UserData : u));
  };

  const handleApplyPhoto = (userId: number, photo: string) => {
    setUsers(users.map(u => u.id === userId ? { 
      ...u, 
      avatar: photo, 
      confirmationStatus: 'None', 
      reportDetails: undefined 
    } as UserData : u));
  };

  const generateInstitutionalId = (role: string) => {
    const year = new Date().getFullYear();
    const prefix = 
      role === 'Student' ? 'STU' : 
      role === 'Jury Member' ? 'JRY' : 
      role === 'Supervisor' ? 'SUP' : 'ADM';
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `${prefix}-${year}-${randomNum}`;
  };

  const handleSave = () => {
    const now = new Date().toLocaleString();
    if (editingUser) {
      const newHistory = [...(editingUser.history || []), { action: 'Modification profil par Admin', date: now }];
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData, history: newHistory } as UserData : u));
    } else {
      const role = formData.role || 'Student';
      const newUser: UserData = {
        id: Math.max(...users.map(u => u.id)) + 1,
        institutionalId: generateInstitutionalId(role),
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password || 'Emsi2026!',
        role: role,
        status: (formData.status as any) || 'Active',
        lastLogin: 'Never',
        avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || '')}&background=3b82f6&color=fff`,
        history: [{ action: 'Création du compte', date: now }],
        confirmationStatus: 'None'
      };
      setUsers([...users, newUser]);
    }
    closeModal();
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="users-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Gestion des Utilisateurs</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Contrôlez les accès et les rôles de tous les membres du portail.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Users size={18} /> Exporter
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => handleOpenModal()}
            >
              <UserPlus size={18} /> Ajouter Utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} sm={6}>
            <StatCard label="Total Utilisateurs" value={users.length.toString()} color="primary" icon={<Users />} trend="Global" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Actifs" value={users.filter(u => u.status === 'Active').length.toString()} color="success" icon={<UserCheck />} trend="Vérifié" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="En Attente" value={users.filter(u => u.status === 'Pending').length.toString()} color="warning" icon={<Clock />} trend="Inscriptions" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Inactifs" value={users.filter(u => u.status === 'Inactive').length.toString()} color="danger" icon={<XCircle />} trend="Bloqués" />
          </Col>
        </Row>

        {/* Search & Filters */}
        <div className="glass-card p-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher nom, email, rôle..." 
                  className="bg-transparent border-0 shadow-none py-2 text-navy fw-bold small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Tous les rôles</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Statut: Actif</Button>
                <Button variant="link" className="text-muted extra-small fw-bold text-decoration-none">Réinitialiser</Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Users Tables by Role */}
        <div className="glass-card p-0 overflow-hidden">
          <Tabs
            defaultActiveKey="Student"
            id="user-management-tabs"
            className="custom-tabs-premium px-4 pt-3 border-bottom-0"
          >
            {[
              { key: 'Student', label: 'Étudiants', icon: <Users size={16} /> },
              { key: 'Supervisor', label: 'Encadrants', icon: <UserCheck size={16} /> },
              { key: 'Jury Member', label: 'Membres de Jury', icon: <Shield size={16} /> },
              { key: 'Admin', label: 'Administrateurs', icon: <Shield size={16} className="text-danger" /> },
            ].map((tab) => (
              <Tab 
                key={tab.key} 
                eventKey={tab.key} 
                title={
                  <div className="d-flex align-items-center gap-2">
                    {tab.icon} {tab.label}
                    <Badge bg="primary-soft" className="text-primary extra-small rounded-pill">
                      {users.filter(u => u.role === tab.key).length}
                    </Badge>
                  </div>
                }
              >
                <div className="table-responsive">
                  <Table borderless hover className="align-middle mb-0 custom-table-modern">
                    <thead>
                      <tr>
                        <th className="px-4">Utilisateur</th>
                        <th>Vérification</th>
                        <th>Statut</th>
                        <th>Dernière connexion</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.filter(u => u.role === tab.key).length > 0 ? (
                        filteredUsers.filter(u => u.role === tab.key).map((user) => (
                          <React.Fragment key={user.id}>
                            <tr>
                              <td className="px-4 py-3">
                                <div className="d-flex align-items-center gap-3">
                                  <img src={user.avatar} alt={user.name} className="rounded-circle border" style={{ width: '40px', height: '40px' }} />
                                  <div>
                                    <div className="small fw-bold text-navy">{user.name}</div>
                                    <div className="extra-small text-primary fw-bold mb-1" style={{ fontSize: '10px' }}>ID: {user.institutionalId}</div>
                                    <div className="extra-small text-muted fw-bold opacity-75">{user.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                {user.confirmationStatus === 'Confirmed' ? (
                                  <Badge bg="success-soft" className="text-success extra-small fw-bold d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                    <CheckCircle size={12} /> Confirmé
                                  </Badge>
                                ) : user.confirmationStatus === 'Reported' ? (
                                  <Badge bg="danger-soft" className="text-danger extra-small fw-bold d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                    <AlertCircle size={12} /> Erreur Signalée
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary-soft" className="text-muted extra-small fw-bold" style={{ width: 'fit-content' }}>
                                    En attente
                                  </Badge>
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className={`rounded-circle ${user.status === 'Active' ? 'bg-success' : user.status === 'Pending' ? 'bg-warning' : 'bg-danger'}`} style={{ width: '8px', height: '8px' }}></div>
                                  <span className="extra-small fw-bold text-muted">{user.status}</span>
                                </div>
                              </td>
                              <td className="small text-muted fw-bold">{user.lastLogin}</td>
                              <td className="px-4 text-end">
                                <Dropdown align="end">
                                  <Dropdown.Toggle variant="link" className="text-muted p-0 no-caret shadow-none border-0">
                                    <MoreHorizontal size={18} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                                    <Dropdown.Item className="extra-small fw-bold" onClick={() => handleOpenModal(user)}><Edit2 size={14} className="me-2" /> Modifier</Dropdown.Item>
                                    <Dropdown.Item className="extra-small fw-bold"><Mail size={14} className="me-2" /> Message</Dropdown.Item>
                                    <Dropdown.Item className="extra-small fw-bold"><Shield size={14} className="me-2" /> Accès</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="extra-small fw-bold text-danger"><Trash2 size={14} className="me-2" /> Supprimer</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                            {user.confirmationStatus === 'Reported' && user.reportDetails && (
                              <tr>
                                <td colSpan={6} className="bg-danger-soft px-4 py-3 border-top-0">
                                  <div className="d-flex gap-3 align-items-start">
                                    <div className="p-2 bg-danger text-white rounded-circle shadow-sm">
                                      <AlertCircle size={16} />
                                    </div>
                                    <div className="flex-grow-1">
                                      <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="extra-small fw-bold text-danger text-uppercase tracking-wider">Signalement Reçu le {user.reportDetails.date}</span>
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-0 text-danger extra-small fw-bold text-decoration-none"
                                          onClick={() => handleProcessReport(user.id)}
                                        >
                                          Marquer comme traité
                                        </Button>
                                      </div>
                                      <p className="small text-navy mb-2 fw-bold opacity-75">{user.reportDetails.message}</p>
                                      {user.reportDetails.suggestedPhoto && (
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="extra-small text-muted fw-bold">Nouvelle Photo demandée:</span>
                                          <img src={user.reportDetails.suggestedPhoto} alt="Suggestion" className="rounded border shadow-sm" style={{ width: '32px', height: '32px' }} />
                                          <Button 
                                            variant="link" 
                                            size="sm" 
                                            className="p-0 extra-small fw-bold text-primary text-decoration-none"
                                            onClick={() => handleApplyPhoto(user.id, user.reportDetails!.suggestedPhoto!)}
                                          >
                                            Appliquer la photo
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-5 text-muted small fw-bold">
                            Aucun utilisateur trouvé dans cette catégorie.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </Tab>
            ))}
          </Tabs>
          <div className="p-4 border-top d-flex justify-content-between align-items-center bg-surface-alt">
            <span className="extra-small text-muted fw-bold">Affichage catégorisé des utilisateurs</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>1</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* User Modal (Add/Edit) */}
      <Modal show={showModal} onHide={closeModal} centered className="users-modal">
        <Modal.Header closeButton className="border-bottom px-4 py-3">
          <Modal.Title className="fw-bold fs-5 text-navy">{editingUser ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex flex-column align-items-center mb-4">
            <div className="position-relative mb-2">
              <img 
                src={formData.avatar || 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'} 
                alt="Avatar Preview" 
                className="rounded-circle border shadow-sm" 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
              />
              <Button 
                size="sm" 
                className="position-absolute bottom-0 end-0 p-1 rounded-circle bg-primary border-white" 
                style={{ width: '28px', height: '28px' }}
                onClick={() => {
                  const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan'];
                  const randomName = names[Math.floor(Math.random() * names.length)];
                  setFormData({...formData, avatar: `https://ui-avatars.com/api/?name=${randomName}&background=random&color=fff`});
                }}
              >
                <Camera size={14} color="white" />
              </Button>
            </div>
            <div className="extra-small fw-bold text-muted text-uppercase">Photo de Profil (Géré par l'Admin)</div>
          </div>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">ID Institutionnel (Auto-généré)</Form.Label>
                <Form.Control 
                  value={formData.institutionalId || 'Génération automatique...'} 
                  readOnly
                  className="form-control-premium fw-bold bg-surface-alt border-dashed" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Prénom</Form.Label>
                <Form.Control 
                  value={formData.name?.split(' ')[0] || ''} 
                  onChange={e => setFormData({...formData, name: `${e.target.value} ${formData.name?.split(' ')[1] || ''}`.trim()})}
                  placeholder="Ex: Jean" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom</Form.Label>
                <Form.Control 
                  value={formData.name?.split(' ')[1] || ''} 
                  onChange={e => setFormData({...formData, name: `${formData.name?.split(' ')[0] || ''} ${e.target.value}`.trim()})}
                  placeholder="Ex: Martin" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Email Institutionnel</Form.Label>
                <Form.Control 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="jean.martin@email.com" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Rôle</Form.Label>
                <Form.Select 
                  value={formData.role || 'Student'} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="form-control-premium fw-bold"
                >
                  <option value="Student">Étudiant</option>
                  <option value="Jury Member">Membre de Jury</option>
                  <option value="Supervisor">Encadrant</option>
                  <option value="Admin">Administrateur</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Statut</Form.Label>
                <Form.Select 
                  value={formData.status || 'Active'} 
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="form-control-premium fw-bold"
                >
                  <option value="Active">Actif</option>
                  <option value="Pending">En attente</option>
                  <option value="Inactive">Inactif</option>
                </Form.Select>
              </Col>

              <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Informations Personnelles & Sécurité</h6></Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">CIN</Form.Label>
                <Form.Control 
                  value={formData.cin || ''} 
                  onChange={e => setFormData({...formData, cin: e.target.value})}
                  placeholder="AB123456" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Situation familiale</Form.Label>
                <Form.Select 
                  value={formData.familyStatus || 'Célibataire'} 
                  onChange={e => setFormData({...formData, familyStatus: e.target.value})}
                  className="form-control-premium fw-bold"
                >
                  <option>Célibataire</option>
                  <option>Marié(e)</option>
                  <option>Divorcé(e)</option>
                  <option>Veuf/Veuve</option>
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Adresse</Form.Label>
                <Form.Control 
                  value={formData.address || ''} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Adresse complète..." 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              
              {/* Role specific: CNSS for Jury/Supervisor/Admin */}
              {(formData.role === 'Jury Member' || formData.role === 'Supervisor' || formData.role === 'Admin') && (
                <Col md={12}>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Code de CNSS</Form.Label>
                  <Form.Control 
                    value={formData.cnss || ''} 
                    onChange={e => setFormData({...formData, cnss: e.target.value})}
                    placeholder="Numéro CNSS..." 
                    className="form-control-premium fw-bold" 
                  />
                </Col>
              )}

              {/* Advanced Student Info - Only if role is Student */}
              {formData.role === 'Student' && (
                <>
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Informations Académiques Étudiant</h6></Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Code National (CNE)</Form.Label>
                    <Form.Control 
                      value={formData.nationalCode || ''} 
                      onChange={e => setFormData({...formData, nationalCode: e.target.value})}
                      placeholder="G13000..." 
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Note du Diplôme</Form.Label>
                    <Form.Control 
                      type="number"
                      step="0.01"
                      value={formData.diplomaGrade || ''} 
                      onChange={e => setFormData({...formData, diplomaGrade: e.target.value})}
                      placeholder="Ex: 16.50" 
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Année Univ.</Form.Label>
                    <Form.Control 
                      value={formData.academicYear || '2025/2026'} 
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Section / Groupe</Form.Label>
                    <Form.Control 
                      value={formData.section || ''} 
                      onChange={e => setFormData({...formData, section: e.target.value})}
                      placeholder="Ex: 5IIR-G1" 
                      className="form-control-premium fw-bold" 
                    />
                  </Col>

                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Informations des Parents</h6></Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom du Père</Form.Label>
                    <Form.Control 
                      value={formData.fatherName || ''} 
                      onChange={e => setFormData({...formData, fatherName: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Tél. Père</Form.Label>
                    <Form.Control 
                      value={formData.fatherPhone || ''} 
                      onChange={e => setFormData({...formData, fatherPhone: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom de la Mère</Form.Label>
                    <Form.Control 
                      value={formData.motherName || ''} 
                      onChange={e => setFormData({...formData, motherName: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Tél. Mère</Form.Label>
                    <Form.Control 
                      value={formData.motherPhone || ''} 
                      onChange={e => setFormData({...formData, motherPhone: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                </>
              )}

              {/* Role specific: Jury / Supervisor Academic Info */}
              {(formData.role === 'Jury Member' || formData.role === 'Supervisor') && (
                <>
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Informations Académiques (Professionnel)</h6></Col>
                  <Col md={12}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Diplôme Obtenu</Form.Label>
                    <Form.Select 
                      value={isOtherDiploma ? 'Autre' : (formData.diplomaObtained || '')} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'Autre') {
                          setIsOtherDiploma(true);
                          setFormData({...formData, diplomaObtained: ''});
                        } else {
                          setIsOtherDiploma(false);
                          setFormData({...formData, diplomaObtained: val});
                        }
                      }}
                      className="form-control-premium fw-bold mb-2"
                    >
                      <option value="">Sélectionner un diplôme...</option>
                      <option value="Doctorat">Doctorat</option>
                      <option value="Master">Master</option>
                      <option value="Ingénieur d'État">Ingénieur d'État</option>
                      <option value="Licence">Licence</option>
                      <option value="Autre">Autre (Préciser...)</option>
                    </Form.Select>
                    
                    {isOtherDiploma && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Form.Control 
                          value={formData.diplomaObtained || ''} 
                          onChange={e => setFormData({...formData, diplomaObtained: e.target.value})}
                          placeholder="Saisir le nom du diplôme..." 
                          className="form-control-premium fw-bold border-primary border-opacity-25" 
                        />
                      </motion.div>
                    )}
                  </Col>
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Affectations & Niveaux d'Enseignement</h6></Col>
                  <Col md={12} className="mb-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Niveaux Assignés</Form.Label>
                    <div className="d-flex flex-wrap gap-3 p-3 rounded-4 bg-surface-alt border">
                      {['1ère année', '2ème année', '3ème année', '4ème année', '5ème année', 'Doctorat'].map((year) => (
                        <Form.Check 
                          key={year}
                          type="checkbox"
                          id={`year-${year}`}
                          label={<span className="small fw-bold text-navy">{year}</span>}
                          className="custom-checkbox-premium"
                          checked={(formData.section || '').includes(year)}
                          onChange={e => {
                            let currentSections = formData.section || '';
                            if (e.target.checked) {
                              currentSections = currentSections ? `${currentSections}, ${year}` : year;
                            } else {
                              currentSections = currentSections.split(', ').filter(s => s !== year).join(', ');
                            }
                            setFormData({...formData, section: currentSections});
                          }}
                        />
                      ))}
                    </div>
                  </Col>
                  <Col md={12}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Groupes / Sections spécifiques</Form.Label>
                    <Form.Control 
                      value={formData.section || ''} 
                      onChange={e => setFormData({...formData, section: e.target.value})}
                      placeholder="Ex: 5IIR-G1, 4IIR-G2..." 
                      className="form-control-premium fw-bold" 
                    />
                    <Form.Text className="extra-small text-muted fw-bold">Entrez les sections séparées par des virgules.</Form.Text>
                  </Col>
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Année de service</Form.Label>
                    <Form.Control 
                      value={formData.academicYear || '2025/2026'} 
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                </>
              )}

              <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Sécurité</h6></Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Mot de passe</Form.Label>
                <InputGroup>
                  <Form.Control 
                    type="text"
                    value={formData.password || 'Emsi2026!'} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="form-control-premium fw-bold text-primary" 
                  />
                  <InputGroup.Text className="bg-surface-alt border-start-0 text-muted extra-small fw-bold">Admin Only</InputGroup.Text>
                </InputGroup>
              </Col>

              {editingUser && (
                <>
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Sessions Actives</Form.Label>
                    <div className="bg-surface-alt rounded-4 p-3 border border-dashed">
                      {(formData.activeSessions && formData.activeSessions.length > 0) ? (
                        formData.activeSessions.map((session, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center mb-2 last-child-mb-0 pb-2 border-bottom border-white border-opacity-10">
                            <div className="d-flex align-items-center gap-2">
                              <Smartphone size={14} className="text-primary" />
                              <div>
                                <div className="extra-small fw-bold text-navy">{session.device}</div>
                                <div className="extra-small text-muted opacity-75">{session.ip}</div>
                              </div>
                            </div>
                            <Badge bg="success-soft" className="text-success extra-small fw-bold">{session.lastActive}</Badge>
                          </div>
                        ))
                      ) : (
                        <div className="extra-small text-muted text-center py-2">Aucune session active détectée</div>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Historique des modifications</Form.Label>
                    <div className="bg-surface-alt rounded-3 p-3 border border-dashed" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {(formData.history && formData.history.length > 0) ? (
                        formData.history.map((log, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center mb-2 last-child-mb-0 pb-2 border-bottom border-white border-opacity-10">
                            <span className="extra-small fw-bold text-navy">{log.action}</span>
                            <span className="extra-small text-muted">{log.date}</span>
                          </div>
                        ))
                      ) : (
                        <div className="extra-small text-muted text-center py-2">Aucun historique disponible</div>
                      )}
                    </div>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={closeModal}>Annuler</Button>
          <Button className="btn-premium px-4" onClick={handleSave}>{editingUser ? 'Sauvegarder' : 'Créer l\'utilisateur'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
