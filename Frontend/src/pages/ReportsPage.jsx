import React, { useState, useRef } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Button, Table, Form, InputGroup 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FileText, Upload, Download, CheckCircle, Clock, 
  Search, Trash2, Eye, Folder, Filter, ChevronDown,
  FilePlus, MoreVertical, X
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import './ReportsPage.css';

const ReportsPage = () => {
  const { documents = [], deleteDocument, uploadDocument } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const fileInputRef = useRef(null);

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

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="doc-page-layout p-4">
      <Container fluid className="px-0">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
          accept=".pdf,.docx,.pptx"
        />

        {/* Header Section */}
        <header className="d-flex justify-content-between align-items-center mb-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="doc-title mb-1">Documents</h1>
            <p className="doc-subtitle text-muted mb-0">Manage all your PFE project documents</p>
          </motion.div>
          <Button 
            className="btn-upload d-flex align-items-center gap-2 px-4 py-2"
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
                <Card className="doc-stat-card border-0 shadow-sm">
                  <Card.Body className="p-4 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="small text-muted fw-medium mb-1">{cat.name}</div>
                      <h2 className="fw-bold mb-0">{cat.count}</h2>
                    </div>
                    <div className="doc-folder-icon">
                      <Folder size={24} className="text-primary" />
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
          <div className="doc-dropzone p-5 text-center">
            <div className="doc-dropzone-icon mb-3">
              <Upload size={32} className="text-muted" />
            </div>
            <h5 className="fw-bold mb-1">Drag and drop files here or click to browse</h5>
            <p className="extra-small text-muted mb-0">Supported: PDF, DOCX, PPTX (Max 10MB)</p>
          </div>
        </motion.div>

        {/* Filters & Table Card */}
        <Card className="doc-main-card border-0 shadow-sm">
          <Card.Body className="p-0">
            {/* Table Header / Filters */}
            <div className="p-4 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div className="doc-search-wrapper w-100" style={{ maxWidth: '400px' }}>
                <InputGroup className="bg-light rounded-pill border px-2">
                  <InputGroup.Text className="bg-transparent border-0 pe-0">
                    <Search size={18} className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control 
                    placeholder="Search documents..." 
                    className="bg-transparent border-0 py-2 extra-small shadow-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-muted" />
                <Form.Select 
                  className="extra-small py-2 border rounded-pill bg-light"
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

            {/* Document Table */}
            <div className="table-responsive">
              <Table hover className="mb-0 doc-table">
                <thead>
                  <tr>
                    <th className="ps-4">DOCUMENT NAME</th>
                    <th>CATEGORY</th>
                    <th>UPLOAD DATE</th>
                    <th>SIZE</th>
                    <th>VERSION</th>
                    <th>STATUS</th>
                    <th className="text-end pe-4">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.length > 0 ? (
                    filteredDocs.map((doc, i) => (
                      <tr key={doc.id || i} className="align-middle">
                        <td className="ps-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <FileText size={20} className="text-danger" />
                            <div className="fw-bold small">{doc.title}</div>
                          </div>
                        </td>
                        <td><span className="small text-muted">Proposal</span></td>
                        <td><span className="small text-muted">{new Date(doc.date).toISOString().split('T')[0]}</span></td>
                        <td><span className="small text-muted">{doc.size || '1.8 MB'}</span></td>
                        <td><span className="small text-muted">v{doc.version || '1.0'}</span></td>
                        <td>
                          <Badge className="badge-approved px-3 py-1 fw-bold">Approved</Badge>
                        </td>
                        <td className="pe-4 text-end">
                          <div className="d-flex justify-content-end gap-3 text-muted">
                            <Eye size={18} className="cursor-pointer hover-navy" />
                            <Download size={18} className="cursor-pointer hover-navy" />
                            <Trash2 size={18} className="cursor-pointer text-danger hover-opacity" onClick={() => deleteDocument(doc.id)} />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5 text-muted small">
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
