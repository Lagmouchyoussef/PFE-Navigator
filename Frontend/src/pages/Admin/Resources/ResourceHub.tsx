import React, { useState, useRef } from 'react';
import {
  Plus, Search, Download,
  FileText, HardDrive, Award, Trash2, CheckCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Modal, Spinner } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';

const ResourceHub: React.FC = () => {
  const { resourceCenter: rawResources, uploadResource, deleteResource } = useApp();
  const resourceCenter = Array.isArray(rawResources) ? rawResources : [];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [typeFilter, setTypeFilter]           = useState('all');
  const [uploading, setUploading]             = useState(false);
  const [successMsg, setSuccessMsg]           = useState('');
  const [newResource, setNewResource]         = useState({ title: '', description: '', type: 'report', year: new Date().getFullYear() });

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const filtered = resourceCenter.filter(r => {
    const matchSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType   = typeFilter === 'all' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const stats = {
    total:   resourceCenter.length,
    reports: resourceCenter.filter(r => r.type === 'report').length,
    guides:  resourceCenter.filter(r => r.type === 'guide').length,
    other:   resourceCenter.filter(r => !['report', 'guide'].includes(r.type)).length,
  };

  const typeColor = (type: string) => {
    if (type === 'report')   return 'primary';
    if (type === 'template') return 'info';
    if (type === 'guide')    return 'success';
    if (type === 'project')  return 'warning';
    return 'secondary';
  };

  const handleUpload = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) { flash('Please select a file.'); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('title', newResource.title || files[0].name.replace(/\.[^.]+$/, ''));
      formData.append('description', newResource.description);
      formData.append('type', newResource.type);
      formData.append('year', String(newResource.year));
      formData.append('is_public', 'true');
      await uploadResource(formData);
      setShowUploadModal(false);
      setNewResource({ title: '', description: '', type: 'report', year: new Date().getFullYear() });
      if (fileInputRef.current) fileInputRef.current.value = '';
      flash('Resource uploaded successfully!');
    } catch (err: any) {
      flash(`Upload failed: ${err?.message || 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    try {
      await deleteResource(id);
      flash(`"${title}" deleted.`);
    } catch {
      flash('Could not delete resource.');
    }
  };

  return (
    <div className="resources-modern-layout py-4">
      <Container fluid className="px-4">

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Resource Center</h2>
            <p className="text-muted small mb-0">Share documents, guides, and old reports with students.</p>
          </div>
          <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => setShowUploadModal(true)}>
            <Plus size={18} /> Upload Resource
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
            <StatCard label="Total Resources" value={stats.total.toString()} icon={<HardDrive />} color="primary" trend="Files" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Reports" value={stats.reports.toString()} icon={<FileText />} color="info" trend="Type" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Guides" value={stats.guides.toString()} icon={<Award />} color="success" trend="Type" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Other" value={stats.other.toString()} icon={<Plus />} color="warning" trend="Files" />
          </Col>
        </Row>

        {/* Table */}
        <div className="glass-card rounded-4 overflow-hidden shadow-sm">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt flex-wrap gap-2">
            <h5 className="fw-bold mb-0 text-navy">All Resources</h5>
            <div className="d-flex gap-2 flex-wrap">
              <InputGroup className="bg-surface rounded-pill border px-2" style={{ width: '220px' }}>
                <InputGroup.Text className="bg-transparent border-0"><Search size={16} className="text-muted" /></InputGroup.Text>
                <Form.Control
                  placeholder="Search..."
                  className="bg-transparent border-0 shadow-none extra-small text-navy"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Form.Select size="sm" className="rounded-pill border fw-bold extra-small" style={{ width: '130px' }}
                value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="report">Report</option>
                <option value="template">Template</option>
                <option value="guide">Guide</option>
                <option value="project">Project</option>
                <option value="other">Other</option>
              </Form.Select>
            </div>
          </div>

          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead>
                <tr className="border-bottom opacity-50">
                  <th className="ps-4 py-3 extra-small text-muted text-uppercase fw-bold">Resource</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Type</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Year</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Uploaded by</th>
                  <th className="py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-5 text-muted">
                      <HardDrive size={40} className="mb-2 opacity-25" />
                      <p className="small fw-bold">No resources found. Upload the first one!</p>
                    </td>
                  </tr>
                )}
                {filtered.map(file => (
                  <tr key={file.id} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                          <FileText size={18} />
                        </div>
                        <div>
                          <div className="small fw-bold text-navy">{file.title}</div>
                          {file.description && (
                            <div className="extra-small text-muted text-truncate" style={{ maxWidth: '220px' }}>{file.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg={typeColor(file.type)} className="extra-small text-capitalize">{file.type || 'file'}</Badge>
                    </td>
                    <td className="py-3 small text-muted fw-bold">{file.year || '—'}</td>
                    <td className="py-3 small text-muted fw-bold">{file.uploaded_by_name || 'Admin'}</td>
                    <td className="pe-4 py-3 text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        {file.file_url && (
                          <a href={file.file_url} target="_blank" rel="noreferrer"
                            className="btn btn-sm btn-outline-primary rounded-pill d-flex align-items-center gap-1">
                            <Download size={14} />
                          </a>
                        )}
                        <Button variant="link" className="p-2 text-danger border-0 shadow-none"
                          onClick={() => handleDelete(file.id, file.title)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">Upload Resource</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleUpload}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Title</Form.Label>
              <Form.Control
                placeholder="Resource title (optional — defaults to filename)"
                value={newResource.title}
                onChange={e => setNewResource(p => ({ ...p, title: e.target.value }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold">Description (optional)</Form.Label>
              <Form.Control
                as="textarea" rows={2}
                placeholder="Brief description..."
                value={newResource.description}
                onChange={e => setNewResource(p => ({ ...p, description: e.target.value }))}
              />
            </Form.Group>
            <Row className="g-3 mb-3">
              <Col>
                <Form.Label className="small fw-bold">Type</Form.Label>
                <Form.Select value={newResource.type} onChange={e => setNewResource(p => ({ ...p, type: e.target.value }))}>
                  <option value="report">Report</option>
                  <option value="template">Template</option>
                  <option value="guide">Guide</option>
                  <option value="project">Project</option>
                  <option value="other">Other</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label className="small fw-bold">Year</Form.Label>
                <Form.Control
                  type="number" min={2000} max={2100}
                  value={newResource.year}
                  onChange={e => setNewResource(p => ({ ...p, year: Number(e.target.value) }))}
                />
              </Col>
            </Row>
            <Form.Group>
              <Form.Label className="small fw-bold">File</Form.Label>
              <Form.Control type="file" ref={fileInputRef} accept=".pdf,.docx,.pptx,.zip" required />
              <Form.Text className="text-muted extra-small">PDF, DOCX, PPTX, ZIP accepted</Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={uploading} className="d-flex align-items-center gap-2">
              {uploading ? <Spinner size="sm" /> : <Plus size={16} />}
              {uploading ? 'Uploading…' : 'Upload'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceHub;
