import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  Form, Button, Table, InputGroup, Dropdown
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Search, Star, 
  File, Folder, Layers, Book, History, MoreVertical,
  ExternalLink, TrendingUp, Filter, CheckCircle
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import './ResourceHubPage.css';

const STATS = [
  { label: 'Documents PDF', value: '18', icon: <File size={20} className="text-danger" /> },
  { label: 'Espace Utilisé', value: '1.2 GB', icon: <Folder size={20} className="text-warning" /> },
  { label: 'Nouveautés', value: '4', icon: <TrendingUp size={20} className="text-success" /> },
  { label: 'Favoris', value: '6', icon: <Star size={20} className="text-primary" /> }
];

const CATEGORIES = [
  { name: 'Tous les documents', icon: <Layers size={18} className="text-primary" />, count: 12 },
  { name: 'Directives PFE', icon: <Book size={18} className="text-success" />, count: 3 },
  { name: 'Modèles & Templates', icon: <FileText size={18} className="text-info" />, count: 5 },
  { name: 'Archives Sessions', icon: <History size={18} className="text-warning" />, count: 4 },
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
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const handleFavorite = (name) => {
    const isFav = favorites.includes(name);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f !== name));
      setSuccessMsg(`"${name}" retiré de vos favoris.`);
    } else {
      setFavorites(prev => [...prev, name]);
      setSuccessMsg(`"${name}" ajouté à vos favoris.`);
    }
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  const handleMore = (name, action) => {
    setSuccessMsg(`Action "${action}" pour "${name}" bientôt disponible.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 8000);
  };

  return (
    <div className="rh-page-layout">
      <Container fluid className="px-0">
        
        {/* Success Notification Card */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="rh-success-card mb-4 d-flex align-items-center justify-content-between shadow-lg"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="icon-box bg-success p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <CheckCircle size={24} color="#ffffff" />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Succès</h6>
                  <p className="extra-small mb-0 opacity-75">{successMsg}</p>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Dropdown align="end">
                  <Dropdown.Toggle as="button" className="btn btn-link p-0 text-muted shadow-none">
                    <MoreVertical size={16} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow border-0 rounded-3">
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Supprimer</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Archiver</Dropdown.Item>
                    <Dropdown.Item onClick={() => setShowSuccessCard(false)}>Mettre en favori</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button size="sm" variant="link" className="text-muted p-0" onClick={() => setShowSuccessCard(false)}>Fermer</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-1 fw-black" style={{ color: 'var(--jd-text)' }}>Hub de Ressources</h1>
            <p className="fw-medium opacity-75" style={{ color: 'var(--jd-text-muted)' }}>Accédez à tous les documents et ressources d'évaluation officiels</p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {STATS.map((s, i) => (
            <Col key={i} lg={3} md={6}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="rh-stat-card shadow-sm"
              >
                <div className="rh-stat-icon">{s.icon}</div>
                <div>
                  <div className="rh-stat-val" style={{ color: 'var(--jd-text)' }}>{s.value}</div>
                  <div className="rh-stat-label" style={{ color: 'var(--jd-text-muted)' }}>{s.label}</div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          {/* Sidebar */}
          <Col lg={3}>
            <div className="rh-sidebar shadow-sm border-0 mb-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: 'var(--jd-text)' }}>
                <Filter size={18} className="text-primary" /> Catégories
              </h6>
              {CATEGORIES.map((cat, i) => (
                <button 
                  key={i} 
                  className={`rh-cat-btn ${activeCat === cat.label ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat.label)}
                >
                  <div className="d-flex align-items-center gap-2">
                    {cat.icon}
                    <span>{cat.label}</span>
                  </div>
                  <span className="rh-cat-count">{cat.count}</span>
                </button>
              ))}
              
              <hr className="my-4 opacity-5" />
              
              <div className="rh-search-box d-flex align-items-center">
                <Search size={16} className="text-muted me-2" />
                <Form.Control 
                  placeholder="Rechercher..." 
                  className="border-0 bg-transparent shadow-none extra-small fw-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9}>
            <div className="rh-table-card shadow-sm border-0">
              <Table className="rh-table mb-0 align-middle">
                <thead>
                  <tr>
                    <th style={{ width: '50%' }}>Nom du Document</th>
                    <th style={{ width: '25%' }}>Catégorie</th>
                    <th style={{ width: '10%' }}>Taille</th>
                    <th style={{ width: '15%' }} className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DOCUMENTS.map((doc, i) => (
                    <tr key={i}>
                      <td>
                        <div className="d-flex align-items-center gap-3 py-1 overflow-hidden">
                          <div className="p-2 rounded-3 bg-light text-primary flex-shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="overflow-hidden">
                            <div className="rh-doc-name text-truncate">{doc.name}</div>
                            <div className="rh-doc-meta text-truncate">Par {doc.author}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge className="bg-primary bg-opacity-10 text-primary border-0 px-3 py-2 extra-small text-truncate d-inline-block" style={{ maxWidth: '100%' }}>
                          {doc.category}
                        </Badge>
                      </td>
                      <td className="small fw-bold text-muted">{doc.size}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-1 px-2">
                          <button 
                            className="rh-action-btn" 
                            title="Télécharger"
                            onClick={() => handleDownload(doc.name)}
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            className={`rh-action-btn d-none d-md-flex ${favorites.includes(doc.name) ? 'active' : ''}`} 
                            title="Favori"
                            onClick={() => handleFavorite(doc.name)}
                          >
                            <Star size={14} fill={favorites.includes(doc.name) ? '#f59e0b' : 'none'} color={favorites.includes(doc.name) ? '#f59e0b' : 'currentColor'} />
                          </button>
                          <Dropdown align="end">
                            <Dropdown.Toggle as="button" className="rh-action-btn border-0 shadow-none">
                              <MoreVertical size={14} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="shadow-lg border-0 rounded-3">
                              <Dropdown.Item onClick={() => handleMore(doc.name, 'Partager')}>Partager</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleMore(doc.name, 'Renommer')}>Renommer</Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item onClick={() => handleMore(doc.name, 'Archiver')} className="text-danger">Archiver</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default ResourceHubPage;

