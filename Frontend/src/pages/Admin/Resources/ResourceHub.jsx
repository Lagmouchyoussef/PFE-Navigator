import React, { useState } from 'react';
import { 
  Plus, Search, Download, MoreHorizontal, 
  FileText, Image as ImageIcon, Video, 
  FileCode, Folder, ChevronRight, Share2, 
  Grid, List as ListIcon, FileCheck, BookOpen, HardDrive, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Table, Button, InputGroup, Form, Badge, Modal, Dropdown } from 'react-bootstrap';

const FILES = [
  { name: 'Rapport_jury_2026.pdf', type: 'PDF', size: '2.4 MB', date: '10 Mai 2026', color: 'primary' },
  { name: 'Guide_evaluation.docx', type: 'DOCX', size: '1.1 MB', date: '08 Mai 2026', color: 'primary' },
  { name: 'Donnees_analyse.xlsx', type: 'XLSX', size: '3.8 MB', date: '05 Mai 2026', color: 'primary' },
  { name: 'Presentation_projet.pptx', type: 'PPTX', size: '5.2 MB', date: '01 Mai 2026', color: 'primary' },
];

const ResourceHub = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="resources-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Centre de Ressources</h2>
            <p className="text-muted small mb-0">Gestion centralisée des documents et supports de travail.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Tout Télécharger
            </Button>
            <Button 
              className="fw-bold px-4 py-2 border-0 shadow-sm d-flex align-items-center gap-2 rounded-pill"
              style={{ backgroundColor: '#2563eb' }}
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} /> Téléverser
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <Row className="g-4 mb-5">
          {[
            { value: '18', label: 'Documents PDF', sub: 'Fichiers récents', color: 'primary', icon: <FileText /> },
            { value: '1.2 GB', label: 'Espace Utilisé', sub: 'Sur 10 GB', color: 'info', icon: <HardDrive /> },
            { value: '4', label: 'Nouveautés', sub: 'Cette semaine', color: 'success', icon: <Plus /> },
            { value: '6', label: 'Favoris', sub: 'Accès rapide', color: 'warning', icon: <Award /> },
          ].map((stat, i) => (
            <Col key={i} lg={3} md={6}>
              <div className={`resources-glass-card p-4 rounded-4 shadow-sm hover-translate transition-all cursor-pointer h-100 border-start-4 border-${stat.color}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h2 className="fw-bold mb-0">{stat.value}</h2>
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                </div>
                <h6 className="fw-bold text-muted small mb-1">{stat.label}</h6>
                <p className="extra-small text-muted opacity-75 mb-0">{stat.sub}</p>
              </div>
            </Col>
          ))}
        </Row>

        {/* Repository Table */}
        <div className="resources-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <h5 className="fw-bold mb-0">Fichiers récents</h5>
            <div className="d-flex gap-2">
              <InputGroup className="bg-surface rounded-pill border px-2 overflow-hidden d-none d-md-flex">
                <InputGroup.Text className="bg-transparent border-0"><Search size={16} className="text-muted"/></InputGroup.Text>
                <Form.Control placeholder="Rechercher..." className="bg-transparent border-0 shadow-none extra-small text-primary-custom" />
              </InputGroup>
              <Button variant="outline-secondary" size="sm" className="border rounded-pill px-3"><ListIcon size={16} /></Button>
              <Button variant="primary" size="sm" style={{ backgroundColor: '#2563eb' }} className="border-0 rounded-pill px-3"><Grid size={16} /></Button>
            </div>
          </div>
          
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 resources-table">
              <thead>
                <tr className="border-bottom opacity-50">
                  <th className="ps-4 py-3 extra-small text-muted text-uppercase fw-bold">Nom du fichier</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Type</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Taille</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Modifié le</th>
                  <th className="py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {FILES.map((file, i) => (
                  <tr key={i} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                          <FileText size={18} />
                        </div>
                        <span className="small fw-bold">{file.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {file.type}
                      </Badge>
                    </td>
                    <td className="py-3 small text-muted">{file.size}</td>
                    <td className="py-3 small text-muted">{file.date}</td>
                    <td className="pe-4 py-3 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="text-muted p-0 no-caret shadow-none border-0">
                          <MoreHorizontal size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                          <Dropdown.Item className="extra-small fw-bold"><Download size={14} className="me-2" /> Télécharger</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold"><Share2 size={14} className="me-2" /> Partager</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="extra-small fw-bold text-danger">Supprimer</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      <style>{`
        .resources-modern-layout {
          color: var(--text-primary);
        }
        .resources-glass-card {
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
        .resources-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        
        h2, h5, .fw-bold {
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

export default ResourceHub;
