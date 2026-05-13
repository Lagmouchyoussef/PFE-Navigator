import React from 'react';
import { Badge } from 'react-bootstrap';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactElement;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, color, trend, onClick }) => {
  return (
    <div 
      className={`glass-card p-4 h-100 border-start border-4 border-${color} transition-all`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
      }}
      onMouseEnter={e => {
        if (onClick) e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        if (onClick) e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className={`p-3 rounded-3 bg-${color}-soft text-${color}`}>
          {React.cloneElement(icon as React.ReactElement<{ size?: number }>, { size: 24 })}
        </div>
        {trend && (
          <Badge className={`bg-${color}-soft text-${color} border border-${color} border-opacity-10 fw-bold extra-small px-2 py-1`}>
            {trend}
          </Badge>
        )}
      </div>
      <div className="extra-small fw-bold text-muted text-uppercase mb-1">{label}</div>
      <h3 className="fw-bold mb-0 text-navy">{value}</h3>
    </div>
  );
};

export default StatCard;
