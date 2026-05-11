import React from 'react';
import { 
  Bell, CheckCircle2, Clock, 
  Archive, UserPlus, Info, 
  ShieldAlert, MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

const NOTIFICATIONS = [
  { 
    id: 1, 
    title: 'Jury #15 - Reminder', 
    desc: 'The Innovation Tech jury starts tomorrow at 9:00 AM. Prepare your evaluations.', 
    time: '30 min ago', 
    type: 'reminder', 
    icon: <Clock className="text-amber-500" size={20} />,
    color: 'amber',
    unread: true
  },
  { 
    id: 2, 
    title: 'Project Alpha archived', 
    desc: 'Project Alpha has been successfully archived after final jury validation.', 
    time: '2 hours ago', 
    type: 'success', 
    icon: <Archive className="text-emerald-500" size={20} />,
    color: 'emerald',
    unread: true
  },
  { 
    id: 3, 
    title: 'New member added', 
    desc: 'Lucas Petit joined the participant group for the Gamma project.', 
    time: 'Yesterday', 
    type: 'info', 
    icon: <UserPlus className="text-blue-500" size={20} />,
    color: 'blue',
    unread: false
  },
  { 
    id: 4, 
    title: 'System Update', 
    desc: 'The system has been updated to version 2.4.1. New security features available.', 
    time: '3 days ago', 
    type: 'system', 
    icon: <ShieldAlert className="text-purple-500" size={20} />,
    color: 'purple',
    unread: false
  },
];

const AdminNotifications = () => {
  return (
    <div className="notifications-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">System Alerts</h2>
          <p className="text-white/50 text-sm mt-1">Stay updated with system events and workspace activity.</p>
        </div>
        <button className="text-xs font-bold text-primary hover:brightness-125 transition-all uppercase tracking-widest">
          Mark all as read
        </button>
      </div>

      <div className="space-y-5 max-w-4xl">
        {NOTIFICATIONS.map((notif, i) => (
          <motion.div 
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`admin-card p-6 border-l-4 border-l-${notif.color}-500 group relative ${
              notif.unread ? 'bg-white/5 shadow-2xl' : 'bg-white/2 opacity-60'
            }`}
          >
            <div className="flex items-start gap-6">
              <div className={`w-14 h-14 bg-${notif.color}-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg border border-${notif.color}-500/20`}>
                {notif.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-bold text-lg ${notif.unread ? 'text-white' : 'text-white/70'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{notif.time}</span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed max-w-2xl font-medium">
                  {notif.desc}
                </p>
                
                {notif.unread && (
                  <div className="mt-6 flex gap-4">
                    <button className={`px-5 py-2 bg-${notif.color}-500 text-white text-[10px] font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-widest`}>
                      Take Action
                    </button>
                    <button className="px-5 py-2 bg-white/5 text-white/60 text-[10px] font-bold rounded-lg hover:bg-white/10 transition-all uppercase tracking-widest">
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 text-white/20 hover:bg-white/5 rounded-lg">
                <MoreHorizontal size={22} />
              </button>
            </div>

            {notif.unread && (
              <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-primary rounded-full shadow-lg shadow-primary/50"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
