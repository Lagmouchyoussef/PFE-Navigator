import React, { useState, useRef } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  Edit2, Trash2, Mail, Shield, 
  CheckCircle2, Clock, XCircle, UserCheck, UserPlus, Users, X, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Table, Button, InputGroup, Form, Badge, Dropdown, Modal } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';

const INITIAL_USERS = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=Marie+Dupont&background=3498db&color=fff' },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Jury Member', status: 'Active', lastLogin: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=fff' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'Supervisor', status: 'Pending', lastLogin: 'Never', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=f59e0b&color=fff' },
  { id: 4, name: 'Lucas Petit', email: 'lucas.petit@email.com', role: 'Student', status: 'Active', lastLogin: '3 days ago', avatar: 'https://ui-avatars.com/api/?name=Lucas+Petit&background=ef4444&color=fff' },
  { id: 5, name: 'Emma Leroy', email: 'emma.leroy@email.com', role: 'Jury Member', status: 'Inactive', lastLogin: '30 days ago', avatar: 'https://ui-avatars.com/api/?name=Emma+Leroy&background=8b5cf6&color=fff' },
];

const UserManagement = () => {
  const { theme } = useApp();
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', role: 'Student', status: 'Active',
    studentId: '', cin: '', phone: '', group: '', avatarPreview: null
  });

  // --- Photo Upload Logic ---
  const handlePhotoClick = () => fileInputRef.current.click();
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarPreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Selection Logic ---
  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const toggleSelectUser = (id) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };

  // --- User Management Logic ---
  const handleSaveUser = (e) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    
    if (isEditMode && currentUser) {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? {
        ...u,
        ...formData,
        name: fullName,
        avatar: formData.avatarPreview || u.avatar
      } : u));
    } else {
      const id = users.length + 1;
      const userToAdd = {
        ...formData,
        id,
        name: fullName,
        lastLogin: 'Never',
        avatar: formData.avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff`
      };
      setUsers([userToAdd, ...users]);
    }
    
    closeModal();
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentUser(null);
    setFormData({ 
      firstName: '', lastName: '', email: '', role: 'Student', status: 'Active',
      studentId: '', cin: '', phone: '', group: '', avatarPreview: null
    });
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setCurrentUser(user);
    const names = user.name.split(' ');
    setFormData({
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      email: user.email || '',
      role: user.role || 'Student',
      status: user.status || 'Active',
      studentId: user.studentId || '',
      cin: user.cin || '',
      phone: user.phone || '',
      group: user.group || '',
      avatarPreview: user.avatar || null
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setIsEditMode(false);
    setCurrentUser(null);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setSelectedUsers(prev => prev.filter(uid => uid !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="admin-users-page transition-all">
      <Container fluid className="p-4">
        {/* Page Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Gestion des Utilisateurs</h4>
            <p className="extra-small text-muted mb-0">Contrôlez les accès, les rôles et l'état des comptes utilisateurs</p>
          </div>
          <Button 
            variant="primary" 
            className="theme-btn-primary d-flex align-items-center gap-2 px-4 py-2 rounded-3 border-0"
            onClick={openAddModal}
          >
            <UserPlus size={18} />
            <span className="fw-bold small">Ajouter un Utilisateur</span>
          </Button>
        </div>

        {/* Stats Summary Area */}
        <Row className="mb-4 g-3">
          {[
            { label: 'Utilisateurs Totaux', count: users.length, icon: <Users />, color: 'primary' },
            { label: 'Comptes Actifs', count: users.filter(u => u.status === 'Active').length, icon: <UserCheck />, color: 'success' },
            { label: 'En Attente', count: users.filter(u => u.status === 'Pending').length, icon: <Clock />, color: 'warning' },
            { label: 'Désactivés', count: users.filter(u => u.status === 'Inactive').length, icon: <XCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <Card className="theme-card border-0 shadow-sm p-3 hover-shadow transition-all">
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-2 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                  <div>
                    <div className="text-muted extra-small fw-bold text-uppercase">{stat.label}</div>
                    <h5 className="fw-bold mb-0">{stat.count}</h5>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table Card */}
        <Card className="theme-card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="p-4 border-bottom border-light border-opacity-10">
            <Row className="align-items-center g-3">
              <Col md={6}>
                <InputGroup className="theme-bg-light rounded-pill px-2 border overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 text-theme opacity-75">
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Rechercher par nom, email ou rôle..." 
                    className="bg-transparent border-0 shadow-none extra-small text-theme placeholder-theme py-2"
                  />
                </InputGroup>
              </Col>
              <Col md={6}>
                <div className="d-flex justify-content-md-end gap-2">
                  {selectedUsers.length > 0 && (
                    <Button variant="danger" className="px-3 rounded-pill extra-small fw-bold d-flex align-items-center gap-2" onClick={() => { setUserToDelete({ id: 'multiple', name: `${selectedUsers.length} utilisateurs` }); setShowDeleteModal(true); }}>
                      <Trash2 size={14} /> Supprimer ({selectedUsers.length})
                    </Button>
                  )}
                  <Button variant="outline-secondary" className="theme-btn-secondary px-3 rounded-pill extra-small fw-bold d-flex align-items-center gap-2">
                    <Filter size={14} /> Filtrer
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <div className="table-responsive">
            <Table hover className="theme-table mb-0 align-middle">
              <thead>
                <tr>
                  <th className="ps-4 py-3">
                    <Form.Check 
                      type="checkbox" 
                      className="shadow-none" 
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3">Utilisateur</th>
                  <th className="py-3">Rôle</th>
                  <th className="py-3">Statut</th>
                  <th className="py-3">Activité</th>
                  <th className="py-3 text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`transition-all ${selectedUsers.includes(user.id) ? 'bg-primary bg-opacity-5' : ''}`}>
                    <td className="ps-4">
                      <Form.Check 
                        type="checkbox" 
                        className="shadow-none" 
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleSelectUser(user.id)}
                      />
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img 
                          src={user.avatar} 
                          className="rounded-circle border border-2 border-primary border-opacity-25" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          alt={user.name} 
                        />
                        <div>
                          <div className="fw-bold small">{user.name}</div>
                          <div className="extra-small text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <Shield size={14} className="text-primary opacity-75" />
                        <span className="extra-small fw-bold text-uppercase tracking-wider">{user.role}</span>
                      </div>
                    </td>
                    <td>
                      <Badge 
                        bg={user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'danger'} 
                        className="bg-opacity-10 text-capitalize py-2 px-3 rounded-pill"
                        style={{ color: 'inherit', fontSize: '10px' }}
                      >
                        <span className={`d-inline-block rounded-circle me-1 bg-${user.status === 'Active' ? 'success' : user.status === 'Pending' ? 'warning' : 'danger'}`} style={{ width: '6px', height: '6px' }}></span>
                        {user.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="extra-small text-muted fw-bold">{user.lastLogin}</div>
                    </td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="link" className="p-2 text-muted hover-text-primary transition-all border-0 shadow-none" onClick={() => openEditModal(user)}>
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="link" className="p-2 text-muted hover-text-danger transition-all border-0 shadow-none" onClick={() => openDeleteModal(user)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div className="p-4 border-t border-light border-opacity-10 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3">
            <div className="extra-small text-muted fw-bold text-uppercase tracking-widest">
              Affichage de {users.length} sur 1,248 utilisateurs
            </div>
            <div className="d-flex gap-1">
              <Button variant="outline-secondary" className="theme-btn-secondary px-3 py-1 extra-small rounded-pill">Précédent</Button>
              <Button variant="primary" className="theme-btn-primary px-3 py-1 extra-small rounded-pill border-0">1</Button>
              <Button variant="outline-secondary" className="theme-btn-secondary px-3 py-1 extra-small rounded-pill">2</Button>
              <Button variant="outline-secondary" className="theme-btn-secondary px-3 py-1 extra-small rounded-pill">3</Button>
              <Button variant="outline-secondary" className="theme-btn-secondary px-3 py-1 extra-small rounded-pill">Suivant</Button>
            </div>
          </div>
        </Card>
      </Container>

      {/* Add/Edit User Modal */}
      <Modal show={showAddModal} onHide={closeModal} centered size="lg" className="theme-modal">
        <Modal.Header className="border-light border-opacity-10 bg-surface text-theme px-4 py-3">
          <Modal.Title className="h6 fw-bold mb-0">
            {isEditMode ? 'Modifier l\'Utilisateur' : 'Ajouter un Nouvel Utilisateur'}
          </Modal.Title>
          <Button variant="link" className="p-0 text-muted shadow-none border-0 ms-auto" onClick={closeModal}>
            <X size={20} />
          </Button>
        </Modal.Header>
        <Modal.Body className="bg-surface text-theme p-4">
          <Form onSubmit={handleSaveUser}>
            {/* Photo Upload Section */}
            <div className="d-flex flex-column align-items-center mb-4">
              <div 
                className="position-relative cursor-pointer hover-shadow transition-all"
                onClick={handlePhotoClick}
                style={{ width: '100px', height: '100px' }}
              >
                {formData.avatarPreview ? (
                  <img 
                    src={formData.avatarPreview} 
                    className="rounded-circle border border-3 border-primary" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt="Preview"
                  />
                ) : (
                  <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center border border-2 border-dashed border-primary" style={{ width: '100%', height: '100%' }}>
                    <Users size={40} className="text-primary opacity-50" />
                  </div>
                )}
                <div className="position-absolute bottom-0 end-0 bg-primary p-2 rounded-circle shadow-sm border border-2 border-white">
                  <Camera size={14} className="text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="d-none" 
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <div className="extra-small text-muted fw-bold mt-2 text-uppercase">Photo de Profil</div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Prénom</Form.Label>
                  <Form.Control 
                    required 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="Ex: Ahmed"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom</Form.Label>
                  <Form.Control 
                    required 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="Ex: Benali"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Email Institutionnel</Form.Label>
                  <Form.Control 
                    required 
                    type="email" 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="nom.prenom@emsi.ma"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">ID Utilisateur</Form.Label>
                  <Form.Control 
                    required
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder={formData.role === 'Student' ? 'ETU-2024-001' : formData.role === 'Admin' ? 'ADM-2024-001' : 'USR-2024-001'}
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Rôle Platforme</Form.Label>
                  <Form.Select 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none cursor-pointer"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option>Student</option>
                    <option>Supervisor</option>
                    <option>Jury Member</option>
                    <option>Admin</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Statut Initial</Form.Label>
                  <Form.Select 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Active</option>
                    <option>Pending</option>
                    <option>Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">CIN</Form.Label>
                  <Form.Control 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="BE123456"
                    value={formData.cin}
                    onChange={(e) => setFormData({...formData, cin: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Groupe / Département</Form.Label>
                  <Form.Control 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="Ex: G1-A or Info-Dept"
                    value={formData.group}
                    onChange={(e) => setFormData({...formData, group: e.target.value})}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">Téléphone</Form.Label>
                  <Form.Control 
                    className="theme-bg-light border text-theme rounded-3 py-2 shadow-none" 
                    placeholder="+212 600-000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="mt-4 pt-3 border-top border-light border-opacity-10 d-flex justify-content-end gap-2">
              <Button variant="link" className="text-muted text-decoration-none extra-small fw-bold" onClick={closeModal}>
                Annuler
              </Button>
              <Button type="submit" variant="primary" className="theme-btn-primary px-4 py-2 rounded-3 border-0 small fw-bold">
                {isEditMode ? 'Enregistrer les modifications' : 'Créer le Compte'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal (Carte) */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="theme-modal">
        <Modal.Body className="bg-surface text-theme p-4 text-center">
          <div className="mb-3 p-3 rounded-circle bg-danger bg-opacity-10 text-danger d-inline-block">
            <Trash2 size={32} />
          </div>
          <h5 className="fw-bold mb-2">Confirmer la suppression</h5>
          <p className="text-muted small mb-4">
            Êtes-vous sûr de vouloir supprimer <strong>{userToDelete?.name}</strong> ? Cette action est irréversible.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="link" className="text-muted text-decoration-none small fw-bold px-4" onClick={() => setShowDeleteModal(false)}>
              Annuler
            </Button>
            <Button variant="danger" className="px-4 py-2 rounded-3 shadow-sm border-0 small fw-bold" onClick={confirmDelete}>
              Oui, Supprimer
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .admin-users-page {
          background-color: var(--background);
          min-height: calc(100vh - 80px);
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
        }
        .theme-card {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
        }
        .theme-bg-light {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border: 1px solid var(--border) !important;
          transition: all 0.2s ease;
        }
        .theme-bg-light:focus-within {
          background-color: rgba(255, 255, 255, 0.08) !important;
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
        }
        .theme-btn-primary {
          background-color: var(--primary) !important;
          color: white !important;
          transition: all 0.2s ease;
        }
        .theme-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3) !important;
        }
        .theme-btn-secondary {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border) !important;
          transition: all 0.2s ease;
        }
        .theme-btn-secondary:hover {
          background-color: var(--border) !important;
        }
        .theme-table th {
          background-color: var(--surface) !important;
          color: var(--text-secondary) !important;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border) !important;
        }
        .theme-table td {
          color: var(--text-primary) !important;
          border-bottom-color: var(--border) !important;
          font-size: 0.85rem;
        }
        .text-theme { color: var(--text-primary) !important; }
        .placeholder-theme::placeholder { color: var(--text-secondary) !important; opacity: 0.6; }
        .extra-small { font-size: 0.75rem; }
        .hover-shadow:hover { 
          transform: translateY(-4px); 
          box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
        }
        .hover-text-primary:hover { color: var(--primary) !important; }
        .hover-text-danger:hover { color: #ef4444 !important; }
        .cursor-pointer { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default UserManagement;
