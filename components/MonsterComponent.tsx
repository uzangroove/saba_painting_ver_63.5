
import React, { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MONSTER_URLS, getRandomMonsterName } from '../constants';

export function RandomMonster({ position }: { position: [number, number, number] }) {
  const monsterName = useMemo(() => getRandomMonsterName(), []);
  
  // נסיון טעינה בטוח
  try {
    const obj = useLoader(OBJLoader, MONSTER_URLS[monsterName]);
    const clonedObj = useMemo(() => obj.clone(), [obj]);
    return <primitive object={clonedObj} position={position} scale={0.5} />;
  } catch (e) {
    return (
      <mesh position={position}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
    );
  }
}
