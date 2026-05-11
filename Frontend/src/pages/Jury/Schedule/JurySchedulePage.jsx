import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, 
  ChevronLeft, ChevronRight, Download, Info, Video, MoreVertical
} from 'lucide-react';
import { Dropdown } from 'react-bootstrap';
import './JurySchedulePage.css';

const SCHEDULE_LIST = [
  { 
    day: '05', month: '05/26', 
    student: 'Ahmed Benali', 
    title: 'Système de Gestion Intelligent basé sur l\'IA', 
    time: '09:00', room: 'A-204', jurys: 3 
  },
  { 
    day: '05', month: '05/26', 
    student: 'Sara Kamali', 
    title: 'Vérification de Certificats par Blockchain', 
    time: '11:00', room: 'B-101', jurys: 3 
  },
  { 
    day: '06', month: '05/26', 
    student: 'Fatima Zahra', 
    title: 'Application Mobile pour Inscription aux Cours', 
    time: '14:00', room: 'A-204', jurys: 3 
  },
  { 
    day: '07', month: '05/26', 
    student: 'Youssef Idrissi', 
    title: 'Modèles de Prédiction Machine Learning', 
    time: '16:00', room: 'C-305', jurys: 3 
  }
];

const JurySchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState(12);

  // Generate calendar days for May 2026 (starts on Friday 01)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="sc-page-layout">
      <Container fluid className="px-0">
        
        {/* Header */}
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="mb-1 text-navy fw-black">Calendrier des Soutenances</h1>
            <p className="fw-medium text-muted">Planifiez et gérez les soutenances de projets académiques</p>
          </motion.div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={4}>
            <StatCard label="Soutenances à venir" value="8" color="#0046ad" />
          </Col>
          <Col lg={4}>
            <StatCard label="Soutenances ce mois" value="15" color="#10b981" />
          </Col>
          <Col lg={4}>
            <StatCard label="Temps moyen par soutenance" value="5.5h" color="#f59e0b" />
          </Col>
        </Row>

        <Row className="g-5">
          {/* Calendar Column */}
          <Col lg={7}>
            <div className="sc-calendar-container shadow-sm">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="sc-cal-header mb-0">Mai 2026</h3>
                <div className="d-flex gap-2">
                  <Button variant="light" className="rounded-circle p-2 shadow-none" onClick={() => alert("Mois précédent (Simulé)")}><ChevronLeft size={20} /></Button>
                  <Button variant="light" className="rounded-circle p-2 shadow-none" onClick={() => alert("Mois suivant (Simulé)")}><ChevronRight size={20} /></Button>
                </div>
              </div>

              <div className="sc-cal-grid">
                {weekDays.map(d => <div key={d} className="sc-day-label">{d}</div>)}
                
                {/* Offset for May 2026 (Starts on Friday) */}
                <div /><div /><div /><div />

                {days.map(d => (
                  <div 
                    key={d} 
                    className={`sc-day-cell ${selectedDay === d ? 'sc-day-active' : ''} ${[5, 9, 12, 18, 25].includes(d) ? 'sc-day-event' : ''}`}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* List Column */}
          <Col lg={5}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-navy mb-0">Prochaines Soutenances</h4>
              <Badge bg="primary" className="bg-opacity-10 text-primary px-3 py-2 rounded-pill small">4 Prévues</Badge>
            </div>

            <div className="sc-defense-list">
              {SCHEDULE_LIST.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="sc-defense-card shadow-sm"
                >
                  <div className="sc-date-badge">
                    <div className="sc-day-num">{item.day}</div>
                    <div className="sc-month-small">{item.month}</div>
                  </div>
                  
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="fw-black text-navy mb-0 text-truncate">{item.student}</div>
                    <div className="extra-small text-muted text-truncate mb-2">{item.title}</div>
                    
                    <div className="d-flex gap-3 flex-wrap">
                      <div className="sc-info-item"><Clock size={14} className="text-primary" /> {item.time}</div>
                      <div className="sc-info-item"><MapPin size={14} className="text-primary" /> {item.room}</div>
                      <div className="sc-info-item"><Users size={14} className="text-primary" /> {item.jurys} jurys</div>
                    </div>
                  </div>
                  
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="p-0 text-muted shadow-none border-0 no-caret">
                      <MoreVertical size={18} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="shadow-sm border-0 rounded-3 extra-small">
                      <Dropdown.Item>Détails de la session</Dropdown.Item>
                      <Dropdown.Item>Contacter le candidat</Dropdown.Item>
                      <Dropdown.Item>Modifier l'horaire</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item className="text-danger">Annuler la session</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </motion.div>
              ))}
            </div>
            
            <Button 
              variant="outline-primary" 
              className="w-100 mt-4 py-3 fw-bold rounded-4 border-2"
              onClick={() => alert("Génération du planning mensuel en cours...")}
            >
              <Download size={18} className="me-2" /> Exporter le planning mensuel
            </Button>
          </Col>
        </Row>

      </Container>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <Card className="sc-stat-card shadow-sm border-0">
    <div className="sc-stat-val" style={{ color }}>{value}</div>
    <div className="sc-stat-label">{label}</div>
  </Card>
);

export default JurySchedulePage;

