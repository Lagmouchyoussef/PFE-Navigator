import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Calendar, Users, Bell, Bookmark, ChevronRight,
  MoreVertical, Filter, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import './AdministrativeNotesPage.css';

const AdministrativeNotesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const stats = [
    { label: 'Total Notes', count: 8, icon: <FileText size={20} />, color: 'primary' },
    { label: 'Unread', count: 3, icon: <Bell size={20} />, color: 'danger' },
    { label: 'Pinned', count: 3, icon: <Pin size={20} />, color: 'warning' },
    { label: 'High Priority', count: 4, icon: <AlertCircle size={20} />, color: 'danger' }
  ];

  const notes = [
    {
      id: 1,
      title: 'Defense Schedule Release - Important Update',
      isNew: true,
      priority: 'HIGH',
      category: 'Defense',
      content: 'The final defense schedules for all PFE students will be published on May 5th, 2026. Please check your email and student portal regularly. Room assignments will be sent 48 hours before your scheduled defense. Make sure to arrive 15 minutes early.',
      author: 'PFE Coordination Office',
      date: '2026-04-28',
      pinned: true,
      unread: true
    },
    {
      id: 2,
      title: 'Submission Deadline Reminder',
      isNew: true,
      priority: 'HIGH',
      category: 'Deadlines',
      content: 'Final reports must be submitted by May 15th, 2026 at 11:59 PM through the online portal. Late submissions will incur a penalty of 5 points per day. Extensions are only granted in exceptional circumstances with proper documentation.',
      author: 'Academic Affairs',
      date: '2026-04-27',
      pinned: true,
      unread: true
    },
    {
      id: 3,
      title: 'Mandatory Defense Presentation Workshop',
      isNew: true,
      priority: 'HIGH',
      category: 'Workshops',
      content: 'All students are required to attend the defense presentation skills workshop on May 8th, 2026 at 2:00 PM in Auditorium B. The workshop will cover presentation techniques, Q&A strategies, and common mistakes to avoid. Attendance will be recorded.',
      author: 'Professional Development Office',
      date: '2026-04-23',
      pinned: true,
      unread: true
    },
    {
      id: 4,
      title: 'New Evaluation Criteria Published',
      isNew: false,
      priority: 'MEDIUM',
      category: 'Evaluation',
      content: 'The updated evaluation rubric for PFE 2026 has been published in the Resource Hub. Key changes include increased weight for innovation (15% vs 10% previously) and technical implementation quality. Please review the criteria carefully.',
      author: 'Dr. Ahmed Mansouri',
      date: '2026-04-25',
      pinned: false,
      unread: false
    },
    {
      id: 5,
      title: 'Library Access Extended for PFE Students',
      isNew: false,
      priority: 'LOW',
      category: 'Facilities',
      content: 'Great news! The university library will extend its hours during May to support PFE students. The library will be open until 11:00 PM on weekdays and 8:00 PM on weekends. Study rooms can be reserved online.',
      author: 'Library Administration',
      date: '2026-04-24',
      pinned: false,
      unread: false
    },
    {
      id: 6,
      title: 'Code Repository Submission Requirements',
      isNew: false,
      priority: 'MEDIUM',
      category: 'Technical',
      content: 'For software-based projects, you must submit your complete code repository (GitHub/GitLab link) along with your final report. Ensure your repository includes: README file, installation instructions, documentation, and a demo video if applicable.',
      author: 'Technical Committee',
      date: '2026-04-22',
      pinned: false,
      unread: false
    },
    {
      id: 7,
      title: 'Plagiarism Detection Notice',
      isNew: false,
      priority: 'HIGH',
      category: 'Policies',
      content: 'All submitted reports will be checked using advanced plagiarism detection software. Any case of plagiarism will result in immediate failure and potential disciplinary action. Properly cite all sources and use quotation marks for direct quotes.',
      author: 'Academic Integrity Office',
      date: '2026-04-20',
      pinned: false,
      unread: false
    },
    {
      id: 8,
      title: 'Defense Presentation Format Guidelines',
      isNew: false,
      priority: 'MEDIUM',
      category: 'Defense',
      content: 'Your defense presentation should be 25-30 minutes long, followed by 15-20 minutes of Q&A. Recommended structure: Introduction (5 min), Literature Review (5 min), Methodology (5 min), Implementation (7 min), Results (5 min), Conclusion (3 min).',
      author: 'Evaluation Committee',
      date: '2026-04-18',
      pinned: false,
      unread: false
    }
  ];

  const pinnedNotes = notes.filter(n => n.pinned);
  const otherNotes = notes.filter(n => !n.pinned);

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH': return <Badge bg="danger" className="priority-badge">HIGH</Badge>;
      case 'MEDIUM': return <Badge bg="warning" className="priority-badge text-dark">MEDIUM</Badge>;
      case 'LOW': return <Badge bg="success" className="priority-badge">LOW</Badge>;
      default: return null;
    }
  };

  return (
    <div className="admin-notes-layout">
      <Container className="py-4">
        {/* Header */}
        <div className="mb-5">
          <h2 className="fw-bold text-navy">Administrative Notes & Announcements</h2>
          <p className="text-muted">Important updates and notifications from the administration</p>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col md={3} key={i}>
              <Card className="stats-card border-0 shadow-sm p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <div className={`stats-icon bg-${s.color} bg-opacity-10 text-${s.color}`}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="extra-small text-muted fw-bold text-uppercase">{s.label}</div>
                    <h3 className="fw-bold text-navy mb-0">{s.count}</h3>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          <InputGroup className="bg-white rounded-3 shadow-sm search-bar" style={{ maxWidth: '400px' }}>
            <InputGroup.Text className="bg-transparent border-0">
              <Search size={18} className="text-muted" />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search notes..." 
              className="border-0 shadow-none small fw-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <div className="d-flex bg-white rounded-3 shadow-sm p-1">
            <Button 
              variant={filter === 'all' ? 'primary' : 'white'} 
              size="sm" 
              className="rounded-3 px-4 fw-bold"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'unread' ? 'primary' : 'white'} 
              size="sm" 
              className="rounded-3 px-4 fw-bold ms-1"
              onClick={() => setFilter('unread')}
            >
              Unread only
            </Button>
          </div>
        </div>

        {/* Pinned Notes Section */}
        <div className="mb-5">
          <h5 className="fw-bold text-navy mb-4 d-flex align-items-center gap-2">
            <Pin size={18} className="text-warning" /> Pinned Notes
          </h5>
          <div className="notes-grid">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} getPriorityBadge={getPriorityBadge} />
            ))}
          </div>
        </div>

        {/* All Notes Section */}
        <div>
          <h5 className="fw-bold text-navy mb-4">All Notes</h5>
          <div className="notes-grid">
            {otherNotes.map((note) => (
              <NoteCard key={note.id} note={note} getPriorityBadge={getPriorityBadge} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

const NoteCard = ({ note, getPriorityBadge }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
    <Card className={`note-card border-0 shadow-sm mb-4 ${note.unread ? 'is-unread' : ''}`}>
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            {note.isNew && <Badge bg="primary" className="new-badge">New</Badge>}
            {getPriorityBadge(note.priority)}
            <Badge bg="light" text="dark" className="category-badge border">{note.category}</Badge>
          </div>
          <div className="note-options">
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                <MoreVertical size={18} />
              </Dropdown.Toggle>
              <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                <Dropdown.Item className="fw-bold">Mark as Read</Dropdown.Item>
                <Dropdown.Item>Pin this Note</Dropdown.Item>
                <Dropdown.Item>Copy Link</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="text-danger">Delete Note</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
        
        <h5 className="fw-bold text-navy mb-3">{note.title}</h5>
        <p className="note-content text-muted mb-4">{note.content}</p>
        
        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar-circle-xs bg-light text-primary fw-bold">{note.author[0]}</div>
            <div className="extra-small fw-bold text-navy">{note.author}</div>
          </div>
          <div className="extra-small text-muted d-flex align-items-center gap-2">
            <Clock size={12} /> {note.date}
          </div>
        </div>
      </Card.Body>
    </Card>
  </motion.div>
);

export default AdministrativeNotesPage;
