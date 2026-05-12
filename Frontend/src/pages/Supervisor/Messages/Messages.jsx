import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MessageSquare, User, Check, CheckCheck, MoreVertical, X,
  UserPlus, Bell, Settings, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../SupervisorStyles.css';

const SupervisorMessages = () => {
  const [inputText, setInputText] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, unread, groups
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const [conversations] = useState([
    { id: 1, name: 'Ahmed Khalil', role: 'Étudiant PFE', lastMsg: 'J\'ai mis à jour le diagramme de classes...', time: '14:30', avatar: 'AK', color: '#3b82f6', online: true, unread: 2 },
    { id: 2, name: 'Sara Kamali', role: 'Étudiante PFE', lastMsg: 'Merci pour vos retours sur le chapitre 2.', time: '10:15', avatar: 'SK', color: '#10b981', online: true, unread: 0 },
    { id: 3, name: 'Bureau Coordination', role: 'Administration', lastMsg: 'Le planning des pré-soutenances est prêt.', time: 'Hier', avatar: 'BC', color: '#f59e0b', online: false, unread: 1 },
    { id: 4, name: 'Fatima Zahra', role: 'Étudiante PFE', lastMsg: 'Le code est disponible sur GitHub.', time: 'Hier', avatar: 'FZ', color: '#6366f1', online: false, unread: 0 },
    { id: 5, name: 'Mohamed Alaoui', role: 'Étudiant PFE', lastMsg: 'Pouvons-nous décaler notre réunion ?', time: '2j', avatar: 'MA', color: '#8b5cf6', online: true, unread: 0 },
    { id: 6, name: 'Youssef Amrani', role: 'Étudiant PFE', lastMsg: 'J\'ai un problème avec l\'API...', time: '3j', avatar: 'YA', color: '#f43f5e', online: false, unread: 0 },
  ]);

  const [chatMessages] = useState([
    { id: 1, text: 'Bonjour Ahmed, j\'ai bien reçu ton rapport.', time: '14:15', sender: 'me', status: 'read' },
    { id: 2, text: 'Super ! Avez-vous des remarques sur la partie architecture ?', time: '14:20', sender: 'partner' },
    { id: 3, text: 'Oui, j\'ai remarqué que tu n\'as pas détaillé le choix des microservices.', time: '14:25', sender: 'me', status: 'read' },
    { id: 4, text: 'J\'ai mis à jour le diagramme de classes et ajouté les justifications demandées.', time: '14:30', sender: 'partner' },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="sv-dashboard-layout messages-container">
      <Container fluid className="h-100 p-0 overflow-hidden rounded-4 shadow-lg bg-white border">
        <Row className="g-0 h-100" style={{ height: 'calc(100vh - 120px)' }}>
          
          {/* Sidebar: Contacts List */}
          <Col lg={4} xl={3} className="border-end d-flex flex-column bg-light bg-opacity-10">
            {/* Sidebar Header */}
            <div className="p-4 bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-black text-navy mb-0">Messages</h4>
                <div className="d-flex gap-2">
                  <Button variant="light" className="p-2 rounded-circle border-0 shadow-sm text-primary">
                    <UserPlus size={18} />
                  </Button>
                </div>
              </div>
              
              <InputGroup className="sv-search-group mb-3 border rounded-pill px-2">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher un étudiant..." 
                  className="bg-transparent border-0 shadow-none extra-small py-2"
                />
              </InputGroup>

              <div className="d-flex gap-2 mb-1">
                {['all', 'unread'].map((tab) => (
                  <Badge 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer px-3 py-2 rounded-pill border-0 transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-light text-muted'}`}
                    style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  >
                    {tab === 'all' ? 'Tous' : 'Non lus'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-grow-1 overflow-auto custom-scrollbar">
              {conversations.map((conv) => (
                <motion.div 
                  key={conv.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 d-flex gap-3 align-items-center cursor-pointer border-bottom transition-all position-relative ${conv.id === 1 ? 'bg-white border-start border-4 border-primary shadow-sm' : 'hover-bg-light'}`}
                >
                  <div className="position-relative">
                    <div 
                      className="sv-avatar shadow-sm fw-black text-white" 
                      style={{ backgroundColor: conv.color, width: '45px', height: '45px', fontSize: '14px' }}
                    >
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                    )}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-black small text-navy text-truncate">{conv.name}</div>
                      <div className="extra-small text-muted fw-bold">{conv.time}</div>
                    </div>
                    <div className="extra-small text-primary fw-bold mb-1 opacity-75">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate opacity-75">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge pill bg="primary" className="shadow-sm" style={{ fontSize: '0.6rem', padding: '4px 6px' }}>{conv.unread}</Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </Col>

          {/* Main Chat Area */}
          <Col lg={8} xl={9} className="d-flex flex-column bg-white">
            {/* Chat Header */}
            <header className="p-3 px-4 d-flex justify-content-between align-items-center border-bottom bg-white shadow-sm z-index-1">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="sv-avatar bg-primary text-white shadow-sm fw-black" style={{ width: '45px', height: '45px' }}>AK</div>
                  <div className="status-dot position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <div>
                  <h6 className="fw-black text-navy mb-0">Ahmed Khalil</h6>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <div className="bg-success rounded-circle animate-pulse" style={{ width: '8px', height: '8px' }}></div>
                    <span className="extra-small text-success fw-bold">En ligne • Étudiant PFE</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="light" className="p-2 rounded-circle border-0 text-muted hover-text-primary transition-all"><Phone size={20}/></Button>
                <Button variant="light" className="p-2 rounded-circle border-0 text-muted hover-text-primary transition-all"><Video size={20}/></Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-0 rounded-4 extra-small p-2">
                    <Dropdown.Item className="rounded-3 py-2 fw-bold"><User size={14} className="me-2 text-primary"/> Voir profil étudiant</Dropdown.Item>
                    <Dropdown.Item className="rounded-3 py-2 fw-bold"><Bell size={14} className="me-2 text-warning"/> Sourdine</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-danger"><X size={14} className="me-2"/> Archiver la discussion</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Messages Content */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-light bg-opacity-10 custom-scrollbar" ref={scrollRef}>
              <div className="text-center my-4">
                <Badge bg="white" className="text-muted border shadow-sm px-3 py-2 rounded-pill extra-small fw-bold uppercase letter-spacing-1">Aujourd'hui</Badge>
              </div>
              
              {chatMessages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`d-flex flex-column ${msg.sender === 'me' ? 'align-items-end' : 'align-items-start'}`}
                >
                  <div className={`p-3 rounded-4 shadow-sm max-w-75 transition-all ${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-0' : 'bg-white border rounded-tl-0 text-navy'}`}>
                    <p className="mb-0 small fw-medium" style={{ lineHeight: '1.6' }}>{msg.text}</p>
                  </div>
                  <div className={`d-flex align-items-center gap-2 mt-1 px-1 extra-small text-muted fw-bold ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && (
                      msg.status === 'read' ? <CheckCheck size={14} className="text-primary"/> : <Check size={14}/>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input Bar */}
            <div className="p-3 px-4 border-top bg-white">
              <div className="d-flex align-items-center gap-3">
                <Button variant="light" className="p-2 rounded-circle border-0 text-muted hover-bg-primary hover-text-white transition-all shadow-sm" onClick={() => fileRef.current?.click()}>
                  <Paperclip size={20}/>
                  <input type="file" ref={fileRef} className="d-none" />
                </Button>
                <div className="flex-grow-1">
                  <Form.Control 
                    placeholder="Écrivez votre message ici..." 
                    className="rounded-pill border-0 shadow-sm px-4 py-2 bg-light bg-opacity-50 text-navy extra-small fw-medium"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && setInputText('')}
                  />
                </div>
                <Button 
                  className="sv-btn-gradient rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm border-0"
                  onClick={() => setInputText('')}
                >
                  <span className="d-none d-md-inline extra-small fw-bold uppercase">Envoyer</span>
                  <Send size={18}/>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .messages-container {
          height: calc(100vh - 100px);
          padding-bottom: 20px;
        }
        .max-w-75 { max-width: 75%; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0,0,0,0.2);
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .letter-spacing-1 { letter-spacing: 1px; }
        .rounded-tr-0 { border-top-right-radius: 0 !important; }
        .rounded-tl-0 { border-top-left-radius: 0 !important; }
        .hover-text-primary:hover { color: #2563eb !important; }
      `}</style>
    </div>
  );
};

export default SupervisorMessages;
