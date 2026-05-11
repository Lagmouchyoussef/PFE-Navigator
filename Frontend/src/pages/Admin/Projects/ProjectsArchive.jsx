import React from 'react';
import { 
  Archive, Search, Filter, Download, 
  ChevronRight, FileText, Layout, 
  Microscope, Lightbulb, ShieldCheck, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const ARCHIVE_DATA = [
  { id: 'A', name: 'Projet Alpha', desc: 'Mobile app for resource management development.', date: 'Apr 15, 2026', files: 12, status: 'Completed', icon: <Layout size={24} />, color: 'blue' },
  { id: 'B', name: 'Projet Beta', desc: 'Real-time data visualization web interface.', date: 'Mar 28, 2026', files: 8, status: 'Completed', icon: <Zap size={24} />, color: 'purple' },
  { id: 'G', name: 'Projet Gamma', desc: 'Automatic performance analysis system.', date: 'Mar 10, 2026', files: 15, status: 'Completed', icon: <Microscope size={24} />, color: 'emerald' },
  { id: 'D', name: 'Projet Delta', desc: 'Interactive e-learning platform with AI.', date: 'Feb 22, 2026', files: 20, status: 'Completed', icon: <Lightbulb size={24} />, color: 'amber' },
  { id: 'E', name: 'Projet Epsilon', desc: 'Enterprise cybersecurity solution.', date: 'Feb 05, 2026', files: 6, status: 'Cancelled', icon: <ShieldCheck size={24} />, color: 'red' },
  { id: 'Z', name: 'Projet Zeta', desc: 'Smart building energy optimization.', date: 'Jan 18, 2026', files: 9, status: 'Completed', icon: <Zap size={24} />, color: 'cyan' },
];

const ProjectsArchive = () => {
  return (
    <div className="projects-archive-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Projects Archive</h2>
          <p className="text-white/50 text-sm mt-1">Access and manage all historical projects and their final reports.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARCHIVE_DATA.map((project, i) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -8 }}
            className="admin-card p-0 overflow-hidden group cursor-pointer bg-white/2"
          >
            <div className={`h-32 bg-gradient-to-br from-${project.color}-600 to-${project.color}-900 flex items-center justify-center relative overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity`}>
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute rotate-45 translate-x-1/2 translate-y-1/2 w-40 h-40 border-4 border-white rounded-full"></div>
              </div>
              <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                {React.cloneElement(project.icon, { className: 'text-white' })}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white group-hover:text-primary transition-colors">{project.name}</h4>
                <span className={`admin-badge ${project.status === 'Completed' ? 'badge-success' : 'badge-danger'}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-white/40 font-bold leading-relaxed mb-6 line-clamp-2 uppercase tracking-wide">
                {project.desc}
              </p>
              <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Archived on</span>
                  <span className="text-xs text-white/60 font-bold mt-1">{project.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-white/30 font-bold bg-white/5 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                  <FileText size={12} className="text-white/40" />
                  {project.files} FILES
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 admin-card bg-primary/20 border-primary/20 p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-3">Looking for a specific report?</h3>
            <p className="text-white/50 text-sm font-medium leading-relaxed">
              Our advanced search indexes all project documents including final presentations, evaluations, and student contributions.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
            <input 
              type="text" 
              placeholder="Search in archives..." 
              className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:bg-black/60 focus:border-primary/50 focus:outline-none transition-all shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsArchive;
