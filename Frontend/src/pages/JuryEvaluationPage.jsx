import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, ProgressBar, Badge, Table } from 'react-bootstrap';
import { 
  CheckCircle, FileText, User, Star, Award, MessageSquare, 
  ChevronRight, Save, Download, AlertCircle, TrendingUp,
  Layout, BookOpen, Presentation, ClipboardCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const JuryEvaluationPage = () => {
  const { session } = useApp();
  const [activeStep, setActiveStep] = useState(1);
  const [scores, setScores] = useState({
    reportQuality: 0,
    technicalDepth: 0,
    presentationSkills: 0,
    qAndA: 0,
    innovation: 0
  });

  const [comment, setComment] = useState('');

  const handleScoreChange = (criteria, value) => {
    setScores(prev => ({ ...prev, [criteria]: value }));
  };

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const finalGrade = (totalScore / 5).toFixed(1);

  return (
    <Container fluid className="p-4 p-xl-5 bg-background animate-fade-in">
      <div className="mb-5 d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark-custom tracking-tight">Jury Evaluation Portal</h2>
          <p className="text-muted small mb-0 fw-medium">Academic Year 2025/2026 • Official Deliberation Workspace</p>
        </div>
        <div className="d-flex gap-2">
          <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-bold">
            Project Ref: #PFE-2026-IT04
          </Badge>
          <Button variant="outline-primary" className="rounded-pill px-3 btn-sm fw-bold border-1 bg-white">
            <Download size={14} className="me-1" /> Export Grid
          </Button>
        </div>
      </div>

      <Row className="g-4">
        {/* Left Column: Evaluation Form */}
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            <div className="p-4 border-bottom bg-surface d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <ClipboardCheck size={24} />
                </div>
                <h5 className="fw-bold mb-0 text-dark-custom">Official Scoring Grid</h5>
              </div>
              <div className="d-flex gap-2">
                {[1, 2, 3].map(step => (
                  <div key={step} className={`step-dot ${activeStep >= step ? 'bg-primary' : 'bg-light'}`} style={{ width: 12, height: 12, borderRadius: '50%' }}></div>
                ))}
              </div>
            </div>
            
            <Card.Body className="p-4">
              <TabContent step={activeStep} scores={scores} onScoreChange={handleScoreChange} comment={comment} setComment={setComment} />
              
              <div className="d-flex justify-content-between mt-5 pt-4 border-top">
                <Button 
                  variant="light" 
                  className="rounded-pill px-4 fw-bold" 
                  onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                  disabled={activeStep === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="primary" 
                  className="rounded-pill px-5 fw-bold shadow-sm border-0" 
                  onClick={() => activeStep < 3 ? setActiveStep(activeStep + 1) : alert('Grade Submitted Successfully!')}
                >
                  {activeStep === 3 ? 'Finalize & Submit Grade' : 'Next Section'}
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 bg-surface p-4 border-start border-5 border-info">
            <div className="d-flex align-items-start gap-3">
              <AlertCircle size={24} className="text-info" />
              <div>
                <h6 className="fw-bold mb-1">Confidentiality Notice</h6>
                <p className="extra-small text-muted mb-0">
                  All evaluations and comments entered here are strictly confidential and only visible to the Administration and the other Jury members. 
                  Grades will be released to students only after final administrative validation.
                </p>
              </div>
            </div>
          </Card>
        </Col>

        {/* Right Column: Project Info & Real-time Calc */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 bg-navy text-white p-4 mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="avatar-circle shadow-sm border border-white border-opacity-25" style={{ width: '48px', height: '48px', fontSize: '1.2rem', backgroundColor: 'rgba(255,255,255,0.1)' }}>Y</div>
              <div>
                <h6 className="fw-bold mb-0">Youssef Mourad</h6>
                <p className="extra-small opacity-75 mb-0">CS Major • Final Year Student</p>
              </div>
            </div>
            <h5 className="fw-bold mb-3">AI-based Academic Integrity System</h5>
            <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10 mb-4">
              <div className="d-flex justify-content-between extra-small mb-2 opacity-75">
                <span>Supervisor Validation</span>
                <span className="fw-bold text-success">Approved</span>
              </div>
              <div className="d-flex justify-content-between extra-small">
                <span>Submission Date</span>
                <span className="fw-bold">April 15, 2026</span>
              </div>
            </div>
            <Button variant="light" className="w-100 rounded-pill py-2 fw-bold small shadow-none border-0 mb-2">
              <FileText size={16} className="me-2" /> Preview Final Report
            </Button>
          </Card>

          <Card className="border-0 shadow-sm rounded-4 bg-surface p-4 text-center">
            <h6 className="fw-bold text-muted text-uppercase mb-4 extra-small tracking-wider">Live Grade Calculator</h6>
            <div className="display-4 fw-bold text-primary mb-1">{finalGrade}<small className="h4 text-muted">/20</small></div>
            <p className="extra-small text-muted mb-4">Based on weighted criteria below</p>
            
            <div className="d-flex flex-column gap-3 text-start">
              <CriteriaProgress label="Scientific Rigor" val={scores.reportQuality * 5} color="primary" />
              <CriteriaProgress label="Technical Quality" val={scores.technicalDepth * 5} color="success" />
              <CriteriaProgress label="Presentation" val={scores.presentationSkills * 5} color="info" />
            </div>
            
            <hr className="my-4 opacity-5" />
            <div className="p-3 rounded-4 bg-light-soft text-start">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Star size={16} className="text-warning fill-warning" />
                <span className="small fw-bold">Jury Verdict</span>
              </div>
              <p className="extra-small text-muted mb-0">
                Current score corresponds to <strong className="text-dark">"{finalGrade >= 16 ? 'Excellent' : finalGrade >= 14 ? 'Very Good' : 'Pass'}"</strong> honors.
              </p>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const TabContent = ({ step, scores, onScoreChange, comment, setComment }) => {
  if (step === 1) {
    return (
      <div className="animate-slide-in">
        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><BookOpen size={18} className="text-primary" /> Section 1: Written Report & Technical Depth</h6>
        <div className="mb-4">
          <ScoreSlider label="Quality of the Written Document (Grammar, Structure, Formatting)" value={scores.reportQuality} onChange={(v) => onScoreChange('reportQuality', v)} />
          <ScoreSlider label="Technical Complexity & Scientific Depth" value={scores.technicalDepth} onChange={(v) => onScoreChange('technicalDepth', v)} />
          <ScoreSlider label="Innovation & Originality of the Solution" value={scores.innovation} onChange={(v) => onScoreChange('innovation', v)} />
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="animate-slide-in">
        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><Presentation size={18} className="text-primary" /> Section 2: Oral Presentation & Communication</h6>
        <div className="mb-4">
          <ScoreSlider label="Clarity of Presentation & Quality of Visual Aids" value={scores.presentationSkills} onChange={(v) => onScoreChange('presentationSkills', v)} />
          <ScoreSlider label="Ability to Answer Technical Questions (Q&A Session)" value={scores.qAndA} onChange={(v) => onScoreChange('qAndA', v)} />
        </div>
      </div>
    );
  }
  return (
    <div className="animate-slide-in">
      <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><MessageSquare size={18} className="text-primary" /> Section 3: Final Jury Remarks & Deliberation</h6>
      <Form.Group className="mb-4">
        <Form.Label className="small fw-bold text-muted">Confidential Jury Feedback</Form.Label>
        <Form.Control 
          as="textarea" 
          rows={6} 
          placeholder="Enter the official jury remarks here. These will be archived in the student's permanent file..." 
          className="bg-light border-0 p-3 rounded-4 shadow-none extra-small"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>
      <div className="p-3 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-10 d-flex gap-3">
        <TrendingUp size={20} className="text-primary" />
        <p className="extra-small mb-0 text-muted">
          By clicking 'Finalize', you acknowledge that this grade is final and has been agreed upon by all members of the jury panel present today.
        </p>
      </div>
    </div>
  );
};

const ScoreSlider = ({ label, value, onChange }) => (
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-2">
      <label className="small fw-bold text-dark-custom opacity-75">{label}</label>
      <span className="badge bg-primary rounded-pill px-3">{value}/20</span>
    </div>
    <Form.Range 
      min="0" 
      max="20" 
      step="0.5" 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))} 
      className="custom-range"
    />
  </div>
);

const CriteriaProgress = ({ label, val, color }) => (
  <div>
    <div className="d-flex justify-content-between mb-1">
      <span className="extra-small fw-bold text-muted">{label}</span>
      <span className="extra-small fw-bold">{val}%</span>
    </div>
    <ProgressBar now={val} variant={color} style={{ height: '6px' }} className="rounded-pill bg-light" />
  </div>
);

export default JuryEvaluationPage;
