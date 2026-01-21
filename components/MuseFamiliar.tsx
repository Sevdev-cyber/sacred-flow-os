
import React, { useState } from 'react';
import { Sparkles, Gift, Moon, Sun } from 'lucide-react';
import { getMuseGift } from '../services/geminiService';

interface MuseFamiliarProps {
  energy: number;
}

const MuseFamiliar: React.FC<MuseFamiliarProps> = ({ energy }) => {
  const [gift, setGift] = useState<{ type: string, content: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Determine State
  const isHibernating = energy < 30;
  const isGlowing = energy > 80;

  const handleInteraction = async () => {
    if (isHibernating || loading) return;
    setLoading(true);
    const result = await getMuseGift(energy);
    setGift(result);
    setLoading(false);
  };

  return (
    <div className="relative group">
       {/* Fox Container */}
       <div 
         onClick={handleInteraction}
         className={`relative w-24 h-24 flex items-center justify-center transition-all duration-1000 ${
           isHibernating ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105'
         }`}
       >
          {/* Aura */}
          {!isHibernating && (
            <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${
              isGlowing ? 'bg-amber-400/30 scale-125' : 'bg-blue-400/10'
            }`} />
          )}

          {/* Simple CSS Fox Representation */}
          <div className="relative z-10">
             {isHibernating ? (
               <div className="text-4xl filter grayscale contrast-50">🗿</div> 
             ) : (
               <div className={`text-5xl transition-all ${loading ? 'animate-bounce' : ''}`}>
                 🦊
               </div>
             )}
          </div>

          {/* Status Indicator */}
          <div className="absolute -bottom-2 -right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 flex items-center gap-1">
             {isHibernating ? <Moon size={10} className="text-slate-400"/> : <Sun size={10} className={isGlowing ? "text-amber-400" : "text-blue-400"} />}
          </div>
       </div>

       {/* Gift Bubble */}
       {gift && (
         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-[#0d1a0e] border border-amber-500/30 p-4 rounded-2xl shadow-2xl animate-in zoom-in-95 z-50">
            <button onClick={(e) => { e.stopPropagation(); setGift(null); }} className="absolute top-2 right-2 text-white/20 hover:text-white"><Sparkles size={12}/></button>
            <div className="flex items-center gap-2 mb-2">
               <Gift size={14} className="text-amber-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{gift.type}</span>
            </div>
            <p className="text-sm text-slate-300 italic leading-relaxed">"{gift.content}"</p>
         </div>
       )}

       {/* Tooltip */}
       {!gift && (
         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 rounded-lg text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {isHibernating ? "The Muse is sleeping (Low Vitality)" : "Click for a gift from the deep woods"}
         </div>
       )}
    </div>
  );
};

export default MuseFamiliar;
