
import React, { useState } from 'react';
import { Flame, X, Plus, Trash2, Sparkles } from 'lucide-react';
import { Worry } from '../types';

interface TransmutationFireProps {
    worryLog: Worry[];
    onBurnWorry: (text: string) => void;
    onClose: () => void;
}

const TransmutationFire: React.FC<TransmutationFireProps> = ({ worryLog, onBurnWorry, onClose }) => {
    const [worryText, setWorryText] = useState('');
    const [burning, setBurning] = useState(false);
    const [burningStone, setBurningStone] = useState<string | null>(null);

    const handleBurn = () => {
        if (!worryText.trim()) return;

        setBurningStone(worryText);
        setBurning(true);

        setTimeout(() => {
            onBurnWorry(worryText);
            setWorryText('');
            setBurning(false);
            setBurningStone(null);
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-[#0a0505] border-2 border-orange-500/40 p-8 rounded-[3rem] max-w-lg w-full relative overflow-hidden">
                {/* Fire glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-orange-500/20 via-red-500/10 to-transparent" />

                {/* Animated flames */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-1">
                    {[...Array(7)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-16 bg-gradient-to-t from-orange-500 via-red-500 to-yellow-500 rounded-full opacity-80"
                            style={{
                                animation: `flicker ${0.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                                animationDelay: `${i * 0.1}s`,
                                transform: `scaleY(${0.8 + Math.random() * 0.4})`
                            }}
                        />
                    ))}
                </div>

                <style>{`
          @keyframes flicker {
            0% { transform: scaleY(0.8) scaleX(1); opacity: 0.7; }
            100% { transform: scaleY(1.2) scaleX(0.9); opacity: 1; }
          }
          @keyframes burn {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            50% { transform: translateY(-20px) scale(0.8); opacity: 0.5; }
            100% { transform: translateY(-50px) scale(0.3); opacity: 0; }
          }
        `}</style>

                <div className="relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-white/40 hover:text-white p-2"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4">
                            <Flame className="text-orange-400" size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">Transmutation Fire</h2>
                        <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">
                            Release What No Longer Serves You
                        </p>
                    </div>

                    {/* Input */}
                    <div className="mb-8">
                        <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                            What weighs on your mind?
                        </label>
                        <textarea
                            value={worryText}
                            onChange={(e) => setWorryText(e.target.value)}
                            placeholder="Write your worry, fear, or anxious thought..."
                            className="w-full bg-black/50 border border-orange-500/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:border-orange-500 outline-none resize-none h-24"
                            disabled={burning}
                        />
                    </div>

                    {/* Burning Stone Animation */}
                    {burningStone && (
                        <div
                            className="absolute left-1/2 bottom-32 -translate-x-1/2"
                            style={{ animation: 'burn 2s ease-out forwards' }}
                        >
                            <div className="bg-slate-800 border border-slate-600 px-4 py-2 rounded-xl max-w-xs">
                                <p className="text-sm text-slate-400 truncate">{burningStone}</p>
                            </div>
                        </div>
                    )}

                    {/* Burn Button */}
                    <button
                        onClick={handleBurn}
                        disabled={!worryText.trim() || burning}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 mb-6"
                    >
                        {burning ? (
                            <>
                                <Flame className="animate-pulse" size={20} />
                                Transmuting...
                            </>
                        ) : (
                            <>
                                <Flame size={20} />
                                Cast into the Fire
                            </>
                        )}
                    </button>

                    {/* Reward info */}
                    <div className="bg-purple-900/20 border border-purple-500/30 p-3 rounded-xl flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={16} />
                        <p className="text-xs text-purple-400">
                            Each transmutation grants <span className="font-bold">+5 Resilience XP</span>
                        </p>
                    </div>

                    {/* Recent Burns */}
                    {worryLog.length > 0 && (
                        <div className="mt-6">
                            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
                                Recently Transmuted ({worryLog.length})
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {worryLog.slice(-5).map((w) => (
                                    <span
                                        key={w.id}
                                        className="text-xs bg-slate-800/50 text-slate-500 px-2 py-1 rounded line-through"
                                    >
                                        {w.text.slice(0, 20)}...
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransmutationFire;
