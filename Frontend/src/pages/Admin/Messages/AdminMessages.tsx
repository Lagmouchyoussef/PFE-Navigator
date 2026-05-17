import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import {
  Send, Search, Paperclip, Phone, Video,
  User, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';

const AdminMessages: React.FC = () => {
  const { messages, sendMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeRole, setActiveRole] = useState<string>('student');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const roles = [
    { id: 'student', name: 'Students Channel', avatar: 'ST', color: '#10b981', desc: 'Student messages' },
    { id: 'supervisor', name: 'Supervisors Channel', avatar: 'EN', color: 'var(--color-primary)', desc: 'Pedagogical coordination' },
    { id: 'jury', name: 'Jury Channel', avatar: 'JU', color: '#f59e0b', desc: 'Evaluations and defenses' },
  ];

  const filteredMessages = (messages || []).filter(m => m.sender === activeRole || (m.sender === 'admin' && activeRole === 'student'));

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(0, inputText, activeRole);
    setInputText('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="admin-messages-pro-layout">
      <Container fluid className="h-100 p-0 overflow-hidden">
        <Row className="g-0 h-100" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Sidebar */}
          <Col lg={4} xl={3} className="messages-sidebar h-100 d-flex flex-column border-end shadow-sm">
            <div className="p-4 border-bottom">
              <h4 className="fw-bold mb-4 text-navy">Messages</h4>
              <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search..."
                  className="bg-transparent border-0 shadow-none small py-2 text-navy"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto conversations-list">
              {roles.map((conv) => (
                <div
                  key={conv.id}
                  className={`conv-item p-4 d-flex gap-3 align-items-center cursor-pointer border-bottom transition-all ${conv.id === activeRole ? 'active-conv' : 'hover-bg-surface'}`}
                  onClick={() => setActiveRole(conv.id)}
                >
                  <div className="position-relative">
                    <div className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ backgroundColor: conv.color, width: '48px', height: '48px' }}>{conv.avatar}</div>
                    <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between mb-1">
                      <div className="fw-bold small text-truncate text-navy">{conv.name}</div>
                      <div className="extra-small text-muted fw-bold">Live</div>
                    </div>
                    <div className="extra-small text-muted mb-1 fw-bold opacity-75">{conv.desc}</div>
                    <p className="extra-small text-muted mb-0 text-truncate fw-bold opacity-75">
                      {messages.filter(m => m.sender === conv.id).slice(-1)[0]?.text || "No recent messages"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Chat Area */}
          <Col lg={8} xl={9} className="h-100 d-flex flex-column bg-surface-alt">
            {/* Chat Header */}
            <header className="p-3 px-4 d-flex justify-content-between align-items-center bg-surface border-bottom shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="avatar-circle sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                    {roles.find(r => r.id === activeRole)?.avatar}
                  </div>
                  <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">{roles.find(r => r.id === activeRole)?.name}</h6>
                  <span className="extra-small text-muted fw-bold d-flex align-items-center gap-1">
                    <div className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></div> Online
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface"><Phone size={20} /></Button>
                <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface"><Video size={20} /></Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-1 text-muted shadow-none border-0 no-caret">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-0 rounded-3 extra-small glass-card">
                    <Dropdown.Item className="fw-bold"><User size={14} className="me-2" /> View profile</Dropdown.Item>
                    <Dropdown.Item className="fw-bold"><Search size={14} className="me-2" /> Search</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger fw-bold">Block</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Messages Feed */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4" ref={scrollRef}>
              {filteredMessages.map((msg) => (
                <div key={msg.id} className={`d-flex flex-column ${msg.sender === 'admin' ? 'align-items-end' : 'align-items-start'}`}>
                  <div className={`message-bubble p-3 rounded-4 shadow-sm max-w-75 ${msg.sender === 'admin' ? 'bg-primary text-white' : 'glass-card'}`}>
                    <p className="mb-0 small fw-bold">{msg.text}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-1 px-2 extra-small text-muted fw-bold">
                    {(() => {
                      const d = new Date(msg.time || msg.created_at);
                      return isNaN(d.getTime()) ? '—' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    })()}
                    {msg.sender === 'admin' && (
                      <CheckCheck size={14} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <div className="text-center p-5 text-muted extra-small fw-bold opacity-50">
                  No messages in this channel.
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-3 px-4 border-top bg-surface">
              <div className="d-flex align-items-center gap-3">
                <Button variant="link" className="p-2 text-muted rounded-circle hover-bg-surface" onClick={() => fileRef.current?.click()}>
                  <Paperclip size={20} />
                  <input type="file" ref={fileRef} className="d-none" />
                </Button>
                <div className="flex-grow-1 position-relative">
                  <Form.Control
                    placeholder="Type your message..."
                    className="rounded-pill border shadow-none px-4 py-2 bg-surface-alt text-navy"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                </div>
                <Button
                  className="btn-premium rounded-circle d-flex align-items-center justify-content-center p-0"
                  style={{ width: '42px', height: '42px' }}
                  onClick={handleSend}
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <style>{`
        .admin-messages-pro-layout {
          height: calc(100vh - 80px);
        }
        .messages-sidebar {
          background-color: var(--color-surface);
          border-color: var(--color-border) !important;
        }
        .active-conv {
          background-color: rgba(var(--color-primary-rgb), 0.1) !important;
          border-left: 4px solid var(--color-primary) !important;
        }
        .hover-bg-surface:hover {
          background-color: var(--color-surface-alt) !important;
        }
        .message-bubble {
          max-width: 80%;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default AdminMessages;
