
import React, { useState, useEffect } from 'react';
import { Droplet, Zap, Clock, Sparkles, X } from 'lucide-react';

interface PotionOfMomentumProps {
    lastPotionUse: string | null;
    microQuestActive: boolean;
    microQuestTask: string | null;
    microQuestEndTime: number | null;
    onActivate: (task: string) => void;
    onComplete: () => void;
    onCancel: () => void;
}

const PotionOfMomentum: React.FC<PotionOfMomentumProps> = ({
    lastPotionUse,
    microQuestActive,
    microQuestTask,
    microQuestEndTime,
    onActivate,
    onComplete,
    onCancel
}) => {
    const [showModal, setShowModal] = useState(false);
    const [microStep, setMicroStep] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [splashAnimation, setSplashAnimation] = useState(false);

    // Check if potion is available (24h cooldown)
    const isPotionAvailable = () => {
        if (!lastPotionUse) return true;
        const lastUse = new Date(lastPotionUse).getTime();
        const now = Date.now();
        const hoursSince = (now - lastUse) / (1000 * 60 * 60);
        return hoursSince >= 24;
    };

    // Timer effect
    useEffect(() => {
        if (!microQuestActive || !microQuestEndTime) return;

        const interval = setInterval(() => {
            const remaining = Math.max(0, microQuestEndTime - Date.now());
            setTimeLeft(Math.floor(remaining / 1000));

            if (remaining <= 0) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [microQuestActive, microQuestEndTime]);

    const handleActivate = () => {
        if (!microStep.trim()) return;
        setSplashAnimation(true);
        setTimeout(() => {
            setSplashAnimation(false);
            setShowModal(false);
            onActivate(microStep);
            setMicroStep('');
        }, 600);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const available = isPotionAvailable();

    // Active micro-quest view
    if (microQuestActive && microQuestTask) {
        return (
            <div className="bg-blue-900/20 border-2 border-blue-500/50 p-6 rounded-3xl relative overflow-hidden">
                {/* Pulsing background */}
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />

                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-400 animate-pulse" size={24} />
                            <span className="text-xs font-black uppercase tracking-widest text-blue-400">
                                Micro-Quest Active
                            </span>
                        </div>
                        <div className="bg-blue-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                            <Clock size={16} className="text-blue-300" />
                            <span className="font-black text-xl text-white">{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    <p className="text-lg font-bold text-white mb-4">"{microQuestTask}"</p>

                    <div className="flex gap-3">
                        <button
                            onClick={onComplete}
                            className="flex-1 bg-blue-500 hover:bg-blue-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Sparkles size={20} />
                            Complete (3x XP!)
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-6 bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Potion Button */}
            <button
                onClick={() => available && setShowModal(true)}
                disabled={!available}
                className={`relative group p-4 rounded-2xl border transition-all ${available
                        ? 'bg-blue-900/20 border-blue-500/40 hover:bg-blue-900/40 hover:border-blue-500 cursor-pointer'
                        : 'bg-slate-900/20 border-slate-700/30 opacity-50 cursor-not-allowed'
                    }`}
            >
                <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${available ? 'bg-blue-500/20' : 'bg-slate-700/20'}`}>
                        <Droplet
                            className={`${available ? 'text-blue-400 animate-pulse' : 'text-slate-600'}`}
                            size={24}
                        />
                    </div>
                    <div className="text-left">
                        <h4 className="font-black text-xs uppercase tracking-widest text-white">
                            Potion of Momentum
                        </h4>
                        <p className="text-[10px] text-white/40">
                            {available ? 'Break paralysis. One use per day.' : 'Recharging...'}
                        </p>
                    </div>
                </div>

                {/* Glow effect */}
                {available && (
                    <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                )}
            </button>

            {/* Activation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                    {/* Splash Animation */}
                    {splashAnimation && (
                        <div className="absolute inset-0 bg-blue-500/30 animate-ping" />
                    )}

                    <div className="bg-[#050a06] border-2 border-blue-500/50 p-8 rounded-[3rem] max-w-md w-full relative overflow-hidden">
                        {/* Liquid effect */}
                        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent animate-pulse" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center">
                                    <Droplet className="text-blue-400" size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">Potion of Momentum</h2>
                                    <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">
                                        Emergency Activation
                                    </p>
                                </div>
                            </div>

                            <p className="text-white/60 mb-6 text-sm">
                                What is the <span className="text-blue-400 font-bold">SMALLEST</span> possible step
                                you can take right now? Something so tiny it feels almost silly.
                            </p>

                            <input
                                type="text"
                                value={microStep}
                                onChange={(e) => setMicroStep(e.target.value)}
                                placeholder="e.g., 'Open my laptop'"
                                className="w-full bg-black/50 border border-blue-500/30 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 focus:border-blue-500 outline-none mb-6"
                                autoFocus
                            />

                            <div className="flex gap-3">
                                <button
                                    onClick={handleActivate}
                                    disabled={!microStep.trim()}
                                    className="flex-1 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:text-slate-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all"
                                >
                                    Start 5-Minute Quest
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-6 bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PotionOfMomentum;
