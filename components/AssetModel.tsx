import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AssetModelProps {
  url: string;
  placeholderColor: string;
  placeholderScale?: number;
  scale?: number;
  rotation?: [number, number, number];
}

const Placeholder = ({ color, scale = 1 }: { color: string, scale?: number }) => (
  <mesh scale={scale}>
    <sphereGeometry args={[0.5, 16, 16]} />
    <meshStandardMaterial color={color || "#ffffff"} wireframe transparent opacity={0.5} />
  </mesh>
);

// Inner component to safely use the useGLTF hook
const SafeModel = ({ url, scale, rotation }: { url: string, scale: number, rotation: [number, number, number] }) => {
  // Since the files might not exist on the server, useGLTF might fail.
  // In a real environment, we'd use an ErrorBoundary. 
  // For now, we assume if it reaches here, we attempt the load.
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={[scale, scale, scale]} rotation={rotation} />;
};

const AssetModel: React.FC<AssetModelProps> = ({ 
  url, 
  placeholderColor, 
  placeholderScale = 1, 
  scale = 1, 
  rotation = [0, 0, 0] 
}) => {
  // Simple check to avoid calling hooks with obviously fake/missing URLs
  // This prevents Three.js from attempting to 'replace' strings on undefined/empty paths
  const isValidUrl = url && typeof url === 'string' && url.includes('.');

  if (!isValidUrl) {
    return <Placeholder color={placeholderColor} scale={placeholderScale} />;
  }

  return (
    <Suspense fallback={<Placeholder color={placeholderColor} scale={placeholderScale} />}>
      <SafeModel 
        url={url} 
        scale={scale} 
        rotation={rotation || [0, 0, 0]} 
      />
    </Suspense>
  );
};

export default AssetModel;