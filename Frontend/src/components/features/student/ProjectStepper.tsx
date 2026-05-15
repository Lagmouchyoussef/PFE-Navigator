import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';

export interface Step {
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface ProjectStepperProps {
  steps: Step[];
}

const ProjectStepper: React.FC<ProjectStepperProps> = ({ steps }) => {
  const activeStep = steps.find(s => s.status === 'active' || s.status === 'current' as any);
  const completedCount = steps.filter(s => s.status === 'completed').length;
  const progressWidth = steps.length > 0 ? (completedCount / (steps.length - 1)) * 100 : 0;

  return (
    <Card className="glass-card border-0 mb-4 overflow-hidden border">
      <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-white">
        <h5 className="fw-bold mb-0 text-navy">Project Progress</h5>
        <Badge className="bg-primary-soft text-primary border-0 px-3 py-2 rounded-pill extra-small fw-bold">
          Active Phase: {activeStep?.name || "Initializing"}
        </Badge>
      </div>
      <Card.Body className="py-5 bg-white">
        <div className="position-relative px-4">
          {/* Progress Line */}
          <div className="position-absolute top-50 start-0 w-100 bg-surface-alt" style={{ height: '2px', transform: 'translateY(-16px)', zIndex: 0 }}></div>
          <div className="position-absolute top-50 start-0 bg-primary transition-all duration-500" style={{ height: '2px', width: `${progressWidth}%`, transform: 'translateY(-16px)', zIndex: 1 }}></div>
          
          <div className="d-flex justify-content-between position-relative" style={{ zIndex: 2 }}>
            {steps.map((step, i) => (
              <div key={i} className="d-flex flex-column align-items-center" style={{ flex: 1 }}>
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center shadow-sm transition-all mb-3 ${
                    step.status === 'completed' ? 'bg-success text-white' : 
                    (step.status === 'active' || step.status === 'current' as any) ? 'bg-primary text-white scale-110' : 
                    'bg-white border text-muted'
                  }`}
                  style={{ width: '36px', height: '36px', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  {step.status === 'completed' ? <CheckCircle size={20} /> : i + 1}
                </div>
                <div className="text-center">
                  <div className={`small fw-bold mb-1 ${step.status === 'pending' ? 'text-muted' : 'text-navy'}`}>
                    {step.name}
                  </div>
                  <div className="extra-small fw-bold text-uppercase opacity-75" style={{ fontSize: '0.6rem' }}>
                    {step.status === 'completed' ? 'Validated' : (step.status === 'active' || step.status === 'current' as any) ? 'In Progress' : 'Pending'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProjectStepper;
