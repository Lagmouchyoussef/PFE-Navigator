import React from 'react';
import { 
  Search, Send, Paperclip, 
  MoreVertical, Circle, Phone, 
  Video, Info, Smile
} from 'lucide-react';
import { motion } from 'framer-motion';

const CHATS = [
  { id: 1, name: 'Jean Martin', avatar: 'https://ui-avatars.com/api/?name=Jean+Martin&background=10b981&color=fff', lastMsg: 'Prêt pour le jury de demain ?', time: '14:30', online: true, unread: true },
  { id: 2, name: 'Marie Dupont', avatar: 'https://ui-avatars.com/api/?name=Marie+Dupont&background=3498db&color=fff', lastMsg: 'Les documents sont prêts ✅', time: 'Yesterday', online: true, unread: false },
  { id: 3, name: 'Sophie Bernard', avatar: 'https://ui-avatars.com/api/?name=Sophie+Bernard&background=f59e0b&color=fff', lastMsg: 'Merci pour les retours !', time: 'Mon', online: false, unread: false },
];

const AdminMessages = () => {
  return (
    <div className="messages-content">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Direct Messages</h2>
        <p className="text-white/50 text-sm mt-1">Direct communication with students, supervisors and jury members.</p>
      </div>

      <div className="admin-card p-0 overflow-hidden flex flex-col md:flex-row h-[750px] border-white/5 shadow-2xl bg-black/20">
        {/* Chat List Sidebar */}
        <div className="w-full md:w-80 border-r border-white/5 flex flex-col bg-white/2">
          <div className="p-5 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                placeholder="Search chats..." 
                className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {CHATS.map((chat) => (
              <div 
                key={chat.id}
                className={`p-5 flex items-center gap-4 cursor-pointer transition-all border-l-4 ${
                  chat.unread ? 'bg-primary/5 border-l-primary' : 'hover:bg-white/2 border-l-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img src={chat.avatar} className="w-12 h-12 rounded-full border-2 border-white/10 shadow-lg" alt="" />
                  {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-black rounded-full"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`text-sm font-bold truncate ${chat.unread ? 'text-white' : 'text-white/60'}`}>
                      {chat.name}
                    </p>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{chat.time}</span>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'text-white/80 font-bold' : 'text-white/30 font-medium'}`}>
                    {chat.lastMsg}
                  </p>
                </div>
                {chat.unread && (
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 shadow-lg shadow-primary/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-surface">
          <div className="p-5 border-b border-white/5 flex items-center justify-between shadow-xl bg-white/1">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={CHATS[0].avatar} className="w-11 h-11 rounded-full border-2 border-white/10 shadow-lg" alt="" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white tracking-wide">{CHATS[0].name}</p>
                <p className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
                  Active Connection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all">
                <Phone size={18} />
              </button>
              <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all">
                <Video size={18} />
              </button>
              <div className="h-4 w-px bg-white/5 mx-2"></div>
              <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-black/10">
            <div className="flex gap-4">
              <img src={CHATS[0].avatar} className="w-9 h-9 rounded-full mt-1" alt="" />
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 shadow-xl max-w-md">
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  Bonjour ! Est-ce que tout est prêt pour le jury de demain ?
                </p>
                <span className="text-[9px] font-bold text-white/20 mt-3 block uppercase tracking-widest">14:25</span>
              </div>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <img src="https://ui-avatars.com/api/?name=Admin+User&background=3498db&color=fff" className="w-9 h-9 rounded-full mt-1" alt="" />
              <div className="bg-primary/20 text-white border border-primary/20 rounded-2xl rounded-tr-none px-5 py-4 shadow-2xl shadow-primary/10 max-w-md">
                <p className="text-sm leading-relaxed font-medium text-white/90">
                  Oui, tous les documents sont en place et les évaluations sont finalisées.
                </p>
                <span className="text-[9px] font-bold text-white/40 mt-3 block uppercase tracking-widest text-right">14:28</span>
              </div>
            </div>

            <div className="flex gap-4">
              <img src={CHATS[0].avatar} className="w-9 h-9 rounded-full mt-1" alt="" />
              <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-5 py-4 shadow-xl max-w-md">
                <p className="text-sm text-white/80 leading-relaxed font-medium">
                  Parfait ! Prêt pour le jury de demain ? 🎯
                </p>
                <span className="text-[9px] font-bold text-white/20 mt-3 block uppercase tracking-widest">14:30</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-white/5 bg-white/1">
            <div className="flex items-center gap-4 bg-black/40 p-2.5 rounded-2xl border border-white/10 focus-within:bg-black/60 focus-within:border-primary/50 transition-all shadow-2xl">
              <button className="p-2.5 text-white/30 hover:text-primary transition-colors">
                <Paperclip size={22} />
              </button>
              <input 
                type="text" 
                placeholder="Compose a message..." 
                className="flex-1 bg-transparent border-none text-sm font-medium text-white placeholder:text-white/20 focus:outline-none"
              />
              <button className="p-2.5 text-white/30 hover:text-primary transition-colors">
                <Smile size={22} />
              </button>
              <button className="bg-primary text-white p-3 rounded-xl hover:brightness-110 transition-all shadow-xl shadow-primary/30">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
