import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Mail, Lock, Eye, EyeOff, 
  Check, AlertCircle, CheckCircle2, Layout, 
  ShieldCheck, Server, LockKeyhole
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css';

const AdminLoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your admin credentials.');
      return;
    }

    setIsLoading(true);

    // Simulate API call for Admin
    setTimeout(() => {
      const success = login('admin'); // Using the mock login logic for admin
      if (success) {
        setIsLoading(false);
        setShowSuccess(true);
        
        // Navigate after success animation
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setIsLoading(false);
        setError('Invalid administrator credentials.');
      }
    }, 1500);
  };

  return (
    <div className="login-page-container admin-theme">
      {/* Left Panel - Admin Focused */}
      <div className="left-panel" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="floating-shapes">
          <div className="shape" style={{ background: '#f43f5e', opacity: 0.05 }}></div>
          <div className="shape" style={{ background: '#f43f5e', opacity: 0.05 }}></div>
          <div className="shape" style={{ background: '#f43f5e', opacity: 0.05 }}></div>
        </div>
        <div className="left-content">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="logo-icon"
            style={{ background: 'rgba(244, 63, 94, 0.2)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
          >
            <Shield size={40} color="#f43f5e" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Admin Portal
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            PFE Navigator System Administration. Access restricted to authorized personnel only.
          </motion.p>
          
          <motion.div 
            className="feature-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: <Server size={20} />, text: "Global system monitoring" },
              { icon: <ShieldCheck size={20} />, text: "Advanced user management" },
              { icon: <LockKeyhole size={20} />, text: "Security and access control" }
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
          <div className="form-header">
            <h2 style={{ color: '#0f172a' }}>System Access</h2>
            <p>Administrator Authentication Required</p>
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
              <label>Admin Email / ID</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="emailInput"
                  className="form-input"
                  placeholder="admin@emsi.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-icon">
                  <Mail size={20} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Security Key</label>
              <div className="input-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
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

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
              style={{ background: '#f43f5e', marginTop: '2rem' }}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          <div className="footer-text mt-5">
            <p>© 2026 EMSI IT Services. <Link to="/login" style={{ color: '#2563eb', marginLeft: '10px', textDecoration: 'underline' }}>Back to Public Login</Link></p>
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
                style={{ background: '#ffe4e6', color: '#f43f5e' }}
              >
                <CheckCircle2 size={60} />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                System Authorized
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Accessing Admin Control Center...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLoginPage;
