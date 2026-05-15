import React from 'react';
import { Card, Tooltip as BsTooltip } from 'react-bootstrap';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip 
} from 'recharts';

import { useApp } from '../../../context/AppContext';

const StatusDistribution: React.FC = () => {
  const { students } = useApp();
  
  const statusCounts = {
    'Validated': students.filter((s: any) => s.status === 'Validated').length,
    'In Progress': students.filter((s: any) => s.status === 'In Progress').length,
    'Rejected': students.filter((s: any) => s.status === 'Rejected').length,
    'Pending': students.filter((s: any) => s.status === 'Pending').length,
  };

  const total = students.length || 1;

  const data = [
    { name: 'Validated', value: statusCounts['Validated'], color: 'var(--color-success)' },
    { name: 'In Progress', value: statusCounts['In Progress'], color: 'var(--color-primary)' },
    { name: 'Rejected', value: statusCounts['Rejected'], color: 'var(--color-danger)' },
    { name: 'Pending', value: statusCounts['Pending'], color: 'var(--color-warning)' },
  ];

  return (
    <Card className="sv-card-premium border-0">
      <div className="sv-card-header">
        <h5 className="sv-card-title">Project Status</h5>
      </div>
      <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie 
              data={data} 
              innerRadius={70} 
              outerRadius={90} 
              paddingAngle={5} 
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="position-absolute text-center">
          <div className="h3 fw-black mb-0 text-navy">{students.length}</div>
          <div className="extra-small text-muted fw-bold uppercase">Projects</div>
        </div>
      </div>
      <div className="mt-4">
        {data.map((item, i) => (
          <div key={i} className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center gap-2 extra-small fw-bold" style={{ color: item.color }}>
              <div className="dot" style={{ backgroundColor: item.color, width: '10px', height: '10px', borderRadius: '50%' }}></div>
              {item.name}
            </div>
            <span className="extra-small text-muted fw-black">{Math.round((item.value / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatusDistribution;
