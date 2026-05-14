import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, InputGroup, Modal 
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Download, CheckCircle, Clock, 
  Search, Trash2, Eye, Folder, Filter, ChevronDown,
  FilePlus, MoreVertical, X, GraduationCap, Users
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext.jsx';

// Custom Animated Trash Icon Component
const AnimatedTrash = ({ isDeleting }) => {
  return (
    <svg 
      width="32" height="32" viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      {/* Lid & Handle */}
      <motion.g
        animate={isDeleting ? { y: -4, rotate: -20, originX: '20px', originY: '6px' } : { y: 0, rotate: 0 }}
        transition={{ duration: 0.3 }}
      >
        <path d="M3 6h18" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </motion.g>
      {/* Body */}
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
};

const ReportsPage = () => {
  const { session, documents = [], deleteDocument, uploadDocument } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const fileInputRef = useRef(null);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploadTarget, setUploadTarget] = useState('supervisor');
  const [deleteModalDoc, setDeleteModalDoc] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
        const doc = uploadDocument(file.name, file, uploadTarget);
        // Store a real browser object URL so we can view/download this file
        const url = URL.createObjectURL(file);
        fileUrlMap.current[doc.id] = { url, name: file.name };
      }
    });
    setSuccessMsg(`${files.length} fichier(s) envoyé(s) à ${uploadTarget === 'supervisor' ? "l'encadrant" : "le jury"} !`);
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
    // Only show documents for the current logged-in student
    const isOwner = doc.studentName === session?.name;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return isOwner && matchesSearch;
  });

  const userDocs = documents.filter(d => d.studentName === session?.name);

  const categories = [
    { name: 'Tous', count: userDocs.length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'PDF', count: userDocs.filter(d => d.title.toLowerCase().endsWith('.pdf')).length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'DOCX', count: userDocs.filter(d => d.title.toLowerCase().endsWith('.docx')).length, icon: <Folder size={20} />, color: 'blue' },
    { name: 'PPTX', count: userDocs.filter(d => d.title.toLowerCase().endsWith('.pptx')).length, icon: <Folder size={20} />, color: 'blue' },
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
              <div className="mt-4 mb-4" />
              <p className="text-muted mb-4 fw-bold" style={{ fontSize: '0.82rem' }}>
                {isDragging ? (
                  "Les fichiers seront affectés à la cible sélectionnée"
                ) : (
                  "Cliquez pour parcourir ou déposez vos documents (PDF, Word, PPT)"
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
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                  <span className="fw-bold small text-navy d-block mb-1">{pendingFiles.length} fichier(s) prêt(s) à être importé(s)</span>
                  <span className="extra-small text-muted fw-bold">Veuillez choisir la destination ci-dessous :</span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold extra-small"
                    onClick={e => { e.stopPropagation(); setPendingFiles([]); }}>
                    Annuler
                  </button>
                  <button className="btn btn-sm btn-premium rounded-pill px-4 fw-bold extra-small shadow-sm"
                    onClick={e => { e.stopPropagation(); processFiles(pendingFiles); setPendingFiles([]); }}>
                    ✓ Importer pour {uploadTarget === 'supervisor' ? "l'Encadrant" : "le Jury"}
                  </button>
                </div>
              </div>

              <div className="d-flex gap-2 mb-4 p-2 bg-white rounded-4 border shadow-sm w-fit-content mx-auto mx-md-0" onClick={e => e.stopPropagation()}>
                <Button 
                  variant={uploadTarget === 'supervisor' ? 'primary' : 'outline-light text-muted'} 
                  className={`rounded-pill px-4 fw-bold extra-small border-0 ${uploadTarget === 'supervisor' ? 'shadow-sm' : ''}`}
                  onClick={() => setUploadTarget('supervisor')}
                >
                  <Users size={14} className="me-2" /> Vers Encadrant
                </Button>
                <Button 
                  variant={uploadTarget === 'jury' ? 'primary' : 'outline-light text-muted'} 
                  className={`rounded-pill px-4 fw-bold extra-small border-0 ${uploadTarget === 'jury' ? 'shadow-sm' : ''}`}
                  onClick={() => setUploadTarget('jury')}
                >
                  <GraduationCap size={14} className="me-2" /> Vers Jury
                </Button>
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

        {/* Tables Section */}
        <Row className="g-4">
          <Col lg={12}>
            <div className="d-flex flex-column gap-5">
              
              {/* Supervisor Table */}
              <div className="document-section">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-primary-soft text-primary"><Users size={20} /></div>
                  <h5 className="fw-bold text-navy mb-0">Documents pour l'Encadrant</h5>
                </div>
                <Card className="glass-card border-0 shadow-sm border overflow-hidden">
                  <div className="table-responsive">
                    <Table hover className="mb-0 align-middle">
                      <thead className="bg-surface-alt">
                        <tr>
                          <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Nom du Document</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Version</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Date d'Envoi</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Taille</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                          <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocs.filter(d => d.target === 'supervisor').length > 0 ? (
                          filteredDocs.filter(d => d.target === 'supervisor').map((doc) => (
                            <tr key={doc.id} className="border-bottom border-light border-opacity-10">
                              <td className="px-4 py-4">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="avatar-sm bg-primary-soft text-primary rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                    <FileText size={18} />
                                  </div>
                                  <div className="fw-bold small text-navy">{doc.title}</div>
                                </div>
                              </td>
                              <td className="text-center"><Badge bg="light" className="text-navy border extra-small fw-bold px-3 py-1">v{doc.version}</Badge></td>
                              <td><span className="extra-small fw-bold text-muted">{new Date(doc.date).toLocaleDateString()}</span></td>
                              <td><span className="extra-small fw-bold text-muted">{doc.size}</span></td>
                              <td>
                                <Badge className={`bg-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}-soft text-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'} border-0 px-3 py-1 extra-small fw-bold`}>
                                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-4 text-end">
                                <Dropdown align="end">
                                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                                    <MoreVertical size={18} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleView(doc)}><Eye size={14} className="text-primary" /> Voir</Dropdown.Item>
                                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleDownload(doc)}><Download size={14} className="text-success" /> Télécharger</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2 py-2" onClick={() => setDeleteModalDoc(doc)}>
                                      <Trash2 size={14} /> Supprimer
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="6" className="text-center py-5 opacity-50 fw-bold small">Aucun document pour l'encadrant</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </div>

              {/* Jury Table */}
              <div className="document-section">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="p-2 rounded-3 bg-warning-soft text-warning"><GraduationCap size={20} /></div>
                  <h5 className="fw-bold text-navy mb-0">Documents pour le Jury</h5>
                </div>
                <Card className="glass-card border-0 shadow-sm border overflow-hidden">
                  <div className="table-responsive">
                    <Table hover className="mb-0 align-middle">
                      <thead className="bg-surface-alt">
                        <tr>
                          <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Nom du Document</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase text-center">Version</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Date d'Envoi</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Taille</th>
                          <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                          <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDocs.filter(d => d.target === 'jury').length > 0 ? (
                          filteredDocs.filter(d => d.target === 'jury').map((doc) => (
                            <tr key={doc.id} className="border-bottom border-light border-opacity-10">
                              <td className="px-4 py-4">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="avatar-sm bg-warning-soft text-warning rounded-3 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                                    <FileText size={18} />
                                  </div>
                                  <div className="fw-bold small text-navy">{doc.title}</div>
                                </div>
                              </td>
                              <td className="text-center"><Badge bg="light" className="text-navy border extra-small fw-bold px-3 py-1">v{doc.version}</Badge></td>
                              <td><span className="extra-small fw-bold text-muted">{new Date(doc.date).toLocaleDateString()}</span></td>
                              <td><span className="extra-small fw-bold text-muted">{doc.size}</span></td>
                              <td>
                                <Badge className={`bg-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'}-soft text-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'} border-0 px-3 py-1 extra-small fw-bold`}>
                                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                </Badge>
                              </td>
                              <td className="px-4 text-end">
                                <Dropdown align="end">
                                  <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                                    <MoreVertical size={18} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleView(doc)}><Eye size={14} className="text-primary" /> Voir</Dropdown.Item>
                                    <Dropdown.Item className="d-flex align-items-center gap-2 py-2" onClick={() => handleDownload(doc)}><Download size={14} className="text-success" /> Télécharger</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2 py-2" onClick={() => setDeleteModalDoc(doc)}>
                                      <Trash2 size={14} /> Supprimer
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="6" className="text-center py-5 opacity-50 fw-bold small">Aucun document pour le jury</td></tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Card>
              </div>

            </div>
          </Col>
        </Row>
      </Container>

      {/* Delete Confirmation Modal */}
      <Modal show={!!deleteModalDoc} onHide={() => setDeleteModalDoc(null)} centered>
        <div className="glass-card border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="p-4 text-center">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="d-inline-flex align-items-center justify-content-center mb-4 p-3 rounded-circle bg-danger-soft text-danger" 
              style={{ width: '64px', height: '64px' }}
            >
              <AnimatedTrash isDeleting={isDeleting} />
            </motion.div>
            <h5 className="fw-bold text-navy mb-3">Supprimer le document ?</h5>
            <p className="text-muted small mb-4 fw-bold px-3">
              Êtes-vous sûr de vouloir supprimer <span className="text-danger">"{deleteModalDoc?.title}"</span> ? Cette action est irréversible.
            </p>
            <div className="d-flex gap-2 p-2">
              <Button 
                variant="outline-secondary" 
                className="flex-grow-1 rounded-pill fw-bold extra-small border-2 py-2"
                onClick={() => setDeleteModalDoc(null)}
              >
                Annuler
              </Button>
              <Button 
                variant="danger" 
                className="flex-grow-1 rounded-pill fw-bold extra-small border-0 shadow-sm py-2"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleting(true);
                  // Wait for animation to finish before closing and deleting
                  setTimeout(() => {
                    deleteDocument(deleteModalDoc.id);
                    setDeleteModalDoc(null);
                    setIsDeleting(false);
                    setSuccessMsg(`"${deleteModalDoc.title}" a été supprimé.`);
                    setShowSuccessCard(true);
                    setTimeout(() => setShowSuccessCard(false), 5000);
                  }, 600);
                }}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ReportsPage;

