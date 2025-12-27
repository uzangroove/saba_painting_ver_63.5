
import React, { useMemo, Suspense, useEffect, useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Matter from 'matter-js';
import * as THREE from 'three';
import { MONSTER_URLS, getRandomMonsterName, physicsEngine } from '../constants';

function MonsterModel({ url, position }: { url: string, position: [number, number, number] }) {
  const obj = useLoader(OBJLoader, url);
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

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={clonedObj} scale={0.015} />
      <pointLight position={[0, 1, 0]} intensity={0.5} color="#ff4444" distance={3} />
    </group>
  );
}

const MonsterPlaceholder = ({ position }: { position: [number, number, number] }) => (
  <mesh position={[0, 0, 0]}>
    <sphereGeometry args={[0.8, 8, 8]} />
    <meshStandardMaterial color="#ff4444" wireframe />
  </mesh>
);

export function RandomMonster({ position }: { position: [number, number, number] }) {
  const monsterName = useMemo(() => getRandomMonsterName(), []);
  const url = MONSTER_URLS[monsterName];

  useEffect(() => {
    const body = Matter.Bodies.circle(position[0], position[2], 1.2, {
      isStatic: true,
      label: 'monster'
    });
    Matter.World.add(physicsEngine.world, body);
    
    // Fix: Ensure cleanup function returns void. Matter.World.remove returns a Composite.
    return () => {
      Matter.World.remove(physicsEngine.world, body);
    };
  }, [position]);

  return (
    <group position={position}>
      <Suspense fallback={<MonsterPlaceholder position={position} />}>
        <MonsterModel url={url} position={position} />
      </Suspense>
    </group>
  );
}
