
import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { Sparkles, Zap, Flame, Compass, Calendar, Coffee, Play, Pause, RotateCcw, Timer, Swords, Leaf, Wind, Moon, Sun } from 'lucide-react';
import { LEISURE_ITEMS, COLORS } from '../constants';
import MuseFamiliar from './MuseFamiliar';

interface DashboardProps {
  char: Character;
  guidance: string;
  onSpendEnergy: (cost: number) => void;
  onToggleBattleMode: (active: boolean) => void;
  onActivateSanctuary: () => void;
  onToggleTwilight: () => void; // New
}

const FocusTimer: React.FC<{ onStateChange: (active: boolean) => void }> = ({ onStateChange }) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isModeTimer, setIsModeTimer] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    onStateChange(isActive);
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((prev) => {
          if (isModeTimer) {
            if (prev <= 0) {
              setIsActive(false);
              return 0;
            }
            return prev - 1;
          } else {
            return prev + 1;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, isModeTimer, onStateChange]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setSeconds(isModeTimer ? 25 * 60 : 0);
  };

  return (
    <div className={`bg-[#0d1a0e] border transition-all duration-700 p-6 rounded-2xl flex flex-col items-center justify-center relative group ${isActive ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-emerald-900/30'}`}>
      <div className="flex items-center gap-2 mb-4">
        <button 
          onClick={() => { setIsModeTimer(true); setSeconds(25 * 60); setIsActive(false); }}
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors ${isModeTimer ? 'bg-emerald-500 text-black' : 'text-emerald-500/40 hover:text-emerald-500'}`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => { setIsModeTimer(false); setSeconds(0); setIsActive(false); }}
          className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded transition-colors ${!isModeTimer ? 'bg-blue-500 text-white' : 'text-blue-500/40 hover:text-blue-500'}`}
        >
          Flow
        </button>
      </div>

      <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
          <circle 
            cx="64" cy="64" r="60" fill="none" stroke="currentColor" strokeWidth="4" 
            strokeDasharray="377" 
            strokeDashoffset={isModeTimer ? (377 * (1 - (seconds / (25 * 60)))) : (isActive ? (seconds % 60) * 6 : 0)} 
            className={`transition-all duration-1000 ${isActive ? 'text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : isModeTimer ? 'text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-blue-500'}`} 
          />
        </svg>
        <div className="flex flex-col items-center">
           <span className={`text-2xl font-black transition-colors ${isActive ? 'text-red-500' : 'text-white'}`}>{formatTime(seconds)}</span>
           <span className="text-[8px] font-bold uppercase text-white/20">{isActive ? 'BATTLE' : 'ZEN'}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={toggle} className={`p-3 rounded-xl transition-all ${isActive ? 'bg-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-emerald-500 text-black'}`}>
          {isActive ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={reset} className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all">
          <RotateCcw size={20} />
        </button>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ char, guidance, onSpendEnergy, onToggleBattleMode, onActivateSanctuary, onToggleTwilight }) => {
  const xpPercentage = (char.xp / char.nextLevelXp) * 100;
  const isTwilight = char.settings.twilightMode;

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ${char.settings.battleMode ? 'grayscale-[0.5] brightness-75' : ''}`}>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="transition-all duration-700">
          <h2 className={`font-bold uppercase tracking-[0.2em] text-sm transition-colors ${char.settings.battleMode ? 'text-red-500' : isTwilight ? 'text-indigo-400' : 'text-emerald-500'}`}>
            {char.settings.battleMode ? 'Warrior of the Wastes' : isTwilight ? 'Tend the Embers' : 'Sacred Forest Seeker'}
          </h2>
          <h1 className="text-4xl font-extrabold text-white">{char.name} <span className="text-emerald-400/50">LVL {char.level}</span></h1>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Twilight Toggle */}
            <button
                onClick={onToggleTwilight}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                    isTwilight 
                    ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-300' 
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                }`}
                title="Toggle Twilight Mode (Low Energy)"
            >
                {isTwilight ? <Moon size={16} /> : <Sun size={16} />}
                <span className="text-xs font-black uppercase tracking-widest">{isTwilight ? 'Twilight' : 'Sun'}</span>
            </button>

            <button 
            onClick={onActivateSanctuary}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]"
            >
            <Wind size={16} /> Ground Me
            </button>
        </div>
      </header>
      
      {/* Stats Row */}
      {isTwilight ? (
          <div className="p-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center justify-center gap-4 animate-in fade-in">
              <Moon className="text-indigo-400" />
              <p className="text-indigo-200 text-sm font-medium">The forest sleeps. Streak is frozen. Earn <span className="text-amber-400 font-bold">{char.embers} Embers</span> to reignite tomorrow.</p>
          </div>
      ) : (
        <div className="flex gap-4">
            <StatCard icon={<Sparkles size={18}/>} value={char.vibration} label="Vibration" color="text-amber-400" bg="bg-amber-400/10" />
            <StatCard icon={<Zap size={18}/>} value={char.mana} label="Mana" color="text-blue-400" bg="bg-blue-400/10" />
            <StatCard icon={<Flame size={18}/>} value={char.energy} label="Energy" color="text-red-400" bg="bg-red-400/10" />
        </div>
      )}

      {/* Progress & Focus Timer */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-2 space-y-4">
           {/* XP Bar */}
          {!isTwilight && (
            <div className="bg-[#0d1a0e] p-1 rounded-full border border-emerald-900/30 overflow-hidden relative group">
                <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)] ${char.settings.battleMode ? 'bg-gradient-to-r from-red-800 to-red-500' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'}`}
                style={{ width: `${xpPercentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                {char.xp} / {char.nextLevelXp} XP
                </div>
            </div>
          )}
          
          {/* Guide Block & Muse Familiar */}
          <div className="flex gap-4">
             {/* Muse Familiar Widget */}
             <div className="shrink-0">
                 <MuseFamiliar energy={char.energy} />
             </div>

             <div className={`flex-1 transition-all duration-700 border p-6 rounded-2xl flex items-start gap-4 shadow-inner ${
                 isTwilight ? 'bg-indigo-950/20 border-indigo-500/20' : 
                 char.settings.battleMode ? 'bg-red-950/20 border-red-500/30' : 'bg-emerald-900/10 border-emerald-800/20'
             }`}>
                <div>
                    <h3 className={`font-bold uppercase tracking-widest text-xs mb-1 transition-colors ${
                        isTwilight ? 'text-indigo-400' :
                        char.settings.battleMode ? 'text-red-400' : 'text-emerald-400'
                    }`}>
                        {char.settings.battleMode ? 'BATTLE CRY' : isTwilight ? 'NIGHT WATCH' : 'Whispers from the Grove'}
                    </h3>
                    <p className="text-xl italic text-white dyslexic-friendly">{char.settings.battleMode ? 'Steel your focus. The boss approaches.' : guidance}</p>
                </div>
             </div>
          </div>
        </div>

        <FocusTimer onStateChange={onToggleBattleMode} />

        <div className={`transition-all duration-700 border p-6 rounded-2xl flex flex-col items-center justify-center text-center ${char.settings.battleMode ? 'bg-red-950/10 border-red-500/20' : 'bg-[#0d1a0e] border-emerald-900/30'}`}>
          <div className="relative">
            {char.settings.battleMode ? <Zap className="text-red-500 mb-2 animate-bounce" size={32} /> : <Calendar className="text-emerald-500 mb-2" size={32} />}
            {char.forgivenessBuffer > 0 && !char.settings.battleMode && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] font-black flex items-center justify-center" title="Forgiveness Buffer">
                {char.forgivenessBuffer}
              </span>
            )}
          </div>
          <span className="text-3xl font-black text-white">{char.streak} Days</span>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${char.settings.battleMode ? 'text-red-500' : 'text-emerald-500/50'}`}>
             {char.settings.battleMode ? 'COMBAT STREAK' : isTwilight ? 'STREAK FROZEN' : 'High Vibration Streak'}
          </span>
        </div>
      </div>

      {/* Leisure Emporium - Hide in Battle Mode for ADHD focus */}
      {!char.settings.battleMode && !isTwilight && (
        <section className="space-y-4 animate-in slide-in-from-top-2 duration-1000">
          <h3 className="text-lg font-bold flex items-center gap-2 text-red-400">
            <Coffee size={20} /> Leisure Emporium
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LEISURE_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onSpendEnergy(item.cost)}
                disabled={char.energy < item.cost}
                className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-1 group ${
                  char.energy >= item.cost 
                  ? 'bg-[#0d1a0e] border-red-900/30 hover:border-red-500 active:scale-95' 
                  : 'bg-black/40 border-slate-900 opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white dyslexic-friendly">{item.name}</span>
                  <span className="text-xs font-black text-red-500">{item.cost} E</span>
                </div>
                <p className="text-xs text-slate-500 dyslexic-friendly">{item.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const StatCard = ({ icon, value, label, color, bg }: any) => (
  <div className={`${bg} border border-white/5 px-4 py-3 rounded-xl flex flex-col items-center min-w-[80px]`}>
    <span className={color}>{icon}</span>
    <span className="text-xl font-bold mt-1">{value}</span>
    <span className="text-[10px] uppercase font-bold text-white/40">{label}</span>
  </div>
);

export default Dashboard;
