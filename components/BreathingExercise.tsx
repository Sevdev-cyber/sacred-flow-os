import React, { useState, useEffect } from 'react';
import { X, Wind } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [count, setCount] = useState(4);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    let timer: any;

    const runCycle = () => {
      // Inhale (4s)
      setPhase('Inhale');
      setCount(4);
      setScale(1.5);
      
      timer = setTimeout(() => {
        // Hold (4s)
        setPhase('Hold');
        setCount(4);
        
        timer = setTimeout(() => {
          // Exhale (4s)
          setPhase('Exhale');
          setCount(4);
          setScale(0.8);
          
          timer = setTimeout(() => {
            runCycle();
          }, 4000);
        }, 4000);
      }, 4000);
    };

    runCycle();

    return () => clearTimeout(timer);
  }, []);

  // Countdown effect
  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [count, phase]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-700">
      <button 
        onClick={onClose} 
        className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Outer Glow */}
          <div 
            className={`absolute inset-0 rounded-full blur-[80px] transition-all duration-[4000ms] ${
              phase === 'Inhale' ? 'bg-emerald-500/40' : phase === 'Hold' ? 'bg-blue-500/40' : 'bg-purple-500/20'
            }`}
          />
          
          {/* Main Breathing Circle */}
          <div 
            className={`w-32 h-32 rounded-full border-4 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-[4000ms] ease-in-out`}
            style={{ 
              transform: `scale(${scale})`,
              backgroundColor: phase === 'Inhale' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: phase === 'Hold' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255,255,255,0.1)'
            }}
          >
             <Wind size={40} className={`transition-colors duration-1000 ${
               phase === 'Inhale' ? 'text-emerald-300' : phase === 'Hold' ? 'text-blue-300' : 'text-slate-500'
             }`} />
          </div>

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="sr-only">{phase}</span>
          </div>
        </div>

        <h2 className="text-5xl font-black text-white uppercase tracking-widest mb-4 transition-all duration-500">
          {phase}
        </h2>
        <p className="text-slate-400 font-mono text-xl">{count > 0 ? count : ''}</p>
        
        <p className="mt-12 text-slate-500 text-sm max-w-xs text-center leading-relaxed opacity-60">
          Sync your breath with the light. Let the digital noise fade.
        </p>
      </div>
    </div>
  );
};

export default BreathingExercise;