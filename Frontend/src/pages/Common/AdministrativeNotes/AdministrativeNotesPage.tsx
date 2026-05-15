import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Pin, FileText, Bell, Filter } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

const AdministrativeNotesPage: React.FC = () => {
  const { administrativeNotes: notes = [], user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');

  const filtered = notes.filter((n: any) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAudience = audienceFilter === 'all' || n.audience === audienceFilter;
    return matchesSearch && matchesAudience;
  });

  const pinned = notes.filter((n: any) => n.is_pinned).length;

  return (
    <div className="notes-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Administrative Notes</h2>
            <p className="text-muted small mb-0">
              Official announcements and notes from coordination, {user?.name}.
            </p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="glass-card rounded-pill border px-3 shadow-none" style={{ width: '280px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search for a note..."
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-navy"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Form.Select
              size="sm"
              className="rounded-pill border fw-bold small"
              style={{ width: '140px' }}
              value={audienceFilter}
              onChange={e => setAudienceFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="students">Students</option>
              <option value="supervisors">Supervisors</option>
              <option value="juries">Jury</option>
            </Form.Select>
            <Button className="btn-premium d-flex align-items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
          </div>
        </div>

        {/* Stats */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Notes" value={notes.length.toString()} icon={<FileText />} color="primary" trend="Docs" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Pinned" value={pinned.toString()} icon={<Pin />} color="warning" trend="Fav" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="For All" value={notes.filter((n: any) => n.audience === 'all').length.toString()} icon={<Bell />} color="info" trend="Global" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Showing" value={filtered.length.toString()} icon={<Filter />} color="success" trend="Filtered" />
          </Col>
        </Row>

        {/* Notes Grid */}
        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            <FileText size={48} className="mb-3 opacity-30" />
            <p className="fw-bold">No administrative notes found.</p>
          </div>
        )}
        <Row className="g-4 mb-5">
          {filtered.map((note: any) => (
            <Col key={note.id} lg={4} md={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm h-100 position-relative transition-all hover-translate ${note.is_pinned ? 'border-primary border-2' : ''}`}>
                {note.is_pinned && (
                  <div className="position-absolute top-0 end-0 p-3">
                    <Pin size={16} className="text-primary" />
                  </div>
                )}
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small text-capitalize">
                    {note.audience === 'all' ? 'Everyone' : note.audience}
                  </Badge>
                </div>
                <h6 className="fw-bold mb-2 lh-base text-navy">{note.title}</h6>
                <p className="extra-small text-muted mb-4 lh-lg fw-bold opacity-75">
                  {note.content?.length > 150 ? `${note.content.substring(0, 150)}…` : note.content}
                </p>
                <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}
                    >
                      {(note.author_name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <span className="extra-small fw-bold text-navy opacity-75">{note.author_name || 'Administration'}</span>
                  </div>
                  <div className="extra-small text-muted fw-bold">
                    {new Date(note.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default AdministrativeNotesPage;
