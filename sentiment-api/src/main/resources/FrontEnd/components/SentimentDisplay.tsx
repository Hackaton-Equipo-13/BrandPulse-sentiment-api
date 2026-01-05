
import React, { useState, useEffect } from 'react';
import { SentimentType, ThemeMode, SentimentResult } from '../types';
import { PixelFace } from './PixelFace';

interface SentimentDisplayProps {
  result: SentimentResult;
  theme: ThemeMode;
}

interface OrbitNode {
  id: number;
  type: SentimentType;
  text: string;
  angle: number;
  delay: number;
}

export const SentimentDisplay: React.FC<SentimentDisplayProps> = ({ result, theme }) => {
  const isNeon = theme === ThemeMode.NEON;
  const isLight = theme === ThemeMode.LIGHT;
  const { sentiment, breakdown } = result;
  const [activeNode, setActiveNode] = useState<OrbitNode | null>(null);
  const [nodes, setNodes] = useState<OrbitNode[]>([]);

  useEffect(() => {
    // Generate a collection of nodes based on the real result and simulated historical data
    const baseNodes: OrbitNode[] = [
      { id: 1, type: SentimentType.POSITIVE, text: result.bestSnippet, angle: -45, delay: 0 },
      { id: 2, type: SentimentType.NEGATIVE, text: result.worstSnippet, angle: 135, delay: 0.2 },
      { id: 3, type: SentimentType.NEUTRAL, text: result.randomNeutral, angle: 45, delay: 0.4 },
      // Mock historical/streamed data for the "SoundCloud" feel
      { id: 4, type: SentimentType.POSITIVE, text: "Excellent integration capabilities found in logs.", angle: -10, delay: 0.6 },
      { id: 5, type: SentimentType.NEGATIVE, text: "High latency detected during peak neural load.", angle: 160, delay: 0.8 },
      { id: 6, type: SentimentType.NEUTRAL, text: "API endpoint returned status 200 within limits.", angle: 200, delay: 1.0 },
      { id: 7, type: SentimentType.POSITIVE, text: "Sentiment score increased by 12% in this node.", angle: -80, delay: 1.2 },
    ];
    setNodes(baseNodes);
    // Set the primary result as the active node initially
    const primary = baseNodes.find(n => n.type === sentiment);
    if (primary) setActiveNode(primary);
  }, [result, sentiment]);

  const getEmojiLabel = () => {
    switch (sentiment) {
      case SentimentType.POSITIVE: return 'Positivo';
      case SentimentType.NEGATIVE: return 'Negativo';
      default: return 'Neutro';
    }
  };

  const getColorHex = (type: SentimentType) => {
    switch (type) {
      case SentimentType.POSITIVE: return '#10b981';
      case SentimentType.NEGATIVE: return '#f43f5e';
      default: return '#f59e0b';
    }
  };

  return (
    <div className="flex flex-col items-center py-10 w-full">
      <div className="relative flex items-center justify-center w-[400px] h-[400px]">
        
        {/* Orbital Track (SoundCloud Style Circular Timeline) */}
        <div className={`absolute w-[280px] h-[280px] rounded-full border-2 border-dashed opacity-20 animate-[spin_60s_linear_infinite] ${
          isLight ? 'border-slate-900' : 'border-white'
        }`} />
        
        {/* Sentiment Data Nodes */}
        {nodes.map((node) => {
          const color = getColorHex(node.type);
          const isActive = activeNode?.id === node.id;
          
          return (
            <div
              key={node.id}
              className="absolute transition-all duration-500 cursor-pointer group"
              style={{
                transform: `rotate(${node.angle}deg) translate(140px) rotate(-${node.angle}deg)`,
              }}
              onClick={() => setActiveNode(node)}
            >
              {/* The Voxel/Node */}
              <div 
                className={`w-4 h-4 transition-all duration-300 transform ${isActive ? 'scale-150 rotate-45' : 'hover:scale-125'}`}
                style={{ 
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 15px ${color}` : 'none',
                  border: isLight ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(255,255,255,0.2)'
                }}
              />
              
              {/* Connector line when active */}
              {isActive && (
                <div 
                  className="absolute w-[40px] h-[2px] top-1/2 left-1/2 origin-left"
                  style={{ 
                    backgroundColor: color,
                    transform: `translate(10px, -50%)`,
                    opacity: 0.4
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Central Result Emoji */}
        <div className="relative z-10 flex flex-col items-center animate-in zoom-in-50 duration-500">
          <PixelFace 
            type={sentiment} 
            percentage={breakdown[sentiment.toLowerCase() as keyof typeof breakdown] || 0} 
            breakdown={breakdown}
            size={180}
            isNeon={isNeon}
          />
          <span className={`text-[10px] uppercase font-pixel tracking-[0.3em] mt-8 p-1 px-3 border-2 ${
             isNeon ? 'neon-text-cyan neon-border-cyan' : isLight ? 'text-slate-900 border-slate-900' : 'text-current border-current'
          }`}>
            {getEmojiLabel()}
          </span>
        </div>

        {/* Floating Active Comment (The "Visual Player" part) */}
        {activeNode && (
          <div 
            className={`absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-64 p-5 border-4 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300 z-30 ${
              isNeon ? 'neon-border-cyan bg-black/90' : isLight ? 'border-slate-900 bg-white/95 shadow-[8px_8px_0px_rgba(0,0,0,1)]' : 'border-current bg-slate-950/90'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getColorHex(activeNode.type) }} />
              <span className="font-pixel text-[8px] opacity-60 uppercase">{activeNode.type}_FRAGMENT</span>
            </div>
            <p className={`text-[11px] font-mono leading-tight ${isLight ? 'text-slate-800' : 'text-white/90'}`}>
              <span className="opacity-40">{"> "}</span>
              {activeNode.text}
            </p>
            <div className="mt-4 flex gap-1 h-1">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex-1 bg-current opacity-20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend / Info bar */}
      <div className={`mt-12 flex gap-8 font-pixel text-[9px] uppercase tracking-widest opacity-60 ${isLight ? 'text-slate-700' : ''}`}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#10b981]" /> POS_NODES
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#f59e0b]" /> NEU_NODES
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#f43f5e]" /> NEG_NODES
        </div>
      </div>
    </div>
  );
};
