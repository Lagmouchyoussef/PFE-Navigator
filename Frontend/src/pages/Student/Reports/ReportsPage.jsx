import React, { useState, useRef } from 'react';
import {
  Container, Row, Col, Card, Badge,
  Button, Form, InputGroup, Modal, Spinner
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Download, CheckCircle, Clock,
  Search, Trash2, Eye, Filter, FilePlus, X,
  MessageSquare, AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

const statusConfig = {
  approved: { color: 'success', icon: <CheckCircle size={14} />, label: 'Approved' },
  pending:  { color: 'warning', icon: <Clock size={14} />,        label: 'Pending'  },
  rejected: { color: 'danger',  icon: <AlertCircle size={14} />,  label: 'Rejected' },
};

const ReportsPage = () => {
  const { user, documents = [], deleteDocument, uploadDocument } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [targetFilter, setTargetFilter] = useState('All');
  const [uploadTarget, setUploadTarget] = useState('supervisor');
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // ── Upload ────────────────────────────────────────────────────────────────
  const ALLOWED_TYPES = new Set([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ]);

  const targetLabel = (t) => {
    if (t === 'supervisor') return 'the supervisor';
    if (t === 'jury') return 'the jury';
    return 'administration';
  };

  const handleFiles = async (files) => {
    const validFiles = Array.from(files).filter(
      f => ALLOWED_TYPES.has(f.type) || /\.(pdf|docx|pptx)$/i.test(f.name)
    );
    if (validFiles.length === 0) {
      flash('Only PDF, DOCX and PPTX files are accepted.');
      return;
    }
    setUploading(true);
    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.replace(/\.[^.]+$/, ''));
        formData.append('target', uploadTarget);
        await uploadDocument(formData);
      }
      flash(`${validFiles.length} file(s) sent to ${targetLabel(uploadTarget)}!`);
    } catch (uploadErr) {
      flash(`Upload failed: ${uploadErr?.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => handleFiles(e.target.files);

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!docToDelete) return;
    setDeleting(true);
    try {
      await deleteDocument(docToDelete.id);
      flash(`"${docToDelete.title}" deleted.`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDocToDelete(null);
    }
  };

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = documents.filter(d => {
    const matchSearch = d.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTarget = targetFilter === 'All' || d.target === targetFilter.toLowerCase();
    return matchSearch && matchTarget;
  });

  const statusCounts = {
    approved: documents.filter(d => d.status === 'approved').length,
    pending:  documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
  };

  return (
    <div className="reports-page-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">My Documents</h2>
            <p className="text-muted small mb-0">Upload and track your project documents — {user?.name}</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="rounded-pill border px-3" style={{ width: '260px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16} /></InputGroup.Text>
              <Form.Control
                placeholder="Search documents..."
                className="bg-transparent border-0 shadow-none py-2 small"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Form.Select size="sm" className="rounded-pill border fw-bold small" style={{ width: '140px' }}
              value={targetFilter} onChange={e => setTargetFilter(e.target.value)}>
              <option>All</option>
              <option value="supervisor">Supervisor</option>
              <option value="jury">Jury</option>
              <option value="administration">Admin</option>
            </Form.Select>
          </div>
        </div>

        {/* Success */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              className="glass-card mb-4 p-3 rounded-4 shadow-sm border-start border-success border-4 d-flex align-items-center gap-3">
              <CheckCircle size={20} className="text-success shrink-0" />
              <span className="small fw-bold">{successMsg}</span>
              <button type="button" className="ms-auto btn btn-sm p-0 border-0 bg-transparent" onClick={() => setSuccessMsg('')}><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Total', value: documents.length, color: 'primary', icon: <FileText size={20}/> },
            { label: 'Approved', value: statusCounts.approved, color: 'success', icon: <CheckCircle size={20}/> },
            { label: 'Pending', value: statusCounts.pending, color: 'warning', icon: <Clock size={20}/> },
            { label: 'Rejected', value: statusCounts.rejected, color: 'danger', icon: <AlertCircle size={20}/> },
          ].map(s => (
            <Col lg={3} sm={6} key={s.label}>
              <Card className="glass-card border-0 shadow-sm p-4 text-center">
                <div className={`text-${s.color} mb-2`}>{s.icon}</div>
                <div className={`fs-2 fw-bold text-${s.color}`}>{s.value}</div>
                <div className="small text-muted fw-bold">{s.label}</div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Upload Zone */}
        <Card className="glass-card border-0 shadow-sm mb-5">
          <Card.Body className="p-4">
            <h6 className="fw-bold text-navy mb-3 d-flex align-items-center gap-2">
              <Upload size={18} className="text-primary" /> Upload New Document
            </h6>
            <div className="d-flex gap-3 mb-3 flex-wrap">
              {['supervisor', 'jury', 'administration'].map(t => (
                <Form.Check key={t} type="radio" id={`target-${t}`} label={t.charAt(0).toUpperCase() + t.slice(1)}
                  checked={uploadTarget === t} onChange={() => setUploadTarget(t)} className="fw-bold small" />
              ))}
            </div>
            <label
              htmlFor="doc-file-upload"
              className={`d-block rounded-4 border-2 border-dashed p-5 text-center transition-all ${isDragging ? 'border-primary bg-primary-soft' : 'border-secondary'}`}
              style={{ cursor: 'pointer' }}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {uploading ? (
                <><Spinner size="sm" className="mb-2" /><div className="small text-muted fw-bold">Uploading…</div></>
              ) : (
                <>
                  <FilePlus size={36} className="text-primary mb-3 opacity-75" />
                  <div className="fw-bold text-navy small mb-1">Drag &amp; drop files here or click to browse</div>
                  <div className="extra-small text-muted">PDF, DOCX, PPTX accepted</div>
                </>
              )}
              <input ref={fileInputRef} id="doc-file-upload" type="file" multiple accept=".pdf,.docx,.pptx" className="d-none" onChange={handleFileInput} />
            </label>
          </Card.Body>
        </Card>

        {/* Documents List */}
        <Card className="glass-card border-0 shadow-sm">
          <Card.Header className="bg-transparent border-bottom p-4 d-flex align-items-center justify-content-between">
            <h6 className="fw-bold text-navy mb-0">Uploaded Documents ({filtered.length})</h6>
            <Filter size={16} className="text-muted" />
          </Card.Header>
          <Card.Body className="p-0">
            {filtered.length === 0 && (
              <div className="text-center py-5 text-muted">
                <FileText size={48} className="mb-3 opacity-30" />
                <p className="fw-bold">No documents found.</p>
              </div>
            )}
            {filtered.map(doc => {
              const st = statusConfig[doc.status] || statusConfig.pending;
              return (
                <div key={doc.id} className="p-4 border-bottom d-flex align-items-center gap-3 hover-bg-surface">
                  <div className="p-2 bg-primary-soft rounded-3 text-primary shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="grow overflow-hidden">
                    <div className="fw-bold small text-navy text-truncate">{doc.title}</div>
                    <div className="extra-small text-muted fw-bold">
                      Target: <span className="text-capitalize">{doc.target}</span> •
                      v{doc.version} •
                      {new Date(doc.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </div>
                    {doc.rejection_reason && (
                      <div className="extra-small text-danger mt-1 fw-bold">
                        Reason: {doc.rejection_reason}
                      </div>
                    )}
                  </div>
                  <Badge bg={st.color} className="d-flex align-items-center gap-1 px-2 py-1">
                    {st.icon} {st.label}
                  </Badge>
                  {doc.remarks?.length > 0 && (
                    <Button size="sm" variant="outline-info" className="rounded-pill d-flex align-items-center gap-1"
                      onClick={() => { setSelectedDoc(doc); setShowRemarkModal(true); }}>
                      <MessageSquare size={14} /> {doc.remarks.length}
                    </Button>
                  )}
                  {doc.file_url && (
                    <a href={doc.file_url} target="_blank" rel="noreferrer"
                      className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1">
                      <Eye size={14} /> View
                    </a>
                  )}
                  {doc.file_url && (
                    <a href={doc.file_url} download={doc.title}
                      className="btn btn-sm btn-outline-secondary rounded-pill d-flex align-items-center gap-1">
                      <Download size={14} />
                    </a>
                  )}
                  <Button size="sm" variant="outline-danger" className="rounded-pill"
                    onClick={() => { setDocToDelete(doc); setShowDeleteModal(true); }}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </Card.Body>
        </Card>
      </Container>

      {/* Delete Confirm Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Body className="p-4 text-center">
          <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex p-3 mb-3">
            <Trash2 size={28} />
          </div>
          <h5 className="fw-bold mb-2">Delete Document?</h5>
          <p className="text-muted small mb-4">
            Are you sure you want to delete <strong>"{docToDelete?.title}"</strong>? This action cannot be undone.
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" /> : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Remarks Modal */}
      <Modal show={showRemarkModal} onHide={() => setShowRemarkModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">Remarks on "{selectedDoc?.title}"</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedDoc?.remarks?.map(r => (
            <div key={r.id} className="mb-3 p-3 glass-card rounded-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="small fw-bold text-navy">{r.author_name}</span>
                <Badge bg="secondary" className="extra-small">{r.author_role}</Badge>
              </div>
              <p className="small mb-1">{r.comment}</p>
              {r.score !== null && r.score !== undefined && (
                <div className="extra-small text-muted fw-bold">Score: {r.score}/20</div>
              )}
            </div>
          ))}
          {(!selectedDoc?.remarks || selectedDoc.remarks.length === 0) && (
            <p className="text-muted small text-center">No remarks yet.</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ReportsPage;
