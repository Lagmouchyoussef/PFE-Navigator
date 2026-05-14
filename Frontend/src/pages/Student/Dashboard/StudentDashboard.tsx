import React from 'react';
import { 
  Container, Row, Col, Card, Button 
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  CheckCircle, GraduationCap, 
  Plus, Activity, Mail, MessageSquare, Calendar, 
  Clock, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import StatCard from '../../../components/shared/StatCard';
import ProjectStepper, { Step } from '../../../components/features/student/ProjectStepper';
import AnalyticsView from '../../../components/features/student/AnalyticsView';
import DocumentsList from '../../../components/features/student/DocumentsList';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user,
    documents: globalDocs, 
    deleteDocument, 
    projectMilestones,
    finalResultMessage,
    isProjectValidated,
    appointments
  } = useApp();

  const handleNewSubmission = () => {
    navigate('/student/reports');
  };

  const handleView = () => {
    window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
  };

  const handleDownload = (doc: any) => {
    alert(`Downloading ${doc.title}...`);
  };

  const steps: Step[] = projectMilestones.map(m => ({
    name: m.title,
    status: m.status as any
  }));

  const progressData = [
    { name: 'Done', value: 75, color: 'var(--color-primary)' },
    { name: 'Todo', value: 25, color: 'var(--color-surface-alt)' },
  ];

  return (
    <div className="student-dashboard-layout py-4">
      <Container fluid className="px-4">
        <header className="mb-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="fw-bold mb-1 text-navy">Ravi de vous revoir, {user?.name}</h2>
              <p className="text-muted small mb-0 fw-bold opacity-75">
                Système PFE • Candidat PFE 2026
              </p>
            </motion.div>
            <div className="d-flex gap-2">
              <Button 
                className="btn-premium d-flex align-items-center gap-2 shadow-sm"
                onClick={handleNewSubmission}
              >
                <Plus size={18} /> New Submission
              </Button>
            </div>
          </div>
        </header>

        {finalResultMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-5 p-4 rounded-4 border-2 border-dashed ${isProjectValidated ? 'bg-success-soft border-success' : 'bg-danger-soft border-danger'}`}
          >
            <div className="d-flex align-items-center gap-4">
              <div className={`p-3 rounded-circle ${isProjectValidated ? 'bg-success text-white' : 'bg-danger text-white'}`}>
                {isProjectValidated ? <CheckCircle size={32} /> : <Activity size={32} />}
              </div>
              <div>
                <h3 className={`fw-bold mb-1 ${isProjectValidated ? 'text-success' : 'text-danger'}`}>
                  {finalResultMessage}
                </h3>
                <p className="text-muted small mb-0 fw-bold opacity-75">
                  {isProjectValidated 
                    ? "Félicitations pour la réussite de votre projet de fin d'études !" 
                    : "Nous vous invitons à contacter l'administration pour plus de détails."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Global Statistics Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard 
              label="Événements à venir" 
              value={appointments.length.toString()} 
              color="primary" 
              icon={<Calendar />} 
              onClick={() => navigate('/student/schedule')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard 
              label="Pending Deadlines" 
              value="2" 
              color="warning" 
              icon={<Clock />} 
              trend="2 weeks" 
              onClick={() => navigate('/student/schedule')}
            />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Tasks Completed" value="5" color="success" icon={<CheckCircle />} trend="+2" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Average Score" value="18.5" color="info" icon={<GraduationCap />} />
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={8}>
            <ProjectStepper steps={steps} />
            <AnalyticsView />
            <DocumentsList 
              documents={globalDocs.slice(0, 5)} 
              onView={handleView} 
              onDownload={handleDownload} 
              onDelete={(id) => {
                if(window.confirm('Are you sure you want to delete this document?')) deleteDocument(id);
              }} 
              onViewAll={() => navigate('/student/reports')}
            />
          </Col>
          <Col lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Overall Progress */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 text-navy">Global Progress</h6>
                  <Activity size={18} className="text-primary" />
                </div>
                <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '160px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={progressData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                        {progressData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="position-absolute text-center">
                    <div className="h3 fw-bold mb-0 text-navy">75%</div>
                    <div className="extra-small text-muted fw-bold">COMPLETED</div>
                  </div>
                </div>
              </Card>

              {/* Upcoming Defense Widget */}
              <Card className="glass-card border p-4 shadow-sm bg-primary text-white border-0">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0 text-white">Prochaine Soutenance</h6>
                  <Calendar size={18} className="opacity-75" />
                </div>
                <div className="mb-4">
                  <div className="fw-bold fs-6 mb-1">{appointments[0]?.title || "Soutenance de PFE"}</div>
                  <div className="small opacity-75">{appointments[0]?.date || "15 Mai, 2026"}</div>
                  <div className="extra-small opacity-75 mt-1 d-flex align-items-center gap-1">
                    <Clock size={12} /> {appointments[0]?.time || "09:00"} - {appointments[0]?.location || "Salle de Conférence A"}
                  </div>
                </div>
                <Button 
                  variant="light" 
                  size="sm" 
                  className="w-100 fw-bold rounded-pill text-primary py-2 border-0"
                  onClick={() => navigate('/student/schedule')}
                >
                  Détails de la Convocation
                </Button>
              </Card>

              {/* Recent Feedback Widget */}
              <Card className="glass-card border p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h6 className="fw-bold mb-0 text-navy">Retours Récents</h6>
                  <MessageSquare size={18} className="text-primary" />
                </div>
                <div className="p-3 bg-surface-alt rounded-4 border-start border-primary border-4">
                  <div className="fw-bold small mb-1 text-navy">Révision du Rapport Initial</div>
                  <p className="extra-small text-muted mb-2">
                    "Veuillez réviser les sections 3.2 et 4.1. Bon progrès dans l'ensemble !"
                  </p>
                  <div className="d-flex justify-content-between align-items-center extra-small mt-2">
                    <span className="text-primary fw-bold">Dr. Sofia Drissi</span>
                    <span className="opacity-50">Il y a 2 jours</span>
                  </div>
                </div>
              </Card>

              {/* Supervisor Card */}
              <Card className="glass-card border p-4 shadow-sm">
                <h6 className="fw-bold mb-4 text-navy">Encadrant Académique</h6>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="avatar-md bg-primary text-white rounded-4 d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '48px', height: '48px' }}>
                    SD
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-navy">Dr. Sofia Drissi</h6>
                    <div className="extra-small text-muted fw-bold">Département Informatique</div>
                  </div>
                </div>
                <Button 
                  className="btn-pro-outline w-100 d-flex align-items-center justify-content-center gap-2 border-2"
                  onClick={() => navigate('/student/messages')}
                >
                  <Mail size={16} /> Send Message
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;
