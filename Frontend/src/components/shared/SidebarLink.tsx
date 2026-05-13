import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string | false;
  badge?: number | null;
  iconClassName?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, badge, iconClassName }) => {
  const isActive = Boolean(useMatch({ path: to, end: true }));

  return (
    <NavLink
      to={to}
      end
      title={typeof label === 'string' ? label : undefined}
      className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center gap-3 text-decoration-none`}
    >
      <div className={`d-flex align-items-center justify-content-center ${isActive ? 'text-navy' : 'text-inherit'} ${iconClassName || ''}`}>
        {icon}
      </div>
      {label && <span className="flex-grow-1">{label}</span>}
      {badge && (
        <span className="badge rounded-pill bg-danger extra-small px-2">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarLink;
