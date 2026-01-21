
import React from 'react';
import { Trophy, Sparkles, X, Star, Crown } from 'lucide-react';
import { CompletedBossTask } from '../types';

interface HallOfEchoesProps {
    completedTasks: CompletedBossTask[];
    onClose: () => void;
}

const HallOfEchoes: React.FC<HallOfEchoesProps> = ({ completedTasks, onClose }) => {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md overflow-auto">
            <div className="bg-gradient-to-b from-[#0a0a15] to-[#050510] border border-amber-500/20 p-8 rounded-[3rem] max-w-4xl w-full relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-amber-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-0 text-white/40 hover:text-white p-2"
                    >
                        <X size={24} />
                    </button>

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-amber-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                            <Trophy className="text-amber-400" size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2">Hall of Echoes</h2>
                        <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em]">
                            Gallery of Your Greatest Victories
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    {completedTasks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {completedTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="group relative bg-black/50 border border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all hover:scale-105"
                                >
                                    {/* Card Art Background */}
                                    <div className="h-40 bg-gradient-to-br from-amber-900/30 to-purple-900/30 relative overflow-hidden">
                                        {task.artUrl ? (
                                            <img
                                                src={task.artUrl}
                                                alt={task.title}
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Crown className="text-amber-500/30" size={64} />
                                            </div>
                                        )}

                                        {/* Rank badge */}
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                                            <Star className="text-amber-400" size={12} fill="currentColor" />
                                            <span className="text-[10px] font-black text-amber-400">#{index + 1}</span>
                                        </div>

                                        {/* Shimmer effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-white text-sm mb-1 truncate">{task.title}</h3>
                                        <p className="text-[10px] text-white/40">
                                            Conquered on {new Date(task.completedAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    {/* Glow effect on hover */}
                                    <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(245,158,11,0.1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy className="text-slate-600" size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-white/60 mb-2">Your Hall Awaits</h3>
                            <p className="text-white/30 max-w-md mx-auto">
                                Complete Boss Quests to fill this gallery with your victories.
                                Each conquest becomes a permanent testament to your power.
                            </p>
                        </div>
                    )}

                    {/* Footer stats */}
                    {completedTasks.length > 0 && (
                        <div className="mt-10 pt-6 border-t border-white/5 flex justify-center gap-8">
                            <div className="text-center">
                                <span className="text-3xl font-black text-amber-400">{completedTasks.length}</span>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Victories</p>
                            </div>
                            <div className="text-center">
                                <span className="text-3xl font-black text-purple-400">
                                    {Math.floor(completedTasks.length / 5)}
                                </span>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">Legendary Streaks</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HallOfEchoes;
