import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, ContactShadows } from '@react-three/drei';
import Matter from 'matter-js';
import { User, Gem } from 'lucide-react';

import { getEnvironmentForLevel, ENVIRONMENTS } from './constants';
import PlayerCharacter from './components/PlayerCharacter';
import EnvironmentHandler from './components/EnvironmentHandler';
import { WorldDecorations } from './components/WorldDecorations';
import ParallaxBackground from './components/ParallaxBackground';
import Monster from './components/Monster';

// ייצוא מנוע הפיזיקה עבור רכיבי הילדים (כמו המפלצות)
export const physicsEngine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });

const App: React.FC = () => {
  const [level, setLevel] = useState(1);
  const [diamonds, setDiamonds] = useState(0);
  const [monstersDefeated, setMonstersDefeated] = useState(0);

  const envType = getEnvironmentForLevel(level);
  const config = ENVIRONMENTS[envType];

  // 1. ניהול הראנר של מנוע הפיזיקה
  useEffect(() => {
    physicsEngine.gravity.y = config.gravity[1] !== 0 ? 0.05 : 0; 
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, physicsEngine);
    return () => {
      Matter.Runner.stop(runner);
    };
  }, [config]);

  // 2. לוגיקת זיהוי התנגשויות (מפלצות/יהלומים)
  useEffect(() => {
    const handleCollision = (event: Matter.IEventCollision<Matter.Engine>) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        
        // בדיקה אם הייתה התנגשות בין שחקן למפלצת
        const isPlayerMonster = 
          (bodyA.label === 'player' && bodyB.label === 'monster') ||
          (bodyB.label === 'player' && bodyA.label === 'monster');

        if (isPlayerMonster) {
          setDiamonds(prev => Math.max(0, prev - 5)); // הורדת 5 יהלומים
          console.log("סבא שמעון נפגע!");
        }
      });
    };

    Matter.Events.on(physicsEngine, 'collisionStart', handleCollision);
    return () => Matter.Events.off(physicsEngine, 'collisionStart', handleCollision);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden font-sans">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <EnvironmentHandler type={envType} />
          
          <PlayerCharacter 
            position={[0, 0, 0]} 
            onCollectGem={() => setDiamonds(d => d + 1)}
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

      {/* HUD UI - ממשק המשתמש */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between" dir="rtl">
        <header className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <User className="text-orange-500" />
            <div>
              <div className="text-xl font-black text-white">המסע של שמעון</div>
              <div className="text-xs text-orange-200">שלב {level} • {config.name}</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-blue-600/50 backdrop-blur-md p-3 rounded-xl border border-white/20 flex items-center gap-3">
              <Gem className="text-cyan-300 animate-pulse" />
              <span className="text-2xl font-bold text-white">{diamonds}</span>
            </div>
          </div>
        </header>

        <footer className="flex justify-center pb-8 pointer-events-auto">
          <div className="bg-white/10 backdrop-blur-lg px-8 py-4 rounded-full border border-white/20 text-white/70 text-sm">
            השתמש במקשי החיצים כדי להזיז את סבא שמעון
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;