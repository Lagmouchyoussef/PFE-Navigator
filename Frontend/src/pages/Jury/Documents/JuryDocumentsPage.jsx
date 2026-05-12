import React, { useState } from 'react';
import { Container, Card, Table, Badge, Button, Form, InputGroup, Modal, Row, Col } from 'react-bootstrap';
import { 
  Search, FileText, Download, Eye, CheckCircle, XCircle, 
  Clock, Archive, ChevronRight, Inbox, AlertCircle, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

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
    <div className="jury-documents-modern py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Entrepôt des Livrables</h2>
            <p className="text-muted small mb-0">Consultez et validez les rapports et archives des projets étudiants.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="bg-surface rounded-pill border px-3 shadow-none" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Rechercher un document..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-primary-custom"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { title: 'Total Fichiers', value: stats.total, icon: <Archive />, color: 'primary' },
            { title: 'En attente', value: stats.pending, icon: <Clock />, color: 'warning' },
            { title: 'Vérifiés', value: stats.approved, icon: <CheckCircle />, color: 'success' },
            { title: 'Signalés', value: stats.rejected, icon: <XCircle />, color: 'danger' },
          ].map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <div className={`doc-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{stat.title}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Repository Control */}
        <div className="doc-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
             <div className="d-flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                  <Button 
                    key={s} 
                    variant={filterStatus === s ? 'primary' : 'outline-secondary'} 
                    size="sm"
                    className={`rounded-pill px-4 fw-bold extra-small border-2 ${filterStatus === s ? 'border-0' : 'border-opacity-25'}`}
                    style={filterStatus === s ? { backgroundColor: '#2563eb' } : {}}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
             </div>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 doc-table">
              <thead>
                <tr className="border-bottom opacity-50 bg-surface-alt">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Détails de l'Asset</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Candidat</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Soumis le</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Statut</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Contrôle</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(doc => (
                  <tr key={doc.id} className="border-bottom border-light border-opacity-10">
                    <td className="px-4 py-4">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary"><FileText size={20} /></div>
                        <div>
                          <div className="small fw-bold">{doc.title}</div>
                          <div className="extra-small text-muted fw-bold opacity-75">v{doc.version} • {doc.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-xs bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.65rem' }}>Y</div>
                        <span className="extra-small fw-bold opacity-75">Youssef M.</span>
                      </div>
                    </td>
                    <td className="py-4 small text-muted fw-bold">{new Date(doc.date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge bg={doc.status === 'approved' ? 'success' : doc.status === 'pending' ? 'warning' : 'danger'} className="bg-opacity-10 text-success border border-success border-opacity-25 extra-small">
                         {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3"><Eye size={18}/></Button>
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3"><Download size={18}/></Button>
                        {doc.status === 'pending' && (
                          <div className="d-flex gap-2 ms-2 ps-3 border-start">
                            <Button variant="success" size="sm" className="rounded-pill px-3 fw-bold extra-small border-0 shadow-sm" onClick={() => handleApprove(doc.id)}>Vérifier</Button>
                            <Button variant="outline-danger" size="sm" className="rounded-pill px-3 fw-bold extra-small border-2" onClick={() => {setRejectModal(doc.id); setRejectReason('')}}>Signaler</Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <Inbox size={48} className="text-muted opacity-25 mb-3" />
                      <p className="small fw-bold text-muted">Aucun document trouvé pour ce filtre.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Reject Modal */}
      <Modal show={!!rejectModal} onHide={() => setRejectModal(null)} centered className="doc-modern-modal">
        <div className="doc-glass-card rounded-4 overflow-hidden border-0">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Signalement de Document</h5>
            <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setRejectModal(null)}><X size={20}/></Button>
          </div>
          <Modal.Body className="p-4">
             <Form.Label className="extra-small fw-bold text-muted text-uppercase mb-2">Corrections Requises</Form.Label>
             <Form.Control 
               as="textarea" 
               rows={4} 
               placeholder="Spécifiez les corrections ou le motif du signalement..." 
               className="bg-surface-alt border-0 rounded-4 p-3 small text-primary-custom shadow-none" 
               value={rejectReason} 
               onChange={(e) => setRejectReason(e.target.value)} 
             />
          </Modal.Body>
          <div className="p-4 border-top bg-surface-alt d-flex gap-2">
            <Button variant="outline-secondary" className="flex-grow-1 rounded-pill fw-bold extra-small border-2" onClick={() => setRejectModal(null)}>Annuler</Button>
            <Button variant="danger" className="flex-grow-1 rounded-pill fw-bold extra-small border-0 shadow-sm" disabled={!rejectReason.trim()} onClick={handleRejectConfirm}>Confirmer le Signalement</Button>
          </div>
        </div>
      </Modal>

      <style>{`
        .jury-documents-modern {
          color: var(--text-primary);
        }
        .doc-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .bg-surface {
          background-color: var(--surface) !important;
        }
        .doc-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        
        h2, h4, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  );
};

export default JuryDocumentsPage;
