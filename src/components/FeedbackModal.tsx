import React, { useEffect } from 'react';
import { CheckCircle2, ArrowRight, RotateCcw, Volume2, Sparkles } from 'lucide-react';
import { ConceptItem } from '../types';
import { getConceptDataUrl } from '../utils/textureGenerator';
import { speakText, playSoftClick } from '../utils/audio';

interface FeedbackModalProps {
  isCorrect: boolean;
  targetConcept: ConceptItem;
  selectedConcept: ConceptItem;
  speechEnabled: boolean;
  onContinue: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isCorrect,
  targetConcept,
  selectedConcept,
  speechEnabled,
  onContinue,
}) => {
  // Construct Hungarian feedback message
  // Helyes: "Megtaláltad! Ez az alma." (nominative with article)
  // Téves: "Ez a körte. Most az almát keressük." (selected in nominative with article, target in accusative)
  const message = isCorrect
    ? `Megtaláltad! Ez ${targetConcept.nominativeWithArticle}.`
    : `Ez ${selectedConcept.nominativeWithArticle}. Most ${targetConcept.accusative} keressük.`;

  useEffect(() => {
    if (speechEnabled) {
      speakText(message);
    }
  }, [message, speechEnabled]);

  const handleReplayAudio = () => {
    speakText(message);
  };

  const handleAction = () => {
    playSoftClick();
    onContinue();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className={`w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 text-center flex flex-col items-center transition-all ${
          isCorrect ? 'border-emerald-400' : 'border-amber-300'
        }`}
      >
        {/* Top Header Badge */}
        {isCorrect ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Helyes válasz! +10 pont</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-sm mb-4">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Próbáld újra!</span>
          </div>
        )}

        {/* Visual Badges Display - Extra large for maximum clarity */}
        {isCorrect ? (
          <div className="relative mb-5">
            <div className="w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-emerald-50 border-4 border-emerald-400 shadow-lg flex items-center justify-center p-3">
              <img
                src={getConceptDataUrl(targetConcept.id, true)}
                alt={targetConcept.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          </div>
        ) : (
          /* Incorrect: show both the selected item and the target item prominently */
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-5">
            {/* Selected item */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-stone-100 border-4 border-stone-300 shadow-sm flex items-center justify-center p-2">
                <img
                  src={getConceptDataUrl(selectedConcept.id, false)}
                  alt={selectedConcept.name}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <span className="mt-2 text-sm sm:text-base font-bold text-stone-700">
                {selectedConcept.name}
              </span>
            </div>

            <div className="text-amber-500 font-black text-2xl">➜</div>

            {/* Target item to find */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-amber-50 border-4 border-amber-400 shadow-md flex items-center justify-center p-2 ring-4 ring-amber-200">
                <img
                  src={getConceptDataUrl(targetConcept.id, false)}
                  alt={targetConcept.name}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </div>
              <span className="mt-2 text-sm sm:text-base font-black text-amber-950">
                Keresett: {targetConcept.name}
              </span>
            </div>
          </div>
        )}

        {/* Explanation Message text with Audio replay */}
        <div className="w-full bg-stone-50 rounded-2xl p-4 mb-6 border border-stone-200 flex items-center justify-between gap-3">
          <p className="text-lg sm:text-xl font-black text-stone-900 text-left flex-1">
            {message}
          </p>

          <button
            onClick={handleReplayAudio}
            className="w-12 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer active:scale-95 transition-transform"
            title="Szöveg újbóli meghallgatása"
            aria-label="Szöveg újbóli meghallgatása"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Action Button: "Tovább" on correct, "Újra próbálom" on wrong */}
        {isCorrect ? (
          <button
            onClick={handleAction}
            className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl sm:text-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <span>Tovább</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        ) : (
          <button
            onClick={handleAction}
            className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xl sm:text-2xl shadow-lg border-2 border-amber-300 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Újra megpróbálom</span>
          </button>
        )}
      </div>
    </div>
  );
};
