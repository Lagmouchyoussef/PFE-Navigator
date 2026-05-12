import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Bell } from 'lucide-react';
import { Notification } from '../../types';

interface NotificationItemProps {
  notif: Notification;
  onClick: () => void;
}

const NOTIF_COLORS: Record<string, string> = {
  approved: 'success',
  rejected: 'danger',
  grade:    'primary',
  defense:  'warning',
  message:  'info',
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notif, onClick }) => (
  <Dropdown.Item
    onClick={onClick}
    className={`notif-item px-3 py-3 border-bottom-dashed-light d-flex gap-3 align-items-start ${!notif.read ? 'notif-unread' : ''}`}
  >
    <div
      className={`p-2 rounded-circle bg-${NOTIF_COLORS[notif.type] || 'secondary'} bg-opacity-10 text-${NOTIF_COLORS[notif.type] || 'secondary'} mt-1 flex-shrink-0`}
    >
      <Bell size={14} />
    </div>
    <div className="flex-grow-1 overflow-hidden">
      <div className="extra-small text-muted text-truncate mb-1">{notif.text}</div>
      <div className="extra-small text-secondary-custom fw-medium">
        {new Date(notif.date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
    {!notif.read && (
      <span className="bg-primary rounded-circle flex-shrink-0" style={{ width: '8px', height: '8px', marginTop: '6px' }} />
    )}
  </Dropdown.Item>
);

export default NotificationItem;
