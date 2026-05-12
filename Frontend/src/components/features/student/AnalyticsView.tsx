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
        <Card className="sd-card-professional border-0 h-100">
          <div className="sd-card-header-clean">
            <h5>Engagement & Performance</h5>
          </div>
          <Card.Body>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <Card className="sd-card-professional border-0 h-100 bg-navy text-white">
          <Card.Body className="p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold text-uppercase opacity-50 small tracking-widest">Confidence Score</h6>
                <h1 className="display-4 fw-bold mb-0 mt-2">98.2</h1>
              </div>
              <div className="p-3 bg-white bg-opacity-10 rounded-lg text-success">
                <Target size={28} />
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-success">
              <div className="d-flex align-items-center gap-2 small">
                <Target size={18} />
                <span className="fw-bold">Goal: Highest Distinction</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between small mb-2">
                <span>Goal Progression</span>
                <span className="fw-bold">Excellent</span>
              </div>
              <ProgressBar now={90} variant="info" style={{ height: '8px' }} className="bg-white bg-opacity-10 rounded-pill" />
              <p className="extra-small fw-bold mt-3 mb-0 text-center opacity-75">
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
