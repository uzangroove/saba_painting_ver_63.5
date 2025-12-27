
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import Matter from 'matter-js';
import { useControls } from '../hooks/useControls';
import { EnvironmentType } from '../types';
import AssetModel from './AssetModel';
import { physicsEngine } from '../App';

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
    // Create Matter.js body for player
    const body = Matter.Bodies.circle(0, 0, 0.8, {
      frictionAir: 0.1,
      restitution: 0.5,
      label: 'player'
    });
    Matter.World.add(physicsEngine.world, body);
    bodyRef.current = body;

    // Handle collisions manually since Matter doesn't have a built-in event dispatcher per body in this simple setup
    const collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        if (pair.bodyA.label === 'player' && pair.bodyB.label === 'monster' || 
            pair.bodyB.label === 'player' && pair.bodyA.label === 'monster') {
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

    const { forward, backward, left, right } = controls;
    const force = 0.005;
    
    // Apply movement forces based on keys
    if (forward) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: 0, y: -force });
    if (backward) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: 0, y: force });
    if (left) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: -force, y: 0 });
    if (right) Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, { x: force, y: 0 });

    // Sync Three.js mesh with Matter.js body
    // Matter XY -> Three XZ
    meshRef.current.position.x = bodyRef.current.position.x;
    meshRef.current.position.z = bodyRef.current.position.y;
    meshRef.current.position.y = 0.8; // Fixed height for 2D platformer style

    // Camera follow logic (Smooth)
    const targetPos = new THREE.Vector3(meshRef.current.position.x, 0, meshRef.current.position.z);
    const cameraTarget = targetPos.clone().add(new THREE.Vector3(0, 15, 20));
    camera.position.lerp(cameraTarget, 0.05);
    camera.lookAt(targetPos);
  });

  return (
    <group ref={meshRef}>
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        outlineWidth={0.05}
      >
        סבא שמעון
      </Text>

      <mesh castShadow>
        <boxGeometry args={[1, 1.5, 1]} />
        <meshStandardMaterial color={isHitVisual ? "red" : "#ff9800"} />
      </mesh>

      <AssetModel 
        url="saba_shimon.glb" 
        placeholderColor="#ffcc80" 
        placeholderScale={1.5}
      />

      <pointLight distance={5} intensity={1} color={isHitVisual ? "red" : "white"} position={[0, 1, 0]} />
    </group>
  );
};

export default PlayerCharacter;
