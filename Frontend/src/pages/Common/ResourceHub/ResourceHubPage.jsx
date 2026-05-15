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
import { useApp } from '../../../context/AppContext.jsx';

const STATS = [
  { label: 'PDF Documents', value: '18', icon: <File size={20} />, color: 'danger' },
  { label: 'Space Used', value: '1.2 GB', icon: <Folder size={20} />, color: 'warning' },
  { label: 'New Items', value: '4', icon: <TrendingUp size={20} />, color: 'success' },
  { label: 'Favorites', value: '6', icon: <Star size={20} />, color: 'primary' }
];

const CATEGORIES = [
  { label: 'All Documents', icon: <Layers size={18} />, count: 12 },
  { label: 'PFE Guidelines', icon: <Book size={18} />, count: 3 },
  { label: 'Models & Templates', icon: <FileText size={18} />, count: 5 },
  { label: 'Session Archives', icon: <History size={18} />, count: 4 },
];

const DOCUMENTS = [
  { name: "PFE Evaluation Guide 2026.pdf", author: "Admin", category: "Guidelines", size: "2.4 MB", dls: 245, date: "2026-01-15" },
  { name: "Official Grading Grid.xlsx", author: "Admin", category: "Templates", size: "156 KB", dls: 198, date: "2026-01-20" },
  { name: "Academic Excellence Criteria.pdf", author: "Prof. Martin", category: "Guidelines", size: "1.8 MB", dls: 167, date: "2026-02-10" },
  { name: "Defense Report Template.docx", author: "Admin", category: "Templates", size: "89 KB", dls: 234, date: "2026-02-15" },
  { name: "Defense Procedures.pdf", author: "Dr. Chen", category: "Procedures", size: "3.2 MB", dls: 156, date: "2026-03-01" },
  { name: "Jury FAQ - Frequently Asked Questions.pdf", author: "Admin", category: "Help", size: "1.1 MB", dls: 189, date: "2026-03-10" }
];

const ResourceHubPage = () => {
  const [activeCat, setActiveCat] = useState('All Documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [favorites, setFavorites] = useState([]);

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
          {STATS.map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
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
                {CATEGORIES.map((cat, i) => (
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
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Category</th>
                      <th className="py-3 extra-small fw-bold text-muted text-uppercase">Size</th>
                      <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOCUMENTS.map((doc, i) => (
                      <tr key={i} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                        <td className="px-4 py-4">
                          <div className="d-flex align-items-center gap-3">
                            <div className="p-3 rounded-4 bg-primary-soft text-primary"><FileText size={20} /></div>
                            <div>
                              <div className="small fw-bold text-navy mb-1">{doc.name}</div>
                              <div className="extra-small text-muted fw-bold opacity-50">By {doc.author}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 extra-small fw-bold">
                            {doc.category}
                          </Badge>
                        </td>
                        <td className="py-4 small text-navy fw-bold opacity-75">{doc.size}</td>
                        <td className="px-4 py-4 text-end">
                          <div className="d-flex justify-content-end gap-1">
                            <Button variant="link" className="p-2 text-muted hover-bg-primary-soft rounded-circle transition-all border-0 shadow-none" onClick={() => handleDownload(doc.name)}><Download size={18}/></Button>
                            <Button 
                              variant="link" 
                              className={`p-2 rounded-circle transition-all border-0 shadow-none hover-bg-primary-soft ${favorites.includes(doc.name) ? 'text-warning' : 'text-muted'}`}
                              onClick={() => handleFavorite(doc.name)}
                            >
                              <Star size={18} fill={favorites.includes(doc.name) ? 'currentColor' : 'none'} />
                            </Button>
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-primary-soft rounded-circle transition-all"><MoreVertical size={18}/></Dropdown.Toggle>
                              <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small p-2">
                                <Dropdown.Item className="py-2 fw-bold text-navy">Share</Dropdown.Item>
                                <Dropdown.Item className="py-2 fw-bold text-navy">Rename</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item className="py-2 fw-bold text-danger">Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))}
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
