
import { QuestType, TaskCategory, SkillNode, Character } from '../types';

export const calculateRewards = (
  difficulty: number, 
  urgency: number, 
  type: QuestType, 
  category: TaskCategory,
  unlockedSkills: SkillNode[],
  character: Character,
  inFlow: boolean = false
) => {
  // Get combined stats from equipment
  const stats = { ...character.baseStats };
  Object.values(character.equipment).forEach(item => {
    if (item?.stats) {
      if (item.stats.focus) stats.focus += item.stats.focus;
      if (item.stats.efficiency) stats.efficiency += item.stats.efficiency;
      if (item.stats.resonance) stats.resonance += item.stats.resonance;
      if (item.stats.quality) stats.quality *= item.stats.quality;
    }
  });

  // 1. Base Multipliers for Quest Types
  let typeMultiplier = 1;
  if (type === QuestType.MAIN) typeMultiplier = 2.5;
  if (type === QuestType.BOSS) typeMultiplier = 5.0;
  if (type === QuestType.SIDE) typeMultiplier = 0.8;
  if (type === QuestType.SHADOW) typeMultiplier = 0.5;

  // 2. Flow State Bonus (1.5x XP)
  const flowMultiplier = inFlow ? 1.5 : 1.0;

  // 3. Vibration (XP) Calculation
  // Resonance increases XP gain
  const resonanceMultiplier = 1 + (stats.resonance / 100);
  let vibrationBase = ((difficulty * 10) + (urgency * 5)) * typeMultiplier * flowMultiplier * resonanceMultiplier;
  
  // Apply Visionary Passives
  const xpBoost = unlockedSkills.find(s => s.effectType === 'XP_BOOST');
  if (xpBoost && category === 'NEUTRAL') {
     vibrationBase *= xpBoost.effectValue || 1;
  }
  
  const vibration = Math.round(vibrationBase);
  
  // 4. Mana vs Energy Split
  // Focus increases Mana gain
  const focusMultiplier = 1 + (stats.focus / 100);
  // Efficiency reduces "implied cost" or can be interpreted as boosting Energy gain per difficulty
  const efficiencyMultiplier = 1 + (stats.efficiency / 100);

  let mana = 0;
  let energy = 0;

  if (category === 'CREATIVE') {
    mana = (difficulty * 8) * (type === QuestType.MAIN ? 1.5 : 1) * focusMultiplier;
    const manaBoost = unlockedSkills.find(s => s.effectType === 'MANA_BOOST');
    if (manaBoost) mana *= manaBoost.effectValue || 1;
    energy = Math.round(difficulty * 2 * efficiencyMultiplier);
  } else if (category === 'PHYSICAL') {
    energy = (difficulty * 10) * (type === QuestType.MAIN ? 1.5 : 1) * efficiencyMultiplier;
    const energyBoost = unlockedSkills.find(s => s.effectType === 'ENERGY_BOOST' && s.branch === 'VITALITY');
    if (energyBoost) energy *= energyBoost.effectValue || 1;
    mana = Math.round(difficulty * 1 * focusMultiplier);
  } else {
    mana = Math.round(difficulty * 3 * focusMultiplier);
    energy = Math.round(difficulty * 3 * efficiencyMultiplier);
    const socialEnergyBoost = unlockedSkills.find(s => s.effectType === 'ENERGY_BOOST' && s.branch === 'BRIDGE');
    if (socialEnergyBoost) energy *= socialEnergyBoost.effectValue || 1;
  }

  // Apply Quality multiplier to everything
  mana *= stats.quality;
  energy *= stats.quality;

  // Shadow quests specifically focus on Energy (Recovery)
  if (type === QuestType.SHADOW) {
    energy *= 2;
    mana = 0;
  }

  return { vibration, mana: Math.round(mana), energy: Math.round(energy) };
};

export const getXpToNextLevel = (level: number) => {
  return Math.floor(100 * Math.pow(level + 1, 1.6));
};
