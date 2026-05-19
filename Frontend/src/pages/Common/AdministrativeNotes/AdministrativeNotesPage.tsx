import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button, Modal } from 'react-bootstrap';
import { Search, Pin, FileText, Bell, Users, X, Calendar } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const audienceLabel: Record<string, string> = {
  all:         'For Everyone',
  students:    'For Students',
  supervisors: 'For Supervisors',
  juries:      'For Jury',
};

const audienceColor: Record<string, string> = {
  all:         'primary',
  students:    'success',
  supervisors: 'info',
  juries:      'warning',
};

const AdministrativeNotesPage: React.FC = () => {
  const { administrativeNotes: rawNotes = [], user } = useApp();
  const notes: any[] = Array.isArray(rawNotes) ? rawNotes : [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'pinned'>('all');
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  const filtered = notes.filter((n: any) => {
    const matchSearch =
      !searchTerm ||
      n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.author_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPin = filterTab === 'all' || n.is_pinned;
    return matchSearch && matchPin;
  });

  // Pinned first, then by date (backend already orders this way, but enforce here too)
  const sorted = [...filtered].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const pinnedCount = notes.filter((n: any) => n.is_pinned).length;

  const stats = [
    { label: 'Total Notes', value: notes.length, icon: FileText, color: 'primary' },
    { label: 'Pinned',      value: pinnedCount,   icon: Pin,      color: 'warning' },
    { label: 'For Everyone',value: notes.filter((n: any) => n.audience === 'all').length, icon: Users, color: 'info' },
    { label: 'For You',     value: notes.filter((n: any) => n.audience === 'students').length, icon: Bell, color: 'success' },
  ];

  return (
    <div className="notes-modern-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Administrative Notes</h2>
            <p className="text-muted small mb-0">
              Official announcements from the administration — {user?.name}.
            </p>
          </div>
          <InputGroup size="sm" className="glass-card rounded-pill border px-3 shadow-none" style={{ width: '280px' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted ps-0">
              <Search size={16} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search notes..."
              className="bg-transparent border-0 shadow-none py-2 small fw-bold text-navy"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {stats.map((s, i) => (
            <Col key={i} lg={3} sm={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm d-flex align-items-center gap-3 border-start border-4 border-${s.color}`}>
                <div className={`p-3 rounded-4 bg-${s.color}-soft text-${s.color}`}>
                  <s.icon size={22} />
                </div>
                <div>
                  <div className="fs-4 fw-bold text-navy">{s.value}</div>
                  <div className="extra-small text-muted fw-bold text-uppercase">{s.label}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Filter Tabs */}
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={`btn btn-sm rounded-pill fw-bold extra-small px-4 ${filterTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setFilterTab('all')}
          >
            All Notes
          </button>
          <button
            type="button"
            className={`btn btn-sm rounded-pill fw-bold extra-small px-4 d-flex align-items-center gap-1 ${filterTab === 'pinned' ? 'btn-warning text-white' : 'btn-outline-warning'}`}
            onClick={() => setFilterTab('pinned')}
          >
            <Pin size={13} /> Pinned only
          </button>
        </div>

        {/* Empty state */}
        {sorted.length === 0 && (
          <div className="text-center py-5 text-muted glass-card rounded-4 p-5">
            <FileText size={48} className="mb-3 opacity-25" />
            <h6 className="fw-bold">No notes found</h6>
            <p className="extra-small fw-bold opacity-50">
              {searchTerm
                ? 'No notes match your search.'
                : filterTab === 'pinned'
                  ? 'No pinned notes at the moment.'
                  : 'The administration has not published any notes yet.'}
            </p>
          </div>
        )}

        {/* Notes Grid */}
        <Row className="g-4 mb-5">
          {sorted.map((note: any) => {
            const color = audienceColor[note.audience] || 'primary';
            const isLong = (note.content?.length || 0) > 200;
            return (
              <Col key={note.id} lg={4} md={6}>
                <div
                  className={`glass-card p-4 rounded-4 shadow-sm h-100 position-relative d-flex flex-column transition-all hover-translate ${note.is_pinned ? 'border border-warning border-2' : ''}`}
                  style={{ cursor: isLong ? 'pointer' : 'default' }}
                  onClick={() => isLong && setSelectedNote(note)}
                >
                  {/* Pinned badge */}
                  {note.is_pinned && (
                    <div className="position-absolute top-0 end-0 p-3">
                      <div className="bg-warning bg-opacity-15 rounded-circle p-1">
                        <Pin size={14} className="text-warning" />
                      </div>
                    </div>
                  )}

                  {/* Audience tag */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Badge
                      className={`bg-${color}-soft text-${color} border border-${color} border-opacity-25 extra-small text-capitalize`}
                      style={{ fontSize: '10px', padding: '3px 8px' }}
                    >
                      {audienceLabel[note.audience] || note.audience}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h6 className="fw-bold mb-2 lh-base text-navy">{note.title}</h6>

                  {/* Content preview */}
                  <p className="extra-small text-muted mb-3 lh-lg fw-bold opacity-75 flex-grow-1">
                    {isLong ? `${note.content.substring(0, 200)}…` : note.content}
                  </p>

                  {isLong && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-primary fw-bold extra-small text-decoration-none shadow-none text-start mb-3"
                      onClick={() => setSelectedNote(note)}
                    >
                      Read full note →
                    </Button>
                  )}

                  {/* Footer */}
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className={`bg-${color} bg-opacity-10 text-${color} rounded-circle d-flex align-items-center justify-content-center fw-bold`}
                        style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}
                      >
                        {(note.author_name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <span className="extra-small fw-bold text-navy opacity-75">
                        {note.author_name || 'Administration'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1 extra-small text-muted fw-bold">
                      <Calendar size={11} />
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </Container>

      {/* Full Note Modal */}
      <Modal show={!!selectedNote} onHide={() => setSelectedNote(null)} centered size="lg">
        {selectedNote && (
          <>
            <Modal.Header className="border-0 pb-0 px-4 pt-4">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge
                    className={`bg-${audienceColor[selectedNote.audience] || 'primary'}-soft text-${audienceColor[selectedNote.audience] || 'primary'} border-0 extra-small`}
                    style={{ fontSize: '10px', padding: '3px 8px' }}
                  >
                    {audienceLabel[selectedNote.audience] || selectedNote.audience}
                  </Badge>
                  {selectedNote.is_pinned && (
                    <Badge className="bg-warning-soft text-warning border-0 extra-small d-flex align-items-center gap-1" style={{ fontSize: '10px', padding: '3px 8px' }}>
                      <Pin size={10} /> Pinned
                    </Badge>
                  )}
                </div>
                <Modal.Title className="fw-bold fs-5 text-navy">{selectedNote.title}</Modal.Title>
              </div>
              <Button variant="link" className="p-1 text-muted border-0 shadow-none" onClick={() => setSelectedNote(null)}>
                <X size={20} />
              </Button>
            </Modal.Header>
            <Modal.Body className="px-4 py-3">
              <p className="small text-navy lh-lg" style={{ whiteSpace: 'pre-wrap' }}>{selectedNote.content}</p>
            </Modal.Body>
            <Modal.Footer className="border-0 px-4 pb-4 pt-0">
              <div className="d-flex align-items-center gap-2 me-auto">
                <div
                  className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                  style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}
                >
                  {(selectedNote.author_name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="small fw-bold text-navy">{selectedNote.author_name || 'Administration'}</div>
                  <div className="extra-small text-muted">
                    {new Date(selectedNote.created_at).toLocaleDateString('en-US', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </div>
                </div>
              </div>
              <Button variant="outline-secondary" size="sm" className="rounded-pill fw-bold" onClick={() => setSelectedNote(null)}>
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
};

export default AdministrativeNotesPage;
