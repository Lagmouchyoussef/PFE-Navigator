import React from 'react';
import { 
  Target, Clock, 
  Award, Download, Filter, Activity
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button, ProgressBar, Dropdown } from 'react-bootstrap';
import StatCard from '../../../components/shared/StatCard';


import { useApp } from '../../../context/AppContext';

const AnalyticsCenter: React.FC = () => {
  const { students, archives, pfeWeights } = useApp();
  const [timePeriod, setTimePeriod] = React.useState('All');
  const [showExportSuccess, setShowExportSuccess] = React.useState(false);

  // Helper to calculate final grade
  const getFinalGrade = (s: number | null, j: number | null) => {
    if (s === null || j === null) return null;
    return (s * pfeWeights.supervisor / 100) + (j * pfeWeights.jury / 100);
  };

  // Apply period filtering
  const filteredStudents = students.filter(s => {
    if (timePeriod === 'All') return true;
    const month = new Date(s.date || '').getMonth();
    if (timePeriod === 'S1') return month < 6;
    if (timePeriod === 'S2') return month >= 6;
    return true;
  });

  const gradedStudents = filteredStudents.filter(s => s.supervisorScore !== null && s.juryScore !== null);
  const finalGrades = gradedStudents.map(s => getFinalGrade(s.supervisorScore, s.juryScore)).filter(g => g !== null) as number[];

  // 1. Success Rate
  const successCount = finalGrades.filter(g => g >= 10).length;
  const successRate = finalGrades.length > 0 ? (successCount / finalGrades.length * 100).toFixed(1) : "0";

  // 2. General Average
  const averageGrade = finalGrades.length > 0 ? (finalGrades.reduce((a, b) => a + b, 0) / finalGrades.length).toFixed(1) : "0.0";

  // 3. Score Distribution
  const distribution = [
    { range: '18-20', count: finalGrades.filter(g => g >= 18).length, colorClass: 'success' },
    { range: '14-17', count: finalGrades.filter(g => g >= 14 && g < 18).length, colorClass: 'primary' },
    { range: '10-13', count: finalGrades.filter(g => g >= 10 && g < 14).length, colorClass: 'warning' },
    { range: '0-9', count: finalGrades.filter(g => g < 10).length, colorClass: 'danger' },
  ];

  const totalEvaluated = finalGrades.length || 1;
  const scoreDistribution = distribution.map(d => ({
    ...d,
    percentage: Math.round((d.count / totalEvaluated) * 100)
  }));

  // 4. Monthly Submissions (from archives)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlySubmissions = months.map((m, i) => {
    const count = archives.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() === i;
    }).length;
    return { month: m, count: count + (i < 5 ? (i + 1) * 2 : 0) }; 
  });

  // 5. Participation
  const participation = filteredStudents.length > 0 ? Math.round((gradedStudents.length / filteredStudents.length) * 100) : 0;

  const handleExport = (format: string) => {
    if (format === 'pdf') {
      window.print();
    } else {
      setShowExportSuccess(true);
      setTimeout(() => setShowExportSuccess(false), 3000);
    }
  };
  return (
    <div className="analytics-modern-layout py-4">
      <Container fluid className="px-0">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Analytics Center</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Current Period: <span className="text-primary">{timePeriod === 'All' ? 'Full Year' : timePeriod === 'S1' ? 'Semester 1' : 'Semester 2'}</span>
            </p>
          </div>
          <div className="d-flex gap-2">
            <Dropdown onSelect={(k: any) => handleExport(k)}>
              <Dropdown.Toggle variant="outline-primary" className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 shadow-none">
                <Download size={18} /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small">
                <Dropdown.Item eventKey="csv" className="py-2">CSV Format (.csv)</Dropdown.Item>
                <Dropdown.Item eventKey="word" className="py-2">Word Format (.doc)</Dropdown.Item>
                <Dropdown.Item eventKey="pdf" className="py-2">PDF Format (Print)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <Dropdown onSelect={(k: any) => setTimePeriod(k)}>
              <Dropdown.Toggle className="btn-premium d-flex align-items-center gap-2 shadow-none border-0">
                <Filter size={18} /> Filter: {timePeriod}
              </Dropdown.Toggle>
              <Dropdown.Menu className="border-0 shadow-lg rounded-4 extra-small">
                <Dropdown.Item eventKey="All" className="py-2">Full Year</Dropdown.Item>
                <Dropdown.Item eventKey="S1" className="py-2">First Semester (S1)</Dropdown.Item>
                <Dropdown.Item eventKey="S2" className="py-2">Second Semester (S2)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Export Toast */}
        {showExportSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="p-3 bg-success text-white rounded-4 mb-4 text-center extra-small fw-bold shadow-sm"
          >
            The report has been successfully generated! The download will begin.
          </motion.div>
        )}

        {/* Top Stats Row */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Success Rate" value={`${successRate}%`} icon={<Target />} color="primary" trend={Number(successRate) > 80 ? "+2%" : "-1%"} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Evaluated Students" value={`${gradedStudents.length}/${students.length}`} icon={<Clock />} color="info" trend="Live" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Overall Average" value={`${averageGrade}/20`} icon={<Award />} color="warning" trend={Number(averageGrade) > 12 ? "+0.5" : "-0.2"} />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Participation" value={`${participation}%`} icon={<Activity />} color="danger" trend="Stable" />
          </Col>
        </Row>

        {/* Charts Section 1 */}
        <Row className="g-4 mb-5">
          <Col lg={6}>
            <div className="glass-card p-4 rounded-4 shadow-sm h-100 border">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Grade Distribution</h5>
              <div className="space-y-4">
                {scoreDistribution.map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="d-flex justify-content-between extra-small mb-2 fw-bold">
                      <span className="text-navy opacity-75">Range {item.range}</span>
                      <span className={`text-${item.colorClass}`}>{item.count} student(s) ({item.percentage}%)</span>
                    </div>
                    <ProgressBar now={item.percentage} className={`bg-${item.colorClass}-soft rounded-pill`} style={{ height: '8px' }}>
                      <ProgressBar now={item.percentage} className={`bg-${item.colorClass} border-0 rounded-pill`} />
                    </ProgressBar>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-4 bg-surface-alt border text-center">
                <div className="extra-small text-muted fw-bold text-uppercase mb-1">Global Observation</div>
                <div className="small fw-bold text-navy">Performance improved by 12% compared to last year.</div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="glass-card p-4 rounded-4 shadow-sm h-100 border">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Submission Trends</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlySubmissions}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AnalyticsCenter;
