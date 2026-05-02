import React from 'react';
import { Container, Row, Col, Badge, Card, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Bell, CheckCircle, Mail, AlertCircle, Calendar, 
  Settings, Clock, MessageSquare, Activity, Shield, RefreshCcw, Search, MoreVertical
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import './NotificationsPage.css';

const STATS = [
  { label: 'Non lues', value: '2', color: '#0046ad', icon: <Bell size={24} /> },
  { label: 'Total notifications', value: '7', color: '#475569', icon: <Activity size={24} /> },
  { label: 'Cette semaine', value: '24', color: '#10b981', icon: <RefreshCcw size={24} /> },
  { label: 'Importantes', value: '3', color: '#ef4444', icon: <AlertCircle size={24} /> }
];

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: 'Nouvelle évaluation assignée',
    time: 'Il y a 2 heures',
    desc: 'Le projet de Sara Kamali "Blockchain Certificate Verification" nécessite votre évaluation',
    type: 'eval',
    unread: true,
    icon: <Activity size={20} />
  },
  {
    id: 2,
    title: 'Soutenance programmée',
    time: 'Il y a 5 heures',
    desc: 'Soutenance d\'Ahmed Benali prévue le 5 Mai à 09:00 en salle A-204',
    type: 'sched',
    unread: true,
    icon: <Calendar size={20} />
  },
  {
    id: 3,
    title: 'Nouveau message',
    time: 'Hier',
    desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation',
    type: 'msg',
    unread: false,
    icon: <MessageSquare size={20} />
  },
  {
    id: 4,
    title: 'Mise à jour du système',
    time: 'Il y a 2 jours',
    desc: 'Nouvelles fonctionnalités d\'analyse prédictive disponibles dans le tableau de bord',
    type: 'system',
    unread: false,
    icon: <RefreshCcw size={20} />
  },
  {
    id: 5,
    title: 'Évaluation complétée',
    time: 'Il y a 3 jours',
    desc: 'Votre évaluation pour Mohamed Alaoui a été soumise avec succès',
    type: 'eval',
    unread: false,
    icon: <CheckCircle size={20} />
  },
  {
    id: 6,
    title: 'Date limite proche',
    time: 'Il y a 3 jours',
    desc: 'L\'évaluation de Fatima Zahra doit être complétée avant le 7 Mai',
    type: 'urgent',
    unread: false,
    icon: <AlertCircle size={20} />
  },
  {
    id: 7,
    title: 'Paramètres modifiés',
    time: 'Il y a 1 semaine',
    desc: 'Vos préférences de notification ont été mises à jour',
    type: 'system',
    unread: false,
    icon: <Settings size={20} />
  }
];

const NotificationsPage = () => {
  return (
    <div className="nt-page-layout">
      <Container fluid className="px-0">
        
        {/* Header */}
        <header className="mb-5 d-flex justify-content-between align-items-center flex-wrap gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="mb-1 text-navy fw-black">Notifications</h1>
            <p className="fw-medium text-muted">Restez informé de toutes les activités importantes de votre plateforme PFE</p>
          </motion.div>
          
          <div className="nt-search-bar d-flex align-items-center px-3 py-2 bg-white border rounded-pill shadow-sm" style={{ minWidth: '300px' }}>
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
                className="nt-stat-card shadow-sm"
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="nt-stat-val" style={{ color: s.color }}>{s.value}</div>
                    <div className="nt-stat-label">{s.label}</div>
                  </div>
                  <div className="nt-stat-icon-wrap p-3 rounded-4 bg-light" style={{ color: s.color }}>
                    {s.icon}
                  </div>
                </div>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Notifications List */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold text-navy mb-0">Dernières Activités</h5>
              <Button variant="link" className="text-primary fw-bold text-decoration-none small">Tout marquer comme lu</Button>
            </div>

            <div className="nt-feed">
              {NOTIFICATIONS_DATA.map((n, i) => (
                <motion.div 
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`nt-card shadow-sm ${n.unread ? 'unread' : ''}`}
                >
                  <div className={`nt-icon-box bg-${n.type}`}>
                    {n.icon}
                  </div>
                  <div className="nt-content pe-5">
                    <div className="nt-title">{n.title}</div>
                    <div className="nt-time d-flex align-items-center gap-1">
                      <Clock size={12} /> {n.time}
                    </div>
                    <div className="nt-desc">{n.desc}</div>
                  </div>
                  
                  <div className="nt-options-menu">
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                        <MoreVertical size={18} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                        <Dropdown.Item className="fw-bold">Voir les détails</Dropdown.Item>
                        <Dropdown.Item>Marquer comme lu</Dropdown.Item>
                        <Dropdown.Item>Archiver</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-danger">Supprimer</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  
                  {n.unread && <div className="nt-unread-dot"></div>}
                </motion.div>
              ))}
            </div>

            <Button variant="outline-primary" className="w-100 mt-4 py-3 fw-bold rounded-4 border-2">
              Voir les notifications archivées
            </Button>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

export default NotificationsPage;
