
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import QuestLog from './components/QuestLog';
import SkillTree from './components/SkillTree';
import Inventory from './components/Inventory';
import LoreSection from './components/LoreSection';
import SanctuaryMode from './components/SanctuaryMode';
import CharacterCreation from './components/CharacterCreation';
import BreathingExercise from './components/BreathingExercise';
// Phase 1: New Feature Components
import PotionOfMomentum from './components/PotionOfMomentum';
import OracleCompass from './components/OracleCompass';
import TransmutationFire from './components/TransmutationFire';
import NebulaOfIdeas from './components/NebulaOfIdeas';
import HallOfEchoes from './components/HallOfEchoes';
import { Character, Task, SkillNode, InventoryItem, QuestType, EquipmentSlot, UISettings, Archetype, Idea, Worry, CompletedBossTask } from './types';
import { INITIAL_CHARACTER, INITIAL_SKILLS, ARCHETYPE_STATS, COLORS } from './constants';
import { getXpToNextLevel, calculateRewards } from './utils/vibrationLogic';
import { getGuidance, bindRealWorldItemWithAI, generateItemImage, generateLootForTask, fuseItemsWithAI } from './services/geminiService';
import { BarChart3, Waves, Book, Activity, Sparkles, X, TrendingUp, Target, Brain, Globe, Users, Trophy, Settings, Merge, Compass, Flame, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [char, setChar] = useState<Character>(INITIAL_CHARACTER);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILLS);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'rel1',
      name: 'Crystal Harp',
      rarity: 'LEGENDARY',
      description: 'Enhances creative focus. +25% Mana gain.',
      icon: 'Music',
      slot: EquipmentSlot.WEAPON,
      stats: { focus: 25, resonance: 10 }
    },
    {
      id: 'rel2',
      name: 'Alchemist M1',
      rarity: 'RELIC',
      description: 'The core processor of your reality. +20% Efficiency.',
      icon: 'Zap',
      slot: EquipmentSlot.RELIC,
      stats: { efficiency: 20, resonance: 15 }
    },
    {
      id: 'def_armor',
      name: 'Zen Sanctuary',
      rarity: 'RARE',
      description: 'A workspace tuned for silence. +15% Efficiency.',
      icon: 'Shield',
      slot: EquipmentSlot.ARMOR,
      stats: { efficiency: 15 }
    }
  ]);
  const [guidance, setGuidance] = useState('Welcome to the Grove, seeker.');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showLedger, setShowLedger] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false); // New state
  const [latestLoot, setLatestLoot] = useState<any>(null);
  const [hasNewItems, setHasNewItems] = useState(false);
  const [fusing, setFusing] = useState(false);
  // Phase 1: Feature modal states
  const [showOracleCompass, setShowOracleCompass] = useState(false);
  const [showTransmutationFire, setShowTransmutationFire] = useState(false);
  const [showNebulaOfIdeas, setShowNebulaOfIdeas] = useState(false);
  const [showHallOfEchoes, setShowHallOfEchoes] = useState(false);
  const [trustBuffTaskId, setTrustBuffTaskId] = useState<string | null>(null);

  // Keystone Unlocked Features
  // Updated to use featureId check
  const isCommandCenterUnlocked = skills.some(s => s.unlocked && s.featureId === 'command_center'); // Note: Added to types but not init stats yet, keeping basic logic
  const isTransmutationUnlocked = skills.some(s => s.unlocked && s.id === 'a_key'); // Keeping old ID check for safety until full migration
  const isLedgerUnlocked = skills.some(s => s.unlocked && s.id === 'b_key');

  // Background Color Shift for Twilight Mode
  useEffect(() => {
    document.body.style.backgroundColor = char.settings.twilightMode ? COLORS.twilightBg : COLORS.bg;
  }, [char.settings.twilightMode]);

  // Initialize Item Visuals
  useEffect(() => {
    const generateInitialVisuals = async () => {
      // Filter for initial items that lack images
      const itemsNeedingImages = inventory.filter(i => !i.imageUrl && !i.realWorldCounterpart);

      for (const item of itemsNeedingImages) {
        // Generate image for each item
        generateItemImage(item.name, item.description).then(url => {
          if (url) {
            setInventory(prev => prev.map(i => i.id === item.id ? { ...i, imageUrl: url } : i));
          }
        });
      }
    };

    // Only trigger if we have un-imaged items to avoid unnecessary API calls on re-renders
    if (inventory.some(i => !i.imageUrl)) {
      generateInitialVisuals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkStreak = () => {
      const lastDateStr = char.lastActiveDate;
      const today = new Date().toISOString().split('T')[0];
      if (!lastDateStr) { setChar(prev => ({ ...prev, lastActiveDate: today })); return; }
      if (lastDateStr === today) return;

      // If Twilight Mode is active, streak is FROZEN (no penalty)
      if (char.settings.twilightMode) {
        setChar(prev => ({ ...prev, lastActiveDate: today }));
        return;
      }

      const lastDate = new Date(lastDateStr);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        const missedDays = diffDays - 1;
        setChar(prev => {
          let newBuffer = prev.forgivenessBuffer - missedDays;
          let newStreak = prev.streak;
          if (newBuffer < 0) { newStreak = 0; newBuffer = INITIAL_CHARACTER.forgivenessBuffer; }
          return { ...prev, streak: newStreak, forgivenessBuffer: Math.max(0, newBuffer), lastActiveDate: today };
        });
      } else { setChar(prev => ({ ...prev, lastActiveDate: today })); }
    };
    checkStreak();
  }, [char.lastActiveDate, char.settings.twilightMode]);

  useEffect(() => {
    const fetchGuidance = async () => {
      const status = `Level ${char.level}, ${tasks.filter(t => !t.isCompleted).length} quests active. Streak: ${char.streak}. Vibration: ${char.vibration}. Stats: F${char.baseStats.focus} E${char.baseStats.efficiency}`;
      const msg = await getGuidance(status);
      setGuidance(msg);
    };
    fetchGuidance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [char.level, tasks.length]);

  const addTask = (task: Task) => {
    setTasks(prev => [task, ...prev]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const failTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          type: QuestType.SHADOW,
          title: `Shadow: ${t.title}`,
          rewards: calculateRewards(t.difficulty, t.urgency, QuestType.SHADOW, t.category, skills.filter(s => s.unlocked), char)
        };
      }
      return t;
    }));
    setGuidance("A quest has slipped into the shadows. Perform the Recovery Ritual to clear the air.");
  };

  const completeTask = async (taskId: string, inFlow: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const unlocked = skills.filter(s => s.unlocked);
    const finalRewards = calculateRewards(task.difficulty, task.urgency, task.type, task.category, unlocked, char, inFlow);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true, rewards: finalRewards } : t));

    // Dynamic Loot Logic
    if (task.type === QuestType.BOSS || task.type === QuestType.MAIN) {
      if (!task.loot) {
        setGuidance("The cosmos is weaving a reward for your triumph...");
        generateLootForTask(task.title, task.category, task.difficulty).then(newLoot => {
          if (newLoot) {
            const guessedSlot = Object.values(EquipmentSlot).find(s => newLoot.slot === s) || EquipmentSlot.ACCESSORY;
            const newItem: InventoryItem = {
              id: Math.random().toString(36).substr(2, 9),
              name: newLoot.name,
              rarity: newLoot.rarity,
              description: newLoot.description,
              icon: 'Sparkles',
              slot: guessedSlot,
              stats: newLoot.stats
            };
            setInventory(prev => [...prev, newItem]);
            setHasNewItems(true);
            setLatestLoot({ ...newLoot, type: 'ITEM' }); // Trigger modal
            generateItemImage(newItem.name, newItem.description).then(url => {
              if (url) {
                setInventory(prev => prev.map(i => i.id === newItem.id ? { ...i, imageUrl: url } : i));
              }
            });
          }
        });
      } else if (task.loot) {
        if (task.loot.type === 'ITEM') {
          const guessedSlot = Object.values(EquipmentSlot).find(s => task.loot!.name.includes(s)) || EquipmentSlot.ACCESSORY;
          const newItem: InventoryItem = {
            id: Math.random().toString(36).substr(2, 9),
            name: task.loot!.name,
            rarity: 'RARE',
            description: task.loot!.description,
            icon: 'Sparkles',
            slot: guessedSlot,
            stats: { resonance: 5, quality: 1.05 }
          };
          setInventory(prev => [...prev, newItem]);
          setHasNewItems(true);
          generateItemImage(newItem.name, newItem.description).then(url => {
            if (url) {
              setInventory(prev => prev.map(i => i.id === newItem.id ? { ...i, imageUrl: url } : i));
            }
          });
        } else if (task.loot.type === 'LORE') {
          setChar(prev => ({ ...prev, loreUnlocked: [...prev.loreUnlocked, task.loot!.name + ": " + task.loot!.description] }));
        }
        setLatestLoot(task.loot);
      }
    }

    setChar(prev => {
      const today = new Date().toISOString().split('T')[0];
      const isNewDayStreak = prev.lastActiveDate !== today;

      // Twilight Mode Logic
      if (prev.settings.twilightMode) {
        return {
          ...prev,
          embers: prev.embers + Math.round(finalRewards.vibration / 10), // Earn Embers not XP
          lastActiveDate: today
        };
      }

      // Normal Mode Logic
      let newXp = prev.xp + finalRewards.vibration;
      let newLevel = prev.level;
      let nextXp = prev.nextLevelXp;
      let newVibration = prev.vibration + finalRewards.vibration;
      let newStreak = isNewDayStreak ? prev.streak + 1 : prev.streak;

      // Ledger Logic (Alchemist)
      let newTransmutationCount = prev.transmutationCount;
      let newGoldRush = prev.goldRushActive;

      if (task.category === 'NEUTRAL') {
        newTransmutationCount += 1;
        if (newTransmutationCount % 3 === 0) newGoldRush = true;
      } else {
        newGoldRush = false; // Reset streak if non-neutral task done? Or keep it? Let's keep it simple.
      }

      while (newXp >= nextXp) {
        newXp -= nextXp;
        newLevel += 1;
        nextXp = getXpToNextLevel(newLevel);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        nextLevelXp: nextXp,
        vibration: newVibration,
        mana: prev.mana + finalRewards.mana,
        energy: prev.energy + finalRewards.energy,
        streak: newStreak,
        lastActiveDate: today,
        transmutationCount: newTransmutationCount,
        goldRushActive: newGoldRush
      };
    });
  };

  const equipItem = (item: InventoryItem) => {
    if (!item.slot) return;
    setChar(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [item.slot!]: item
      }
    }));
  };

  const registerRealWorldItem = async (item: InventoryItem, realName: string) => {
    setGuidance(`Deeply analyzing ${realName}... Unweaving its technical essence.`);
    const aiStatsPromise = bindRealWorldItemWithAI(item.name, realName);
    const aiImagePromise = generateItemImage(`${item.name} merged with ${realName}`, item.description);
    const [aiStats, aiImage] = await Promise.all([aiStatsPromise, aiImagePromise]);
    setInventory(prev => prev.map(i => i.id === item.id ? {
      ...i,
      realWorldCounterpart: realName,
      stats: aiStats,
      imageUrl: aiImage || i.imageUrl
    } : i));
    setGuidance(`Essence Bound. Your reality is now anchored to this relic.`);
  };

  const handleItemFusion = async (item1: InventoryItem, item2: InventoryItem) => {
    const FUSION_COST = 50;
    if (char.mana < FUSION_COST) {
      setGuidance("Insufficient Mana. You need 50 Mana to perform fusion alchemy.");
      return;
    }

    // Deduct Cost
    setChar(prev => ({ ...prev, mana: prev.mana - FUSION_COST }));

    setFusing(true);
    setGuidance(`Merging ${item1.name} and ${item2.name}... The Alchemist is working.`);

    const fusedItem = await fuseItemsWithAI(item1, item2);

    if (fusedItem) {
      const newItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: fusedItem.name,
        rarity: fusedItem.rarity,
        description: fusedItem.description,
        icon: 'Sparkles',
        slot: fusedItem.slot as EquipmentSlot || EquipmentSlot.RELIC,
        stats: fusedItem.stats
      };
      setInventory(prev => {
        const remaining = prev.filter(i => i.id !== item1.id && i.id !== item2.id);
        return [...remaining, newItem];
      });
      setChar(prev => {
        const newEquip = { ...prev.equipment };
        if (newEquip[item1.slot!]?.id === item1.id) delete newEquip[item1.slot!];
        if (newEquip[item2.slot!]?.id === item2.id) delete newEquip[item2.slot!];
        return { ...prev, equipment: newEquip };
      });
      generateItemImage(newItem.name, newItem.description).then(url => {
        if (url) setInventory(prev => prev.map(i => i.id === newItem.id ? { ...i, imageUrl: url } : i));
      });
      setLatestLoot({ ...fusedItem, type: 'ITEM' });
      setGuidance("Fusion Complete. A new artifact is born.");
    } else {
      // Refund if fusion fails (API error)
      setChar(prev => ({ ...prev, mana: prev.mana + FUSION_COST }));
      setGuidance("The Alchemical process failed. Mana restored.");
    }
    setFusing(false);
  };

  const spendEnergy = (cost: number) => {
    if (char.energy < cost) return;
    setChar(prev => ({ ...prev, energy: prev.energy - cost }));
  };

  // UPDATED: Now spends Vibration (XP) to unlock skills
  const unlockSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (!skill || skill.unlocked || char.vibration < skill.cost) return; // Check Vibration cost

    const newStats = { ...char.baseStats };
    if (skill.stats) {
      if (skill.stats.focus) newStats.focus += skill.stats.focus;
      if (skill.stats.efficiency) newStats.efficiency += skill.stats.efficiency;
      if (skill.stats.resonance) newStats.resonance += skill.stats.resonance;
      if (skill.stats.quality) newStats.quality = parseFloat((newStats.quality * (skill.stats.quality || 1)).toFixed(2));
    }

    setSkills(prev => prev.map(s => s.id === skillId ? { ...s, unlocked: true } : s));

    // Deduct Vibration
    setChar(prev => ({
      ...prev,
      vibration: prev.vibration - skill.cost,
      baseStats: newStats
    }));
  };

  const convertManaToEnergy = () => {
    if (!isTransmutationUnlocked || char.mana < 20) return;
    setChar(prev => ({ ...prev, mana: prev.mana - 20, energy: prev.energy + 15 }));
  };

  const toggleBattleMode = (active: boolean) => {
    setChar(prev => ({
      ...prev,
      settings: { ...prev.settings, battleMode: active }
    }));
  };

  const toggleSanctuaryMode = () => {
    setChar(prev => ({
      ...prev,
      settings: { ...prev.settings, sanctuaryMode: !prev.settings.sanctuaryMode }
    }));
  };

  const toggleTwilightMode = () => {
    setChar(prev => ({
      ...prev,
      settings: { ...prev.settings, twilightMode: !prev.settings.twilightMode }
    }));
  };

  const updateSettings = (updates: Partial<UISettings>) => {
    setChar(prev => ({
      ...prev,
      settings: { ...prev.settings, ...updates }
    }));
  };

  // ============================================
  // PHASE 1: Feature Expansion Handlers
  // ============================================

  // Potion of Momentum
  const activatePotion = (microTask: string) => {
    const now = new Date().toISOString();
    const endTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    setChar(prev => ({
      ...prev,
      lastPotionUse: now,
      microQuestActive: true,
      microQuestTask: microTask,
      microQuestEndTime: endTime
    }));
    setGuidance(`Micro-Quest activated! Complete "${microTask}" in 5 minutes for 3x XP!`);
  };

  const completeMicroQuest = () => {
    // Award 3x XP bonus (base 50 XP * 3 = 150)
    const bonusXp = 150;
    setChar(prev => ({
      ...prev,
      microQuestActive: false,
      microQuestTask: null,
      microQuestEndTime: null,
      vibration: prev.vibration + bonusXp,
      xp: prev.xp + bonusXp
    }));
    setGuidance(`CRITICAL SUCCESS! +${bonusXp} Vibration from your micro-quest!`);
  };

  const cancelMicroQuest = () => {
    setChar(prev => ({
      ...prev,
      microQuestActive: false,
      microQuestTask: null,
      microQuestEndTime: null
    }));
  };

  // Nebula of Ideas
  const addIdea = (text: string) => {
    const newIdea: Idea = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      createdAt: Date.now(),
      color: ['purple', 'blue', 'emerald', 'amber', 'rose'][Math.floor(Math.random() * 5)]
    };
    setChar(prev => ({
      ...prev,
      nebulaIdeas: [...prev.nebulaIdeas, newIdea]
    }));
  };

  const harvestIdea = (ideaId: string) => {
    const idea = char.nebulaIdeas.find(i => i.id === ideaId);
    if (!idea) return;

    // Create a new task from the idea
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: idea.text,
      description: 'Harvested from the Nebula of Ideas',
      type: QuestType.SIDE,
      category: 'CREATIVE',
      difficulty: 3,
      urgency: 3,
      isCompleted: false,
      rewards: calculateRewards(3, 3, QuestType.SIDE, 'CREATIVE', skills.filter(s => s.unlocked), char),
      createdAt: Date.now()
    };

    setTasks(prev => [newTask, ...prev]);
    setChar(prev => ({
      ...prev,
      nebulaIdeas: prev.nebulaIdeas.filter(i => i.id !== ideaId)
    }));
    setGuidance(`Idea "${idea.text.slice(0, 30)}..." harvested into a Quest!`);
  };

  const dissolveIdea = (ideaId: string) => {
    setChar(prev => ({
      ...prev,
      nebulaIdeas: prev.nebulaIdeas.filter(i => i.id !== ideaId),
      mana: prev.mana + 5 // Small Mana return
    }));
  };

  // Transmutation Fire
  const burnWorry = (text: string) => {
    const newWorry: Worry = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      burnedAt: Date.now()
    };
    setChar(prev => ({
      ...prev,
      worryLog: [...prev.worryLog, newWorry],
      resilienceXp: prev.resilienceXp + 5
    }));
    setGuidance(`Worry transmuted. +5 Resilience XP. Let it go.`);
  };

  // Oracle Compass
  const acceptOracleChoice = (taskId: string) => {
    setTrustBuffTaskId(taskId);
    setShowOracleCompass(false);
    setGuidance(`Trust Buff active! Complete this quest for +10% bonus XP.`);
  };

  const handleCharacterCreation = (name: string, archetype: Archetype, backstory: string) => {
    setChar(prev => ({
      ...prev,
      name,
      archetype,
      backstory,
      baseStats: ARCHETYPE_STATS[archetype]
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'inventory') {
      setHasNewItems(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return (
        <div className="space-y-6">
          <Dashboard
            char={char}
            guidance={guidance}
            onSpendEnergy={spendEnergy}
            onToggleBattleMode={toggleBattleMode}
            onActivateSanctuary={() => toggleSanctuaryMode()}
            onToggleTwilight={toggleTwilightMode}
          />

          {/* Phase 1: Potion of Momentum */}
          <PotionOfMomentum
            lastPotionUse={char.lastPotionUse}
            microQuestActive={char.microQuestActive}
            microQuestTask={char.microQuestTask}
            microQuestEndTime={char.microQuestEndTime}
            onActivate={activatePotion}
            onComplete={completeMicroQuest}
            onCancel={cancelMicroQuest}
          />

          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            <button
              onClick={() => setShowBreathing(true)}
              className="bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest border border-white/5"
            >
              <Waves size={16} /> Quick Breath
            </button>
            {/* Phase 1: Feature Access Buttons */}
            <button
              onClick={() => setShowOracleCompass(true)}
              className="bg-purple-900/20 hover:bg-purple-900/40 text-purple-400 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest border border-purple-500/30"
            >
              <Compass size={16} /> Oracle
            </button>
            <button
              onClick={() => setShowTransmutationFire(true)}
              className="bg-orange-900/20 hover:bg-orange-900/40 text-orange-400 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest border border-orange-500/30"
            >
              <Flame size={16} /> Fire
            </button>
            <button
              onClick={() => setShowNebulaOfIdeas(true)}
              className="bg-indigo-900/20 hover:bg-indigo-900/40 text-indigo-400 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest border border-indigo-500/30"
            >
              <Lightbulb size={16} /> Nebula ({char.nebulaIdeas.length})
            </button>
            <button
              onClick={() => setShowHallOfEchoes(true)}
              className="bg-amber-900/20 hover:bg-amber-900/40 text-amber-400 px-6 py-3 rounded-2xl flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest border border-amber-500/30"
            >
              <Trophy size={16} /> Hall ({char.completedBossTasks.length})
            </button>
          </div>
          {!char.settings.battleMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Note: Simplified Access checks for now */}
              <KeystoneButton onClick={() => setShowAnalytics(true)} icon={<BarChart3 className="text-amber-500" />} title="Command Center" subtitle="Analytics" color="border-amber-500/30" disabled={!isCommandCenterUnlocked} />
              <KeystoneButton onClick={convertManaToEnergy} icon={<Waves className="text-blue-500" />} title="Transmute" subtitle="20M → 15E" color="border-blue-500/30" disabled={char.mana < 20 || !isTransmutationUnlocked} />
              <KeystoneButton onClick={() => setShowLedger(true)} icon={<Book className="text-emerald-500" />} title="The Ledger" subtitle="Social Impact" color="border-emerald-500/30" disabled={!isLedgerUnlocked} />
              <KeystoneButton onClick={() => setShowSettings(true)} icon={<Settings className="text-slate-400" />} title="Sanctum Tuning" subtitle="UI & Accessibility" color="border-slate-500/30" />
            </div>
          )}
        </div>
      );
      case 'quests': return (
        <QuestLog
          tasks={tasks}
          skills={skills}
          character={char}
          onAddTask={addTask}
          onCompleteTask={completeTask}
          onDeleteTask={deleteTask}
          onFailTask={failTask}
          goldRushMode={char.goldRushActive}
          isTwilightMode={char.settings.twilightMode}
        />
      );
      case 'skills': return <SkillTree skills={skills} onUnlock={unlockSkill} vibration={char.vibration} />;
      case 'inventory': return (
        <Inventory
          items={inventory}
          character={char}
          onEquip={equipItem}
          onRegisterRealWorld={registerRealWorldItem}
          onFuse={handleItemFusion}
          lore={char.loreUnlocked}
        />
      );
      case 'spec': return <LoreSection />;
      default: return <Dashboard char={char} guidance={guidance} onSpendEnergy={spendEnergy} onToggleBattleMode={toggleBattleMode} onActivateSanctuary={() => toggleSanctuaryMode()} onToggleTwilight={toggleTwilightMode} />;
    }
  };

  // If no archetype is selected, show character creation
  if (!char.archetype) {
    return <CharacterCreation onComplete={handleCharacterCreation} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={handleTabChange} isBattleMode={char.settings.battleMode} isSanctuaryMode={char.settings.sanctuaryMode} hasNewItems={hasNewItems}>
      {char.settings.sanctuaryMode ? (
        <SanctuaryMode onExit={() => toggleSanctuaryMode()} />
      ) : (
        <div className="animate-in fade-in duration-1000 relative">
          {renderContent()}

          {/* Dedicated Breathing Modal */}
          {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}

          {/* Fusion / Loot Loading State */}
          {fusing && (
            <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 bg-black/90 backdrop-blur-md">
              <Merge size={64} className="text-purple-500 animate-pulse mb-6" />
              <h2 className="text-2xl font-black text-white uppercase tracking-widest animate-bounce">Alchemizing...</h2>
            </div>
          )}

          {latestLoot && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in zoom-in-95">
              <div className="bg-[#050a06] border-2 border-amber-500/40 p-10 rounded-[3rem] text-center max-w-sm relative shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                <Trophy size={64} className="text-amber-500 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Divine Loot Drop!</h2>
                <div className="bg-amber-500/10 p-4 rounded-2xl mb-6">
                  <h3 className="font-bold text-amber-500">{latestLoot.name}</h3>
                  <p className="text-xs text-amber-500/60 mt-1 dyslexic-friendly">{latestLoot.description}</p>
                  {latestLoot.type === 'ITEM' && <p className="text-[10px] font-black uppercase text-amber-500/40 mt-3">Manifesting Visual Essence...</p>}
                </div>
                <button onClick={() => setLatestLoot(null)} className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Enshrine in Satchel</button>
              </div>
            </div>
          )}

          {showSettings && (
            <Modal onClose={() => setShowSettings(false)} title="Sanctum Tuning" subtitle="Accessibility & Visuals" icon={<Settings className="text-slate-400" size={32} />} accentColor="border-white/10">
              <div className="space-y-6">
                <ToggleRow
                  label="Bionic Reading"
                  desc="Bolds initial letters for faster processing."
                  active={char.settings.bionicReading}
                  onToggle={() => updateSettings({ bionicReading: !char.settings.bionicReading })}
                />
                <ToggleRow
                  label="High Juice Effects"
                  desc="Enables particles and screen shake on completion."
                  active={char.settings.highJuice}
                  onToggle={() => updateSettings({ highJuice: !char.settings.highJuice })}
                />
              </div>
            </Modal>
          )}

          {showAnalytics && <Modal onClose={() => setShowAnalytics(false)} title="Command" subtitle="Analytics" icon={<BarChart3 className="text-amber-500" size={32} />} accentColor="border-amber-500/20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"><AnalyticsCard icon={<TrendingUp size={20} />} label="Vibe Velocity" value={char.vibration} trend="+12%" color="text-amber-500" /><AnalyticsCard icon={<Brain size={20} />} label="Deep Depth" value="84%" trend="Opt" color="text-blue-400" /><AnalyticsCard icon={<Target size={20} />} label="Quest Success" value="92%" trend="High" color="text-emerald-400" /></div>
          </Modal>}
          {showLedger && <Modal onClose={() => setShowLedger(false)} title="The Ledger" subtitle="Impact" icon={<Globe className="text-emerald-500" size={32} />} accentColor="border-emerald-500/20">
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center justify-between"><div className="flex items-center gap-4"><Users className="text-emerald-400" /><div><h4 className="font-bold text-white">Community Resonance</h4><p className="text-xs text-white/40">Bridge tasks completed</p></div></div><span className="text-4xl font-black text-emerald-400">12</span></div>
          </Modal>}

          {/* Phase 1: Feature Modals */}
          {showOracleCompass && (
            <OracleCompass
              tasks={tasks}
              onAccept={acceptOracleChoice}
              onClose={() => setShowOracleCompass(false)}
            />
          )}

          {showTransmutationFire && (
            <TransmutationFire
              worryLog={char.worryLog}
              onBurnWorry={burnWorry}
              onClose={() => setShowTransmutationFire(false)}
            />
          )}

          {showNebulaOfIdeas && (
            <NebulaOfIdeas
              ideas={char.nebulaIdeas}
              onAddIdea={addIdea}
              onHarvestIdea={harvestIdea}
              onDissolveIdea={dissolveIdea}
              onClose={() => setShowNebulaOfIdeas(false)}
            />
          )}

          {showHallOfEchoes && (
            <HallOfEchoes
              completedTasks={char.completedBossTasks}
              onClose={() => setShowHallOfEchoes(false)}
            />
          )}
        </div>
      )}
    </Layout>
  );
};

const ToggleRow = ({ label, desc, active, onToggle }: any) => (
  <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
    <div>
      <h4 className="font-bold text-white">{label}</h4>
      <p className="text-xs text-white/40 dyslexic-friendly">{desc}</p>
    </div>
    <button onClick={onToggle} className={`w-14 h-8 rounded-full transition-all relative ${active ? 'bg-emerald-500' : 'bg-slate-800'}`}>
      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const KeystoneButton = ({ onClick, icon, title, subtitle, color, disabled }: any) => (
  <button onClick={onClick} disabled={disabled} className={`bg-[#0d1a0e] border p-6 rounded-3xl flex items-center justify-between transition-all group disabled:opacity-40 disabled:grayscale ${color}`}><div className="flex items-center gap-4"><div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div><div className="text-left"><h4 className="font-black text-xs uppercase tracking-widest text-white">{title}</h4><p className="text-[10px] text-white/40">{subtitle}</p></div></div><Sparkles size={16} className="text-white/10 group-hover:text-white/40" /></button>
);

const Modal = ({ children, onClose, title, subtitle, icon, accentColor }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"><div className={`bg-[#050a06] border ${accentColor} w-full max-w-4xl p-8 rounded-[3rem] relative overflow-y-auto max-h-[90vh]`}><button onClick={onClose} className="absolute top-8 right-8 text-white/40 bg-white/5 p-2 rounded-full"><X size={20} /></button><div className="flex items-center gap-4 mb-10"><div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center">{icon}</div><div><h2 className="text-3xl font-black uppercase text-white">{title}</h2><p className="text-white/40 font-bold uppercase text-[10px] tracking-[0.3em]">{subtitle}</p></div></div>{children}</div></div>
);

const AnalyticsCard = ({ icon, label, value, trend, color }: any) => (
  <div className="bg-black/40 border border-white/5 p-6 rounded-3xl flex flex-col gap-2"><div className={`${color} opacity-40`}>{icon}</div><span className="text-3xl font-black text-white">{value}</span><div className="flex justify-between items-center"><span className="text-[10px] font-bold text-white/40 uppercase">{label}</span><span className={`text-[9px] font-black ${color}`}>{trend}</span></div></div>
);

export default App;
