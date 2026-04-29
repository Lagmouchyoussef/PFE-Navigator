import React from 'react';
import { Container, Card, Row, Col, Badge, Button } from 'react-bootstrap';
import { 
  FileText, Clock, ShieldCheck, Info, AlertCircle, ChevronRight, Bookmark
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const AdministrativeNotesPage = () => {
  const { session } = useApp();
  const role = session?.role || 'student';

  const MOCK_NOTES = {
    student: [
      {
        id: 1,
        title: 'Project Submission Deadline Extended',
        type: 'Urgent',
        content: 'Please note that the final submission deadline for PFE reports has been extended to May 20th, 2026. Make sure all technical documentation is included.',
        time: '2 hours ago',
        category: 'danger'
      },
      {
        id: 2,
        title: 'Defense Dress Code Policy',
        type: 'General',
        content: 'Professional business attire is mandatory for all oral defenses. Students failing to comply may face grade deductions.',
        time: 'Yesterday',
        category: 'info'
      }
    ],
    jury: [
      {
        id: 3,
        title: 'Evaluation Grid Calibration',
        type: 'Important',
        content: 'A new calibration meeting for the evaluation grids will be held on May 5th. All jury members are required to attend to ensure grading consistency.',
        time: '3 hours ago',
        category: 'primary'
      }
    ],
    supervisor: [
      {
        id: 4,
        title: 'Mid-term Progress Reports Due',
        type: 'Urgent',
        content: 'Supervisors must validate all mid-term progress reports by the end of this week. Please ensure student feedback is properly documented in the system.',
        time: '5 hours ago',
        category: 'warning'
      }
    ]
  };

  const notes = MOCK_NOTES[role] || [];

  return (
    <div className="dashboard-container bg-light min-vh-100 p-4">
      <Container fluid>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1">Administrative Bulletins</h3>
            <p className="text-muted small mb-0">Official communications and academic directives for the {role} portal.</p>
          </div>
          <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 py-2 rounded-pill small fw-bold">
            <ShieldCheck size={14} className="me-2" /> Verified Source
          </Badge>
        </div>

        <Row className="g-4">
          {/* Main Feed */}
          <Col lg={8}>
            <div className="d-flex flex-column gap-4">
              {notes.length > 0 ? notes.map((note) => (
                <Card key={note.id} className="border-0 shadow-sm rounded-3 overflow-hidden bg-white border-start border-4" style={{ borderColor: `var(--bs-${note.category})` }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="fw-bold text-dark mb-0">{note.title}</h5>
                      <Badge bg={note.category} className="bg-opacity-10 text-opacity-100 px-3 py-1 extra-small fw-bold border-0" style={{ color: `var(--bs-${note.category})` }}>
                        {note.type}
                      </Badge>
                    </div>
                    <p className="small text-muted mb-4 fw-medium lh-lg">{note.content}</p>
                    <div className="d-flex justify-content-between align-items-center pt-3 border-top border-light">
                      <div className="d-flex align-items-center text-muted extra-small fw-bold">
                        <Clock size={14} className="me-2" /> Posted {note.time} by Academic Affairs
                      </div>
                      <Button variant="link" className="p-0 extra-small fw-bold text-primary text-decoration-none">
                        Acknowledge Directive <ChevronRight size={14} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              )) : (
                <Card className="border-0 shadow-sm rounded-3 p-5 text-center bg-white">
                  <Info size={48} className="text-muted opacity-25 mb-3 mx-auto" />
                  <p className="small fw-bold text-muted">No active directives for your role.</p>
                </Card>
              )}
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm rounded-3 p-4 mb-4 bg-primary text-white">
              <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Bookmark size={18} /> Compliance & Policy
              </h6>
              <p className="extra-small opacity-75 mb-4 lh-lg fw-medium">
                The directives published here are legally binding within the institutional framework. Please review all "Urgent" memos immediately.
              </p>
              <div className="p-3 rounded-3 bg-white bg-opacity-10 border border-white border-opacity-10 d-flex align-items-center gap-3">
                <ShieldCheck size={24} className="text-white" />
                <div>
                  <h6 className="fw-bold mb-0 extra-small text-white">EMSI Official</h6>
                  <p className="mb-0 extra-small opacity-75">Board of Education v2.0</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm rounded-3 p-4 bg-white">
               <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><AlertCircle size={18} className="text-primary" /> Key Contacts</h6>
               <div className="d-flex flex-column gap-3">
                 <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle-sm bg-light text-primary fw-bold">A</div>
                    <div>
                      <div className="extra-small fw-bold text-dark">Academic Dept.</div>
                      <div className="extra-small text-muted">admin@emsi.ma</div>
                    </div>
                 </div>
                 <div className="d-flex align-items-center gap-3">
                    <div className="avatar-circle-sm bg-light text-primary fw-bold">S</div>
                    <div>
                      <div className="extra-small fw-bold text-dark">Student Office</div>
                      <div className="extra-small text-muted">support@emsi.ma</div>
                    </div>
                 </div>
               </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdministrativeNotesPage;
