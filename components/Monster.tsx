import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { MONSTER_URLS, getRandomMonsterName } from './constants';

export function AnimatedMonster({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // בחירת מפלצת רנדומלית פעם אחת בלבד
  const monsterName = useMemo(() => getRandomMonsterName(), []);
  
  // טעינת המודל מ-GitHub
  const obj = useLoader(OBJLoader, MONSTER_URLS[monsterName]);

  // יצירת עותק ייחודי למפלצת הזו
  const clonedObj = useMemo(() => obj.clone(), [obj]);

  // לוגיקת האנימציה - רצה בכל פריים (60 פעמים בשנייה)
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. תנועת ציפה (למעלה-למטה) באמצעות סינוס
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;

    // 2. סיבוב עדין סביב עצמה
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <primitive 
      ref={meshRef} 
      object={clonedObj} 
      position={position} 
      scale={0.5} 
    />
  );
}