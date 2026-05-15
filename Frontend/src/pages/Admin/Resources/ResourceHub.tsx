import React, { useState } from 'react';
import { 
  Plus, Search, Download, MoreHorizontal, 
  FileText, 
  Grid, List as ListIcon, Share2, HardDrive, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Table, Button, InputGroup, Form, Badge, Dropdown, Modal } from 'react-bootstrap';
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
  const { resourceCenter, addToResources, removeFromResources } = useApp();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [pendingFile, setPendingFile] = useState<any>(null);

  const filteredResources = resourceCenter.filter(res => 
    res.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const handleAction = async (action: string, file: any) => {
    if (action === 'Suppression') {
      removeFromResources(file.id);
      setSuccessMsg(`Fichier "${file.title}" supprimé avec succès.`);
    } else if (action === 'Téléchargement') {
      // Simulate real download
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', file.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSuccessMsg(`Préparation du téléchargement pour "${file.title}"...`);
    } else if (action === 'Partage') {
      if (navigator.share) {
        try {
          await navigator.share({
            title: file.title,
            text: `Consultez ce document : ${file.title}`,
            url: window.location.href
          });
        } catch (err) {
          setSuccessMsg(`Option de partage activée pour "${file.title}".`);
        }
      } else {
        setSuccessMsg(`Lien de partage copié pour "${file.title}".`);
      }
    }
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const confirmUpload = () => {
    addToResources(pendingFile);
    setShowUploadModal(false);
    setSuccessMsg(`Fichier "${pendingFile.title}" téléversé avec succès !`);
    setPendingFile(null);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleFileProcess = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const fileData = {
      id: `RES-${Date.now()}`,
      title: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      category: 'Supports',
      downloadUrl: '#'
    };
    setPendingFile(fileData);
  };

  const handleDownloadAll = () => {
    setSuccessMsg("Préparation de l'archive ZIP contenant tous les documents...");
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

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
            <Button 
              variant="outline-primary" 
              className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 shadow-none"
              onClick={handleDownloadAll}
            >
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

        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-success text-white rounded-4 mb-4 text-center extra-small fw-bold shadow-sm"
          >
            {successMsg}
          </motion.div>
        )}

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
              <Button 
                variant={viewMode === 'list' ? 'primary' : 'outline-secondary'} 
                size="sm" 
                className={`border rounded-pill px-3 shadow-none ${viewMode === 'list' ? 'btn-premium border-0' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon size={16} />
              </Button>
              <Button 
                variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'} 
                size="sm" 
                className={`border rounded-pill px-3 shadow-none ${viewMode === 'grid' ? 'btn-premium border-0' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
            </div>
          </div>
          
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 resources-table">
              <thead>
                <tr className="border-bottom opacity-50">
                  <th className="ps-4 py-3" style={{ width: '40px' }}>
                    <Form.Check 
                      type="checkbox"
                      checked={selectedFiles.length === filteredResources.length && filteredResources.length > 0}
                      onChange={() => {
                        if (selectedFiles.length === filteredResources.length) setSelectedFiles([]);
                        else setSelectedFiles(filteredResources.map(f => f.id));
                      }}
                    />
                  </th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Nom du fichier</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Type</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Taille</th>
                  <th className="py-3 extra-small text-muted text-uppercase fw-bold">Modifié le</th>
                  <th className="py-3 text-end pe-4 extra-small text-muted text-uppercase fw-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.map((file, i) => (
                  <tr key={file.id || i} className={`border-bottom border-light border-opacity-10 transition-all ${selectedFiles.includes(file.id) ? 'bg-primary-soft' : ''}`}>
                    <td className="ps-4 py-3">
                      <Form.Check 
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleSelect(file.id)}
                      />
                    </td>
                    <td className="py-3">
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
                          <Dropdown.Item className="extra-small fw-bold" onClick={() => handleAction('Téléchargement', file)}><Download size={14} className="me-2" /> Télécharger</Dropdown.Item>
                          <Dropdown.Item className="extra-small fw-bold" onClick={() => handleAction('Partage', file)}><Share2 size={14} className="me-2" /> Partager</Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="extra-small fw-bold text-danger" onClick={() => handleAction('Suppression', file)}>Supprimer</Dropdown.Item>
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

      {/* Floating Export Bar */}
      {selectedFiles.length > 0 && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="position-fixed bottom-0 start-50 translate-middle-x mb-4 z-index-1000"
        >
          <div className="glass-card p-3 rounded-pill shadow-lg border border-primary border-opacity-25 bg-white d-flex align-items-center gap-3">
            <Badge bg="primary" className="rounded-pill px-3 py-2">{selectedFiles.length} sélectionnés</Badge>
            <div className="vr opacity-10" />
            <Button variant="link" className="extra-small fw-bold text-navy text-decoration-none shadow-none p-0" onClick={() => handleExportSelected('pdf')}>PDF</Button>
            <Button variant="link" className="extra-small fw-bold text-navy text-decoration-none shadow-none p-0" onClick={() => handleExportSelected('csv')}>CSV</Button>
            <Button variant="link" className="extra-small fw-bold text-navy text-decoration-none shadow-none p-0" onClick={() => handleExportSelected('word')}>Word</Button>
            <div className="vr opacity-10" />
            <Button variant="link" className="extra-small fw-bold text-danger text-decoration-none shadow-none p-0" onClick={() => setSelectedFiles([])}>Annuler</Button>
          </div>
        </motion.div>
      )}

      {/* Upload Modal (Basic) */}
      <Modal 
        show={showUploadModal} 
        onHide={() => {
          setShowUploadModal(false);
          setPendingFile(null);
        }} 
        centered 
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4">
          <Modal.Title className="fw-bold text-navy h5">Téléverser des Documents</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 text-center">
          {!pendingFile ? (
            <div 
              className="p-5 border-2 border-dashed rounded-4 bg-surface-alt mb-4 d-flex flex-column align-items-center gap-3 transition-all"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-primary', 'bg-primary-soft');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-primary', 'bg-primary-soft');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-primary', 'bg-primary-soft');
                handleFileProcess(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={(e) => handleFileProcess(e.target.files)}
              />
              <HardDrive size={48} className="text-primary opacity-25" />
              <div>
                <div className="fw-bold text-navy">Glissez vos fichiers ici</div>
                <div className="extra-small text-muted fw-bold">ou cliquez pour parcourir vos dossiers</div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-4 border border-primary border-opacity-10 bg-primary-soft mb-4 text-start"
            >
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-3 bg-white rounded-3 shadow-sm text-primary">
                  <FileText size={32} />
                </div>
                <div>
                  <div className="fw-bold text-navy text-truncate" style={{ maxWidth: '250px' }}>{pendingFile.title}</div>
                  <div className="extra-small text-muted fw-bold">{pendingFile.size} • {pendingFile.type}</div>
                </div>
              </div>
              <div className="extra-small text-primary fw-bold opacity-75">Voulez-vous confirmer le téléversement de ce fichier ?</div>
            </motion.div>
          )}

          <div className="d-flex gap-2">
            {pendingFile && (
              <Button variant="outline-secondary" className="flex-fill py-3 rounded-pill fw-bold border-2" onClick={() => setPendingFile(null)}>
                Annuler
              </Button>
            )}
            <Button 
              className="btn-premium flex-fill py-3 rounded-pill fw-bold border-0 shadow-sm" 
              onClick={pendingFile ? confirmUpload : () => fileInputRef.current?.click()}
            >
              {pendingFile ? 'Confirmer le téléversement' : 'Sélectionner un fichier'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ResourceHub;
