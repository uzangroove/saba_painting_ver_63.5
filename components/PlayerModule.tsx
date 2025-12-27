
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshWobbleMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

interface PlayerModuleProps {
  accentColor: string;
}

const PlayerModule: React.FC<PlayerModuleProps> = ({ accentColor }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1, 0]} />
        <MeshWobbleMaterial 
          color={accentColor} 
          speed={1} 
          factor={0.6} 
          roughness={0} 
          emissive={accentColor}
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
};

export default PlayerModule;
