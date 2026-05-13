import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, InputGroup 
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Download, CheckCircle, Clock, 
  Search, Trash2, Eye, Folder, Filter, ChevronDown,
  FilePlus, MoreVertical, X
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext.jsx';

const ReportsPage = () => {
  const { documents = [], deleteDocument, uploadDocument } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const fileInputRef = useRef(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const dragCounter = useRef(0);
  // Map docId -> object URL for real file preview/download
  const fileUrlMap = useRef({});

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFiles = (files) => {
    if (!files || files.length === 0) return;
    files.forEach(file => {
      const allowed = ['application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (allowed.includes(file.type) || file.name.match(/\.(pdf|docx|pptx)$/i)) {
        const doc = uploadDocument(file.name, file);
        // Store a real browser object URL so we can view/download this file
        const url = URL.createObjectURL(file);
        fileUrlMap.current[doc.id] = { url, name: file.name };
      }
    });
    setSuccessMsg(`${files.length} fichier(s) importé(s) avec succès !`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const handleUploadClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = null;
  };

  const handleView = (doc) => {
    const entry = fileUrlMap.current[doc.id];
    if (entry) {
      window.open(entry.url, '_blank');
    } else {
      alert('Aperçu indisponible : le fichier n\'est plus en mémoire. Veuillez re-téléverser le fichier.');
    }
  };

  const handleDownload = (doc) => {
    const entry = fileUrlMap.current[doc.id];
    if (entry) {
      const link = document.createElement('a');
      link.href = entry.url;
      link.download = entry.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setSuccessMsg(`Téléchargement de "${doc.title}" commencé...`);
    } else {
      setSuccessMsg(`"${doc.title}" — fichier non disponible localement.`);
    }
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const categories = [
    { name: 'Tous', count: documents.length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'PDF', count: documents.filter(d => d.title.endsWith('.pdf')).length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'DOCX', count: documents.filter(d => d.title.endsWith('.docx')).length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'PPTX', count: documents.filter(d => d.title.endsWith('.pptx')).length, icon: <Folder size={20} />, color: 'blue' },
  ];

  return (
    <div className="reports-page-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Notification Card */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="p-3 mb-4 d-flex align-items-center justify-content-between shadow-lg bg-success-soft text-success border border-success border-opacity-25 rounded-4"
              style={{ zIndex: 1000 }}
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success text-white d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Document Prêt</h6>
                  <p className="extra-small mb-0 opacity-75 fw-bold">{successMsg}</p>
                </div>
              </div>
              <Button size="sm" variant="link" className="text-success p-0 extra-small fw-bold text-decoration-none" onClick={() => setShowSuccessCard(false)}>Fermer</Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx"
        />

        {/* Header Section */}
        <header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="fw-bold mb-1 text-navy">Documents Repository</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Manage all your PFE project documents and submissions</p>
          </motion.div>
          <Button 
            className="btn-premium d-flex align-items-center gap-2 px-4 shadow-sm"
            onClick={handleUploadClick}
          >
            <Upload size={18} /> Upload Document
          </Button>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {categories.map((cat, i) => (
            <Col key={i} lg={3} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card border-0 shadow-sm border p-3">
                  <Card.Body className="p-2 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="extra-small text-muted fw-bold text-uppercase mb-1 opacity-75 tracking-wider">{cat.name}</div>
                      <h3 className="fw-bold mb-0 text-navy">{cat.count}</h3>
                    </div>
                    <div className="p-3 bg-primary-soft text-primary rounded-4">
                      <Folder size={24} />
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Dropzone Area */}
        <div
          className="mb-5"
          onDragEnter={e => { e.preventDefault(); e.stopPropagation(); dragCounter.current++; setIsDragging(true); }}
          onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
          onDragLeave={e => { e.preventDefault(); e.stopPropagation(); dragCounter.current--; if (dragCounter.current === 0) setIsDragging(false); }}
          onDrop={e => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter.current = 0;
            setIsDragging(false);
            const files = Array.from(e.dataTransfer.files).filter(f =>
              f.name.match(/\.(pdf|docx|pptx)$/i)
            );
            if (files.length > 0) {
              setPendingFiles(files);
            }
          }}
        >
          <div
            className="rounded-4 overflow-hidden cursor-pointer"
            style={{
              background: isDragging
                ? 'linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.06) 100%)'
                : 'linear-gradient(135deg, rgba(37,99,235,0.04) 0%, rgba(37,99,235,0.02) 100%)',
              border: isDragging
                ? '2px dashed rgba(37,99,235,0.75)'
                : '2px dashed rgba(37,99,235,0.25)',
              transform: isDragging ? 'scale(1.015)' : 'scale(1)',
              transition: 'all 0.25s ease',
            }}
            onClick={handleUploadClick}
          >
            <div className="p-5 text-center">
              {/* Animated icon */}
              <motion.div
                animate={{ y: isDragging ? [-4, 4, -4] : [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: isDragging ? 0.6 : 2.5, ease: 'easeInOut' }}
                className="d-inline-flex align-items-center justify-content-center mb-4"
                style={{
                  width: '72px', height: '72px',
                  background: isDragging
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : 'linear-gradient(135deg, #2563eb, #818cf8)',
                  borderRadius: '20px',
                  boxShadow: isDragging
                    ? '0 8px 24px rgba(22,163,74,0.35)'
                    : '0 8px 24px rgba(37,99,235,0.25)',
                }}
              >
                <Upload size={32} color="white" strokeWidth={1.8} />
              </motion.div>

              <h5 className="fw-bold text-navy mb-1" style={{ fontSize: '1.05rem' }}>
                {isDragging ? '✓ Relâchez pour importer' : 'Glisser-déposer vos fichiers ici'}
              </h5>
              <p className="text-muted mb-4 fw-bold" style={{ fontSize: '0.82rem' }}>
                {isDragging ? (
                  <span className="text-success fw-bold">Fichier détecté — relâchez pour continuer</span>
                ) : (
                  <>ou cliquer pour <span className="text-primary">parcourir vos fichiers</span></>
                )}
              </p>

              {!isDragging && (
                <>
                  <div className="d-flex justify-content-center gap-2 mb-4">
                    {[
                      { label: 'PDF', color: '#ef4444', bg: '#fef2f2' },
                      { label: 'DOCX', color: '#2563eb', bg: '#eff6ff' },
                      { label: 'PPTX', color: '#f97316', bg: '#fff7ed' },
                    ].map(type => (
                      <span key={type.label} className="fw-bold rounded-pill px-3 py-1 d-flex align-items-center gap-1"
                        style={{ fontSize: '0.7rem', background: type.bg, color: type.color, letterSpacing: '0.5px' }}>
                        <FileText size={11} /> {type.label}
                      </span>
                    ))}
                  </div>
                  <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill fw-bold"
                    style={{ background: 'rgba(0,0,0,0.04)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    <span style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
                    Taille maximale : 10 MB par fichier
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Pending files preview */}
          {pendingFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-4 rounded-4 border"
              style={{ background: 'var(--color-surface-alt)' }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold small text-navy">{pendingFiles.length} fichier(s) prêt(s) à importer</span>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold extra-small"
                    onClick={e => { e.stopPropagation(); setPendingFiles([]); }}>
                    Annuler
                  </button>
                  <button className="btn btn-sm btn-premium rounded-pill px-3 fw-bold extra-small"
                    onClick={e => { e.stopPropagation(); processFiles(pendingFiles); setPendingFiles([]); }}>
                    ✓ Importer
                  </button>
                </div>
              </div>
              <div className="d-flex flex-column gap-2">
                {pendingFiles.map((f, i) => (
                  <div key={i} className="d-flex align-items-center gap-3 p-2 rounded-3 bg-surface border">
                    <div className="p-2 rounded-3 flex-shrink-0"
                      style={{ background: f.name.endsWith('.pdf') ? '#fef2f2' : f.name.endsWith('.pptx') ? '#fff7ed' : '#eff6ff' }}>
                      <FileText size={16} style={{ color: f.name.endsWith('.pdf') ? '#ef4444' : f.name.endsWith('.pptx') ? '#f97316' : '#2563eb' }} />
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="extra-small fw-bold text-navy text-truncate">{f.name}</div>
                      <div className="extra-small text-muted fw-bold">{(f.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <CheckCircle size={16} className="text-success flex-shrink-0" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Filters & Table Card */}
        <Card className="glass-card border-0 shadow-sm border overflow-hidden">
          <Card.Body className="p-0">
            {/* Table Header / Filters */}
            <div className="p-4 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 bg-white">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                <InputGroup className="bg-surface-alt rounded-pill border px-3">
                  <InputGroup.Text className="bg-transparent border-0 pe-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search documents..." 
                    className="bg-transparent border-0 py-2 extra-small shadow-none fw-bold"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <Filter size={18} className="text-muted" />
                  <Form.Select 
                    className="extra-small py-2 border rounded-pill bg-surface-alt fw-bold"
                    style={{ width: '150px' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option>All</option>
                    <option>Proposal</option>
                    <option>Reports</option>
                    <option>Documentation</option>
                  </Form.Select>
                </div>
              </div>
            </div>

            {/* Document Table */}
            <div className="table-responsive">
              <Table hover className="mb-0 align-middle">
                <thead className="bg-surface-alt">
                  <tr>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Document Name</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Category</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Upload Date</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Size</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Version</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, i) => (
                      <tr key={doc.id || i} className="border-bottom border-light border-opacity-10">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm bg-danger-soft text-danger rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                               <FileText size={18} />
                            </div>
                            <div className="fw-bold small text-navy">{doc.title}</div>
                          </div>
                        </td>
                        <td><span className="extra-small fw-bold text-muted text-uppercase">Proposal</span></td>
                        <td><span className="extra-small fw-bold text-muted">{new Date(doc.date).toISOString().split('T')[0]}</span></td>
                        <td><span className="extra-small fw-bold text-muted">{doc.size || '1.8 MB'}</span></td>
                        <td><span className="extra-small fw-bold text-muted">v{doc.version || '1.0'}</span></td>
                        <td>
                          <Badge className="bg-success-soft text-success border-0 px-3 py-1 extra-small fw-bold">Approved</Badge>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Dropdown align="end">
                            <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                              <MoreVertical size={18} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                              <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleView(doc)}><Eye size={14} className="text-primary" /> Voir</Dropdown.Item>
                              <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleDownload(doc)}><Download size={14} className="text-success" /> Télécharger</Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger d-flex align-items-center gap-2 py-2" onClick={() => {
                                if(window.confirm(`Are you sure you want to delete ${doc.title}?`)) {
                                  deleteDocument(doc.id);
                                }
                              }}><Trash2 size={14} /> Supprimer</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted extra-small fw-bold">
                        No documents found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ReportsPage;

