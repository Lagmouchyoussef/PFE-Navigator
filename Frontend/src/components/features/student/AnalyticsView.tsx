import React from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { Target } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const barData: any[] = [];

const AnalyticsView: React.FC = () => {
  return (
    <Row className="g-4 mb-4">
      <Col lg={7}>
        <Card className="glass-card border-0 h-100 border shadow-sm">
          <div className="p-4 border-bottom bg-white">
            <h5 className="fw-bold mb-0 text-navy">Engagement & Performance</h5>
          </div>
          <Card.Body className="p-4">
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 600 }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
              {barData.length === 0 && (
                <div className="position-absolute top-50 start-50 translate-middle text-muted extra-small fw-bold opacity-50">
                  No data available yet
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <Card className="glass-card border-0 h-100 border shadow-sm overflow-hidden">
          <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold text-uppercase text-muted extra-small tracking-widest">Confidence Score</h6>
                <h1 className="display-4 fw-bold mb-0 mt-2 text-primary">0.0</h1>
              </div>
              <div className="p-3 bg-primary-soft rounded-4 text-primary shadow-sm">
                <Target size={28} />
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-4 bg-primary-soft border border-primary text-primary shadow-sm">
              <div className="d-flex align-items-center gap-2 extra-small">
                <Target size={18} />
                <span className="fw-bold">Goal: Initialization</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between extra-small fw-bold mb-2">
                <span className="text-muted">Goal Progression</span>
                <span className="text-primary">Started</span>
              </div>
              <ProgressBar now={0} variant="primary" style={{ height: '8px' }} className="bg-surface-alt rounded-pill border-0" />
              <p className="extra-small fw-bold mt-3 mb-0 text-center text-muted">
                Based on submission punctuality and feedback.
              </p>
            </div>
          </Card.Body>

        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsView;
