import React, { useState, useMemo, useCallback } from 'react';
import {
  Search, Filter, Download,
  FileText, ChevronRight, Briefcase,
  CheckCircle, Clock, MoreVertical, X,
  Star, User, Users
} from 'lucide-react';
import {
  Container, Row, Col, Button, Badge,
  Form, InputGroup, Dropdown, Modal
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

type StatusFilter = 'all' | 'completed' | 'evaluated' | 'pending';

const ProjectsArchive: React.FC = () => {
  const { projects, evaluations, documents } = useApp();

  const [searchTerm, setSearchTerm]       = useState('');
  const [statusFilter, setStatusFilter]   = useState<StatusFilter>('all');
  const [selected, setSelected]           = useState<number[]>([]);
  const [showDetails, setShowDetails]     = useState(false);
  const [viewing, setViewing]             = useState<any>(null);

  // ── Index: evaluation by project id ──────────────────────────────────────────
  const evalByProject = useMemo(() => {
    const m: Record<number, any> = {};
    (evaluations || []).forEach(ev => { if (ev?.project) m[ev.project] = ev; });
    return m;
  }, [evaluations]);

  // ── Index: documents by project id ───────────────────────────────────────────
  const docsByProject = useMemo(() => {
    const m: Record<number, any[]> = {};
    (documents || []).forEach(doc => {
      if (doc?.project) {
        if (!m[doc.project]) m[doc.project] = [];
        m[doc.project].push(doc);
      }
    });
    return m;
  }, [documents]);

  // ── Status helper ─────────────────────────────────────────────────────────────
  const getStatus = useCallback((project: any): StatusFilter => {
    const ev = evalByProject[project.id];
    if (!ev) return 'pending';
    if (ev.is_published) return 'completed';
    if (ev.supervisor_score !== null || ev.jury_score !== null) return 'evaluated';
    return 'pending';
  }, [evalByProject]);

  // ── Submitted projects (have an evaluation OR not draft) ──────────────────────
  const submittedProjects = useMemo(() =>
    (projects || []).filter(p => !!evalByProject[p.id] || (p.status && p.status !== 'draft')),
    [projects, evalByProject],
  );

  // ── Filtered list ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return submittedProjects.filter(p => {
      const matchSearch = !term ||
        (p.title || '').toLowerCase().includes(term) ||
        (p.student?.name || '').toLowerCase().includes(term) ||
        (p.supervisor?.name || '').toLowerCase().includes(term);
      if (!matchSearch) return false;
      if (statusFilter !== 'all') return getStatus(p) === statusFilter;
      return true;
    });
  }, [submittedProjects, searchTerm, statusFilter, getStatus]);

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => [
    { label: 'Total Submitted',    value: submittedProjects.length,                                    color: 'primary' },
    { label: 'Completed',          value: submittedProjects.filter(p => getStatus(p) === 'completed').length, color: 'success' },
    { label: 'Pending Evaluation', value: submittedProjects.filter(p => getStatus(p) === 'pending').length,   color: 'warning' },
  ], [submittedProjects, getStatus]);

  const toggleSelect = (id: number) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleExport = (format: string) => {
    alert(`Exporting ${selected.length} projects as ${format}…`);
    setSelected([]);
  };

  // ── Badge helper ──────────────────────────────────────────────────────────────
  const statusBadge = (status: StatusFilter) => {
    const map: Record<StatusFilter, { color: string; label: React.ReactNode }> = {
      completed: { color: 'success', label: <><CheckCircle size={11} className="me-1" />Completed</>    },
      evaluated: { color: 'info',    label: <><Star        size={11} className="me-1" />Evaluated</>    },
      pending:   { color: 'warning', label: <><Clock       size={11} className="me-1" />Pending</>      },
      all:       { color: 'secondary', label: 'All' },
    };
    const { color, label } = map[status];
    return (
      <Badge className={`bg-${color}-soft text-${color} border-0 extra-small fw-bold px-2 py-1`}>
        {label}
      </Badge>
    );
  };

  // ── Viewing details ───────────────────────────────────────────────────────────
  const viewingEval    = viewing ? evalByProject[viewing.id]    : null;
  const viewingDocs    = viewing ? (docsByProject[viewing.id] || []) : [];
  const viewingStatus  = viewing ? getStatus(viewing)           : 'pending';

  return (
    <div className="py-2">
      <Container fluid className="px-0">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Project Archives</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              All projects submitted by students to their supervisor and jury.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Filter size={18} /> Filter
            </Button>
            <Button className="btn-premium d-flex align-items-center gap-2" onClick={() => handleExport('CSV')}>
              <Download size={18} /> Export
            </Button>
          </div>
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <Row className="g-4 mb-5">
          {stats.map(s => (
            <Col lg={4} key={s.label}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border-start border-4 border-${s.color}`}>
                <div className="h3 fw-bold text-navy mb-1">{s.value}</div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-50">{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* ── Search + Filter tabs ────────────────────────────────────────────── */}
        <div className="glass-card p-4 rounded-4 mb-5 shadow-sm">
          <div className="d-flex gap-3 flex-wrap align-items-center">
            <InputGroup className="bg-surface-alt rounded-pill border px-2 overflow-hidden" style={{ flex: '1 1 260px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted">
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search by title, student or supervisor…"
                className="bg-transparent border-0 py-2 text-navy fw-bold small shadow-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <div className="d-flex gap-2">
              {(['all', 'completed', 'evaluated', 'pending'] as StatusFilter[]).map(f => (
                <Button
                  key={f}
                  size="sm"
                  variant={statusFilter === f ? 'primary' : 'outline-secondary'}
                  className="rounded-pill extra-small fw-bold px-3"
                  onClick={() => setStatusFilter(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="glass-card p-5 rounded-4 text-center shadow-sm">
            <Briefcase size={40} className="text-muted opacity-25 mb-3" />
            <div className="fw-bold text-navy mb-1">No projects found</div>
            <div className="extra-small text-muted fw-bold opacity-75">
              No submitted projects match your search criteria.
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {filtered.map((project, i) => {
              const ev           = evalByProject[project.id];
              const status       = getStatus(project);
              const projectDocs  = docsByProject[project.id] || [];
              const supervisorName = project.supervisor?.name || 'N/A';
              const studentName  = project.student?.name || 'Student';

              return (
                <Col key={project.id} lg={4} md={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="h-100"
                  >
                    <div
                      className={`glass-card rounded-4 overflow-hidden h-100 shadow-sm d-flex flex-column transition-all border ${selected.includes(project.id) ? 'border-primary' : 'border-transparent'}`}
                      style={selected.includes(project.id) ? { borderWidth: '2px' } : undefined}
                    >
                      <div className="p-4 flex-grow-1">

                        {/* Card top row */}
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="p-2 bg-primary-soft text-primary rounded-3">
                            <Briefcase size={18} />
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {statusBadge(status)}
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none hover-bg-surface-alt rounded-circle">
                                <MoreVertical size={16} />
                              </Dropdown.Toggle>
                              <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small p-2">
                                <Dropdown.Item className="py-2 fw-bold text-navy" onClick={() => { setViewing(project); setShowDetails(true); }}>
                                  <ChevronRight size={13} className="me-2 text-primary" /> View Details
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                            <Form.Check
                              type="checkbox"
                              checked={selected.includes(project.id)}
                              onChange={() => toggleSelect(project.id)}
                            />
                          </div>
                        </div>

                        {/* Title */}
                        <h6 className="fw-bold mb-2 text-navy" style={{ fontSize: '0.9rem' }}>
                          {project.title || `Project #${project.id}`}
                        </h6>
                        <p className="text-muted extra-small fw-bold opacity-75 mb-3"
                          style={{ minHeight: '34px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' } as React.CSSProperties}>
                          {project.description || 'No description provided.'}
                        </p>

                        {/* Meta */}
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                            <User size={13} className="text-primary flex-shrink-0" />
                            Student: <span className="text-navy ms-1">{studentName}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                            <Users size={13} className="text-info flex-shrink-0" />
                            Supervisor: <span className="text-navy ms-1">{supervisorName}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                            <FileText size={13} className="text-success flex-shrink-0" />
                            {projectDocs.length} document{projectDocs.length !== 1 ? 's' : ''} submitted
                          </div>
                          {ev && (ev.supervisor_score !== null || ev.jury_score !== null) && (
                            <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold">
                              <Star size={13} className="text-warning flex-shrink-0" />
                              {ev.supervisor_score !== null && `Sup: ${ev.supervisor_score}/20`}
                              {ev.supervisor_score !== null && ev.jury_score !== null && ' · '}
                              {ev.jury_score !== null && `Jury: ${ev.jury_score}/20`}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-3 border-top bg-surface-alt d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                            style={{ width: '24px', height: '24px', fontSize: '0.6rem' }}
                          >
                            {supervisorName.charAt(0).toUpperCase()}
                          </div>
                          <span className="extra-small fw-bold text-navy opacity-75">{supervisorName}</span>
                        </div>
                        <Button
                          variant="link"
                          className="p-0 text-primary extra-small fw-bold text-decoration-none border-0 shadow-none"
                          onClick={() => { setViewing(project); setShowDetails(true); }}
                        >
                          Details <ChevronRight size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              );
            })}
          </Row>
        )}

        {/* ── Floating export bar ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {selected.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed-bottom d-flex justify-content-center pb-4"
              style={{ zIndex: 1050 }}
            >
              <div className="glass-card bg-navy text-white px-4 py-3 rounded-pill shadow-lg d-flex align-items-center gap-4 border-0">
                <div className="d-flex align-items-center gap-2 border-end pe-4 border-white border-opacity-10">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center fw-bold small"
                    style={{ width: '32px', height: '32px' }}>
                    {selected.length}
                  </div>
                  <span className="extra-small fw-bold text-uppercase">Selected</span>
                </div>
                <div className="d-flex gap-3">
                  <Button variant="link" className="text-white p-0 d-flex align-items-center gap-2 extra-small fw-bold text-decoration-none" onClick={() => handleExport('PDF')}>
                    <FileText size={16} className="text-danger" /> PDF
                  </Button>
                  <Button variant="link" className="text-white p-0 d-flex align-items-center gap-2 extra-small fw-bold text-decoration-none" onClick={() => handleExport('CSV')}>
                    <Download size={16} className="text-success" /> CSV
                  </Button>
                </div>
                <Button variant="link" className="text-white p-1 border-0 shadow-none ms-2" onClick={() => setSelected([])}>
                  <X size={18} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      {/* ── Details Modal ───────────────────────────────────────────────────────── */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-primary-soft text-primary rounded-4">
              <Briefcase size={22} />
            </div>
            <div>
              <Modal.Title className="fw-bold text-navy h5 mb-0">
                {viewing?.title || `Project #${viewing?.id}`}
              </Modal.Title>
              <div className="extra-small text-muted fw-bold mt-1 opacity-75">ID: {viewing?.id}</div>
            </div>
          </div>
        </Modal.Header>

        <Modal.Body className="p-4">
          {viewing && (
            <Row className="g-4">
              {/* Left: description + documents */}
              <Col lg={7}>
                <div className="mb-4">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-2 opacity-75">Description</h6>
                  <p className="small text-navy lh-base fw-medium bg-surface-alt p-3 rounded-4 border">
                    {viewing.description || 'No description provided.'}
                  </p>
                </div>

                <div>
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-2 opacity-75">
                    Submitted Documents ({viewingDocs.length})
                  </h6>
                  {viewingDocs.length === 0 ? (
                    <div className="extra-small text-muted fw-bold opacity-75 p-3 bg-surface-alt rounded-4 border text-center">
                      No documents submitted yet.
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {viewingDocs.map((doc: any) => (
                        <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-surface-alt border">
                          <div className="d-flex align-items-center gap-3">
                            <FileText size={16} className="text-primary flex-shrink-0" />
                            <div>
                              <div className="small fw-bold text-navy">
                                {doc.title || doc.file_name || `Document #${doc.id}`}
                              </div>
                              <div className="extra-small text-muted fw-bold opacity-75 text-capitalize">
                                {doc.document_type || doc.type || 'Document'}
                              </div>
                            </div>
                          </div>
                          <Badge className={`bg-${doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'}-soft text-${doc.status === 'approved' ? 'success' : doc.status === 'rejected' ? 'danger' : 'warning'} border-0 extra-small fw-bold px-2`}>
                            {doc.status || 'pending'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>

              {/* Right: metadata */}
              <Col lg={5}>
                <div className="p-4 rounded-4 bg-surface-alt border h-100 d-flex flex-column gap-4">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-0 opacity-75">Academic Info</h6>

                  <div>
                    <div className="extra-small text-muted fw-bold opacity-50 mb-1">STUDENT</div>
                    <div className="small fw-bold text-navy">{viewing.student?.name || 'N/A'}</div>
                  </div>

                  <div>
                    <div className="extra-small text-muted fw-bold opacity-50 mb-1">SUPERVISOR</div>
                    <div className="small fw-bold text-navy">{viewing.supervisor?.name || 'N/A'}</div>
                  </div>

                  <div>
                    <div className="extra-small text-muted fw-bold opacity-50 mb-1">STATUS</div>
                    {statusBadge(viewingStatus)}
                  </div>

                  {viewingEval && (
                    <>
                      <div className="border-top pt-3">
                        <div className="extra-small text-muted fw-bold opacity-50 mb-1">SUPERVISOR SCORE</div>
                        <div className="small fw-bold text-navy">
                          {viewingEval.supervisor_score !== null
                            ? `${viewingEval.supervisor_score} / 20`
                            : <span className="opacity-50">Not yet scored</span>}
                        </div>
                      </div>

                      <div>
                        <div className="extra-small text-muted fw-bold opacity-50 mb-1">JURY SCORE</div>
                        <div className="small fw-bold text-navy">
                          {viewingEval.jury_score !== null
                            ? `${viewingEval.jury_score} / 20`
                            : <span className="opacity-50">Not yet scored</span>}
                        </div>
                      </div>

                      {viewingEval.supervisor_score !== null && viewingEval.jury_score !== null && (
                        <div>
                          <div className="extra-small text-muted fw-bold opacity-50 mb-1">FINAL GRADE</div>
                          <div className="h5 fw-bold text-navy mb-0">
                            {(
                              viewingEval.supervisor_score * ((viewingEval.supervisor_weight || 50) / 100) +
                              viewingEval.jury_score       * ((viewingEval.jury_weight       || 50) / 100)
                            ).toFixed(2)} / 20
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="extra-small text-muted fw-bold opacity-50 mb-1">PUBLISHED</div>
                        <Badge className={`bg-${viewingEval.is_published ? 'success' : 'warning'}-soft text-${viewingEval.is_published ? 'success' : 'warning'} border-0 extra-small fw-bold px-2`}>
                          {viewingEval.is_published ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0 p-4 pt-0">
          <Button className="btn-premium w-100 py-3 rounded-4 border-0" onClick={() => setShowDetails(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectsArchive;
