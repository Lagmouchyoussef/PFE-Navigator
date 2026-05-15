import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const MONTHLY_PERFORMANCE: any[] = [];

const PerformanceChart: React.FC = () => (
  <Card className="sv-card-premium border-0">
    <div className="sv-card-header">
      <div>
        <h5 className="sv-card-title">Performance Evolution</h5>
        <p className="extra-small text-muted mb-0">Average grades and project completion rates per month</p>
      </div>
      <div className="d-flex gap-2">
        <Badge bg="primary" className="bg-opacity-10 text-primary border-0 px-3 py-2 rounded-pill">Monthly View</Badge>
      </div>
    </div>
    <div style={{ height: '350px', width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={MONTHLY_PERFORMANCE}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="var(--color-primary)" 
            strokeWidth={4} 
            dot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 2, stroke: 'var(--color-surface)' }}
            activeDot={{ r: 8, strokeWidth: 0 }}
            name="Avg Grade"
          />
          <Line 
            type="monotone" 
            dataKey="completion" 
            stroke="var(--color-success)" 
            strokeWidth={4} 
            strokeDasharray="8 5"
            dot={false}
            name="Completion %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </Card>
);

export default PerformanceChart;
