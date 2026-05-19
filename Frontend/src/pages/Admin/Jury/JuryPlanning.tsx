import React, { useState, useEffect } from 'react';
import {
  Plus, ChevronLeft, ChevronRight, MapPin, Users, Clock,
  MoreVertical, Calendar, XCircle, Trash2, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { Container, Row, Col, Button, Badge, Modal, Form, Dropdown } from 'react-bootstrap';
import fetchClient from '../../../api/client';
import { useApp } from '../../../context/AppContext';

interface JurySession {
  id: number;
  title: string;
  day: number;
  month?: number;
  year?: number;
  date: string;
  location: string;
  time: string;
  members: string[];
  status?: 'Active' | 'Cancelled';
}

const INITIAL_JURIES: JurySession[] = [];

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const mapAppointmentToJury = (app: any): JurySession => {
  const dateObj = new Date(app.date);
  return {
    id: app.id,
    title: app.title,
    day: dateObj.getDate(),
    month: dateObj.getMonth(),
    year: dateObj.getFullYear(),
    date: `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`,
    location: app.location || 'Salle TBD',
    time: app.time ? app.time.substring(0, 5) : '08:30',
    members: app.supervisor_name ? [app.supervisor_name, 'Prof. Invité'] : ['Jury A', 'Jury B'],
    status: app.status === 'Cancelled' ? 'Cancelled' : 'Active'
  };
};

// ── Helper: send defense notifications to all parties ────────────────────────
const sendDefenseNotifications = async (params: {
  title: string;
  dateStr: string;
  time: string;
  location: string;
  studentIds: number[];
  supervisorIds: number[];
  juryMemberIds: number[];
  adminIds: number[];
}) => {
  const loc = params.location ? ` — ${params.location}` : '';
  const when = `${params.dateStr} at ${params.time}`;

  const calls: Promise<any>[] = [];

  if (params.studentIds.length > 0)
    calls.push(fetchClient.post('/notifications/', {
      title: 'Defense Date Scheduled',
      message: `Your thesis defense has been scheduled: "${params.title}" on ${when}${loc}. Check your schedule for details.`,
      type: 'defense', link: '/student/schedule',
      recipients: params.studentIds,
    }).catch(() => {}));

  if (params.supervisorIds.length > 0)
    calls.push(fetchClient.post('/notifications/', {
      title: 'Defense Scheduled',
      message: `Defense scheduled for your student(s): "${params.title}" on ${when}${loc}.`,
      type: 'defense', link: '/supervisor/schedule',
      recipients: params.supervisorIds,
    }).catch(() => {}));

  if (params.juryMemberIds.length > 0)
    calls.push(fetchClient.post('/notifications/', {
      title: 'Defense Assigned to You',
      message: `You are assigned as jury member for "${params.title}" on ${when}${loc}.`,
      type: 'defense', link: '/jury/schedule',
      recipients: params.juryMemberIds,
    }).catch(() => {}));

  if (params.adminIds.length > 0)
    calls.push(fetchClient.post('/notifications/', {
      title: 'Defense Scheduled',
      message: `Defense scheduled: "${params.title}" on ${when}${loc}.`,
      type: 'defense', link: '/admin/jury-planning',
      recipients: params.adminIds,
    }).catch(() => {}));

  await Promise.all(calls);
};

const JuryPlanning: React.FC = () => {
  const { allUsers } = useApp();
  const juryUsers = (allUsers || []).filter((u: any) => u && u.role === 'jury');
  const adminUsers = (allUsers || []).filter((u: any) => u && u.role === 'admin');
  const today = new Date();
  const [activeView, setActiveView] = useState('Month');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [juries, setJuries] = useState<JurySession[]>(INITIAL_JURIES);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | string>('');
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    day: 1, 
    month: today.getMonth(),
    year: today.getFullYear(),
    location: '', 
    time: '09:00',
    selectedMembers: [] as string[]
  });
  const [showUnifiedModal, setShowUnifiedModal] = useState(false);
  const [unifiedFormData, setUnifiedFormData] = useState({
    title: 'Journée Unifiée des Soutenances PFE',
    day: 25,
    month: today.getMonth(),
    year: today.getFullYear(),
    time: '08:30',
    location: 'Salles des Examens'
  });
  const [showReschedule, setShowReschedule] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<JurySession | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const flashSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const projRes = await fetchClient.get('/projects/projects/');
        const projList = Array.isArray(projRes.data) ? projRes.data : ((projRes.data as any)?.results || []);
        setProjects(projList);
        if (projList.length > 0) {
          setSelectedProjectId(projList[0].id);
        }

        const apptRes = await fetchClient.get('/projects/appointments/');
        const apptList = Array.isArray(apptRes.data) ? apptRes.data : ((apptRes.data as any)?.results || []);
        const defenseAppts = apptList.filter((a: any) => a && (a.type?.toLowerCase() === 'defense'));
        if (defenseAppts.length > 0) {
          setJuries(defenseAppts.map(mapAppointmentToJury));
        }
      } catch (err) {
        console.error("Failed to load jury planning data:", err);
      }
    };
    loadData();
  }, []);

  const handleCancelSession = async (id: number) => {
    try {
      await fetchClient.post(`/projects/appointments/${id}/cancel/`, {});
      setJuries(juries.map(j => j.id === id ? { ...j, status: 'Cancelled' as const } : j));
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      alert("Erreur lors de la mise à jour sur le serveur.");
    }
  };

  const handleDeleteSession = (id: number) => {
    setSessionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (sessionToDelete !== null) {
      try {
        await fetchClient.delete(`/projects/appointments/${sessionToDelete}/`);
        setJuries(juries.filter(j => j.id !== sessionToDelete));
        setShowDeleteModal(false);
        setSessionToDelete(null);
      } catch (err) {
        console.error("Failed to delete appointment:", err);
        alert("Erreur lors de la suppression sur le serveur.");
      }
    }
  };

  const openReschedule = (session: JurySession) => {
    setSessionToReschedule(session);
    setFormData({
      title: session.title,
      day: session.day,
      month: session.month ?? currentMonth,
      year: session.year ?? currentYear,
      location: session.location,
      time: session.time,
      selectedMembers: session.members
    });
    setShowReschedule(true);
  };

  const handleConfirmReschedule = async () => {
    if (sessionToReschedule) {
      const dateStr = `${formData.year}-${String(formData.month + 1).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
      const updateData = {
        title: formData.title,
        date: dateStr,
        time: formData.time,
        location: formData.location,
        notes: `Membres du jury: ${formData.selectedMembers.join(', ')}`
      };

      try {
        const res = await fetchClient.patch(`/projects/appointments/${sessionToReschedule.id}/`, updateData);
        setJuries(juries.map(j => j.id === sessionToReschedule.id ? mapAppointmentToJury(res.data) : j));
        setShowReschedule(false);
        setSessionToReschedule(null);
      } catch (err) {
        console.error("Failed to reschedule session:", err);
        alert("Erreur lors de la mise à jour sur le serveur.");
      }
    }
  };

  const toggleMemberSelection = (name: string) => {
    if (formData.selectedMembers.includes(name)) {
      setFormData({ ...formData, selectedMembers: formData.selectedMembers.filter(m => m !== name) });
    } else {
      setFormData({ ...formData, selectedMembers: [...formData.selectedMembers, name] });
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  const days: { day: number; current: boolean }[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, current: false });
  for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, current: true });
  while (days.length % 7 !== 0) days.push({ day: days.length - daysInMonth - firstDayOfWeek + 1, current: false });

  const goToPrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const handleAddJury = async () => {
    if (!selectedProjectId) {
      alert("Veuillez sélectionner un projet pour cette soutenance.");
      return;
    }
    
    const project = projects.find(p => p.id === Number(selectedProjectId));
    if (!project) return;

    const dateStr = `${formData.year}-${String(formData.month + 1).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`;
    
    const newAppointmentData = {
      project: project.id,
      title: formData.title || `Soutenance PFE - ${project.title}`,
      student: project.student?.id || project.student,
      supervisor: project.supervisor?.id || project.supervisor,
      date: dateStr,
      time: formData.time,
      location: formData.location,
      type: 'defense',
      status: 'Confirmed',
      notes: `Membres du jury: ${formData.selectedMembers.join(', ')}`
    };

    try {
      const res = await fetchClient.post('/projects/appointments/', newAppointmentData);
      const createdAppt = res.data;
      
      const newJury = mapAppointmentToJury(createdAppt);
      setJuries([...juries, newJury]);
      setShowModal(false);
      setFormData({ title: '', day: 1, month: currentMonth, year: currentYear, location: '', time: '09:00', selectedMembers: [] });

      const selectedJuryIds = juryUsers
        .filter((j: any) => formData.selectedMembers.includes(j.name))
        .map((j: any) => j.id);

      await sendDefenseNotifications({
        title: newJury.title,
        dateStr,
        time: formData.time,
        location: formData.location,
        studentIds: project.student?.id ? [project.student.id] : [],
        supervisorIds: project.supervisor?.id ? [project.supervisor.id] : [],
        juryMemberIds: selectedJuryIds,
        adminIds: adminUsers.map((u: any) => u.id),
      });

      flashSuccess(`Defense scheduled for "${newJury.title}" on ${newJury.date}. Student, supervisor, jury members and admins have been notified.`);
    } catch (err) {
      console.error("Failed to save jury session:", err);
      alert("Erreur lors de la sauvegarde sur le serveur.");
    }
  };

  const handleAddUnifiedDay = async () => {
    if (projects.length === 0) {
      alert("Aucun projet actif trouvé pour planifier la journée unifiée.");
      return;
    }

    const day = unifiedFormData.day;
    const month = unifiedFormData.month;
    const year = unifiedFormData.year;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const roomSuffixes = ['Amphi A', 'Salle B2', 'Labo 4'];
    const rooms = roomSuffixes.map(s => `${unifiedFormData.location} - ${s}`);

    const chunkSize = 2;
    const juryChunks: string[][] = [];
    for (let i = 0; i < rooms.length; i++) {
      const chunk = juryUsers.slice(i * chunkSize, i * chunkSize + chunkSize).map((u: any) => u.name);
      juryChunks.push(chunk.length > 0 ? chunk : [`Jury ${String.fromCharCode(65 + i)}`]);
    }

    try {
      const createdJuries: JurySession[] = [];

      for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const roomIdx = i % rooms.length;
        const room = rooms[roomIdx];
        const members = juryChunks[roomIdx];

        const newAppointmentData = {
          project: project.id,
          title: `${unifiedFormData.title} - Jury ${String.fromCharCode(65 + roomIdx)}`,
          student: project.student?.id || project.student,
          supervisor: project.supervisor?.id || project.supervisor,
          date: dateStr,
          time: unifiedFormData.time,
          location: room,
          type: 'defense',
          status: 'Confirmed',
          notes: `Membres du jury: ${members.join(', ')}`
        };

        const res = await fetchClient.post('/projects/appointments/', newAppointmentData);
        createdJuries.push(mapAppointmentToJury(res.data));
      }

      setJuries([...juries, ...createdJuries]);
      setShowUnifiedModal(false);

      const studentIds = projects.map((p: any) => p.student?.id).filter(Boolean) as number[];
      const supervisorIds = [...new Set(projects.map((p: any) => p.supervisor?.id).filter(Boolean))] as number[];

      await sendDefenseNotifications({
        title: unifiedFormData.title,
        dateStr,
        time: unifiedFormData.time,
        location: unifiedFormData.location,
        studentIds,
        supervisorIds,
        juryMemberIds: juryUsers.map((j: any) => j.id),
        adminIds: adminUsers.map((u: any) => u.id),
      });

      flashSuccess(`Unified defense day scheduled for ${createdJuries.length} project(s) on ${dateStr}. All students, supervisors, jury members and admins have been notified.`);
    } catch (err) {
      console.error("Failed to plan unified day:", err);
      alert("Erreur lors de la création de la journée unifiée.");
    }
  };

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Success Banner */}
        {successMsg && (
          <div className="glass-card mb-4 p-3 rounded-4 shadow-sm border-start border-success border-4 d-flex align-items-center gap-3">
            <CheckCircle size={20} className="text-success flex-shrink-0" />
            <span className="small fw-bold flex-grow-1">{successMsg}</span>
            <button type="button" className="btn btn-sm p-0 border-0 bg-transparent" onClick={() => setSuccessMsg('')}>
              <X size={16} className="text-muted" />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Jury Planning</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Organize and manage academic evaluation sessions.</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary"
              className="rounded-pill d-flex align-items-center gap-2 px-4 fw-bold shadow-sm"
              onClick={() => setShowUnifiedModal(true)}
            >
              <Calendar size={18} /> Journée unifiée
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} /> New jury
            </Button>
          </div>
        </div>

        <Row className="g-4">
          {/* Main Calendar Grid */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2">
                  <Button variant="link" className="p-1 text-primary border-0 shadow-none" onClick={goToPrevMonth}><ChevronLeft size={24} /></Button>
                  <h4 className="fw-bold mb-0 mx-2 text-navy text-nowrap">{MONTH_NAMES[currentMonth]} {currentYear}</h4>
                  <Button variant="link" className="p-1 text-primary border-0 shadow-none" onClick={goToNextMonth}><ChevronRight size={24} /></Button>
                </div>
                <input 
                  className="rounded-4 border-light-soft bg-surface-alt py-2 px-3 extra-small fw-bold shadow-none text-navy border-0 form-control" 
                  type="date" 
                  value={`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`} 
                  onChange={(e) => {
                    if (e.target.value) {
                      const selectedDate = new Date(e.target.value);
                      setCurrentMonth(selectedDate.getMonth());
                      setCurrentYear(selectedDate.getFullYear());
                    }
                  }}
                  style={{ maxWidth: '180px', cursor: 'pointer' }}
                />
              </div>
              <div className="d-flex gap-2 bg-surface p-1 rounded-pill border">
                {['Month', 'Week'].map(view => (
                  <Button 
                    key={view}
                    variant={activeView === view ? 'primary' : 'link'}
                    className={`px-4 py-1 extra-small rounded-pill border-0 fw-bold text-decoration-none shadow-none ${activeView === view ? 'shadow-sm text-white' : 'text-muted'}`}
                    onClick={() => setActiveView(view)}
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-4 overflow-hidden border shadow-sm">
              <div className="d-flex border-bottom bg-surface-alt text-center fw-bold extra-small text-muted py-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="flex-grow-1">{d}</div>
                ))}
              </div>
              <div className="d-flex flex-wrap">
                {days.map((item, idx) => {
                  const dayJuries = juries.filter(j => 
                    j.day === item.day && 
                    item.current && 
                    (j.month === undefined ? true : j.month === currentMonth) && 
                    (j.year === undefined ? true : j.year === currentYear)
                  );
                  return (
                    <div key={idx} className={`day-cell border-end border-bottom ${!item.current ? 'opacity-25 bg-surface-alt' : 'bg-surface'}`}>
                      <div className="text-end p-2 extra-small fw-bold text-muted">{item.day}</div>
                      <div className="px-1 d-flex flex-column gap-1 pb-2" style={{ minHeight: '80px' }}>
                        {dayJuries.map(j => (
                          <div 
                            key={j.id} 
                            className={`p-1 px-2 rounded-2 extra-small fw-bold text-truncate cursor-pointer ${j.status === 'Cancelled' ? 'bg-secondary text-white opacity-50' : 'bg-primary text-white'}`}
                            onClick={() => openReschedule(j)}
                          >
                            {j.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Col>

          {/* Sidebar Info */}
          <Col lg={4}>
            <div className="glass-card p-4 rounded-4 shadow-sm mb-4">
              <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-navy">
                <Clock size={18} className="text-primary" /> Upcoming Sessions
              </h6>
              <div className="d-flex flex-column gap-3">
                {juries.filter(j => j.day >= 1).slice(0, 4).map(j => (
                  <div key={j.id} className={`p-3 rounded-3 border bg-surface-alt hover-bg-surface transition-all cursor-pointer shadow-sm-hover ${j.status === 'Cancelled' ? 'opacity-50 grayscale' : ''}`}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="flex-grow-1">
                        <div className="small fw-bold text-navy">{j.title}</div>
                        <Badge className={`bg-${j.status === 'Cancelled' ? 'secondary' : 'primary'}-soft text-${j.status === 'Cancelled' ? 'secondary' : 'primary'} border border-opacity-10 extra-small px-2 mt-1`}>
                          <span>{j.date}</span>
                          {j.status === 'Cancelled' && <span> • CANCELLED</span>}
                        </Badge>
                      </div>
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="link" className="p-1 text-muted no-caret border-0 shadow-none hover-bg-surface rounded-circle">
                          <MoreVertical size={18} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small">
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2" onClick={() => openReschedule(j)}>
                            <Calendar size={14} className="text-primary" /> Reschedule
                          </Dropdown.Item>
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-warning" onClick={() => handleCancelSession(j.id)}>
                            <XCircle size={14} /> Cancel
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item className="py-2 fw-bold d-flex align-items-center gap-2 text-danger" onClick={() => handleDeleteSession(j.id)}>
                            <Trash2 size={14} /> Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <div className="d-flex align-items-center gap-2 extra-small text-muted fw-bold mb-2">
                      <MapPin size={12} className="text-primary" /> {j.location} • <Clock size={12} className="text-primary" /> {j.time}
                    </div>
                    <div className="d-flex flex-wrap gap-1">
                      {j.members.map((m, idx) => (
                        <div key={idx} className="extra-small px-2 py-0 bg-white border rounded text-navy opacity-75 fw-bold">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="w-100 btn-premium d-flex align-items-center justify-content-center gap-2 py-2 fw-bold mt-4"
                onClick={() => setShowUnifiedModal(true)}
              >
                <Calendar size={16} /> Organiser Journée Unifiée
              </Button>
              <Button variant="link" className="w-100 mt-2 extra-small fw-bold text-primary text-decoration-none border-0 shadow-none">View full calendar</Button>
            </div>

            <div className="glass-card p-4 rounded-4 shadow-sm bg-primary-soft border-primary border-opacity-10">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary-soft rounded-circle text-primary">
                  <Users size={20} />
                </div>
                <h6 className="fw-bold mb-0 text-navy">Jury Availability</h6>
              </div>
              {juries.length === 0 ? (
                <p className="extra-small text-muted fw-bold mb-0 opacity-75">No sessions scheduled yet.</p>
              ) : (
                <div className="extra-small text-muted mb-0 fw-bold opacity-75">
                  <span>{juries.filter(j => j.status !== 'Cancelled').length} active session(s) this month.</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal Planifier */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Schedule a Jury Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Projet / Étudiant</Form.Label>
                  <Form.Select
                    className="form-control-premium fw-bold select-premium"
                    value={selectedProjectId}
                    onChange={(e) => {
                      setSelectedProjectId(e.target.value);
                      const proj = projects.find(p => p.id === Number(e.target.value));
                      if (proj) {
                        setFormData({
                          ...formData,
                          title: `Soutenance PFE - ${proj.title}`
                        });
                      }
                    }}
                  >
                    <option value="">Sélectionner un projet...</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.student_name || p.student?.name || 'Étudiant'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Session Title</Form.Label>
                  <Form.Control 
                    placeholder="Ex: Final Defense Group A" 
                    className="form-control-premium fw-bold py-3"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Date de Soutenance</Form.Label>
                  <input 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 px-3 fw-bold shadow-none text-navy border-0 form-control" 
                    type="date" 
                    value={`${formData.year}-${String(formData.month + 1).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`} 
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedDate = new Date(e.target.value);
                        setFormData({
                          ...formData,
                          day: selectedDate.getDate(),
                          month: selectedDate.getMonth(),
                          year: selectedDate.getFullYear()
                        });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </Form.Group>
                
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Heure</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="form-control-premium fw-bold"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Salle / Lieu</Form.Label>
                    <Form.Control 
                      placeholder="Ex: Salle B2" 
                      className="form-control-premium fw-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <div className="p-3 bg-surface-alt rounded-4 border h-100">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Jury Members</h6>
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
                    {juryUsers.length === 0 && (
                      <p className="extra-small text-muted fw-bold mb-0">No jury members found.</p>
                    )}
                    {juryUsers.map((jury: any) => (
                      <div
                        key={jury.id}
                        className={`p-2 rounded-3 border cursor-pointer transition-all ${formData.selectedMembers.includes(jury.name) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-navy'}`}
                        onClick={() => toggleMemberSelection(jury.name)}
                      >
                        <div className="extra-small fw-bold">{jury.name}</div>
                        <div className={`extra-small opacity-75 ${formData.selectedMembers.includes(jury.name) ? 'text-white' : 'text-muted'}`}>{jury.department || jury.role}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 extra-small fw-bold text-primary">
                    {formData.selectedMembers.length} members selected
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button className="btn-premium px-4 py-2" onClick={handleAddJury}>Confirm Planning</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Reporter / Modifier */}
      <Modal show={showReschedule} onHide={() => setShowReschedule(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Reschedule / Edit Session</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row className="g-4 mb-4">
              <Col lg={8}>
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Session Title</Form.Label>
                  <Form.Control 
                    className="form-control-premium fw-bold py-3"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Nouvelle Date de Soutenance</Form.Label>
                  <input 
                    className="rounded-4 border-light-soft bg-surface-alt py-3 px-3 fw-bold shadow-none text-navy border-0 form-control" 
                    type="date" 
                    value={`${formData.year}-${String(formData.month + 1).padStart(2, '0')}-${String(formData.day).padStart(2, '0')}`} 
                    onChange={(e) => {
                      if (e.target.value) {
                        const selectedDate = new Date(e.target.value);
                        setFormData({
                          ...formData,
                          day: selectedDate.getDate(),
                          month: selectedDate.getMonth(),
                          year: selectedDate.getFullYear()
                        });
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </Form.Group>
                
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">New Time</Form.Label>
                    <Form.Control 
                      type="time" 
                      className="form-control-premium fw-bold"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">New Room</Form.Label>
                    <Form.Control 
                      className="form-control-premium fw-bold"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </Col>
                </Row>
              </Col>

              <Col lg={4}>
                <div className="p-3 bg-surface-alt rounded-4 border h-100">
                  <h6 className="extra-small fw-bold text-muted text-uppercase mb-3">Adjust Jury</h6>
                  <div className="d-flex flex-column gap-2 overflow-auto" style={{ maxHeight: '200px' }}>
                    {juryUsers.length === 0 && (
                      <p className="extra-small text-muted fw-bold mb-0">No jury members found.</p>
                    )}
                    {juryUsers.map((jury: any) => (
                      <div
                        key={jury.id}
                        className={`p-2 rounded-3 border cursor-pointer transition-all ${formData.selectedMembers.includes(jury.name) ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-navy'}`}
                        onClick={() => toggleMemberSelection(jury.name)}
                      >
                        <div className="extra-small fw-bold">{jury.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowReschedule(false)}>Cancel</Button>
          <Button className="btn-premium px-4 py-2" onClick={handleConfirmReschedule}>Save changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmation Suppression */}
      {/* Modal Organiser une Journée Unifiée */}
      <Modal show={showUnifiedModal} onHide={() => setShowUnifiedModal(false)} centered size="lg" className="glass-modal">
        <Modal.Header closeButton className="border-0 p-4 pb-0">
          <Modal.Title className="fw-bold fs-5 text-navy">Organiser une Journée de Soutenance Unifiée</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Titre de l'Événement</Form.Label>
              <Form.Control 
                placeholder="Ex: Journée Nationale des Soutenances PFE" 
                className="form-control-premium fw-bold py-3"
                value={unifiedFormData.title}
                onChange={(e) => setUnifiedFormData({...unifiedFormData, title: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Date de l'Événement</Form.Label>
              <input 
                className="rounded-4 border-light-soft bg-surface-alt py-3 px-3 fw-bold shadow-none text-navy border-0 form-control" 
                type="date" 
                value={`${unifiedFormData.year}-${String(unifiedFormData.month + 1).padStart(2, '0')}-${String(unifiedFormData.day).padStart(2, '0')}`} 
                onChange={(e) => {
                  if (e.target.value) {
                    const selectedDate = new Date(e.target.value);
                    setUnifiedFormData({
                      ...unifiedFormData,
                      day: selectedDate.getDate(),
                      month: selectedDate.getMonth(),
                      year: selectedDate.getFullYear()
                    });
                  }
                }}
                style={{ cursor: 'pointer' }}
              />
            </Form.Group>
            
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Heure de Début</Form.Label>
                <Form.Control 
                  type="time" 
                  className="form-control-premium fw-bold"
                  value={unifiedFormData.time}
                  onChange={(e) => setUnifiedFormData({...unifiedFormData, time: e.target.value})}
                />
              </Col>
              <Col md={6}>
                <Form.Label className="extra-small fw-bold text-muted text-uppercase opacity-75">Lieu Principal</Form.Label>
                <Form.Control 
                  placeholder="Ex: Salles des Examens" 
                  className="form-control-premium fw-bold"
                  value={unifiedFormData.location}
                  onChange={(e) => setUnifiedFormData({...unifiedFormData, location: e.target.value})}
                />
              </Col>
            </Row>
            
            <div className="mt-4 p-3 bg-primary-soft rounded-4 border border-primary border-opacity-10">
              <h6 className="fw-bold mb-2 text-primary extra-small text-uppercase">Génération automatique des Jurys</h6>
              <p className="extra-small text-muted mb-0 fw-bold opacity-75">
                Cette option va automatiquement planifier et répartir <strong>tous les jurys disponibles</strong> (Jury A, Jury B, et Jury C) dans des salles dédiées (Amphi A, Salle B2, Labo 4) le même jour à la même heure en un seul clic !
              </p>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 p-4 pt-0">
          <Button variant="link" className="text-muted fw-bold text-decoration-none border-0" onClick={() => setShowUnifiedModal(false)}>Annuler</Button>
          <Button className="btn-premium px-4 py-2" onClick={handleAddUnifiedDay}>Confirmer la Journée Unifiée</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Confirmation Suppression */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)} 
        centered 
        className="glass-modal"
        size="sm"
      >
        <Modal.Body className="p-4 text-center">
          <div className="mb-4 d-flex justify-content-center">
            <div className="p-3 bg-danger-soft text-danger rounded-circle shadow-sm" style={{ width: 'fit-content' }}>
              <AlertTriangle size={40} />
            </div>
          </div>
          <h5 className="fw-bold text-navy mb-3">Confirmation</h5>
          <p className="small text-muted mb-4 fw-bold opacity-75">
            Are you sure you want to delete this session? This action is irreversible.
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button 
              variant="link" 
              className="text-muted fw-bold text-decoration-none border-0 px-4 shadow-none" 
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              className="rounded-pill px-4 fw-bold shadow-sm border-0 bg-danger"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <style>{`
        .day-cell {
          width: calc(100% / 7);
          min-height: 120px;
          border-color: var(--color-border) !important;
          transition: background-color 0.2s;
        }
        .day-cell:hover {
          background-color: var(--color-bg) !important;
        }
      `}</style>
    </div>
  );
};

export default JuryPlanning;
