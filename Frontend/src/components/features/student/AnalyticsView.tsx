import React from 'react';
import { Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { Target } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const barData = [
  { name: 'Jan', score: 65 }, { name: 'Feb', score: 78 },
  { name: 'Mar', score: 82 }, { name: 'Apr', score: 90 },
];

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
              <ResponsiveContainer width="100%" height="100%">
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
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <Card className="glass-card border-0 h-100 bg-navy text-white border-0 shadow-sm overflow-hidden">
          <Card.Body className="p-4 d-flex flex-column justify-content-between position-relative" style={{ zIndex: 2 }}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold text-uppercase opacity-50 extra-small tracking-widest">Confidence Score</h6>
                <h1 className="display-4 fw-bold mb-0 mt-2">98.2</h1>
              </div>
              <div className="p-3 bg-white bg-opacity-10 rounded-4 text-success shadow-sm">
                <Target size={28} />
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-4 bg-white bg-opacity-5 border border-white border-opacity-10 text-success shadow-sm">
              <div className="d-flex align-items-center gap-2 extra-small">
                <Target size={18} />
                <span className="fw-bold">Goal: Highest Distinction</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between extra-small fw-bold mb-2">
                <span className="opacity-75">Goal Progression</span>
                <span className="text-success">Excellent</span>
              </div>
              <ProgressBar now={90} variant="success" style={{ height: '8px' }} className="bg-white bg-opacity-10 rounded-pill border-0" />
              <p className="extra-small fw-bold mt-3 mb-0 text-center opacity-50">
                Based on submission punctuality and feedback.
              </p>
            </div>
          </Card.Body>
          {/* Decorative Background Element */}
          <div className="position-absolute bottom-0 end-0 opacity-10 translate-middle-x translate-middle-y" style={{ zIndex: 1 }}>
             <Target size={200} />
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsView;
