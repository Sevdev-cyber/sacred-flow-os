
import React, { useState } from 'react';
import { Archetype } from '../types';
import { Sparkles, Brain, Shield, PenTool, ArrowRight, Loader2, Zap } from 'lucide-react';
import { ARCHETYPE_STATS } from '../constants';
import { generateBackstory } from '../services/geminiService';

interface CharacterCreationProps {
  onComplete: (name: string, archetype: Archetype, backstory: string) => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    if (!name || !selectedArchetype) return;
    setLoading(true);
    const backstory = await generateBackstory(name, selectedArchetype);
    onComplete(name, selectedArchetype, backstory);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#050a06] flex items-center justify-center p-6 animate-in fade-in duration-1000">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Visuals */}
        <div className="hidden md:flex flex-col items-center justify-center text-center space-y-6">
           <div className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-900 to-black border border-emerald-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(16,185,129,0.1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 animate-pulse" />
              {selectedArchetype === 'WEAVER' && <PenTool size={80} className="text-blue-400 animate-bounce" />}
              {selectedArchetype === 'WARDEN' && <Shield size={80} className="text-emerald-400 animate-bounce" />}
              {selectedArchetype === 'SCHOLAR' && <Brain size={80} className="text-amber-400 animate-bounce" />}
              {!selectedArchetype && <Sparkles size={80} className="text-white/20" />}
           </div>
           <div>
             <h2 className="text-3xl font-black text-white uppercase tracking-widest">Soul Architect</h2>
             <p className="text-slate-500 mt-2">Design the vessel for your journey.</p>
           </div>
        </div>

        {/* Right Column: Form */}
        <div className="space-y-8">
           {step === 1 && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><Sparkles className="text-amber-500"/> Identify Yourself</h3>
                <input 
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-2xl text-2xl text-white focus:border-emerald-500 focus:outline-none placeholder:text-white/20"
                />
                <button 
                  disabled={!name}
                  onClick={() => setStep(2)}
                  className="w-full bg-emerald-500 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
             </div>
           )}

           {step === 2 && (
             <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
               <h3 className="text-xl font-bold text-white flex items-center gap-2"><Zap className="text-blue-500"/> Choose your Echo</h3>
               
               <div className="grid gap-4">
                 <ArchetypeCard 
                    type="WEAVER" 
                    title="The Weaver" 
                    desc="Creative & Flow Focused. High Mana generation."
                    stats={ARCHETYPE_STATS.WEAVER}
                    icon={<PenTool />}
                    selected={selectedArchetype === 'WEAVER'}
                    onClick={() => setSelectedArchetype('WEAVER')}
                 />
                 <ArchetypeCard 
                    type="WARDEN" 
                    title="The Warden" 
                    desc="Physical & Action Focused. High Energy reserves."
                    stats={ARCHETYPE_STATS.WARDEN}
                    icon={<Shield />}
                    selected={selectedArchetype === 'WARDEN'}
                    onClick={() => setSelectedArchetype('WARDEN')}
                 />
                 <ArchetypeCard 
                    type="SCHOLAR" 
                    title="The Scholar" 
                    desc="Efficiency & Quality Focused. Balanced output."
                    stats={ARCHETYPE_STATS.SCHOLAR}
                    icon={<Brain />}
                    selected={selectedArchetype === 'SCHOLAR'}
                    onClick={() => setSelectedArchetype('SCHOLAR')}
                 />
               </div>

               <div className="flex gap-4">
                 <button onClick={() => setStep(1)} className="px-6 py-4 rounded-2xl border border-white/10 text-white/40 hover:text-white">Back</button>
                 <button 
                    disabled={!selectedArchetype || loading}
                    onClick={handleFinish}
                    className="flex-1 bg-emerald-500 text-black font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Awaken Soul'}
                  </button>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const ArchetypeCard = ({ type, title, desc, stats, icon, selected, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border flex items-center gap-4 text-left transition-all ${
      selected 
      ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
      : 'bg-white/5 border-white/5 hover:bg-white/10'
    }`}
  >
    <div className={`p-3 rounded-xl ${selected ? 'bg-emerald-500 text-black' : 'bg-black/40 text-white/40'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className={`font-black uppercase tracking-wide ${selected ? 'text-white' : 'text-slate-400'}`}>{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
    <div className="text-[10px] font-mono text-right space-y-1 opacity-60">
      <div className="text-blue-400">FOC {stats.focus}</div>
      <div className="text-red-400">EFF {stats.efficiency}</div>
      <div className="text-amber-400">RES {stats.resonance}</div>
    </div>
  </button>
);

export default CharacterCreation;
