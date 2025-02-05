import { DndEntity, Character, Spell, Item } from '../types/dnd';

export function cleanData<T extends DndEntity>(rawData: any): T {
  // Remove HTML tags
  const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '');
  
  // Basic sanitization
  const sanitizeString = (str: string) => {
    if (!str) return '';
    return stripHtml(str.trim());
  };

  // Process common fields
  const cleanedData = {
    id: rawData.id || crypto.randomUUID(),
    name: sanitizeString(rawData.name),
    type: sanitizeString(rawData.type),
    source: sanitizeString(rawData.source),
    description: sanitizeString(rawData.description)
  };

  return cleanedData as T;
}

export function processCharacter(rawData: any): Character {
  const baseData = cleanData<Character>(rawData);
  return {
    ...baseData,
    class: rawData.class || '',
    level: parseInt(rawData.level) || 1,
    race: rawData.race || '',
    alignment: rawData.alignment || '',
    abilities: {
      strength: parseInt(rawData.strength) || 10,
      dexterity: parseInt(rawData.dexterity) || 10,
      constitution: parseInt(rawData.constitution) || 10,
      intelligence: parseInt(rawData.intelligence) || 10,
      wisdom: parseInt(rawData.wisdom) || 10,
      charisma: parseInt(rawData.charisma) || 10
    }
  };
}

export function formatForLLM(data: DndEntity[]): string {
  return data.map(item => `
    Name: ${item.name}
    Type: ${item.type}
    Description: ${item.description || 'No description available'}
    Source: ${item.source}
    ---
  `).join('\n');
}