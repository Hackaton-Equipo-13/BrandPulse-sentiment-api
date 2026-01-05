
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from 'recharts';
import { SentimentResult, ThemeMode } from '../types';

interface AnalyticsChartsProps {
  data: SentimentResult;
  theme: ThemeMode;
}

const CustomTooltip = ({ active, payload, isNeon }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className={`bg-black p-5 border-4 font-pixel text-[10px] shadow-[10px_10px_0px_rgba(0,0,0,0.6)] ${
        isNeon ? 'neon-border-cyan neon-text-cyan' : 'border-current'
      }`}>
        <p className="mb-3 tracking-tighter">{`ENTRY: ${data.name.toUpperCase()}`}</p>
        <p className="mb-3">{`LOAD: ${data.value}%`}</p>
        <div className="w-full bg-white/10 h-3 border-2 border-current/20">
          <div 
            className="h-full bg-current transition-all duration-500" 
            style={{ width: `${data.value}%` }}
          />
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data, theme }) => {
  const isNeon = theme === ThemeMode.NEON;
  
  const chartData = [
    { name: 'Positivo', value: data.breakdown.positive, color: isNeon ? '#00ffff' : '#10b981' },
    { name: 'Neutro', value: data.breakdown.neutral, color: isNeon ? '#f59e0b' : '#f59e0b' },
    { name: 'Negativo', value: data.breakdown.negative, color: isNeon ? '#ff00ff' : '#f43f5e' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full mt-16">
      {/* Distribution Matrix */}
      <div className={`p-10 border-4 transition-all hover:translate-y-[-8px] group ${
        isNeon ? 'neon-border-pink bg-black shadow-[10px_10px_0px_#ff00ff]' : 'border-current bg-white/5 shadow-[12px_12px_0px_currentColor]'
      }`}>
        <h3 className="text-[11px] font-pixel uppercase mb-10 opacity-70 tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-current animate-pulse"/> _distribution_layer
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={6}
                dataKey="value"
                stroke="none"
                animationDuration={1200}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="outside" 
                  offset={20} 
                  fill="currentColor" 
                  formatter={(v: number) => `${v}%`} 
                  className="text-[10px] font-pixel" 
                />
              </Pie>
              <Tooltip content={<CustomTooltip isNeon={isNeon} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Precision Stats */}
      <div className={`p-10 border-4 transition-all hover:translate-y-[-8px] group ${
        isNeon ? 'neon-border-cyan bg-black shadow-[10px_10px_0px_#00ffff]' : 'border-current bg-white/5 shadow-[12px_12px_0px_currentColor]'
      }`}>
        <h3 className="text-[11px] font-pixel uppercase mb-10 opacity-70 tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-current animate-pulse"/> _precision_matrix
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={60} margin={{ top: 20 }}>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor', fontSize: 9, fontFamily: 'Silkscreen' }} 
                axisLine={{ stroke: 'currentColor', strokeWidth: 3 }} 
                tickLine={false} 
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                content={<CustomTooltip isNeon={isNeon} />}
                cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              />
              <Bar dataKey="value" animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    className="hover:brightness-125 transition-all cursor-pointer"
                  />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  fill="currentColor" 
                  formatter={(v: number) => `${v}%`} 
                  className="text-[10px] font-pixel" 
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
