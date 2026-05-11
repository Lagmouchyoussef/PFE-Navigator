import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext.jsx';
import { motion } from 'framer-motion';
import { 
  GraduationCap, UserCog, Users, Shield, 
  ArrowRight, Key, Layout
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useApp();

  const roles = [
    { 
      id: 'student', 
      title: 'Student Portal', 
      desc: 'Access your PFE workspace and submit reports.', 
      icon: <GraduationCap size={32} />,
      color: '#3498db'
    },
    { 
      id: 'supervisor', 
      title: 'Faculty Portal', 
      desc: 'Monitor students and evaluate project milestones.', 
      icon: <Users size={32} />,
      color: '#27ae60'
    },
    { 
      id: 'jury', 
      title: 'Jury Board', 
      desc: 'Review final projects and manage defense sessions.', 
      icon: <UserCog size={32} />,
      color: '#f39c12'
    },
    { 
      id: 'admin', 
      title: 'Admin Center', 
      desc: 'System-wide management and academic coordination.', 
      icon: <Shield size={32} />,
      color: '#2c3e50'
    }
  ];

  return (
    <div className="login-page-modern min-vh-100 d-flex align-items-center bg-light py-5">
      <Container>
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="d-inline-block p-3 rounded-4 bg-white shadow-sm mb-4"
          >
            <Layout className="text-primary" size={40} />
          </motion.div>
          <h1 className="fw-black text-navy tracking-tighter mb-2">PFE Sync Platform</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '500px' }}>
            Welcome to the academic project management system. Select your profile below to enter your dedicated workspace.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {roles.map((role, i) => (
            <Col key={role.id} lg={3} md={6}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => login(role.id)}
                className="h-100"
              >
                <Card className="h-100 border-0 shadow-sm rounded-4 p-4 cursor-pointer login-role-card position-relative overflow-hidden">
                  <div 
                    className="position-absolute top-0 end-0 p-3 opacity-10" 
                    style={{ transform: 'translate(20%, -20%)' }}
                  >
                    {React.cloneElement(role.icon, { size: 100 })}
                  </div>
                  
                  <div 
                    className="p-3 rounded-4 mb-4 d-inline-block" 
                    style={{ background: `${role.color}15`, color: role.color }}
                  >
                    {role.icon}
                  </div>
                  
                  <h5 className="fw-bold text-navy mb-2">{role.title}</h5>
                  <p className="extra-small text-muted mb-4">{role.desc}</p>
                  
                  <div className="mt-auto d-flex align-items-center gap-2 text-primary fw-bold small">
                    Quick Connect <ArrowRight size={16} />
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <div className="extra-small text-muted mb-3 d-flex align-items-center justify-content-center gap-2">
            <Key size={12} /> Secure Single-Sign-On Active
          </div>
          <div className="fw-bold small text-navy opacity-50">EMSI Academic Group © 2026</div>
        </div>
      </Container>

      <style>{`
        .login-page-modern { background-color: #f8fafc !important; }
        .fw-black { font-weight: 900; }
        .tracking-tighter { letter-spacing: -0.05em; }
        .text-navy { color: #2c3e50 !important; }
        .cursor-pointer { cursor: pointer; }
        .login-role-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent !important; }
        .login-role-card:hover { border-color: var(--bs-primary) !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; }
        .extra-small { font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default LoginPage;

