import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
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
                <Button variant="link" className="p-2 rounded-circle border-0 text-primary hover-bg-surface-alt transition-all">
                  <UserPlus size={20} />
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
                      <div className="extra-small text-muted fw-bold opacity-50">Live</div>
                    </div>
                    <div className="extra-small text-primary fw-bold mb-1 opacity-75">{conv.desc}</div>
                    <p className="extra-small text-muted mb-0 text-truncate opacity-75 fw-bold">
                      {messages.filter(m => m.sender === conv.id).slice(-1)[0]?.text || "No recent messages"}
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
                    <span>{new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
    </div>
  );
};

export default SupervisorMessages;
