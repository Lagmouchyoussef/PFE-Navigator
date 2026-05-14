import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Badge, Button, Dropdown
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Users, 
  ChevronLeft, ChevronRight, Download, Info, Video, MoreVertical, X
} from 'lucide-react';

import { useApp } from '../../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const JurySchedulePage = () => {
  const navigate = useNavigate();
  const { user, appointments, cancelAppointment, students } = useApp();
  const [selectedDay, setSelectedDay] = useState(12);
  const [openMenuId, setOpenMenuId] = useState(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Filter active defense appointments
  const defenseAppointments = appointments.filter(app => (app.type === 'Defense' || app.type === 'Review') && app.status !== 'Cancelled');

  return (
    <div className="jury-schedule-layout py-4">
      <Container fluid className="px-4">
        {/* Header */}
        <header className="mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy text-gradient">Calendrier des Soutenances</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Gérez le planning des soutenances et révisions académiques.</p>
          </motion.div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
              <Download size={18} /> Exporter le Planning
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          {[
            { label: 'Soutenances Prévues', value: defenseAppointments.length, color: 'primary' },
            { label: 'Ce Mois', value: '15', color: 'success' },
            { label: 'Temps Moyen', value: '5.5h', color: 'warning' },
          ].map((stat, i) => (
            <Col lg={4} key={i}>
              <div className={`glass-card p-4 rounded-4 shadow-sm border border-light border-opacity-10 border-start-4 border-${stat.color}`}>
                <div className="h3 fw-bold text-navy mb-1">{stat.value}</div>
                <div className="extra-small text-muted fw-bold text-uppercase opacity-75">{stat.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        <Row className="g-4">
          <Col lg={7}>
            <Card className="glass-card p-4 rounded-4 shadow-sm h-100 border border-light border-opacity-10">
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom border-light border-opacity-10 pb-3">
                <h5 className="fw-bold text-navy mb-0">May 2026</h5>
                <div className="d-flex gap-2">
                  <Button variant="link" className="p-1 text-muted hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"><ChevronLeft size={20} /></Button>
                  <Button variant="link" className="p-1 text-muted hover-bg-surface-alt rounded-circle transition-all border-0 shadow-none"><ChevronRight size={20} /></Button>
                </div>
              </div>

              <div className="calendar-grid d-grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {weekDays.map(d => <div key={d} className="text-center extra-small fw-bold text-muted text-uppercase opacity-50 mb-2">{d}</div>)}
                <div /><div /><div /><div />
                {days.map(d => (
                  <div 
                    key={d} 
                    className={`d-flex align-items-center justify-content-center rounded-4 small fw-bold cursor-pointer transition-all border ${selectedDay === d ? 'bg-primary text-white border-primary shadow-sm' : 'text-navy hover-bg-surface-alt border-transparent'} ${[5, 6, 7].includes(d) ? 'bg-primary-soft text-primary' : ''}`}
                    style={{ aspectRatio: '1' }}
                    onClick={() => setSelectedDay(d)}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </Card>
          </Col>

          <Col lg={5}>
            <div className="d-flex justify-content-between align-items-center mb-4 px-2">
              <h5 className="fw-bold text-navy mb-0">Planning à venir</h5>
              <Badge className="bg-primary-soft text-primary border-0 extra-small fw-bold px-3 py-2 rounded-pill">{defenseAppointments.length} Prévues</Badge>
            </div>

            <div className="d-flex flex-column gap-3">
              {defenseAppointments.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-3 rounded-4 shadow-sm border border-light border-opacity-10 hover-bg-surface-alt transition-all cursor-pointer group"
                  style={{ zIndex: openMenuId === item.id ? 100 : 1, position: 'relative' }}
                >
                  <div className="d-flex gap-3 align-items-center">
                    <div className="p-3 bg-primary-soft text-primary rounded-4 text-center" style={{ minWidth: '65px' }}>
                      <div className="fw-bold h4 mb-0">{item.date.split('-')[2]}</div>
                      <div className="extra-small fw-bold opacity-75 uppercase">MAI</div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="small fw-bold text-navy text-truncate mb-1">{item.studentName}</div>
                      <p className="extra-small text-muted fw-bold opacity-75 text-truncate mb-2">{item.title}</p>
                      <div className="d-flex gap-3 extra-small text-muted fw-bold opacity-50">
                        <span className="d-flex align-items-center gap-1"><Clock size={12} className="text-primary"/> {item.time}</span>
                        <span className="d-flex align-items-center gap-1"><MapPin size={12} className="text-danger"/> {item.location}</span>
                      </div>
                    </div>
                    <div className="dropdown-container">
                      <Dropdown align="end" onToggle={(isOpen) => setOpenMenuId(isOpen ? item.id : null)}>
                        <Dropdown.Toggle variant="link" className="p-2 text-muted no-caret border-0 shadow-none hover-bg-primary-soft rounded-circle transition-all">
                          <MoreVertical size={18}/>
                        </Dropdown.Toggle>
                      <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small p-2">
                        <Dropdown.Item 
                          className="py-2 fw-bold text-navy"
                          onClick={() => {
                            const student = students.find(s => s.name === item.studentName);
                            navigate('/jury/evaluation', { state: { openStudentId: student?.id } });
                          }}
                        >
                          Voir Détails
                        </Dropdown.Item>
                        <Dropdown.Item 
                          className="py-2 fw-bold text-navy"
                          onClick={() => navigate('/jury/messages')}
                        >
                          Contacter l'étudiant
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item className="py-2 fw-bold text-danger" onClick={() => cancelAppointment(item.id)}>
                          Annuler la soutenance
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </motion.div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JurySchedulePage;
