
import React from 'react';
import { Book, BrainCircuit, Activity } from 'lucide-react';

const LoreSection: React.FC = () => {
  return (
    <div className="space-y-12 pb-12 dyslexic-friendly">
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-emerald-400 flex items-center gap-3">
          <Book className="text-emerald-500" /> Feature Specification
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0d1a0e] p-6 rounded-2xl border border-emerald-900/20">
            <h3 className="font-bold text-lg mb-3 text-white">The Arbiter System</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every quest entered is evaluated by a "Spirit AI" (Gemini). It prevents the user from manually adjusting difficulty to "cheat" the system, while also ensuring rewards feel cosmically balanced.
            </p>
          </div>
          <div className="bg-[#0d1a0e] p-6 rounded-2xl border border-emerald-900/20">
            <h3 className="font-bold text-lg mb-3 text-white">The Economy of Focus</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Mana is generated through output (Tasks). It can only be spent on Skill Tree nodes that improve productivity. Energy is a buffer for rest; it is earned by finishing Bosses, representing the relief of closure.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-black text-blue-400 flex items-center gap-3">
          <BrainCircuit className="text-blue-500" /> Vibration Algorithm Flow
        </h2>
        <div className="bg-black/40 border border-blue-900/30 p-8 rounded-3xl font-mono text-sm overflow-x-auto">
          <div className="space-y-4 min-w-[500px]">
            <div className="flex items-center gap-4">
              <span className="bg-blue-500 text-black px-2 py-1 rounded font-bold">START</span>
              <span className="text-blue-300">New Task Input Captured</span>
            </div>
            <div className="pl-8 border-l-2 border-blue-900 space-y-4">
              <p className="text-slate-500">1. AI evaluates context vs. existing difficulty benchmarks.</p>
              <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                <code>
                  Base_XP = (Difficulty * 10) + (Urgency * 5)
                </code>
              </div>
              <p className="text-slate-500">2. Apply Quest Type Multipliers:</p>
              <ul className="list-disc pl-6 text-blue-200">
                <li>Main Quest: 2.5x (Major progress)</li>
                <li>Boss Fight: 5.0x (Breakthrough projects)</li>
                <li>Side Quest: 0.8x (Routine maintenance)</li>
              </ul>
              <p className="text-slate-500">3. Currency Splits:</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-900/20 p-3 rounded">Mana = Diff * 5 (Work Focus)</div>
                <div className="bg-red-900/20 p-3 rounded">Energy = (Urg * 3) (Stress Recovery)</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-blue-500 text-black px-2 py-1 rounded font-bold">END</span>
              <span className="text-blue-300">Rewards Distributed to Vault</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-emerald-950 to-black p-8 rounded-[2rem] border border-emerald-500/10">
        <h3 className="text-2xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
          <Activity size={24} /> Neurodivergent Support (ADHD/Dyslexia)
        </h3>
        <ul className="space-y-4 text-slate-300 text-sm">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-emerald-500/20 rounded text-emerald-400 flex items-center justify-center shrink-0">1</span>
            <span><strong>High Contrast Icons:</strong> Minimizes cognitive load of reading headers for ADHD users.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-emerald-500/20 rounded text-emerald-400 flex items-center justify-center shrink-0">2</span>
            <span><strong>OpenDyslexic Support:</strong> Wide kerning and bottom-heavy letters prevent word-swapping.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-emerald-500/20 rounded text-emerald-400 flex items-center justify-center shrink-0">3</span>
            <span><strong>Immediate Gratification:</strong> Completing a quest triggers a haptic/visual "Level Up" cycle to satisfy dopamine needs.</span>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default LoreSection;
