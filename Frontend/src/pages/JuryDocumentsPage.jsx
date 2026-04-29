import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { 
  Search, FileText, Download, Eye, CheckCircle, XCircle, 
  Clock, Archive, ChevronRight, Inbox, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const JuryDocumentsPage = () => {
  const { documents = [], approveDocument, rejectDocument } = useApp();

  const [searchTerm, setSearchTerm]       = useState('');
  const [filterStatus, setFilterStatus]   = useState('all');
  const [rejectModal, setRejectModal]     = useState(null); 
  const [rejectReason, setRejectReason]   = useState('');

  const filtered = (documents || []).filter(doc => {
    if (!doc || !doc.title) return false;
    const matchSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || doc.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: documents.length,
    pending: documents.filter(d => d.status === 'pending').length,
    approved: documents.filter(d => d.status === 'approved').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
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

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Deliverables Repository</h3>
            <p className="text-muted small mb-0">Review and validate student project reports and archives.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="bg-white rounded-3 px-2 border shadow-sm" style={{ width: '260px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-1"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Search documents..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-4">
          {[
            { title: 'Total Files', value: stats.total, icon: <Archive />, color: 'primary' },
            { title: 'Pending Review', value: stats.pending, icon: <Clock />, color: 'warning' },
            { title: 'Verified Assets', value: stats.approved, icon: <CheckCircle />, color: 'success' },
            { title: 'Flagged', value: stats.rejected, icon: <XCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <Card className="border-0 shadow-sm rounded-3 p-3 bg-white">
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <p className="extra-small text-muted fw-bold text-uppercase mb-0 tracking-wider">{stat.title}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
             <div className="d-flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                  <Button 
                    key={s} 
                    variant={filterStatus === s ? 'primary' : 'link'} 
                    size="sm"
                    className={`rounded-pill px-3 fw-bold extra-small text-decoration-none ${filterStatus === s ? 'text-white shadow-sm' : 'text-muted hover-bg-light'}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
             </div>
          </div>
          <Table responsive hover className="mb-0 align-middle">
            <thead className="bg-light text-muted extra-small text-uppercase">
              <tr>
                <th className="ps-4 py-3 border-0">Asset Details</th>
                <th className="py-3 border-0">Candidate</th>
                <th className="py-3 border-0">Submitted On</th>
                <th className="py-3 border-0">Status</th>
                <th className="text-end pe-4 py-3 border-0">Control</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {filtered.map(doc => (
                <tr key={doc.id}>
                  <td className="ps-4 py-3">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary"><FileText size={20} /></div>
                      <div>
                        <div className="small fw-bold">{doc.title}</div>
                        <div className="extra-small text-muted">v{doc.version} • {doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-circle-sm bg-light text-primary fw-bold">Y</div>
                      <span className="small fw-bold">Youssef M.</span>
                    </div>
                  </td>
                  <td className="small text-muted">{new Date(doc.date).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'} className="bg-opacity-10 text-opacity-100 rounded-pill px-3 py-1 extra-small" style={{ color: `var(--bs-${doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'})` }}>
                       {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="text-end pe-4">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="link" className="p-1 text-muted hover-primary"><Eye size={18}/></Button>
                      <Button variant="link" className="p-1 text-muted hover-primary"><Download size={18}/></Button>
                      {doc.status === 'pending' && (
                        <div className="d-flex gap-2 ms-2 border-start ps-3">
                          <Button variant="success" size="sm" className="rounded-pill px-3 fw-bold extra-small" onClick={() => handleApprove(doc.id)}>Verify</Button>
                          <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold extra-small" onClick={() => {setRejectModal(doc.id); setRejectReason('')}}>Flag</Button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    <Inbox size={48} className="text-muted opacity-25 mb-2" />
                    <p className="small fw-bold text-muted">No documents found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>

      <Modal show={!!rejectModal} onHide={() => setRejectModal(null)} centered contentClassName="border-0 shadow-lg rounded-4 overflow-hidden">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold h5">Review Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
           <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Required Corrections</Form.Label>
           <Form.Control as="textarea" rows={4} placeholder="Specify the corrections required for this deliverable..." className="rounded-3 p-3 small border shadow-none" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0 gap-2">
          <Button variant="light" className="flex-grow-1 rounded-3 fw-bold small py-2" onClick={() => setRejectModal(null)}>Cancel</Button>
          <Button variant="danger" className="flex-grow-1 rounded-3 fw-bold small py-2 shadow-sm" disabled={!rejectReason.trim()} onClick={handleRejectConfirm}>Confirm Flag</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JuryDocumentsPage;
