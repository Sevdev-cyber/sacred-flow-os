
import React, { useState, useEffect } from 'react';
import { Lightbulb, X, Plus, Trash2, Calendar, Sparkles } from 'lucide-react';
import { Idea } from '../types';

interface NebulaOfIdeasProps {
    ideas: Idea[];
    onAddIdea: (text: string) => void;
    onHarvestIdea: (id: string) => void;
    onDissolveIdea: (id: string) => void;
    onClose: () => void;
}

const COLORS = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-rose-500 to-red-500',
    'from-indigo-500 to-violet-500',
];

const NebulaOfIdeas: React.FC<NebulaOfIdeasProps> = ({
    ideas,
    onAddIdea,
    onHarvestIdea,
    onDissolveIdea,
    onClose
}) => {
    const [newIdea, setNewIdea] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [orbPositions, setOrbPositions] = useState<{ [key: string]: { x: number, y: number, vx: number, vy: number } }>({});

    // Initialize random positions for orbs
    useEffect(() => {
        const newPositions: { [key: string]: { x: number, y: number, vx: number, vy: number } } = {};
        ideas.forEach(idea => {
            if (!orbPositions[idea.id]) {
                newPositions[idea.id] = {
                    x: 100 + Math.random() * 300,
                    y: 100 + Math.random() * 200,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5
                };
            } else {
                newPositions[idea.id] = orbPositions[idea.id];
            }
        });
        setOrbPositions(newPositions);
    }, [ideas.length]);

    // Animate orbs floating
    useEffect(() => {
        const interval = setInterval(() => {
            setOrbPositions(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(id => {
                    let { x, y, vx, vy } = next[id];
                    x += vx;
                    y += vy;

                    // Bounce off edges
                    if (x < 50 || x > 450) vx = -vx;
                    if (y < 50 || y > 300) vy = -vy;

                    next[id] = { x, y, vx, vy };
                });
                return next;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const handleAddIdea = () => {
        if (!newIdea.trim()) return;
        onAddIdea(newIdea);
        setNewIdea('');
        setShowInput(false);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md overflow-hidden">
            {/* Starfield background */}
            <div className="absolute inset-0">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

            <div className="relative w-full max-w-2xl h-[500px]">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 flex justify-between items-start z-20">
                    <div>
                        <h2 className="text-2xl font-black text-white flex items-center gap-2">
                            <Lightbulb className="text-purple-400" />
                            Nebula of Ideas
                        </h2>
                        <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                            {ideas.length} Ideas Floating • Drag to Harvest
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowInput(true)}
                            className="bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/40 text-purple-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                        >
                            <Plus size={16} />
                            Capture Idea
                        </button>
                        <button
                            onClick={onClose}
                            className="text-white/40 hover:text-white p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Floating Orbs Area */}
                <div className="absolute inset-0 mt-16">
                    {ideas.map((idea, index) => {
                        const pos = orbPositions[idea.id] || { x: 200, y: 150 };
                        const colorClass = COLORS[index % COLORS.length];

                        return (
                            <div
                                key={idea.id}
                                className="absolute group cursor-pointer"
                                style={{
                                    left: pos.x,
                                    top: pos.y,
                                    animation: `float ${3 + (index % 2)}s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`
                                }}
                            >
                                {/* Orb */}
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colorClass} shadow-lg flex items-center justify-center transition-transform group-hover:scale-125`}>
                                    <Lightbulb className="text-white" size={24} />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black/90 border border-white/10 p-3 rounded-xl w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    <p className="text-sm text-white mb-2">{idea.text}</p>
                                    <p className="text-[10px] text-white/40">
                                        {new Date(idea.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Action buttons on hover */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto z-50">
                                    <button
                                        onClick={() => onHarvestIdea(idea.id)}
                                        className="bg-emerald-500 hover:bg-emerald-400 text-white p-2 rounded-full transition-all"
                                        title="Harvest to Quest"
                                    >
                                        <Calendar size={14} />
                                    </button>
                                    <button
                                        onClick={() => onDissolveIdea(idea.id)}
                                        className="bg-red-500/50 hover:bg-red-500 text-white p-2 rounded-full transition-all"
                                        title="Dissolve (+Mana)"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Empty state */}
                    {ideas.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <Lightbulb className="text-purple-500/30 mx-auto mb-4" size={64} />
                                <p className="text-white/40 text-lg">Your nebula is empty</p>
                                <p className="text-white/20 text-sm">Capture ideas before they escape!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Modal */}
                {showInput && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
                        <div className="bg-[#0a0a15] border border-purple-500/40 p-6 rounded-3xl w-full max-w-md">
                            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                                <Sparkles className="text-purple-400" />
                                Quick Capture
                            </h3>

                            <textarea
                                value={newIdea}
                                onChange={(e) => setNewIdea(e.target.value)}
                                placeholder="What's on your mind? Capture it before it fades..."
                                className="w-full bg-black/50 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder:text-white/30 focus:border-purple-500 outline-none resize-none h-24 mb-4"
                                autoFocus
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={handleAddIdea}
                                    disabled={!newIdea.trim()}
                                    className="flex-1 bg-purple-500 hover:bg-purple-400 disabled:bg-slate-700 text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    Add to Nebula
                                </button>
                                <button
                                    onClick={() => { setShowInput(false); setNewIdea(''); }}
                                    className="px-4 bg-white/5 hover:bg-white/10 text-white/60 py-3 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NebulaOfIdeas;
