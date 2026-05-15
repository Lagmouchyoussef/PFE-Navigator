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

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  useEffect(() => {
    // Focus email input on mount
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('emailInput');
      if (emailInput) emailInput.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your admin credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, 'admin');
      if (success) {
        setShowSuccess(true);
        // Navigation is handled by App.tsx
      } else {
        // Error message is set inside AppContext.login
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          >
            <img src="/logo_emsi.png" alt="EMSI Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
            {import.meta.env.DEV && (
              <div className="dev-credentials">
                <strong>Dev login:</strong>
                <div>Admin: admin@emsi.ma / admin123</div>
                <div>Student: student@emsi.ma / password123</div>
              </div>
            )}
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

            <div className="form-row mt-2">
              <div className="flex-grow-1"></div>
              <button 
                type="button"
                className="forgot-link bg-transparent border-0 p-0" 
                onClick={() => setShowForgotModal(true)}
              >
                Forgot key?
              </button>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
              style={{ background: '#f43f5e', marginTop: '1.5rem' }}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                "Authorize Access"
              )}
            </button>
          </form>

          {/* Footer removed as requested */}
        </div>
      </div>

      {/* Forgot Key Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="success-overlay" 
            style={{ zIndex: 1100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="login-wrapper"
              style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
            >
              {!isResetSent ? (
                <>
                  <div className="form-header">
                    <h2 style={{ fontSize: '1.75rem', color: '#0f172a' }}>Security Recovery</h2>
                    <p>Enter your admin email to reset your security key</p>
                  </div>
                  <div className="form-group mb-4">
                    <label>Admin Email</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-input"
                        placeholder="admin@emsi.ma"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                      <div className="input-icon">
                        <Mail size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-3">
                    <button 
                      className="submit-btn" 
                      style={{ background: '#f1f5f9', color: '#64748b', marginTop: 0 }}
                      onClick={() => setShowForgotModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-btn" 
                      style={{ background: '#f43f5e', marginTop: 0 }}
                      onClick={() => {
                        if (forgotEmail) {
                          setIsResetSent(true);
                        }
                      }}
                    >
                      Send Reset Key
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="success-icon" style={{ width: '80px', height: '80px', marginBottom: '1.5rem', background: '#ffe4e6', color: '#f43f5e' }}>
                    <ShieldCheck size={40} />
                  </div>
                  <h3 className="fw-bold mb-2">Instructions Sent</h3>
                  <p className="text-muted small">A recovery link has been sent to <strong>{forgotEmail}</strong>.</p>
                  <button 
                    className="submit-btn mt-4" 
                    style={{ background: '#0f172a' }}
                    onClick={() => {
                      setShowForgotModal(false);
                      setIsResetSent(false);
                      setForgotEmail('');
                    }}
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
