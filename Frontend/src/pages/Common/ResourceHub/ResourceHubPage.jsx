import React, { useState } from 'react';
import { 
  Container, Row, Col, Badge, 
  Form, Button, Table, InputGroup, Dropdown, Card
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Search, Star, 
  File, Folder, Layers, Book, History, MoreVertical,
  ExternalLink, TrendingUp, Filter, CheckCircle, X
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';


const ResourceHubPage = () => {
  const { resourceCenter: documents = [] } = useApp();
  const [activeCat, setActiveCat] = useState('All Documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [favorites, setFavorites] = useState([]);

  const stats = [
    { label: 'Total Documents', value: documents.length.toString(), icon: <File size={20} />, color: 'primary' },
    { label: 'New Items', value: '0', icon: <TrendingUp size={20} />, color: 'success' },
    { label: 'Favorites', value: favorites.length.toString(), icon: <Star size={20} />, color: 'warning' }
  ];

  const categories = [
    { label: 'All Documents', icon: <Layers size={18} />,  count: documents.length,                                                   type: null },
    { label: 'Reports',       icon: <History size={18} />, count: documents.filter((d) => d.type === 'report').length,                 type: 'report' },
    { label: 'Templates',     icon: <FileText size={18} />, count: documents.filter((d) => d.type === 'template').length,              type: 'template' },
    { label: 'Guides',        icon: <Book size={18} />,    count: documents.filter((d) => d.type === 'guide').length,                  type: 'guide' },
    { label: 'Projects',      icon: <Folder size={18} />,  count: documents.filter((d) => d.type === 'project').length,               type: 'project' },
  ];

  const handleDownload = (name) => {
    setSuccessMsg(`Download of "${name}" started...`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleFavorite = (name) => {
    const isFav = favorites.includes(name);
    setFavorites(prev => isFav ? prev.filter(f => f !== name) : [...prev, name]);
    setSuccessMsg(isFav ? `"${name}" removed from favorites.` : `"${name}" added to favorites.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  return (
    <div className="resource-hub-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessCard && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card mb-4 p-4 rounded-4 shadow-sm border-start-4 border-success d-flex justify-content-between align-items-center"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-circle bg-success-soft text-success">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-navy">Operation Successful</h6>
                  <p className="extra-small text-muted mb-0 fw-bold opacity-75">{successMsg}</p>
                </div>
              </div>
              <Button variant="link" className="p-0 text-muted shadow-none border-0 hover-bg-surface-alt rounded-circle" onClick={() => setShowSuccessCard(false)}><X size={20}/></Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Resource Hub</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Access official PFE documents and assessment resources.</p>
          </motion.div>
          <div className="d-flex gap-2">
            <InputGroup className="bg-surface-alt rounded-pill border px-3" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0 pe-1"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Search resources..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-navy"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {stats.map((stat, i) => (
            <Col key={i} sm={6} lg={4}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border border-light border-opacity-10 border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-4 bg-${stat.color}-soft text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0 text-navy">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase opacity-50">{stat.label}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4 mb-5">
          {/* Categories Sidebar */}
          <Col lg={3}>
            <Card className="glass-card rounded-4 overflow-hidden mb-4 border-light border-opacity-10">
              <Card.Header className="p-4 border-bottom bg-white d-flex align-items-center border-0">
                <h6 className="fw-bold mb-0 text-navy d-flex align-items-center gap-2">
                  <Filter size={18} className="text-primary" /> Categories
                </h6>
              </Card.Header>
              <div className="d-flex flex-column">
                {categories.map((cat, i) => (
                  <button 
                    key={i} 
                    className={`p-3 d-flex align-items-center justify-content-between border-0 transition-all text-start bg-transparent ${activeCat === cat.label ? 'bg-primary-soft text-primary' : 'hover-bg-surface-alt text-muted fw-bold opacity-75'}`}
                    onClick={() => setActiveCat(cat.label)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div>{cat.icon}</div>
                      <span className="small fw-bold">{cat.label}</span>
                    </div>
                    <Badge className="bg-primary-soft text-primary border-0 extra-small fw-bold px-2 py-1 rounded-pill">{cat.count}</Badge>
                  </button>
                ))}
              </div>
            </Card>
          </Col>

          {/* Documents Table */}
          <Col lg={9}>
            <Card className="glass-card rounded-4 overflow-hidden shadow-sm border-light border-opacity-10">
              <div className="table-responsive">
                <Table borderless hover className="align-middle mb-0">
                  <thead className="bg-surface-alt">
                    <tr className="border-bottom opacity-50">
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Document Name</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Type</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Date</th>
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const activeCatObj = categories.find(c => c.label === activeCat);
                      const visible = documents.filter(doc => {
                        const matchCat = !activeCatObj?.type || doc.type === activeCatObj.type;
                        const matchSearch = !searchTerm || doc.title?.toLowerCase().includes(searchTerm.toLowerCase());
                        return matchCat && matchSearch;
                      });
                      if (visible.length === 0) {
                        return <tr><td colSpan="4" className="text-center py-5 opacity-50 fw-bold small">No documents available in the hub</td></tr>;
                      }
                      return visible.map(doc => (
                        <tr key={doc.id} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                          <td className="px-4 py-4">
                            <div className="d-flex align-items-center gap-3">
                              <div className="p-3 rounded-4 bg-primary-soft text-primary"><FileText size={20} /></div>
                              <div>
                                <div className="small fw-bold text-navy mb-1">{doc.title}</div>
                                <div className="extra-small text-muted fw-bold opacity-50">
                                  By {doc.uploaded_by_name || 'Admin'} {doc.year ? `• ${doc.year}` : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 extra-small fw-bold text-capitalize">
                              {doc.type || 'file'}
                            </Badge>
                          </td>
                          <td className="py-4 small text-navy fw-bold opacity-75">
                            {doc.created_at ? new Date(doc.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td className="px-4 py-4 text-end">
                            <div className="d-flex justify-content-end gap-1">
                              {doc.file_url && (
                                <a href={doc.file_url} target="_blank" rel="noreferrer"
                                  className="btn btn-link p-2 text-muted hover-bg-primary-soft rounded-circle transition-all border-0 shadow-none"
                                  onClick={() => handleDownload(doc.title)}>
                                  <Download size={18} />
                                </a>
                              )}
                              <Button
                                variant="link"
                                className={`p-2 rounded-circle transition-all border-0 shadow-none hover-bg-primary-soft ${favorites.includes(doc.title) ? 'text-warning' : 'text-muted'}`}
                                onClick={() => handleFavorite(doc.title)}
                              >
                                <Star size={18} fill={favorites.includes(doc.title) ? 'currentColor' : 'none'} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResourceHubPage;
