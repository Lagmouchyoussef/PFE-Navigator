import React, { useState, useRef } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  Edit2, Trash2, Mail, Shield, 
  CheckCircle2, Clock, XCircle, UserCheck, UserPlus, Users, X, Camera,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Card, Table, Button, InputGroup, Form, Badge, Dropdown, Modal } from 'react-bootstrap';

const INITIAL_USERS = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=Marie+Dupont&background=3b82f6&color=fff' },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Jury Member', status: 'Active', lastLogin: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=fff' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'Supervisor', status: 'Pending', lastLogin: 'Never', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=f59e0b&color=fff' },
  { id: 4, name: 'Lucas Petit', email: 'lucas.petit@email.com', role: 'Student', status: 'Active', lastLogin: '3 days ago', avatar: 'https://ui-avatars.com/api/?name=Lucas+Petit&background=3b82f6&color=fff' },
  { id: 5, name: 'Emma Leroy', email: 'emma.leroy@email.com', role: 'Jury Member', status: 'Inactive', lastLogin: '30 days ago', avatar: 'https://ui-avatars.com/api/?name=Emma+Leroy&background=64748b&color=fff' },
];

const UserManagement = () => {
  const fileInputRef = useRef(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', role: 'Student', status: 'Active'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ firstName: '', lastName: '', email: '', role: 'Student', status: 'Active' });
    setShowAddModal(true);
  };

  const closeModal = () => setShowAddModal(false);

  return (
    <div className="users-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Gestion des Utilisateurs</h2>
            <p className="text-muted small mb-0">Contrôlez les accès et les rôles de tous les membres du portail.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Users size={18} /> Exporter
            </Button>
            <Button 
              className="fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2 rounded-pill"
              style={{ backgroundColor: '#2563eb' }}
              onClick={openAddModal}
            >
              <UserPlus size={18} /> Ajouter un utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Utilisateurs', count: users.length, icon: <Users />, color: 'primary' },
            { label: 'Actifs', count: users.filter(u => u.status === 'Active').length, icon: <UserCheck />, color: 'success' },
            { label: 'En attente', count: users.filter(u => u.status === 'Pending').length, icon: <Clock />, color: 'warning' },
            { label: 'Désactivés', count: users.filter(u => u.status === 'Inactive').length, icon: <XCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} md={3}>
              <div className={`users-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                  <div>
                    <div className="extra-small fw-bold text-muted text-uppercase">{stat.label}</div>
                    <h4 className="fw-bold mb-0">{stat.count}</h4>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Search & Filters */}
        <div className="users-glass-card p-4 rounded-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher un nom, email..." 
                  className="bg-transparent border-0 shadow-none py-2 text-primary-custom"
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

        {/* Users Table */}
        <div className="users-glass-card rounded-4 overflow-hidden shadow-sm">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 users-table">
              <thead>
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Utilisateur</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Rôle</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Dernière Connexion</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="rounded-circle border" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <div className="small fw-bold">{user.name}</div>
                          <div className="extra-small text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className={`dot ${user.status === 'Active' ? 'bg-success' : 'bg-warning'}`} style={{ width: '8px', height: '8px', borderRadius: '50%' }}></div>
                        <span className="extra-small fw-bold">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-3 small text-muted">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="text-muted p-0 no-caret shadow-none border-0">
                          <MoreHorizontal size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                          <Dropdown.Item className="extra-small fw-bold"><Edit2 size={14} className="me-2" /> Modifier</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Mail size={14} className="me-2" /> Envoyer un message</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Shield size={14} className="me-2" /> Gérer les accès</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="extra-small fw-bold text-danger"><Trash2 size={14} className="me-2" /> Supprimer</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="p-4 border-top d-flex justify-content-between align-items-center bg-surface-alt">
            <span className="extra-small text-muted fw-bold">Affichage de {filteredUsers.length} sur {users.length} utilisateurs</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>1</Button>
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center opacity-50" style={{ width: '32px', height: '32px' }}>2</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={closeModal} centered className="users-modal">
        <Modal.Header closeButton className="border-bottom px-4 py-3">
          <Modal.Title className="fw-bold fs-5">Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Prénom</Form.Label>
                <Form.Control placeholder="Ex: Jean" className="settings-input" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Nom</Form.Label>
                <Form.Control placeholder="Ex: Dupont" className="settings-input" />
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Email</Form.Label>
                <Form.Control type="email" placeholder="jean.dupont@email.com" className="settings-input" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Rôle</Form.Label>
                <Form.Select className="settings-input">
                  <option>Student</option>
                  <option>Jury Member</option>
                  <option>Supervisor</option>
                  <option>Admin</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Statut Initial</Form.Label>
                <Form.Select className="settings-input">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={closeModal}>Annuler</Button>
          <Button variant="primary" className="fw-bold px-4 rounded-pill border-0 shadow-sm" style={{ backgroundColor: '#2563eb' }}>Créer l'utilisateur</Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .users-modern-layout {
          color: var(--text-primary);
        }
        .users-glass-card {
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
          border-radius: 10px;
          padding: 0.6rem 1rem;
          font-size: 0.875rem;
        }
        .users-table thead th {
          color: var(--text-secondary);
        }
        .users-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        
        h2, h4, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .users-modal .modal-content {
          background-color: var(--surface);
          color: var(--text-primary);
          border: 1px solid var(--border);
          border-radius: 1rem;
        }
        .users-modal .modal-header, .users-modal .modal-footer {
          border-color: var(--border) !important;
        }
        .users-modal .btn-close {
          filter: var(--theme-filter, invert(1));
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
