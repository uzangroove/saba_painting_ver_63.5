
import { useState, useEffect } from 'react';

export const useControls = () => {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
  });

  useEffect(() => {
    // Fix: Cast event to any to access 'code' property when DOM types are incomplete in the environment
    const handleKeyDown = (e: any) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: true })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: true })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: true })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: true })); break;
        case 'Space': setMovement(m => ({ ...m, up: true, jump: true })); break;
        case 'ShiftLeft': setMovement(m => ({ ...m, down: true })); break;
      }
    };

    // Fix: Cast event to any to access 'code' property when DOM types are incomplete in the environment
    const handleKeyUp = (e: any) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': setMovement(m => ({ ...m, forward: false })); break;
        case 'KeyS': case 'ArrowDown': setMovement(m => ({ ...m, backward: false })); break;
        case 'KeyA': case 'ArrowLeft': setMovement(m => ({ ...m, left: false })); break;
        case 'KeyD': case 'ArrowRight': setMovement(m => ({ ...m, right: false })); break;
        case 'Space': setMovement(m => ({ ...m, up: false, jump: false })); break;
        case 'ShiftLeft': setMovement(m => ({ ...m, down: false })); break;
      }
    };

    // Fix: Cast window to any to access event listener methods when DOM types are incomplete
    (window as any).addEventListener('keydown', handleKeyDown);
    (window as any).addEventListener('keyup', handleKeyUp);
    return () => {
      (window as any).removeEventListener('keydown', handleKeyDown);
      (window as any).removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return movement;
};