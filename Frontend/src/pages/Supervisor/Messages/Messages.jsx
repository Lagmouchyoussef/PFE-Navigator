import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup, Dropdown } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MessageSquare, User, Check, CheckCheck, MoreVertical, X,
  UserPlus, Bell, Settings, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="supervisor-messages-layout py-4 h-100">
      <Container fluid className="px-4 h-100">
        <div className="glass-card border shadow-sm border overflow-hidden d-flex" style={{ height: 'calc(100vh - 160px)' }}>
          
          {/* Sidebar: Contacts List */}
          <div className="border-end d-flex flex-column bg-surface-alt" style={{ width: '320px', minWidth: '320px' }}>
            {/* Sidebar Header */}
            <div className="p-4 bg-white border-bottom shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold text-navy mb-0">Messages</h5>
                <Button variant="link" className="p-2 rounded-circle border-0 text-primary hover-bg-surface-alt transition-all">
                  <UserPlus size={20} />
                </Button>
              </div>
              
              <InputGroup className="bg-surface-alt rounded-pill border px-3 mb-3">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search students..." 
                  className="bg-transparent border-0 shadow-none extra-small py-2 fw-bold"
                />
              </InputGroup>

              <div className="d-flex gap-2">
                {['all', 'unread'].map((tab) => (
                  <Badge 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer px-3 py-2 rounded-pill border-0 transition-all extra-small fw-bold text-uppercase ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'bg-surface-alt text-muted opacity-75'}`}
                  >
                    {tab === 'all' ? 'All' : 'Unread'}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-grow-1 overflow-auto">
              {conversations.map((conv) => (
                <motion.div 
                  key={conv.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 d-flex gap-3 align-items-center cursor-pointer border-bottom border-light border-opacity-10 transition-all position-relative ${conv.id === 1 ? 'bg-white border-start border-4 border-primary shadow-sm' : 'hover-bg-white'}`}
                >
                  <div className="position-relative">
                    <div 
                      className="avatar-sm shadow-sm fw-bold text-white d-flex align-items-center justify-content-center rounded-circle" 
                      style={{ backgroundColor: conv.color, width: '45px', height: '45px', fontSize: '14px' }}
                    >
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                    )}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold small text-navy text-truncate">{conv.name}</div>
                      <div className="extra-small text-muted fw-bold opacity-50">{conv.time}</div>
                    </div>
                    <div className="extra-small text-primary fw-bold mb-1 opacity-75">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate opacity-75 fw-bold">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge pill bg="primary" className="shadow-sm border-0 extra-small fw-bold">{conv.unread}</Badge>
                  )}
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
                  <div className="avatar-sm bg-primary text-white shadow-sm fw-bold d-flex align-items-center justify-content-center rounded-circle" style={{ width: '45px', height: '45px' }}>AK</div>
                  <div className="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle shadow-sm" style={{ width: '12px', height: '12px' }}></div>
                </div>
                <div>
                  <h6 className="fw-bold text-navy mb-0">Ahmed Khalil</h6>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    <span className="extra-small text-success fw-bold">Online • PFE Student</span>
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
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-navy">View Profile</Dropdown.Item>
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-navy">Mute Notifications</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="rounded-3 py-2 fw-bold text-danger">Archive Discussion</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Messages Content */}
            <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3 bg-surface-alt">
              <div className="text-center my-4">
                <Badge className="bg-white text-muted border-0 shadow-sm px-3 py-2 rounded-pill extra-small fw-bold text-uppercase opacity-75">Today</Badge>
              </div>
              
              {chatMessages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`d-flex flex-column ${msg.sender === 'me' ? 'align-items-end' : 'align-items-start'}`}
                >
                  <div className={`p-3 rounded-4 shadow-sm transition-all ${msg.sender === 'me' ? 'bg-primary text-white rounded-bottom-end-0' : 'bg-white border rounded-bottom-start-0 text-navy'}`} style={{ maxWidth: '75%' }}>
                    <p className="mb-0 small fw-bold" style={{ lineHeight: '1.6' }}>{msg.text}</p>
                  </div>
                  <div className={`d-flex align-items-center gap-2 mt-1 px-1 extra-small text-muted fw-bold opacity-50 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
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
                    onKeyPress={(e) => e.key === 'Enter' && setInputText('')}
                  />
                </div>
                <Button 
                  className="btn-premium rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm border-0"
                  onClick={() => setInputText('')}
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
