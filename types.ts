
export enum QuestType {
  MAIN = 'MAIN',
  SIDE = 'SIDE',
  BOSS = 'BOSS',
  SHADOW = 'SHADOW' // Recovery quests
}

export type TaskCategory = 'CREATIVE' | 'PHYSICAL' | 'NEUTRAL';
// SkillBranch is deprecated in favor of directional pathing, but kept for legacy type safety if needed temporarily
export type SkillBranch = 'VISIONARY' | 'ALCHEMIST' | 'BRIDGE' | 'VITALITY';
export type Archetype = 'WEAVER' | 'WARDEN' | 'SCHOLAR';
export type SkillType = 'MINOR' | 'MAJOR' | 'KEYSTONE';

export enum EquipmentSlot {
  WEAPON = 'WEAPON', // Instruments / Creative Tools
  ARMOR = 'ARMOR',   // Workspace / Environment
  RELIC = 'RELIC',   // Software / Digital Tools
  ACCESSORY = 'ACCESSORY' // Biohacking / Health tools
}

export interface Stats {
  focus: number;      // Increases Mana gain
  efficiency: number; // Reduces Energy cost
  resonance: number;  // Increases Vibration (XP) gain
  quality: number;    // Multiplier for category-specific rewards
}

export interface Loot {
  type: 'ITEM' | 'LORE' | 'BADGE';
  name: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  category: TaskCategory;
  difficulty: number; // 1-10
  urgency: number; // 1-10
  isCompleted: boolean;
  isFailed?: boolean;
  rewards: {
    vibration: number;
    mana: number;
    energy: number;
  };
  loot?: Loot;
  createdAt: number;
}

export interface UISettings {
  bionicReading: boolean;
  highJuice: boolean;
  battleMode: boolean;
  sanctuaryMode: boolean;
  twilightMode: boolean;
}

export interface Character {
  name: string;
  archetype?: Archetype;
  backstory?: string;
  level: number;
  xp: number; // Cumulative XP for leveling
  nextLevelXp: number;
  mana: number;
  energy: number;
  vibration: number; // Spendable Currency (Souls)
  streak: number;
  forgivenessBuffer: number;
  lastActiveDate: string | null;
  loreUnlocked: string[];
  equipment: Partial<Record<EquipmentSlot, InventoryItem>>;
  baseStats: Stats;
  settings: UISettings;
  transmutationCount: number;
  goldRushActive: boolean;
  embers: number;
  // Phase 1: Feature expansion fields
  lastPotionUse: string | null;
  microQuestActive: boolean;
  microQuestTask: string | null;
  microQuestEndTime: number | null;
  nebulaIdeas: Idea[];
  worryLog: Worry[];
  resilienceXp: number;
  completedBossTasks: CompletedBossTask[];
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: SkillType;

  // Coordinates for the Celestial Lattice
  x: number;
  y: number;

  unlocked: boolean;
  cost: number; // Cost in Vibration

  stats?: Partial<Stats>;
  tradeOff?: string; // For Keystones

  prerequisiteId?: string; // Single parent for simple pathing, or array for complex

  // Logic Effects
  effectType?: 'XP_BOOST' | 'MANA_BOOST' | 'ENERGY_BOOST' | 'UNLOCK_FEATURE' | 'GAME_RULE';
  effectValue?: number;
  featureId?: string; // e.g., 'lock_task', 'history_view'
  branch?: SkillBranch;
}

export interface InventoryItem {
  id: string;
  name: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'LEGENDARY' | 'RELIC';
  description: string;
  icon: string;
  slot?: EquipmentSlot;
  stats?: Partial<Stats>;
  realWorldCounterpart?: string;
  imageUrl?: string;
}

// Phase 1: New interfaces for expansion features
export interface Idea {
  id: string;
  text: string;
  createdAt: number;
  color: string;
}

export interface Worry {
  id: string;
  text: string;
  burnedAt: number;
}

export interface CompletedBossTask {
  id: string;
  title: string;
  completedAt: number;
  artUrl?: string;
}