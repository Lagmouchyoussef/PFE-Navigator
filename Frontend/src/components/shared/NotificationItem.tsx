import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Bell, MoreVertical, Trash2, CheckCircle } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationItemProps {
  notif: Notification;
  onClick: () => void;
  onMarkRead: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

const NOTIF_COLORS: Record<string, string> = {
  approved: 'success',
  rejected: 'danger',
  grade:    'primary',
  defense:  'warning',
  message:  'info',
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notif, onClick, onMarkRead, onDelete }) => (
  <div
    className={`notif-item px-3 py-3 border-bottom-dashed-light d-flex gap-3 align-items-start position-relative transition-all hover-bg-surface-alt ${!notif.read ? 'notif-unread' : ''}`}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <div
      className={`p-2 rounded-circle bg-${NOTIF_COLORS[notif.type] || 'secondary'} bg-opacity-10 text-${NOTIF_COLORS[notif.type] || 'secondary'} mt-1 flex-shrink-0`}
    >
      <Bell size={14} />
    </div>
    <div className="flex-grow-1 overflow-hidden text-decoration-none">
      <div className="extra-small text-navy text-truncate mb-1 fw-bold">{notif.text}</div>
      <div className="extra-small text-muted fw-bold opacity-75">
        {new Date(notif.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
    
    <div className="d-flex flex-column align-items-end gap-2 ms-2">
      {!notif.read && (
        <span className="bg-primary rounded-circle mt-1" style={{ width: '6px', height: '6px' }} />
      )}
      <Dropdown align="end" onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
        <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none hover-bg-light rounded-circle">
          <MoreVertical size={14} />
        </Dropdown.Toggle>
        <Dropdown.Menu className="border-0 shadow-lg extra-small py-1">
          {!notif.read && (
            <Dropdown.Item className="fw-bold py-2" onClick={onMarkRead}>
              <CheckCircle size={12} className="me-2 text-success" /> Lu
            </Dropdown.Item>
          )}
          <Dropdown.Item className="fw-bold py-2 text-danger" onClick={onDelete}>
            <Trash2 size={12} className="me-2" /> Supprimer
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  </div>
);

export default NotificationItem;
