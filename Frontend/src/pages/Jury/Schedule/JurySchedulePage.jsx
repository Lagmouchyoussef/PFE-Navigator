import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Dropdown
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, 
  ChevronLeft, ChevronRight, Download, Info, Video, MoreVertical, X
} from 'lucide-react';

const SCHEDULE_LIST = [
  { day: '05', month: '05/26', student: 'Ahmed Benali', title: 'Système de Gestion Intelligent basé sur l\'IA', time: '09:00', room: 'A-204', jurys: 3 },
  { day: '05', month: '05/26', student: 'Sara Kamali', title: 'Vérification de Certificats par Blockchain', time: '11:00', room: 'B-101', jurys: 3 },
  { day: '06', month: '05/26', student: 'Fatima Zahra', title: 'Application Mobile pour Inscription aux Cours', time: '14:00', room: 'A-204', jurys: 3 },
  { day: '07', month: '05/26', student: 'Youssef Idrissi', title: 'Modèles de Prédiction Machine Learning', time: '16:00', room: 'C-305', jurys: 3 }
];

const JurySchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState(12);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="schedule-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1">Calendrier des Soutenances</h2>
            <p className="text-muted small mb-0">Planifiez et gérez les soutenances de projets académiques.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Exporter Planning
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Soutenances à venir', value: '8', color: 'primary' },
            { label: 'Ce mois-ci', value: '15', color: 'success' },
            { label: 'Temps moyen', value: '5.5h', color: 'warning' },
          ].map((stat, i) => (
            <Col lg={4} key={i}>
              <div className={`schedule-glass-card p-4 rounded-4 shadow-sm border-start-4 border-${stat.color}`}>
                <h4 className="fw-bold mb-1">{stat.value}</h4>
                <div className="extra-small text-muted fw-bold text-uppercase">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col lg={7}>
            <div className="schedule-glass-card p-4 rounded-4 shadow-sm h-100">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h5 className="fw-bold mb-0">Mai 2026</h5>
                <div className="d-flex gap-2">
                  <Button variant="link" className="p-1 text-muted hover-bg-surface rounded-circle"><ChevronLeft size={20} /></Button>
                  <Button variant="link" className="p-1 text-muted hover-bg-surface rounded-circle"><ChevronRight size={20} /></Button>
                </div>
              </div>

              <div className="calendar-grid">
                {weekDays.map(d => <div key={d} className="calendar-day-label">{d}</div>)}
                <div /><div /><div /><div />
                {days.map(d => (
                  <div 
                    key={d} 
                    className={`calendar-day-cell ${selectedDay === d ? 'active' : ''} ${[5, 6, 7].includes(d) ? 'has-event' : ''}`}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </Col>

          <Col lg={5}>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <h5 className="fw-bold mb-0">Prochaines Soutenances</h5>
              <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small fw-bold px-3">4 Prévues</Badge>
            </div>

            <div className="d-flex flex-column gap-3">
              {SCHEDULE_LIST.map((item, i) => (
                <div key={i} className="schedule-glass-card p-3 rounded-4 shadow-sm hover-bg-surface transition-all border">
                  <div className="d-flex gap-3 align-items-center">
                    <div className="p-2 bg-primary bg-opacity-10 text-primary rounded-3 text-center" style={{ minWidth: '50px' }}>
                      <div className="fw-bold h5 mb-0">{item.day}</div>
                      <div className="extra-small opacity-75">MAI</div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="small fw-bold text-truncate">{item.student}</div>
                      <p className="extra-small text-muted text-truncate mb-2">{item.title}</p>
                      <div className="d-flex gap-3 extra-small text-muted fw-bold">
                        <span className="d-flex align-items-center gap-1"><Clock size={12} className="text-primary"/> {item.time}</span>
                        <span className="d-flex align-items-center gap-1"><MapPin size={12} className="text-primary"/> {item.room}</span>
                      </div>
                    </div>
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="link" className="p-0 text-muted no-caret border-0 shadow-none"><MoreVertical size={18}/></Dropdown.Toggle>
                      <Dropdown.Menu className="border-0 shadow-lg rounded-3">
                        <Dropdown.Item className="extra-small fw-bold">Détails</Dropdown.Item>
                        <Dropdown.Item className="extra-small fw-bold">Contacter</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="extra-small fw-bold text-danger">Annuler</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .schedule-modern-layout {
          color: var(--text-primary);
        }
        .schedule-glass-card {
          background-color: var(--surface);
          border: 1px solid var(--border) !important;
          color: var(--text-primary);
        }
        .bg-surface-alt {
          background-color: var(--background) !important;
        }
        .hover-bg-surface:hover {
          background-color: rgba(var(--primary-rgb), 0.05) !important;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 8px;
        }
        .calendar-day-label {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-secondary);
          padding-bottom: 12px;
          text-transform: uppercase;
        }
        .calendar-day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .calendar-day-cell:hover {
          background-color: var(--background);
          border-color: var(--border);
        }
        .calendar-day-cell.active {
          background-color: var(--primary) !important;
          color: white !important;
          box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
        }
        .calendar-day-cell.has-event {
          color: var(--primary);
          background-color: rgba(var(--primary-rgb), 0.1);
          font-weight: 800;
        }
        .border-start-4 {
          border-left: 4px solid !important;
        }
        .border-primary { border-left-color: var(--primary) !important; }
        .border-success { border-left-color: #10b981 !important; }
        .border-warning { border-left-color: #f59e0b !important; }
        
        h2, h4, h5, .fw-bold {
          color: var(--text-primary) !important;
        }
        .text-muted {
          color: var(--text-secondary) !important;
        }
      `}</style>
    </div>
  );
};

export default JurySchedulePage;
