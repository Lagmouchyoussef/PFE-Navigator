import React from 'react';
import { Card, Tooltip as BsTooltip } from 'react-bootstrap';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

const STATUS_DISTRIBUTION = [
  { name: 'Validated', value: 45, color: 'var(--color-success)' },
  { name: 'In Progress', value: 35, color: 'var(--color-primary)' },
  { name: 'Rejected', value: 10, color: 'var(--color-danger)' },
  { name: 'Pending', value: 10, color: 'var(--color-warning)' },
];

const StatusDistribution: React.FC = () => (
  <Card className="sv-card-premium border-0">
    <div className="sv-card-header">
      <h5 className="sv-card-title">Project Status</h5>
    </div>
    <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={STATUS_DISTRIBUTION} 
            innerRadius={70} 
            outerRadius={90} 
            paddingAngle={5} 
            dataKey="value"
          >
            {STATUS_DISTRIBUTION.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="position-absolute text-center">
        <div className="h3 fw-black mb-0 text-navy">24</div>
        <div className="extra-small text-muted fw-bold uppercase">Projects</div>
      </div>
    </div>
    <div className="mt-4">
      {STATUS_DISTRIBUTION.map((item, i) => (
        <div key={i} className="d-flex justify-content-between align-items-center mb-2">
          <div className="d-flex align-items-center gap-2 extra-small fw-bold">
            <div className="dot" style={{ backgroundColor: item.color, width: '10px', height: '10px', borderRadius: '50%' }}></div>
            {item.name}
          </div>
          <span className="extra-small text-muted fw-black">{item.value}%</span>
        </div>
      ))}
    </div>
  </Card>
);

export default StatusDistribution;
