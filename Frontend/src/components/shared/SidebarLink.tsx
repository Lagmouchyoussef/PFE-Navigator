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
      className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center text-decoration-none`}
    >
      <div className={`sidebar-icon-wrapper ${iconClassName || ''}`}>
        {icon}
      </div>
      {label && <span className="label-text">{label}</span>}
      {badge && (
        <span className="badge rounded-pill bg-danger extra-small px-2">
          {badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarLink;
