import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, ProgressBar, Table, Button, Form, InputGroup } from 'react-bootstrap';
import { Award, FileText, Download, TrendingUp, CheckCircle, Clock, AlertCircle, HelpCircle, Save, Send, Info } from 'lucide-react';
import { useApp, SCORE_LABELS } from '../context/AppContext.jsx';

const EvaluationPage = () => {
  const { 
    session, 
    scores, 
    saveScore, 
    submitEvaluation, 
    globalGrade, 
    coefficients, 
    juryComment 
  } = useApp();

  const isJury = session?.role === 'jury';
  const [tempComment, setTempComment] = useState(juryComment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (criterion, value) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 20)) {
      saveScore(criterion, value);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    submitEvaluation(tempComment);
    setTimeout(() => setIsSubmitting(false), 1500);
  };

  const getGradeColor = (score) => {
    if (score === null) return 'secondary';
    if (score >= 16) return 'success';
    if (score >= 12) return 'primary';
    return 'danger';
  };

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {isJury ? 'Evaluation Workspace' : 'Academic Results'}
            </h3>
            <p className="text-muted small mb-0">
              {isJury 
                ? 'Review candidate performance and assign scores based on academic criteria.' 
                : 'Track your assessment scores and final GPA calculation.'}
            </p>
          </div>
          <div className="d-flex gap-2">
            {!isJury ? (
              <Button variant="outline-primary" className="fw-bold px-3 small d-flex align-items-center gap-2">
                <Download size={16} /> Export Transcript
              </Button>
            ) : (
              <Button 
                variant="primary" 
                className="fw-bold px-4 shadow-sm d-flex align-items-center gap-2"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Clock size={18} /> : <Send size={18} />}
                {isSubmitting ? 'Finalizing...' : 'Submit Evaluation'}
              </Button>
            )}
          </div>
        </div>

        <Row className="g-4 mb-4">
          {/* Global Score Summary */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-3 h-100 bg-white p-4 text-center border-top border-4 border-primary">
              <div className="mx-auto mb-3 p-3 rounded-circle bg-light text-primary" style={{ width: 'fit-content' }}>
                <Award size={40} />
              </div>
              <h6 className="fw-bold text-dark mb-1">{isJury ? 'Current Average' : 'Final GPA'}</h6>
              <div className="display-4 fw-bold text-primary mb-1">
                {globalGrade ? globalGrade.toFixed(2) : '—'}
                <small className="h6 text-muted ms-1">/20</small>
              </div>
              <div className="mt-2">
                <Badge bg={getGradeColor(globalGrade)} className="rounded-pill px-4 py-2 small fw-bold">
                  {globalGrade >= 12 ? 'PASS' : globalGrade === null ? 'PENDING' : 'FAIL'}
                </Badge>
              </div>
            </Card>
          </Col>

          {/* Detailed Breakdown / Grading Form */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm rounded-3 h-100 bg-white overflow-hidden">
              <div className="p-3 border-bottom bg-light bg-opacity-50">
                <h6 className="fw-bold mb-0">Scoring Grid Breakdown</h6>
              </div>
              <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light text-muted extra-small text-uppercase">
                  <tr>
                    <th className="ps-4 py-3">Criterion</th>
                    <th className="py-3 text-center">Coeff.</th>
                    <th className="py-3">Progress / Score</th>
                    <th className="text-end pe-4 py-3">Value /20</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {Object.keys(SCORE_LABELS).map((key) => {
                    const score = scores[key];
                    const color = getGradeColor(score);
                    return (
                      <tr key={key}>
                        <td className="ps-4 py-3">
                          <span className="fw-bold text-dark small">{SCORE_LABELS[key]}</span>
                        </td>
                        <td className="text-center small text-muted">x{coefficients[key]}</td>
                        <td style={{ minWidth: isJury ? '200px' : '150px' }}>
                          {isJury ? (
                            <div className="d-flex align-items-center gap-3">
                              <Form.Range 
                                min="0" max="20" step="0.5" 
                                value={score || 0}
                                onChange={(e) => handleScoreChange(key, e.target.value)}
                                className="flex-grow-1"
                              />
                              <Form.Control 
                                size="sm" type="number" 
                                className="bg-light border-0 text-center fw-bold rounded-2" 
                                style={{ width: '60px' }}
                                value={score === null ? '' : score}
                                onChange={(e) => handleScoreChange(key, e.target.value)}
                              />
                            </div>
                          ) : (
                            <ProgressBar now={(score / 20) * 100} variant={color} className="rounded-pill" style={{ height: '6px' }} />
                          )}
                        </td>
                        <td className="text-end pe-4">
                          <span className={`fw-bold small text-${color}`}>
                            {score !== null ? score.toFixed(1) : '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Remarks */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm rounded-3 bg-white h-100">
              <div className="p-3 border-bottom bg-light bg-opacity-50">
                <h6 className="fw-bold mb-0">Observations & Remarks</h6>
              </div>
              <Card.Body className="p-4">
                {isJury ? (
                  <Form.Group>
                    <Form.Control 
                      as="textarea" 
                      rows={6} 
                      placeholder="Write constructive observations for the candidate..."
                      className="bg-light border-0 shadow-none rounded-3 p-3 small fw-medium"
                      value={tempComment}
                      onChange={(e) => setTempComment(e.target.value)}
                    />
                    <div className="mt-3 text-end">
                      <Button variant="outline-primary" size="sm" className="rounded-pill px-4 fw-bold" onClick={() => submitEvaluation(tempComment)}>
                        Save Observations
                      </Button>
                    </div>
                  </Form.Group>
                ) : (
                  juryComment ? (
                    <div className="p-4 rounded-3 bg-light border-start border-4 border-primary">
                      <p className="text-dark small fw-medium mb-0" style={{ lineHeight: '1.7' }}>
                        "{juryComment}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock size={40} className="text-muted opacity-25 mb-2" />
                      <p className="text-muted small mb-0">Jury observations have not been published yet.</p>
                    </div>
                  )
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Policy */}
          <Col lg={5}>
            <Card className="border-0 shadow-sm rounded-3 bg-primary text-white h-100 p-4 position-relative overflow-hidden">
              <div className="position-absolute top-0 end-0 p-3 opacity-10"><HelpCircle size={80} /></div>
              <h6 className="fw-bold mb-4">Grading Policy</h6>
              <div className="d-flex flex-column gap-3 mb-4">
                {[
                  { range: '18 - 20', label: 'Excellent - Outstanding work' },
                  { range: '15 - 17', label: 'Very Good - Solid performance' },
                  { range: '12 - 14', label: 'Good - Standard requirements met' },
                ].map((item, i) => (
                  <div key={i} className="d-flex align-items-center gap-3">
                    <Badge bg="white" text="primary" className="rounded-pill px-3 py-1 fw-bold">{item.range}</Badge>
                    <span className="extra-small opacity-90 fw-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 d-flex gap-3">
                <AlertCircle size={18} className="flex-shrink-0" />
                <p className="extra-small mb-0 opacity-75">All scores are finalized after the oral defense validation. For queries, contact academic affairs.</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EvaluationPage;
