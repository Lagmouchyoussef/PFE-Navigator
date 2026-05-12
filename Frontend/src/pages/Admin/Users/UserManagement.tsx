import React, { useState } from 'react';
import { 
  Search, Edit2, Trash2, Mail, Shield, 
  Clock, XCircle, UserCheck, UserPlus, Users, 
  MoreHorizontal
} from 'lucide-react';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown, Modal } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  lastLogin: string;
  avatar: string;
}

const INITIAL_USERS: UserData[] = [
  { id: 1, name: 'Marie Dupont', email: 'marie.dupont@email.com', role: 'Admin', status: 'Active', lastLogin: '2 min ago', avatar: 'https://ui-avatars.com/api/?name=Marie+Dupont&background=3b82f6&color=fff' },
  { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', role: 'Jury Member', status: 'Active', lastLogin: '1 hour ago', avatar: 'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=fff' },
  { id: 3, name: 'Sophie Bernard', email: 'sophie.bernard@email.com', role: 'Supervisor', status: 'Pending', lastLogin: 'Never', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=f59e0b&color=fff' },
  { id: 4, name: 'Lucas Petit', email: 'lucas.petit@email.com', role: 'Student', status: 'Active', lastLogin: '3 days ago', avatar: 'https://ui-avatars.com/api/?name=Lucas+Petit&background=3b82f6&color=fff' },
  { id: 5, name: 'Emma Leroy', email: 'emma.leroy@email.com', role: 'Jury Member', status: 'Inactive', lastLogin: '30 days ago', avatar: 'https://ui-avatars.com/api/?name=Emma+Leroy&background=64748b&color=fff' },
];

const UserManagement: React.FC = () => {
  const [users] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => setShowAddModal(true);
  const closeModal = () => setShowAddModal(false);

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
              onClick={openAddModal}
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

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 custom-table-modern">
              <thead>
                <tr>
                  <th className="px-4">Utilisateur</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Dernière connexion</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="rounded-circle border" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <div className="small fw-bold text-navy">{user.name}</div>
                          <div className="extra-small text-muted fw-bold opacity-75">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge className="bg-primary-soft text-primary border border-primary border-opacity-10 extra-small px-2">
                        {user.role}
                      </Badge>
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
                          <Dropdown.Item className="extra-small fw-bold"><Edit2 size={14} className="me-2" /> Modifier</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Mail size={14} className="me-2" /> Message</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Shield size={14} className="me-2" /> Accès</Dropdown.Item>
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
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>1</Button>
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center opacity-50 fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>2</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={closeModal} centered className="users-modal">
        <Modal.Header closeButton className="border-bottom px-4 py-3">
          <Modal.Title className="fw-bold fs-5 text-navy">Ajouter Utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Prénom</Form.Label>
                <Form.Control placeholder="Ex: Jean" className="form-control-premium fw-bold" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Nom</Form.Label>
                <Form.Control placeholder="Ex: Dupont" className="form-control-premium fw-bold" />
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Email Professionnel</Form.Label>
                <Form.Control type="email" placeholder="jean.dupont@email.com" className="form-control-premium fw-bold" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Rôle</Form.Label>
                <Form.Select className="form-control-premium fw-bold">
                  <option>Étudiant</option>
                  <option>Jury Member</option>
                  <option>Supervisor</option>
                  <option>Admin</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Statut Initial</Form.Label>
                <Form.Select className="form-control-premium fw-bold">
                  <option>Actif</option>
                  <option>En attente</option>
                  <option>Inactif</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={closeModal}>Annuler</Button>
          <Button className="btn-premium px-4">Créer l'utilisateur</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
