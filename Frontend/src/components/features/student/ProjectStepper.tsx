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

const ProjectStepper: React.FC<ProjectStepperProps> = ({ steps }) => (
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

export default ProjectStepper;
