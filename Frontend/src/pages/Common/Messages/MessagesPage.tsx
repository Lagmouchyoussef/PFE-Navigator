import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, Spinner, Modal } from 'react-bootstrap';
import { Send, Search, User, Users, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const MessagesPage: React.FC = () => {
  const {
    messages, sendMessage, markMessageRead, deleteMessage,
    contactableUsers, user, isLoading
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingConversation, setDeletingConversation] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Users Modal States
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [programUsers, setProgramUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Roles visible per connected user role
  const allowedRolesByUser: Record<string, string[]> = {
    student:    ['student', 'supervisor', 'admin'],
    supervisor: ['student', 'supervisor', 'jury', 'admin'],
    jury:       ['student', 'supervisor', 'jury', 'admin'],
    admin:      ['student', 'supervisor', 'jury', 'admin'],
  };
  const visibleRoles = allowedRolesByUser[user?.role || 'student'] || [];

  const [localContacts, setLocalContacts] = useState<any[]>([]);

  useEffect(() => {
    if (contactableUsers) {
      setLocalContacts(contactableUsers);
    }
  }, [contactableUsers]);

  useEffect(() => {
    if (!selectedUserId && messages.length > 0 && localContacts.length > 0) {
      const first = localContacts.find(contact =>
        messages.some(m =>
          (m.sender === user?.id && m.recipient === contact.id) ||
          (m.recipient === user?.id && m.sender === contact.id)
        )
      );
      if (first) setSelectedUserId(first.id);
    }
  }, [localContacts, selectedUserId, messages, user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId]);

  useEffect(() => {
    if (!selectedUserId) return;
    const unread = messages.filter(
      m => m.recipient === user?.id && m.sender === selectedUserId && !m.is_read
    );
    unread.forEach(m => markMessageRead(m.id));
  }, [selectedUserId, messages, user?.id, markMessageRead]);

  const conversationMessages = messages.filter(m =>
    (m.sender === user?.id && m.recipient === selectedUserId) ||
    (m.recipient === user?.id && m.sender === selectedUserId)
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const handleSend = useCallback(async () => {
    if (!inputText.trim() || !selectedUserId) return;
    setSending(true);
    try {
      await sendMessage(selectedUserId, inputText.trim());
      setInputText('');
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  }, [inputText, selectedUserId, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteConversation = useCallback(async () => {
    if (!selectedUserId) return;
    setDeletingConversation(true);
    try {
      await Promise.all(conversationMessages.map(m => deleteMessage(m.id)));
      setLocalContacts(prev => prev.filter(c => c.id !== selectedUserId));
      setSelectedUserId(null);
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Delete conversation error:', err);
    } finally {
      setDeletingConversation(false);
    }
  }, [selectedUserId, conversationMessages, deleteMessage]);

  const contactsWithConversation = localContacts.filter(contact =>
    messages.some(m =>
      (m.sender === user?.id && m.recipient === contact.id) ||
      (m.recipient === user?.id && m.sender === contact.id)
    )
  );

  const filteredContacts = contactsWithConversation.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getUnreadCount = (contactId: number) =>
    messages.filter(m => m.recipient === user?.id && m.sender === contactId && !m.is_read).length;

  const getLastMessage = (contactId: number) => {
    const msgs = messages.filter(m =>
      (m.sender === user?.id && m.recipient === contactId) ||
      (m.recipient === user?.id && m.sender === contactId)
    );
    return msgs.at(-1);
  };

  const selectedContact = localContacts.find(u => u.id === selectedUserId);

  const roleColor: Record<string, string> = {
    admin: 'var(--color-rose)',
    supervisor: 'var(--color-primary)',
    jury: 'var(--color-warning)',
    student: 'var(--color-success)',
  };

  const roleLabel: Record<string, string> = {
    admin: 'Administrator',
    supervisor: 'Supervisor',
    jury: 'Jury Member',
    student: 'Student',
  };

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

  const handleSelectContactFromModal = (contact: any) => {
    if (!localContacts.some(c => c.id === contact.id)) {
      setLocalContacts(prev => [contact, ...prev]);
    }
    setSelectedUserId(contact.id);
    setShowUsersModal(false);
  };

  return (
    <div className="messages-modern-layout h-100 py-3">
      <Container fluid className="h-100 p-0 overflow-hidden">
        <div
          className="glass-card border h-100 d-flex overflow-hidden mx-4"
          style={{ height: 'calc(100vh - 120px)' }}
        >
          <Row className="g-0 w-100 h-100">
            {/* Sidebar */}
            <Col lg={4} xl={3} className="messages-sidebar h-100 d-flex flex-column border-end bg-surface-alt">
              <div className="p-4 bg-white border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0 text-navy">Messaging</h4>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="rounded-pill extra-small fw-bold px-3 d-flex align-items-center gap-1"
                    onClick={() => setShowUsersModal(true)}
                  >
                    <Users size={13} />
                    New Chat
                  </Button>
                </div>
                <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 pe-1">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search contacts..."
                    className="bg-transparent border-0 shadow-none extra-small py-2 text-navy fw-bold"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </InputGroup>
              </div>

              <div className="flex-grow-1 overflow-auto conversations-list">
                {isLoading && <div className="text-center py-4"><Spinner size="sm" /></div>}
                {!isLoading && filteredContacts.length === 0 && (
                  <div className="text-center py-5 text-muted small">No contacts available</div>
                )}
                {filteredContacts.map(contact => {
                  const unread = getUnreadCount(contact.id);
                  const lastMsg = getLastMessage(contact.id);
                  const color = roleColor[contact.role] || '#888';
                  const initials = (contact.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <button
                      key={contact.id}
                      type="button"
                      className={`conv-item p-4 d-flex gap-3 align-items-center w-100 text-start border-0 border-bottom transition-all ${contact.id === selectedUserId ? 'bg-white border-start border-primary border-4 shadow-sm' : 'hover-bg-white bg-transparent'}`}
                      onClick={() => setSelectedUserId(contact.id)}
                    >
                      <div className="position-relative">
                        <div
                          className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                          style={{ backgroundColor: color, width: '48px', height: '48px', fontSize: '14px' }}
                        >
                          {initials}
                        </div>
                        <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="d-flex justify-content-between mb-1">
                          <div className="fw-bold small text-truncate text-navy">{contact.name}</div>
                          {unread > 0 && <Badge bg="primary" pill>{unread}</Badge>}
                        </div>
                        <div className="extra-small text-muted mb-1 fw-bold">{roleLabel[contact.role] || contact.role}</div>
                        <p className="extra-small text-muted mb-0 text-truncate fw-bold opacity-50">
                          {lastMsg ? lastMsg.content.slice(0, 40) : 'No messages yet'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Col>

            {/* Chat Area */}
            <Col lg={8} xl={9} className="d-flex flex-column h-100">
              {selectedContact ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-bottom bg-white d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{ width: '44px', height: '44px', backgroundColor: roleColor[selectedContact.role] || '#888', fontSize: '14px' }}
                    >
                      {(selectedContact.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold text-navy">{selectedContact.name}</div>
                      <div className="extra-small text-muted">{roleLabel[selectedContact.role] || selectedContact.role} • {selectedContact.email}</div>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill d-flex align-items-center gap-2 fw-bold extra-small px-3"
                      onClick={() => setShowDeleteModal(true)}
                      title="Delete conversation"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" ref={scrollRef}>
                    {conversationMessages.length === 0 && (
                      <div className="text-center py-5 text-muted">
                        <User size={40} className="mb-3 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )}
                    {conversationMessages.map(msg => {
                      const isMine = msg.sender === user?.id;
                      return (
                        <div key={msg.id} className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                          <div
                            className="px-3 py-2 rounded-3 shadow-sm"
                            style={{
                              maxWidth: '70%',
                              backgroundColor: isMine ? 'var(--color-primary)' : 'white',
                              color: isMine ? 'white' : 'inherit',
                              border: isMine ? 'none' : '1px solid #eee',
                            }}
                          >
                            {msg.subject && <div className="small fw-bold mb-1 opacity-75">{msg.subject}</div>}
                            <div className="small">{msg.content}</div>
                            <div className={`d-flex align-items-center gap-1 mt-1 ${isMine ? 'justify-content-end' : ''}`}
                              style={{ opacity: 0.7 }}>
                              <span className="extra-small text-muted" style={{ fontSize: '10px' }}>
                                {(() => {
                                  const d = new Date(msg.time || msg.created_at);
                                  return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                })()}
                              </span>
                              {isMine && (msg.is_read ? <CheckCheck size={12} /> : <Check size={12} />)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-top bg-white">
                    <InputGroup>
                      <Form.Control
                        as="textarea"
                        rows={1}
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ resize: 'none' }}
                        disabled={sending}
                      />
                      <Button
                        variant="primary"
                        onClick={handleSend}
                        disabled={!inputText.trim() || sending}
                      >
                        {sending ? <Spinner size="sm" /> : <Send size={16} />}
                      </Button>
                    </InputGroup>
                    <div className="text-muted extra-small mt-1">Press Enter to send</div>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100 text-muted flex-column gap-3">
                  <User size={60} className="opacity-30" />
                  <p className="fw-bold">Select a contact to start messaging</p>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Container>

      {/* Delete Conversation Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
        <Modal.Body className="p-4 text-center">
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10"
            style={{ width: 56, height: 56 }}
          >
            <Trash2 size={24} className="text-danger" />
          </div>
          <h6 className="fw-bold text-navy mb-1">Delete conversation?</h6>
          <p className="text-muted small mb-4">
            All messages with <strong>{selectedContact?.name}</strong> will be permanently deleted.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="outline-secondary"
              size="sm"
              className="rounded-pill px-4 fw-bold"
              onClick={() => setShowDeleteModal(false)}
              disabled={deletingConversation}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2"
              onClick={handleDeleteConversation}
              disabled={deletingConversation}
            >
              {deletingConversation ? <Spinner size="sm" /> : <Trash2 size={14} />}
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Program Users Modal */}
      <Modal show={showUsersModal} onHide={() => { setShowUsersModal(false); setUsersSearch(''); setRoleFilter('all'); }} size="lg" centered>
        <Modal.Header closeButton className="border-bottom px-4 py-3 bg-surface-alt">
          <div>
            <Modal.Title className="fw-bold fs-6 text-navy">Program Directory</Modal.Title>
            <p className="text-muted extra-small mb-0 mt-1">Select a user to start a conversation</p>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">

          {/* Search */}
          <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden mb-3">
            <InputGroup.Text className="bg-transparent border-0 pe-1">
              <Search size={16} className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search by name or ID..."
              className="bg-transparent border-0 shadow-none extra-small py-2 text-navy fw-bold"
              value={usersSearch}
              onChange={e => setUsersSearch(e.target.value)}
            />
          </InputGroup>

          {/* Role filter tabs */}
          <div className="d-flex gap-2 flex-wrap mb-4">
            {(['all', ...visibleRoles]).map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setRoleFilter(role)}
                style={{
                  padding: '4px 14px',
                  borderRadius: 20,
                  border: `1.5px solid ${roleFilter === role ? (roleColor[role] || 'var(--color-primary)') : '#e2e8f0'}`,
                  background: roleFilter === role ? (roleColor[role] || 'var(--color-primary)') : 'transparent',
                  color: roleFilter === role ? '#fff' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {role === 'all' ? 'All' : roleLabel[role] || role}
              </button>
            ))}
          </div>

          {loadingUsers ? (
            <div className="text-center py-5"><Spinner size="sm" /></div>
          ) : (
            <div className="overflow-auto" style={{ maxHeight: '420px' }}>
              {(() => {
                const filtered = programUsers
                  .filter(u => u.id !== user?.id)
                  .filter(u => visibleRoles.includes(u.role))
                  .filter(u => roleFilter === 'all' || u.role === roleFilter)
                  .filter(u =>
                    !usersSearch ||
                    u.name?.toLowerCase().includes(usersSearch.toLowerCase()) ||
                    u.institutional_id?.toLowerCase().includes(usersSearch.toLowerCase())
                  );

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-5 text-muted">
                      <User size={36} className="mb-2 opacity-30" />
                      <p className="small fw-bold">No users found</p>
                    </div>
                  );
                }

                return (
                  <div className="d-flex flex-column gap-2">
                    {filtered.map(u => {
                      const initials = (u.name || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                      const color = roleColor[u.role] || '#888';
                      return (
                        <div
                          key={u.id}
                          className="d-flex align-items-center gap-3 p-3 rounded-4 border"
                          style={{ background: '#fafafa', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}
                        >
                          {/* Avatar */}
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                            style={{ backgroundColor: color, width: 44, height: 44, fontSize: 14 }}
                          >
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex-grow-1 overflow-hidden">
                            <div className="fw-bold small text-navy text-truncate">{u.name}</div>
                            <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
                              <span
                                className="extra-small fw-bold"
                                style={{
                                  background: color + '18',
                                  color,
                                  padding: '2px 8px',
                                  borderRadius: 10,
                                  border: `1px solid ${color}44`,
                                }}
                              >
                                {roleLabel[u.role] || u.role}
                              </span>
                              {u.institutional_id && (
                                <span className="extra-small text-muted fw-bold">
                                  ID: <strong className="text-navy">{u.institutional_id}</strong>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill fw-bold extra-small px-3 flex-shrink-0"
                            style={{ whiteSpace: 'nowrap' }}
                            onClick={() => handleSelectContactFromModal(u)}
                          >
                            <Send size={12} className="me-1" />
                            Message
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MessagesPage;
