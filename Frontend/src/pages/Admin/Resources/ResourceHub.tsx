import React, { useState } from 'react';
import { 
  Plus, Search, Download, MoreHorizontal, 
  FileText, 
  Grid, List as ListIcon, Share2, HardDrive, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';

interface ResourceFile {
  name: string;
  type: string;
  size: string;
  date: string;
  color: string;
}

const FILES: ResourceFile[] = [
  { name: 'Rapport_jury_2026.pdf', type: 'PDF', size: '2.4 MB', date: '10 Mai 2026', color: 'primary' },
  { name: 'Guide_evaluation.docx', type: 'DOCX', size: '1.1 MB', date: '8 Mai 2026', color: 'primary' },
  { name: 'Donnees_analyse.xlsx', type: 'XLSX', size: '3.8 MB', date: '5 Mai 2026', color: 'primary' },
  { name: 'Presentation_projet.pptx', type: 'PPTX', size: '5.2 MB', date: '1 Mai 2026', color: 'primary' },
];

const ResourceHub: React.FC = () => {
  const { resourceCenter } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResources = resourceCenter.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="resources-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Centre de Ressources</h2>
            <p className="text-muted small mb-0">Gestion centralisée des documents et supports de travail.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Tout Télécharger
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => setShowUploadModal(true)}
            >
              <Plus size={18} /> Téléverser
            </Button>
          </div>
        </div>

        {/* Categories Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Documents PDF" value="18" icon={<FileText />} color="primary" trend="Fichiers" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Espace Utilisé" value="1.2 GB" icon={<HardDrive />} color="info" trend="Sur 10 GB" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Nouveautés" value="4" icon={<Plus />} color="success" trend="Semaine" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Favoris" value="6" icon={<Award />} color="warning" trend="Accès" />
          </Col>
        </Row>

        {/* Repository Table */}
        <div className="glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <h5 className="fw-bold mb-0 text-navy">Fichiers récents</h5>
            <div className="d-flex gap-2">
              <InputGroup className="bg-surface rounded-pill border px-2 overflow-hidden d-none d-md-flex">
                <InputGroup.Text className="bg-transparent border-0"><Search size={16} className="text-muted"/></InputGroup.Text>
                <Form.Control 
                  placeholder="Rechercher..." 
                  className="bg-transparent border-0 shadow-none extra-small text-navy" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Button variant="outline-secondary" size="sm" className="border rounded-pill px-3"><ListIcon size={16} /></Button>
              <Button variant="primary" size="sm" className="btn-premium border-0 rounded-pill px-3"><Grid size={16} /></Button>
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
                {filteredResources.map((file, i) => (
                  <tr key={file.id || i} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="ps-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3">
                          <FileText size={18} />
                        </div>
                        <span className="small fw-bold text-navy">{file.title}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {file.type || 'FILE'}
                      </Badge>
                    </td>
                    <td className="py-3 small text-muted fw-bold">{file.size || '—'}</td>
                    <td className="py-3 small text-muted fw-bold">{file.date}</td>
                    <td className="pe-4 py-3 text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="text-muted p-0 no-caret shadow-none border-0">
                          <MoreHorizontal size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-3 glass-card">
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
    </div>
  );
};

export default ResourceHub;
