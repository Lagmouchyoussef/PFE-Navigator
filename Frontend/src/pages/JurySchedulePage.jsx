import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { 
  Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight, 
  FileText, CheckCircle, Video, Download 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JurySchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 12)); 
  const navigate = useNavigate();

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const selectedDayString = `${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  const changeDay = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'next') newDate.setDate(newDate.getDate() + 1);
    else newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    if (direction === 'next') newDate.setMonth(newDate.getMonth() + 1);
    else newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let startOffset = firstDay === 0 ? 6 : firstDay - 1; 
    const grid = [];
    let week = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      week.push({ d: daysInPrevMonth - i, muted: true, isPrevMonth: true });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      week.push({ d: i, muted: false });
      if (week.length === 7) {
        grid.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      let nextDay = 1;
      while (week.length < 7) {
        week.push({ d: nextDay++, muted: true, isNextMonth: true });
      }
      grid.push(week);
    }
    return grid;
  };

  const calendarGrid = generateCalendarGrid();

  const scheduleData = [
    {
      id: 1,
      date: 'May 12, 2026',
      time: '09:00 AM - 10:30 AM',
      student: 'Ahmed Benali',
      title: 'AI-based Academic Integrity System',
      room: 'Amphi A',
      type: 'In-Person',
      coJury: ['Dr. S. Miller', 'Pr. H. Tazi'],
      status: 'Completed'
    },
    {
      id: 2,
      date: 'May 12, 2026',
      time: '11:00 AM - 12:30 PM',
      student: 'Youssef Alaoui',
      title: 'Blockchain Voting Mechanism',
      room: 'Room 402',
      type: 'In-Person',
      coJury: ['Dr. K. Smith'],
      status: 'In Progress'
    },
    {
      id: 3,
      date: 'May 12, 2026',
      time: '14:30 PM - 16:00 PM',
      student: 'Fatima Zahra',
      title: 'Smart Campus IoT Architecture',
      room: 'Virtual Meeting',
      type: 'Online',
      coJury: ['Pr. A. Dupont', 'Dr. L. Gomez'],
      status: 'Upcoming'
    }
  ];

  const filteredSchedule = scheduleData.filter(item => item.date === selectedDayString);

  return (
    <div className="dashboard-container bg-light min-vh-100">
      <Container fluid className="px-4 py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Defense Calendar</h3>
            <p className="text-muted small mb-0">Management of academic presentations and jury assignments.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="btn-sm fw-bold px-3 d-flex align-items-center gap-2">
              <Download size={16} /> Export Agenda
            </Button>
            <Button variant="primary" className="btn-sm fw-bold px-3 d-flex align-items-center gap-2">
              <Calendar size={16} /> Sync to External
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Main Agenda */}
          <Col lg={8}>
            <div className="d-flex align-items-center justify-content-between mb-4 bg-white p-2 rounded-3 border shadow-sm">
              <Button variant="light" size="sm" className="rounded-circle" onClick={() => changeDay('prev')}><ChevronLeft size={18}/></Button>
              <h5 className="fw-bold mb-0 text-dark">{selectedDayString}</h5>
              <Button variant="light" size="sm" className="rounded-circle" onClick={() => changeDay('next')}><ChevronRight size={18}/></Button>
            </div>

            <div className="d-flex flex-column gap-4">
              {filteredSchedule.length > 0 ? filteredSchedule.map((session) => (
                <Card key={session.id} className={`border-0 shadow-sm rounded-3 overflow-hidden ${session.status === 'Completed' ? 'opacity-75' : ''}`}>
                  <div className={`p-1 bg-${session.type === 'Online' ? 'info' : 'primary'}`}></div>
                  <Card.Body className="p-4">
                    <Row className="align-items-center">
                      <Col md={3} className="border-end text-center text-md-start mb-3 mb-md-0">
                        <h5 className="fw-bold text-primary mb-1">{session.time.split('-')[0].trim()}</h5>
                        <p className="extra-small text-muted fw-bold text-uppercase mb-3">To {session.time.split('-')[1].trim()}</p>
                        <Badge bg={session.type === 'Online' ? 'info' : 'primary'} className="bg-opacity-10 text-opacity-100 rounded-pill px-3 py-1 extra-small" style={{ color: session.type === 'Online' ? 'var(--bs-info)' : 'var(--bs-primary)' }}>
                          {session.type}
                        </Badge>
                      </Col>
                      <Col md={6} className="px-md-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <div className="avatar-circle-sm bg-light text-primary fw-bold">{session.student.charAt(0)}</div>
                          <span className="small fw-bold text-dark">{session.student}</span>
                        </div>
                        <h6 className="fw-bold text-dark mb-3">{session.title}</h6>
                        <div className="d-flex flex-wrap gap-3">
                          <span className="extra-small text-muted d-flex align-items-center gap-1"><MapPin size={12} /> {session.room}</span>
                          <span className="extra-small text-muted d-flex align-items-center gap-1"><Users size={12} /> {session.coJury.length + 1} Members</span>
                        </div>
                      </Col>
                      <Col md={3} className="text-md-end mt-3 mt-md-0 d-flex flex-column gap-2">
                        <Button variant="primary" size="sm" className="rounded-pill fw-bold" onClick={() => navigate('/jury/evaluation')} disabled={session.status === 'Completed'}>
                          {session.status === 'Completed' ? 'Evaluated' : 'Start Session'}
                        </Button>
                        <Button variant="outline-secondary" size="sm" className="rounded-pill fw-bold" onClick={() => navigate('/jury/documents')}>
                          View Assets
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )) : (
                <Card className="border-0 shadow-sm rounded-3 p-5 text-center bg-white">
                  <Calendar size={48} className="text-muted opacity-25 mb-3 mx-auto" />
                  <h6 className="fw-bold text-muted">No presentations scheduled for this date.</h6>
                </Card>
              )}
            </div>
          </Col>

          {/* Sidebar Calendar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-3 p-4 mb-4 bg-white">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="fw-bold mb-0">Monthly Overview</h6>
                <div className="d-flex gap-1">
                  <Button variant="light" size="sm" className="p-1" onClick={() => changeMonth('prev')}><ChevronLeft size={16}/></Button>
                  <Button variant="light" size="sm" className="p-1" onClick={() => changeMonth('next')}><ChevronRight size={16}/></Button>
                </div>
              </div>
              
              <div className="d-flex justify-content-between mb-3 text-muted extra-small fw-bold uppercase">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => <span key={d} style={{ width: '30px', textAlign: 'center' }}>{d}</span>)}
              </div>
              
              {calendarGrid.map((week, wIdx) => (
                <div key={wIdx} className="d-flex justify-content-between mb-2">
                  {week.map((dayObj, dIdx) => {
                    let targetMonth = currentDate.getMonth();
                    let targetYear = currentDate.getFullYear();
                    if (dayObj.isPrevMonth) targetMonth--;
                    else if (dayObj.isNextMonth) targetMonth++;
                    
                    const isSelected = selectedDayString === `${months[targetMonth]} ${dayObj.d}, ${targetYear}`;
                    const hasEvent = scheduleData.some(e => e.date === `${months[targetMonth]} ${dayObj.d}, ${targetYear}`);

                    return (
                      <span 
                        key={dIdx}
                        className={`d-flex align-items-center justify-content-center rounded-circle extra-small fw-bold cursor-pointer transition-all ${isSelected ? 'bg-primary text-white' : dayObj.muted ? 'text-muted opacity-25' : hasEvent ? 'border border-primary text-primary' : 'hover-bg-light'}`}
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => setCurrentDate(new Date(targetYear, targetMonth, dayObj.d))}
                      >
                        {dayObj.d}
                      </span>
                    )
                  })}
                </div>
              ))}
            </Card>

            <Card className="border-0 shadow-sm rounded-3 p-4 bg-primary text-white">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><Clock size={18}/> Weekly Summary</h6>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-center">
                  <div className="h4 fw-bold mb-0">04</div>
                  <div className="extra-small opacity-75 uppercase">Total</div>
                </div>
                <div className="text-center">
                  <div className="h4 fw-bold mb-0">01</div>
                  <div className="extra-small opacity-75 uppercase">Online</div>
                </div>
                <div className="text-center">
                  <div className="h4 fw-bold mb-0">03</div>
                  <div className="extra-small opacity-75 uppercase">On-Site</div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JurySchedulePage;
