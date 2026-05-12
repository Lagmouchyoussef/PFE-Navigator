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

  const categories = [
    { name: 'Proposal', count: 1, icon: <Folder size={20} />, color: 'blue' },
    { name: 'Reports', count: 3, icon: <Folder size={20} />, color: 'blue' },
    { name: 'Documentation', count: 3, icon: <Folder size={20} />, color: 'blue' },
    { name: 'Presentations', count: 1, icon: <Folder size={20} />, color: 'blue' },
  ];

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadDocument(file.name, file);
      // Reset input
      e.target.value = null;
    }
  };

  const handleView = (doc) => {
    // Professional simulation: Open in new tab
    const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    window.open(samplePdfUrl, '_blank');
  };

  const handleDownload = (doc) => {
    // Professional simulation: Trigger file download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', doc.title);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    setSuccessMsg(`Téléchargement de "${doc.title}" commencé...`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-5"
          onClick={handleUploadClick}
        >
          <div className="p-5 text-center bg-surface-alt border-dashed-primary rounded-4 cursor-pointer hover-bg-white transition-all shadow-sm">
            <div className="p-3 bg-primary-soft text-primary rounded-circle d-inline-block mb-3">
              <Upload size={32} />
            </div>
            <h5 className="fw-bold mb-1 text-navy">Drag and drop files here or click to browse</h5>
            <p className="extra-small text-muted mb-0 fw-bold">Supported: PDF, DOCX, PPTX (Max 10MB)</p>
          </div>
        </motion.div>

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

