import React, { useMemo } from 'react';
import { RandomMonster } from './MonsterComponent'; // הקומפוננטה שיצרנו קודם

export function WorldDecorations() {
  // נגדיר רשימת מיקומים שבהם נרצה להציב מפלצות
  const monsterPositions = [
    [10, 0, -5],
    [-8, 0, -20],
    [15, 0, -40],
    [0, 0, -60],
  ];

  return (
    <group>
      {monsterPositions.map((pos, index) => (
        // כל מפלצת תיבחר רנדומלית מתוך ה-14 ב-GitHub בזמן הטעינה
        <RandomMonster key={index} position={pos as [number, number, number]} />
      ))}
    </group>
  );
}