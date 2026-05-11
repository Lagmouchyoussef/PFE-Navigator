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

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "utilisateurs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
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
    <div className="users-simple-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Gestion des Utilisateurs</h2>
            <p className="text-muted small mb-0">Contrôlez les accès et les rôles de tous les membres du portail.</p>
          </div>
          <Button 
            className="fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: '#2563eb' }}
            onClick={openAddModal}
          >
            <UserPlus size={18} /> Ajouter un utilisateur
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Utilisateurs', count: users.length, icon: <Users />, color: 'blue-custom' },
            { label: 'Actifs', count: users.filter(u => u.status === 'Active').length, icon: <UserCheck />, color: 'purple-custom' },
            { label: 'En attente', count: users.filter(u => u.status === 'Pending').length, icon: <Clock />, color: 'indigo-custom' },
            { label: 'Désactivés', count: users.filter(u => u.status === 'Inactive').length, icon: <XCircle />, color: 'rose-custom' },
          ].map((stat, i) => (
            <Col key={i} md={3}>
              <Card className={`border shadow-sm rounded-3 p-3 bg-white border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-2 rounded-2 bg-light text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                  <div>
                    <div className="extra-small fw-bold text-muted text-uppercase">{stat.label}</div>
                    <h5 className="fw-bold mb-0 text-dark">{stat.count}</h5>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table Card */}
        <Card className="border shadow-sm rounded-3 overflow-hidden bg-white mb-5">
          <div className="p-4 border-bottom bg-white">
            <Row className="g-3">
              <Col md={6}>
                <InputGroup className="bg-light rounded-2 border-0 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0"><Search size={16} className="text-muted"/></InputGroup.Text>
                  <Form.Control 
                    placeholder="Rechercher un utilisateur..." 
                    className="bg-transparent border-0 shadow-none extra-small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} className="text-md-end">
                <Button variant="outline-secondary" className="extra-small fw-bold px-3 py-2 bg-white border me-2" onClick={handleExport}>
                  <Download size={14} className="me-2" /> Exporter
                </Button>
                <Button variant="outline-secondary" className="extra-small fw-bold px-3 py-2 bg-white border" onClick={() => setShowFilterModal(true)}>
                  <Filter size={14} className="me-2" /> Filtrer
                </Button>
              </Col>
            </Row>
          </div>

          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 extra-small text-muted text-uppercase fw-bold border-0">Utilisateur</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Rôle</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Statut</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Dernière activité</th>
                  <th className="py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="align-middle border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src={user.avatar} className="rounded-circle" style={{ width: '36px', height: '36px' }} alt={user.name} />
                        <div>
                          <div className="fw-bold small text-dark">{user.name}</div>
                          <div className="extra-small text-muted">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="light" className="text-muted border fw-bold extra-small text-uppercase px-2 py-1">{user.role}</Badge>
                    </td>
                    <td>
                      <Badge className={`badge-${user.status.toLowerCase()}-simple extra-small px-2 py-1`}>{user.status}</Badge>
                    </td>
                    <td className="extra-small text-muted">{user.lastLogin}</td>
                    <td className="text-end pe-4">
                      <Button 
                        variant="light" 
                        size="sm" 
                        className="rounded-2"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDetailsModal(true);
                        }}
                      >
                        <MoreHorizontal size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* Modal is kept simple but with the same theme */}
      <Modal show={showAddModal} onHide={closeModal} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Nouvel Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form className="d-flex flex-column gap-3">
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted">Prénom</Form.Label>
                  <Form.Control className="bg-light border-0 small py-2" placeholder="Ex: Ahmed" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="extra-small fw-bold text-muted">Nom</Form.Label>
                  <Form.Control className="bg-light border-0 small py-2" placeholder="Ex: Benali" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="extra-small fw-bold text-muted">Email</Form.Label>
              <Form.Control className="bg-light border-0 small py-2" placeholder="email@emsi.ma" />
            </Form.Group>
            <Form.Group>
              <Form.Label className="extra-small fw-bold text-muted">Rôle</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Student</option>
                <option>Supervisor</option>
                <option>Jury Member</option>
                <option>Admin</option>
              </Form.Select>
            </Form.Group>
            <Button className="fw-bold py-2 mt-3 border-0" style={{ backgroundColor: '#2563eb' }}>
              Créer le compte
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* USER DETAILS MODAL */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Fiche Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedUser && (
            <div className="text-center">
              <img src={selectedUser.avatar} className="rounded-circle mb-3 border border-3 border-primary" style={{ width: '80px', height: '80px' }} alt="" />
              <h5 className="fw-bold text-dark mb-1">{selectedUser.name}</h5>
              <p className="text-muted small mb-3">{selectedUser.email}</p>
              
              <div className="row g-3 text-start mt-2">
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Rôle</div>
                  <Badge bg="light" className="text-primary border fw-bold small">{selectedUser.role}</Badge>
                </div>
                <div className="col-6">
                  <div className="extra-small text-muted fw-bold text-uppercase">Statut</div>
                  <Badge className={`badge-${selectedUser.status.toLowerCase()}-simple small`}>{selectedUser.status}</Badge>
                </div>
                <div className="col-12">
                  <div className="extra-small text-muted fw-bold text-uppercase">Dernière Connexion</div>
                  <div className="small fw-bold">{selectedUser.lastLogin}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex gap-2">
                <Button variant="outline-primary" className="flex-grow-1 fw-bold extra-small">Contacter</Button>
                <Button className="flex-grow-1 fw-bold extra-small border-0" style={{ backgroundColor: '#2563eb' }}>Modifier le profil</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* FILTER MODAL */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold small">Filtrer les Utilisateurs</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Rôle</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Tous les rôles</option>
                <option>Student</option>
                <option>Supervisor</option>
                <option>Jury Member</option>
                <option>Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="extra-small fw-bold text-muted">Statut</Form.Label>
              <Form.Select className="bg-light border-0 small py-2">
                <option>Tous les statuts</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </Form.Select>
            </Form.Group>
            <Button className="w-100 mt-3 fw-bold border-0" style={{ backgroundColor: '#2563eb' }} onClick={() => setShowFilterModal(false)}>
              Appliquer les filtres
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <style>{`
        .users-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .border-start-4 {
          border-left: 4px solid #dee2e6 !important;
        }
        .border-blue-custom { border-left-color: #3b82f6 !important; }
        .border-purple-custom { border-left-color: #8b5cf6 !important; }
        .border-indigo-custom { border-left-color: #6366f1 !important; }
        .border-rose-custom { border-left-color: #f43f5e !important; }

        .text-blue-custom { color: #3b82f6 !important; }
        .text-purple-custom { color: #8b5cf6 !important; }
        .text-indigo-custom { color: #6366f1 !important; }
        .text-rose-custom { color: #f43f5e !important; }

        .badge-active-simple { background-color: #dcfce7 !important; color: #166534 !important; }
        .badge-pending-simple { background-color: #fef9c3 !important; color: #854d0e !important; }
        .badge-inactive-simple { background-color: #fee2e2 !important; color: #991b1b !important; }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
      `}</style>
    </div>
  );
};

export default UserManagement;
