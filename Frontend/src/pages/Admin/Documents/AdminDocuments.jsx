import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  Search, FileText, Download, Eye, CheckCircle, XCircle,
  Clock, Archive, Inbox, X, Lock, Unlock, Filter
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const AdminDocuments = () => {
  const { documents = [], projects = [], approveDocument, rejectDocument, toggleJuryDocs } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTarget, setFilterTarget] = useState('all');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const filtered = documents.filter(doc => {
    if (!doc || !doc.title) return false;
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchTarget = filterTarget === 'all' || doc.target === filterTarget;
    return matchSearch && matchStatus && matchTarget;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d?.status === 'pending').length,
    approved: documents.filter(d => d?.status === 'approved').length,
    rejected: documents.filter(d => d?.status === 'rejected').length,
  };

  const handleApprove = (id) => {
    if (approveDocument) approveDocument(id);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim() || !rejectDocument) return;
    rejectDocument(rejectModal, rejectReason.trim());
    setRejectModal(null);
    setRejectReason('');
  };

  const handleToggle = async (projectId) => {
    setTogglingId(projectId);
    try {
      await toggleJuryDocs(projectId);
    } finally {
      setTogglingId(null);
    }
  };

  const projectsWithStudents = projects.filter(p => p?.student);

  return (
    <div className="py-4">
      <Container fluid className="px-4">
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Documents Repository</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">All student documents — supervisor and jury targets.</p>
          </motion.div>
          <div className="d-flex gap-2">
            <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '280px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0 pe-1"><Search size={16} /></InputGroup.Text>
              <Form.Control
                placeholder="Search documents..."
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-navy"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </header>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { title: 'Total Files', value: stats.total, icon: <Archive />, color: 'primary' },
            { title: 'Pending', value: stats.pending, icon: <Clock />, color: 'warning' },
            { title: 'Approved', value: stats.approved, icon: <CheckCircle />, color: 'success' },
            { title: 'Rejected', value: stats.rejected, icon: <XCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border border-light border-opacity-10 border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-navy">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase opacity-50">{stat.title}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Jury Deadline Controls */}
        {projectsWithStudents.length > 0 && (
          <Card className="glass-card rounded-4 overflow-hidden shadow-sm mb-5 border-light border-opacity-10">
            <Card.Header className="p-4 border-bottom bg-white border-0">
              <h6 className="fw-bold text-navy mb-0 d-flex align-items-center gap-2">
                <Lock size={16} className="text-warning" /> Jury Submission Deadlines
              </h6>
            </Card.Header>
            <Card.Body className="p-0">
              <Table borderless hover className="align-middle mb-0">
                <thead className="bg-surface-alt">
                  <tr className="border-bottom opacity-50">
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Project</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Jury Submission</th>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projectsWithStudents.map(p => (
                    <tr key={p.id} className="border-bottom border-light border-opacity-10">
                      <td className="px-4 py-3 small fw-bold text-navy">{p.student?.name || p.student_name || '—'}</td>
                      <td className="py-3 small text-navy opacity-75">{p.title || p.subject_title || '—'}</td>
                      <td className="py-3">
                        <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${p.jury_documents_open ? 'bg-success-soft text-success' : 'bg-warning-soft text-warning'}`}>
                          {p.jury_documents_open ? 'Open' : 'Closed'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <Button
                          size="sm"
                          variant={p.jury_documents_open ? 'outline-warning' : 'outline-success'}
                          className="rounded-pill px-3 fw-bold extra-small border-2"
                          disabled={togglingId === p.id}
                          onClick={() => handleToggle(p.id)}
                        >
                          {p.jury_documents_open ? <><Lock size={12} className="me-1" />Close</> : <><Unlock size={12} className="me-1" />Open</>}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Documents Table */}
        <Card className="glass-card rounded-4 overflow-hidden shadow-sm mb-5 border-light border-opacity-10">
          <Card.Header className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center border-0 flex-wrap gap-2">
            <div className="d-flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <Button
                  key={s}
                  variant={filterStatus === s ? 'primary' : 'outline-secondary'}
                  size="sm"
                  className={`rounded-pill px-4 fw-bold extra-small border-2 transition-all ${filterStatus === s ? 'border-primary' : 'border-light border-opacity-10 opacity-50'}`}
                  onClick={() => setFilterStatus(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
            <div className="d-flex gap-2 align-items-center">
              <Filter size={14} className="text-muted" />
              <Form.Select size="sm" className="rounded-pill border fw-bold small" style={{ width: '140px' }}
                value={filterTarget} onChange={e => setFilterTarget(e.target.value)}>
                <option value="all">All Targets</option>
                <option value="supervisor">Supervisor</option>
                <option value="jury">Jury</option>
              </Form.Select>
            </div>
          </Card.Header>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-surface-alt">
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Document</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Target</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Submitted</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Controls</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id} className="border-bottom border-light border-opacity-10">
                    <td className="px-4 py-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-3 rounded-4 bg-primary-soft text-primary"><FileText size={20} /></div>
                        <div>
                          <div className="small fw-bold text-navy mb-1">{doc.title}</div>
                          <div className="extra-small text-muted fw-bold opacity-50">v{doc.version} • {doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>
                          {(doc.student_name || doc.uploaded_by_name || 'S').split(' ').map(n => n[0]).join('').toUpperCase()}
                        </div>
                        <span className="extra-small fw-bold text-navy opacity-75">{doc.student_name || doc.uploaded_by_name || 'Student'}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge className={`px-3 py-1 extra-small fw-bold border-0 ${doc.target === 'jury' ? 'bg-indigo-soft text-indigo' : 'bg-primary-soft text-primary'}`}>
                        {doc.target === 'jury' ? 'Jury' : 'Supervisor'}
                      </Badge>
                    </td>
                    <td className="py-4 small text-navy fw-bold opacity-75">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-4">
                      <Badge className={`bg-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}-soft text-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'} border-0 px-3 py-1 extra-small fw-bold`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {doc.file_url && (
                          <>
                            <a href={doc.file_url} target="_blank" rel="noreferrer" className="btn btn-link p-2 text-muted rounded-circle border-0 shadow-none"><Eye size={18} /></a>
                            <a href={doc.file_url} download={doc.title} className="btn btn-link p-2 text-muted rounded-circle border-0 shadow-none"><Download size={18} /></a>
                          </>
                        )}
                        {doc.status === 'pending' && (
                          <div className="d-flex gap-2 ms-2 ps-3 border-start border-light border-opacity-10">
                            <Button variant="success" size="sm" className="rounded-pill px-3 fw-bold extra-small border-0 shadow-sm" onClick={() => handleApprove(doc.id)}>Approve</Button>
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold extra-small border-2" onClick={() => { setRejectModal(doc.id); setRejectReason(''); }}>Reject</Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Inbox size={48} className="text-muted opacity-25 mb-3" />
                      <p className="small fw-bold text-muted opacity-50">No documents found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      <Modal show={!!rejectModal} onHide={() => setRejectModal(null)} centered>
        <div className="glass-card rounded-4 overflow-hidden border-0 shadow-lg">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold text-navy mb-0">Reject Document</h5>
            <Button variant="link" className="p-2 text-muted shadow-none border-0 rounded-circle" onClick={() => setRejectModal(null)}><X size={20} /></Button>
          </div>
          <Modal.Body className="p-4">
            <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2 opacity-50">Reason for Rejection</Form.Label>
            <Form.Control
              as="textarea" rows={4}
              placeholder="Specify corrections or reason..."
              className="bg-surface-alt border-0 rounded-4 p-3 small text-navy shadow-none fw-bold"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
            />
          </Modal.Body>
          <div className="p-4 border-top bg-surface-alt d-flex gap-2">
            <Button variant="outline-secondary" className="flex-grow-1 rounded-pill fw-bold extra-small border-2" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button variant="danger" className="flex-grow-1 rounded-pill fw-bold extra-small border-0 shadow-sm" disabled={!rejectReason.trim()} onClick={handleRejectConfirm}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDocuments;
