
import React from 'react';
import { Home, List, Network, Package, Settings, Sparkles, Swords, Leaf } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isBattleMode?: boolean;
  isSanctuaryMode?: boolean;
  hasNewItems?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isBattleMode, isSanctuaryMode, hasNewItems }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Grove' },
    { id: 'quests', icon: List, label: 'Quests' },
    { id: 'skills', icon: Network, label: 'Spirit' },
    { id: 'inventory', icon: Package, label: 'Items' },
    { id: 'spec', icon: Sparkles, label: 'Lore' },
  ];

  // If in Sanctuary Mode, render children full screen without navigation
  if (isSanctuaryMode) {
    return (
      <div className="min-h-screen bg-[#020402] text-slate-100">
        <main className="h-screen w-full">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-1000 pb-24 md:pb-0 md:pl-20 ${isBattleMode ? 'bg-[#0a0000] text-red-50' : 'bg-[#050a06] text-slate-100'}`}>
      {/* Sidebar for Desktop */}
      <nav className={`fixed left-0 top-0 h-full w-20 transition-all duration-1000 border-r hidden md:flex flex-col items-center py-8 z-50 ${isBattleMode ? 'bg-black border-red-950/50 shadow-[5px_0_30px_rgba(239,68,68,0.1)]' : 'bg-[#0d1a0e] border-emerald-900/30'}`}>
        <div className="mb-12">
          <div className={`w-12 h-12 transition-all duration-700 rounded-full flex items-center justify-center border ${isBattleMode ? 'bg-red-500/20 border-red-500/40 animate-pulse' : 'bg-emerald-500/20 border-emerald-500/40'}`}>
            {isBattleMode ? <Swords className="text-red-400" /> : <Leaf className="text-emerald-400" />}
          </div>
        </div>
        {!isBattleMode && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-3 rounded-xl transition-all relative ${
                  activeTab === tab.id 
                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'text-slate-500 hover:text-emerald-300'
                }`}
                title={tab.label}
              >
                <tab.icon size={24} />
                {tab.id === 'inventory' && hasNewItems && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0d1a0e] animate-pulse" />
                )}
              </button>
            ))}
          </div>
        )}
        {isBattleMode && (
          <div className="flex flex-col gap-8 animate-in zoom-in-95 duration-1000">
            <button
              onClick={() => setActiveTab('quests')}
              className={`p-3 rounded-xl transition-all ${activeTab === 'quests' ? 'bg-red-500/20 text-red-400' : 'text-red-900'}`}
              title="Quests Only"
            >
              <List size={24} />
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Nav for Mobile - Hide in Battle Mode for ADHD focus */}
      {!isBattleMode && (
        <nav className="fixed bottom-0 left-0 w-full bg-[#0d1a0e]/95 backdrop-blur-md border-t border-emerald-900/30 flex md:hidden justify-around py-4 z-50 animate-in slide-in-from-bottom-full duration-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 relative ${
                activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <tab.icon size={24} />
                {tab.id === 'inventory' && hasNewItems && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-[#0d1a0e] animate-pulse" />
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full transition-all duration-700">
        {children}
      </main>
    </div>
  );
};

export default Layout;
