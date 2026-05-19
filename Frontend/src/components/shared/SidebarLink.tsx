import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string | false;
  badge?: number | null;
  iconClassName?: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, badge, iconClassName }) => {
  return (
    <NavLink
      to={to}
      end
      title={typeof label === 'string' ? label : undefined}
      className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''} d-flex align-items-center text-decoration-none`}
    >
      <span className={`sidebar-item-icon ${iconClassName || ''}`}>{icon}</span>
      {label && <span className="label-text">{label}</span>}
      {badge ? (
        <span className="badge rounded-pill bg-danger extra-small px-2 ms-auto">
          {badge}
        </span>
      ) : null}
    </NavLink>
  );
};

export default SidebarLink;
