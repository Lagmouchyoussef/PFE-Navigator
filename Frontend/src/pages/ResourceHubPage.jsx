import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge, ListGroup } from 'react-bootstrap';
import { 
  FileText, Download, Search, ExternalLink, Filter, Star, Info
} from 'lucide-react';

const RESOURCES = [
  {
    id: 1,
    title: 'Final Report Template (LaTeX)',
    type: 'Template',
    format: 'ZIP',
    size: '1.2 MB',
    category: 'Scientific Writing',
    description: 'Official university LaTeX template for PFE reports with pre-configured style and bibliography.',
    featured: true
  },
  {
    id: 2,
    title: 'Presentation Slide Deck v2',
    type: 'Guide',
    format: 'PPTX',
    size: '4.5 MB',
    category: 'Soft Skills',
    description: 'A curated deck for oral defenses, including tips on structure and visualization.',
    featured: true
  },
  {
    id: 3,
    title: 'Academic Integrity Policy',
    type: 'Official',
    format: 'PDF',
    size: '800 KB',
    category: 'Regulations',
    description: 'Guidelines on citation, plagiarism detection thresholds, and ethical research.',
    featured: false
  },
  {
    id: 4,
    title: 'GitHub Best Practices for PFE',
    type: 'Tutorial',
    format: 'URL',
    size: '—',
    category: 'Development',
    description: 'Learn how to structure your code repository and manage branches for your project.',
    featured: false
  }
];

const ResourceHubPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredResources = RESOURCES.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || res.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Knowledge Hub</h3>
            <p className="text-muted small mb-0">Official templates, guides, and research resources.</p>
          </div>
          <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill small fw-bold">
            Updated May 2026
          </Badge>
        </div>

        <Row className="g-4">
          {/* Sidebar */}
          <Col lg={3}>
            <Card className="border-0 shadow-sm p-4 bg-white rounded-3">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Filter size={18} className="text-primary" /> Categories
              </h6>
              <div className="d-flex flex-column gap-1">
                {['All', 'Scientific Writing', 'Soft Skills', 'Regulations', 'Development'].map(cat => (
                  <button 
                    key={cat}
                    className={`text-start px-3 py-2 rounded-3 border-0 small fw-semibold transition-all ${filter === cat ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-muted hover-bg-light'}`}
                    onClick={() => setFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <hr className="my-4 opacity-5" />
              <div className="p-3 rounded-3 bg-light border border-info border-opacity-10">
                <div className="d-flex align-items-center gap-2 mb-1 text-info">
                  <Info size={16} />
                  <span className="extra-small fw-bold">Help Desk</span>
                </div>
                <p className="extra-small text-muted mb-0">Contact the library for specialized research papers.</p>
              </div>
            </Card>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            <div className="mb-4">
              <Card className="border-0 shadow-sm p-2 bg-white rounded-3 d-flex flex-row align-items-center">
                <Search size={20} className="text-muted mx-3" />
                <Form.Control
                  type="text"
                  placeholder="Search assets..."
                  className="border-0 shadow-none bg-transparent py-2 small fw-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Card>
            </div>

            <Row className="g-4">
              {filteredResources.map(res => (
                <Col md={6} key={res.id}>
                  <Card className="border-0 shadow-sm rounded-3 h-100 p-4 bg-white hover-translate-y transition-all">
                    <div className="d-flex justify-content-between align-items-start mb-4">
                      <div className={`p-3 rounded-3 bg-${res.type === 'Template' ? 'primary' : 'success'} bg-opacity-10 text-${res.type === 'Template' ? 'primary' : 'success'}`}>
                        {res.format === 'URL' ? <ExternalLink size={24} /> : <FileText size={24} />}
                      </div>
                      {res.featured && (
                        <Badge bg="warning" text="dark" className="rounded-pill px-2 py-1 small fw-bold shadow-sm">
                          <Star size={12} className="me-1" /> Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h6 className="fw-bold text-dark mb-2">{res.title}</h6>
                    <p className="extra-small text-muted mb-4 flex-grow-1" style={{ lineHeight: '1.6' }}>{res.description}</p>
                    
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                      <div className="d-flex flex-column">
                        <span className="extra-small fw-bold text-muted uppercase">Format: {res.format}</span>
                        <span className="extra-small text-muted">{res.size}</span>
                      </div>
                      <Button variant="outline-primary" size="sm" className="rounded-pill px-3 fw-bold small border-1 d-flex align-items-center gap-2">
                        {res.format === 'URL' ? 'Open' : 'Download'} <Download size={14} />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ResourceHubPage;
