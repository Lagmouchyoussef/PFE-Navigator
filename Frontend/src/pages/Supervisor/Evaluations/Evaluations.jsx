import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Container, Row, Col, Card, Badge, Button, Table, ProgressBar, Form, Dropdown, Modal } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, AlertCircle, Clock, 
  MessageSquare, Star, Download, Eye, 
  Filter, ChevronRight, Award, Edit3, X
} from 'lucide-react';

// Data will be fetched from context

const Evaluations = () => {
  const { 
    saveScore, isGradesPublished, scores, 
    pfeWeights, supervisorCriteriaWeights,
    students, updateStudentEvaluation 
  } = useApp();
  const [filter, setFilter] = useState('All');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [msgVariant, setMsgVariant] = useState('success');
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedViewSubmission, setSelectedViewSubmission] = useState(null);
  const [pfeNote, setPfeNote] = useState('');
  const [criteriaScores, setCriteriaScores] = useState({
    report: 0,
    progress: 0,
    autonomy: 0,
    professionalism: 0
  });

  const handleOpenEval = (student) => {
    setSelectedStudent(student);
    if (student.supervisorCriteriaScores) {
      setCriteriaScores({ ...student.supervisorCriteriaScores });
      setPfeNote(student.supervisorScore?.toString() || '0');
    } else {
      setCriteriaScores({ report: 0, progress: 0, autonomy: 0, professionalism: 0 });
      setPfeNote(student.supervisorScore !== null ? student.supervisorScore.toString() : '0');
    }
    setShowEvalModal(true);
  };

  const handleViewSubmission = (sub) => {
    setSelectedViewSubmission(sub);
    setShowViewModal(true);
  };

  const handleEvalSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
    updateStudentEvaluation(selectedStudent.id, { 
      supervisorScore: Number(calculatedTotal),
      supervisorCriteriaScores: { ...criteriaScores },
      isSupervisorEvaluated: true 
    });
    setShowEvalModal(false);
    setSuccessMsg(`Congratulations: The grades for ${selectedStudent.name} have been successfully recorded in the system.`);
    setMsgVariant('success');
    setShowSuccessCard(true);
  };

  const handleDraft = () => {
    if (!selectedStudent) return;
    updateStudentEvaluation(selectedStudent.id, { 
      supervisorScore: Number(calculatedTotal),
      supervisorCriteriaScores: { ...criteriaScores }
    });
    setShowEvalModal(false);
    setSuccessMsg(`Success: The draft for ${selectedStudent.name} has been updated.`);
    setMsgVariant('warning');
    setShowSuccessCard(true);
  };

  const handleExport = (format) => {
    setSuccessMsg(`Export in ${format} format has been started. Your file will be ready in a few seconds.`);
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const handleFinalGrades = () => {
    setSuccessMsg("Final grades have been consolidated and sent to the academic department for validation.");
    setShowSuccessCard(true);
    setTimeout(() => setShowSuccessCard(false), 5000);
  };

  const calculateTotalScore = () => {
    let weightedSum = 0;
    let weightTotal = 0;
    
    Object.keys(criteriaScores).forEach(key => {
      const weight = supervisorCriteriaWeights[key] || 0;
      const score = criteriaScores[key] || 0;
      weightedSum += (score * weight);
      weightTotal += weight;
    });

    if (weightTotal === 0) return "0.00";
    return (weightedSum / weightTotal).toFixed(2);
  };

  const calculatedTotal = calculateTotalScore();

  const filteredData = filter === 'All' ? students : students.filter(item => item.status === filter);

  return (
    <div className="supervisor-evaluations-layout py-4">
      <Container fluid className="px-4">
        
        {/* Success Alert (Jury Style) */}
        <AnimatePresence>
          {showSuccessCard && (
            <div className="notification-overlay position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className={`glass-card p-5 rounded-5 shadow-lg border-top-5 border-${msgVariant} bg-white d-flex flex-column align-items-center text-center`}
                style={{ maxWidth: '500px', width: '90%' }}
              >
                <div className={`p-4 rounded-circle bg-${msgVariant}-soft text-${msgVariant} mb-4`}>
                  {msgVariant === 'success' ? <CheckCircle size={48} /> : <AlertCircle size={48} />}
                </div>
                <h4 className="fw-bold mb-2 text-navy">
                  {msgVariant === 'success' ? 'Evaluation Recorded' : 'Draft Updated'}
                </h4>
                <p className="text-muted fw-bold mb-4 px-3">{successMsg}</p>
                <Button 
                  variant={msgVariant === 'success' ? 'success' : 'warning'} 
                  className="px-5 py-2 rounded-pill fw-bold shadow-sm border-0 text-white"
                  onClick={() => setShowSuccessCard(false)}
                >
                  Continue
                </Button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Evaluations & Feedback</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Review student submissions and manage project grades
            </p>
          </motion.div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 shadow-none"
              >
                <Download size={18} /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg extra-small rounded-4">
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Excel')}>
                  <FileText size={14} className="text-success" /> Excel Format (.xlsx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('Word')}>
                  <FileText size={14} className="text-primary" /> Word Format (.docx)
                </Dropdown.Item>
                <Dropdown.Item className="py-2 d-flex align-items-center gap-2" onClick={() => handleExport('PDF')}>
                  <FileText size={14} className="text-danger" /> PDF Format (.pdf)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button 
              className="btn-premium d-flex align-items-center gap-2 shadow-sm"
              onClick={handleFinalGrades}
            >
              <Award size={18} /> Final Grades
            </Button>
          </div>
        </header>

        {/* Evaluation Summary Cards */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <Card className="glass-card border-0 shadow-sm border p-4 h-100">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold text-navy mb-0">Grading Progress</h6>
                <Badge className="bg-primary-soft text-primary border-0 px-3 py-1 rounded-pill extra-small fw-bold">Semester 2</Badge>
              </div>
              <Row className="text-center g-4">
                <Col xs={4}>
                  <div className="h2 fw-bold text-navy mb-1">14</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Submissions</div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="h2 fw-bold text-success mb-1">8</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Evaluated</div>
                </Col>
                <Col xs={4}>
                  <div className="h2 fw-bold text-warning mb-1">6</div>
                  <div className="extra-small text-muted fw-bold text-uppercase opacity-75">Remaining</div>
                </Col>
              </Row>
              <div className="mt-4">
                <div className="d-flex justify-content-between extra-small fw-bold text-navy mb-2">
                  <span className="opacity-75">Overall Progress</span>
                  <span className="text-primary">57%</span>
                </div>
                <ProgressBar now={57} variant="primary" style={{ height: '8px' }} className="rounded-pill bg-surface-alt border-0" />
              </div>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="glass-card border-0 shadow-sm border-start-4 border-primary p-4 h-100 bg-surface-alt">
              <h6 className="fw-bold text-navy mb-3 d-flex align-items-center gap-2">
                <Star size={18} className="text-warning" /> PFE Grade Consolidation
              </h6>
              <div className="p-3 bg-white rounded-4 shadow-sm mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="extra-small text-muted fw-bold">Jury Grade (Defense)</span>
                  <Badge className={`extra-small fw-bold ${isGradesPublished ? 'text-navy' : 'text-danger bg-danger-soft border-0'}`}>
                    {isGradesPublished ? `Jury Part: ${pfeWeights.jury}%` : 'Hidden (Secret)'}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="extra-small text-muted fw-bold">Supervisor Grade (Follow-up)</span>
                  <span className="extra-small fw-bold text-navy">
                    {students.find(s => s.isSupervisorEvaluated)?.supervisorScore ? 'Grades assigned' : 'Pending'} 
                    <span className="opacity-50 ms-1">({pfeWeights.supervisor}%)</span>
                  </span>
                </div>
                <hr className="my-2 opacity-10" />
                <div className="d-flex justify-content-between align-items-center pt-1">
                  <span className="small fw-bold text-navy">Final Calculation</span>
                  <span className={`small fw-bold ${isGradesPublished ? 'text-primary' : 'text-muted opacity-50'}`}>
                    {isGradesPublished ? 'Weighted Average Applied' : 'Awaiting publication'}
                  </span>
                </div>
              </div>
              <p className="extra-small text-muted fw-bold mb-0 opacity-75">
                {isGradesPublished 
                  ? "Grades are now public and visible to the student."
                  : "The jury grade remains secret until the official publication by the administration."}
              </p>
            </Card>
          </Col>
        </Row>

        {/* Submissions List */}
        <Card className="glass-card border shadow-sm border overflow-hidden">
          <Card.Header className="p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-0">
            <h6 className="mb-0 fw-bold text-navy">Recent Submissions Queue</h6>
            <div className="d-flex gap-2">
              <Form.Select 
                className="bg-surface-alt border-0 shadow-none extra-small fw-bold py-2 rounded-pill border" 
                style={{ width: '150px' }}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Graded">Graded</option>
              </Form.Select>
            </div>
          </Card.Header>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-surface-alt">
                <tr>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Deliverable</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Submission Date</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">My Grade</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Jury Grade</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode='popLayout'>
                  {filteredData.map((item, index) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-bottom border-light border-opacity-10"
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-xs bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '11px' }}>
                            {item.name.charAt(0)}
                          </div>
                          <span className="fw-bold text-navy small">{item.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <FileText size={16} className="text-primary" />
                          <span className="extra-small text-muted fw-bold opacity-75">{item.project}</span>
                        </div>
                      </td>
                      <td><span className="extra-small text-muted fw-bold opacity-75">{item.submissionDate}</span></td>
                      <td>
                        <Badge className={`bg-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'}-soft text-${item.status === 'Graded' ? 'success' : item.status === 'Reviewing' ? 'primary' : 'warning'} border-0 extra-small px-3 py-1 fw-bold`}>
                          {item.status}
                        </Badge>
                      </td>
                      <td>
                        {item.supervisorScore !== null ? (
                          <span className="extra-small fw-bold text-navy">{item.supervisorScore}/20</span>
                        ) : (
                          <span className="extra-small text-muted opacity-50 fw-bold">Not graded</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          <Badge className={`bg-${item.isJuryEvaluated ? 'success' : 'warning'}-soft text-${item.isJuryEvaluated ? 'success' : 'warning'} border-0 extra-small px-3 py-1 fw-bold w-fit`}>
                            {item.isJuryEvaluated ? 'Jury Evaluated' : 'Jury Pending'}
                          </Badge>
                          <span className={`extra-small fw-bold ${isGradesPublished ? 'text-primary' : 'text-muted opacity-25'}`}>
                            {isGradesPublished 
                              ? (item.juryScore !== null ? `${item.juryScore}/20` : '--')
                              : 'Confidential'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-end">
                        <div className="d-flex justify-content-end gap-1">
                          <Button 
                            variant="link" 
                            className="p-2 text-primary hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                            onClick={() => handleViewSubmission(item)}
                          >
                            <Eye size={18} />
                          </Button>
                          <Button 
                             variant="link" 
                             className="p-2 text-success hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"
                             onClick={() => handleOpenEval(item)}
                           >
                            <Edit3 size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
      {/* Supervisor Final PFE Evaluation Modal */}
      <Modal 
        show={showEvalModal} 
        onHide={() => setShowEvalModal(false)}
        centered
        size="lg"
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5 d-flex align-items-center gap-2">
            <Award className="text-primary" /> Supervisor PFE Evaluation: {selectedStudent?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleEvalSubmit}>

            
            <Row className="g-4">
              <Col lg={8}>
                <h6 className="extra-small fw-bold text-navy mb-3 opacity-75">ADMINISTRATIVE GRADING DETAIL</h6>
                <div className="d-flex flex-column gap-2 mb-4">
                  {[
                    { id: 'report', label: 'Report Quality' },
                    { id: 'progress', label: 'Progress' },
                    { id: 'autonomy', label: 'Autonomy' },
                    { id: 'professionalism', label: 'Professionalism' },
                  ].map(crit => (
                    <div key={crit.id} className="d-flex align-items-center justify-content-between p-3 rounded-4 bg-white border border-light-soft shadow-sm">
                      <div className="d-flex align-items-center gap-3">
                        <div className="p-2 bg-surface-alt rounded-3 text-primary">
                          <FileText size={16} />
                        </div>
                        <div>
                          <div className="small fw-bold text-navy">{crit.label}</div>
                          <div className="extra-small text-muted opacity-50">Coef: {supervisorCriteriaWeights[crit.id] || 0}</div>
                        </div>
                      </div>
                      <Form.Control 
                        type="number" 
                        max={20} min={0}
                        className="bg-surface-alt border-0 rounded-4 text-center fw-bold text-navy shadow-none" 
                        style={{ width: '70px', height: '40px' }}
                        value={criteriaScores[crit.id]}
                        onChange={(e) => {
                          const val = Math.min(20, Math.max(0, Number(e.target.value)));
                          setCriteriaScores({...criteriaScores, [crit.id]: val});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Global Observations & Remarks</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 extra-small fw-bold shadow-none" 
                    placeholder="Summary of your evaluation over the semester..."
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <div className="h-100 p-4 rounded-4 bg-surface-alt border border-light-soft d-flex flex-column align-items-center justify-content-center text-center">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75 mb-3">Final Supervisor Grade</Form.Label>
                  <div className="h1 fw-bold text-center border-0 bg-transparent text-primary shadow-none mb-0" style={{ fontSize: '3rem' }}>
                    {calculatedTotal}
                  </div>
                  <div className="h5 text-muted opacity-25 fw-bold mt-n2">/ 20</div>
                  <div className="extra-small text-muted fw-bold mt-3 opacity-50">(Final part: {pfeWeights.supervisor}%)</div>
                </div>
              </Col>
            </Row>

            <div className="mt-4 pt-4 border-top border-light border-opacity-10 d-flex gap-3">
              <Button 
                variant="outline-secondary" 
                className="flex-grow-1 py-3 rounded-pill fw-bold border-2 extra-small shadow-none"
                onClick={handleDraft}
              >
                Save Draft
              </Button>
              <Button 
                type="submit" 
                className="btn-premium flex-grow-1 py-3 rounded-pill fw-bold shadow-sm border-0"
              >
                Save Final Evaluation
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* View Submission Details Modal */}
      <Modal 
        show={showViewModal} 
        onHide={() => setShowViewModal(false)}
        centered
        className="glass-modal"
      >
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold text-navy h5">Submission Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Student Information</h6>
            <div className="p-3 bg-surface-alt rounded-4 border border-light-soft d-flex align-items-center gap-3">
              <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '45px', height: '45px' }}>
                {selectedViewSubmission?.name.charAt(0)}
              </div>
              <div>
                <div className="fw-bold text-navy">{selectedViewSubmission?.name}</div>
                <div className="extra-small text-muted fw-bold opacity-75">ID: STU-2026-{selectedViewSubmission?.id}</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Deliverable Details</h6>
            <Card className="border-light-soft rounded-4 shadow-none bg-surface-alt">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="extra-small text-muted fw-bold">Project Name :</span>
                  <span className="extra-small fw-bold text-navy">{selectedViewSubmission?.project}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="extra-small text-muted fw-bold">Submission Date :</span>
                  <span className="extra-small fw-bold text-navy">{selectedViewSubmission?.submissionDate}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="extra-small text-muted fw-bold">Current Status :</span>
                  <Badge className={`bg-${selectedViewSubmission?.status === 'Graded' ? 'success' : 'primary'}-soft text-${selectedViewSubmission?.status === 'Graded' ? 'success' : 'primary'} border-0 extra-small fw-bold`}>
                    {selectedViewSubmission?.status}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="mb-4">
            <h6 className="extra-small fw-bold text-muted text-uppercase opacity-50 mb-3">Project Progress</h6>
            <div className="p-3 bg-surface-alt rounded-4 border border-light-soft">
              <div className="d-flex justify-content-between extra-small fw-bold text-navy mb-2">
                <span>Progress</span>
                <span>{selectedViewSubmission?.progress}%</span>
              </div>
              <ProgressBar now={selectedViewSubmission?.progress} variant="primary" style={{ height: '6px' }} className="rounded-pill bg-white border-0" />
            </div>
          </div>

          <div className="mt-4 pt-3 d-flex gap-2">
            <Button variant="outline-primary" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-2 d-flex align-items-center justify-content-center gap-2 shadow-none" onClick={() => handleExport('PDF')}>
              <Download size={16} /> Download
            </Button>
            <Button variant="primary" className="flex-grow-1 py-2 rounded-pill fw-bold extra-small border-0 shadow-sm" onClick={() => { setShowViewModal(false); handleOpenEval(selectedViewSubmission); }}>
              Evaluate now
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Evaluations;
