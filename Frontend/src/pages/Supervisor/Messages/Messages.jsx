import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Dropdown, Modal, Spinner } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MessageSquare, User, Check, CheckCheck, MoreVertical, X,
  UserPlus, Bell, Settings, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

const SupervisorMessages = () => {
  const { messages, sendMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('student'); // student, admin, jury
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  // Users Modal States
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [programUsers, setProgramUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');

  const channels = [
    { id: 'student', name: 'PFE Students', avatar: 'ST', color: '#10b981', desc: 'Monitor your students' },
    { id: 'admin', name: 'Administration', avatar: 'AD', color: '#f59e0b', desc: 'Admin coordination' },
    { id: 'jury', name: 'Jury Members', avatar: 'JU', color: '#6366f1', desc: 'Evaluations' },
  ];

  const filteredMessages = (messages || []).filter(m => 
    m.sender === activeTab || (m.sender === 'supervisor' && activeTab === 'student')
  );

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, 'supervisor');
    setInputText('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchProgramUsers = async () => {
    setLoadingUsers(true);
    try {
      const { usersApi } = await import('../../../api/users');
      const data = await usersApi.getUsersList();
      setProgramUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch program users error:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (showUsersModal) {
      fetchProgramUsers();
    }
  }, [showUsersModal]);

  const roleColor = {
    admin: 'var(--color-rose)',
    supervisor: 'var(--color-primary)',
    jury: 'var(--color-warning)',
    student: 'var(--color-success)',
  };

  const roleLabel = {
    admin: 'Administrator',
    supervisor: 'Supervisor',
    jury: 'Jury Member',
    student: 'Student',
  };

  return (
    <div className="supervisor-messages-layout py-4 h-100">
      <Container fluid className="px-4 h-100">
        <div className="glass-card border shadow-sm overflow-hidden d-flex" style={{ height: 'calc(100vh - 160px)' }}>
          
          {/* Sidebar: Contacts List */}
          <div className="border-end d-flex flex-column bg-surface-alt" style={{ width: '320px', minWidth: '320px' }}>
            {/* Sidebar Header */}
            <div className="p-4 bg-white border-bottom shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-navy mb-0">Messaging</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="rounded-pill extra-small fw-bold px-3 py-1.5"
                  onClick={() => setShowUsersModal(true)}
                >
                  All Users
                </Button>
              </div>
              
              <InputGroup className="bg-surface-alt rounded-pill border px-3 mb-3">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search..." 
                  className="bg-transparent border-0 shadow-none extra-small py-2 fw-bold"
                />
              </InputGroup>
            </div>

            {/* Conversations List */}
            <div className="flex-grow-1 overflow-auto">
              {channels.map((conv) => (
                <motion.div 
                  key={conv.id} 
                  className={`p-3 d-flex gap-3 align-items-center cursor-pointer border-bottom border-light border-opacity-10 transition-all position-relative ${conv.id === activeTab ? 'bg-white border-start border-4 border-primary shadow-sm' : 'hover-bg-white'}`}
                  onClick={() => setActiveTab(conv.id)}
                >
                  <div className="position-relative">
                    <div 
                      className="avatar-sm shadow-sm fw-bold text-white d-flex align-items-center justify-content-center rounded-circle" 
                      style={{ backgroundColor: conv.color, width: '45px', height: '45px', fontSize: '14px' }}
                    >
                      {conv.avatar}
                    </div>
                    <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold small text-navy text-truncate">{conv.name}</div>
                      <div className="extra-small text-muted fw-bold">Live</div>
                    </div>
                    <div className="extra-small text-primary fw-bold mb-1 opacity-75">{conv.desc}</div>
                    <p className="extra-small text-muted mb-0 text-truncate opacity-75 fw-bold">
                      {(messages || []).filter(m => m && m.sender === conv.id).slice(-1)[0]?.text || "No recent messages"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-grow-1 d-flex flex-column bg-white">
            {/* Chat Header */}
            <header className="p-3 px-4 d-flex justify-content-between align-items-center border-bottom bg-white shadow-sm z-index-1">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="avatar-sm bg-primary text-white shadow-sm fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: '45px', height: '45px' }}>
                    {channels.find(c => c.id === activeTab)?.avatar}
                  </div>
                  <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <div>
                  <h6 className="fw-bold text-navy mb-0">{channels.find(c => c.id === activeTab)?.name}</h6>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    <span className="extra-small text-success fw-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="p-2 rounded-circle border-0 text-muted hover-bg-surface-alt transition-all"><Phone size={20}/></Button>
                <Button variant="link" className="p-2 rounded-circle border-0 text-muted hover-bg-surface-alt transition-all"><Video size={20}/></Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-surface-alt rounded-circle">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-0 rounded-4 extra-small p-2">
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-navy">Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-danger">Archive</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Messages Content */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-surface-alt" ref={scrollRef}>
              {filteredMessages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`d-flex flex-column ${msg.sender === 'supervisor' ? 'align-items-end' : 'align-items-start'}`}
                >
                  <div className={`p-3 rounded-4 shadow-sm transition-all ${msg.sender === 'supervisor' ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white border rounded-bottom-start-0 text-navy'}`} style={{ maxWidth: '75%' }}>
                    <p className="mb-0 small fw-bold" style={{ lineHeight: '1.6' }}>{msg.text}</p>
                  </div>
                  <div className={`d-flex align-items-center gap-2 mt-1 px-1 extra-small text-muted fw-bold opacity-50 ${msg.sender === 'supervisor' ? 'flex-row-reverse' : ''}`}>
                    <span>
                      {(() => {
                        const d = new Date(msg.time || msg.created_at);
                        return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </span>
                    {msg.sender === 'supervisor' && <CheckCheck size={14} className="text-primary"/>}
                  </div>
                </motion.div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="text-center p-5 text-muted extra-small fw-bold opacity-50">
                  No messages in this discussion.
                </div>
              )}
            </div>

            {/* Message Input Bar */}
            <div className="p-3 px-4 border-top bg-white">
              <div className="d-flex align-items-center gap-3">
                <Button variant="link" className="p-2 rounded-circle border-0 text-muted hover-bg-surface-alt transition-all shadow-none" onClick={() => fileRef.current?.click()}>
                  <Paperclip size={20}/>
                  <input type="file" ref={fileRef} className="d-none" />
                </Button>
                <div className="flex-grow-1">
                  <Form.Control 
                    placeholder="Type your message..." 
                    className="rounded-pill border-0 shadow-none px-4 py-2 bg-surface-alt text-navy extra-small fw-bold"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                </div>
                <Button 
                  className="btn-premium rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm border-0"
                  onClick={handleSend}
                >
                  <span className="d-none d-md-inline extra-small fw-bold text-uppercase">Send</span>
                  <Send size={18}/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Program Users Modal */}
      <Modal show={showUsersModal} onHide={() => setShowUsersModal(false)} size="lg" centered>
        <Modal.Header closeButton className="border-bottom px-4 py-3 bg-surface-alt">
          <Modal.Title className="fw-bold fs-6 text-navy">Program Users</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden mb-4">
            <InputGroup.Text className="bg-transparent border-0 pe-1">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name, ID, or email..."
              className="bg-transparent border-0 shadow-none extra-small py-2 text-navy fw-bold"
              value={usersSearch}
              onChange={e => setUsersSearch(e.target.value)}
            />
          </InputGroup>

          {loadingUsers ? (
            <div className="text-center py-5"><Spinner size="md" /></div>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: '400px' }}>
              <table className="table table-hover align-middle border-0">
                <thead>
                  <tr className="extra-small text-muted fw-bold border-bottom">
                    <th>Name</th>
                    <th>ID</th>
                    <th>Role</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {programUsers.filter(u => 
                    u.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                    u.email?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                    u.institutional_id?.toLowerCase().includes(usersSearch.toLowerCase())
                  ).map(u => {
                    const initials = (u.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                    const color = roleColor[u.role] || '#888';
                    return (
                      <tr key={u.id} className="border-bottom">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                              style={{ backgroundColor: color, width: '36px', height: '36px', fontSize: '12px' }}
                            >
                              {initials}
                            </div>
                            <span className="small fw-bold text-navy">{u.name}</span>
                          </div>
                        </td>
                        <td className="small text-muted fw-bold">{u.institutional_id || 'N/A'}</td>
                        <td className="extra-small">
                          <Badge bg="transparent" style={{ border: `1px solid ${color}`, color: color }} className="extra-small text-capitalize">
                            {roleLabel[u.role] || u.role}
                          </Badge>
                        </td>
                        <td className="small text-muted">{u.email}</td>
                      </tr>
                    );
                  })}
                  {programUsers.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-4 text-muted small">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SupervisorMessages;
