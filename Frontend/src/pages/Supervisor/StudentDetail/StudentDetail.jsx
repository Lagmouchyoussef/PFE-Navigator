import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { User, Mail, Book, Calendar, ChevronLeft, FileText, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="supervisor-student-detail-layout py-4">
      <Container fluid className="px-4">
        <header className="mb-5">
          <Button 
            variant="link" 
            className="p-0 text-muted extra-small fw-bold text-decoration-none d-flex align-items-center gap-1 mb-3 hover-text-primary transition-all"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={14} /> Back to Students
          </Button>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy d-flex align-items-center gap-3">
              <div className="avatar-md bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '48px', height: '48px' }}>
                <User size={24} />
              </div>
              Student Profile
            </h2>
          </motion.div>
        </header>

        <div className="glass-card border shadow-sm border p-4">
          <div className="text-center py-5">
            <User size={64} className="text-primary opacity-25 mb-3" />
            <h5 className="fw-bold text-navy">Detailed Profile Interface</h5>
            <p className="text-muted small fw-bold opacity-75">
              The full profile view is currently under development. Here you will find student deliverables, evaluation history, and direct communication options.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StudentDetail;

