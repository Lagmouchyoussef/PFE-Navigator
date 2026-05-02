import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MessageSquare, User, Check, CheckCheck, MoreVertical
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './MessagesPage.css';

const MessagesPage = () => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const [conversations] = useState([
    { id: 1, name: 'Dr. Sarah Smith', role: 'Project Supervisor', lastMsg: 'Great work on the interim report. Jus...', time: '2 hours ago', avatar: 'DS', color: '#3b82f6', online: true, unread: 2 },
    { id: 2, name: 'Ahmed Ben Ali', role: 'Student - Team Member', lastMsg: 'Can we meet tomorrow to discuss the impl...', time: '5 hours ago', avatar: 'AA', color: '#10b981', online: true, unread: 0 },
    { id: 3, name: 'PFE Coordination Office', role: 'Administration', lastMsg: 'Reminder: Defense schedule will be p...', time: '1 day ago', avatar: 'PO', color: '#f59e0b', online: false, unread: 1 },
    { id: 4, name: 'Fatima Zahra', role: 'Student - Team Member', lastMsg: 'I finished the documentation part', time: '2 days ago', avatar: 'FZ', color: '#6366f1', online: false, unread: 0 },
    { id: 5, name: 'Prof. Mohamed Alaoui', role: 'Jury Member', lastMsg: 'Please send me the latest source code.', time: '3 days ago', avatar: 'MA', color: '#ec4899', online: false, unread: 0 },
    { id: 6, name: 'Leila Mansouri', role: 'Student', lastMsg: 'The diagrams are ready for review.', time: '4 days ago', avatar: 'LM', color: '#8b5cf6', online: true, unread: 0 },
    { id: 7, name: 'Support Technique', role: 'Helpdesk', lastMsg: 'Your password has been successfully reset.', time: '1 week ago', avatar: 'ST', color: '#64748b', online: false, unread: 0 },
  ]);

  const chatMessages = [
    { id: 1, text: 'Hello Professor! I have completed the interim report and uploaded it to the portal.', time: '10:30 AM', sender: 'me', status: 'read' },
    { id: 2, text: 'Great! Let me review it and I will get back to you with feedback.', time: '10:35 AM', sender: 'partner' },
    { id: 3, text: 'I have reviewed your interim report. Overall, excellent work!', time: '2:15 PM', sender: 'partner' },
    { id: 4, text: 'However, sections 3.2 and 4.1 need some revisions. Please provide more details on the methodology and expand on the implementation approach.', time: '2:16 PM', sender: 'partner' },
    { id: 5, text: 'Thank you for the feedback, Professor! I will work on those sections right now.', time: '2:45 PM', sender: 'me', status: 'sent' }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="messages-page-layout">
      <Container fluid className="h-100 p-0 overflow-hidden">
        <Row className="g-0 h-100">
          {/* Sidebar */}
          <Col lg={4} xl={3} className="messages-sidebar h-100 d-flex flex-column shadow-sm">
            <div className="p-4 border-bottom bg-surface-sidebar">
              <h4 className="fw-black text-gradient-primary mb-4">Chat Space</h4>
              <InputGroup className="search-bar-modern rounded-pill border-0">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search contacts..." 
                  className="bg-transparent border-0 shadow-none small fw-medium"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto conversations-list bg-white-soft">
              {conversations.map((conv) => (
                <div key={conv.id} className={`conv-item p-3 d-flex gap-3 align-items-center ${conv.id === 1 ? 'active' : ''}`}>
                  <div className="position-relative">
                    <div className="avatar-circle-modern shadow-sm" style={{ backgroundColor: conv.color }}>{conv.avatar}</div>
                    {conv.online && <div className="status-dot online"></div>}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-bold small text-navy text-truncate">{conv.name}</div>
                    <div className="extra-small text-muted mb-1 opacity-75">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate font-italic">{conv.lastMsg}</p>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-2 flex-shrink-0">
                    <div className="extra-small text-muted" style={{ whiteSpace: 'nowrap' }}>{conv.time}</div>
                    {conv.unread > 0 && (
                      <Badge pill className="unread-badge-gradient">{conv.unread}</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Col>

          {/* Chat Area */}
          <Col lg={8} xl={9} className="h-100 d-flex flex-column chat-main-canvas">
            {/* Chat Header */}
            <header className="chat-header-glass p-3 px-4 d-flex justify-content-between align-items-center shadow-sm">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="avatar-circle sm bg-navy text-white shadow-sm">DS</div>
                  <div className="status-dot online"></div>
                </div>
                <div>
                  <h6 className="fw-black mb-0 text-navy">Dr. Sarah Smith</h6>
                  <div className="d-flex align-items-center gap-2">
                    <div className="dot bg-success"></div>
                    <span className="extra-small text-muted fw-semibold">Active Now • Project Supervisor</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="action-icon-btn"><Phone size={20}/></Button>
                <Button variant="link" className="action-icon-btn"><Video size={20}/></Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                    <MoreVertical size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                    <Dropdown.Item>Voir le profil</Dropdown.Item>
                    <Dropdown.Item>Muter les notifications</Dropdown.Item>
                    <Dropdown.Item>Rechercher dans la discussion</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger">Bloquer le contact</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </header>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-grow-1 p-4 overflow-auto message-canvas d-flex flex-column gap-3">
              <div className="text-center my-4">
                <Badge bg="light" className="text-muted fw-bold px-3 py-2 rounded-pill border">Today, May 01</Badge>
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
                    <div className={`message-bubble-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                      <div className="bubble shadow-sm">
                        {msg.text}
                      </div>
                      <div className="bubble-meta d-flex align-items-center gap-2 mt-2 px-1">
                        <span className="extra-small text-muted fw-medium">{msg.time}</span>
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
            <footer className="chat-footer-modern p-4">
              <div className="d-flex align-items-center gap-3 bg-white rounded-4 shadow-sm border p-2">
                <Button variant="link" className="text-primary hover-bg-light rounded-circle p-2"><Paperclip size={22}/></Button>
                <Form.Control 
                  placeholder="Share your thoughts with Dr. Sarah Smith..." 
                  className="border-0 shadow-none small fw-medium bg-transparent"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <Button className="btn-send-modern d-flex align-items-center justify-content-center p-2 rounded-circle">
                  <Send size={20} className="ms-1" />
                </Button>
              </div>
            </footer>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MessagesPage;

