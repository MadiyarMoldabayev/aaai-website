import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { MainScene } from './scenes/MainScene';

export const PhaserGame = () => {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 }, // Top down, no gravity
          debug: false,
        },
      },
      scene: [MainScene],
      backgroundColor: '#2d2d2d',
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={gameRef} id="phaser-game" className="rounded-lg overflow-hidden shadow-2xl" />;
};

