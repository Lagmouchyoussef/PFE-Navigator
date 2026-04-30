import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { 
  Send, Search, Paperclip, Phone, Video, 
  MoreVertical, Check, CheckCheck, Users, 
  MessageSquare, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import './MessagesPage.css';

const MessagesPage = () => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const conversations = [
    { 
      id: 1, 
      name: 'Dr. Sarah Smith', 
      role: 'Project Supervisor', 
      lastMsg: 'Great work on the interim report. Jus...', 
      time: '2 hours ago', 
      unread: 2, 
      online: true, 
      avatar: 'DS',
      color: '#1e293b'
    },
    { 
      id: 2, 
      name: 'Ahmed Ben Ali', 
      role: 'Student - Team Member', 
      lastMsg: 'Can we meet tomorrow to discuss the impl...', 
      time: '5 hours ago', 
      unread: 0, 
      online: true, 
      avatar: 'AA',
      color: '#3b82f6'
    },
    { 
      id: 3, 
      name: 'PFE Coordination Office', 
      role: 'Administration', 
      lastMsg: 'Reminder: Defense schedule will be p...', 
      time: '1 day ago', 
      unread: 1, 
      online: false, 
      avatar: 'PO',
      color: '#10b981'
    },
    { 
      id: 4, 
      name: 'Fatima Zahra', 
      role: 'Student - Team Member', 
      lastMsg: 'I finished the documentation part', 
      time: '2 days ago', 
      unread: 0, 
      online: false, 
      avatar: 'FZ',
      color: '#8b5cf6'
    }
  ];

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
      <Container fluid className="h-100 p-0">
        <Row className="g-0 h-100">
          {/* Sidebar */}
          <Col lg={4} xl={3} className="border-end bg-white h-100 d-flex flex-column">
            <div className="p-4">
              <h4 className="fw-bold text-navy mb-4">Messages</h4>
              <InputGroup className="bg-light rounded-3 border-0 search-bar">
                <InputGroup.Text className="bg-transparent border-0 pe-1">
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search conversations..." 
                  className="bg-transparent border-0 shadow-none small"
                />
              </InputGroup>
            </div>

            <div className="flex-grow-1 overflow-auto conversations-list">
              {conversations.map((conv) => (
                <div key={conv.id} className={`conv-item p-3 d-flex gap-3 align-items-center ${conv.id === 1 ? 'active' : ''}`}>
                  <div className="position-relative">
                    <div className="avatar-circle" style={{ backgroundColor: conv.color }}>{conv.avatar}</div>
                    {conv.online && <div className="status-dot online"></div>}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold small text-navy text-truncate">{conv.name}</div>
                      <div className="extra-small text-muted">{conv.time}</div>
                    </div>
                    <div className="extra-small text-muted mb-1">{conv.role}</div>
                    <p className="extra-small text-muted mb-0 text-truncate">{conv.lastMsg}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge pill bg="primary" className="unread-badge">{conv.unread}</Badge>
                  )}
                </div>
              ))}
            </div>
          </Col>

          {/* Chat Area */}
          <Col lg={8} xl={9} className="h-100 d-flex flex-column bg-white">
            {/* Chat Header */}
            <header className="chat-header p-3 px-4 border-bottom d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <div className="avatar-circle sm bg-navy text-white">DS</div>
                  <div className="status-dot online"></div>
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Dr. Sarah Smith</h6>
                  <div className="extra-small text-muted">Online • Project Supervisor</div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="text-muted p-2 hover-light"><Phone size={20}/></Button>
                <Button variant="link" className="text-muted p-2 hover-light"><Video size={20}/></Button>
                <Button variant="link" className="text-muted p-2 hover-light"><MoreVertical size={20}/></Button>
              </div>
            </header>

            {/* Message Area */}
            <div ref={scrollRef} className="flex-grow-1 p-4 overflow-auto message-canvas d-flex flex-column gap-4">
              {chatMessages.map((msg) => {
                const isMe = msg.sender === 'me';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`d-flex ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
                  >
                    <div className={`message-bubble-wrapper ${isMe ? 'mine' : 'theirs'}`}>
                      <div className="bubble">
                        {msg.text}
                      </div>
                      <div className="bubble-meta d-flex align-items-center gap-2 mt-1">
                        <span className="extra-small text-muted">{msg.time}</span>
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
            <footer className="chat-footer p-4 border-top">
              <div className="d-flex align-items-center gap-3">
                <Button variant="link" className="text-muted p-0"><Paperclip size={24}/></Button>
                <InputGroup className="bg-white rounded-pill border shadow-none px-3 py-1">
                  <Form.Control 
                    placeholder="Type your message..." 
                    className="border-0 shadow-none small fw-medium"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </InputGroup>
                <Button className="btn-send d-flex align-items-center gap-2 px-4 py-2">
                  <Send size={18} /> Send
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

