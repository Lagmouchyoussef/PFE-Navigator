import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Modal, Form } from 'react-bootstrap';
import { 
  FileText, Upload, Download, CheckCircle, Clock, 
  AlertCircle, Search, Trash2, Eye, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext.jsx';

const ReportsPage = () => {
  const { documents = [], deleteDocument, uploadDocument } = useApp();
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');

  const handleUpload = () => {
    if (uploadTitle) {
      uploadDocument(uploadTitle);
      setUploadTitle('');
      setShowUpload(false);
    }
  };

  return (
    <div className="dashboard-container min-vh-100 pb-5">
      <Container fluid className="px-4 px-xl-5">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="d-flex justify-content-between align-items-end mb-5 pt-4"
        >
          <div>
            <Badge className="badge-premium mb-2">Project Repository</Badge>
            <h1 className="fw-black display-5 mb-1 tracking-tighter text-white">Deliverables & <span className="text-gradient">Reports</span></h1>
            <p className="text-muted small mb-0">Centralized hub for all your academic documentation and validation history.</p>
          </div>
          <Button 
            variant="primary" 
            className="bg-gradient-primary border-0 rounded-pill px-4 py-2 fw-bold shadow-lg d-flex align-items-center gap-2"
            onClick={() => setShowUpload(true)}
          >
            <Upload size={18} /> New Submission
          </Button>
        </motion.div>

        <Row className="g-4">
          <Col lg={9}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card border-0 overflow-hidden">
                <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white bg-opacity-05">
                  <h5 className="fw-bold mb-0 text-white">Version History</h5>
                  <div className="search-box-inner px-3 py-1 rounded-pill d-flex align-items-center gap-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Search size={14} className="text-primary" />
                    <input type="text" placeholder="Search files..." className="bg-transparent border-0 extra-small text-white" style={{ outline: 'none' }} />
                  </div>
                </div>
                <Table responsive hover className="mb-0 custom-table-modern">
                  <thead>
                    <tr>
                      <th className="ps-4">Document</th>
                      <th>Version</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th className="text-end pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="align-middle">
                        <td className="ps-4 py-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className={`p-3 rounded-xl bg-${doc.status === 'approved' ? 'success' : 'primary'} bg-opacity-10 text-${doc.status === 'approved' ? 'success' : 'primary'}`}>
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="fw-bold small text-white">{doc.title}</div>
                              <div className="extra-small text-muted">{doc.size} • PDF Document</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted small">v{doc.version}.0</td>
                        <td className="text-muted extra-small">
                          {new Date(doc.date).toLocaleDateString()}
                        </td>
                        <td>
                          <Badge className={`rounded-pill px-3 py-1 extra-small bg-${doc.status === 'approved' ? 'success' : 'warning'} bg-opacity-10 text-${doc.status === 'approved' ? 'success' : 'warning'}`}>
                            {doc.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex justify-content-end gap-1">
                            <Button variant="link" className="p-2 text-muted hover-primary transition-all"><Download size={18} /></Button>
                            <Button variant="link" className="p-2 text-danger opacity-50 hover-opacity-100 transition-all" onClick={() => deleteDocument(doc.id)}><Trash2 size={18} /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </motion.div>
          </Col>

          <Col lg={3}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="glass-card border-0 p-4 mb-4 bg-gradient-primary text-white position-relative overflow-hidden">
                <Sparkles className="position-absolute top-0 end-0 opacity-10 m-n3" size={120} />
                <h5 className="fw-black mb-3 position-relative">Submission Insights</h5>
                <p className="extra-small opacity-75 mb-4">Ensure your documents follow the academic standards before submission.</p>
                <Button variant="light" className="w-100 rounded-pill fw-bold small py-2 shadow-sm border-0">View Timeline</Button>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>

      <Modal show={showUpload} onHide={() => setShowUpload(false)} centered contentClassName="glass-card border-0 rounded-4 overflow-hidden" className="dark-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-black h4 text-white">Submit Deliverable</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form.Group className="mb-4">
            <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Report Title</Form.Label>
            <Form.Control 
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder="e.g. System Architecture Design" 
              className="rounded-3 p-3 small border-0 bg-white bg-opacity-05 text-white" 
            />
          </Form.Group>
          <div className="p-5 border-2 border-dashed rounded-4 text-center bg-primary bg-opacity-05 border-primary border-opacity-20 cursor-pointer">
            <Upload size={40} className="text-primary opacity-50 mb-3" />
            <p className="small fw-bold text-white mb-1">Select your PDF document</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0 gap-3">
          <Button variant="link" className="flex-grow-1 text-muted fw-bold text-decoration-none" onClick={() => setShowUpload(false)}>Cancel</Button>
          <Button variant="primary" className="flex-grow-1 bg-gradient-primary border-0 rounded-pill fw-bold py-2 shadow-lg" onClick={handleUpload}>
            Confirm Submission
          </Button>
        </Modal.Footer>
      </Modal>

      <style>{`
        .custom-table-modern thead th {
          background: rgba(255,255,255, 0.02);
          border-bottom: 2px solid rgba(255,255,255,0.05);
          color: #94a3b8;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 1.25rem 1rem;
        }
        .custom-table-modern tbody tr:hover { background: rgba(255,255,255,0.02); }
        .dark-modal .modal-content { background: #0f172a !important; }
      `}</style>
    </div>
  );
};

export default ReportsPage;
