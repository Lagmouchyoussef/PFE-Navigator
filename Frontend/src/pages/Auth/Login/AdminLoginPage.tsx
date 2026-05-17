import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import './LoginPage.css';

const AdminLoginPage: React.FC = () => {
  const { login } = useApp();
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
      setError('Veuillez saisir vos identifiants administrateur.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password, 'admin');
      if (success) {
        setShowSuccess(true);
      } else {
        setError('Adresse email ou mot de passe incorrect.');
      }
    } catch (err: any) {
      setError('Une erreur réseau est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="right-panel">
        <div className="login-wrapper">
          {/* Logo & Header */}
          <div className="logo-header">
            <img src="/logo_emsi.png" alt="EMSI Logo" />
            <h1>Portail Administrateur</h1>
            <p>Accès au panneau de configuration système</p>
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
            <div className="form-group">
              <label htmlFor="emailInput">Email Administrateur</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="emailInput"
                  className="form-input"
                  placeholder="admin@emsi.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="input-icon-left">
                  <Shield size={18} />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="passwordInput">Mot de passe de sécurité</label>
              <div className="input-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="passwordInput"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-icon-left">
                  <Lock size={18} />
                </div>
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="forgot-password-link"
                onClick={() => setShowForgotModal(true)}
              >
                Identifiant perdu ?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              style={{ background: '#0f172a' }}
            >
              {isLoading ? (
                <div className="spinner"></div>
              ) : (
                <>S'authentifier</>
              )}
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
            style={{ zIndex: 1300, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="login-wrapper"
              style={{ background: 'white', border: 'none' }}
            >
              {!isResetSent ? (
                <>
                  <div className="logo-header" style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                      Récupération Administrateur
                    </h2>
                    <p>Entrez votre email pour réinitialiser vos accès de sécurité</p>
                  </div>
                  <div className="form-group mb-4">
                    <label>Adresse email administrateur</label>
                    <div className="input-wrapper">
                      <input
                        type="email"
                        className="form-input"
                        placeholder="admin@emsi.ma"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                      <div className="input-icon-left">
                        <Mail size={18} />
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '1.5rem' }}>
                    <button
                      type="button"
                      className="submit-button"
                      style={{ background: '#f1f5f9', color: '#475569', marginTop: 0 }}
                      onClick={() => {
                        setShowForgotModal(false);
                        setForgotEmail('');
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      className="submit-button"
                      style={{ background: '#0f172a', marginTop: 0 }}
                      disabled={isSendingReset || !forgotEmail}
                      onClick={async () => {
                        setIsSendingReset(true);
                        await new Promise((r) => setTimeout(r, 1000));
                        setIsSendingReset(false);
                        setIsResetSent(true);
                      }}
                    >
                      {isSendingReset ? <div className="spinner"></div> : 'Envoyer'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div className="success-icon" style={{ background: '#ffe4e6', color: '#f43f5e' }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Lien envoyé !
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Veuillez vérifier votre boîte de réception à l'adresse <strong>{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    className="submit-button mt-4"
                    onClick={() => {
                      setShowForgotModal(false);
                      setIsResetSent(false);
                      setForgotEmail('');
                    }}
                  >
                    Retour
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
                style={{ background: '#ffe4e6', color: '#f43f5e' }}
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Connexion réussie
              </motion.h3>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Accès au panneau d'administration autorisé...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLoginPage;
