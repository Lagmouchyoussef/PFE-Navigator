import React from 'react';
import { 
  Container, Row, Col, Card, Badge, 
  ProgressBar, Button, Table, Dropdown
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Clock, FileText, GraduationCap, 
  Plus, MoreHorizontal, TrendingUp, Target,
  AlertCircle, Activity, Download, Eye,
  Mail, MessageSquare, Calendar, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import { useApp } from '../../../context/AppContext.jsx';
import './StudentDashboard.css';

/**
 * Professional Dashboard Sub-components
 */

const DashboardHeader = ({ name, onNewSubmission }) => (
  <header className="sd-welcome-header mb-4">
    <div className="d-flex justify-content-between align-items-end">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="sd-welcome-title mb-1">Welcome, {name}</h1>
        <p className="sd-welcome-subtitle fw-bold mb-0">
          PFE Management System • 2026 PFE Candidate
        </p>
      </motion.div>
      <div className="d-flex gap-3">
        <Button 
          className="btn-pro-primary d-flex align-items-center gap-2 shadow-sm rounded-pill px-4"
          onClick={onNewSubmission}
        >
          <Plus size={18} /> New Submission
        </Button>
      </div>
    </div>
  </header>
);

const StatCard = ({ label, value, sub, color, icon, delay = 0 }) => (
  <Col lg={3} md={6}>
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className="sd-card-professional h-100 border-0 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center p-4">
          <div>
            <div className="text-uppercase extra-small fw-bold mb-1 tracking-wider" style={{ color: '#000000' }}>{label}</div>
            <h3 className="fw-bold mb-0 text-navy">{value}</h3>
            {sub && <div className="mt-1 text-primary small fw-semibold">{sub}</div>}
          </div>
          <div className={`sd-stat-icon bg-pfe-${color}`}>
            {React.cloneElement(icon, { size: 28 })}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  </Col>
);

const ProjectStepper = ({ steps }) => (
  <Card className="sd-card-professional border-0 mb-4 overflow-hidden">
    <div className="sd-card-header-clean d-flex justify-content-between align-items-center">
      <h5>Project Steps</h5>
      <Badge className="badge-soft-primary">Active Phase: Final Report</Badge>
    </div>
    <Card.Body className="py-5 bg-white">
      <div className="position-relative px-4">
        <div className="sd-stepper-line"></div>
        <div className="sd-stepper-line-fill"></div>
        <div className="sd-stepper-row">
          {steps.map((step, i) => (
            <div key={i} className={`sd-stepper-item ${step.status}`}>
              <div className="sd-stepper-dot shadow-sm">
                {step.status === 'completed' ? <CheckCircle size={26} /> : i + 1}
              </div>
              <div className="text-center mt-2">
                <div className={`small fw-bold ${step.status === 'pending' ? 'text-muted' : 'text-navy'}`}>
                  {step.name}
                </div>
                <div className="extra-small fw-bold text-uppercase" style={{ fontSize: '0.65rem', color: '#000000' }}>
                  {step.status === 'completed' ? 'Validated' : step.status === 'active' ? 'In Progress' : 'Pending'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card.Body>
  </Card>
);

const AnalyticsView = () => {
  const barData = [
    { name: 'Jan', score: 65 }, { name: 'Feb', score: 78 },
    { name: 'Mar', score: 82 }, { name: 'Apr', score: 90 },
  ];

  return (
    <Row className="g-4 mb-4">
      <Col lg={7}>
        <Card className="sd-card-professional border-0 h-100">
          <div className="sd-card-header-clean">
            <h5>Engagement & Performance</h5>
          </div>
          <Card.Body>
            <div style={{ height: '220px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" fill="#0046ad" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col lg={5}>
        <Card className="sd-card-professional border-0 h-100 bg-navy text-white">
          <Card.Body className="p-4 d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="fw-bold text-uppercase opacity-50 small tracking-widest">Confidence Score</h6>
                <h1 className="display-4 fw-bold mb-0 mt-2">98.2</h1>
              </div>
              <div className="p-3 bg-white bg-opacity-10 rounded-lg text-success">
                <Target size={28} />
              </div>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-success">
              <div className="d-flex align-items-center gap-2 small">
                <Target size={18} />
                <span className="fw-bold">Goal: Highest Distinction</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between small mb-2">
                <span>Goal Progression</span>
                <span className="fw-bold">Excellent</span>
              </div>
              <ProgressBar now={90} variant="info" style={{ height: '8px' }} className="bg-white bg-opacity-10 rounded-pill" />
              <p className="extra-small fw-bold mt-3 mb-0 text-center">
                Based on submission punctuality and feedback.
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

const DocumentsList = ({ documents, onView, onDownload, onDelete, navigate }) => (
  <Card className="sd-card-professional border-0">
    <div className="sd-card-header-clean d-flex justify-content-between align-items-center">
      <h5>Recent Documents</h5>
      <Button 
        variant="link" 
        className="text-primary small fw-bold text-decoration-none"
        onClick={() => navigate('/student/reports')}
      >
        View all
      </Button>
    </div>
    <div className="p-0">
      <Table responsive hover className="mb-0 sd-table-pro">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Type</th>
            <th>Last Modified</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => (
            <tr key={i}>
              <td>
                <div className="d-flex align-items-center gap-3">
                  <div className="sd-doc-avatar">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="fw-bold small">{doc.title || doc.name}</div>
                    <div className="extra-small text-muted">{doc.size}</div>
                  </div>
                </div>
              </td>
              <td>
                <Badge className="badge-pdf px-3 py-1">PDF Document</Badge>
              </td>
              <td className="small text-muted fw-medium">{doc.date}</td>
              <td className="text-end">
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="p-0 no-caret text-muted">
                    <MoreHorizontal size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="border-0 shadow-lg small">
                    <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => onView(doc)}>
                      <Eye size={14} /> View
                    </Dropdown.Item>
                    <Dropdown.Item className="d-flex align-items-center gap-2" onClick={() => onDownload(doc)}>
                      <Download size={14} /> Download
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-danger d-flex align-items-center gap-2" onClick={() => onDelete(doc.id)}>
                      <Plus size={14} className="rotate-45" /> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  </Card>
);

const SidebarWidgets = ({ navigate }) => {
  const progressData = [
    { name: 'Done', value: 75, color: '#0046ad' },
    { name: 'Todo', value: 25, color: '#f1f5f9' },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      {/* Overall Progress */}
      <Card className="sd-card-professional border-0 p-4 shadow-sm">
        <div className="sd-widget-title">
          <span>Global Progress</span>
          <Activity size={16} className="text-primary" />
        </div>
        <div className="position-relative d-flex justify-content-center align-items-center" style={{ height: '140px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={progressData} innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value" stroke="none">
                {progressData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="position-absolute text-center">
            <div className="h4 fw-bold mb-0 text-navy">75%</div>
            <div className="extra-small text-muted fw-bold">COMPLETED</div>
          </div>
        </div>
        <Row className="g-2 text-center mt-3">
          <Col xs={6}>
            <div className="bg-light p-2 rounded-lg border">
              <div className="text-primary fw-bold small">15</div>
              <div className="extra-small text-muted">Completed</div>
            </div>
          </Col>
          <Col xs={6}>
            <div className="bg-light p-2 rounded-lg border">
              <div className="text-navy fw-bold small">05</div>
              <div className="extra-small text-muted">Remaining</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Upcoming Defense Widget */}
      <Card className="sd-card-professional border-0 p-4 shadow-sm bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0">Upcoming Defense</h6>
          <Calendar size={18} className="opacity-75" />
        </div>
        <div className="mb-3">
          <div className="fw-bold fs-6 mb-1">Final Defense Presentation</div>
          <div className="small opacity-75">May 20, 2026</div>
          <div className="extra-small opacity-75 mt-1 d-flex align-items-center gap-1">
            <Clock size={12} /> 10:00 AM - Room 304
          </div>
        </div>
        <Button 
          variant="light" 
          size="sm" 
          className="w-100 fw-bold rounded-pill text-primary"
          onClick={() => alert("Détails de convocation: \nDate: 20 Mai 2026\nSalle: 304\nHeure: 10:00 AM")}
        >
          Convocation Details
        </Button>
      </Card>

      {/* Recent Feedback Widget */}
      <Card className="sd-card-professional border-0 p-4 shadow-sm">
        <div className="sd-widget-title mb-3">
          <span>Recent Feedback</span>
          <MessageSquare size={16} className="text-primary" />
        </div>
        <div className="p-3 bg-light rounded-lg border-start border-primary border-4">
          <div className="fw-bold small mb-1 text-navy">Interim Report Revision</div>
          <p className="extra-small text-muted mb-2">
            "Please revise sections 3.2 and 4.1. Good progress overall!"
          </p>
          <div className="d-flex justify-content-between align-items-center extra-small mt-2">
            <span className="text-primary fw-bold">Dr. Sarah Smith</span>
            <span className="opacity-50">2 days ago</span>
          </div>
        </div>
      </Card>

      {/* Supervisor Card */}
      <Card className="sd-card-professional border-0 p-4 shadow-sm">
        <div className="sd-widget-title">Academic Supervisor</div>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="sd-avatar-pro">SS</div>
          <div>
            <h6 className="fw-bold mb-0">Dr. Sarah Smith</h6>
            <div className="extra-small text-muted">AI Systems Lab</div>
          </div>
        </div>
        <Button 
          className="btn-pro-outline w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={() => navigate('/student/messages')}
        >
          <Mail size={16} /> Send Message
        </Button>
      </Card>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { 
    documents: globalDocs, 
    deleteDocument, 
    progressPct, 
    approvedDocs, 
    totalRequired 
  } = useApp();

  const handleNewSubmission = () => {
    navigate('/student/reports');
  };

  const handleView = (doc) => {
    window.open('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
  };

  const handleDownload = (doc) => {
    alert(`Downloading ${doc.name}...`);
  };

  const steps = [
    { name: 'Proposal', status: 'completed' },
    { name: 'Interim Report', status: 'completed' },
    { name: 'Final Report', status: 'active' },
    { name: 'Defense', status: 'pending' },
  ];

  const documents = [
    { name: 'Final_Report_Draft_v1.pdf', date: 'Apr 28, 2026', size: '3.1 MB' },
    { name: 'Interim_Report_Validated.pdf', date: 'Mar 15, 2026', size: '2.4 MB' },
  ];

  return (
    <div className="sd-dashboard-layout">
      <Container fluid="xxl" className="px-0">
        <DashboardHeader name="Ahmed Khalil" onNewSubmission={handleNewSubmission} />

        {/* Global Statistics Grid */}
        <Row className="g-4 mb-5">
          <StatCard label="Upcoming Events" value="05" color="blue" icon={<Calendar />} delay={0.1} />
          <StatCard label="Pending Deadlines" value="02" color="orange" icon={<Clock />} delay={0.2} />
          <StatCard label="Tasks This Month" value="05" color="green" icon={<CheckCircle />} delay={0.3} />
          <StatCard label="Average Score" value="18.5" color="navy" icon={<GraduationCap />} delay={0.4} />
        </Row>

        <Row className="g-5">
          <Col lg={8}>
            <ProjectStepper steps={steps} />
            <AnalyticsView />
            <DocumentsList 
              documents={globalDocs} 
              onView={handleView} 
              onDownload={handleDownload} 
              onDelete={(id) => {
                if(window.confirm('Are you sure you want to delete this document?')) deleteDocument(id);
              }} 
              navigate={navigate}
            />
          </Col>
          <Col lg={4}>
            <SidebarWidgets navigate={navigate} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentDashboard;
