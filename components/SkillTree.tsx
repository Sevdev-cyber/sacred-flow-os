
import React, { useState, useRef, useEffect } from 'react';
import { SkillNode, SkillType } from '../types';
import { Briefcase, Music, Heart, Lock, Unlock, BarChart3, Activity, Users, Zap, Sparkles, Eye, Waves, Brain, Anchor, Feather, Shield, Book, Globe, Sword, Search, MousePointer2, History, Ear, Crown, FastForward } from 'lucide-react';

interface SkillTreeProps {
  skills: SkillNode[];
  onUnlock: (id: string) => void;
  vibration: number; // Changed from Mana to Vibration (XP Currency)
}

const SkillTree: React.FC<SkillTreeProps> = ({ skills, onUnlock, vibration }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const getIcon = (iconName: string, className: string) => {
    const props = { className };
    switch (iconName) {
      case 'Briefcase': return <Briefcase {...props} />;
      case 'Music': return <Music {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'BarChart3': return <BarChart3 {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Users': return <Users {...props} />;
      case 'Eye': return <Eye {...props} />;
      case 'Waves': return <Waves {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Anchor': return <Anchor {...props} />;
      case 'Feather': return <Feather {...props} />;
      case 'Shield': return <Shield {...props} />;
      case 'Book': return <Book {...props} />;
      case 'Globe': return <Globe {...props} />;
      case 'Sword': return <Sword {...props} />;
      case 'Lock': return <Lock {...props} />;
      case 'History': return <History {...props} />;
      case 'Ear': return <Ear {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'FastForward': return <FastForward {...props} />;
      default: return <Unlock {...props} />;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Center on mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setOffset({ x: clientWidth / 2, y: clientHeight / 2 });
    }
  }, []);

  const isVisible = (skill: SkillNode) => {
    if (skill.unlocked) return true;
    if (!skill.prerequisiteId) return true; // Source
    const parent = skills.find(s => s.id === skill.prerequisiteId);
    return parent?.unlocked;
  };

  const getLineColor = (source: SkillNode, target: SkillNode) => {
    if (source.unlocked && target.unlocked) return "#10b981"; // Connected & Active
    if (source.unlocked && !target.unlocked) return "#334155"; // Available path
    return "transparent"; // Hidden in fog
  };

  const filteredSkills = skills.filter(s => {
    if (!searchQuery) return true;
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full w-full relative overflow-hidden bg-[#020402] select-none cursor-move"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* HUD Layer */}
      <div className="absolute top-0 left-0 right-0 z-50 p-6 pointer-events-none flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Sparkles className="text-amber-500" /> Celestial Lattice
          </h2>
          <p className="text-xs text-slate-400">Drag to explore the constellation.</p>
        </div>
        
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <div className="bg-amber-900/20 border border-amber-500/30 px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center gap-3">
             <span className="text-amber-400 font-bold uppercase text-[10px] tracking-[0.2em]">Vibration (XP)</span>
             <span className="text-white text-2xl font-black">{vibration}</span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search constellations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-emerald-500 outline-none w-64 backdrop-blur-sm transition-all focus:w-80"
            />
          </div>
        </div>
      </div>

      {/* Canvas Layer */}
      <div 
        className="absolute top-0 left-0 transition-transform duration-75 ease-out"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        {/* Background Grid */}
        <div 
            className="absolute inset-[-4000px] opacity-10 pointer-events-none"
            style={{ 
                backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', 
                backgroundSize: '50px 50px' 
            }} 
        />

        <svg className="absolute top-[-4000px] left-[-4000px] w-[8000px] h-[8000px] pointer-events-none overflow-visible">
          {skills.map(skill => {
            if (!skill.prerequisiteId) return null;
            const parent = skills.find(s => s.id === skill.prerequisiteId);
            if (!parent) return null;
            // Only draw if visible in fog
            if (!isVisible(skill) && !isVisible(parent)) return null;

            return (
              <line
                key={`link-${skill.id}`}
                x1={4000 + parent.x}
                y1={4000 + parent.y}
                x2={4000 + skill.x}
                y2={4000 + skill.y}
                stroke={getLineColor(parent, skill)}
                strokeWidth={skill.unlocked ? 3 : 1}
                strokeDasharray={skill.unlocked ? "0" : "5,5"}
                className="transition-all duration-1000"
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {skills.map(skill => {
          const visible = isVisible(skill);
          const isMatch = searchQuery && (
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            skill.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          if (!visible && !isMatch) return null;

          // If searching, dim non-matches. If visible, full opacity. If search match but not visible (fog), show ghost.
          let opacity = visible ? 1 : 0;
          if (isMatch) opacity = 0.8; 

          const size = skill.type === 'KEYSTONE' ? 80 : skill.type === 'MAJOR' ? 56 : 40;

          return (
            <div
              key={skill.id}
              className="absolute flex flex-col items-center justify-center group/node"
              style={{
                left: skill.x,
                top: skill.y,
                width: size,
                height: size,
                transform: 'translate(-50%, -50%)',
                opacity
              }}
            >
              <button
                disabled={skill.unlocked || vibration < skill.cost || (!visible && !isMatch)}
                onClick={(e) => { e.stopPropagation(); onUnlock(skill.id); }}
                className={`relative rounded-full flex items-center justify-center transition-all duration-500 ${
                   skill.unlocked 
                   ? 'bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.6)] scale-110'
                   : vibration >= skill.cost && visible
                     ? 'bg-black border-2 border-amber-500/50 text-amber-500 hover:scale-110 hover:bg-amber-500 hover:text-black cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                     : 'bg-slate-900 border border-slate-700 text-slate-700'
                } ${isMatch && !visible ? 'animate-pulse border-white/50 bg-white/10' : ''}`}
                style={{ width: '100%', height: '100%' }}
              >
                {getIcon(skill.icon, skill.type === 'KEYSTONE' ? 'w-8 h-8' : 'w-5 h-5')}
                
                {/* Search Pulse Ring */}
                {isMatch && (
                    <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
                )}
              </button>

              {/* Tooltip */}
              <div className="absolute top-full mt-4 bg-black/90 border border-white/10 p-4 rounded-xl w-64 opacity-0 group-hover/node:opacity-100 transition-opacity pointer-events-none z-50 backdrop-blur-md">
                 <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-black uppercase tracking-widest text-sm ${skill.unlocked ? 'text-emerald-400' : 'text-white'}`}>
                        {skill.name}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 uppercase">
                        {skill.type}
                    </span>
                 </div>
                 <p className="text-xs text-slate-400 italic mb-3">{skill.description}</p>
                 
                 {skill.tradeOff && (
                     <div className="bg-red-900/20 border border-red-500/30 p-2 rounded mb-3">
                         <p className="text-[10px] text-red-400 font-bold uppercase mb-1">Warning: Trade-off</p>
                         <p className="text-xs text-red-200">{skill.tradeOff}</p>
                     </div>
                 )}

                 {skill.stats && (
                    <div className="space-y-1 border-t border-white/10 pt-2">
                        {Object.entries(skill.stats).map(([k, v]) => (
                            <div key={k} className="flex justify-between text-[10px] uppercase font-bold text-blue-300">
                                <span>{k}</span>
                                <span>+{v}</span>
                            </div>
                        ))}
                    </div>
                 )}
                 
                 {!skill.unlocked && (
                     <div className="mt-3 text-right">
                         <span className={`font-black text-xs ${vibration >= skill.cost ? 'text-amber-400' : 'text-red-500'}`}>
                             COST: {skill.cost} VIBRATION
                         </span>
                     </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillTree;
