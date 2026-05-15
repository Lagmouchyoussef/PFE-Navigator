import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, UserCog, Users, Shield, 
  Mail, Lock, Eye, EyeOff, 
  Check, AlertCircle, CheckCircle2, Layout, BookOpen, 
  Award, ShieldCheck
} from 'lucide-react';
import { UserRole } from '../../../types';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Focus email input on mount
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('emailInput');
      if (emailInput) emailInput.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const roleConfigs = {
    student: {
      color: '#3b82f6',
      badgeBg: '#dbeafe',
      badgeColor: '#1e40af',
      emailLabel: 'Email Address',
      emailPlaceholder: 'Enter your student email',
      showId: true,
      btnText: 'Sign In as Student',
      successRole: 'Student',
      icon: <GraduationCap size={24} />
    },
    supervisor: {
      color: '#8b5cf6',
      badgeBg: '#ede9fe',
      badgeColor: '#5b21b6',
      emailLabel: 'Faculty Email',
      emailPlaceholder: 'Enter your faculty email',
      showId: false,
      btnText: 'Sign In as Supervisor',
      successRole: 'Supervisor',
      icon: <Users size={24} />
    },
    jury: {
      color: '#f59e0b',
      badgeBg: '#fef3c7',
      badgeColor: '#92400e',
      emailLabel: 'Committee Email',
      emailPlaceholder: 'Enter your committee email',
      showId: false,
      btnText: 'Sign In as Jury Member',
      successRole: 'Jury Member',
      icon: <UserCog size={24} />
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (currentRole === 'student' && !studentId) {
      setError('Please enter your student ID.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Navigate after success animation
      setTimeout(() => {
        login(currentRole);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="login-page-container">
      {/* Left Panel - Visual Branding */}
      <div className="left-panel">
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        <div className="left-content">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="logo-icon"
          >
            <Layout size={40} color="white" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            PFE Navigator
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            The comprehensive platform for managing end-of-studies projects, 
            supervision workflows, and academic evaluations.
          </motion.p>
          
          <motion.div 
            className="feature-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: <BookOpen size={20} />, text: "Real-time project tracking" },
              { icon: <Users size={20} />, text: "Seamless supervisor-student communication" },
              { icon: <Award size={20} />, text: "Integrated jury evaluation system" },
              { icon: <ShieldCheck size={20} />, text: "Secure role-based access control" }
            ].map((feature, i) => (
              <div key={i} className="feature-item">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="right-panel">
        <div className="login-wrapper">
          {/* Mobile Header (Visible on small screens) */}
          <div className="mobile-header">
            <div className="logo-small">
              <Layout size={28} color="white" />
            </div>
            <h2>PFE Navigator</h2>
          </div>

          <div className="form-header">
            <h2>Welcome Back</h2>
            <p>Select your profile and sign in</p>
          </div>

          {/* Role Selector Grid */}
          <div className="role-selector">
            {(['student', 'supervisor', 'jury'] as UserRole[]).map((role) => (
              <button 
                key={role}
                type="button"
                className={`role-btn ${currentRole === role ? 'active' : ''}`}
                data-role={role}
                onClick={() => {
                  setCurrentRole(role);
                  setError(null);
                }}
              >
                <div className="role-icon">
                  {roleConfigs[role].icon}
                </div>
                <div className="role-label">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
                <div className="role-desc">
                  {role === 'student' ? 'Undergrad' : role === 'supervisor' ? 'Faculty' : 'Committee'}
                </div>
              </button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="error-message"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>{roleConfigs[currentRole].emailLabel}</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="emailInput"
                  className="form-input"
                  placeholder={roleConfigs[currentRole].emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            {currentRole === 'student' && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="form-group"
              >
                <label>Student ID</label>
                <div className="input-wrapper">
                  <span className="id-prefix">ID#</span>
                  <input
                    type="text"
                    className="form-input with-prefix"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
              </motion.div>
            )}

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <button 
                  type="button" 
                  className="toggle-password" 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-row">
              <div className="checkbox-wrapper" onClick={() => setIsRemembered(!isRemembered)}>
                <div className={`custom-checkbox ${isRemembered ? 'checked' : ''}`}>
                  {isRemembered && <Check size={14} color="white" strokeWidth={3} />}
                </div>
                <span className="checkbox-label">Remember me</span>
              </div>
              <a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
              style={{ background: roleConfigs[currentRole].color }}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                roleConfigs[currentRole].btnText
              )}
            </button>
          </form>

          <div className="footer-text mt-5">
            <p>© 2026 PFE Navigator. EMSI Group. <Link to="/admin-login" style={{ color: '#64748b', marginLeft: '10px', textDecoration: 'underline' }}>Admin Access</Link></p>
          </div>
        </div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="success-overlay"
          >
            <div className="success-content">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-icon"
              >
                <CheckCircle2 size={60} />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Login Successful!
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Redirecting to your dashboard...
              </motion.p>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="success-role-badge"
                style={{ background: roleConfigs[currentRole].badgeBg, color: roleConfigs[currentRole].badgeColor }}
              >
                <Check size={16} />
                <span>Authenticated as {roleConfigs[currentRole].successRole}</span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;


