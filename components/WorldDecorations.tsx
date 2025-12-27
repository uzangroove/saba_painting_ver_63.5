
import React from 'react';
import { RandomMonster } from './MonsterComponent';

export function WorldDecorations() {
  const monsterPositions = [
    [10, 0, -5],
    [-8, 0, -20],
    [15, 0, -40],
    [0, 0, -60],
  ];

  return (
    <group>
      {monsterPositions.map((pos, index) => (
        <RandomMonster key={index} position={pos as [number, number, number]} />
      ))}
    </group>
  );
}
