
import React from 'react';
import { Briefcase, Music, Zap, Heart, Sword, Shield, Book, Sparkles, Eye, Users, Activity, BarChart3, Waves, Brain, Feather, Anchor, Lock, History, Ear, Crown, FastForward } from 'lucide-react';
import { SkillNode, Character, Archetype, Stats } from './types';

export const COLORS = {
  bg: '#050a06',
  surface: '#0d1a0e',
  primary: '#10b981', // Emerald
  accent: '#f59e0b', // Amber/Gold
  vibration: '#fbbf24',
  mana: '#3b82f6',
  energy: '#ef4444',
  text: '#f8fafc',
  twilightBg: '#0f0f1b', // Deep Indigo
  twilightSurface: '#16162a',
  twilightAccent: '#818cf8', // Indigo-400
};

export const ARCHETYPE_STATS: Record<Archetype, Stats> = {
  WEAVER: { focus: 20, efficiency: 5, resonance: 15, quality: 1.0 },
  WARDEN: { focus: 5, efficiency: 20, resonance: 5, quality: 1.0 },
  SCHOLAR: { focus: 10, efficiency: 10, resonance: 10, quality: 1.1 },
};

export const INITIAL_CHARACTER: Character = {
  name: 'Seeker',
  level: 1,
  xp: 0,
  nextLevelXp: 100,
  mana: 50,
  energy: 50,
  vibration: 200, // Giving some initial vibration to start the journey
  streak: 0,
  forgivenessBuffer: 2,
  lastActiveDate: null,
  loreUnlocked: [],
  equipment: {},
  baseStats: {
    focus: 10,
    efficiency: 10,
    resonance: 10,
    quality: 1.0
  },
  settings: {
    bionicReading: true,
    highJuice: true,
    battleMode: false,
    sanctuaryMode: false,
    twilightMode: false
  },
  transmutationCount: 0,
  goldRushActive: false,
  embers: 0,
  // Phase 1: Feature expansion initial values
  lastPotionUse: null,
  microQuestActive: false,
  microQuestTask: null,
  microQuestEndTime: null,
  nebulaIdeas: [],
  worryLog: [],
  resilienceXp: 0,
  completedBossTasks: []
};

// THE CELESTIAL LATTICE
// Center is (0,0)
// North (-Y) = Creation
// South (+Y) = Vitality
// East (+X) = Order
// West (-X) = Connection

export const INITIAL_SKILLS: SkillNode[] = [
  // --- CENTER: THE SOURCE ---
  {
    id: 'source', name: 'The Source', description: 'Your core consciousness.', icon: 'Sparkles', type: 'MAJOR',
    x: 0, y: 0, unlocked: true, cost: 0, stats: { focus: 1, efficiency: 1 }
  },

  // --- NORTH: CREATION (Deep Work, Flow) ---
  {
    id: 'n1', name: 'Gem Polish', description: '+5% XP from Admin Tasks.', icon: 'Sparkles', type: 'MINOR',
    x: 0, y: -150, unlocked: false, cost: 100, prerequisiteId: 'source', stats: { resonance: 5 }
  },
  {
    id: 'n2', name: 'Flow Trigger', description: 'Easier to enter deep work.', icon: 'Waves', type: 'MINOR',
    x: 0, y: -300, unlocked: false, cost: 150, prerequisiteId: 'n1', stats: { focus: 5 }
  },
  {
    id: 'n_major_1', name: 'The Silas Lock', description: 'Unlocks Task Locking mechanism.', icon: 'Lock', type: 'MAJOR',
    x: 0, y: -500, unlocked: false, cost: 400, prerequisiteId: 'n2', effectType: 'UNLOCK_FEATURE', featureId: 'lock_task'
  },
  {
    id: 'n_keystone', name: "The Monk's Vow", description: 'Double XP/Focus. Social Tab Disabled until 2PM.', icon: 'Crown', type: 'KEYSTONE',
    x: 0, y: -750, unlocked: false, cost: 1000, prerequisiteId: 'n_major_1',
    tradeOff: 'Cannot access Email/Socials until 14:00.', effectType: 'GAME_RULE'
  },

  // --- EAST: ORDER (Systems, Admin) ---
  {
    id: 'e1', name: 'Pocket Dimension', description: 'Task Log Capacity +1.', icon: 'Briefcase', type: 'MINOR',
    x: 150, y: 0, unlocked: false, cost: 100, prerequisiteId: 'source', stats: { efficiency: 5 }
  },
  {
    id: 'e2', name: 'Ledger Keeper', description: 'Reduced Mana cost for neutral tasks.', icon: 'Book', type: 'MINOR',
    x: 300, y: 0, unlocked: false, cost: 150, prerequisiteId: 'e1', stats: { efficiency: 10 }
  },
  {
    id: 'e_major_1', name: 'Echoes of Past', description: 'Unlocks History View.', icon: 'History', type: 'MAJOR',
    x: 500, y: 0, unlocked: false, cost: 400, prerequisiteId: 'e2', effectType: 'UNLOCK_FEATURE', featureId: 'history_view'
  },
  {
    id: 'e_keystone', name: "Delegator's Pact", description: '300% XP for Reviewing. 0% for Doing.', icon: 'Users', type: 'KEYSTONE',
    x: 750, y: 0, unlocked: false, cost: 1000, prerequisiteId: 'e_major_1',
    tradeOff: 'You gain 0 XP for completing neutral tasks yourself.', effectType: 'GAME_RULE'
  },

  // --- SOUTH: VITALITY (Health, Sleep) ---
  {
    id: 's1', name: 'Extended Breath', description: 'Forgiveness Buffer +1.', icon: 'Activity', type: 'MINOR',
    x: 0, y: 150, unlocked: false, cost: 100, prerequisiteId: 'source', stats: { efficiency: 2 }
  },
  {
    id: 's2', name: 'Rooted Stance', description: 'Energy drain reduced by 10%.', icon: 'Anchor', type: 'MINOR',
    x: 0, y: 300, unlocked: false, cost: 150, prerequisiteId: 's1', stats: { efficiency: 10 }
  },

  // --- WEST: CONNECTION (Sales, Social) ---
  {
    id: 'w1', name: 'Open Ear', description: 'Better rewards for social quests.', icon: 'Ear', type: 'MINOR',
    x: -150, y: 0, unlocked: false, cost: 100, prerequisiteId: 'source', stats: { quality: 1.05 }
  },
  {
    id: 'w2', name: 'Silver Tongue', description: 'High charisma output.', icon: 'Feather', type: 'MINOR',
    x: -300, y: 0, unlocked: false, cost: 150, prerequisiteId: 'w1', stats: { quality: 1.1 }
  },
  {
    id: 'w_major_1', name: "Merchant's Ear", description: 'Custom notification sounds.', icon: 'Music', type: 'MAJOR',
    x: -500, y: 0, unlocked: false, cost: 400, prerequisiteId: 'w2', effectType: 'UNLOCK_FEATURE', featureId: 'custom_sounds'
  },

  // --- HYBRID: ADRENALINE ENGINE (North-East) ---
  {
    id: 'ne1', name: 'Rapid Fire', description: 'Speed +10%.', icon: 'Zap', type: 'MINOR',
    x: 200, y: -200, unlocked: false, cost: 250, prerequisiteId: 'n1', stats: { efficiency: 5, focus: 5 }
  },
  {
    id: 'ne_keystone', name: "Adrenaline Engine", description: 'Activate Crunch Mode (Infinite Mana).', icon: 'FastForward', type: 'KEYSTONE',
    x: 400, y: -400, unlocked: false, cost: 1500, prerequisiteId: 'ne1',
    tradeOff: 'Next day locked in Recovery Mode (Max 3 Tasks).', effectType: 'GAME_RULE'
  },
];

export const RARITY_COLORS = {
  COMMON: 'text-slate-400',
  UNCOMMON: 'text-emerald-400',
  RARE: 'text-blue-400',
  LEGENDARY: 'text-amber-400 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]',
  RELIC: 'text-purple-400 font-extrabold italic shadow-purple-500/50',
};

export const LEISURE_ITEMS = [
  { id: 'l1', name: 'Short Rest', cost: 20, description: '15 mins of guilt-free scroll time.' },
  { id: 'l2', name: 'Entertainment Block', cost: 50, description: '1 hour of gaming or cinema.' },
  { id: 'l3', name: 'Deep Reset', cost: 120, description: 'A full evening of indulgence.' },
];
