import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows } from '@react-three/drei';
import Matter from 'matter-js';
import { User, Gem } from 'lucide-react';

// ייבוא המנוע מהקבועים במקום להגדיר אותו כאן
import { getEnvironmentForLevel, ENVIRONMENTS, physicsEngine } from './constants';
import PlayerCharacter from './components/PlayerCharacter';
import EnvironmentHandler from './components/EnvironmentHandler';
import { WorldDecorations } from './components/WorldDecorations';
import ParallaxBackground from './components/ParallaxBackground';
import Monster from './components/Monster';

const App: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [diamonds, setDiamonds] = useState(0);

  const envType = getEnvironmentForLevel(level);
  const config = ENVIRONMENTS[envType];

  useEffect(() => {
    physicsEngine.gravity.y = config.gravity[1] !== 0 ? 0.05 : 0; 
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, physicsEngine);
    return () => Matter.Runner.stop(runner);
  }, [config]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas shadows camera={{ position: [0, 15, 25], fov: 45 }}>
        {/* Suspense מחכה לטעינה מגיטהאב. אם הקישור שבור, המסך ישאר שחור */}
        <Suspense fallback={null}>
          <EnvironmentHandler type={envType} />
          <ambientLight intensity={config.ambientIntensity} />
          <directionalLight position={[10, 20, 10]} castShadow intensity={1.5} />
          
          <PlayerCharacter 
            type={envType} 
            allowFlight={config.allowFlight} 
            onCollideMonster={() => setDiamonds(d => Math.max(0, d - 5))}
          />

          <ParallaxBackground type={envType} />

          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color={config.accentColor} opacity={0.3} transparent />
          </mesh>

          <WorldDecorations />
          <Sky sunPosition={[100, 20, 100]} />
          <ContactShadows opacity={0.4} scale={50} blur={2} far={4.5} />
        </Suspense>
      </Canvas>

      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4 text-white">
            <User className="text-orange-500" />
            <div>
              <div className="text-xl font-bold">המסע של שמעון</div>
              <div className="text-xs">שלב {level} • {config.name}</div>
            </div>
          </div>
          <div className="bg-blue-600/50 p-3 rounded-xl border border-blue-400/30 flex items-center gap-3 text-white">
            <Gem className="text-blue-300 w-5 h-5" />
            <div className="text-2xl font-black">{diamonds}</div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default App;