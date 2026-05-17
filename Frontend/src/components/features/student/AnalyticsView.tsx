import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { BarChart2, Target } from 'lucide-react';

const EmptyChart: React.FC<{ label: string }> = ({ label }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-center gap-3 text-center"
    style={{ height: '220px' }}
  >
    <div className="p-4 rounded-4 bg-surface-alt text-muted d-inline-flex">
      <BarChart2 size={36} strokeWidth={1.5} />
    </div>
    <div>
      <p className="small fw-bold text-navy mb-1">{label}</p>
      <p className="extra-small text-muted mb-0">Data will appear here once activity is recorded.</p>
    </div>
  </div>
);

const AnalyticsView: React.FC = () => {
  return (
    <Row className="g-4 mb-4">
      <Col lg={7}>
        <Card className="glass-card border-0 h-100 border shadow-sm">
          <div className="p-4 border-bottom bg-white">
            <h5 className="fw-bold mb-0 text-navy">Engagement &amp; Performance</h5>
          </div>
          <Card.Body className="p-4">
            <EmptyChart label="No performance data yet" />
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card className="glass-card border-0 h-100 border shadow-sm overflow-hidden">
          <Card.Body
            className="p-4 d-flex flex-column align-items-center justify-content-center gap-4 text-center"
            style={{ zIndex: 2 }}
          >
            <div className="p-4 bg-primary-soft rounded-4 text-primary shadow-sm">
              <Target size={36} strokeWidth={1.5} />
            </div>
            <div>
              <h6 className="fw-bold text-uppercase text-muted extra-small mb-2">Progression Score</h6>
              <p className="small fw-bold text-navy mb-0">
                No activity recorded yet.
              </p>
              <p className="extra-small text-muted mt-1 mb-0">
                Your score will be calculated based on submission punctuality and feedback received.
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsView;
