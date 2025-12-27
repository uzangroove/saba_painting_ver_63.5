import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import Matter from 'matter-js';
import { useControls } from '../hooks/useControls';
import { EnvironmentType } from '../types';
import AssetModel from './AssetModel';
import { physicsEngine } from '../constants';

interface PlayerCharacterProps {
  type: EnvironmentType;
  allowFlight: boolean;
  onCollideMonster: () => void;
}

const PlayerCharacter: React.FC<PlayerCharacterProps> = ({ type, allowFlight, onCollideMonster }) => {
  const controls = useControls();
  const { camera } = useThree();
  const [isHitVisual, setIsHitVisual] = useState(false);
  const meshRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<Matter.Body | null>(null);

  useEffect(() => {
    const body = Matter.Bodies.circle(0, 0, 0.8, {
      frictionAir: 0.1,
      restitution: 0.5,
      label: 'player'
    });
    Matter.World.add(physicsEngine.world, body);
    bodyRef.current = body;

    const collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const labels = [pair.bodyA.label, pair.bodyB.label];
        if (labels.includes('player') && labels.includes('monster')) {
          onCollideMonster();
          setIsHitVisual(true);
          setTimeout(() => setIsHitVisual(false), 300);
        }
      });
    };

    Matter.Events.on(physicsEngine, 'collisionStart', collisionHandler);

    return () => {
      Matter.World.remove(physicsEngine.world, body);
      Matter.Events.off(physicsEngine, 'collisionStart', collisionHandler);
    };
  }, []);

  useFrame(() => {
    if (!bodyRef.current || !meshRef.current) return;

    const { forward, backward, left, right, up, down } = controls;
    const force = allowFlight ? 0.002 : 0.005;
    
    // Apply movement forces
    if (forward) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: 0, y: -force });
    if (backward) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: 0, y: force });
    if (left) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: -force, y: 0 });
    if (right) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: force, y: 0 });

    // Sync Three.js mesh with Matter.js body
    meshRef.current.position.x = bodyRef.current.position.x;
    meshRef.current.position.z = bodyRef.current.position.y;
    meshRef.current.position.y = 0.8;

    // Smooth camera follow
    const targetPos = new THREE.Vector3(meshRef.current.position.x, 0, meshRef.current.position.z);
    const cameraOffset = new THREE.Vector3(0, 12, 12);
    const cameraTarget = targetPos.clone().add(cameraOffset);
    camera.position.lerp(cameraTarget, 0.1);
    camera.lookAt(targetPos);
  });

  return (
    <group ref={meshRef}>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        outlineWidth={0.05}
        outlineColor="black"
      >
        סבא שמעון
      </Text>

      <mesh castShadow>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color={isHitVisual ? "red" : "#ff9800"} visible={false} />
      </mesh>

      <AssetModel 
        url="saba_shimon.glb" 
        placeholderColor={isHitVisual ? "red" : "#ffcc80"} 
        placeholderScale={1.5}
      />

      <pointLight distance={5} intensity={isHitVisual ? 2 : 1} color={isHitVisual ? "red" : "white"} position={[0, 1, 0]} />
    </group>
  );
};

export default PlayerCharacter;