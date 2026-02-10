
import React, { useState, useEffect } from 'react';

interface LovePuzzleProps {
  onComplete: () => void;
}

const LovePuzzle: React.FC<LovePuzzleProps> = ({ onComplete }) => {
  const targetWords = ['LOVE', 'HEART', 'FOREVER'];
  const [solvedWords, setSolvedWords] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [shake, setShake] = useState(false);

  const letters = ['L', 'O', 'V', 'E', 'H', 'A', 'R', 'T', 'F', 'N'];

  const handleLetterClick = (letter: string) => {
    const nextGuess = currentGuess + letter;
    if (nextGuess.length > 7) return;
    
    setCurrentGuess(nextGuess);

    if (targetWords.includes(nextGuess) && !solvedWords.includes(nextGuess)) {
      const newSolved = [...solvedWords, nextGuess];
      setSolvedWords(newSolved);
      setCurrentGuess('');
      if (newSolved.length === targetWords.length) {
        setTimeout(onComplete, 800);
      }
    } else if (nextGuess.length >= 7 || (nextGuess.length >= 4 && !targetWords.some(w => w.startsWith(nextGuess)))) {
       setShake(true);
       setTimeout(() => {
         setShake(false);
         setCurrentGuess('');
       }, 500);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-rose-600 mb-2">The Love Decoder</h2>
        <p className="text-rose-400 text-sm">Find the 3 secret words to unlock your heart!</p>
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        {targetWords.map((word) => (
          <div key={word} className="flex justify-between items-center p-2 rounded-lg bg-white/50 border border-pink-200">
            <span className="font-mono tracking-widest text-rose-300">
              {solvedWords.includes(word) ? word : word.split('').map(() => '_').join(' ')}
            </span>
            {solvedWords.includes(word) && <span className="text-green-500">✓</span>}
          </div>
        ))}
      </div>

      <div className={`h-12 flex items-center justify-center text-3xl font-bold text-rose-500 tracking-widest ${shake ? 'animate-shake' : ''}`}>
        {currentGuess || <span className="text-rose-200 text-lg font-normal">Tap letters...</span>}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {letters.map((l, i) => (
          <button
            key={i}
            onClick={() => handleLetterClick(l)}
            className="w-12 h-12 bg-white rounded-xl shadow-sm border border-pink-100 flex items-center justify-center text-xl font-bold text-rose-500 hover:bg-rose-50 active:scale-90 transition-all"
          >
            {l}
          </button>
        ))}
      </div>

      <button 
        onClick={() => setCurrentGuess('')}
        className="text-xs text-rose-400 underline"
      >
        Clear Current
      </button>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default LovePuzzle;
