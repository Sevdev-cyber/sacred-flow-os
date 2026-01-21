
import React, { useState } from 'react';
import { InventoryItem, EquipmentSlot, Character } from '../types';
import { Package, ShieldCheck, Diamond, Zap, BookOpen, Sword, Shield, Briefcase, Plus, Hammer, Info, Loader2, Sparkles, X, Merge } from 'lucide-react';
import { RARITY_COLORS } from '../constants';

interface InventoryProps {
  items: InventoryItem[];
  character: Character;
  onEquip: (item: InventoryItem) => void;
  onRegisterRealWorld: (item: InventoryItem, name: string) => void;
  onFuse: (item1: InventoryItem, item2: InventoryItem) => void;
  lore?: string[];
}

const FUSION_COST = 50;

const Inventory: React.FC<InventoryProps> = ({ items, character, onEquip, onRegisterRealWorld, onFuse, lore = [] }) => {
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [realName, setRealName] = useState('');
  const [fusionMode, setFusionMode] = useState(false);
  const [selectedForFusion, setSelectedForFusion] = useState<string[]>([]);

  const slots = [
    { type: EquipmentSlot.WEAPON, label: 'Resonance Tool', icon: <Sword size={24}/>, desc: 'Instruments & Creative inputs' },
    { type: EquipmentSlot.ARMOR, label: 'Sanctum Gear', icon: <Shield size={24}/>, desc: 'Workspace & Environment' },
    { type: EquipmentSlot.RELIC, label: 'Divine Codex', icon: <Briefcase size={24}/>, desc: 'Software & Frameworks' },
  ];

  const toggleFusionSelection = (id: string) => {
    if (selectedForFusion.includes(id)) {
      setSelectedForFusion(prev => prev.filter(i => i !== id));
    } else {
      if (selectedForFusion.length < 2) {
        setSelectedForFusion(prev => [...prev, id]);
      }
    }
  };

  const handleFuseClick = () => {
    if (selectedForFusion.length !== 2) return;
    if (character.mana < FUSION_COST) return;
    
    const item1 = items.find(i => i.id === selectedForFusion[0]);
    const item2 = items.find(i => i.id === selectedForFusion[1]);
    if (item1 && item2) {
      onFuse(item1, item2);
      setFusionMode(false);
      setSelectedForFusion([]);
    }
  };

  const getStatsText = (item: InventoryItem) => {
    if (!item.stats) return null;
    return Object.entries(item.stats).map(([k, v]) => (
      <span key={k} className="text-emerald-400 font-bold">+{v}{k === 'quality' ? 'x' : k[0].toUpperCase()}</span>
    ));
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Character Sheet */}
      <section className="bg-[#0d1a0e] border border-emerald-900/30 rounded-[3rem] p-8 md:p-12 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-emerald-900 to-black border-4 border-emerald-500/20 flex items-center justify-center relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
               <Zap size={80} className="text-emerald-500 animate-pulse" />
            </div>
            {/* Slot Overlays */}
            <div className="absolute inset-0 z-20">
               {slots.map((s, i) => {
                 const angle = (i * 120) - 90;
                 const rad = angle * (Math.PI / 180);
                 const x = Math.cos(rad) * 110;
                 const y = Math.sin(rad) * 110;
                 const equipped = character.equipment[s.type];
                 return (
                   <div 
                    key={s.type} 
                    className={`absolute w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all overflow-hidden ${
                      equipped ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-black/60 border-white/5 text-white/20'
                    }`}
                    style={{ left: `calc(50% + ${x}px - 28px)`, top: `calc(50% + ${y}px - 28px)` }}
                    title={s.label}
                   >
                     {equipped ? (
                       equipped.imageUrl ? (
                         <img src={equipped.imageUrl} alt={equipped.name} className="w-full h-full object-cover" />
                       ) : (
                         <Package size={20} className="text-emerald-400" />
                       )
                     ) : s.icon}
                   </div>
                 );
               })}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Character Stats</h2>
              <p className="text-emerald-500/60 text-xs font-bold uppercase tracking-[0.3em]">Combined Essence Mapping</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <StatRow label="Focus" value={character.baseStats.focus} icon={<Zap size={14} />} color="text-blue-400" />
              <StatRow label="Efficiency" value={character.baseStats.efficiency} icon={<Shield size={14} />} color="text-red-400" />
              <StatRow label="Resonance" value={character.baseStats.resonance} icon={<Sword size={14} />} color="text-amber-400" />
              <StatRow label="Base Quality" value={`${character.baseStats.quality}x`} icon={<Diamond size={14} />} color="text-emerald-400" />
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                 <Hammer size={12}/> Active Gear
               </h4>
               {slots.map(s => (
                 <div key={s.type} className="flex justify-between items-center text-xs">
                    <span className="text-white/60 font-bold">{s.label}:</span>
                    <span className="text-emerald-400 font-black">
                      {character.equipment[s.type]?.name || 'Empty Socket'}
                    </span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Satchel Items */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-amber-500" /> The Satchel
          </h2>
          <div className="flex gap-3">
             {fusionMode && (
               <button 
                  disabled={selectedForFusion.length !== 2 || character.mana < FUSION_COST}
                  onClick={handleFuseClick}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:grayscale text-white px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2"
               >
                 <Zap size={14} /> {character.mana < FUSION_COST ? `Need ${FUSION_COST} Mana` : `Fuse (${FUSION_COST} Mana)`}
               </button>
             )}
             <button 
                onClick={() => {
                  setFusionMode(!fusionMode);
                  setSelectedForFusion([]);
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase border transition-all flex items-center gap-2 ${
                  fusionMode 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'bg-purple-500/10 border-purple-500 text-purple-400'
                }`}
             >
                {fusionMode ? <><X size={16}/> Cancel</> : <><Merge size={16}/> Fusion Chamber</>}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const isEquipped = (Object.values(character.equipment) as (InventoryItem | undefined)[]).some(e => e?.id === item.id);
            const isSelected = selectedForFusion.includes(item.id);
            
            return (
              <div 
                key={item.id} 
                onClick={() => fusionMode && !isEquipped && toggleFusionSelection(item.id)}
                className={`bg-[#0d1a0e] border p-6 rounded-[2rem] flex flex-col gap-4 transition-all group relative ${
                  isSelected ? 'border-purple-500 bg-purple-900/10 scale-95' :
                  isEquipped ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 
                  'border-emerald-900/20'
                } ${fusionMode && !isEquipped ? 'cursor-pointer hover:border-purple-500/50' : ''}`}
              >
                {fusionMode && !isEquipped && (
                   <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-white/20'}`}>
                      {isSelected && <Sparkles size={12} className="text-white" />}
                   </div>
                )}
                
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-emerald-900/20 transition-transform overflow-hidden relative ${isEquipped ? '' : 'group-hover:scale-105'}`}>
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.rarity === 'LEGENDARY' || item.rarity === 'RELIC' ? <Diamond size={28} className="text-amber-400" /> : <ShieldCheck size={28} className="text-slate-500" />
                    )}
                    {!item.imageUrl && item.id.length < 10 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                         <Loader2 size={16} className="text-emerald-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h4 className={`font-black text-sm uppercase tracking-tight ${RARITY_COLORS[item.rarity]}`}>{item.name}</h4>
                    <div className="flex gap-2 justify-end mt-1">
                      {getStatsText(item)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <p className="text-xs text-white/50 dyslexic-friendly leading-relaxed italic">"{item.description}"</p>
                   {item.realWorldCounterpart && (
                     <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <Info size={12} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase text-emerald-400">Linked: {item.realWorldCounterpart}</span>
                     </div>
                   )}
                </div>

                {!fusionMode && (
                  <div className="flex gap-2 pt-2 mt-auto">
                    {item.slot && !isEquipped && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onEquip(item); }}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                      >
                        Equip to {item.slot}
                      </button>
                    )}
                    {isEquipped && (
                      <div className="flex-1 bg-emerald-900/20 text-emerald-500/50 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest text-center border border-emerald-500/10">
                        EQUIPPED
                      </div>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setRegisteringId(item.id); }}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                      title="Map to Real World Item"
                    >
                      <Hammer size={16} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Register Modal */}
      {registeringId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm animate-in fade-in">
           <div className="bg-[#050a06] border border-white/10 p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl">
              <Hammer size={48} className="text-amber-500 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Sacred Mapping</h2>
              <p className="text-xs text-white/40 mb-8 dyslexic-friendly">Enter the name of your real-world upgrade (e.g., 'MacBook Pro M3', 'Sony WH-1000XM5') to bind its essence to this relic.</p>
              
              <input 
                autoFocus
                value={realName}
                onChange={(e) => setRealName(e.target.value)}
                placeholder="Physical Item Name..."
                className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl mb-6 text-white text-center focus:border-amber-500 outline-none"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => { setRegisteringId(null); setRealName(''); }}
                  className="flex-1 py-3 rounded-2xl font-bold text-xs uppercase text-white/40"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const item = items.find(i => i.id === registeringId);
                    if (item) onRegisterRealWorld(item, realName);
                    setRegisteringId(null);
                    setRealName('');
                  }}
                  className="flex-1 bg-amber-500 text-black py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                >
                  Bind Essence
                </button>
              </div>
           </div>
        </div>
      )}

      {lore.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="text-blue-500" /> Whispers of Lore
          </h2>
          <div className="grid gap-4">
            {lore.map((snippet, i) => (
              <div key={i} className="bg-blue-900/5 border border-blue-900/20 p-6 rounded-3xl italic text-blue-200/70 text-sm dyslexic-friendly">
                "{snippet}"
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const StatRow = ({ label, value, icon, color }: any) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
    <div className="flex items-center gap-2">
      <span className={color}>{icon}</span>
      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">{label}</span>
    </div>
    <span className={`text-sm font-black ${color}`}>{value}</span>
  </div>
);

export default Inventory;
