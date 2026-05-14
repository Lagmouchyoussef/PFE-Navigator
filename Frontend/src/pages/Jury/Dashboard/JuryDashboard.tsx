import React from 'react';
import { 
  Container, Row, Col, Badge, Button, Table, Dropdown, Card
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Calendar, GraduationCap, ArrowRightCircle, MoreVertical, Briefcase,
  CheckCircle, Clock, MessageSquare, Activity
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';
import JuryPerformanceChart from '../../../components/features/jury/JuryPerformanceChart';

const RECENT_ACTIVITIES = [
  { id: 1, title: 'Nouvelle évaluation assignée', time: 'Il y a 2 heures', desc: 'Le projet "Blockchain Certificate Verification" nécessite votre évaluation', icon: <Clock size={16} />, color: 'warning' as const },
  { id: 2, title: 'Soutenance programmée', time: 'Il y a 5 heures', desc: "Soutenance prévue le 5 Mai à 9:00 en salle A-204", icon: <Calendar size={16} />, color: 'primary' as const },
  { id: 3, title: 'Nouveau message', time: 'Hier', desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation', icon: <MessageSquare size={16} />, color: 'info' as const },
  { id: 4, title: 'Mise à jour du système', time: 'Il y a 2 jours', desc: 'Nouvelles fonctionnalités disponibles dans le tableau de bord', icon: <Activity size={16} />, color: 'success' as const },
];

const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  return (
    <div className="jury-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Jury Dashboard</h2>
            <p className="text-muted small mb-0">Track your evaluations and defense schedule, Prof. {user?.name}.</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2"
              onClick={() => navigate('/jury/schedule')}
            >
              <Calendar size={18} /> My Calendar
            </Button>
            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => navigate('/jury/evaluation')}
            >
              <GraduationCap size={18} /> Evaluate Project
            </Button>
          </div>
        </div>

        {/* Top Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard 
              label="Assigned Projects" 
              value="12" 
              icon={<Briefcase />} 
              color="primary" 
              trend="+2" 
              onClick={() => navigate('/jury/projects')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard 
              label="Evaluations Done" 
              value="8" 
              icon={<CheckCircle />} 
              color="success" 
              trend="66%" 
              onClick={() => navigate('/jury/evaluation')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard 
              label="Defenses" 
              value="4" 
              icon={<Calendar />} 
              color="warning" 
              trend="This Week" 
              onClick={() => navigate('/jury/schedule')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Avg Grade Given" value="15.4" icon={<Star />} color="info" trend="+1.2" />
          </Col>
        </Row>

        {/* Charts & Activities */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <JuryPerformanceChart />
          </Col>
          <Col lg={4}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2">Recent Activities</h5>
              <div className="d-flex flex-column gap-3">
                {RECENT_ACTIVITIES.map((act) => (
                  <div key={act.id} className="p-3 rounded-4 border bg-surface-alt hover-bg-surface transition-all cursor-pointer">
                    <div className="d-flex gap-3">
                      <div className={`p-2 rounded-3 bg-${act.color}-soft text-${act.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                        {act.icon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="small fw-bold mb-1 text-navy">{act.title}</div>
                        <p className="extra-small text-muted mb-1 text-truncate fw-bold opacity-75">{act.desc}</p>
                        <div className="extra-small text-muted opacity-50 fw-bold">{act.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-100 mt-4 extra-small fw-bold text-primary text-decoration-none transition-all hover-opacity-75">View full history</Button>
            </div>
          </Col>
        </Row>

        {/* Assigned Projects Table Preview */}
        <Card className="glass-card rounded-4 overflow-hidden mb-5 border-light border-opacity-10">
          <Card.Header className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center border-0">
            <div>
              <h5 className="fw-bold mb-0 text-navy">Projects Pending Evaluation</h5>
              <p className="extra-small text-muted mb-0 fw-bold opacity-75">Supervise upcoming PFE submissions and milestones.</p>
            </div>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none transition-all hover-opacity-75" onClick={() => navigate('/jury/projects')}>Manage all projects</Button>
          </Card.Header>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0">
              <thead className="bg-surface-alt">
                <tr className="border-bottom opacity-50">
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Student / Project</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Thematic</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Deadline</th>
                  <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                  <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Ahmed Khalil', project: 'Gestion PFE avec IA', category: 'Intelligence Artificielle', deadline: 'Dans 2j', status: 'En Attente' },
                  { name: 'Sara Bennani', project: 'Blockchain Diplômes', category: 'Blockchain', deadline: 'Dans 5j', status: 'En Cours' },
                  { name: 'Mehdi Alami', project: 'Smart Campus IoT', category: 'IoT', deadline: 'Demain', status: 'Urgent' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div className="small fw-bold text-navy">{row.name}</div>
                          <div className="extra-small text-muted text-truncate fw-bold opacity-50" style={{maxWidth: '180px'}}>{row.project}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge className="bg-primary-soft text-primary border-0 extra-small fw-bold px-2 py-1 rounded-pill">
                        {row.category}
                      </Badge>
                    </td>
                    <td className="py-3 extra-small text-navy fw-bold opacity-75">{row.deadline}</td>
                    <td className="py-3">
                      <Badge className={`bg-${row.status === 'Urgent' ? 'danger' : 'warning'}-soft text-${row.status === 'Urgent' ? 'danger' : 'warning'} border-0 extra-small fw-bold px-3 py-1`}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Button variant="link" className="p-0 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 justify-content-end hover-opacity-75 transition-all">Details <ArrowRightCircle size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default JuryDashboard;
