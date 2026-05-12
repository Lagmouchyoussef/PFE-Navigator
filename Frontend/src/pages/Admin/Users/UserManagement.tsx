import React, { useState } from 'react';
import { 
  Search, MoreVertical, 
  Edit2, Trash2, Mail, Shield, 
  Clock, XCircle, UserCheck, UserPlus, Users, 
  MoreHorizontal
} from 'lucide-react';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown, Modal } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
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
  const { theme } = useApp();
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', role: 'Student', status: 'Active'
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
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
            <h2 className="fw-bold mb-1 text-gradient">User Management</h2>
            <p className="text-muted small mb-0">Control access and roles for all portal members.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Users size={18} /> Export
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={openAddModal}
            >
              <UserPlus size={18} /> Add User
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} sm={6}>
            <StatCard label="Total Users" value={users.length.toString()} color="primary" icon={<Users />} trend="Overall" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Active" value={users.filter(u => u.status === 'Active').length.toString()} color="success" icon={<UserCheck />} trend="Verified" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Pending" value={users.filter(u => u.status === 'Pending').length.toString()} color="warning" icon={<Clock />} trend="Waiting" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Inactive" value={users.filter(u => u.status === 'Inactive').length.toString()} color="danger" icon={<XCircle />} trend="Blocked" />
          </Col>
        </Row>

        {/* Search & Filters */}
        <div className="glass-card p-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search name, email, role..." 
                  className="bg-transparent border-0 shadow-none py-2 text-primary-custom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">All Roles</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Status: Active</Button>
                <Button variant="link" className="text-muted extra-small fw-bold text-decoration-none">Reset</Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-surface-alt">
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">User</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Role</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Last Login</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="rounded-circle border shadow-sm" style={{ width: '40px', height: '40px' }} />
                        <div>
                          <div className="small fw-bold text-navy">{user.name}</div>
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
                        <span className="extra-small fw-bold text-navy">{user.status}</span>
                      </div>
                    </td>
                    <td className="py-3 small text-muted">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="text-muted p-0 no-caret shadow-none border-0">
                          <MoreHorizontal size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                          <Dropdown.Item className="extra-small fw-bold"><Edit2 size={14} className="me-2" /> Edit</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Mail size={14} className="me-2" /> Send Message</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Shield size={14} className="me-2" /> Manage Access</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="extra-small fw-bold text-danger"><Trash2 size={14} className="me-2" /> Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="p-4 border-top d-flex justify-content-between align-items-center bg-surface-alt">
            <span className="extra-small text-muted fw-bold">Showing {filteredUsers.length} of {users.length} users</span>
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
          <Modal.Title className="fw-bold fs-5 text-navy">Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">First Name</Form.Label>
                <Form.Control placeholder="Ex: Jean" className="form-control-premium" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Last Name</Form.Label>
                <Form.Control placeholder="Ex: Dupont" className="form-control-premium" />
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Email</Form.Label>
                <Form.Control type="email" placeholder="jean.dupont@email.com" className="form-control-premium" />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Role</Form.Label>
                <Form.Select className="form-control-premium">
                  <option>Student</option>
                  <option>Jury Member</option>
                  <option>Supervisor</option>
                  <option>Admin</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted uppercase">Initial Status</Form.Label>
                <Form.Select className="form-control-premium">
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Inactive</option>
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={closeModal}>Cancel</Button>
          <Button className="btn-premium">Create User</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
