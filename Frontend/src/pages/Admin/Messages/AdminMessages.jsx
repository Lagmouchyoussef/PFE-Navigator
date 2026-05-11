import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MessageSquare, User, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminMessages = () => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const [conversations] = useState([
    { id: 1, name: 'Dr. Sarah Smith', role: 'Superviseur de Projet', lastMsg: 'Excellent travail sur le rapport...', time: '2h', avatar: 'DS', color: '#3b82f6', online: true, unread: 2 },
    { id: 2, name: 'Ahmed Ben Ali', role: 'Étudiant', lastMsg: 'Pouvons-nous nous voir demain ?', time: '5h', avatar: 'AA', color: '#10b981', online: true, unread: 0 },
    { id: 3, name: 'Bureau Coordination PFE', role: 'Administration', lastMsg: 'Rappel : Planning des soutenances...', time: 'Hier', avatar: 'BC', color: '#f59e0b', online: false, unread: 1 },
    { id: 4, name: 'Fatima Zahra', role: 'Étudiante', lastMsg: 'J\'ai terminé la documentation', time: '2j', avatar: 'FZ', color: '#6366f1', online: false, unread: 0 },
  ]);

  const [chatMessages] = useState([
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
        <Row className="g-0 h-100" style={{ height: 'calc(100vh - 64px)' }}>
          {/* Sidebar */}
          <Col lg={4} xl={3} className="messages-sidebar h-100 d-flex flex-column border-end bg-white shadow-sm">
            <div className="p-4 border-bottom">
              <h4 className="fw-bold text-dark mb-4">Messages</h4>
              <InputGroup className="bg-light rounded-pill border-0 px-2 overflow-hidden">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher..." 
                  className="bg-transparent border-0 shadow-none small py-2"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto conversations-list">
              {conversations.map((conv) => (
                <div key={conv.id} className={`conv-item p-3 d-flex gap-3 align-items-center cursor-pointer border-bottom transition-all ${conv.id === 1 ? 'bg-primary bg-opacity-10 border-start border-primary border-4' : 'hover-bg-light'}`}>
                  <div className="position-relative">
                    <div className="avatar-circle rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style={{ backgroundColor: conv.color, width: '45px', height: '45px' }}>{conv.avatar}</div>
                    {conv.online && <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '12px', height: '12px' }}></div>}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between">
                      <div className="fw-bold small text-dark text-truncate">{conv.name}</div>
                      <div className="extra-small text-muted">{conv.time}</div>
                    </div>
                    <div className="extra-small text-muted mb-1 opacity-75">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge pill bg="primary" className="ms-auto">{conv.unread}</Badge>
                  )}
                </div>
              ))}
            </div>
          </Col>

          {/* Chat Area */}
          <Col lg={8} xl={9} className="h-100 d-flex flex-column bg-light">
            {/* Chat Header */}
            <header className="p-3 px-4 d-flex justify-content-between align-items-center bg-white border-bottom shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="avatar-circle sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '40px', height: '40px' }}>DS</div>
                  <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle" style={{ width: '10px', height: '10px' }}></div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark">Dr. Sarah Smith</h6>
                  <span className="extra-small text-muted fw-bold d-flex align-items-center gap-1">
                    <div className="bg-success rounded-circle" style={{ width: '6px', height: '6px' }}></div> En ligne • Superviseur
                  </span>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="text-muted p-1 hover-bg-light rounded-circle"><Phone size={20}/></Button>
                <Button variant="link" className="text-muted p-1 hover-bg-light rounded-circle"><Video size={20}/></Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-0 rounded-3 extra-small">
                    <Dropdown.Item>Voir le profil</Dropdown.Item>
                    <Dropdown.Item>Muter les notifications</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger">Bloquer</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3">
              <div className="text-center my-4">
                <Badge bg="white" className="text-muted border fw-bold px-3 py-1 rounded-pill extra-small">Aujourd'hui</Badge>
              </div>
              
              {chatMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div className="max-w-75">
                      <div className={`p-3 rounded-4 shadow-sm ${isMe ? 'bg-primary text-white' : 'bg-white text-dark'}`} style={{ borderRadius: isMe ? '20px 20px 0 20px' : '20px 20px 20px 0' }}>
                        {msg.text}
                      </div>
                      <div className={`d-flex align-items-center gap-2 mt-1 px-1 ${isMe ? 'justify-content-end' : ''}`}>
                        <span className="extra-small text-muted fw-bold">{msg.time}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={14} className="text-primary" /> : <Check size={14} className="text-muted" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Input Footer */}
            <footer className="p-4 bg-white border-top">
              <input type="file" ref={fileRef} className="d-none" />
              <div className="d-flex align-items-center gap-3 bg-light rounded-pill px-3 py-2 border shadow-sm">
                <Button 
                  variant="link" 
                  className="text-primary p-0 border-0 shadow-none"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip size={20}/>
                </Button>
                <Form.Control 
                  placeholder="Écrivez votre message..." 
                  className="border-0 bg-transparent shadow-none small fw-bold"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button 
                  className="bg-primary text-white border-0 rounded-circle d-flex align-items-center justify-content-center p-2 shadow-sm"
                  onClick={() => setInputText('')}
                >
                  <Send size={18} />
                </Button>
              </div>
            </footer>
          </Col>
        </Row>
      </Container>

      <style>{`
        .admin-messages-pro-layout {
          background-color: #f8fafc;
          height: calc(100vh - 64px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .hover-bg-light:hover { background-color: #f1f5f9; }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .bg-primary { background-color: #2563eb !important; }
        .max-w-75 { max-width: 75%; }
        .no-caret::after { display: none; }
        .conv-item.active {
          background-color: rgba(37, 99, 235, 0.05);
          border-left: 4px solid #2563eb !important;
        }
        .conversations-list::-webkit-scrollbar { width: 4px; }
        .conversations-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminMessages;
