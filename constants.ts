import Matter from 'matter-js';
import { EnvironmentType, EnvironmentConfig } from './types';

// הגדרת המנוע כאן מונעת את קריסת המשחק
export const physicsEngine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });

export const ENVIRONMENTS: Record<EnvironmentType, EnvironmentConfig> = {
  [EnvironmentType.GROUND]: { 
    name: 'אדמה', backgroundColor: '#3d5a2c', fogColor: '#2d4021', fogDensity: 0.05, 
    ambientIntensity: 0.8, accentColor: '#8b4513', gravity: [0, -9.81, 0], 
    allowFlight: false, description: 'עולם האדמה המוצק', linearDamping: 0.1
  },
  [EnvironmentType.WATER]: { 
    name: 'מים', backgroundColor: '#002b36', fogColor: '#001a20', fogDensity: 0.15, 
    ambientIntensity: 0.4, accentColor: '#00ffff', gravity: [0, -1.5, 0], 
    allowFlight: true, description: 'מעמקי הים הכחולים', linearDamping: 0.5
  },
  // ... שאר הסביבות שלך מהקובץ הקיים ...
  [EnvironmentType.AIR]: { name: 'שמיים', backgroundColor: '#87ceeb', fogColor: '#e0f7fa', fogDensity: 0.02, ambientIntensity: 1.2, accentColor: '#ffffff', gravity: [0, 0, 0], allowFlight: true, description: 'מרומי השמיים הפתוחים', linearDamping: 0.02 },
  [EnvironmentType.SPACE]: { name: 'חלל', backgroundColor: '#050505', fogColor: '#000000', fogDensity: 0.005, ambientIntensity: 0.2, accentColor: '#6a0dad', gravity: [0, 0, 0], allowFlight: true, description: 'מרחבי החלל האינסופיים', linearDamping: 0.01 },
  [EnvironmentType.VOID]: { name: 'ריק', backgroundColor: '#1a1a1a', fogColor: '#000000', fogDensity: 0.08, ambientIntensity: 0.5, accentColor: '#ff0055', gravity: [0, -4, 0], allowFlight: false, description: 'הריק המוחלט', linearDamping: 0.05 }
};

export const getEnvironmentForLevel = (l: number): EnvironmentType => {
  if (l <= 10) return EnvironmentType.GROUND;
  if (l <= 20) return EnvironmentType.WATER;
  if (l <= 30) return EnvironmentType.AIR;
  if (l <= 40) return EnvironmentType.SPACE;
  return EnvironmentType.VOID;
};

const GITHUB_BASE_URL = "https://raw.githubusercontent.com/uzangroove/game_assets/main/";
export const MONSTER_NAMES = Array.from({ length: 14 }, (_, i) => `monster${i + 1}`);
export const MONSTER_URLS = MONSTER_NAMES.reduce((acc, name) => {
  acc[name] = `${GITHUB_BASE_URL}${name}.obj`;
  return acc;
}, {} as Record<string, string>);

export const getRandomMonsterName = () => {
  const randomIndex = Math.floor(Math.random() * MONSTER_NAMES.length);
  return MONSTER_NAMES[randomIndex];
};