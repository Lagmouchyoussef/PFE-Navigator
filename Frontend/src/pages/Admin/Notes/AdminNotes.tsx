import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form, InputGroup, Button, Modal, Spinner } from 'react-bootstrap';
import {
  Search, Pin, AlertCircle, FileText,
  Bell, Clock, Plus, CheckCircle, X, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';

const AdminNotes: React.FC = () => {
  const { administrativeNotes, createAdminNote, deleteAdminNote } = useApp();

  const [searchTerm, setSearchTerm]     = useState('');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving]             = useState(false);
  const [successMsg, setSuccessMsg]     = useState('');
  const [newNote, setNewNote]           = useState({
    title: '', content: '', audience: 'all', is_pinned: false,
  });

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filtered = administrativeNotes.filter(n => {
    const matchSearch   = n.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchAudience = audienceFilter === 'all' || n.audience === audienceFilter;
    return matchSearch && matchAudience;
  });

  const pinned = administrativeNotes.filter(n => n.is_pinned).length;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminNote(newNote);
      setShowAddModal(false);
      setNewNote({ title: '', content: '', audience: 'all', is_pinned: false });
      flash('Note published successfully!');
    } catch (err: any) {
      flash(`Error: ${err?.message || 'Could not create note.'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteAdminNote(id);
      flash(`"${title}" deleted.`);
    } catch {
      flash('Could not delete note.');
    }
  };

  const audienceColor = (audience: string) => {
    if (audience === 'students')    return 'primary';
    if (audience === 'supervisors') return 'info';
    if (audience === 'juries')      return 'warning';
    return 'secondary';
  };

  return (
    <div className="admin-notes-modern-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Notes &amp; Announcements</h2>
            <p className="text-muted small mb-0">Manage important communications for all users.</p>
          </div>
          <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => setShowAddModal(true)}>
            <Plus size={18} /> New Note
          </Button>
        </div>

        {/* Flash */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="glass-card mb-4 p-3 rounded-4 border-start border-success border-4 d-flex align-items-center gap-3">
              <CheckCircle size={18} className="text-success shrink-0" />
              <span className="small fw-bold">{successMsg}</span>
              <button type="button" className="ms-auto btn btn-sm p-0 border-0 bg-transparent" onClick={() => setSuccessMsg('')}>
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Total Notes" value={administrativeNotes.length.toString()} icon={<FileText />} color="primary" trend="Overall" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Pinned" value={pinned.toString()} icon={<Pin />} color="warning" trend="Important" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="For Students" value={administrativeNotes.filter(n => n.audience === 'students' || n.audience === 'all').length.toString()} icon={<Bell />} color="info" trend="Visible" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="For All" value={administrativeNotes.filter(n => n.audience === 'all').length.toString()} icon={<AlertCircle />} color="success" trend="Global" />
          </Col>
        </Row>

        {/* Filters */}
        <div className="glass-card p-4 rounded-4 mb-5">
          <Row className="g-3 align-items-center">
            <Col lg={4}>
              <InputGroup className="bg-surface-alt rounded-pill border px-2">
                <InputGroup.Text className="bg-transparent border-0 text-muted"><Search size={18} /></InputGroup.Text>
                <Form.Control
                  placeholder="Search for a note..."
                  className="bg-transparent border-0 shadow-none small py-2"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col lg={8}>
              <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                {['all', 'students', 'supervisors', 'juries'].map(aud => (
                  <Button
                    key={aud}
                    variant={audienceFilter === aud ? 'primary' : 'outline-secondary'}
                    className="rounded-pill extra-small fw-bold px-4"
                    onClick={() => setAudienceFilter(aud)}
                  >
                    {aud.charAt(0).toUpperCase() + aud.slice(1)}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        {/* Notes Feed */}
        {filtered.length === 0 && (
          <div className="text-center py-5 text-muted">
            <FileText size={48} className="mb-3 opacity-30" />
            <h5 className="fw-bold">No notes found</h5>
            <p className="small">Create your first announcement using the button above.</p>
          </div>
        )}
        <Row className="g-4">
          {filtered.map(note => (
            <Col key={note.id} lg={6}>
              <div className={`glass-card p-4 rounded-4 shadow-sm h-100 border-start border-4 border-${note.is_pinned ? 'warning' : 'primary'}`}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Badge bg={audienceColor(note.audience)} className="extra-small fw-bold text-capitalize">
                      {note.audience}
                    </Badge>
                    {note.is_pinned && <Pin size={14} className="text-warning" />}
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger rounded-circle p-1 border-0"
                    onClick={() => handleDelete(note.id, note.title)}
                    title="Delete note"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <h5 className="fw-bold mb-3 text-navy">{note.title}</h5>
                <p className="small text-muted mb-4 lh-base fw-bold opacity-75">{note.content}</p>

                <div className="p-3 bg-surface-alt rounded-4 border d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                      {note.author_name?.charAt(0) || 'A'}
                    </div>
                    <span className="extra-small fw-bold text-navy opacity-75">{note.author_name || 'Admin'}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                    <Clock size={14} className="text-primary" />
                    {note.created_at ? new Date(note.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Add Note Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">Create Announcement</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleCreate}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Title</Form.Label>
              <Form.Control
                placeholder="Announcement title"
                value={newNote.title}
                onChange={e => setNewNote(p => ({ ...p, title: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Content</Form.Label>
              <Form.Control
                as="textarea" rows={4}
                placeholder="Write your announcement..."
                value={newNote.content}
                onChange={e => setNewNote(p => ({ ...p, content: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Audience</Form.Label>
              <Form.Select
                value={newNote.audience}
                onChange={e => setNewNote(p => ({ ...p, audience: e.target.value }))}
              >
                <option value="all">All Users</option>
                <option value="students">Students Only</option>
                <option value="supervisors">Supervisors Only</option>
                <option value="juries">Jury Members Only</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Pin this note"
              checked={newNote.is_pinned}
              onChange={e => setNewNote(p => ({ ...p, is_pinned: e.target.checked }))}
              className="small fw-bold"
            />
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" /> : 'Publish Note'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNotes;
