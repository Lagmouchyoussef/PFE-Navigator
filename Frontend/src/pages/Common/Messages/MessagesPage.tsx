import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, Spinner } from 'react-bootstrap';
import { Send, Search, User, Check, CheckCheck } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const MessagesPage: React.FC = () => {
  const {
    messages, sendMessage, markMessageRead,
    contactableUsers, user, isLoading
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-select first contactable user
  useEffect(() => {
    if (!selectedUserId && contactableUsers.length > 0) {
      setSelectedUserId(contactableUsers[0].id);
    }
  }, [contactableUsers, selectedUserId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedUserId]);

  // Mark messages as read when opening conversation
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

  const filteredContacts = contactableUsers.filter(u =>
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

  const selectedContact = contactableUsers.find(u => u.id === selectedUserId);

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
                <h4 className="fw-bold mb-3 text-navy">Messaging</h4>
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
                    <div>
                      <div className="fw-bold text-navy">{selectedContact.name}</div>
                      <div className="extra-small text-muted">{roleLabel[selectedContact.role] || selectedContact.role} • {selectedContact.email}</div>
                    </div>
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
                            className={`px-3 py-2 rounded-3 shadow-sm`}
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
    </div>
  );
};

export default MessagesPage;
