import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup, InputGroup, ProgressBar } from 'react-bootstrap';
import { 
  FileText, CheckCircle, XCircle, Search, Clock, Download, 
  ExternalLink, MessageSquare, AlertCircle, Eye, Filter,
  ChevronRight, FileCheck, FileX, Info, List, History, Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const ReportValidationPage = () => {
  const { documents, approveDocument, rejectDocument } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocId, setSelectedDocId] = useState(documents.find(d => d.status === 'pending')?.id || documents[0]?.id);
  const [comment, setComment] = useState('');

  const selectedDoc = documents.find(d => d.id === selectedDocId);
  const pendingDocs = documents.filter(d => d.status === 'pending');
  const otherDocs = documents.filter(d => d.status !== 'pending');

  const handleAction = (type) => {
    if (!selectedDoc) return;
    if (type === 'approve') {
      approveDocument(selectedDoc.id);
    } else {
      rejectDocument(selectedDoc.id, comment || "Revision required.");
    }
    setComment('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <Badge bg="success" className="bg-opacity-10 text-success border border-success border-opacity-10 px-2 py-1 extra-small fw-bold">APPROVED</Badge>;
      case 'rejected': return <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger border-opacity-10 px-2 py-1 extra-small fw-bold">REJECTED</Badge>;
      default: return <Badge bg="warning" className="bg-opacity-10 text-warning border border-warning border-opacity-10 px-2 py-1 extra-small fw-bold">PENDING</Badge>;
    }
  };

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Deliverable Validation</h3>
            <p className="text-muted small mb-0">Review student submissions and provide official assessment feedback.</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <div className="text-center px-3 border-end">
              <div className="extra-small text-muted fw-bold text-uppercase mb-1">Queue</div>
              <div className="h5 fw-bold mb-0 text-primary">{pendingDocs.length}</div>
            </div>
            <div className="text-center px-3">
              <div className="extra-small text-muted fw-bold text-uppercase mb-1">Reviewed</div>
              <div className="h5 fw-bold mb-0 text-success">{otherDocs.length}</div>
            </div>
          </div>
        </div>

        <Row className="g-4">
          {/* Submissions List Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden h-100 bg-white">
              <div className="p-3 border-bottom">
                <InputGroup size="sm" className="bg-light rounded-pill px-3 border shadow-inner">
                  <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                  <Form.Control 
                    placeholder="Search submissions..." 
                    className="bg-transparent border-0 shadow-none py-2 small fw-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </InputGroup>
              </div>
              <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                <div className="px-3 py-2 extra-small fw-bold text-muted text-uppercase bg-light">Awaiting Review</div>
                <ListGroup variant="flush">
                  {pendingDocs.map(doc => (
                    <ListGroup.Item 
                      key={doc.id}
                      action
                      active={selectedDocId === doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className="px-3 py-3 border-0 border-bottom d-flex align-items-start gap-3"
                    >
                      <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                        <FileText size={18} />
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-dark mb-1 text-truncate">{doc.title}</div>
                        <div className="extra-small text-muted d-flex justify-content-between">
                          <span>v{doc.version} • {doc.size}</span>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                  {pendingDocs.length === 0 && <div className="p-3 extra-small text-muted italic text-center">No pending reviews.</div>}
                </ListGroup>

                <div className="px-3 py-2 extra-small fw-bold text-muted text-uppercase bg-light mt-2">Recently Processed</div>
                <ListGroup variant="flush">
                  {otherDocs.map(doc => (
                    <ListGroup.Item 
                      key={doc.id}
                      action
                      active={selectedDocId === doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className="px-3 py-3 border-0 border-bottom d-flex align-items-start gap-3"
                    >
                      <div className={`p-2 bg-${doc.status === 'approved' ? 'success' : 'danger'} bg-opacity-10 text-${doc.status === 'approved' ? 'success' : 'danger'} rounded-3`}>
                        {doc.status === 'approved' ? <FileCheck size={18} /> : <FileX size={18} />}
                      </div>
                      <div className="flex-grow-1 overflow-hidden">
                        <div className="small fw-bold text-dark mb-1 text-truncate">{doc.title}</div>
                        <div className="d-flex justify-content-between align-items-center">
                          {getStatusBadge(doc.status)}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Card>
          </Col>

          {/* Main Viewer & Action Area */}
          <Col lg={8}>
            {selectedDoc ? (
              <div className="d-flex flex-column gap-4 h-100">
                <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
                  <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center bg-white">
                     <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-light rounded-3 text-primary"><FileText size={24} /></div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{selectedDoc.title}</h6>
                          <span className="extra-small text-muted">Submitted on {new Date(selectedDoc.date).toLocaleDateString()}</span>
                        </div>
                     </div>
                     <div className="d-flex gap-2">
                         <Button 
                           variant="outline-primary" 
                           size="sm" 
                           className="rounded-3 px-3 fw-bold border-1"
                           onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                         >
                           <Download size={14} className="me-2" /> Get PDF
                         </Button>
                         <Button 
                           variant="light" 
                           size="sm" 
                           className="rounded-3 px-3 fw-bold border"
                           onClick={() => window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')}
                         >
                           <ExternalLink size={14} className="me-2" /> Open
                         </Button>
                     </div>
                  </div>

                  <Row className="g-0">
                    <Col md={7} className="bg-light border-end">
                       <div className="p-5 d-flex flex-column align-items-center justify-content-center text-center text-muted" style={{ minHeight: '500px' }}>
                          <FileText size={64} className="opacity-25 mb-3" />
                          <div className="fw-bold mb-1">Interactive Document Preview</div>
                          <div className="extra-small px-4">Standard PDF viewer active for internal review.</div>
                       </div>
                    </Col>
                    <Col md={5}>
                       <div className="p-4 d-flex flex-column h-100">
                          <h6 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2 small"><Info size={16} className="text-primary" /> Evaluation Panel</h6>
                          
                          <div className="mb-4">
                             <div className="extra-small fw-bold text-muted text-uppercase mb-3">Validation Metrics</div>
                             <div className="mb-3">
                                <div className="d-flex justify-content-between extra-small mb-1 fw-bold text-dark"><span>Academic Rigor</span><span>85%</span></div>
                                <ProgressBar now={85} variant="primary" style={{ height: '4px' }} className="rounded-pill" />
                             </div>
                             <div className="mb-3">
                                <div className="d-flex justify-content-between extra-small mb-1 fw-bold text-dark"><span>Presentation Quality</span><span>70%</span></div>
                                <ProgressBar now={70} variant="info" style={{ height: '4px' }} className="rounded-pill" />
                             </div>
                          </div>

                          <Form.Group className="mb-4 flex-grow-1">
                             <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Reviewer Feedback</Form.Label>
                             <Form.Control 
                               as="textarea" rows={6} 
                               placeholder="Provide constructive feedback for the candidate..."
                               className="bg-light border-0 p-3 small fw-medium shadow-none"
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                             />
                          </Form.Group>

                          <div className="pt-4 border-top">
                             {selectedDoc.status === 'pending' ? (
                               <div className="d-flex gap-2">
                                  <Button variant="primary" className="flex-grow-1 fw-bold small py-2 shadow-sm" onClick={() => handleAction('approve')}>Approve Submission</Button>
                                  <Button variant="outline-danger" className="flex-grow-1 fw-bold small py-2" onClick={() => handleAction('reject')}>Reject</Button>
                               </div>
                             ) : (
                               <div className="p-3 rounded-3 bg-light text-center">
                                  <div className={`fw-bold text-${selectedDoc.status === 'approved' ? 'success' : 'danger'} small`}>{selectedDoc.status.toUpperCase()}</div>
                                  <div className="extra-small text-muted">Processed on {new Date(selectedDoc.date).toLocaleDateString()}</div>
                               </div>
                             )}
                          </div>
                       </div>
                    </Col>
                  </Row>
                </Card>
              </div>
            ) : (
              <Card className="border-0 shadow-sm rounded-3 d-flex align-items-center justify-content-center p-5 text-center text-muted bg-white h-100">
                 <FileText size={48} className="opacity-25 mb-3" />
                 <h6 className="fw-bold">No Deliverable Selected</h6>
                 <p className="extra-small px-5">Select a student submission from the list to begin the evaluation process.</p>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReportValidationPage;
