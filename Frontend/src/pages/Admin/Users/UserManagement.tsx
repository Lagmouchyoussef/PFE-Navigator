import React, { useState } from 'react';
import { 
  Search, Edit2, Trash2, Mail, Shield, 
  Clock, XCircle, UserCheck, UserPlus, Users, 
  MoreHorizontal, Camera, AlertCircle, CheckCircle, Smartphone, Eye, EyeOff,
  LayoutDashboard, FileText, Award, Calendar, Settings, Briefcase, UserCheck as UserIcon,
  FileSpreadsheet, File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown, Modal, Tabs, Tab } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';

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

const INITIAL_USERS: UserData[] = [];

const UserManagement: React.FC = () => {
  const { allUsers: users, createUser, updateUser, deleteUser, sendMessage: globalSendMessage } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const [isOtherDiploma, setIsOtherDiploma] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageRecipient, setMessageRecipient] = useState<UserData | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessUser, setAccessUser] = useState<UserData | null>(null);
  const [accessPermissions, setAccessPermissions] = useState<Record<string, boolean>>({});
  const [accessSaved, setAccessSaved] = useState(false);
  const [filterRole, setFilterRole] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const handleExport = (format: 'pdf' | 'csv' | 'word') => {
    const exportData = selectedUsers.length > 0
      ? users.filter(u => selectedUsers.includes(u.id))
      : users;

    if (exportData.length === 0) return;

    const headers = ["Institutional ID", "Name", "Email", "Role", "Status"];
    const rows = exportData.map(u => [u.institutionalId || '-', u.name, u.email, u.role, u.status || 'Active']);

    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].map(r => r.join(",")).join("\n");
      const link = document.createElement("a");
      link.href = encodeURI(csvContent);
      link.download = `users_export_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const tableRows = rows.map(r => `<tr>${r.map(c => `<td style="padding:8px 12px;border:1px solid #e2e8f0;">${c}</td>`).join('')}</tr>`).join('');
    const html = `<!DOCTYPE html><html><head><title>Users Export</title>
      <style>body{font-family:Arial,sans-serif;padding:40px;}table{border-collapse:collapse;width:100%;}th{background:#0f172a;color:white;padding:10px 12px;text-align:left;}</style>
      </head><body>
      <h1 style="color:#0f172a;">User Management Export</h1>
      <p style="color:#64748b;">Generated on ${new Date().toLocaleString()} — ${exportData.length} user(s)</p>
      <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${tableRows}</tbody></table>
      </body></html>`;

    if (format === 'pdf') {
      const win = window.open('', '_blank');
      if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500); }
      return;
    }

    if (format === 'word') {
      const blob = new Blob(['﻿', html], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${Date.now()}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const toggleSelectAll = (role: string) => {
    const roleUsers = filteredUsers.filter(u => u.role === role).map(u => u.id);
    const allSelected = roleUsers.length > 0 && roleUsers.every(id => selectedUsers.includes(id));
    
    if (allSelected) {
      setSelectedUsers(selectedUsers.filter(id => !roleUsers.includes(id)));
    } else {
      setSelectedUsers([...new Set([...selectedUsers, ...roleUsers])]);
    }
  };

  const toggleSelectUser = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const handleOpenModal = (user?: UserData) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
      const standardDiplomas = ['PhD', 'Master', "State Engineer", 'Bachelor'];
      setIsOtherDiploma(user.diplomaObtained ? !standardDiplomas.includes(user.diplomaObtained) : false);
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', role: 'Student', status: 'Active' });
      setIsOtherDiploma(false);
    }
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  const handleProcessReport = (userId: number) => {
    updateUser(userId, { confirmationStatus: 'None', reportDetails: null });
  };

  const handleApplyPhoto = (userId: number, photo: string) => {
    updateUser(userId, { 
      avatar: photo, 
      confirmationStatus: 'None', 
      reportDetails: null 
    });
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

  const handleSave = async () => {
    const now = new Date().toLocaleString();
    if (editingUser) {
      const newHistory = [...(editingUser.history || []), { action: 'Profile modification by Admin', date: now }];
      await updateUser(editingUser.id, { ...formData, history: newHistory });
    } else {
      const role = formData.role || 'Student';
      const userData = {
        institutionalId: generateInstitutionalId(role),
        name: formData.name || '',
        email: formData.email || '',
        password: formData.password || 'Emsi2026!',
        role: role,
        status: (formData.status as any) || 'Active',
        lastLogin: 'Never',
        avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || '')}&background=3b82f6&color=fff`,
        history: [{ action: 'Account creation', date: now }],
        confirmationStatus: 'None'
      };
      await createUser(userData);
    }
    closeModal();
  };

  const handleDelete = (user: UserData) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleMessage = (user: UserData) => {
    setMessageRecipient(user);
    setMessageContent('');
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (messageRecipient && messageContent.trim()) {
      // Send to global context to make it "arrive" for the user
      globalSendMessage(messageContent, 'admin');
      
      alert(`Message sent successfully to ${messageRecipient.name}. They will receive it in their messaging interface.`);
      setShowMessageModal(false);
      setMessageRecipient(null);
      setMessageContent('');
    } else {
      alert("Please enter a message before sending.");
    }
  };

  const handleAccess = (user: UserData) => {
    setAccessUser(user);
    setAccessSaved(false);
    // Initialize all permissions to true (enabled by default)
    const perms: Record<string, boolean> = {};
    ['dash','docs','eval','plan','sett','j-dash','j-proj','j-prog','j-sett','s-dash','s-stu','s-eval','s-rdv','s-sett','a-dash','a-user','a-plan','a-sett'].forEach(id => { perms[id] = true; });
    setAccessPermissions(perms);
    setShowAccessModal(true);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole ? u.role === filterRole : true;
    const matchesStatus = filterStatus ? u.status === filterStatus : true;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="users-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">User Management</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Control access and roles for all portal members.</p>
          </div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className={`fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 no-caret shadow-none ${selectedUsers.length === 0 ? 'opacity-50' : ''}`}
              >
                <Users size={18} /> Export ({selectedUsers.length})
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-lg rounded-4 overflow-hidden mt-2 p-1">
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleExport('pdf')}>
                  <div className="p-1 rounded bg-danger-soft text-danger"><FileText size={14} /></div> Export to PDF
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleExport('word')}>
                  <div className="p-1 rounded bg-primary-soft text-primary"><File size={14} /></div> Export to Word
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleExport('csv')}>
                  <div className="p-1 rounded bg-success-soft text-success"><FileSpreadsheet size={14} /></div> Export to CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => handleOpenModal()}
            >
              <UserPlus size={18} /> Add User
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} sm={6}>
            <StatCard label="Total Users" value={users.length.toString()} color="primary" icon={<Users />} trend="Global" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Active" value={users.filter(u => u.status === 'Active').length.toString()} color="success" icon={<UserCheck />} trend="Verified" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Pending" value={users.filter(u => u.status === 'Pending').length.toString()} color="warning" icon={<Clock />} trend="Registrations" />
          </Col>
          <Col lg={3} sm={6}>
            <StatCard label="Inactive" value={users.filter(u => u.status === 'Inactive').length.toString()} color="danger" icon={<XCircle />} trend="Blocked" />
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
                  placeholder="Search name, email, role..." 
                  className="bg-transparent border-0 shadow-none py-2 text-navy fw-bold small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button 
                  variant={filterRole ? "primary" : "outline-secondary"} 
                  className="rounded-pill border extra-small fw-bold px-4"
                  onClick={() => setFilterRole(filterRole ? null : 'Student')}
                >
                  {filterRole || 'All roles'}
                </Button>
                <Button 
                  variant={filterStatus ? "success" : "outline-secondary"} 
                  className="rounded-pill border extra-small fw-bold px-4"
                  onClick={() => setFilterStatus(filterStatus ? null : 'Active')}
                >
                  {filterStatus ? `Status: ${filterStatus}` : 'All statuses'}
                </Button>
                <Button 
                  variant="link" 
                  className="text-muted extra-small fw-bold text-decoration-none"
                  onClick={() => { setFilterRole(null); setFilterStatus(null); setSearchTerm(''); }}
                >
                  Reset
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Users Tables by Role */}
        <div className="glass-card p-0">
          <Tabs
            defaultActiveKey="Student"
            id="user-management-tabs"
            className="custom-tabs-premium px-4 pt-3 border-bottom-0"
          >
            {[
              { key: 'Student', label: 'Students', icon: <Users size={16} /> },
              { key: 'Supervisor', label: 'Supervisors', icon: <UserCheck size={16} /> },
              { key: 'Jury Member', label: 'Jury Members', icon: <Shield size={16} /> },
              { key: 'Admin', label: 'Administrators', icon: <Shield size={16} className="text-danger" /> },
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
                <div className="table-responsive" style={{ overflow: 'visible' }}>
                  <Table borderless hover className="align-middle mb-0 custom-table-modern">
                    <thead>
                      <tr>
                        <th className="px-4" style={{ width: '40px' }}>
                          <Form.Check 
                            type="checkbox"
                            className="custom-checkbox-premium"
                            checked={filteredUsers.filter(u => u.role === tab.key).length > 0 && filteredUsers.filter(u => u.role === tab.key).every(u => selectedUsers.includes(u.id))}
                            onChange={() => toggleSelectAll(tab.key)}
                          />
                        </th>
                        <th>User</th>
                        <th>Verification</th>
                        <th>Status</th>
                        <th>Last login</th>
                        <th className="text-end px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.filter(u => u.role === tab.key).length > 0 ? (
                        filteredUsers.filter(u => u.role === tab.key).map((user) => (
                          <React.Fragment key={user.id}>
                            <tr className={selectedUsers.includes(user.id) ? 'bg-primary-soft' : ''}>
                              <td className="px-4">
                                <Form.Check 
                                  type="checkbox"
                                  className="custom-checkbox-premium"
                                  checked={selectedUsers.includes(user.id)}
                                  onChange={() => toggleSelectUser(user.id)}
                                />
                              </td>
                              <td className="py-3">
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
                                    <CheckCircle size={12} /> Confirmed
                                  </Badge>
                                ) : user.confirmationStatus === 'Reported' ? (
                                  <Badge bg="danger-soft" className="text-danger extra-small fw-bold d-flex align-items-center gap-1" style={{ width: 'fit-content' }}>
                                    <AlertCircle size={12} /> Reported Error
                                  </Badge>
                                ) : (
                                  <Badge bg="secondary-soft" className="text-muted extra-small fw-bold" style={{ width: 'fit-content' }}>
                                    Pending
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
                                  <Dropdown.Toggle 
                                    variant="link" 
                                    className="text-muted p-2 no-caret shadow-none border-0 d-inline-flex align-items-center justify-content-center rounded-circle hover-bg-surface-alt transition-all"
                                    style={{ width: '32px', height: '32px' }}
                                  >
                                    <MoreHorizontal size={18} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu 
                                    className="border-0 shadow-lg rounded-4 overflow-hidden" 
                                    style={{ zIndex: 1060, minWidth: '180px' }}
                                    popperConfig={{
                                      strategy: 'fixed',
                                      modifiers: [
                                        {
                                          name: 'offset',
                                          options: {
                                            offset: [0, 8],
                                          },
                                        },
                                      ],
                                    }}
                                  >
                                    <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleOpenModal(user)}>
                                      <div className="p-1 rounded bg-primary-soft text-primary"><Edit2 size={14} /></div> Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleMessage(user)}>
                                      <div className="p-1 rounded bg-info-soft text-info"><Mail size={14} /></div> Message
                                    </Dropdown.Item>
                                    <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => handleAccess(user)}>
                                      <div className="p-1 rounded bg-warning-soft text-warning"><Shield size={14} /></div> Access
                                    </Dropdown.Item>
                                    <Dropdown.Divider className="my-1 opacity-50" />
                                    <Dropdown.Item className="py-2 px-3 extra-small fw-bold text-danger d-flex align-items-center gap-2" onClick={() => handleDelete(user)}>
                                      <div className="p-1 rounded bg-danger-soft text-danger"><Trash2 size={14} /></div> Delete
                                    </Dropdown.Item>
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
                                        <span className="extra-small fw-bold text-danger text-uppercase tracking-wider">Report Received on {user.reportDetails.date}</span>
                                        <Button 
                                          variant="link" 
                                          size="sm" 
                                          className="p-0 text-danger extra-small fw-bold text-decoration-none"
                                          onClick={() => handleProcessReport(user.id)}
                                        >
                                          Mark as processed
                                        </Button>
                                      </div>
                                      <p className="small text-navy mb-2 fw-bold opacity-75">{user.reportDetails.message}</p>
                                      {user.reportDetails.suggestedPhoto && (
                                        <div className="d-flex align-items-center gap-2">
                                          <span className="extra-small text-muted fw-bold">New Photo requested:</span>
                                          <img src={user.reportDetails.suggestedPhoto} alt="Suggestion" className="rounded border shadow-sm" style={{ width: '32px', height: '32px' }} />
                                          <Button 
                                            variant="link" 
                                            size="sm" 
                                            className="p-0 extra-small fw-bold text-primary text-decoration-none"
                                            onClick={() => handleApplyPhoto(user.id, user.reportDetails!.suggestedPhoto!)}
                                          >
                                            Apply photo
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
                            No users found in this category.
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
            <span className="extra-small text-muted fw-bold">Categorized user display</span>
            <div className="d-flex gap-2">
              <Button size="sm" variant="outline-secondary" className="rounded-circle border p-0 d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>1</Button>
            </div>
          </div>
        </div>
      </Container>

      {/* User Modal (Add/Edit) */}
      <Modal show={showModal} onHide={closeModal} centered className="users-modal">
        <Modal.Header closeButton className="border-bottom px-4 py-3">
          <Modal.Title className="fw-bold fs-5 text-navy">{editingUser ? 'Edit User' : 'Add User'}</Modal.Title>
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
            <div className="extra-small fw-bold text-muted text-uppercase">Profile Photo (Managed by Admin)</div>
          </div>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Institutional ID (Auto-generated)</Form.Label>
                <Form.Control 
                  value={formData.institutionalId || 'Automatic generation...'} 
                  readOnly
                  className="form-control-premium fw-bold bg-surface-alt border-dashed" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">First Name</Form.Label>
                <Form.Control 
                  value={formData.name?.split(' ')[0] || ''} 
                  onChange={e => setFormData({...formData, name: `${e.target.value} ${formData.name?.split(' ')[1] || ''}`.trim()})}
                  placeholder="Ex: Jean" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Last Name</Form.Label>
                <Form.Control 
                  value={formData.name?.split(' ')[1] || ''} 
                  onChange={e => setFormData({...formData, name: `${formData.name?.split(' ')[0] || ''} ${e.target.value}`.trim()})}
                  placeholder="Ex: Martin" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Institutional Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={formData.email || ''} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="jean.martin@email.com" 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Role</Form.Label>
                <Form.Select 
                  value={formData.role || 'Student'} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="form-control-premium fw-bold"
                >
                  <option value="Student">Student</option>
                  <option value="Jury Member">Jury Member</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Admin">Administrator</option>
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Status</Form.Label>
                <Form.Select 
                  value={formData.status || 'Active'} 
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="form-control-premium fw-bold"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </Form.Select>
              </Col>

              <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Personal Information & Security</h6></Col>
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
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Family Status</Form.Label>
                <Form.Select 
                  value={formData.familyStatus || 'Single'} 
                  onChange={e => setFormData({...formData, familyStatus: e.target.value})}
                  className="form-control-premium fw-bold"
                >
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                </Form.Select>
              </Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">Address</Form.Label>
                <Form.Control 
                  value={formData.address || ''} 
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  placeholder="Full address..." 
                  className="form-control-premium fw-bold" 
                />
              </Col>
              
              {/* Role specific: CNSS for Jury/Supervisor/Admin */}
              {(formData.role === 'Jury Member' || formData.role === 'Supervisor' || formData.role === 'Admin') && (
                <Col md={12}>
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase">CNSS Code</Form.Label>
                  <Form.Control 
                    value={formData.cnss || ''} 
                    onChange={e => setFormData({...formData, cnss: e.target.value})}
                    placeholder="CNSS number..." 
                    className="form-control-premium fw-bold" 
                  />
                </Col>
              )}

              {/* Advanced Student Info - Only if role is Student */}
              {formData.role === 'Student' && (
                <>
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Student Academic Information</h6></Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">National Code (CNE)</Form.Label>
                    <Form.Control 
                      value={formData.nationalCode || ''} 
                      onChange={e => setFormData({...formData, nationalCode: e.target.value})}
                      placeholder="G13000..." 
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Diploma Grade</Form.Label>
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
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Academic Year</Form.Label>
                    <Form.Control 
                      value={formData.academicYear || '2025/2026'} 
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Section / Group</Form.Label>
                    <Form.Control 
                      value={formData.section || ''} 
                      onChange={e => setFormData({...formData, section: e.target.value})}
                      placeholder="Ex: 5IIR-G1" 
                      className="form-control-premium fw-bold" 
                    />
                  </Col>

                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Parental Information</h6></Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Father's Name</Form.Label>
                    <Form.Control 
                      value={formData.fatherName || ''} 
                      onChange={e => setFormData({...formData, fatherName: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Father's Profession</Form.Label>
                    <Form.Control 
                      value={formData.fatherProfession || ''} 
                      onChange={e => setFormData({...formData, fatherProfession: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Father's Phone</Form.Label>
                    <Form.Control 
                      value={formData.fatherPhone || ''} 
                      onChange={e => setFormData({...formData, fatherPhone: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Mother's Name</Form.Label>
                    <Form.Control 
                      value={formData.motherName || ''} 
                      onChange={e => setFormData({...formData, motherName: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Mother's Profession</Form.Label>
                    <Form.Control 
                      value={formData.motherProfession || ''} 
                      onChange={e => setFormData({...formData, motherProfession: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Mother's Phone</Form.Label>
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
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Academic Information (Professional)</h6></Col>
                  <Col md={12}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Degree Obtained</Form.Label>
                    <Form.Select 
                      value={isOtherDiploma ? 'Other' : (formData.diplomaObtained || '')} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === 'Other') {
                          setIsOtherDiploma(true);
                          setFormData({...formData, diplomaObtained: ''});
                        } else {
                          setIsOtherDiploma(false);
                          setFormData({...formData, diplomaObtained: val});
                        }
                      }}
                      className="form-control-premium fw-bold mb-2"
                    >
                      <option value="">Select a degree...</option>
                      <option value="PhD">PhD</option>
                      <option value="Master">Master</option>
                      <option value="State Engineer">State Engineer</option>
                      <option value="Bachelor">Bachelor</option>
                      <option value="Other">Other (Specify...)</option>
                    </Form.Select>
                    
                    {isOtherDiploma && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                        <Form.Control 
                          value={formData.diplomaObtained || ''} 
                          onChange={e => setFormData({...formData, diplomaObtained: e.target.value})}
                          placeholder="Enter degree name..." 
                          className="form-control-premium fw-bold border-primary border-opacity-25" 
                        />
                      </motion.div>
                    )}
                  </Col>
                  <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Assignments & Teaching Levels</h6></Col>
                  <Col md={12} className="mb-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Assigned Levels</Form.Label>
                    <div className="d-flex flex-wrap gap-3 p-3 rounded-4 bg-surface-alt border">
                      {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'PhD'].map((year) => (
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
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Specific Groups / Sections</Form.Label>
                    <Form.Control 
                      value={formData.section || ''} 
                      onChange={e => setFormData({...formData, section: e.target.value})}
                      placeholder="Ex: 5IIR-G1, 4IIR-G2..." 
                      className="form-control-premium fw-bold" 
                    />
                    <Form.Text className="extra-small text-muted fw-bold">Enter sections separated by commas.</Form.Text>
                  </Col>
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Year of Service</Form.Label>
                    <Form.Control 
                      value={formData.academicYear || '2025/2026'} 
                      onChange={e => setFormData({...formData, academicYear: e.target.value})}
                      className="form-control-premium fw-bold" 
                    />
                  </Col>
                </>
              )}

              <Col md={12} className="mt-4"><h6 className="fw-bold text-navy border-bottom pb-2 mb-2" style={{ fontSize: '13px' }}>Security & Access</h6></Col>
              <Col md={12}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase">
                  {editingUser ? 'Current password' : 'Temporary password'}
                </Form.Label>
                <InputGroup className="overflow-hidden">
                  <Form.Control 
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password || 'Emsi2026!'} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="form-control-premium fw-bold text-primary shadow-none" 
                  />
                  <Button 
                    variant="link" 
                    className="bg-surface-alt border-start text-muted p-2 no-caret"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </InputGroup>
                <Form.Text className="extra-small text-muted fw-bold opacity-75">
                  <AlertCircle size={12} className="me-1" />
                  {editingUser 
                    ? "This is the current password used by the user." 
                    : "The user will be prompted to change this password upon their first login."}
                </Form.Text>
              </Col>

              {editingUser && (
                <>
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Active Sessions</Form.Label>
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
                        <div className="extra-small text-muted text-center py-2">No active sessions detected</div>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={12} className="mt-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase">Modification History</Form.Label>
                    <div className="bg-surface-alt rounded-3 p-3 border border-dashed" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {(formData.history && formData.history.length > 0) ? (
                        formData.history.map((log, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center mb-2 last-child-mb-0 pb-2 border-bottom border-white border-opacity-10">
                            <span className="extra-small fw-bold text-navy">{log.action}</span>
                            <span className="extra-small text-muted">{log.date}</span>
                          </div>
                        ))
                      ) : (
                        <div className="extra-small text-muted text-center py-2">No history available</div>
                      )}
                    </div>
                  </Col>
                </>
              )}
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top p-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={closeModal}>Cancel</Button>
          <Button className="btn-premium px-4" onClick={handleSave}>{editingUser ? 'Save' : 'Create user'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="delete-modal-premium">
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger-soft text-danger rounded-circle p-3 d-inline-block mb-4 shadow-sm">
            <AlertCircle size={40} />
          </div>
          <h4 className="fw-bold text-navy mb-3">Confirm Deletion</h4>
          <p className="text-muted small mb-4 px-3">
            Are you sure you want to delete user <span className="text-navy fw-bold">"{userToDelete?.name}"</span>? <br />
            <span className="text-danger fw-bold">This action is irreversible.</span>
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="outline-secondary" className="px-4 py-2 rounded-3 fw-bold border-2" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" className="px-4 py-2 rounded-3 fw-bold shadow-sm" onClick={confirmDelete}>
              Permanently delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Message Modal */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered className="message-modal-premium">
        <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
          <Modal.Title className="fw-bold text-navy d-flex align-items-center gap-2">
            <Mail size={24} className="text-primary" /> Send a message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-4 bg-surface-alt border">
            <img src={messageRecipient?.avatar} alt="" className="rounded-circle border" style={{ width: '45px', height: '45px' }} />
            <div>
              <div className="small fw-bold text-navy">Recipient: {messageRecipient?.name}</div>
              <div className="extra-small text-muted fw-bold">{messageRecipient?.email}</div>
            </div>
          </div>
          <Form.Group>
            <Form.Label className="extra-small fw-bold text-muted text-uppercase">Your Message</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Enter your message here..." 
              className="form-control-premium fw-bold shadow-none border-2"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-top-0 pb-4 px-4">
          <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={() => setShowMessageModal(false)}>
            Cancel
          </Button>
          <Button className="btn-premium px-4 d-flex align-items-center gap-2" onClick={sendMessage}>
            <Mail size={18} /> Send the message
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Access Management Modal */}
      <Modal show={showAccessModal} onHide={() => setShowAccessModal(false)} centered className="access-modal-premium">
        <Modal.Header closeButton className="border-bottom-0 pt-4 px-4">
          <Modal.Title className="fw-bold text-navy d-flex align-items-center gap-2">
            <Shield size={24} className="text-primary" /> Access Management
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="d-flex align-items-center gap-3 mb-4 p-3 rounded-4 bg-surface-alt border">
            <div className="p-2 bg-primary-soft text-primary rounded-circle">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="small fw-bold text-navy">{accessUser?.name}</div>
              <Badge bg="primary-soft" className="text-primary extra-small fw-bold">{accessUser?.role}</Badge>
            </div>
          </div>

          <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Sidebar Navigation Control ({accessUser?.role})</h6>
          <div className="d-flex flex-column gap-2">
            {(accessUser?.role === 'Student' ? [
              { id: 'dash', label: 'Dashboard Page', desc: 'Access to the overview.', icon: <LayoutDashboard size={14} /> },
              { id: 'docs', label: 'My Documents Page', desc: 'Access to report uploads.', icon: <FileText size={14} /> },
              { id: 'eval', label: 'Evaluations Page', desc: 'Access to grades and criteria.', icon: <Award size={14} /> },
              { id: 'plan', label: 'Defense Planning Page', desc: 'Access to defense schedule.', icon: <Calendar size={14} /> },
              { id: 'sett', label: 'Settings Page', desc: 'Access to profile and security.', icon: <Settings size={14} /> }
            ] : accessUser?.role === 'Jury Member' ? [
              { id: 'j-dash', label: 'Jury Dashboard Page', desc: 'Access to assigned projects.', icon: <LayoutDashboard size={14} /> },
              { id: 'j-proj', label: 'Projects to Evaluate Page', desc: 'Access to pending reports.', icon: <Briefcase size={14} /> },
              { id: 'j-prog', label: 'My Schedule Page', desc: 'Access to personal calendar.', icon: <Calendar size={14} /> },
              { id: 'j-sett', label: 'Settings Page', desc: 'Access to account settings.', icon: <Settings size={14} /> }
            ] : accessUser?.role === 'Supervisor' ? [
              { id: 's-dash', label: 'Supervisor Dashboard Page', desc: 'Access to global tracking.', icon: <LayoutDashboard size={14} /> },
              { id: 's-stu', label: 'My Students Page', desc: 'Access to the list of students.', icon: <Users size={14} /> },
              { id: 's-eval', label: 'Evaluations Page', desc: 'Access to grading rubrics.', icon: <Award size={14} /> },
              { id: 's-rdv', label: 'Meetings Page', desc: 'Access to meeting schedule.', icon: <Clock size={14} /> },
              { id: 's-sett', label: 'Settings Page', desc: 'Access to profile.', icon: <Settings size={14} /> }
            ] : [
              { id: 'a-dash', label: 'Admin Dashboard Page', desc: 'Access to global statistics.', icon: <LayoutDashboard size={14} /> },
              { id: 'a-user', label: 'User Management Page', desc: 'Access to the list of members.', icon: <Users size={14} /> },
              { id: 'a-plan', label: 'Jury Planning Page', desc: 'Access to session configuration.', icon: <Calendar size={14} /> },
              { id: 'a-sett', label: 'Settings Page', desc: 'Access to system options.', icon: <Settings size={14} /> }
            ]).map((perm) => (
              <div key={perm.id} className="p-3 rounded-4 border bg-white d-flex justify-content-between align-items-center hover-bg-surface-alt transition-all shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 bg-primary-soft text-primary border border-primary border-opacity-10">
                    {perm.icon}
                  </div>
                  <div>
                    <div className="small fw-bold text-navy">{perm.label}</div>
                    <div className="extra-small text-muted opacity-75">{perm.desc}</div>
                  </div>
                </div>
                <Form.Check
                  type="switch"
                  className="access-switch"
                  checked={accessPermissions[perm.id] !== false}
                  onChange={(e) => setAccessPermissions(prev => ({ ...prev, [perm.id]: e.target.checked }))}
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-top-0 pb-4 px-4 d-flex flex-column gap-2 align-items-stretch">
          {accessSaved && (
            <div className="p-3 rounded-3 bg-success-soft text-success extra-small fw-bold d-flex align-items-center gap-2 border border-success border-opacity-25">
              <CheckCircle size={16} /> Permissions saved successfully for {accessUser?.name}.
            </div>
          )}
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="link" className="text-muted fw-bold text-decoration-none" onClick={() => setShowAccessModal(false)}>
              Close
            </Button>
            <Button
              className="btn-premium px-4"
              onClick={() => {
                setAccessSaved(true);
                setTimeout(() => setShowAccessModal(false), 1200);
              }}
            >
              Save permissions
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserManagement;
