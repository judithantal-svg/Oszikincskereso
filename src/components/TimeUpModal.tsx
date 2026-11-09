import React, { useEffect } from 'react';
import { RotateCcw, Play, Volume2 } from 'lucide-react';
import { speakText, playSoftClick } from '../utils/audio';

interface TimeUpModalProps {
  speechEnabled: boolean;
  onRetry: () => void;
  onContinueUntimed: () => void;
}

export const TimeUpModal: React.FC<TimeUpModalProps> = ({
  speechEnabled,
  onRetry,
  onContinueUntimed,
}) => {
  const message = 'Most eddig jutottál. Újra megpróbálhatod!';

  useEffect(() => {
    if (speechEnabled) {
      speakText(message);
    }
  }, [message, speechEnabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center">
        {/* Calm Icon */}
        <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-4xl mb-4 shadow-xs">
          🍂
        </div>

        {/* Calm Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-2">
          Lejárt az idő
        </h2>

        {/* Message with audio button */}
        <div className="w-full bg-amber-50 rounded-2xl p-4 border border-amber-200 flex items-center justify-between gap-3 mb-6">
          <p className="text-lg sm:text-xl font-bold text-amber-900 text-left flex-1">
            {message}
          </p>
          <button
            onClick={() => speakText(message)}
            className="w-12 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform"
            title="Felolvasás"
            aria-label="Felolvasás"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Retry Button */}
          <button
            onClick={() => {
              playSoftClick();
              onRetry();
            }}
            className="w-full min-h-[58px] rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xl shadow-md border-2 border-amber-400 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Újrapróbálom</span>
          </button>

          {/* Continue Untimed */}
          <button
            onClick={() => {
              playSoftClick();
              onContinueUntimed();
            }}
            className="w-full min-h-[58px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl shadow-md border-2 border-emerald-400 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Folytatom időkorlát nélkül</span>
          </button>
        </div>
      </div>
    </div>
  );
};
