import React from 'react';
import { Badge } from 'react-bootstrap';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactElement;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend }) => {
  return (
    <div className={`glass-card p-4 h-100 border-start border-4 border-${color}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 text-${color}`}>
          {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
        </div>
        {trend && (
          <Badge bg={color} className={`bg-opacity-10 text-${color} border border-${color} border-opacity-25 fw-bold extra-small`}>
            {trend}
          </Badge>
        )}
      </div>
      <div className="extra-small fw-bold text-muted text-uppercase mb-1 tracking-wider">{label}</div>
      <h3 className="fw-bold mb-0">{value}</h3>
    </div>
  );
};

export default StatCard;
