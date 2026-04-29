import React, { useState } from 'react';
import { Container, Card, Row, Col, Badge, Button, ButtonGroup, Table } from 'react-bootstrap';
import { 
  Calendar as CalendarIcon, Clock, MapPin, Info, 
  ChevronLeft, ChevronRight, CalendarDays, Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const SchedulePage = () => {
  const { defenses } = useApp();
  const [view, setView] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push({ day: null });
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEvents = defenses.filter(d => {
      const dDate = new Date(d.date);
      return dDate.getDate() === i && dDate.getMonth() === currentDate.getMonth() && dDate.getFullYear() === currentDate.getFullYear();
    });
    calendarDays.push({ day: i, events: dayEvents });
  }

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Defense Timeline</h3>
            <p className="text-muted small mb-0">Official schedule for academic presentations and jury sessions.</p>
          </div>
          <div className="d-flex gap-2">
             <ButtonGroup className="bg-white p-1 rounded-3 border shadow-sm">
                <Button variant={view === 'calendar' ? 'primary' : 'white'} size="sm" className="px-3 fw-bold border-0" onClick={() => setView('calendar')}>Grid</Button>
                <Button variant={view === 'list' ? 'primary' : 'white'} size="sm" className="px-3 fw-bold border-0" onClick={() => setView('list')}>List</Button>
             </ButtonGroup>
             <Button variant="white" className="rounded-3 border shadow-sm fw-bold small px-3" onClick={handleToday}>Today</Button>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={view === 'calendar' ? 9 : 8}>
            <Card className="border-0 shadow-sm rounded-3 overflow-hidden bg-white">
              <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                <div className="d-flex align-items-center gap-2">
                   <h6 className="fw-bold mb-0 text-dark">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h6>
                   <div className="d-flex gap-1 ms-2">
                     <Button variant="light" size="sm" className="p-1 border shadow-none" onClick={handlePrevMonth}><ChevronLeft size={16}/></Button>
                     <Button variant="light" size="sm" className="p-1 border shadow-none" onClick={handleNextMonth}><ChevronRight size={16}/></Button>
                   </div>
                </div>
                <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-1 rounded-pill small fw-bold">Active Session</Badge>
              </div>

              {view === 'calendar' ? (
                <div className="p-1">
                   <Table bordered responsive className="calendar-table mb-0 text-center border-light">
                      <thead>
                        <tr className="bg-light text-muted extra-small fw-bold text-uppercase">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <th key={day} className="py-3 fw-bold border-light">{day}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: Math.ceil(calendarDays.length / 7) }).map((_, rIdx) => (
                          <tr key={rIdx}>
                            {calendarDays.slice(rIdx * 7, rIdx * 7 + 7).map((d, dIdx) => (
                              <td key={dIdx} className={`p-0 border-light ${d.day === null ? 'bg-light bg-opacity-25' : ''}`} style={{ width: '14.28%', height: '120px' }}>
                                {d.day && (
                                  <div className="p-2 h-100 d-flex flex-column gap-1">
                                    <span className={`extra-small fw-bold d-inline-flex align-items-center justify-content-center rounded-circle ${d.day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() ? 'bg-primary text-white shadow-sm' : 'text-muted'}`} style={{ width: '24px', height: '24px' }}>{d.day}</span>
                                    <div className="flex-grow-1 overflow-auto d-flex flex-column gap-1 mt-1">
                                      {d.events?.map((ev, idx) => (
                                        <div key={idx} className="p-1 px-2 rounded-2 bg-primary bg-opacity-05 border-start border-3 border-primary extra-small fw-bold text-primary text-truncate cursor-pointer text-start">
                                          {ev.title}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                   </Table>
                </div>
              ) : (
                <div className="p-3 bg-light bg-opacity-30 d-flex flex-column gap-3">
                   {defenses.map(event => (
                      <Card key={event.id} className="border-0 shadow-sm rounded-3 p-4 bg-white">
                        <Row className="align-items-center">
                          <Col md={2} className="text-center border-end">
                            <div className="h2 fw-bold text-primary mb-0">{new Date(event.date).getDate()}</div>
                            <div className="extra-small fw-bold text-muted uppercase">{monthNames[new Date(event.date).getMonth()].slice(0,3)}</div>
                          </Col>
                          <Col md={6} className="ps-4">
                            <Badge bg="primary" className="bg-opacity-10 text-primary border-0 extra-small mb-2">DEFENSE SESSION</Badge>
                            <h6 className="fw-bold text-dark mb-2">{event.title}</h6>
                            <div className="d-flex gap-4 extra-small text-muted fw-bold">
                               <span className="d-flex align-items-center gap-2"><Clock size={14} className="text-primary" /> {event.time}</span>
                               <span className="d-flex align-items-center gap-2"><MapPin size={14} className="text-primary" /> {event.room}</span>
                            </div>
                          </Col>
                          <Col md={4} className="text-end">
                             <Button variant="outline-primary" size="sm" className="rounded-pill px-4 fw-bold border-1">Details</Button>
                          </Col>
                        </Row>
                      </Card>
                   ))}
                </div>
              )}
            </Card>
          </Col>

          <Col lg={view === 'calendar' ? 3 : 4}>
            <Card className="border-0 shadow-sm rounded-3 p-4 mb-4 bg-primary text-white">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2"><Activity size={18} /> Next Scheduled</h6>
              <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 mb-4">
                  <div className="extra-small fw-bold uppercase opacity-75 mb-1">Final PFE Defense</div>
                  <h6 className="fw-bold mb-1">Blockchain Security</h6>
                  <p className="extra-small mb-0 opacity-75">May 20, 2026 at 10:00 AM</p>
              </div>
              <Button variant="white" className="w-100 rounded-pill py-2 fw-bold small text-primary border-0">View Protocols</Button>
            </Card>

            <Card className="border-0 shadow-sm rounded-3 p-4 bg-white">
               <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Info size={18} className="text-primary" /> Quick Guidelines</h6>
               <ul className="ps-3 mb-0 extra-small text-muted fw-medium d-flex flex-column gap-3">
                 <li>Confirm your attendance 48h before the session.</li>
                 <li>Ensure the technical equipment is reserved for physical rooms.</li>
                 <li>All jury members must have access to the final report.</li>
               </ul>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SchedulePage;
