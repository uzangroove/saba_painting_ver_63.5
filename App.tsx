import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MONSTER_URLS, getRandomMonsterName } from './constants';

export function RandomMonster({ position }: { position: [number, number, number] }) {
  // בוחרים שם רנדומלי פעם אחת כשהרכיב נוצר
  const monsterName = useMemo(() => getRandomMonsterName(), []);
  
  // טוענים את המודל ישירות מ-GitHub
  const obj = useLoader(OBJLoader, MONSTER_URLS[monsterName]);

  // משתמשים ב-clone כדי לאפשר הצגת מספר עותקים של אותה מפלצת
  const clonedObj = useMemo(() => obj.clone(), [obj]);

  return <primitive object={clonedObj} position={position} scale={0.5} />;
}