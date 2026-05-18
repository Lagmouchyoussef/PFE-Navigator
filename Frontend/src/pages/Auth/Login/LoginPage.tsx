import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../../../types';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  useEffect(() => {
    const emailInput = document.getElementById('emailInput');
    if (emailInput) emailInput.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, currentRole);
      if (success) {
        setShowSuccess(true);
      } else {
        setError('Incorrect email address or password.');
      }
    } catch (err: any) {
      setError('A network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="login-page-container">
      <div className="right-panel">
        <div className="login-wrapper">
          {/* Logo & Header */}
          <div className="logo-header">
            <img src="/logo_emsi.png" alt="EMSI Logo" />
            <h1>Sign In</h1>
          </div>


          {/* Role selector tabs */}
          <div className="role-tabs">
            {(['student', 'supervisor', 'jury', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                type="button"
                className={`role-tab-btn ${currentRole === role ? 'active' : ''}`}
                onClick={() => {
                  setCurrentRole(role);
                  setError(null);
                }}
              >
                {role === 'student' && 'Student'}
                {role === 'supervisor' && 'Supervisor'}
                {role === 'jury' && 'Jury'}
                {role === 'admin' && 'Admin'}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="error-banner"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <form className="login-form" onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="emailInput">
                {currentRole === 'student' && 'Student ID / Email*'}
                {currentRole === 'supervisor' && 'Supervisor Email*'}
                {currentRole === 'jury' && 'Jury Email*'}
                {currentRole === 'admin' && 'Administrator Email*'}
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="emailInput"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="passwordInput">Password*</label>
              <div className="input-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="passwordInput"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`submit-button ${isFormFilled ? 'active-btn' : 'disabled-btn'}`}
              disabled={isLoading || !isFormFilled}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>Sign In</>
              )}
            </button>

            {/* Forgot Password Link below the button at bottom left */}
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="success-overlay"
            style={{ zIndex: 1300, background: 'rgba(0, 0, 0, 0.32)', backdropFilter: 'blur(2px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="login-wrapper"
              style={{ background: 'white', border: 'none', maxWidth: '400px' }}
            >
              {!isResetSent ? (
                <>
                  <div className="logo-header" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#000000', margin: 0 }}>
                      Forgot Password
                    </h2>
                  </div>
                  <div className="form-group mb-4" style={{ position: 'relative' }}>
                    <label style={{ left: 0, top: '-16px', fontSize: '0.75rem' }}>Email address*</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-input"
                        style={{ paddingLeft: '12px' }}
                        placeholder="your.email@emsi.ma"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="submit-button active-btn"
                      style={{ background: '#757575', color: '#ffffff', width: 'auto', padding: '0 16px', height: '36px', marginTop: 0 }}
                      onClick={() => {
                        setShowForgotModal(false);
                        setForgotEmail('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="submit-button active-btn"
                      style={{ width: 'auto', padding: '0 16px', height: '36px', marginTop: 0 }}
                      disabled={isSendingReset || !forgotEmail}
                      onClick={async () => {
                        setIsSendingReset(true);
                        await new Promise((r) => setTimeout(r, 1000));
                        setIsSendingReset(false);
                        setIsResetSent(true);
                      }}
                    >
                      {isSendingReset ? <div className="spinner"></div> : 'Send'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div className="success-icon" style={{ background: '#d1fae5', color: '#10b981' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: '#000000' }}>
                    Link sent!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#757575', marginTop: '8px' }}>
                    A reset email has been sent to <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    className="submit-button active-btn mt-4"
                    onClick={() => {
                      setShowForgotModal(false);
                      setIsResetSent(false);
                      setForgotEmail('');
                    }}
                  >
                    Back
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Login Animation */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="success-overlay"
          >
            <div className="success-content">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="success-icon"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Login successful
              </motion.h3>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Redirecting to your workspace...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LoginPage;
