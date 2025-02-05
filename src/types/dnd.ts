export interface DndEntity {
  id: string;
  name: string;
  type: string;
  source: string;
  description?: string;
}

export interface Character extends DndEntity {
  class: string;
  level: number;
  race: string;
  alignment: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

export interface Spell extends DndEntity {
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string[];
  duration: string;
  classes: string[];
}

export interface Item extends DndEntity {
  rarity: string;
  category: string;
  attunement: boolean;
  cost?: string;
  weight?: string;
}