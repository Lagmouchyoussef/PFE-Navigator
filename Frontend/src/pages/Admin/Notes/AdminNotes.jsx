import React from 'react';
import { 
  Plus, Search, Edit2, Trash2, 
  MoreVertical, Clock, CheckCircle, 
  AlertCircle, Info, StickyNote
} from 'lucide-react';
import { motion } from 'framer-motion';

const NOTES_DATA = [
  { id: 1, title: 'Préparation Jury #15', content: 'Vérifier les inscriptions et confirmer les membres du jury avant le 12 mai. Contacter les 5 participants pour confirmer leur présence.', date: '10 May 2026', tag: 'Important', color: 'amber' },
  { id: 2, title: 'Migration des données', content: 'Prévoir la migration des données vers le nouveau serveur le week-end du 24-25 mai. Prévenir tous les utilisateurs.', date: '08 May 2026', tag: 'Information', color: 'blue' },
  { id: 3, title: 'Rapport mensuel envoyé', content: 'Le rapport d\'activité du mois d\'avril a été envoyé à la direction. Retour attendu pour le 20 mai.', date: '05 May 2026', tag: 'Terminé', color: 'emerald' },
  { id: 4, title: 'Formation plateforme', content: 'Organiser une session de formation pour les nouveaux jurys sur l\'utilisation de la plateforme. Prévoir créneau en mai.', date: '02 May 2026', tag: 'Rappel', color: 'purple' },
];

const AdminNotes = () => {
  return (
    <div className="admin-notes-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Notes</h2>
          <p className="text-white/50 text-sm mt-1">Keep track of internal administrative tasks and reminders.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          New Memo
        </button>
      </div>

      <div className="mb-10 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Search in memos..." 
          className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-inner"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NOTES_DATA.map((note, i) => (
          <motion.div 
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-${note.color}-500/10 border border-${note.color}-500/20 rounded-2xl p-6 relative group hover:bg-${note.color}-500/15 transition-all shadow-xl hover:shadow-${note.color}-500/5`}
          >
            <div className="flex items-center justify-between mb-5">
              <span className={`admin-badge bg-${note.color}-500/20 text-${note.color}-400 border border-${note.color}-500/30 uppercase tracking-widest text-[10px]`}>
                {note.tag}
              </span>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className={`p-2 hover:bg-${note.color}-500/20 rounded-lg text-${note.color}-400 transition-colors`}>
                  <Edit2 size={16} />
                </button>
                <button className={`p-2 hover:bg-red-500/20 rounded-lg text-red-500 transition-colors`}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <h4 className="font-bold text-white text-lg mb-3">{note.title}</h4>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              {note.content}
            </p>
            
            <div className="flex items-center gap-3 text-[10px] font-bold text-white/30 uppercase tracking-widest">
              <Clock size={14} className="text-white/20" />
              {note.date}
            </div>

            <div className={`absolute top-6 right-6 text-${note.color}-500/10 -z-0 pointer-events-none group-hover:scale-125 transition-transform duration-500`}>
              <StickyNote size={64} />
            </div>
          </motion.div>
        ))}
        
        {/* Quick Add Placeholder */}
        <button className="border-2 border-dashed border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-white/20 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-lg">
            <Plus size={28} />
          </div>
          <span className="font-bold text-xs uppercase tracking-widest">Add New Memo</span>
        </button>
      </div>
    </div>
  );
};

export default AdminNotes;
