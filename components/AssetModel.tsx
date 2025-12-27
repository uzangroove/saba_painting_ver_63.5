
import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

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

const SafeModel = ({ url, scale, rotation }: { url: string, scale: number, rotation: [number, number, number] }) => {
  // נסיון טעינה; אם הקובץ לא קיים, Suspense יציג את ה-Fallback
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
  // בדיקה אם ה-URL נראה תקין (סיומת glb/gltf)
  const isPossiblyValid = url && (url.endsWith('.glb') || url.endsWith('.gltf'));

  if (!isPossiblyValid) {
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