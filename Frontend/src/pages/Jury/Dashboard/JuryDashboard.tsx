import React from 'react';
import { 
  Container, Row, Col, Badge, Button, Table, Dropdown, Card
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  Star, Calendar, GraduationCap, ArrowRightCircle, MoreVertical, Briefcase,
  CheckCircle, Clock, MessageSquare, Activity, Bell, AlertCircle
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';
import JuryPerformanceChart from '../../../components/features/jury/JuryPerformanceChart';

import EmptyState from '../../../components/shared/EmptyState';

const JuryDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, notifications, evaluations, appointments } = useApp();

  const typeIcon = (type: string): JSX.Element => {
    if (type === 'grade')    return <Clock size={16} />;
    if (type === 'defense')  return <Calendar size={16} />;
    if (type === 'message')  return <MessageSquare size={16} />;
    if (type === 'approved') return <CheckCircle size={16} />;
    if (type === 'rejected') return <AlertCircle size={16} />;
    return <Activity size={16} />;
  };

  const typeColor = (type: string): 'primary' | 'success' | 'warning' | 'danger' | 'info' => {
    if (type === 'grade')    return 'warning';
    if (type === 'defense')  return 'primary';
    if (type === 'message')  return 'info';
    if (type === 'approved') return 'success';
    if (type === 'rejected') return 'danger';
    return 'primary';
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1)    return 'Just now';
    if (diff < 60)   return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const recentNotifs = (Array.isArray(notifications) ? notifications : []).slice(0, 4).map(n => ({
    id: n.id,
    title: n.title || (n.type ? n.type.charAt(0).toUpperCase() + n.type.slice(1) : 'Notification'),
    desc: n.message,
    time: n.created_at ? timeAgo(n.created_at) : 'Just now',
    icon: typeIcon(n.type),
    color: typeColor(n.type),
    link: n.link || '/jury/notifications',
  }));

  const evaluatedCount = (evaluations || []).filter((e: any) => e && e.jury_score !== null).length;
  const pendingEvals   = (evaluations || []).filter((e: any) => e && e.jury_score === null);

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
              value={(evaluations || []).length.toString()}
              icon={<Briefcase />}
              color="primary"
              trend="Total Projects"
              onClick={() => navigate('/jury/projects')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              label="Evaluations Done"
              value={evaluatedCount.toString()}
              icon={<CheckCircle />}
              color="success"
              trend={`${Math.round((evaluatedCount / ((evaluations || []).length || 1)) * 100)}% completed`}
              onClick={() => navigate('/jury/evaluation')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              label="Defenses"
              value={(appointments || []).filter((a: any) => a && (a.type === 'defense' || a.type === 'Defense') && a.status !== 'cancelled').length.toString()}
              icon={<Calendar />}
              color="warning"
              trend="Total Planning"
              onClick={() => navigate('/jury/schedule')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard
              label="Avg Grade Given"
              value={
                evaluatedCount > 0
                  ? ((evaluations || []).filter((e: any) => e && e.jury_score !== null).reduce((acc: number, e: any) => acc + Number.parseFloat(e.jury_score), 0) / evaluatedCount).toFixed(1)
                  : '--'
              }
              icon={<Star />}
              color="info"
              trend="Average / 20"
            />
          </Col>
        </Row>

        {/* Charts & Activities */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <JuryPerformanceChart />
          </Col>
          <Col lg={4}>
            <div className="glass-card p-4 h-100 d-flex flex-column">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Recent Notifications</h5>
              <div className="d-flex flex-column gap-3 flex-grow-1">
                {recentNotifs.length > 0 ? recentNotifs.map((act) => (
                  <div 
                    key={act.id} 
                    className="p-3 rounded-4 border bg-surface-alt hover-bg-surface transition-all cursor-pointer group shadow-sm-hover"
                    onClick={() => navigate(act.link)}
                  >
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
                )) : (
                  <div className="text-center py-5 text-muted extra-small fw-bold opacity-50">
                    <Bell size={32} className="mb-2 d-block mx-auto opacity-25" />
                    No recent notifications
                  </div>
                )}
              </div>
              <Button 
                className="btn-premium w-100 mt-4 py-3 rounded-4 fw-bold shadow-sm border-0 d-flex align-items-center justify-content-center gap-2"
                onClick={() => navigate('/jury/notifications')}
              >
                <Bell size={18} /> View all notifications
              </Button>
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
            {(evaluations || []).length > 0 ? (
              <Table borderless hover className="align-middle mb-0">
                <thead className="bg-surface-alt">
                  <tr className="border-bottom opacity-50">
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase">Project</th>
                    <th className="py-3 extra-small fw-bold text-muted text-uppercase">Status</th>
                    <th className="px-4 py-3 extra-small fw-bold text-muted text-uppercase text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingEvals.slice(0, 5).map((ev: any) => {
                    const proj = ev.project_detail || {};
                    const studentName  = proj.student?.name || `Student`;
                    const projectTitle = proj.title || `Project #${ev.project}`;
                    return (
                      <tr key={ev.id} className="border-bottom border-light border-opacity-10 transition-all hover-bg-surface-alt cursor-pointer">
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="avatar-sm bg-primary-soft text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '32px', height: '32px', fontSize: '0.7rem' }}>
                              {studentName.charAt(0)}
                            </div>
                            <div>
                              <div className="small fw-bold text-navy">{studentName}</div>
                              <div className="extra-small text-muted text-truncate fw-bold opacity-50" style={{ maxWidth: '180px' }}>{projectTitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className="bg-warning-soft text-warning border-0 extra-small fw-bold px-3 py-1">Pending</Badge>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <Button
                            variant="link"
                            className="p-0 text-primary extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 justify-content-end hover-opacity-75 transition-all"
                            onClick={() => navigate('/jury/evaluation')}
                          >
                            Evaluate <ArrowRightCircle size={14} />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {pendingEvals.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-5 text-center">
                        <EmptyState
                          title="All Evaluations Completed"
                          message="You have no pending project evaluations at this time. Great job!"
                          icon={<CheckCircle size={48} />}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            ) : (
              <div className="py-5">
                <EmptyState
                  title="No Assigned Projects"
                  message="You are not currently assigned to any jury committees. Check back later for your assignment schedule."
                  icon={<Briefcase size={48} />}
                />
              </div>
            )}
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default JuryDashboard;
