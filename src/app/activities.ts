// Tipos para las actividades
export type ActivityId = 1 | 2 | 3 | 4 | 5;
export type ActivityKind = 'sandwich' | 'plant' | 'route' | 'debug' | 'builder';
export type SandwichStepId = 'bread' | 'lettuce' | 'cheese' | 'close';
export type PlantAction = 'plant' | 'water' | 'sun';
export type RouteMove = 'right' | 'up' | 'left' | 'down';
export type PackingStep = 'apple' | 'water' | 'close';
export type FinalBlock = 'right' | 'up' | 'left' | 'down' | 'collect' | 'plant';
export type FinalResource = 'water' | 'sun' | 'soil';

export interface ActivityReward {
  experience: number;
  seeds: number;
}

export interface ActivityDefinition {
  id: ActivityId;
  kind: ActivityKind;
  reward?: ActivityReward;
}

const standardReward: ActivityReward = { experience: 10, seeds: 1 };

export const WORLD_ONE_ACTIVITIES: readonly ActivityDefinition[] = [
  { id: 1, kind: 'sandwich', reward: standardReward },
  { id: 2, kind: 'plant', reward: standardReward },
  { id: 3, kind: 'route', reward: standardReward },
  { id: 4, kind: 'debug', reward: standardReward },
  { id: 5, kind: 'builder', reward: standardReward },
];

export const SANDWICH_STEPS: Readonly<Record<SandwichStepId, string>> = {
  bread: '🍞',
  lettuce: '🥬',
  cheese: '🧀',
  close: '🥪',
};

export const SANDWICH_CORRECT_ORDER: readonly string[] = ['🍞', '🥬', '🧀', '🥪'];
export const PLANT_GROWTH_ORDER: readonly PlantAction[] = ['plant', 'water', 'sun'];
export const NORI_HOME_ROUTE: readonly RouteMove[] = ['up', 'up', 'right', 'right', 'right'];
export const PACKING_INITIAL_ORDER: readonly PackingStep[] = ['apple', 'close', 'water'];
export const PACKING_CORRECT_ORDER: readonly PackingStep[] = ['apple', 'water', 'close'];
export const FINAL_ALGORITHM_ORDER: readonly FinalBlock[] = ['right', 'right', 'up', 'collect'];

// Reto final: recoger Agua 💧, Luz ☀️ y Tierra 🌱 y plantar en la semilla mágica
export const FINAL_RESOURCE_EMOJI: Readonly<Record<FinalResource, string>> = {
  water: '💧',
  sun: '☀️',
  soil: '🌱',
};

export const FINAL_RESOURCE_LABEL: Readonly<Record<FinalResource, string>> = {
  water: 'Agua',
  sun: 'Luz',
  soil: 'Tierra',
};

// Etapas de crecimiento de la semilla gigante al completar el reto
export const SEED_GROWTH_STAGES: readonly string[] = ['🌱', '🌿', '🌳', '🌲'];
