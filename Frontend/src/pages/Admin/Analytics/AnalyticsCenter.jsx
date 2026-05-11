import React from 'react';
import { 
  TrendingUp, TrendingDown, Target, Clock, 
  Award, PieChart as PieChartIcon, ArrowUpRight,
  Download, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

const CATEGORY_DATA = [
  { name: 'Technology', value: 142, color: '#3498db' },
  { name: 'Design', value: 89, color: '#8b5cf6' },
  { name: 'Research', value: 67, color: '#10b981' },
  { name: 'Sciences', value: 44, color: '#f59e0b' },
];

const SCORE_DISTRIBUTION = [
  { range: '9-10', count: 35, color: '#10b981' },
  { range: '7-8', count: 28, color: '#3b82f6' },
  { range: '5-6', count: 22, color: '#f59e0b' },
  { range: '3-4', count: 10, color: '#f97316' },
  { range: '1-2', count: 5, color: '#ef4444' },
];

const MONTHLY_SUBMISSIONS = [
  { month: 'Jan', count: 30 }, { month: 'Feb', count: 45 }, { month: 'Mar', count: 55 },
  { month: 'Apr', count: 40 }, { month: 'May', count: 75 }, { month: 'Jun', count: 60 },
  { month: 'Jul', count: 50 }, { month: 'Aug', count: 35 }, { month: 'Sep', count: 65 },
  { month: 'Oct', count: 80 }, { month: 'Nov', count: 90 }, { month: 'Dec', count: 100 },
];

const AnalyticsCenter = () => {
  return (
    <div className="analytics-content">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Analytics Center</h2>
          <p className="text-white/50 text-sm mt-1">Detailed statistics and performance insights across all workstreams.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 transition-all flex items-center gap-2">
            <Download size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Success Rate', value: '87.5%', icon: <Target size={20} />, color: 'emerald', trend: '+2.4%' },
          { label: 'Avg Eval Time', value: '4.2d', icon: <Clock size={20} />, color: 'blue', trend: '-12%' },
          { label: 'Avg Score', value: '7.8/10', icon: <Award size={20} />, color: 'amber', trend: '+3%' },
          { label: 'Participation', value: '92.1%', icon: <PieChartIcon size={20} />, color: 'purple', trend: '+5%' },
        ].map((stat, i) => (
          <div key={i} className="admin-card border-white/5 p-6 relative overflow-hidden bg-white/2">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl`}></div>
            <div className={`w-12 h-12 bg-${stat.color}-600/20 text-${stat.color}-400 rounded-2xl flex items-center justify-center mb-5 border border-${stat.color}-500/20`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
              <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-blue-500'} mb-1`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Score Distribution */}
        <div className="admin-card p-8 bg-white/2">
          <h3 className="text-xl font-bold text-white mb-8">Score Distribution</h3>
          <div className="space-y-7">
            {SCORE_DISTRIBUTION.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{item.range} RANGE</span>
                  <span className="text-xs font-bold text-white/40">{item.count}% of total</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.count}%` }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                    className="h-full rounded-full shadow-lg"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Pie Chart */}
        <div className="admin-card p-8 bg-white/2">
          <h3 className="text-xl font-bold text-white mb-2">Projects by Category</h3>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-8">Submission volume per domain</p>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div style={{ height: '240px', width: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {CATEGORY_DATA.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}44` }}></div>
                    <span className="text-xs font-bold text-white/70 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Evolution */}
      <div className="admin-card p-8 bg-white/2">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-bold text-white">Monthly Submissions Evolution</h3>
            <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Fiscal Year 2026 Performance</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-white/10 rounded-xl text-white/40 transition-all"><Filter size={20} /></button>
          </div>
        </div>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MONTHLY_SUBMISSIONS}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.3)', fontWeight: 700 }} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="var(--primary)" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCenter;
