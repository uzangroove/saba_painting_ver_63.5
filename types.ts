
export enum EnvironmentType { 
  GROUND = 'GROUND', 
  WATER = 'WATER', 
  AIR = 'AIR', 
  SPACE = 'SPACE', 
  VOID = 'VOID' 
}

export interface EnvironmentConfig {
  name: string;
  backgroundColor: string;
  fogColor: string;
  fogDensity: number;
  ambientIntensity: number;
  accentColor: string;
  gravity: [number, number, number];
  allowFlight: boolean;
  description: string;
  linearDamping: number;
}
