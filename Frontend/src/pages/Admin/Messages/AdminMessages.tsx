import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  User, Check, CheckCheck, MoreVertical
} from 'lucide-react';

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMsg: string;
  time: string;
  avatar: string;
  color: string;
  online: boolean;
  unread: number;
}

interface ChatMessage {
  id: number;
  text: string;
  time: string;
  sender: 'me' | 'partner';
  status?: 'sent' | 'read';
}

const AdminMessages: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [conversations] = useState<Conversation[]>([
    { id: 1, name: 'Dr. Sarah Smith', role: 'Superviseur de Projet', lastMsg: 'Excellent travail sur le rapport...', time: '2h', avatar: 'DS', color: '#3b82f6', online: true, unread: 2 },
    { id: 2, name: 'Ahmed Ben Ali', role: 'Étudiant', lastMsg: 'Pouvons-nous nous voir demain ?', time: '5h', avatar: 'AA', color: '#10b981', online: true, unread: 0 },
    { id: 3, name: 'Bureau Coordination PFE', role: 'Administration', lastMsg: 'Rappel : Planning des soutenances...', time: 'Hier', avatar: 'BC', color: '#f59e0b', online: false, unread: 1 },
    { id: 4, name: 'Fatima Zahra', role: 'Étudiante', lastMsg: 'J\'ai terminé la documentation', time: '2j', avatar: 'FZ', color: '#6366f1', online: false, unread: 0 },
  ]);

  const [chatMessages] = useState<ChatMessage[]>([
    { id: 1, text: 'Bonjour Professeur ! J\'ai terminé le rapport intérimaire.', time: '10:30', sender: 'me', status: 'read' },
    { id: 2, text: 'Parfait ! Je vais le consulter et je reviens vers vous.', time: '10:35', sender: 'partner' },
    { id: 3, text: 'J\'ai revu votre rapport. Globalement, c\'est un excellent travail !', time: '14:15', sender: 'partner' },
    { id: 4, text: 'Cependant, les sections 3.2 et 4.1 méritent quelques précisions supplémentaires.', time: '14:16', sender: 'partner' },
    { id: 5, text: 'Merci pour votre retour ! Je m\'en occupe immédiatement.', time: '14:45', sender: 'me', status: 'sent' }
  ]);

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
                  placeholder="Rechercher..." 
                  className="bg-transparent border-0 shadow-none small py-2 text-navy"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto conversations-list">
              {conversations.map((conv) => (
                <div key={conv.id} className={`conv-item p-4 d-flex gap-3 align-items-center cursor-pointer border-bottom transition-all ${conv.id === 1 ? 'active-conv' : 'hover-bg-surface'}`}>
                  <div className="position-relative">
                    <div className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ backgroundColor: conv.color, width: '48px', height: '48px' }}>{conv.avatar}</div>
                    {conv.online && <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></div>}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between mb-1">
                      <div className="fw-bold small text-truncate text-navy">{conv.name}</div>
                      <div className="extra-small text-muted fw-bold">{conv.time}</div>
                    </div>
                    <div className="extra-small text-muted mb-1 fw-bold opacity-75">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate fw-bold opacity-75">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge pill bg="primary" className="ms-auto" style={{ fontSize: '0.65rem' }}>{conv.unread}</Badge>
                  )}
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
                  <div className="avatar-circle sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>DS</div>
                  <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Dr. Sarah Smith</h6>
                  <span className="extra-small text-muted fw-bold d-flex align-items-center gap-1">
                    <div className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></div> En ligne • Superviseur
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
                    <Dropdown.Item className="fw-bold"><User size={14} className="me-2"/> Voir profil</Dropdown.Item>
                    <Dropdown.Item className="fw-bold"><Search size={14} className="me-2"/> Rechercher</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger fw-bold">Bloquer</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Messages Feed */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-4" ref={scrollRef}>
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`d-flex flex-column ${msg.sender === 'me' ? 'align-items-end' : 'align-items-start'}`}>
                  <div className={`message-bubble p-3 rounded-4 shadow-sm max-w-75 ${msg.sender === 'me' ? 'bg-primary text-white' : 'glass-card'}`}>
                    <p className="mb-0 small fw-bold">{msg.text}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-1 px-2 extra-small text-muted fw-bold">
                    {msg.time}
                    {msg.sender === 'me' && (
                      msg.status === 'read' ? <CheckCheck size={14} className="text-primary"/> : <Check size={14}/>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 px-4 border-top bg-surface">
              <div className="d-flex align-items-center gap-3">
                <Button variant="link" className="p-2 text-muted rounded-circle hover-bg-surface" onClick={() => fileRef.current?.click()}>
                  <Paperclip size={20}/>
                  <input type="file" ref={fileRef} className="d-none" />
                </Button>
                <div className="flex-grow-1 position-relative">
                  <Form.Control 
                    placeholder="Tapez votre message..." 
                    className="rounded-pill border shadow-none px-4 py-2 bg-surface-alt text-navy"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </div>
                <Button className="btn-premium rounded-circle d-flex align-items-center justify-content-center p-0" style={{ width: '42px', height: '42px' }}>
                  <Send size={18}/>
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
