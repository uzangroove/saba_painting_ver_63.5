
import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import Matter from 'matter-js';
import * as THREE from 'three';
import AssetModel from './AssetModel';
import { physicsEngine } from '../App';

interface MonsterProps {
  id: string;
  position: [number, number, number];
  onDefeat: (id: string) => void;
}

const Monster: React.FC<MonsterProps> = ({ id, position, onDefeat }) => {
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    // Three XZ -> Matter XY
    const body = Matter.Bodies.circle(position[0], position[2], 1, {
      frictionAir: 0.05,
      label: 'monster'
    });
    Matter.World.add(physicsEngine.world, body);
    bodyRef.current = body;

    return () => {
      Matter.World.remove(physicsEngine.world, body);
    };
  }, [position]);

  useFrame(() => {
    if (bodyRef.current && meshRef.current) {
      meshRef.current.position.x = bodyRef.current.position.x;
      meshRef.current.position.z = bodyRef.current.position.y;
      meshRef.current.position.y = 1;
      
      // Floating animation
      meshRef.current.position.y += Math.sin(Date.now() * 0.005) * 0.2;
    }
  });

  return (
    <group 
      ref={meshRef} 
      onClick={(e) => {
        e.stopPropagation();
        onDefeat(id);
      }}
      onPointerOver={() => {
        const doc = (window as any).document;
        if (doc) doc.body.style.cursor = 'crosshair';
      }}
      onPointerOut={() => {
        const doc = (window as any).document;
        if (doc) doc.body.style.cursor = 'default';
      }}
    >
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color="#ff4444"
        anchorX="center"
      >
        מפלצת!
      </Text>

      <mesh castShadow>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#880000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>

      <AssetModel 
        url="monsters.glb" 
        placeholderColor="#ff3333" 
        placeholderScale={1.5}
        scale={1} 
      />
      <pointLight distance={4} intensity={1} color="red" position={[0, 1, 0]} />
    </group>
  );
};

export default Monster;
