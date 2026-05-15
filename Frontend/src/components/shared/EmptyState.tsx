import React from 'react';
import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-5"
    >
      <div className="bg-surface-alt rounded-circle p-4 d-inline-block mb-3 text-muted opacity-25">
        {icon || <Inbox size={48} />}
      </div>
      <h5 className="fw-bold text-navy mb-2">{title}</h5>
      <p className="text-muted extra-small fw-bold opacity-75 max-w-250 mx-auto">
        {message}
      </p>
    </motion.div>
  );
};

export default EmptyState;
