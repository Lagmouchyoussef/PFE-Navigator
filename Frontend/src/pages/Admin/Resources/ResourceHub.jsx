import React from 'react';
import { 
  Plus, Search, Download, MoreHorizontal, 
  FileText, Image as ImageIcon, Video, 
  FileCode, Folder, ChevronRight, Share2, 
  Grid, List as ListIcon
} from 'lucide-react';
import { motion } from 'framer-motion';

const FILES = [
  { name: 'Rapport_jury_2026.pdf', type: 'PDF', size: '2.4 MB', date: 'May 10, 2026', icon: <FileText className="text-red-400" /> },
  { name: 'Guide_evaluation.docx', type: 'DOCX', size: '1.1 MB', date: 'May 08, 2026', icon: <FileText className="text-blue-400" /> },
  { name: 'Donnees_analyse.xlsx', type: 'XLSX', size: '3.8 MB', date: 'May 05, 2026', icon: <FileCode className="text-emerald-400" /> },
  { name: 'Presentation_projet.pptx', type: 'PPTX', size: '5.2 MB', date: 'May 01, 2026', icon: <FileText className="text-purple-400" /> },
];

const ResourceHub = () => {
  return (
    <div className="resource-hub-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Resource Hub</h2>
          <p className="text-white/50 text-sm mt-1">Centralized document management and workspace resources.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-xl text-sm font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          <Plus size={18} />
          Upload Assets
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Documents', count: '245 files', icon: <FileText size={28} />, color: 'blue' },
          { label: 'Templates', count: '38 items', icon: <Grid size={28} />, color: 'purple' },
          { label: 'Images', count: '512 files', icon: <ImageIcon size={28} />, color: 'emerald' },
          { label: 'Videos', count: '67 files', icon: <Video size={28} />, color: 'amber' },
        ].map((cat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.05)' }}
            className="admin-card text-center p-8 cursor-pointer group bg-white/2"
          >
            <div className={`w-16 h-16 bg-${cat.color}-600/10 text-${cat.color}-400 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all border border-${cat.color}-500/10 shadow-lg`}>
              {cat.icon}
            </div>
            <h4 className="font-bold text-white mb-2">{cat.label}</h4>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{cat.count}</p>
          </motion.div>
        ))}
      </div>

      <div className="admin-table-container">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <h3 className="font-bold text-white tracking-wide">Recent Repository Files</h3>
          <div className="flex gap-2">
            <button className="p-2.5 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all"><ListIcon size={20} /></button>
            <button className="p-2.5 text-primary bg-primary/10 border border-primary/20 rounded-xl transition-all shadow-lg shadow-primary/10"><Grid size={20} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>File Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Modified Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {FILES.map((file, i) => (
                <tr key={i} className="admin-table-row group">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/5 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        {file.icon}
                      </div>
                      <span className="font-bold text-white/90 group-hover:text-white transition-colors">{file.name}</span>
                    </div>
                  </td>
                  <td><span className="admin-badge badge-brand text-[10px] uppercase tracking-widest">{file.type}</span></td>
                  <td className="text-xs font-bold text-white/40 uppercase tracking-wider">{file.size}</td>
                  <td className="text-xs font-bold text-white/40 uppercase tracking-wider">{file.date}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Download size={18} /></button>
                      <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><Share2 size={18} /></button>
                      <button className="p-2.5 text-white/30 hover:text-primary hover:bg-white/5 rounded-xl transition-all"><MoreHorizontal size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResourceHub;
