import React from 'react';
import { 
  Plus, ChevronLeft, ChevronRight, MapPin, 
  Users, Calendar as CalendarIcon, Clock,
  MoreVertical, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

const JURIES_LIST = [
  { id: 15, title: 'Innovation Tech', type: 'Technology', date: 'May 12-15, 2026', members: 5, location: 'Room A101', status: 'In Progress', color: 'blue' },
  { id: 14, title: 'Design Créatif', type: 'Arts & Design', date: 'May 20-22, 2026', members: 4, location: 'Room B202', status: 'Confirmed', color: 'purple' },
  { id: 13, title: 'Recherche Scientifique', type: 'Science', date: 'May 27, 2026', members: 3, location: 'Amphi C', status: 'Planned', color: 'amber' },
  { id: 16, title: 'Recherche Avancée', type: 'Research', date: 'May 28-30, 2026', members: 6, location: 'Room D301', status: 'Planned', color: 'emerald' },
];

const JuryPlanning = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="jury-planning-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Jury Planning</h2>
          <p className="text-white/50 text-sm mt-1">Schedule and coordinate jury sessions for all projects.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          New Jury Session
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Calendar View */}
        <div className="xl:col-span-3">
          <div className="admin-card p-8 h-full bg-white/2">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-white">May 2026</h3>
              <div className="flex gap-2">
                <button className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white border border-white/5 transition-all">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white border border-white/5 transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-[1px] bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
              {weekDays.map(day => (
                <div key={day} className="bg-white/2 p-4 text-center text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  {day}
                </div>
              ))}
              
              {/* Previous month filler */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`prev-${i}`} className="bg-black/10 h-36 p-4 text-white/10 text-xs font-bold">
                  {27 + i}
                </div>
              ))}

              {days.map(day => {
                const hasJury = [12, 15, 20, 27, 28].includes(day);
                const juryColor = day === 12 || day === 15 ? 'blue' : day === 20 ? 'purple' : day === 27 ? 'amber' : 'emerald';
                
                return (
                  <div key={day} className="bg-white/2 h-36 p-4 border-t border-l border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                    <span className={`text-xs font-bold ${hasJury ? `text-${juryColor}-500` : 'text-white/20'} group-hover:scale-110 transition-transform block`}>
                      {day}
                    </span>
                    {hasJury && (
                      <div className={`mt-3 p-2 rounded-xl bg-${juryColor}-600/20 border border-${juryColor}-500/30 animate-in fade-in slide-in-from-top-1 shadow-lg shadow-black/20`}>
                        <p className={`text-[10px] font-bold text-${juryColor}-400 truncate uppercase tracking-wider`}>Jury Session</p>
                        <p className="text-[9px] text-white/40 font-bold truncate mt-1">09:00 AM</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming List */}
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-white mb-2">Upcoming Timeline</h3>
          {JURIES_LIST.map((jury) => (
            <motion.div 
              key={jury.id}
              whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className={`admin-card border-l-4 border-l-${jury.color}-500 p-5 relative group bg-white/2`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold text-${jury.color}-400 uppercase tracking-widest`}>
                  Jury #{jury.id}
                </span>
                <span className={`admin-badge ${jury.status === 'In Progress' ? 'badge-warning' : 'badge-brand'} text-[9px]`}>
                  {jury.status}
                </span>
              </div>
              <h4 className="font-bold text-white/90 mb-4">{jury.title}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  <CalendarIcon size={14} className="text-white/20" />
                  {jury.date}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  <Users size={14} className="text-white/20" />
                  {jury.members} Reviewers
                </div>
                <div className="flex items-center gap-3 text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  <MapPin size={14} className="text-white/20" />
                  {jury.location}
                </div>
              </div>
              <button className="absolute right-3 bottom-3 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white">
                <MoreVertical size={18} />
              </button>
            </motion.div>
          ))}
          <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-2xl text-white/20 text-sm font-bold hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
            <Plus size={18} />
            Quick Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default JuryPlanning;
