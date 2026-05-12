import React from 'react';
import { 
  Container, Row, Col, Badge, 
  Button, Table, Dropdown 
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
  { id: 2, title: 'Soutenance programmée', time: 'Il y a 5 heures', desc: "Soutenance prévue le 5 Mai à 09:00 en salle A-204", icon: <Calendar size={16} />, color: 'primary' as const },
  { id: 3, title: 'Nouveau message', time: 'Hier', desc: 'Prof. Martin vous a envoyé un message concernant la grille d\'évaluation', icon: <MessageSquare size={16} />, color: 'info' as const },
  { id: 4, title: 'Mise à jour du système', time: 'Il y a 2 jours', desc: 'Nouvelles fonctionnalités disponibles dans le tableau de bord', icon: <Activity size={16} />, color: 'success' as const },
];

const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { session } = useApp();

  return (
    <div className="jury-modern-layout py-4">
      <Container fluid className="px-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-gradient">Jury Dashboard</h2>
            <p className="text-muted small mb-0">Track your evaluations and defense schedule, Prof. {session?.name}.</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2">
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
            <StatCard label="Assigned Projects" value="12" icon={<Briefcase />} color="primary" trend="+2" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Evaluations Done" value="08" icon={<CheckCircle />} color="success" trend="66%" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Defenses" value="04" icon={<Calendar />} color="warning" trend="This Week" />
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
                      <div className={`p-2 rounded-3 bg-${act.color} bg-opacity-10 text-${act.color} flex-shrink-0`} style={{ height: 'fit-content' }}>
                        {act.icon}
                      </div>
                      <div className="overflow-hidden">
                        <div className="small fw-bold mb-1 text-navy">{act.title}</div>
                        <p className="extra-small text-muted mb-1 text-truncate">{act.desc}</p>
                        <div className="extra-small text-muted opacity-75">{act.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-100 mt-4 extra-small fw-bold text-primary text-decoration-none">View full history</Button>
            </div>
          </Col>
        </Row>

        {/* Assigned Projects Table Preview */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h5 className="fw-bold mb-0">Projects Pending Evaluation</h5>
              <p className="extra-small text-muted mb-0">Supervise upcoming PFE submissions and milestones.</p>
            </div>
            <Button variant="link" className="extra-small fw-bold text-primary p-0 text-decoration-none" onClick={() => navigate('/jury/projects')}>Manage all projects</Button>
          </div>
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
                  { name: 'Amin Mansouri', project: 'EcoTrack Blockchain', category: 'Blockchain', deadline: 'In 2d', status: 'Pending' },
                  { name: 'Sara Bennani', project: 'Smart City API', category: 'IoT', deadline: 'In 5d', status: 'In Review' },
                  { name: 'Khalid Tazi', project: 'CyberSafe VPN', category: 'Security', deadline: 'Tomorrow', status: 'Urgent' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-bottom border-light border-opacity-10 transition-all">
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className="avatar-sm bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                          {row.name.charAt(0)}
                        </div>
                        <div>
                          <div className="small fw-bold text-navy">{row.name}</div>
                          <div className="extra-small text-muted text-truncate" style={{maxWidth: '180px'}}>{row.project}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-25 extra-small">
                        {row.category}
                      </Badge>
                    </td>
                    <td className="py-3 small text-muted">{row.deadline}</td>
                    <td className="py-3">
                      <Badge bg={row.status === 'Urgent' ? 'danger' : 'warning'} className="extra-small rounded-pill">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-end">
                      <Button variant="link" className="p-0 text-primary extra-small fw-bold text-decoration-none">Details <ArrowRightCircle size={14} className="ms-1" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default JuryDashboard;
