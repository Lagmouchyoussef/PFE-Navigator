import React, { useState } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge, ProgressBar, Alert } from 'react-bootstrap';
import { 
  CheckCircle, AlertCircle, Save, FileText, User, 
  ChevronRight, ArrowLeft, Info, Star, Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SupervisorEvaluationPage = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState({
    technical: 0,
    innovation: 0,
    methodology: 0,
    presentation: 0
  });
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calculateTotal = () => {
    const sum = Object.values(scores).reduce((a, b) => a + b, 0);
    return (sum / 4).toFixed(1);
  };

  const handleScoreChange = (criteria, value) => {
    setScores(prev => ({ ...prev, [criteria]: parseInt(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/supervisor/dashboard'), 2000);
  };

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-3">
             <Button variant="white" className="rounded-circle border p-2 shadow-sm" onClick={() => navigate(-1)}><ArrowLeft size={18} /></Button>
             <div>
                <h3 className="fw-bold text-dark mb-1">Project Evaluation</h3>
                <p className="text-muted small mb-0">Supervisor Assessment for Youssef Mourad</p>
             </div>
          </div>
          <div className="text-end">
             <div className="extra-small fw-bold text-muted uppercase">Final Score</div>
             <h2 className="fw-bold text-primary mb-0">{calculateTotal()}<small className="text-muted fs-6">/20</small></h2>
          </div>
        </div>

        {submitted && (
          <Alert variant="success" className="rounded-3 border-0 shadow-sm d-flex align-items-center gap-3 p-4 mb-4">
            <CheckCircle size={24} />
            <div>
              <h6 className="fw-bold mb-0">Evaluation Submitted Successfully</h6>
              <p className="extra-small mb-0">The student will be notified of their final supervisor assessment.</p>
            </div>
          </Alert>
        )}

        <Row className="g-4">
          {/* Evaluation Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-3 p-4 p-md-5 bg-white">
               <h5 className="fw-bold text-dark mb-4 border-bottom pb-3">Grading Criteria</h5>
               <Form onSubmit={handleSubmit}>
                 {Object.keys(scores).map((criteria) => (
                   <div key={criteria} className="mb-5">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Form.Label className="fw-bold text-dark text-capitalize">{criteria} Implementation</Form.Label>
                        <Badge bg="primary" className="bg-opacity-10 text-primary rounded-pill px-3 fw-bold">{scores[criteria]}/20</Badge>
                      </div>
                      <Form.Range 
                        min="0" max="20" step="1" 
                        value={scores[criteria]} 
                        onChange={(e) => handleScoreChange(criteria, e.target.value)}
                        className="custom-range"
                      />
                      <div className="d-flex justify-content-between extra-small text-muted fw-bold mt-1">
                        <span>Insufficient</span>
                        <span>Excellent</span>
                      </div>
                   </div>
                 ))}

                 <hr className="my-5 opacity-5" />

                 <Form.Group className="mb-4">
                   <Form.Label className="fw-bold text-dark mb-3">General Feedback & Observations</Form.Label>
                   <Form.Control 
                     as="textarea" rows={6} 
                     placeholder="Provide detailed constructive feedback for the student..." 
                     className="rounded-3 p-3 small border shadow-none bg-light"
                     value={feedback}
                     onChange={(e) => setFeedback(e.target.value)}
                     required
                   />
                 </Form.Group>

                 <div className="d-flex justify-content-end gap-3 pt-4">
                    <Button variant="light" className="px-4 py-2 rounded-3 fw-bold text-muted border-0" onClick={() => alert("Brouillon enregistré !")}>Save Draft</Button>
                    <Button type="submit" variant="primary" className="px-5 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2">
                      Submit Assessment <ChevronRight size={18} />
                    </Button>
                 </div>
               </Form>
            </Card>
          </Col>

          {/* Student Info Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
               <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><User size={18} className="text-primary" /> Student Portfolio</h6>
               <div className="d-flex align-items-center gap-3 mb-4">
                 <div className="avatar-circle bg-primary bg-opacity-10 text-primary fw-bold">Y</div>
                 <div>
                    <div className="small fw-bold">Youssef Mourad</div>
                    <div className="extra-small text-muted">Computer Engineering</div>
                 </div>
               </div>
               <div className="p-3 rounded-3 bg-light border border-primary border-opacity-10 mb-4">
                  <div className="extra-small fw-bold text-muted uppercase mb-1">Current Progress</div>
                  <ProgressBar now={85} variant="primary" className="rounded-pill mb-2" style={{ height: '6px' }} />
                  <div className="d-flex justify-content-between extra-small fw-bold text-dark">
                    <span>Final Report</span>
                    <span>Validated</span>
                  </div>
               </div>
               <Button variant="outline-primary" size="sm" className="w-100 rounded-pill fw-bold small border-1 d-flex align-items-center justify-content-center gap-2">
                  <FileText size={14} /> View Final Report
               </Button>
            </Card>

            <Card className="border-0 shadow-sm rounded-3 p-4 bg-white">
               <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Award size={18} className="text-warning" /> Grading Guidelines</h6>
               <ul className="ps-3 mb-0 extra-small text-muted fw-medium d-flex flex-column gap-3">
                 <li><strong>Technical:</strong> Complexity of algorithms and architecture.</li>
                 <li><strong>Innovation:</strong> Originality of the solution.</li>
                 <li><strong>Methodology:</strong> Rigor of the development process.</li>
                 <li><strong>Presentation:</strong> Clarity and defense performance.</li>
               </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SupervisorEvaluationPage;
