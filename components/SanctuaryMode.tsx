
import React, { useState, useEffect } from 'react';
import { Wind, Droplets, Eye, Move, CheckCircle2, ArrowRight, Leaf, Waves } from 'lucide-react';

interface SanctuaryModeProps {
  onExit: () => void;
}

const STEPS = [
  { 
    id: 'breathe', 
    label: 'Breathe', 
    text: 'Inhale for 4... Hold for 4... Exhale for 4.', 
    icon: Wind, 
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10'
  },
  { 
    id: 'water', 
    label: 'Hydrate', 
    text: 'Take a small sip of cool water. Feel it.', 
    icon: Droplets, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  { 
    id: 'sense', 
    label: 'Ground', 
    text: 'Find one object nearby with a texture you like.', 
    icon: Eye, 
    color: 'text-amber-400',
    bg: 'bg-amber-500/10'
  },
  { 
    id: 'move', 
    label: 'Release', 
    text: 'Stand up. Stretch your arms up. Shake your hands.', 
    icon: Move, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
];

const SanctuaryMode: React.FC<SanctuaryModeProps> = ({ onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Breathing animation logic for the first step
  useEffect(() => {
    if (currentStep !== 0) return;
    
    const cycle = () => {
      setBreathingPhase('Inhale');
      setTimeout(() => {
        setBreathingPhase('Hold');
        setTimeout(() => {
          setBreathingPhase('Exhale');
        }, 4000);
      }, 4000);
    };

    cycle();
    const interval = setInterval(cycle, 12000);
    return () => clearInterval(interval);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const currentStepData = STEPS[currentStep];

  if (completed) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#050a06] flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
          <Leaf size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 text-center">The Storm Has Passed</h2>
        <p className="text-slate-400 text-center max-w-md mb-12 text-lg">
          Your mind is clearer now. The Grove awaits your return, gentle seeker.
        </p>
        <button 
          onClick={onExit}
          className="group relative bg-emerald-900/20 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        >
          <span className="flex items-center gap-3">
            Return to Grove <ArrowRight size={20} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#020402] flex flex-col items-center justify-center p-8 transition-colors duration-1000">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d1a0e]/20 to-transparent pointer-events-none" />
      
      {/* Progress Dots */}
      <div className="flex gap-3 mb-16 relative z-10">
        {STEPS.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-3 h-3 rounded-full transition-all duration-500 ${
              idx === currentStep ? 'bg-white scale-125 shadow-[0_0_10px_white]' : idx < currentStep ? 'bg-emerald-500' : 'bg-white/10'
            }`} 
          />
        ))}
      </div>

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full text-center space-y-8 animate-in slide-in-from-bottom-8 fade-in duration-700">
        
        {/* Step Icon */}
        <div className={`mx-auto w-32 h-32 rounded-full ${currentStepData.bg} border-2 border-white/5 flex items-center justify-center relative`}>
           {currentStep === 0 && (
             <div className={`absolute inset-0 rounded-full border-4 border-emerald-500/30 transition-all duration-[4000ms] ${
                breathingPhase === 'Inhale' ? 'scale-110 opacity-100' : breathingPhase === 'Hold' ? 'scale-110 opacity-50' : 'scale-90 opacity-30'
             }`} />
           )}
           <currentStepData.icon size={48} className={currentStepData.color} />
        </div>

        <div>
          <h2 className={`text-4xl font-black uppercase tracking-widest mb-4 ${currentStepData.color}`}>
            {currentStepData.label}
          </h2>
          <p className="text-2xl text-slate-300 font-light leading-relaxed">
             {currentStep === 0 ? (
               <span className="transition-opacity duration-500 font-mono uppercase tracking-widest text-sm text-emerald-300 block mb-2">{breathingPhase}</span>
             ) : null}
             {currentStepData.text}
          </p>
        </div>

        <button 
          onClick={handleNext}
          className="mt-12 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-6 rounded-3xl font-bold text-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          I have done this <CheckCircle2 size={24} className="text-emerald-400" />
        </button>
      </div>
    </div>
  );
};

export default SanctuaryMode;
