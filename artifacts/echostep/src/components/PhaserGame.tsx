import { useEffect, useRef } from "react";
import Phaser from "phaser";

import EchoStepScene from "@/game/EchoStepScene";

type PhaserGameProps = {
  onVictory: () => void;
};

export default function PhaserGame({ onVictory }: PhaserGameProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onVictoryRef = useRef(onVictory);

  useEffect(() => {
    onVictoryRef.current = onVictory;
  }, [onVictory]);

  useEffect(() => {
    if (!mountRef.current) return;

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mountRef.current,
      width: 960,
      height: 540,
      backgroundColor: "#160c2b",
      pixelArt: true,
      antialias: false,
      audio: {
        noAudio: true,
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 1_450 },
          debug: false,
        },
      },
      scene: [EchoStepScene],
    });

    const debugWindow = window as typeof window & { __ECHOSTEP_GAME__?: Phaser.Game };
    if (import.meta.env.DEV) debugWindow.__ECHOSTEP_GAME__ = game;
    const handleVictory = () => onVictoryRef.current();
    game.events.on("echostep-victory", handleVictory);

    return () => {
      game.events.off("echostep-victory", handleVictory);
      if (debugWindow.__ECHOSTEP_GAME__ === game) {
        delete debugWindow.__ECHOSTEP_GAME__;
      }
      game.destroy(true);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="echostep-phaser"
      data-testid="game-canvas"
      role="img"
      aria-label="EchoStep platform game. Use A and D or the arrow keys to move, and Space to jump."
    />
  );
}
