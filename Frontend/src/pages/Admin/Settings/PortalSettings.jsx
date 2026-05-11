import React, { useState } from 'react';
import { 
  Settings, Monitor, Bell, Shield, 
  Puzzle, Globe, Clock, Moon, 
  Sun, Check, Save, Upload,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

const PortalSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState('dark');

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe size={18} /> },
    { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', label: 'Security', icon: <Shield size={18} /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle size={18} /> },
  ];

  return (
    <div className="portal-settings-content">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Portal Settings</h2>
        <p className="text-white/50 text-sm mt-1">Configure your workspace preferences and system behavior.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="admin-card p-3 space-y-1 bg-white/2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 admin-card p-6 bg-amber-500/10 border-amber-500/20 flex gap-4">
            <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
            <div>
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">System Backup</p>
              <p className="text-[11px] text-white/50 font-medium mt-1.5 leading-relaxed">Last backup performed 2 hours ago. Auto-sync is enabled.</p>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="admin-card p-10 min-h-[600px] bg-white/2">
            {activeTab === 'general' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-bold text-white mb-8 pb-5 border-b border-white/5 uppercase tracking-widest">General Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Portal Name</label>
                    <input type="text" defaultValue="MediSync Workspace" className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:bg-black/40 focus:border-primary/50 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Support Email</label>
                    <input type="email" defaultValue="admin@medisync.io" className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:bg-black/40 focus:border-primary/50 focus:outline-none transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Default Language</label>
                    <select className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm font-bold text-white/70 outline-none focus:bg-surface">
                      <option className="bg-surface text-white">English (US)</option>
                      <option className="bg-surface text-white">French (FR)</option>
                      <option className="bg-surface text-white">Arabic (MA)</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">System Timezone</label>
                    <select className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-sm font-bold text-white/70 outline-none focus:bg-surface">
                      <option className="bg-surface text-white">GMT+1 (Casablanca)</option>
                      <option className="bg-surface text-white">GMT+0 (London)</option>
                      <option className="bg-surface text-white">UTC-5 (New York)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-12 pt-10 border-t border-white/5 space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white/90">Maintenance Mode</p>
                      <p className="text-xs text-white/40 font-medium">Block platform access during scheduled updates.</p>
                    </div>
                    <button className="w-12 h-6 bg-white/5 border border-white/10 rounded-full relative transition-all group">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white/20 rounded-full shadow-sm transition-all group-hover:bg-white/40"></div>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white/90">Auto Registration</p>
                      <p className="text-xs text-white/40 font-medium">Allow new students to register without manual review.</p>
                    </div>
                    <button className="w-12 h-6 bg-primary rounded-full relative transition-all shadow-lg shadow-primary/20">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-bold text-white mb-8 pb-5 border-b border-white/5 uppercase tracking-widest">Theme & Interface</h3>
                <div className="space-y-10">
                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-5">Visual Mode</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { mode: 'Dark', icon: <Moon size={24} className="text-blue-500" /> },
                        { mode: 'Light', icon: <Sun size={24} className="text-amber-500" /> },
                        { mode: 'System', icon: <Monitor size={24} className="text-white/40" /> }
                      ].map((item) => (
                        <button 
                          key={item.mode}
                          onClick={() => setTheme(item.mode.toLowerCase())}
                          className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 ${
                            theme === item.mode.toLowerCase() ? 'border-primary bg-primary/10 shadow-xl' : 'border-white/5 hover:border-white/10 bg-white/2'
                          }`}
                        >
                          {item.icon}
                          <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{item.mode}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block mb-5">Workspace Identity</label>
                    <div className="flex items-center gap-10">
                      <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary/30">
                        <Monitor size={48} />
                      </div>
                      <div className="space-y-3">
                        <button className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                          <Upload size={14} /> Update Logo
                        </button>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">SVG or PNG • Max 5MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-16 flex justify-end">
              <button className="bg-primary text-white px-10 py-4 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center gap-3 shadow-2xl shadow-primary/30">
                <Save size={20} />
                Confirm Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSettings;
