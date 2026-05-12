import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string | false;
  badge?: number | null;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center gap-3 text-decoration-none`}
    >
      <div className={`d-flex align-items-center justify-content-center ${isActive ? 'text-navy' : 'text-inherit'}`}>
        {icon}
      </div>
      {label && <span className="flex-grow-1">{label}</span>}
      {badge && (
        <span className="badge rounded-pill bg-danger extra-small px-2">
          {badge}
        </span>
      )}
    </Link>
  );
};

export default SidebarLink;
