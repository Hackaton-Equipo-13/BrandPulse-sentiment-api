
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
      <div className={`bg-black p-5 border-4 font-pixel text-[10px] shadow-[10px_10px_0px_rgba(0,0,0,0.6)] rounded-lg ${
        isNeon ? 'neon-border-cyan neon-text-cyan' : 'border-current'
      }`}>
        <p className="mb-3 tracking-tighter">{`ENTRY: ${data.name.toUpperCase()}`}</p>
        <p className="mb-3">{`LOAD: ${data.value}%`}</p>
        <div className="w-full bg-white/10 h-3 border-2 border-current/20 rounded-lg">
          <div 
            className="h-full bg-current transition-all duration-500 rounded-lg" 
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
    { name: 'Positivo', value: Number(data.breakdown.positive.toFixed(0)), color: isNeon ? '#00ffff' : '#10b981', gradientId: 'gradientPositive' },
    { name: 'Neutro', value: Number(data.breakdown.neutral.toFixed(0)), color: isNeon ? '#f59e0b' : '#f59e0b', gradientId: 'gradientNeutral' },
    { name: 'Negativo', value: Number(data.breakdown.negative.toFixed(0)), color: isNeon ? '#ff00ff' : '#f43f5e', gradientId: 'gradientNegative' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full mt-16">
      {/* Distribution Matrix (Pie Chart) */}
      <div className={`p-10 border-4 transition-all hover:translate-y-[-8px] group rounded-lg ${
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

      {/* Precision Stats (Horizontal Bars) */}
      <div className={`p-10 border-4 transition-all hover:translate-y-[-8px] group rounded-lg ${
        isNeon ? 'neon-border-cyan bg-black shadow-[10px_10px_0px_#00ffff]' : 'border-current bg-white/5 shadow-[12px_12px_0px_currentColor]'
      }`}>
        <h3 className="text-[11px] font-pixel uppercase mb-10 opacity-70 tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-current animate-pulse"/> Precisión por categoría
        </h3>
        <div className="flex flex-col gap-6 h-72 justify-center">
          {chartData.map((entry, idx) => (
            <div key={entry.name} className="flex items-center gap-4 w-full">
              <span className="w-20 text-right font-pixel text-xs uppercase" style={{color: entry.color}}>{entry.name}</span>
              <div className="flex-1 h-7 bg-slate-800/40 rounded-full overflow-hidden border-2 border-current relative">
                <div 
                  className="h-full transition-all duration-700 flex items-center pl-2 font-pixel text-xs font-bold"
                  style={{ width: `${entry.value}%`, background: entry.color, color: '#fff', borderRadius: 8 }}
                >
                  {entry.value}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grafico de Barras Verticales */}
      <div className={`p-10 border-4 transition-all hover:translate-y-[-8px] group rounded-lg ${
        isNeon ? 'neon-border-cyan bg-black shadow-[10px_10px_0px_#00ffff]' : 'border-current bg-white/5 shadow-[12px_12px_0px_currentColor]'
      }`}>
        <h3 className="text-[11px] font-pixel uppercase mb-10 opacity-70 tracking-tighter flex items-center gap-2">
          <div className="w-2 h-2 bg-current animate-pulse"/> _precision_matrix
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20 }}>
              <defs>
                <linearGradient id="gradientPositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isNeon ? '#00ffff' : '#10b981'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isNeon ? '#00ffff' : '#10b981'} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isNeon ? '#f59e0b' : '#f59e0b'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isNeon ? '#f59e0b' : '#f59e0b'} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradientNegative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isNeon ? '#ff00ff' : '#f43f5e'} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={isNeon ? '#ff00ff' : '#f43f5e'} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor', fontSize: 9, fontFamily: 'Silkscreen' }} 
                axisLine={{ stroke: 'currentColor', strokeWidth: 3 }} 
                tickLine={false} 
              />
              <YAxis 
                tickFormatter={(value: number) => `${value}%`}
                tick={{ fill: 'currentColor', fontSize: 9, fontFamily: 'Silkscreen' }}
                axisLine={{ stroke: 'currentColor', strokeWidth: 3 }}
                label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: 'currentColor', fontSize: 11, fontFamily: 'Silkscreen' }}
              />
              <Tooltip 
                content={<CustomTooltip isNeon={isNeon} />}
                cursor={{ fill: 'rgba(255,255,255,0.08)' }}
              />
              <Bar dataKey="value" animationDuration={800}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#${entry.gradientId})`}
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
