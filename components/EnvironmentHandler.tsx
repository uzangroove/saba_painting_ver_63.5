
import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EnvironmentConfig } from '../types';

interface EnvironmentHandlerProps {
  config: EnvironmentConfig;
}

const EnvironmentHandler: React.FC<EnvironmentHandlerProps> = ({ config }) => {
  const { scene } = useThree();

  useEffect(() => {
    // Update Scene Background
    scene.background = new THREE.Color(config.backgroundColor);
    
    // Update Scene Fog
    // We use exponential squared fog for more natural transitions
    scene.fog = new THREE.FogExp2(config.fogColor, config.fogDensity);

    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [config, scene]);

  return null;
};

export default EnvironmentHandler;
