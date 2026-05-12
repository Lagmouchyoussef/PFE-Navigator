import React from 'react';
import { Container } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Mail, Globe } from 'lucide-react';

const Settings = () => {
  return (
    <div className="supervisor-settings-layout py-4">
      <Container fluid className="px-4">
        <header className="mb-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="fw-bold mb-1 text-navy d-flex align-items-center gap-2">
              <SettingsIcon size={28} className="text-primary" /> Settings
            </h2>
            <p className="text-muted small mb-0 fw-bold opacity-75">
              Manage your profile, notifications, and security preferences
            </p>
          </motion.div>
        </header>

        <div className="glass-card border shadow-sm border p-4">
          <div className="text-center py-5">
            <SettingsIcon size={64} className="text-primary opacity-25 mb-3" />
            <h5 className="fw-bold text-navy">Settings Interface</h5>
            <p className="text-muted small fw-bold opacity-75">
              We are currently enhancing the settings experience. Check back soon for new features.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;

