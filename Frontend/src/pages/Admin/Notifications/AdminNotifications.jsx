import React from 'react';
import { 
  Bell, CheckCircle2, Clock, 
  Archive, UserPlus, Info, 
  ShieldAlert, MoreVertical, Trash2, Search, Activity, RefreshCcw, AlertCircle, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Row, Col, Card, Button, Badge, Form, Dropdown } from 'react-bootstrap';

const STATS = [
  { label: 'Non lues', value: '2', color: '#2563eb', icon: <Bell size={24} /> },
  { label: 'Total notifications', value: '7', color: '#475569', icon: <Activity size={24} /> },
  { label: 'Cette semaine', value: '24', color: '#10b981', icon: <RefreshCcw size={24} /> },
  { label: 'Importantes', value: '3', color: '#ef4444', icon: <AlertCircle size={24} /> }
];

const NOTIFICATIONS = [
  { 
    id: 1, 
    title: 'Rappel Jury #15', 
    desc: 'Le jury Innovation Tech commence demain à 9h00. Veuillez préparer vos évaluations.', 
    time: 'Il y a 30 min', 
    type: 'reminder', 
    icon: <Clock />,
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

const AdminNotifications = () => {
  return (
    <div className="admin-notifications-pro-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="mb-5 d-flex justify-content-between align-items-center flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1">Centre de Notifications</h2>
            <p className="text-muted small mb-0">Restez informé de toutes les activités administratives importantes.</p>
          </motion.div>
          
          <div className="d-flex align-items-center px-4 py-2 rounded-pill shadow-sm nt-search-box">
            <Search size={18} className="text-muted me-2" />
            <Form.Control 
              type="text" 
              placeholder="Rechercher une notification..." 
              className="border-0 bg-transparent shadow-none extra-small fw-bold p-0"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {STATS.map((s, i) => (
            <Col key={i} lg={3} md={6}>
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="nt-stat-card p-4 rounded-4 shadow-sm border"
              >
                <div className="d-flex align-items-center gap-3">
                  <div className="p-3 rounded-3 bg-primary bg-opacity-10 text-primary">
                    {s.icon}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{s.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{s.label}</span>
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Feed Actions */}
        <div className="d-flex gap-2 mb-4">
          <Button variant="primary" className="fw-bold small rounded-pill px-4 shadow-sm border-0" style={{ backgroundColor: '#2563eb' }}>Toutes</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Non lues</Button>
          <Button variant="outline-secondary" className="fw-bold small rounded-pill px-4 border">Archives</Button>
          <Button variant="link" className="ms-auto text-muted text-decoration-none extra-small fw-bold border-0 bg-transparent">Tout marquer comme lu</Button>
        </div>

        {/* Main Feed */}
        <div className="nt-feed-container shadow-sm border rounded-4 overflow-hidden">
          {NOTIFICATIONS.map((n, idx) => (
            <motion.div 
              key={n.id}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: idx * 0.05 }}
              className={`nt-item p-4 d-flex gap-4 align-items-start transition-all cursor-pointer ${n.unread ? 'nt-unread' : ''}`}
            >
              <div className={`p-3 rounded-circle flex-shrink-0 bg-${n.color} bg-opacity-10 text-${n.color}`}>
                {React.cloneElement(n.icon, { size: 22 })}
              </div>
              
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="fw-bold mb-1 d-flex align-items-center gap-2">
                      {n.title}
                      {n.unread && <Badge bg="primary" className="p-1 rounded-circle border border-2 border-white"><span className="visually-hidden">New</span></Badge>}
                    </h6>
                    <p className="small text-muted mb-0 lh-base">{n.desc}</p>
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
        .admin-notifications-pro-layout {
          min-height: calc(100vh - 80px);
          color: var(--text-primary);
        }
        .nt-search-box {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          min-width: 300px;
        }
        .nt-search-box input {
          color: var(--text-primary) !important;
        }
        .nt-stat-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .nt-feed-container {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
        }
        .nt-item {
          border-bottom: 1px solid var(--border);
        }
        .nt-item:last-child {
          border-bottom: none;
        }
        .nt-item:hover {
          background-color: rgba(var(--primary-rgb), 0.03);
        }
        .nt-unread {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        h2, h4, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
