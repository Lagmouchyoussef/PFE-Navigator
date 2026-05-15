import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const PERFORMANCE_DATA: any[] = [];

const JuryPerformanceChart: React.FC = () => (
  <div className="glass-card p-4 h-100">
    <h5 className="fw-bold mb-4 border-bottom pb-2">Evaluation Activity</h5>
    <div style={{ height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
        <AreaChart data={PERFORMANCE_DATA}>
          <defs>
            <linearGradient id="colorScoreJury" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
            itemStyle={{ color: 'var(--color-text-primary)' }}
          />
          <Area type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreJury)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default JuryPerformanceChart;
