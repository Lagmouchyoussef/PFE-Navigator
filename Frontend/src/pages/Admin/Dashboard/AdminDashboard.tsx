import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Badge, Button, Table, 
  Form, InputGroup
} from 'react-bootstrap';
import { 
  Users, Briefcase, Plus, Search, 
  Database, Download, Edit, Trash2, Lock,
  Clock, Trash, FileText, FileSpreadsheet, File, AlertCircle, ShieldAlert
} from 'lucide-react';
import { Dropdown, Modal } from 'react-bootstrap';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import StatCard from '../../../components/shared/StatCard';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';

const USER_DATA = [
  { id: 1, name: 'Alice Johnson', email: 'alice.j@emsi.ma', role: 'Student', status: 'Active', color: 'primary' },
  { id: 2, name: 'Dr. Robert Smith', email: 'r.smith@emsi.ma', role: 'Supervisor', status: 'Active', color: 'success' },
  { id: 3, name: 'Jean Dupont', email: 'j.dupont@jury.fr', role: 'Jury', status: 'Active', color: 'warning' },
  { id: 4, name: 'Admin Sarah', email: 'admin@emsi.ma', role: 'Admin', status: 'Active', color: 'info' },
];

const SUBMISSION_DATA = [
  { name: 'Jan', count: 45 }, { name: 'Feb', count: 52 }, { name: 'Mar', count: 85 }, { name: 'Apr', count: 120 }, { name: 'May', count: 98 },
];

const STATUS_DATA = [
  { name: 'En attente', value: 15, color: '#f59e0b' },
  { name: 'Approuvé', value: 45, color: '#10b981' },
  { name: 'En cours', value: 25, color: '#3b82f6' },
  { name: 'Terminé', value: 10, color: '#6366f1' },
];

const AdminDashboard: React.FC = () => {
  const { appointments, deleteAppointment } = useApp();
  const [users, setUsers] = React.useState(USER_DATA);
  const [visibleCount, setVisibleCount] = React.useState(5);
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmConfig, setConfirmConfig] = React.useState({ title: '', message: '', action: '', user: null as any });

  const generateReport = (format: 'pdf' | 'csv' | 'word') => {
    const data = [
      ["Statistique", "Valeur"],
      ["Utilisateurs", "1248"],
      ["Projets Actifs", "842"],
      ["Taux de validation", "85%"],
      ["Dernière mise à jour", new Date().toLocaleDateString()]
    ];
    
    if (format === 'csv') {
      const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `rapport_global_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setConfirmConfig({
        title: 'Exportation Rapport',
        message: `Voulez-vous vraiment générer le rapport au format ${format.toUpperCase()} ?`,
        action: 'export',
        user: { name: format.toUpperCase() }
      });
      setShowConfirmModal(true);
    }
  };

  const handleAction = (action: string, user: any) => {
    if (action === 'edit') {
      navigate('/admin/users');
    } else {
      setConfirmConfig({
        title: action === 'delete' ? 'Confirmation de suppression' : 'Action système',
        message: action === 'delete' 
          ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ? Cette action est irréversible.`
          : `Confirmez-vous l'action "${action}" pour l'utilisateur "${user.name}" ?`,
        action: action,
        user: user
      });
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    if (confirmConfig.action === 'delete' && confirmConfig.user) {
      setUsers(prev => prev.filter(u => u.id !== confirmConfig.user.id));
    }
    setShowConfirmModal(false);
  };

  return (
    <div className="py-2">
      <Container fluid className="px-0">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
          <div>
            <h2 className="fw-bold mb-1 text-navy">Panneau de Contrôle Admin</h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">Vue d'ensemble de la plateforme et gestion des ressources.</p>
          </div>
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle 
                variant="outline-primary" 
                className="fw-bold small px-4 py-2 rounded-pill border-2 d-flex align-items-center gap-2 no-caret shadow-none"
              >
                <Download size={18} /> Rapport Global
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-lg rounded-4 overflow-hidden mt-2 p-1">
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('pdf')}>
                  <div className="p-1 rounded bg-danger-soft text-danger"><FileText size={14} /></div> Exporter en PDF
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('word')}>
                  <div className="p-1 rounded bg-primary-soft text-primary"><File size={14} /></div> Exporter en Word
                </Dropdown.Item>
                <Dropdown.Item className="py-2 px-3 extra-small fw-bold d-flex align-items-center gap-2" onClick={() => generateReport('csv')}>
                  <div className="p-1 rounded bg-success-soft text-success"><FileSpreadsheet size={14} /></div> Exporter en CSV
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button 
              className="btn-premium d-flex align-items-center gap-2"
              onClick={() => navigate('/admin/users')}
            >
              <Plus size={18} /> Nouvel Utilisateur
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <Row className="g-4 mb-5">
          <Col lg={3} md={6}>
            <StatCard label="Utilisateurs" value="1,248" icon={<Users />} color="primary" trend="+12%" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Projets Actifs" value="842" icon={<Briefcase />} color="info" trend="92%" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Actions en Attente" value="24" icon={<Clock />} color="warning" trend="Urgent" />
          </Col>
          <Col lg={3} md={6}>
            <StatCard label="Stockage Système" value="64.2%" icon={<Database />} color="danger" trend="420GB" />
          </Col>
        </Row>

        {/* Charts Section */}
        <Row className="g-4 mb-5">
          <Col lg={7}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Tendances de Soumission</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SUBMISSION_DATA}>
                    <defs>
                      <linearGradient id="adminColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-muted)', fontWeight: 600 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="count" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#adminColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
          <Col lg={5}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <span>Événements & Rendez-vous</span>
                  <Form.Control 
                    type="date" 
                    defaultValue="2026-05-15"
                    className="rounded-4 border-light-soft bg-surface-alt py-2 extra-small fw-bold shadow-none text-navy border-0"
                    style={{ maxWidth: '140px', cursor: 'pointer' }}
                  />
                </div>
                <Badge className="bg-primary-soft text-primary extra-small border-0 px-2 py-1 rounded-pill">{appointments.length}</Badge>
              </h5>
              <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '400px' }}>
                {appointments.slice(0, visibleCount).map((appt, i) => (
                  <motion.div 
                    key={appt.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-3 rounded-3 border bg-surface-alt hover-bg-surface transition-all ${appt.status === 'Cancelled' ? 'opacity-50' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <div className="small fw-bold text-navy">{appt.title}</div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge className={`bg-${appt.status === 'Confirmed' ? 'success' : appt.status === 'Rescheduled' ? 'info' : appt.status === 'Cancelled' ? 'danger' : 'warning'}-soft text-${appt.status === 'Confirmed' ? 'success' : appt.status === 'Rescheduled' ? 'info' : appt.status === 'Cancelled' ? 'danger' : 'warning'} border-0 extra-small px-2`}>
                          {appt.status}
                        </Badge>
                        <Button variant="link" className="p-0 text-danger border-0 shadow-none hover-bg-danger-soft rounded-circle" onClick={() => deleteAppointment(appt.id)}>
                          <Trash size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-3 extra-small text-muted fw-bold">
                      <span className="d-flex align-items-center gap-1"><Users size={12}/> {appt.studentName}</span>
                      <span className="d-flex align-items-center gap-1"><Clock size={12}/> {appt.date} • {appt.time}</span>
                    </div>
                  </motion.div>
                ))}
                {visibleCount < appointments.length && (
                  <Button 
                    variant="link" 
                    className="w-100 mt-2 extra-small fw-bold text-primary text-decoration-none border-0 shadow-none"
                    onClick={() => setVisibleCount(prev => prev + 5)}
                  >
                    Load More Events
                  </Button>
                )}
              </div>
              <Button variant="link" className="w-100 mt-2 extra-small fw-bold text-muted text-decoration-none border-0 shadow-none opacity-50">Gérer le planning complet</Button>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col lg={4}>
            <div className="glass-card p-4 h-100">
              <h5 className="fw-bold mb-4 border-bottom pb-2 text-navy">Répartition des Statuts</h5>
              <div style={{ height: '240px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DATA} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {STATUS_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Col>
        </Row>

        {/* User Management Table */}
        <div className="glass-card overflow-hidden mb-5">
          <div className="p-4 border-bottom d-flex justify-content-between align-items-center bg-surface-alt">
            <div>
              <h5 className="fw-bold mb-0 text-navy">Gestion des Utilisateurs</h5>
              <p className="extra-small text-muted mb-0 fw-bold opacity-75">Gérez les comptes globaux et les accès privilégiés.</p>
            </div>
            <div className="d-flex gap-2">
              <InputGroup size="sm" className="glass-card rounded-pill border px-3" style={{ width: '250px', backgroundColor: 'var(--color-surface)' }}>
                <InputGroup.Text className="bg-transparent border-0 text-muted ps-0"><Search size={16}/></InputGroup.Text>
                <Form.Control placeholder="Rechercher..." className="bg-transparent border-0 shadow-none py-2 extra-small fw-bold text-navy" />
              </InputGroup>
            </div>
          </div>
          <div className="table-responsive">
            <Table borderless hover className="align-middle mb-0 custom-table-modern">
              <thead>
                <tr>
                  <th className="px-4">Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th className="text-end px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`avatar-sm bg-${user.color}-soft text-${user.color} rounded-circle d-flex align-items-center justify-content-center fw-bold`} style={{ width: '36px', height: '36px' }}>
                          {user.name.charAt(0)}
                        </div>
                        <div className="small fw-bold text-navy">{user.name}</div>
                      </div>
                    </td>
                    <td className="small text-muted fw-bold">{user.email}</td>
                    <td>
                      <Badge className={`bg-${user.color}-soft text-${user.color} border border-${user.color} border-opacity-10 extra-small`}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                        <span className="extra-small fw-bold text-muted">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-4 text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3" onClick={() => handleAction('edit', user)}><Edit size={16}/></Button>
                        <Button variant="link" className="p-2 text-muted hover-bg-surface rounded-3" onClick={() => handleAction('lock', user)}><Lock size={16}/></Button>
                        <Button variant="link" className="p-2 text-danger hover-bg-surface rounded-3" onClick={() => handleAction('delete', user)}><Trash2 size={16}/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </Container>

      {/* Confirmation Modal (La Carte demandée) */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered className="delete-modal-premium">
        <Modal.Body className="p-4 text-center">
          <div className={`${confirmConfig.action === 'delete' ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'} rounded-circle p-3 d-inline-block mb-4 shadow-sm`}>
            {confirmConfig.action === 'delete' ? <Trash2 size={40} /> : <ShieldAlert size={40} />}
          </div>
          <h4 className="fw-bold text-navy mb-3">{confirmConfig.title}</h4>
          <p className="text-muted small mb-4 px-3">
            {confirmConfig.message}
          </p>
          <div className="d-flex gap-3 justify-content-center">
            <Button variant="outline-secondary" className="px-4 py-2 rounded-3 fw-bold border-2" onClick={() => setShowConfirmModal(false)}>
              Annuler
            </Button>
            <Button 
              variant={confirmConfig.action === 'delete' ? 'danger' : 'primary'} 
              className="px-4 py-2 rounded-3 fw-bold shadow-sm" 
              onClick={handleConfirm}
            >
              {confirmConfig.action === 'delete' ? 'Supprimer' : 'Confirmer'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
