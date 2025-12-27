
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
// Fix: EnvironmentType is defined and exported from types.ts, not constants.ts
import { EnvironmentType } from '../types';

const Layer = ({ f, d, children }: any) => {
  const r = useRef<THREE.Group>(null);
  useFrame((s) => { if (r.current) { r.current.position.x = s.camera.position.x * f; r.current.position.z = s.camera.position.z * f; } });
  return <group ref={r} position={[0, d, 0]}>{children}</group>;
};

export default function Parallax({ type }: { type: EnvironmentType }) {
  const config = {
    [EnvironmentType.GROUND]: [{ f: 0.9, d: -20, c: '#1a2e13', n: 10 }],
    [EnvironmentType.WATER]: [{ f: 0.8, d: -30, c: '#001a20', n: 15 }],
    [EnvironmentType.AIR]: [{ f: 0.95, d: -25, c: '#e0f2fe', n: 8 }],
    [EnvironmentType.SPACE]: [{ f: 0.99, d: -40, c: '#1e1b4b', n: 5 }]
  }[type] || [];

  return (
    <group>
      {config.map((l, i) => (
        <Layer key={i} f={l.f} d={l.d}>
          {Array.from({ length: l.n }).map((_, j) => (
            <Float key={j} position={[(Math.random()-0.5)*150, 0, (Math.random()-0.5)*150]}>
              <mesh rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <MeshDistortMaterial color={l.c} speed={0.5} distort={0.2} transparent opacity={0.4} depthWrite={false} />
              </mesh>
            </Float>
          ))}
        </Layer>
      ))}
    </group>
  );
}
