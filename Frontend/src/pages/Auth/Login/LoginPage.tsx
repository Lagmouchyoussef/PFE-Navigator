import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useApp } from '../../../context/AppContext';
import { motion } from 'framer-motion';
import { 
  GraduationCap, UserCog, Users, Shield, 
  ArrowRight, Key
} from 'lucide-react';
import { UserRole } from '../../../types';

interface RoleOption {
  id: UserRole;
  title: string;
  desc: string;
  icon: React.ReactElement;
  colorClass: string;
}

const LoginPage: React.FC = () => {
  const { login } = useApp();

  const roles: RoleOption[] = [
    { 
      id: 'student', 
      title: 'Portail Étudiant', 
      desc: 'Accédez à votre espace PFE et soumettez vos livrables.', 
      icon: <GraduationCap size={32} />,
      colorClass: 'primary'
    },
    { 
      id: 'supervisor', 
      title: 'Espace Encadrant', 
      desc: 'Suivez vos étudiants et validez les étapes clés.', 
      icon: <Users size={32} />,
      colorClass: 'success'
    },
    { 
      id: 'jury', 
      title: 'Conseil de Jury', 
      desc: 'Évaluez les projets et gérez les soutenances.', 
      icon: <UserCog size={32} />,
      colorClass: 'warning'
    },
    { 
      id: 'admin', 
      title: 'Centre Admin', 
      desc: 'Gestion globale et coordination académique.', 
      icon: <Shield size={32} />,
      colorClass: 'danger'
    }
  ];

  return (
    <div className="login-page-modern min-vh-100 d-flex align-items-center py-5" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Container>
        <div className="text-center mb-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="d-inline-block p-4 rounded-4 glass-card mb-4"
          >
            <img src="/logo_emsi.png" alt="Logo" style={{ maxHeight: '50px' }} />
          </motion.div>
          <h1 className="fw-bold text-navy mb-2" style={{ fontSize: '2.5rem' }}>PFE Navigator</h1>
          <p className="text-muted mx-auto fw-bold opacity-75" style={{ maxWidth: '500px' }}>
            Bienvenue sur la plateforme de gestion des projets de fin d'études. Veuillez sélectionner votre profil.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {roles.map((role, i) => (
            <Col key={role.id} lg={3} md={6}>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                onClick={() => login(role.id)}
                className="h-100"
              >
                <Card className="h-100 border-0 glass-card p-4 cursor-pointer position-relative overflow-hidden shadow-sm">
                  <div 
                    className={`p-3 rounded-4 mb-4 d-inline-block bg-${role.colorClass}-soft text-${role.colorClass}`} 
                  >
                    {role.icon}
                  </div>
                  
                  <h5 className="fw-bold text-navy mb-2">{role.title}</h5>
                  <p className="extra-small text-muted mb-4 fw-bold opacity-75">{role.desc}</p>
                  
                  <div className={`mt-auto d-flex align-items-center gap-2 text-${role.colorClass} fw-bold small`}>
                    Se connecter <ArrowRight size={16} />
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-5">
          <div className="extra-small text-muted mb-3 d-flex align-items-center justify-content-center gap-2 fw-bold opacity-50">
            <Key size={12} /> Connexion sécurisée (SSO) active
          </div>
          <div className="fw-bold small text-navy opacity-25">Groupe Scolaire EMSI © 2026</div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
