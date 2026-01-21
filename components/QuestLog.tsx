
import React, { useState, useEffect } from 'react';
import { Task, QuestType, TaskCategory, SkillNode, Loot, Character } from '../types';
import { Scroll, Sword, ShieldAlert, Zap, Palette, Sparkles, Brain, Ghost, RefreshCw, Box, Flame, Coins, Check } from 'lucide-react';
import { calculateRewards } from '../utils/vibrationLogic';
import { evaluateThoughtWithAI } from '../services/geminiService';
import BionicText from './BionicText';
import DivineParticles from './DivineParticles';

interface QuestLogProps {
  tasks: Task[];
  skills: SkillNode[];
  character: Character;
  onAddTask: (task: Task) => void;
  onCompleteTask: (taskId: string, inFlow: boolean) => void;
  onDeleteTask: (taskId: string) => void;
  onFailTask: (taskId: string) => void;
  goldRushMode: boolean; // New prop
  isTwilightMode: boolean; // New prop
}

const QuestLog: React.FC<QuestLogProps> = ({ tasks, skills, character, onAddTask, onCompleteTask, onDeleteTask, onFailTask, goldRushMode, isTwilightMode }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thought, setThought] = useState('');
  const [activeFlowId, setActiveFlowId] = useState<string | null>(null);
  const [showJuice, setShowJuice] = useState(false);
  const [burningId, setBurningId] = useState<string | null>(null);

  // The Curse Logic: Check for admin pile-up
  useEffect(() => {
    const adminCount = tasks.filter(t => t.category === 'NEUTRAL' && !t.isCompleted).length;
    if (adminCount > 3) {
      document.body.style.filter = 'brightness(0.85) grayscale(0.2)'; // Visual curse
    } else {
      document.body.style.filter = 'none';
    }
    return () => { document.body.style.filter = 'none'; };
  }, [tasks]);

  const handleThoughtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thought) return;
    
    setLoading(true);
    const aiResponse = await evaluateThoughtWithAI(thought);
    
    aiResponse.quests.forEach((q: any) => {
      const rewards = calculateRewards(
        q.difficulty, 
        q.urgency, 
        q.type as QuestType, 
        q.category as TaskCategory, 
        skills.filter(s => s.unlocked),
        character
      );
      
      const task: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: q.title,
        description: `Parsed from thought: "${thought}"`,
        type: q.type as QuestType,
        category: q.category as TaskCategory,
        difficulty: q.difficulty,
        urgency: q.urgency,
        isCompleted: false,
        rewards,
        loot: q.loot as Loot,
        createdAt: Date.now(),
      };
      onAddTask(task);
    });

    setThought('');
    setShowAdd(false);
    setLoading(false);
  };

  const handleComplete = (task: Task, inFlow: boolean) => {
    if (character.settings.highJuice) {
      setShowJuice(true);
      setTimeout(() => setShowJuice(false), 1000);
      document.body.classList.add('shake');
      setTimeout(() => document.body.classList.remove('shake'), 300);
    }

    if (task.category === 'NEUTRAL') {
       // Trigger Transmutation Animation
       setBurningId(task.id);
       setTimeout(() => {
         onCompleteTask(task.id, inFlow);
         setBurningId(null);
       }, 800); // Wait for burn animation
    } else {
       onCompleteTask(task.id, inFlow);
    }
  };

  const getQuestIcon = (type: QuestType) => {
    switch (type) {
      case QuestType.MAIN: return <Scroll className="text-emerald-400" />;
      case QuestType.BOSS: return <Sword className="text-red-400" />;
      case QuestType.SHADOW: return <Ghost className="text-purple-400" />;
      default: return <ShieldAlert className="text-slate-400" />;
    }
  };

  const getCategoryIcon = (cat: TaskCategory) => {
    switch (cat) {
      case 'CREATIVE': return <Palette size={14} className="text-blue-400" />;
      case 'PHYSICAL': return <DumbbellIcon />;
      default: return <Sparkles size={14} className="text-amber-400" />;
    }
  };

  // Twilight Mode Filtering
  let visibleTasks = tasks.filter(t => !t.isCompleted);
  if (isTwilightMode) {
    // Show only 3 easiest tasks
    visibleTasks = visibleTasks
      .sort((a, b) => a.difficulty - b.difficulty)
      .slice(0, 3);
  }

  return (
    <div className="space-y-6">
      <DivineParticles active={showJuice} />
      
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold flex items-center gap-2 ${goldRushMode ? 'text-amber-400' : 'text-emerald-500'}`}>
          {goldRushMode ? <><Coins className="text-amber-400" /> GOLD RUSH ACTIVE</> : <><Scroll /> Active Quests</>}
        </h2>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95 text-xs uppercase tracking-widest"
        >
          <Brain size={18} /> Thought Capture
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleThoughtSubmit} className="bg-[#0d1a0e] p-8 rounded-3xl border border-emerald-500/30 space-y-4 animate-in zoom-in-95 duration-300">
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Whisper your intent</h3>
            <textarea 
              autoFocus
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="e.g., 'Need to finish the website deck and call the plumber, I'm stressed about the deadline'"
              className="w-full bg-black/40 border border-emerald-900/50 p-6 rounded-2xl focus:outline-none focus:border-emerald-500 text-lg dyslexic-friendly min-h-[120px] placeholder:text-emerald-900/50"
            />
          </div>
          <button 
            disabled={loading || !thought}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl text-lg uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
          >
            {loading ? (
              <><Zap className="animate-spin" /> Consulting the Deep Arbiter...</>
            ) : 'Consult AI Arbiter'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {visibleTasks.map(task => {
          const isShadow = task.type === QuestType.SHADOW;
          const isNeutral = task.category === 'NEUTRAL';
          const isBurning = burningId === task.id;

          return (
            <div 
              key={task.id} 
              className={`group relative border p-6 rounded-3xl flex items-center justify-between transition-all duration-500 overflow-hidden ${
                isBurning ? 'scale-90 opacity-0 bg-red-900' :
                isShadow 
                ? 'bg-[#120a1a] border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
                : goldRushMode && isNeutral
                  ? 'bg-amber-900/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                  : 'bg-[#0d1a0e] border-emerald-900/20 hover:border-emerald-500/40'
              } ${activeFlowId === task.id ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}
            >
              <div className="flex items-center gap-5 flex-1 relative z-10">
                <div className={`p-4 rounded-2xl border transition-colors ${
                  isShadow ? 'bg-purple-500/10 border-purple-500/20' : 'bg-black/40 border-emerald-900/30'
                }`}>
                  {getQuestIcon(task.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-xl font-bold dyslexic-friendly ${goldRushMode && isNeutral ? 'text-amber-200' : 'text-white'}`}>
                      <BionicText text={task.title} enabled={character.settings.bionicReading} />
                    </h3>
                    {task.loot && (
                      <div className="bg-amber-500/20 text-amber-500 p-1 rounded-lg animate-pulse" title={`Loot Drop: ${task.loot.name}`}>
                        <Box size={14} />
                      </div>
                    )}
                  </div>
                  
                  {/* Quest Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      isShadow ? 'text-purple-400 border-purple-500/20' : 'text-emerald-500/60 border-emerald-500/10'
                    }`}>
                      {task.type}
                    </span>
                    <div className="flex gap-1 items-center bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {getCategoryIcon(task.category)}
                      <span className="text-[9px] font-black uppercase text-white/40">{task.category}</span>
                    </div>
                    {!isTwilightMode && (
                        <button 
                        onClick={() => setActiveFlowId(activeFlowId === task.id ? null : task.id)}
                        className={`text-[9px] font-black uppercase flex items-center gap-1 px-2 py-0.5 rounded border transition-colors ${
                            activeFlowId === task.id 
                            ? 'bg-blue-500 text-white border-blue-400' 
                            : 'bg-blue-500/5 text-blue-500/60 border-blue-500/10 hover:bg-blue-500/20'
                        }`}
                        >
                        <Zap size={10}/> FLOW
                        </button>
                    )}
                  </div>

                  {/* Rewards Display */}
                  {!isTwilightMode && (
                    <div className="flex items-center gap-4 bg-black/20 p-2 px-3 rounded-xl border border-white/5 w-fit">
                        <div className="flex items-center gap-1.5" title="Vibration XP">
                        <Sparkles size={12} className="text-amber-400" />
                        <span className="text-xs font-black text-amber-400">+{task.rewards.vibration}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Mana Currency">
                        <Zap size={12} className="text-blue-400" />
                        <span className="text-xs font-black text-blue-400">+{task.rewards.mana}</span>
                        </div>
                        <div className="flex items-center gap-1.5" title="Energy Currency">
                        <Flame size={12} className="text-red-400" />
                        <span className="text-xs font-black text-red-400">+{task.rewards.energy}</span>
                        </div>
                    </div>
                  )}

                  {task.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic dyslexic-friendly">
                      <BionicText text={task.description} enabled={character.settings.bionicReading} />
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 ml-4 relative z-10">
                {!isShadow && (
                  <button 
                    onClick={() => onFailTask(task.id)}
                    className="p-4 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                    title="Missed Task (Shadow Quest)"
                  >
                    <RefreshCw size={20} />
                  </button>
                )}
                
                {isNeutral ? (
                  <button 
                     onClick={() => handleComplete(task, activeFlowId === task.id)}
                     className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all group/burn ${
                        goldRushMode 
                        ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                        : 'bg-orange-600 hover:bg-orange-500 text-white shadow-orange-900/20'
                     }`}
                     title="Transmute Task"
                  >
                    <Flame size={28} className={goldRushMode ? 'animate-pulse' : 'group-hover/burn:animate-bounce'} />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleComplete(task, activeFlowId === task.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg active:scale-90 transition-all ${
                        isShadow 
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/20' 
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/10'
                    }`}
                  >
                    <Check size={28} strokeWidth={4} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {visibleTasks.length === 0 && (
          <div className="text-center py-24 bg-emerald-900/5 rounded-[3rem] border border-dashed border-emerald-900/20">
             <Ghost size={48} className="mx-auto text-emerald-900/30 mb-4" />
             <p className="text-slate-500 italic dyslexic-friendly text-lg">The path is clear. Quiet your mind.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const DumbbellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
    <path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>
  </svg>
);

export default QuestLog;
