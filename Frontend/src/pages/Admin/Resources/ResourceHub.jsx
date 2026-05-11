import React, { useState } from 'react';
import { 
  Plus, Search, Download, MoreHorizontal, 
  FileText, Image as ImageIcon, Video, 
  FileCode, Folder, ChevronRight, Share2, 
  Grid, List as ListIcon, FileCheck, BookOpen, HardDrive, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Table, Button, InputGroup, Form, Badge, Modal } from 'react-bootstrap';

const FILES = [
  { name: 'Rapport_jury_2026.pdf', type: 'PDF', size: '2.4 MB', date: '10 Mai 2026', color: 'primary' },
  { name: 'Guide_evaluation.docx', type: 'DOCX', size: '1.1 MB', date: '08 Mai 2026', color: 'primary' },
  { name: 'Donnees_analyse.xlsx', type: 'XLSX', size: '3.8 MB', date: '05 Mai 2026', color: 'primary' },
  { name: 'Presentation_projet.pptx', type: 'PPTX', size: '5.2 MB', date: '01 Mai 2026', color: 'primary' },
];

const ResourceHub = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleExport = (fileName) => {
    alert(`Téléchargement de ${fileName} en cours...`);
  };

  return (
    <div className="resources-simple-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold text-dark mb-1">Centre de Ressources</h2>
            <p className="text-muted small mb-0">Gestion centralisée des documents et supports de travail.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" className="bg-white text-dark fw-bold small px-3 border shadow-sm">
              <Download size={16} className="me-2" /> Tout Télécharger
            </Button>
            <Button 
              className="fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2"
              style={{ backgroundColor: '#2563eb' }}
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} /> Téléverser un fichier
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <Row className="g-4 mb-5">
          {[
            { value: '18', label: 'Documents PDF', sub: 'Fichiers récents', color: 'blue-custom', icon: <FileText /> },
            { value: '1.2 GB', label: 'Espace Utilisé', sub: 'Sur 10 GB', color: 'purple-custom', icon: <HardDrive /> },
            { value: '4', label: 'Nouveautés', sub: 'Cette semaine', color: 'emerald-custom', icon: <Plus /> },
            { value: '6', label: 'Favoris', sub: 'Accès rapide', color: 'amber-custom', icon: <Award /> },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <Card className={`border shadow-sm rounded-3 p-4 bg-white hover-translate transition-all cursor-pointer h-100 resources-stat-card border-${stat.color}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h2 className="fw-bold text-dark mb-0">{stat.value}</h2>
                  <div className={`p-2 rounded-circle bg-light text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 20 })}
                  </div>
                </div>
                <h6 className="fw-bold text-muted small mb-1">{stat.label}</h6>
                <p className="extra-small text-muted opacity-75 mb-0">{stat.sub}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Repository Table */}
        <Card className="border shadow-sm rounded-3 overflow-hidden bg-white mb-5 resources-main-card">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
            <h5 className="fw-bold text-dark mb-0">Fichiers récents</h5>
            <div className="d-flex gap-2">
              <InputGroup className="bg-light rounded-pill border-0 px-2 overflow-hidden d-none d-md-flex">
                <InputGroup.Text className="bg-transparent border-0"><Search size={16} className="text-muted"/></InputGroup.Text>
                <Form.Control placeholder="Rechercher un fichier..." className="bg-transparent border-0 shadow-none extra-small" />
              </InputGroup>
              <Button variant="light" size="sm" className="border rounded-2"><ListIcon size={16} /></Button>
              <Button variant="primary" size="sm" style={{ backgroundColor: '#2563eb' }} className="border-0 rounded-2"><Grid size={16} /></Button>
            </div>
          </div>
          
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4 py-3 extra-small text-muted text-uppercase fw-bold border-0">Nom du fichier</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Type</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Taille</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold border-0">Modifié le</th>
                  <th className="py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold border-0">Actions</th>
                </tr>
              </thead>
              <tbody>
                {FILES.map((file, i) => (
                  <tr key={i} className="align-middle border-bottom">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`p-2 rounded-2 bg-light text-primary`}>
                          <FileText size={18} />
                        </div>
                        <span className="small fw-bold text-dark">{file.name}</span>
                      </div>
                    </td>
                    <td><Badge bg="light" className="text-muted border extra-small px-2 py-1">{file.type}</Badge></td>
                    <td className="extra-small text-muted fw-bold">{file.size}</td>
                    <td className="extra-small text-muted fw-bold">{file.date}</td>
                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" size="sm" className="rounded-2" onClick={() => handleExport(file.name)} title="Télécharger"><Download size={14} /></Button>
                        <Button variant="light" size="sm" className="rounded-2" title="Partager"><Share2 size={14} /></Button>
                        <Button variant="light" size="sm" className="rounded-2" title="Plus"><MoreHorizontal size={14} /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>

      {/* UPLOAD MODAL */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Téléverser des Ressources</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="p-5 border border-2 border-dashed rounded-3 bg-light mb-3">
            <Plus size={40} className="text-muted opacity-50 mb-2" />
            <div className="small fw-bold text-muted">Glissez-déposez vos fichiers ici</div>
            <div className="extra-small text-muted mt-1">ou cliquez pour parcourir</div>
          </div>
          <Button className="w-100 fw-bold border-0" style={{ backgroundColor: '#2563eb' }} onClick={() => setShowUploadModal(false)}>
            Confirmer le Téléchargement
          </Button>
        </Modal.Body>
      </Modal>

      <style>{`
        .resources-simple-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .resources-stat-card {
          border-left: 4px solid #2563eb !important;
          transition: transform 0.2s ease;
        }
        .border-blue-custom { border-left-color: #3b82f6 !important; }
        .border-purple-custom { border-left-color: #8b5cf6 !important; }
        .border-emerald-custom { border-left-color: #10b981 !important; }
        .border-amber-custom { border-left-color: #f59e0b !important; }

        .text-blue-custom { color: #3b82f6 !important; }
        .text-purple-custom { color: #8b5cf6 !important; }
        .text-emerald-custom { color: #10b981 !important; }
        .text-amber-custom { color: #f59e0b !important; }

        .resources-stat-card:hover {
          transform: translateY(-5px);
        }
        .resources-main-card {
          border-top: 4px solid #2563eb !important;
        }
        .hover-translate:hover {
          transform: translateY(-5px);
          border-color: #2563eb !important;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .transition-all { transition: all 0.2s ease; }
      `}</style>
    </div>
  );
};

export default ResourceHub;
