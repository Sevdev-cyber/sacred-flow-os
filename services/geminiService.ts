
import { GoogleGenAI, Type } from "@google/genai";
import { QuestType } from "../types";

// Use the named parameter and direct access to process.env.API_KEY as per the @google/genai guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const evaluateThoughtWithAI = async (thought: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the AI Dungeon Master for a Life-RPG. 
      The user has entered a thought: "${thought}"
      
      Your goal is to deeply analyze this thought, detecting emotional undertones, urgency, and implied sub-tasks.
      
      1. Parse this into 1-3 distinct actionable quests. 
         - If the user is overwhelmed, create small, manageable "Recovery" quests.
         - If the user is ambitious, create a "Main" quest and supporting "Side" quests.
      
      2. For each quest, determine:
         - title: A creative, high-fantasy or sci-fi flavored title (e.g. "Protocol: Inbox Zero" instead of "Check emails").
         - type: MAIN (Strategic Goals), SIDE (Tactical/Maintenance), or BOSS (High Stress/Deadlines).
         - category: CREATIVE, PHYSICAL, or NEUTRAL.
         - difficulty: 1-10 (Assess cognitive load).
         - urgency: 1-10 (Assess time sensitivity).
         - loot: If it's a BOSS or MAIN quest, invent a thematic 'Reward Item' (e.g. "Potion of Clarity") or 'Lore Fragment' (e.g. "The Scroll of Q3").
      
      Respond only with JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quests: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['MAIN', 'SIDE', 'BOSS', 'SHADOW'] },
                  category: { type: Type.STRING, enum: ['CREATIVE', 'PHYSICAL', 'NEUTRAL'] },
                  difficulty: { type: Type.NUMBER },
                  urgency: { type: Type.NUMBER },
                  loot: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      description: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['ITEM', 'LORE', 'BADGE'] }
                    }
                  }
                },
                required: ["title", "type", "category", "difficulty", "urgency"]
              }
            }
          },
          required: ["quests"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Thought Parsing failed:", error);
    return { quests: [{ title: thought, type: 'SIDE', category: 'NEUTRAL', difficulty: 5, urgency: 5 }] };
  }
};

export const generateLootForTask = async (taskTitle: string, category: string, difficulty: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a unique RPG loot item rewarded for completing the task: "${taskTitle}" (Category: ${category}, Difficulty: ${difficulty}/10).
      
      The item should be thematically related to the task.
      Example: "Finish Novel Draft" -> "Pen of Endless Flow" (Increases focus).
      
      Determine:
      - name: Creative high-fantasy or sci-fi name.
      - description: Flavor text explaining its origin or use.
      - rarity: UNCOMMON, RARE, or LEGENDARY (based on difficulty).
      - slot: WEAPON, ARMOR, RELIC, or ACCESSORY.
      - stats: Bonus stats (Focus, Efficiency, Resonance, Quality) relevant to the item.
      
      Respond only with JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: ['UNCOMMON', 'RARE', 'LEGENDARY'] },
            slot: { type: Type.STRING, enum: ['WEAPON', 'ARMOR', 'RELIC', 'ACCESSORY'] },
            stats: {
               type: Type.OBJECT,
               properties: {
                 focus: { type: Type.NUMBER },
                 efficiency: { type: Type.NUMBER },
                 resonance: { type: Type.NUMBER },
                 quality: { type: Type.NUMBER },
               }
            }
          },
          required: ["name", "description", "rarity", "slot", "stats"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Loot Generation failed:", error);
    return null;
  }
};

export const fuseItemsWithAI = async (item1: any, item2: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Master Alchemist. Fuse these two items into one powerful new artifact.
      
      Item 1: ${item1.name} (${item1.description})
      Item 2: ${item2.name} (${item2.description})
      
      The new item should combine the themes and strengths of both.
      It should have slightly better stats than the sum or average of the parents.
      Rarity should be one tier higher than the highest input rarity (max RELIC).
      
      Respond only with JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            rarity: { type: Type.STRING, enum: ['RARE', 'LEGENDARY', 'RELIC'] },
            slot: { type: Type.STRING, enum: ['WEAPON', 'ARMOR', 'RELIC', 'ACCESSORY'] },
            stats: {
               type: Type.OBJECT,
               properties: {
                 focus: { type: Type.NUMBER },
                 efficiency: { type: Type.NUMBER },
                 resonance: { type: Type.NUMBER },
                 quality: { type: Type.NUMBER },
               }
            }
          },
          required: ["name", "description", "rarity", "slot", "stats"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Fusion failed:", error);
    return null;
  }
};

export const bindRealWorldItemWithAI = async (artifactName: string, realWorldItem: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Master Alchemist and Technomancer.
      You are binding the essence of a real-world object to a digital artifact in a high-fantasy RPG.
      
      Artifact Name: "${artifactName}"
      Real World Counterpart: "${realWorldItem}"
      
      Deeply analyze the real-world item's technical specifications, brand philosophy, and user experience.
      Translate these properties into RPG statistics with high precision:
      
      - Focus (0-30): Does this item aid in concentration, silence, or deep work? (e.g. Noise-canceling headphones = high focus).
      - Efficiency (0-30): Does it speed up workflows, automate tasks, or reduce friction? (e.g. New processor = high efficiency).
      - Resonance (0-30): Does it improve the quality of output, artistic expression, or "vibe"? (e.g. Mechanical keyboard = high resonance).
      - Quality (1.0 - 1.2): A multiplier based on the prestige/craftsmanship of the real-world item.
      
      Respond only with JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focus: { type: Type.NUMBER },
            efficiency: { type: Type.NUMBER },
            resonance: { type: Type.NUMBER },
            quality: { type: Type.NUMBER },
          },
          required: ["focus", "efficiency", "resonance", "quality"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Item Binding failed:", error);
    return { focus: 5, efficiency: 5, resonance: 5, quality: 1.01 };
  }
};

export const generateBackstory = async (name: string, archetype: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Generate a short, mystical 2-sentence backstory for a character named "${name}" who is a "${archetype}" in a Solarpunk/Fantasy world. 
      Use second person ("You are..."). Be cryptic but empowering.`,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Lower budget for simple creative writing
      }
    });
    return response.text;
  } catch (error) {
    return "You have awakened in the Grove, memory hazy but purpose clear.";
  }
};

export const generateItemImage = async (name: string, description: string) => {
  try {
    const prompt = `A single high-fantasy RPG item icon for "${name}". Description: ${description}. Zen aesthetic, cinematic lighting, deep emerald greens and shimmering gold, centered on a deep black background, 3D rendered style, ethereal glow, high vibration energy.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    const candidates = (response as any).candidates;
    if (candidates && candidates[0] && candidates[0].content && candidates[0].content.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return undefined;
  } catch (error) {
    console.error("Image generation failed:", error);
    return undefined;
  }
};

export const getGuidance = async (currentStatus: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are the Ancient Spirit of the Grove. User status: ${currentStatus}. 
      
      Reflect deeply on the user's progress. Are they flowing? Are they stagnating?
      Combine Taoist philosophy with high-fantasy lore.
      Give a short (20 words max), profound guidance to re-center their spirit.
      Avoid generic encouragement. Be cryptic but comforting.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: "You are a gentle, high-vibration Dungeon Master for a Life-RPG. Use Zen and High-Fantasy metaphors."
      }
    });
    return response.text;
  } catch (error) {
    return "The forest whispers: stay present, seeker.";
  }
};

export const getMuseGift = async (energyLevel: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `You are a Muse Spirit in the form of a Crystal Fox. The user's energy level is ${energyLevel}/100.
      
      Generate a small "Gift" for the user.
      - If energy is high (>70): Give a 'Spark' (A creative prompt).
      - If energy is low (<40): Give a 'Memory' (Remind them of a past strength) or a 'Shield' (Comforting thought).
      - Otherwise: Give a 'Fragment' (A tiny piece of poetic lore).
      
      Respond only with JSON.`,
      config: {
        thinkingConfig: { thinkingBudget: 16384 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
             type: { type: Type.STRING, enum: ['SPARK', 'MEMORY', 'SHIELD', 'FRAGMENT'] },
             content: { type: Type.STRING }
          },
          required: ["type", "content"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { type: 'FRAGMENT', content: 'The fox nudges your hand, purring softly.' };
  }
};
