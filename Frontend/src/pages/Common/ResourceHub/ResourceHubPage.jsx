import React, { useState } from 'react';
import { 
  Container, Row, Col, Badge, 
  Form, Button, Table, InputGroup, Dropdown
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Search, Star, 
  File, Folder, Layers, Book, History, MoreVertical,
  ExternalLink, TrendingUp, Filter, CheckCircle, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext.jsx';

const STATS = [
  { label: 'Documents PDF', value: '18', icon: <File size={20} />, color: 'danger' },
  { label: 'Espace Utilisé', value: '1.2 GB', icon: <Folder size={20} />, color: 'warning' },
  { label: 'Nouveautés', value: '4', icon: <TrendingUp size={20} />, color: 'success' },
  { label: 'Favoris', value: '6', icon: <Star size={20} />, color: 'primary' }
];

const CATEGORIES = [
  { label: 'Tous les documents', icon: <Layers size={18} />, count: 12 },
  { label: 'Directives PFE', icon: <Book size={18} />, count: 3 },
  { label: 'Modèles & Templates', icon: <FileText size={18} />, count: 5 },
  { label: 'Archives Sessions', icon: <History size={18} />, count: 4 },
];

const DOCUMENTS = [
  { name: "Guide d'Évaluation PFE 2026.pdf", author: "Admin", category: "Guidelines", size: "2.4 MB", dls: 245, date: "2026-01-15" },
  { name: "Grille de Notation Officielle.xlsx", author: "Admin", category: "Templates", size: "156 KB", dls: 198, date: "2026-01-20" },
  { name: "Critères d'Excellence Académique.pdf", author: "Prof. Martin", category: "Guidelines", size: "1.8 MB", dls: 167, date: "2026-02-10" },
  { name: "Modèle Rapport de Soutenance.docx", author: "Admin", category: "Templates", size: "89 KB", dls: 234, date: "2026-02-15" },
  { name: "Procédures de Défense.pdf", author: "Dr. Chen", category: "Procedures", size: "3.2 MB", dls: 156, date: "2026-03-01" },
  { name: "FAQ Jury - Questions Fréquentes.pdf", author: "Admin", category: "Help", size: "1.1 MB", dls: 189, date: "2026-03-10" }
];

const ResourceHubPage = () => {
  const [activeCat, setActiveCat] = useState('Tous les documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [favorites, setFavorites] = useState([]);

  const handleDownload = (name) => {
    setSuccessMsg(`Téléchargement de "${name}" commencé...`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleFavorite = (name) => {
    const isFav = favorites.includes(name);
    setFavorites(prev => isFav ? prev.filter(f => f !== name) : [...prev, name]);
    setSuccessMsg(isFav ? `"${name}" retiré des favoris.` : `"${name}" ajouté aux favoris.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  return (
    <div className="resource-hub-modern py-4">
      <Container fluid className="px-4">
        
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rh-alert-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success bg-opacity-10 text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0">Opération Réussie</h6>
                  <p className="extra-small text-muted mb-0">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none" onClick={() => setShowSuccessCard(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Hub de Ressources</h2>
            <p className="text-muted small mb-0">Accédez à tous les documents et ressources d'évaluation officiels.</p>
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
          {STATS.map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <div className={`rh-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{stat.label}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mb-5">
          {/* Categories Sidebar */}
          <Col lg={3}>
            <div className="rh-glass-card rounded-4 overflow-hidden mb-4">
              <div className="p-4 border-bottom bg-surface-alt">
                <h6 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Filter size={18} className="text-primary" /> Catégories
                </h6>
              </div>
              <div className="d-flex flex-column">
                {CATEGORIES.map((cat, i) => (
                  <button 
                    key={i} 
                    className={`rh-cat-btn p-3 d-flex align-items-center justify-content-between border-0 transition-all text-start ${activeCat === cat.label ? 'active-cat' : 'hover-bg-surface'}`}
                    onClick={() => setActiveCat(cat.label)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className={`${activeCat === cat.label ? 'text-primary' : 'text-muted'}`}>{cat.icon}</div>
                      <span className={`small fw-bold ${activeCat === cat.label ? 'text-primary' : 'text-muted'}`}>{cat.label}</span>
                    </div>
                    <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">{cat.count}</Badge>
                  </button>
                ))}
              </div>
            </div>
          </Col>

          {/* Documents Table */}
          <Col lg={9}>
            <div className="rh-glass-card rounded-4 overflow-hidden shadow-sm">
              <div className="table-responsive">
                <Table borderless hover className="align-middle mb-0 rh-table">
                  <thead>
                    <tr className="border-bottom opacity-50 bg-surface-alt">
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Nom du Document</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Catégorie</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Taille</th>
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map((doc, i) => (
                      <tr key={i} className="border-bottom border-light border-opacity-10">
                        <td className="px-4 py-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary"><FileText size={20} /></div>
                            <div>
                              <div className="small fw-bold">{doc.name}</div>
                              <div className="extra-small text-muted fw-bold opacity-75">Par {doc.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                            {doc.category}
                          </Badge>
                        </td>
                        <td className="py-4 small text-muted fw-bold">{doc.size}</td>
                        <td className="px-4 py-4 text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3" onClick={() => handleDownload(doc.name)}><Download size={18}/></Button>
                            <Button 
                              variant="link" 
                              className={`p-2 rounded-3 hover-bg-surface ${favorites.includes(doc.name) ? 'text-warning' : 'text-muted'}`}
                              onClick={() => handleFavorite(doc.name)}
                            >
                              <Star size={18} fill={favorites.includes(doc.name) ? 'currentColor' : 'none'} />
                            </Button>
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                              <Dropdown.Menu className="border-0 shadow-lg rounded-3 extra-small bg-surface">
                                <Dropdown.Item className="fw-bold">Partager</Dropdown.Item>
                                <Dropdown.Item className="fw-bold">Renommer</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="fw-bold text-danger">Supprimer</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .resource-hub-modern {
          color: var(--text-primary);
        }
        .rh-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .rh-cat-btn {
          background: transparent;
          width: 100%;
        }
        .active-cat {
          background-color: rgba(var(--primary-rgb), 0.1) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .rh-table tbody tr:hover {
          background-color: rgba(var(--primary-rgb), 0.03) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        
        h2, h4, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
        .border-bottom {
          border-color: var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default ResourceHubPage;
