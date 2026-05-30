import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MiniGameProps {
  gameTitle: string;
  onClose: () => void;
}

const MiniGame: React.FC<MiniGameProps> = ({ gameTitle, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover" | "victory">("start");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem("marnay_minigame_highscore");
    return saved ? parseInt(saved, 10) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Web Audio Context for procedurally generated synth sounds!
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playProceduralSound = useCallback((type: "shoot" | "explosion" | "hit" | "victory" | "gameover") => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const CustomAudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (CustomAudioCtx) {
          audioCtxRef.current = new CustomAudioCtx();
        }
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === "shoot") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === "explosion") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "hit") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === "victory") {
        // Arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const noteOsc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(ctx.destination);

          noteOsc.type = "sine";
          noteOsc.frequency.setValueAtTime(freq, now + idx * 0.12);
          noteGain.gain.setValueAtTime(0.2, now + idx * 0.12);
          noteGain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25);
          noteOsc.start(now + idx * 0.12);
          noteOsc.stop(now + idx * 0.12 + 0.25);
        });
      } else if (type === "gameover") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(60, now + 0.6);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch (e) {
      console.warn("Audio Context init error: ", e);
    }
  }, [soundEnabled]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    // Game Variables
    const player = {
      x: canvas.width / 2 - 15,
      y: canvas.height - 40,
      width: 30,
      height: 25,
      speed: 6,
      color: "#a855f7", // Purple neon
    };

    let lasers: { x: number; y: number; width: number; height: number; speed: number }[] = [];
    const enemies: { x: number; y: number; width: number; height: number; speed: number; points: number; health: number }[] = [];
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[] = [];

    // Controller Keys
    const keys: { [key: string]: boolean } = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      keys[e.code] = true;
      if (e.code === "Space") {
        e.preventDefault();
        fireLaser();
      }
      if (e.code === "ArrowLeft" || e.code === "ArrowRight" || e.code === "KeyA" || e.code === "KeyD") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Bullet Firing
    const fireLaser = () => {
      lasers.push({
        x: player.x + player.width / 2 - 2,
        y: player.y - 10,
        width: 4,
        height: 12,
        speed: 8,
      });
      playProceduralSound("shoot");
    };

    // Particles Explosion
    const createExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 12; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          radius: Math.random() * 3 + 1,
          color,
          alpha: 1,
        });
      }
      playProceduralSound("explosion");
    };

    // Enemy Wave Generator
    let lastSpawnTime = 0;
    const spawnEnemy = (timestamp: number) => {
      if (timestamp - lastSpawnTime > 1500) {
        enemies.push({
          x: Math.random() * (canvas.width - 30),
          y: -20,
          width: 25,
          height: 25,
          speed: 1.5 + Math.random() * 1.5,
          points: 10,
          health: 1,
        });
        lastSpawnTime = timestamp;
      }
    };

    // Initialize enemies
    for (let i = 0; i < 5; i++) {
      enemies.push({
        x: 40 + i * 80 + Math.random() * 20,
        y: 40 + Math.random() * 60,
        width: 25,
        height: 25,
        speed: 1.2,
        points: 10,
        health: 1,
      });
    }

    let gameScore = 0;

    // Core Loop
    const update = (timestamp: number) => {
      // 1. Move Player
      if (keys["ArrowLeft"] || keys["KeyA"]) {
        player.x = Math.max(0, player.x - player.speed);
      }
      if (keys["ArrowRight"] || keys["KeyD"]) {
        player.x = Math.min(canvas.width - player.width, player.x + player.speed);
      }

      // 2. Spawn Enemies
      spawnEnemy(timestamp);

      // 3. Move Lasers
      lasers = lasers.filter((laser) => {
        laser.y -= laser.speed;
        return laser.y > -20;
      });

      // 4. Move Enemies
      enemies.forEach((enemy) => {
        enemy.y += enemy.speed;
      });

      // Check for Game Over (Enemies reach bottom or hit player)
      const hitBottom = enemies.some((enemy) => enemy.y > canvas.height);
      const hitPlayer = enemies.some((enemy) => {
        return (
          enemy.x < player.x + player.width &&
          enemy.x + enemy.width > player.x &&
          enemy.y < player.y + player.height &&
          enemy.y + enemy.height > player.y
        );
      });

      if (hitBottom || hitPlayer) {
        playProceduralSound("gameover");
        setGameState("gameover");
        return;
      }

      // 5. Check Collisions (Laser hits enemy)
      lasers.forEach((laser, lIdx) => {
        enemies.forEach((enemy, eIdx) => {
          if (
            laser.x < enemy.x + enemy.width &&
            laser.x + laser.width > enemy.x &&
            laser.y < enemy.y + enemy.height &&
            laser.y + laser.height > enemy.y
          ) {
            // Collision detected
            createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, "#ec4899"); // Pink neon
            enemies.splice(eIdx, 1);
            lasers.splice(lIdx, 1);
            gameScore += enemy.points;
            setScore(gameScore);
            setHighScore((prev) => {
              if (gameScore > prev) {
                localStorage.setItem("marnay_minigame_highscore", gameScore.toString());
                return gameScore;
              }
              return prev;
            });

            // Win condition (Reach 300 points)
            if (gameScore >= 350) {
              playProceduralSound("victory");
              setGameState("victory");
              return;
            }
          }
        });
      });

      // 6. Update Particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      // 7. Render Everything
      ctx.fillStyle = "#090d16"; // Dark slate board
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid lines for futuristic vibe
      ctx.strokeStyle = "rgba(139, 92, 246, 0.07)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Player Ship
      ctx.fillStyle = player.color;
      ctx.shadowColor = player.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(player.x + player.width / 2, player.y);
      ctx.lineTo(player.x + player.width, player.y + player.height);
      ctx.lineTo(player.x, player.y + player.height);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Draw Lasers
      ctx.fillStyle = "#67e8f9"; // Cyan neon lasers
      ctx.shadowColor = "#67e8f9";
      ctx.shadowBlur = 8;
      lasers.forEach((laser) => {
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
      });
      ctx.shadowBlur = 0;

      // Draw Enemies
      enemies.forEach((enemy) => {
        ctx.fillStyle = "#ec4899"; // Pink neon enemies
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 8;
        
        // Draw triangular/alien ship
        ctx.beginPath();
        ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x + enemy.width, enemy.y);
        ctx.closePath();
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw Particles
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0; // reset alpha

      // Request next frame
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, playProceduralSound]);

  const handleStartGame = () => {
    setScore(0);
    setGameState("playing");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Game Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Marnay Emulator</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">Arcade launch for {gameTitle}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Toggle sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative aspect-[4/5] w-full bg-slate-950 flex items-center justify-center border-b border-slate-800">
          
          <canvas
            ref={canvasRef}
            width={400}
            height={500}
            className="w-full h-full block"
          />

          {/* Start Screen overlay */}
          {gameState === "start" && (
            <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center text-center p-6 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
                  Retro Space Defender
                </span>
                <h4 className="text-2xl font-black text-white uppercase tracking-wider">
                  MARNAY ARCADE EMULATION
                </h4>
                <p className="text-slate-500 text-xs max-w-xs mx-auto">
                  Protect Vice City space orbits! Shoot down incoming threat probes to reach 350 points and claim victory!
                </p>
              </div>

              {/* Instructions */}
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl max-w-xs space-y-2 text-left text-[11px] text-slate-400">
                <p className="font-bold text-slate-300 uppercase">Controls:</p>
                <div className="flex justify-between">
                  <span>Move Left:</span>
                  <span className="font-mono text-purple-400 bg-black/40 px-1.5 py-0.5 rounded">A / Left Arrow</span>
                </div>
                <div className="flex justify-between">
                  <span>Move Right:</span>
                  <span className="font-mono text-purple-400 bg-black/40 px-1.5 py-0.5 rounded">D / Right Arrow</span>
                </div>
                <div className="flex justify-between">
                  <span>Fire Lasers:</span>
                  <span className="font-mono text-purple-400 bg-black/40 px-1.5 py-0.5 rounded">Spacebar</span>
                </div>
              </div>

              <Button
                onClick={handleStartGame}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/25"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START EMULATION</span>
              </Button>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-rose-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-6">
              <div className="space-y-1">
                <span className="text-rose-500 font-extrabold uppercase tracking-widest text-xs">SYSTEM INTEGRITY DAMAGED</span>
                <h4 className="text-3xl font-black text-white">GAME OVER</h4>
                <p className="text-slate-400 text-xs">Your ship was disintegrated.</p>
              </div>

              <div className="bg-black/40 border border-rose-500/20 p-4 rounded-2xl w-48 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Your Score</span>
                <span className="text-2xl font-black font-mono text-rose-400">{score}</span>
              </div>

              <Button
                onClick={handleStartGame}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </Button>
            </div>
          )}

          {/* Victory Screen */}
          {gameState === "victory" && (
            <div className="absolute inset-0 bg-cyan-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 space-y-6">
              <div className="space-y-1 animate-bounce">
                <span className="text-cyan-400 font-extrabold uppercase tracking-widest text-xs">ORBITAL AREA SECURED</span>
                <h4 className="text-3xl font-black text-white">VICTORY</h4>
                <p className="text-slate-400 text-xs">Threat probes cleared.</p>
              </div>

              <div className="bg-black/40 border border-cyan-500/20 p-4 rounded-2xl w-48 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">Score reached</span>
                <span className="text-2xl font-black font-mono text-cyan-400">{score}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleStartGame}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-5 rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-slate-900 border border-slate-800 text-slate-300 hover:text-white py-3 px-5 rounded-xl cursor-pointer"
                >
                  Close Launcher
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Game Footer HUD info */}
        <div className="px-4 py-3 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            <span>Score: </span>
            <span className="text-purple-400 font-bold">{score}</span>
          </div>
          <div>
            <span>Record: </span>
            <span className="text-cyan-400 font-bold">{highScore}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MiniGame;
