import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge, InputGroup } from 'react-bootstrap';
import { 
  Send, Search, User, MoreVertical, Paperclip, Smile, 
  CheckCheck, Phone, Video, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const MessagesPage = () => {
  const { session, messages, sendMessage, markMessagesRead } = useApp();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    markMessagesRead(session.role);
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText, session.role);
    setInputText('');
  };

  const isJury = session.role === 'jury';
  const partnerName = isJury ? 'Youssef Mourad' : 'Prof. Youssef';
  const partnerRole = isJury ? 'PFE Student' : 'Jury Member';

  return (
    <div className="dashboard-container bg-light h-100 p-4">
      <Row className="g-4 h-100" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Sidebar: Threads */}
        <Col lg={4} xl={3} className="h-100 d-none d-lg-block">
          <Card className="border-0 shadow-sm h-100 overflow-hidden bg-white rounded-3">
            <div className="p-3 border-bottom">
              <h6 className="fw-bold mb-3">Recent Conversations</h6>
              <InputGroup size="sm" className="bg-light rounded-pill px-2 border">
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-1"><Search size={14}/></InputGroup.Text>
                <Form.Control placeholder="Search..." className="bg-transparent border-0 shadow-none extra-small" />
              </InputGroup>
            </div>
            <div className="overflow-auto">
              <div className="p-3 bg-primary bg-opacity-5 border-start border-3 border-primary d-flex align-items-center gap-3 cursor-pointer">
                <div className="avatar-circle-sm bg-primary text-white fw-bold">{partnerName[0]}</div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-bold">{partnerName}</span>
                    <span className="extra-small text-muted">10:15</span>
                  </div>
                  <p className="extra-small text-muted mb-0 text-truncate">{messages[messages.length - 1]?.text || 'No messages'}</p>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Chat Window */}
        <Col lg={8} xl={9} className="h-100">
          <Card className="border-0 shadow-sm h-100 d-flex flex-column overflow-hidden bg-white rounded-3">
            {/* Header */}
            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
              <div className="d-flex align-items-center gap-3">
                <div className="avatar-circle-sm bg-light text-primary fw-bold">{partnerName[0]}</div>
                <div>
                  <h6 className="fw-bold mb-0">{partnerName}</h6>
                  <div className="d-flex align-items-center gap-1">
                    <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    <span className="extra-small text-muted fw-medium">{partnerRole} • Active Now</span>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-2">
                <Button variant="link" className="p-2 text-muted hover-bg-light rounded-circle"><Phone size={18}/></Button>
                <Button variant="link" className="p-2 text-muted hover-bg-light rounded-circle"><Video size={18}/></Button>
                <Button variant="link" className="p-2 text-muted hover-bg-light rounded-circle"><MoreVertical size={18}/></Button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow-1 p-4 overflow-auto d-flex flex-column gap-3 bg-light bg-opacity-30"
            >
              <div className="text-center my-3">
                <Badge bg="light" text="dark" className="border px-3 py-1 rounded-pill extra-small fw-bold">Official Communication Channel</Badge>
              </div>

              {messages.map((msg) => {
                const isMine = msg.sender === session.role;
                return (
                  <div key={msg.id} className={`d-flex ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div 
                      className={`p-3 rounded-3 shadow-sm ${
                        isMine 
                          ? 'bg-primary text-white rounded-tr-0' 
                          : 'bg-white text-dark border rounded-tl-0'
                      }`}
                      style={{ maxWidth: '75%' }}
                    >
                      <p className="mb-1 small fw-medium">{msg.text}</p>
                      <div className={`d-flex align-items-center gap-1 extra-small opacity-75 ${isMine ? 'justify-content-end' : 'justify-content-start'}`}>
                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMine && <CheckCheck size={12} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-top">
              <Form onSubmit={handleSend}>
                <InputGroup className="bg-light rounded-pill overflow-hidden border p-1">
                  <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-gray-200 ms-1"><Paperclip size={18}/></Button>
                  <Form.Control 
                    placeholder="Type a message..." 
                    className="bg-transparent border-0 shadow-none px-3 py-2 small fw-medium"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <Button variant="link" className="text-muted p-2 rounded-circle hover-bg-gray-200"><Smile size={18}/></Button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="rounded-pill px-4 fw-bold small border-0 ms-1"
                    disabled={!inputText.trim()}
                  >
                    Send
                  </Button>
                </InputGroup>
              </Form>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MessagesPage;
