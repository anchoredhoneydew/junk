
import React, { useState, useCallback, useRef } from 'react';
import FloatingHearts from './components/FloatingHearts';
import LovePuzzle from './components/LovePuzzle';
import { NO_MESSAGES, CELEBRATION_TEXT, MAIN_QUESTION } from './constants';
import { GameState } from './types';
import confetti from 'https://cdn.skypack.dev/canvas-confetti';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.PROPOSING);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [yesScale, setYesScale] = useState(1);
  const [puzzleUnlocked, setPuzzleUnlocked] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNoInteraction = useCallback(() => {
    const nextCount = noCount + 1;
    setNoCount(nextCount);
    
    // Growth logic
    setYesScale((prev) => Math.min(prev + 0.35, 20));

    // Jump logic
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 120;
      const x = Math.random() * (rect.width - padding * 2) - (rect.width / 2) + padding;
      const y = Math.random() * (rect.height - padding * 2) - (rect.height / 2) + padding;
      setNoPosition({ x, y });
    }

    // Trigger puzzle after 6 persistent "No" attempts
    if (nextCount === 6 && !puzzleUnlocked) {
      setTimeout(() => {
        setGameState(GameState.PUZZLE);
      }, 500);
    }
  }, [noCount, puzzleUnlocked]);

  const handleYesClick = () => {
    setGameState(GameState.CELEBRATING);
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffffff', '#ffd700']
    });
  };

  const handlePuzzleComplete = () => {
    setPuzzleUnlocked(true);
    setGameState(GameState.PROPOSING);
    setNoCount(0);
    setYesScale(2.5); // Reward with a bigger Yes
    setNoPosition({ x: 0, y: 0 });
  };

  const getNoMessage = () => {
    if (puzzleUnlocked) return "I give up! Yes?";
    return NO_MESSAGES[noCount % NO_MESSAGES.length];
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.PROPOSING:
        return (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-500">
            <div className="text-8xl animate-bounce mb-4 select-none">
              {noCount === 0 ? '💌' : puzzleUnlocked ? '🥹' : noCount < 3 ? '🥺' : noCount < 6 ? '😭' : '😤'}
            </div>

            <h1 className="text-4xl md:text-5xl font-romantic text-rose-600 font-bold drop-shadow-sm leading-tight">
              {puzzleUnlocked ? "I'm yours forever?" : MAIN_QUESTION}
            </h1>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-4 min-h-[140px] w-full">
              <button
                onClick={handleYesClick}
                style={{ transform: `scale(${yesScale})` }}
                className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold text-lg shadow-lg shadow-rose-200 transition-all duration-300 hover:shadow-rose-400 active:scale-95 z-50 whitespace-nowrap"
              >
                YES! 💖
              </button>

              <button
                onMouseEnter={puzzleUnlocked ? undefined : handleNoInteraction}
                onClick={handleNoInteraction}
                style={{ 
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                  opacity: (yesScale > 10 && !puzzleUnlocked) ? 0 : 1,
                  pointerEvents: (yesScale > 10 && !puzzleUnlocked) ? 'none' : 'auto',
                  display: puzzleUnlocked && noCount > 0 ? 'none' : 'block'
                }}
                className={`px-8 py-3 bg-white/80 hover:bg-gray-100 text-gray-700 rounded-full font-semibold text-lg border border-pink-100 transition-all duration-300 ease-out whitespace-nowrap shadow-sm ${puzzleUnlocked ? 'ring-2 ring-rose-300' : ''}`}
              >
                {getNoMessage()}
              </button>
            </div>
          </div>
        );

      case GameState.PUZZLE:
        return <LovePuzzle onComplete={handlePuzzleComplete} />;

      case GameState.CELEBRATING:
        return (
          <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-700">
            <div className="text-9xl animate-pulse drop-shadow-xl">
              💑
            </div>
            <h1 className="text-4xl md:text-6xl font-romantic text-rose-600 font-bold leading-tight drop-shadow-sm">
              {CELEBRATION_TEXT}
            </h1>
            <div className="bg-rose-100/50 px-6 py-3 rounded-full border border-rose-200">
              <p className="text-rose-500 font-bold">You've unlocked: Infinite Kisses! 💋</p>
            </div>
            
            <button 
              onClick={() => {
                setGameState(GameState.PROPOSING);
                setNoCount(0);
                setYesScale(1);
                setNoPosition({ x: 0, y: 0 });
                setPuzzleUnlocked(false);
              }}
              className="text-rose-400 hover:text-rose-600 underline text-sm transition-colors mt-8"
            >
              Start Adventure Over
            </button>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 overflow-hidden"
    >
      <FloatingHearts />

      <div className="relative z-10 w-full max-w-lg px-4">
        <div className="backdrop-blur-xl bg-white/40 border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl transition-all duration-700 ease-out">
          {renderContent()}
        </div>
      </div>

      {/* Decorative Ornaments */}
      <div className="fixed top-0 left-0 p-8 text-rose-300 pointer-events-none opacity-30 select-none">
        <div className="text-6xl">🌸</div>
      </div>
      <div className="fixed bottom-0 right-0 p-8 text-rose-300 pointer-events-none opacity-30 select-none">
        <div className="text-6xl">🌸</div>
      </div>

      <style>{`
        .font-romantic { font-family: 'Dancing Script', cursive; }
        .animate-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;
