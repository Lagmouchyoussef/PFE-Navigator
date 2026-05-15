import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button, Dropdown } from 'react-bootstrap';
import { 
  Search, Pin, AlertCircle, FileText, 
  Bell, MoreVertical, Clock, Plus
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

interface Note {
  id: number;
  title: string;
  isNew: boolean;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  content: string;
  author: string;
  date: string;
  pinned: boolean;
  unread: boolean;
}

const AdminNotes: React.FC = () => {
  const { theme } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const notes: Note[] = [
    {
      id: 1,
      title: 'Publication of Defense Schedule',
      isNew: true,
      priority: 'HIGH',
      category: 'Defense',
      content: 'Final schedules for all students will be published on May 5, 2026. Please check your portal regularly. Room assignments will be sent 48h before.',
      author: 'PFE Office',
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
      content: 'Final reports must be submitted before May 15, 2026 at 23:59. Any delay will result in a penalty of 5 points per day.',
      author: 'Academic Affairs',
      date: '2026-04-27',
      pinned: true,
      unread: true
    },
    {
      id: 3,
      title: 'Mandatory Presentation Workshop',
      isNew: true,
      priority: 'HIGH',
      category: 'Workshops',
      content: 'All students must attend the workshop on presentation techniques on May 8 at 14:00 in Auditorium B.',
      author: 'Professional Development',
      date: '2026-04-23',
      pinned: true,
      unread: true
    },
    {
      id: 4,
      title: 'New Evaluation Criteria',
      isNew: false,
      priority: 'MEDIUM',
      category: 'Evaluation',
      content: 'The 2026 evaluation grid has been updated in the Resource Center. Innovation now counts for 15%.',
      author: 'Dr. Ahmed Mansouri',
      date: '2026-04-25',
      pinned: false,
      unread: false
    }
  ];

  const getPriorityBadge = (priority: Note['priority']) => {
    switch (priority) {
      case 'HIGH': return <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-25 extra-small fw-bold">HIGH</Badge>;
      case 'MEDIUM': return <Badge bg="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-25 extra-small fw-bold">MEDIUM</Badge>;
      case 'LOW': return <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small fw-bold">LOW</Badge>;
      default: return null;
    }
  };

  return (
    <div className="admin-notes-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notes & Announcements</h2>
            <p className="text-muted small mb-0">Tracking updates and important communications.</p>
          </div>
          <Button 
            className="btn-premium d-flex align-items-center gap-2" 
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} /> New Note
          </Button>
        </div>

        {/* Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Notes" value="8" icon={<FileText />} color="primary" trend="Overall" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Unread" value="3" icon={<Bell />} color="danger" trend="Action" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Pinned" value="3" icon={<Pin />} color="warning" trend="Fav" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="High Priority" value="4" icon={<AlertCircle />} color="danger" trend="Urgent" />
          </Col>
        </Row>

        {/* Search & Filter */}
        <div className="glass-card p-4 rounded-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted">
                  <Search size={18} />
                </InputGroup.Text>
                <Form.Control 
                  placeholder="Search for a note..." 
                  className="bg-transparent border-0 shadow-none small py-2 text-primary-custom"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end">
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">All</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">Pinned</Button>
                <Button variant="outline-secondary" className="rounded-pill border extra-small fw-bold px-4">High Priority</Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Notes Feed */}
        <div className="notes-feed">
          <Row className="g-4">
            {notes.map((note) => (
              <Col key={note.id} lg={6}>
                <div className={`glass-card p-4 rounded-4 shadow-sm h-100 border-start-4 ${note.pinned ? 'border-warning' : 'border-primary'}`}>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      {getPriorityBadge(note.priority)}
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small fw-bold">{note.category}</Badge>
                      {note.pinned && <Pin size={14} className="text-warning fill-warning" />}
                    </div>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                      <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                        <Dropdown.Item className="extra-small fw-bold">Edit</Dropdown.Item>
                        <Dropdown.Item className="extra-small fw-bold">Pin</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="extra-small fw-bold text-danger">Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  
                  <h5 className="fw-bold mb-3 text-navy">{note.title}</h5>
                  <p className="small text-muted mb-4 lh-base fw-bold opacity-75">{note.content}</p>
                  
                  <div className="p-3 bg-surface-alt rounded-4 border d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                        {note.author.charAt(0)}
                      </div>
                      <span className="extra-small fw-bold text-navy opacity-75">{note.author}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                      <Clock size={14} className="text-primary" /> {note.date}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      <style>{`
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--color-primary) !important; }
        .border-danger { border-left-color: var(--color-danger) !important; }
        .border-warning { border-left-color: var(--color-warning) !important; }
        .fill-warning { fill: var(--color-warning); }
      `}</style>
    </div>
  );
};

export default AdminNotes;
