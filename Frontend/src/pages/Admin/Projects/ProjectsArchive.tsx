import React, { useState } from 'react';
import { 
  Search, Filter, Download, 
  FileText, Calendar, 
  ChevronRight, Briefcase, 
  CheckCircle, XCircle, MoreVertical, Share2, Edit2, Trash2, X
} from 'lucide-react';
import { Container, Row, Col, Button, Badge, Form, InputGroup, Dropdown, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

interface ArchiveItem {
  id: string;
  name: string;
  desc: string;
  date: string;
  files: number;
  status: 'Completed' | 'Cancelled';
  type: string;
  supervisor: string;
}

const ProjectsArchive: React.FC = () => {
  const { archives, deleteArchiveProject, updateArchiveProject, shareToResources } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const toggleSelect = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleShare = (id: string) => {
    shareToResources(id);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleViewDetails = (project: any) => {
    setViewingProject(project);
    setShowDetailsModal(true);
  };

  const handleExport = (format: string) => {
    alert(`Exporting ${selectedProjects.length} projects in ${format} format...`);
    setSelectedProjects([]);
  };

  const filteredProjects = (archives || []).filter(p =>
    (p?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p?.desc || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (project: any) => {
    setEditingProject({ ...project });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    if (editingProject) {
      updateArchiveProject(editingProject.id, editingProject);
      setShowEditModal(false);
    }
  };

  const handleCancel = (id: string) => {
    updateArchiveProject(id, { status: 'Cancelled' });
  };

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Project Archives</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">View and manage the history of all past projects.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2">
              <Download size={18} /> Export
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="glass-card p-4 rounded-4 mb-5 shadow-sm">
          <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
            <InputGroup.Text className="bg-transparent border-0 text-muted">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Search for a project, report, or theme..."
              className="bg-transparent border-0 py-2 text-navy fw-bold small shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </div>

        {/* Projects Grid */}
        <Row className="g-4">
          {filteredProjects.map((project, i) => (
            <Col key={project.id} lg={4} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="h-100"
              >
                <div className={`glass-card rounded-4 overflow-hidden h-100 shadow-sm d-flex flex-column transition-all border ${selectedProjects.includes(project.id) ? 'border-primary border-2 ring-2 ring-primary ring-opacity-10' : ''}`}>
                  <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 10 }}>
                    <Form.Check 
                      type="checkbox"
                      className="custom-checkbox-premium"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleSelect(project.id)}
                    />
                  </div>
                  <div className="p-4 flex-grow-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="p-2 bg-primary-soft text-primary rounded-3">
                          <Briefcase size={20} />
                        </div>
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none hover-bg-surface rounded-circle">
                            <MoreVertical size={18} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small">
                            <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2" onClick={() => handleShare(project.id)}>
                              <Share2 size={14} className="text-primary" /> Share to Resources
                            </Dropdown.Item>
                            <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2" onClick={() => handleEdit(project)}>
                              <Edit2 size={14} className="text-info" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-warning" onClick={() => handleCancel(project.id)}>
                              <XCircle size={14} /> Cancel / Hide
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-danger" onClick={() => deleteArchiveProject(project.id)}>
                              <Trash2 size={14} /> Permanently delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    <Badge className={`bg-${project.status === 'Completed' ? 'success' : 'danger'}-soft text-${project.status === 'Completed' ? 'success' : 'danger'} border border-${project.status === 'Completed' ? 'success' : 'danger'} border-opacity-10 extra-small px-2`}>
                        {project.status === 'Completed' ? <CheckCircle size={12} className="me-1" /> : <XCircle size={12} className="me-1" />}
                        {project.status === 'Completed' ? 'Completed' : 'Cancelled'}
                      </Badge>
                    
                    <h5 className="fw-bold mb-2 text-navy">{project.name}</h5>
                    <p className="text-muted extra-small mb-4 fw-bold opacity-75 line-clamp-2" style={{ minHeight: '40px' }}>
                      {project.desc}
                    </p>
                    
                    <div className="d-flex flex-column gap-2">
                      <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                        <Calendar size={14} className="text-primary" /> {project.date}
                      </div>
                      <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                        <FileText size={14} className="text-primary" /> {project.files} archived documents
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border-top bg-surface-alt d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}>
                        {project.supervisor.split('. ')[1]?.charAt(0) || project.supervisor.charAt(0)}
                      </div>
                      <span className="extra-small fw-bold text-navy opacity-75">{project.supervisor}</span>
                    </div>
                    <Button 
                      variant="link" 
                      className="p-0 text-primary extra-small fw-bold text-decoration-none border-0 shadow-none"
                      onClick={() => handleViewDetails(project)}
                    >
                      Details <ChevronRight size={14}/>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Floating Export Bar */}
        <AnimatePresence>
          {selectedProjects.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed-bottom d-flex justify-content-center pb-4"
              style={{ zIndex: 1050 }}
            >
              <div className="glass-card bg-navy text-white px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-4 border-0">
                <div className="d-flex align-items-center gap-2 border-end pe-4 border-white border-opacity-10">
                  <div className="p-2 bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                    <span className="fw-bold small">{selectedProjects.length}</span>
                  </div>
                  <span className="extra-small fw-bold text-uppercase tracking-wider">Selected Projects</span>
                </div>

                <div className="d-flex gap-3">
                  <Button 
                    variant="link" 
                    className="text-white p-0 d-flex align-items-center gap-2 extra-small fw-bold text-decoration-none hover-opacity-75"
                    onClick={() => handleExport('PDF')}
                  >
                    <FileText size={16} className="text-danger" /> PDF
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-white p-0 d-flex align-items-center gap-2 extra-small fw-bold text-decoration-none hover-opacity-75"
                    onClick={() => handleExport('Word')}
                  >
                    <Briefcase size={16} className="text-info" /> Word
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-white p-0 d-flex align-items-center gap-2 extra-small fw-bold text-decoration-none hover-opacity-75"
                    onClick={() => handleExport('CSV')}
                  >
                    <Download size={16} className="text-success" /> CSV
                  </Button>
                </div>

                <Button 
                  variant="link" 
                  className="text-white p-1 border-0 shadow-none ms-2"
                  onClick={() => setSelectedProjects([])}
                >
                  <X size={18} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* Modal Modification Projet */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Edit Archived Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {editingProject && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Project Title</Form.Label>
                <Form.Control 
                  className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Description</Form.Label>
                <Form.Control 
                  as="textarea" rows={3}
                  className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                  value={editingProject.desc}
                  onChange={(e) => setEditingProject({...editingProject, desc: e.target.value})}
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Type</Form.Label>
                    <Form.Control 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                      value={editingProject.type}
                      onChange={(e) => setEditingProject({...editingProject, type: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Supervisor</Form.Label>
                    <Form.Control 
                      className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none"
                      value={editingProject.supervisor}
                      onChange={(e) => setEditingProject({...editingProject, supervisor: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button className="btn-premium px-4 py-2" onClick={saveEdit}>Save changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Détails Projet */}
      <Modal 
        show={showDetailsModal} 
        onHide={() => setShowDetailsModal(false)} 
        centered 
        size="lg" 
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-primary-soft text-primary rounded-4">
              <Briefcase size={24} />
            </div>
            <div>
              <Modal.Title className="fw-bold text-navy h5 mb-0">{viewingProject?.name}</Modal.Title>
              <div className="extra-small text-muted fw-bold mt-1 opacity-75">ID: {viewingProject?.id}</div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-4">
          {viewingProject && (
            <Row className="g-4">
              <Col lg={7}>
                <div className="mb-4">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3 tracking-wider">Project Description</h6>
                  <p className="small text-navy lh-base opacity-75 fw-medium bg-surface-alt p-3 rounded-4 border">
                    {viewingProject.desc}
                  </p>
                </div>

                <div className="mb-4">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3 tracking-wider">Archived Documents</h6>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { name: 'Final_Report.pdf', size: '2.4 MB' },
                      { name: 'Presentation.pptx', size: '5.1 MB' },
                      { name: 'Specifications.pdf', size: '1.2 MB' }
                    ].map((doc, idx) => (
                      <div key={idx} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-white border border-light-soft hover-bg-surface-alt transition-all">
                        <div className="d-flex align-items-center gap-3">
                          <FileText size={18} className="text-primary" />
                          <span className="small fw-bold text-navy">{doc.name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="extra-small text-muted fw-bold">{doc.size}</span>
                          <Button variant="link" className="p-0 text-primary border-0 shadow-none"><Download size={16} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              
              <Col lg={5}>
                <div className="p-4 rounded-4 bg-surface-alt border h-100">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-4 tracking-wider">Academic Metadata</h6>
                  
                  <div className="d-flex flex-column gap-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-white rounded-3 shadow-sm text-primary">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="extra-small text-muted fw-bold opacity-50">ARCHIVE DATE</div>
                        <div className="small fw-bold text-navy">{viewingProject.date}</div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-white rounded-3 shadow-sm text-info">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="extra-small text-muted fw-bold opacity-50">PROJECT TYPE</div>
                        <Badge className="bg-info-soft text-info border-0 extra-small px-2 py-1 mt-1">{viewingProject.type}</Badge>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2 bg-white rounded-3 shadow-sm text-success">
                        <CheckCircle size={18} />
                      </div>
                      <div>
                        <div className="extra-small text-muted fw-bold opacity-50">FINAL STATUS</div>
                        <Badge className="bg-success-soft text-success border-0 extra-small px-2 py-1 mt-1">Validated / Completed</Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-top">
                      <div className="extra-small text-muted fw-bold opacity-50 mb-3">RESPONSIBLE SUPERVISOR</div>
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
                          {viewingProject.supervisor.split('. ')[1]?.charAt(0) || viewingProject.supervisor.charAt(0)}
                        </div>
                        <div className="fw-bold text-navy small">{viewingProject.supervisor}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button 
            className="btn-premium w-100 py-3 rounded-4 shadow-sm border-0" 
            onClick={() => setShowDetailsModal(false)}
          >
            Close preview
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast de Succès Partage */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="position-fixed bottom-0 start-50 mb-5 pb-5"
            style={{ zIndex: 9999 }}
          >
            <div className="glass-card bg-success text-white px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-3 border-0">
              <div className="bg-white text-success rounded-circle p-1">
                <CheckCircle size={20} />
              </div>
              <span className="fw-bold extra-small">The folder has been successfully shared in the Resource Center!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsArchive;
