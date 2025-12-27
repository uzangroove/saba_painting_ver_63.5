
import React from 'react';
import { Stars, Cloud, Sparkles, Float } from '@react-three/drei';
import { EnvironmentType } from '../constants';

const Decor = ({ type }: { type: EnvironmentType }) => {
  switch (type) {
    case EnvironmentType.SPACE: return <><Stars radius={100} count={5000} /><Sparkles count={100} scale={50} /></>;
    case EnvironmentType.AIR: return <><Cloud position={[-10, 10, -20]} scale={5} /><Cloud position={[10, 8, -30]} scale={3} /><Sparkles count={50} scale={40} /></>;
    case EnvironmentType.WATER: return <Sparkles count={400} scale={30} color="#00ffff" />;
    case EnvironmentType.GROUND: return <Sparkles count={100} scale={30} color="#fbbf24" />;
    default: return null;
  }
};
export default Decor;
