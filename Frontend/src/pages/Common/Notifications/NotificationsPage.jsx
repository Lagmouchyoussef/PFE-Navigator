import React from 'react';
import { Container, Row, Col, Badge, Card, Button, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Bell, CheckCircle, Mail, AlertCircle, Calendar, 
  Settings, Clock, MessageSquare, Activity, Shield, RefreshCcw, Search, MoreVertical, X
} from 'lucide-react';

const STATS = [
  { label: 'Non lues', value: '2', color: 'primary', icon: <Bell size={24} /> },
  { label: 'Total', value: '7', color: 'info', icon: <Activity size={24} /> },
  { label: 'Semaine', value: '24', color: 'success', icon: <RefreshCcw size={24} /> },
  { label: 'Urgentes', value: '3', color: 'danger', icon: <AlertCircle size={24} /> }
];

const NOTIFICATIONS_DATA = [
  { id: 1, title: 'Nouvelle évaluation assignée', time: 'Il y a 2 heures', desc: 'Le projet "Blockchain Certificate Verification" nécessite votre évaluation', type: 'eval', unread: true, icon: <Activity size={20} />, color: 'primary' },
  { id: 2, title: 'Soutenance programmée', time: 'Il y a 5 heures', desc: 'Soutenance prévue le 5 Mai à 09:00 en salle A-204', type: 'sched', unread: true, icon: <Calendar size={20} />, color: 'info' },
  { id: 3, title: 'Nouveau message', time: 'Hier', desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation', type: 'msg', unread: false, icon: <MessageSquare size={20} />, color: 'success' },
  { id: 4, title: 'Mise à jour du système', time: 'Il y a 2 jours', desc: 'Nouvelles fonctionnalités d\'analyse prédictive disponibles', type: 'system', unread: false, icon: <RefreshCcw size={20} />, color: 'warning' },
  { id: 5, title: 'Évaluation complétée', time: 'Il y a 3 jours', desc: 'Votre évaluation pour Mohamed Alaoui a été soumise avec succès', type: 'eval', unread: false, icon: <CheckCircle size={20} />, color: 'success' },
  { id: 6, title: 'Date limite proche', time: 'Il y a 3 jours', desc: 'L\'évaluation de Fatima Zahra doit être complétée avant le 7 Mai', type: 'urgent', unread: false, icon: <AlertCircle size={20} />, color: 'danger' },
];

const NotificationsPage = () => {
  return (
    <div className="notifications-modern-layout py-4">
      <Container fluid className="px-4">
        
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Centre de Notifications</h2>
            <p className="text-muted small mb-0">Restez informé de toutes les activités importantes de votre plateforme.</p>
          </div>
          <div className="d-flex gap-2">
            <InputGroup size="sm" className="bg-surface rounded-pill border px-3 shadow-none" style={{ width: '300px' }}>
              <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
              <Form.Control 
                placeholder="Rechercher une notification..." 
                className="bg-transparent border-0 shadow-none py-2 small fw-bold text-primary-custom"
              />
            </InputGroup>
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Settings size={18} /> Gérer
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {STATS.map((stat, i) => (
            <Col key={i} sm={6} lg={3}>
              <div className={`notif-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-3 rounded-3 bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    {React.cloneElement(stat.icon, { size: 24 })}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-0">{stat.value}</h4>
                    <span className="extra-small text-muted fw-bold text-uppercase">{stat.label}</span>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Notifications List */}
        <div className="notif-glass-card rounded-4 overflow-hidden shadow-sm mb-5">
          <div className="p-4 border-bottom bg-surface-alt d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0">Récentes</h5>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none">Tout marquer comme lu</Button>
          </div>
          <div className="d-flex flex-column">
            {NOTIFICATIONS_DATA.map((notif) => (
              <div key={notif.id} className={`p-4 d-flex gap-4 border-bottom transition-all ${notif.unread ? 'bg-primary bg-opacity-5' : 'hover-bg-surface'}`}>
                <div className={`p-3 rounded-4 bg-${notif.color} bg-opacity-10 text-${notif.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                  {notif.icon}
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-start mb-1">
                    <h6 className={`mb-0 small ${notif.unread ? 'fw-bold' : 'fw-semibold opacity-75'}`}>{notif.title}</h6>
                    <span className="extra-small text-muted fw-bold" style={{ whiteSpace: 'nowrap' }}>{notif.time}</span>
                  </div>
                  <p className="extra-small text-muted mb-0 lh-base">{notif.desc}</p>
                </div>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg rounded-3 extra-small bg-surface">
                    <Dropdown.Item className="fw-bold">Marquer comme lu</Dropdown.Item>
                    <Dropdown.Item className="fw-bold text-danger">Supprimer</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ))}
          </div>
          <div className="p-3 text-center bg-surface-alt">
            <Button variant="link" className="extra-small fw-bold text-primary text-decoration-none">Afficher plus de notifications</Button>
          </div>
        </div>
      </Container>

      <style>{`
        .notifications-modern-layout {
          color: var(--text-primary);
        }
        .notif-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface {
          background-color: var(--surface) !important;
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        .border-danger { border-left-color: #ef4444 !important; }
        .border-info { border-left-color: #0ea5e9 !important; }
        
        h2, h4, h5, h6, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
        .text-primary-custom {
          color: var(--text-primary) !important;
        }
        .border-bottom {
          border-color: var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
