import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import Matter from 'matter-js';
import { MONSTER_URLS, getRandomMonsterName } from '../constants';
import { physicsEngine } from '../App'; // ייבוא מנוע הפיזיקה מהקובץ הראשי

interface MonsterProps {
  position: [number, number, number];
}

const Monster: React.FC<MonsterProps> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null);
  const monsterName = useMemo(() => getRandomMonsterName(), []);
  const obj = useLoader(OBJLoader, MONSTER_URLS[monsterName]);

  // יצירת גוף פיזיקלי למפלצת במנוע ה-Matter.js
  const monsterBody = useMemo(() => {
    return Matter.Bodies.circle(position[0], position[2], 1, {
      isSensor: true, // חיישן שלא דוחף את השחקן אלא רק מזהה מגע
      label: 'monster'
    });
  }, [position]);

  useEffect(() => {
    // הוספת הגוף למנוע הפיזיקה כשהמפלצת נוצרת
    Matter.World.add(physicsEngine.world, monsterBody);
    return () => {
      // הסרת הגוף כשהמפלצת נמחקה
      Matter.World.remove(physicsEngine.world, monsterBody);
    };
  }, [monsterBody]);

  const clonedObj = useMemo(() => {
    const clone = obj.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [obj]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    
    // תנועת הציפה בתלת-ממד
    meshRef.current.position.y = position[1] + Math.sin(t + position[0]) * 0.15;
    meshRef.current.rotation.y += 0.01;

    // עדכון המיקום במנוע הפיזיקה (בדו-ממד X ו-Z)
    Matter.Body.setPosition(monsterBody, { 
      x: meshRef.current.position.x, 
      y: meshRef.current.position.z 
    });
  });

  return (
    <group ref={meshRef} position={position}>
      <primitive object={clonedObj} scale={0.02} />
      <pointLight position={[0, 1, 0]} intensity={0.5} color="#ff4444" distance={3} />
    </group>
  );
};

export default Monster;