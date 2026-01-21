
import React, { useState } from 'react';
import { Compass, Sparkles, Check, X, Shuffle } from 'lucide-react';
import { Task, QuestType } from '../types';

interface OracleCompassProps {
    tasks: Task[];
    onAccept: (taskId: string) => void;
    onClose: () => void;
}

const OracleCompass: React.FC<OracleCompassProps> = ({ tasks, onAccept, onClose }) => {
    const [spinning, setSpinning] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [rotation, setRotation] = useState(0);

    const mainTasks = tasks.filter(t => !t.isCompleted && (t.type === QuestType.MAIN || t.type === QuestType.BOSS));

    const spinCompass = () => {
        if (mainTasks.length === 0) return;

        setSpinning(true);
        setSelectedTask(null);

        // Random rotation (3-5 full spins + random end position)
        const spins = 3 + Math.random() * 2;
        const endAngle = Math.random() * 360;
        const totalRotation = rotation + (spins * 360) + endAngle;
        setRotation(totalRotation);

        // Select random task after spin completes
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * mainTasks.length);
            setSelectedTask(mainTasks[randomIndex]);
            setSpinning(false);
        }, 2500);
    };

    const handleAccept = () => {
        if (selectedTask) {
            onAccept(selectedTask.id);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <div className="bg-[#050a06] border-2 border-purple-500/40 p-8 rounded-[3rem] max-w-md w-full relative overflow-hidden">
                {/* Mystical glow */}
                <div className="absolute inset-0 bg-purple-500/5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-white/40 hover:text-white p-2"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-white mb-2">Oracle Compass</h2>
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                            Let Fate Decide Your Path
                        </p>
                    </div>

                    {/* Compass */}
                    <div className="relative w-48 h-48 mx-auto mb-8">
                        {/* Outer ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30 bg-black/50" />

                        {/* Cardinal markers */}
                        {['N', 'E', 'S', 'W'].map((dir, i) => (
                            <div
                                key={dir}
                                className="absolute text-purple-400/60 font-black text-sm"
                                style={{
                                    top: i === 0 ? '8px' : i === 2 ? 'auto' : '50%',
                                    bottom: i === 2 ? '8px' : 'auto',
                                    left: i === 3 ? '8px' : i === 1 ? 'auto' : '50%',
                                    right: i === 1 ? '8px' : 'auto',
                                    transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)'
                                }}
                            >
                                {dir}
                            </div>
                        ))}

                        {/* Spinning needle */}
                        <div
                            className="absolute top-1/2 left-1/2 w-2 h-20 origin-bottom transition-transform duration-[2500ms] ease-out"
                            style={{
                                transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
                            }}
                        >
                            <div className="w-full h-full bg-gradient-to-t from-purple-500 to-purple-300 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)]" />
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-purple-300" />
                        </div>

                        {/* Center orb */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.6)]" />
                    </div>

                    {/* Result or Spin Button */}
                    {selectedTask ? (
                        <div className="space-y-4">
                            <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-2xl">
                                <p className="text-xs text-purple-400 uppercase tracking-widest mb-2">The Oracle Has Spoken</p>
                                <h3 className="text-lg font-bold text-white">{selectedTask.title}</h3>
                            </div>

                            <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-xl flex items-center gap-2">
                                <Sparkles className="text-amber-500" size={16} />
                                <p className="text-xs text-amber-400">
                                    <span className="font-bold">Trust Buff Active:</span> +10% XP if accepted now!
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-purple-500 hover:bg-purple-400 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <Check size={20} />
                                    Accept Quest
                                </button>
                                <button
                                    onClick={spinCompass}
                                    className="px-6 bg-white/5 hover:bg-white/10 text-white/60 py-4 rounded-2xl transition-all"
                                >
                                    <Shuffle size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={spinCompass}
                            disabled={spinning || mainTasks.length === 0}
                            className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-slate-700 disabled:text-slate-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2"
                        >
                            {spinning ? (
                                <>
                                    <Compass className="animate-spin" size={20} />
                                    Consulting the Oracle...
                                </>
                            ) : mainTasks.length === 0 ? (
                                'No Main Quests Available'
                            ) : (
                                <>
                                    <Compass size={20} />
                                    Spin the Compass
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OracleCompass;
