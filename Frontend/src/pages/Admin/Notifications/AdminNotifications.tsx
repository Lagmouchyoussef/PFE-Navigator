import React from 'react';
import { 
  Bell, CheckCircle2, 
  Archive, UserPlus, 
  ShieldAlert, MoreVertical, Trash2, Search, Activity, RefreshCcw, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, Badge, Form, Dropdown } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';

interface NotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: string;
  icon: React.ReactElement;
  color: string;
  unread: boolean;
}

const NOTIFICATIONS: NotificationItem[] = [
  { 
    id: 1, 
    title: 'Rappel Jury #15', 
    desc: 'Le jury Innovation Tech commence demain à 9h00. Veuillez préparer vos évaluations.', 
    time: 'Il y a 30 min', 
    type: 'reminder', 
    icon: <RefreshCcw />,
    color: 'warning',
    unread: true
  },
  { 
    id: 2, 
    title: 'Projet Alpha archivé', 
    desc: 'Le projet Alpha a été archivé avec succès après validation finale du jury.', 
    time: 'Il y a 2 heures', 
    type: 'success', 
    icon: <Archive />,
    color: 'success',
    unread: true
  },
  { 
    id: 3, 
    title: 'Nouveau membre ajouté', 
    desc: 'Lucas Petit a rejoint le groupe de participants pour le projet Gamma.', 
    time: 'Hier', 
    type: 'info', 
    icon: <UserPlus />,
    color: 'primary',
    unread: false
  },
  { 
    id: 4, 
    title: 'Mise à jour Système', 
    desc: 'Le système a été mis à jour vers la version 2.4.1. Nouvelles fonctionnalités de sécurité disponibles.', 
    time: 'Il y a 3 jours', 
    type: 'system', 
    icon: <ShieldAlert />,
    color: 'info',
    unread: false
  },
  { 
    id: 5, 
    title: 'Session Jury expirée', 
    desc: 'La session de jury du 10 Mai a expiré. Veuillez valider les notes finales.', 
    time: 'Il y a 4 jours', 
    type: 'urgent', 
    icon: <AlertCircle />,
    color: 'danger',
    unread: false
  }
];

const AdminNotifications: React.FC = () => {
  return (
    <div className="admin-notifications-pro-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="mb-5 d-flex justify-content-between align-items-center flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-gradient">Centre de Notifications</h2>
            <p className="text-muted small mb-0">Restez informé de toutes les activités administratives importantes.</p>
          </motion.div>
          
          <div className="d-flex align-items-center px-4 py-2 rounded-pill shadow-sm glass-card" style={{ minWidth: '300px' }}>
            <Search size={18} className="text-muted me-2" />
            <Form.Control 
              type="text" 
              placeholder="Rechercher une notification..." 
              className="border-0 bg-transparent shadow-none extra-small fw-bold p-0 text-navy"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Non lues" value="2" icon={<Bell />} color="primary" trend="Alert" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Total" value="7" icon={<Activity />} color="info" trend="Stats" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Cette semaine" value="24" icon={<RefreshCcw />} color="success" trend="Active" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Importantes" value="3" icon={<AlertCircle />} color="danger" trend="Urgent" />
          </Col>
        </Row>

        {/* Feed Actions */}
        <div className="d-flex gap-2 mb-4">
          <Button variant="primary" className="fw-bold small rounded-pill px-4 shadow-sm border-0 btn-premium">Toutes</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Non lues</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Archives</Button>
          <Button variant="link" className="ms-auto text-muted text-decoration-none extra-small fw-bold border-0 bg-transparent">Tout marquer comme lu</Button>
        </div>

        {/* Main Feed */}
        <div className="glass-card shadow-sm border rounded-4 overflow-hidden">
          {NOTIFICATIONS.map((n, idx) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: idx * 0.05 }}
              className={`nt-item p-4 d-flex gap-4 align-items-start transition-all cursor-pointer ${n.unread ? 'nt-unread' : ''}`}
            >
              <div className={`p-3 rounded-circle flex-shrink-0 bg-${n.color} bg-opacity-10 text-${n.color}`}>
                {React.cloneElement(n.icon as React.ReactElement<{ size?: number }>, { size: 22 })}
              </div>
              
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-1 d-flex align-items-center gap-2 text-navy">
                      {n.title}
                      {n.unread && <Badge bg="primary" className="p-1 rounded-circle border border-2 border-white"><span className="visually-hidden">New</span></Badge>}
                    </h6>
                    <p className="small text-muted mb-0 lh-base fw-bold opacity-75">{n.desc}</p>
                  </div>
                  <span className="extra-small text-muted fw-bold whitespace-nowrap">{n.time}</span>
                </div>
                
                <div className="d-flex gap-2 mt-3">
                  <Button variant="link" className="p-0 extra-small fw-bold text-primary text-decoration-none">Voir les détails</Button>
                  <Button variant="link" className="p-0 extra-small fw-bold text-muted text-decoration-none">Ignorer</Button>
                </div>
              </div>
              
              <Dropdown align="end">
                <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                  <Dropdown.Item className="small fw-bold"><CheckCircle2 size={14} className="me-2"/> Marquer comme lu</Dropdown.Item>
                  <Dropdown.Item className="small fw-bold"><Archive size={14} className="me-2"/> Archiver</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="small fw-bold text-danger"><Trash2 size={14} className="me-2"/> Supprimer</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-5">
          <Button variant="outline-primary" className="fw-bold px-5 py-2 rounded-pill border-2">Charger plus de notifications</Button>
        </div>
      </Container>
      <style>{`
        .nt-item {
          border-bottom: 1px solid var(--color-border);
        }
        .nt-item:last-child {
          border-bottom: none;
        }
        .nt-item:hover {
          background-color: var(--color-surface-alt);
        }
        .nt-unread {
          background-color: rgba(var(--color-primary-rgb), 0.05) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
