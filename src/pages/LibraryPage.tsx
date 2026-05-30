import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import type { Game } from "@/lib/gamesData";
import MiniGame from "@/components/game/MiniGame";
import { useNavigate } from "react-router";
import { Play, Download, Gamepad2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadProgress {
  [gameId: string]: {
    progress: number;
    speed: string;
    timeLeft: string;
    isDownloading: boolean;
  };
}

const LibraryPage: React.FC = () => {
  const { library, installed, games, setInstalled } = useStore();
  const navigate = useNavigate();

  const [activeMiniGame, setActiveMiniGame] = useState<Game | null>(null);
  const [downloadStates, setDownloadStates] = useState<DownloadProgress>({});

  const libraryGames = games.filter((game) => library.includes(game.id));

  // Simulate Download/Install process
  const triggerInstall = (gameId: string) => {
    // Initialize download status
    setDownloadStates((prev) => ({
      ...prev,
      [gameId]: {
        progress: 0,
        speed: "0 MB/s",
        timeLeft: "Calculating...",
        isDownloading: true,
      },
    }));
  };

  // Effect to process active downloads
  useEffect(() => {
    const activeDownloads = Object.keys(downloadStates).filter(
      (id) => downloadStates[id]?.isDownloading
    );

    if (activeDownloads.length === 0) return;

    const intervals = activeDownloads.map((id) => {
      return setInterval(() => {
        setDownloadStates((prev) => {
          const current = prev[id];
          if (!current) return prev;

          const newProgress = Math.min(100, current.progress + Math.floor(Math.random() * 8) + 4);
          
          if (newProgress >= 100) {
            // Install complete!
            setInstalled(id);
            return {
              ...prev,
              [id]: {
                progress: 100,
                speed: "0 MB/s",
                timeLeft: "Completed",
                isDownloading: false,
              },
            };
          }

          // Random speed & time remaining calculation
          const speedNum = (4.5 + Math.random() * 8).toFixed(1);
          const timeLeftSec = Math.ceil((100 - newProgress) / parseFloat(speedNum));

          return {
            ...prev,
            [id]: {
              ...current,
              progress: newProgress,
              speed: `${speedNum} MB/s`,
              timeLeft: `${timeLeftSec}s remaining`,
            },
          };
        });
      }, 350);
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, [downloadStates, setInstalled]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black tracking-wide uppercase text-white flex items-center gap-2">
          <Gamepad2 className="w-8 h-8 text-purple-400" />
          <span>My Game Library</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          You own {libraryGames.length} digital games
        </p>
      </div>

      {/* Library Grid */}
      {libraryGames.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-5 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
          <div className="w-16 h-16 rounded-full bg-slate-900/60 border border-slate-850 flex items-center justify-center text-slate-500">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xl font-bold text-slate-300">Your library is currently empty</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Any games you purchase through the store will appear here, ready to install and play.
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl px-6 py-2.5 font-bold cursor-pointer shadow-lg shadow-purple-500/20"
          >
            Explore Game Store
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryGames.map((game) => {
            const isInstalled = installed.includes(game.id);
            const dlState = downloadStates[game.id];
            const isDownloading = dlState?.isDownloading;

            return (
              <div
                key={game.id}
                className="bg-slate-900/40 border border-slate-850 hover:border-slate-800 hover:shadow-lg rounded-3xl overflow-hidden flex flex-col sm:flex-row gap-4 p-4 transition-all"
              >
                {/* Cover artwork */}
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full sm:w-24 aspect-[3/4] object-cover rounded-xl bg-slate-800 flex-shrink-0"
                />

                {/* Game launch configurations */}
                <div className="flex-grow flex flex-col justify-between py-1 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1">{game.title}</h3>
                    <p className="text-xs text-slate-500">{game.developer}</p>
                  </div>

                  {/* Actions / Progress Bars */}
                  <div className="space-y-3 mt-auto">
                    {isDownloading && dlState && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Downloading: {dlState.speed}</span>
                          <span>{dlState.progress}%</span>
                        </div>
                        
                        {/* Custom progress rail */}
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                            style={{ width: `${dlState.progress}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 text-right font-mono">
                          {dlState.timeLeft}
                        </div>
                      </div>
                    )}

                    {/* Installed State CTA */}
                    {isInstalled ? (
                      <Button
                        onClick={() => setActiveMiniGame(game)}
                        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all"
                      >
                        <Play className="w-4 h-4 fill-current animate-pulse" />
                        <span>LAUNCH GAME</span>
                      </Button>
                    ) : (
                      !isDownloading && (
                        <Button
                          onClick={() => triggerInstall(game.id)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>INSTALL ({game.reqMin.storage.split(" ")[0]} GB)</span>
                        </Button>
                      )
                    )}

                    {/* Pending Launcher simulator status */}
                    {isDownloading && (
                      <div className="w-full bg-slate-950/40 border border-slate-850 py-3 rounded-xl flex items-center justify-center gap-2 text-xs text-purple-400 font-bold font-mono">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>INSTALLING...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Retro Mini-Game Overlay Launcher */}
      {activeMiniGame && (
        <MiniGame
          gameTitle={activeMiniGame.title}
          onClose={() => setActiveMiniGame(null)}
        />
      )}
    </div>
  );
};

export default LibraryPage;
