import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  User, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const MessagesPage: React.FC = () => {
  const { messages, sendMessage, user } = useApp();
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState<string>('admin');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const channels = [
    { id: 'admin', name: 'Administration', avatar: 'AD', color: 'var(--color-rose)', desc: 'Coordination & Support' },
    { id: 'supervisor', name: 'Encadrement', avatar: 'EN', color: 'var(--color-primary)', desc: 'Suivi pédagogique' },
    { id: 'jury', name: 'Jury', avatar: 'JU', color: 'var(--color-warning)', desc: 'Évaluations & Soutenances' },
  ];

  const filteredMessages = (messages || []).filter(m => 
    (m.sender === activeTab && (user?.role === 'student' || user?.role === 'supervisor' || user?.role === 'jury')) ||
    (m.sender === user?.role && activeTab === 'admin') // Simplistic mapping for demo
  );

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText, user?.role || 'student');
    setInputText('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="messages-modern-layout h-100 py-3">
      <Container fluid className="h-100 p-0 overflow-hidden">
        <div className="glass-card border h-100 d-flex overflow-hidden mx-4" style={{ height: 'calc(100vh - 120px)' }}>
          <Row className="g-0 w-100 h-100">
            {/* Sidebar */}
            <Col lg={4} xl={3} className="messages-sidebar h-100 d-flex flex-column border-end bg-surface-alt">
              <div className="p-4 bg-white border-bottom">
                <h4 className="fw-bold mb-4 text-navy">Messagerie</h4>
                <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden">
                  <InputGroup.Text className="bg-transparent border-0 pe-1">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Rechercher..." 
                    className="bg-transparent border-0 shadow-none extra-small py-2 text-navy fw-bold"
                  />
                </InputGroup>
              </div>

              <div className="flex-grow-1 overflow-auto conversations-list">
                {channels.map((conv) => (
                  <div 
                    key={conv.id} 
                    className={`conv-item p-4 d-flex gap-3 align-items-center cursor-pointer border-bottom transition-all ${conv.id === activeTab ? 'bg-white border-start border-primary border-4 shadow-sm' : 'hover-bg-white'}`}
                    onClick={() => setActiveTab(conv.id)}
                  >
                    <div className="position-relative">
                      <div className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ backgroundColor: conv.color, width: '48px', height: '48px' }}>
                        {conv.avatar}
                      </div>
                      <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between mb-1">
                        <div className="fw-bold small text-truncate text-navy">{conv.name}</div>
                        <div className="extra-small text-muted fw-bold">En ligne</div>
                      </div>
                      <div className="extra-small text-muted mb-1 opacity-75 fw-bold">{conv.desc}</div>
                      <p className="extra-small text-muted mb-0 text-truncate fw-bold opacity-50">
                        {(messages || []).filter(m => m.sender === conv.id).slice(-1)[0]?.text || "Aucun message"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            {/* Chat Area */}
            <Col lg={8} xl={9} className="h-100 d-flex flex-column bg-white">
              {/* Chat Header */}
              <header className="p-3 px-4 d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm">
                <div className="d-flex align-items-center gap-3">
                  <div className="position-relative">
                    <div className="avatar-circle sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>
                      {channels.find(c => c.id === activeTab)?.avatar}
                    </div>
                    <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-navy">{channels.find(c => c.id === activeTab)?.name}</h6>
                    <span className="extra-small text-muted fw-bold d-flex align-items-center gap-1">
                      <div className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></div> Connecté
                    </span>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface"><Phone size={20}/></Button>
                  <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-surface"><Video size={20}/></Button>
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="p-1 text-muted shadow-none border-0 no-caret">
                      <MoreVertical size={20} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-lg border-0 rounded-3 extra-small glass-card">
                      <Dropdown.Item className="fw-bold"><User size={14} className="me-2"/> Profil</Dropdown.Item>
                      <Dropdown.Item className="fw-bold text-danger">Signaler</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </header>

              {/* Messages Feed */}
              <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4 bg-surface-alt" ref={scrollRef}>
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className={`d-flex flex-column ${msg.sender === user?.role ? 'align-items-end' : 'align-items-start'}`}>
                    <div className={`message-bubble p-3 rounded-4 shadow-sm max-w-75 ${msg.sender === user?.role ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white border rounded-bottom-start-0'}`}>
                      <p className="mb-0 small fw-bold">{msg.text}</p>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1 px-2 extra-small text-muted fw-bold">
                      {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === user?.role && <CheckCheck size={14} className="text-primary"/>}
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="text-center p-5 text-muted extra-small fw-bold opacity-50">
                    Aucun message dans cette conversation.
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 px-4 border-top bg-white">
                <div className="d-flex align-items-center gap-3">
                  <Button variant="link" className="p-2 text-muted rounded-circle hover-bg-surface" onClick={() => fileRef.current?.click()}>
                    <Paperclip size={20}/>
                    <input type="file" ref={fileRef} className="d-none" />
                  </Button>
                  <div className="flex-grow-1 position-relative">
                    <Form.Control 
                      placeholder="Votre message..." 
                      className="rounded-pill border-0 shadow-none px-4 py-2 bg-surface-alt text-navy fw-bold"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                  </div>
                  <Button 
                    className="btn-premium rounded-circle d-flex align-items-center justify-content-center border-0 p-0" 
                    style={{ width: '42px', height: '42px' }}
                    onClick={handleSend}
                  >
                    <Send size={18}/>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default MessagesPage;
