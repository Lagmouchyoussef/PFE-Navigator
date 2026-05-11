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
            <h2 className="fw-bold text-dark mb-1">Centre de Notifications</h2>
            <p className="text-muted small mb-0">Restez informé de toutes les activités administratives importantes.</p>
          </motion.div>
          
          <div className="d-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm" style={{ minWidth: '300px' }}>
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
                className="nt-stat-card bg-white p-4 rounded-4 shadow-sm border"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="h3 fw-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="extra-small fw-bold text-muted text-uppercase tracking-wider">{s.label}</div>
                  </div>
                  <div className="p-3 rounded-4 bg-light" style={{ color: s.color }}>
                    {s.icon}
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Notifications List */}
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-dark mb-0">Activités Récentes</h5>
              <Button 
                variant="link" 
                className="text-primary fw-bold text-decoration-none small"
                onClick={() => alert("Toutes les notifications ont été marquées comme lues.")}
              >
                Tout marquer comme lu
              </Button>
            </div>
 
            <div className="nt-feed d-flex flex-column gap-3">
              {NOTIFICATIONS.map((n, i) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`nt-card bg-white p-4 rounded-4 shadow-sm border position-relative d-flex align-items-center gap-4 ${n.unread ? 'border-primary border-opacity-25' : 'opacity-75'}`}
                >
                  <div className={`nt-icon-box p-3 rounded-circle bg-light text-${n.color}`}>
                    {React.cloneElement(n.icon, { size: 24 })}
                  </div>
                  <div className="nt-content flex-grow-1 pe-5">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="fw-bold text-dark">{n.title}</div>
                      <div className="extra-small text-muted fw-bold d-flex align-items-center gap-1">
                        <Clock size={12} /> {n.time}
                      </div>
                    </div>
                    <div className="small text-muted lh-base">{n.desc}</div>
                  </div>
                  
                  <div className="nt-options-menu position-absolute top-50 end-0 translate-middle-y me-3">
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                        <MoreVertical size={20} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow-lg border-0 rounded-3 extra-small">
                        <Dropdown.Item className="fw-bold">Voir les détails</Dropdown.Item>
                        <Dropdown.Item>Marquer comme lu</Dropdown.Item>
                        <Dropdown.Item>Archiver</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  
                  {n.unread && <div className="nt-unread-dot position-absolute start-0 top-50 translate-middle-y ms-2 bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                </motion.div>
              ))}
            </div>
 
            <Button 
              variant="outline-primary" 
              className="w-100 mt-4 py-3 fw-bold rounded-4 border-2 shadow-sm bg-white"
              onClick={() => alert("Chargement des notifications archivées...")}
            >
              Voir les notifications archivées
            </Button>
          </Col>
        </Row>
      </Container>

      <style>{`
        .admin-notifications-pro-layout {
          background-color: #f8fafc;
          min-height: calc(100vh - 80px);
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .nt-stat-card {
          transition: transform 0.2s ease;
        }
        .nt-stat-card:hover {
          transform: translateY(-5px);
        }
        .nt-card {
          transition: all 0.2s ease;
        }
        .nt-card:hover {
          transform: translateX(5px);
          border-color: #2563eb !important;
        }
        .nt-card.unread {
          background-color: #ffffff !important;
        }
        .extra-small { font-size: 0.75rem; }
        .text-primary { color: #2563eb !important; }
        .no-caret::after { display: none; }
      `}</style>
    </div>
  );
};

export default AdminNotifications;
