import React from 'react';
import { Play, Settings, Sparkles, Volume2 } from 'lucide-react';
import { getConceptDataUrl } from '../utils/textureGenerator';
import { speakText, playSoftClick } from '../utils/audio';

interface StartScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
  speechEnabled: boolean;
  soundEffectsEnabled: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStart,
  onOpenSettings,
  speechEnabled,
  soundEffectsEnabled,
}) => {
  const previewConcepts = [
    'oszi-level',
    'gesztenye',
    'makk',
    'alma',
    'korte',
    'szolo',
    'tok',
    'eso',
    'esernyo',
    'gumicsizma',
  ] as const;

  const handleSpeakGuide = () => {
    if (speechEnabled) {
      speakText('Őszi kincskereső! Keresd meg a képet! Érintsd meg a kártyát!');
    }
  };

  const handleStart = () => {
    if (soundEffectsEnabled) playSoftClick();
    onStart();
  };

  const handleSettings = () => {
    if (soundEffectsEnabled) playSoftClick();
    onOpenSettings();
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-amber-50/95 via-orange-50/90 to-amber-100/95 backdrop-blur-xs overflow-y-auto">
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex justify-between items-center pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-sm font-semibold">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Fejlesztőjáték</span>
        </div>

        <button
          onClick={handleSettings}
          className="min-w-[48px] min-h-[48px] px-4 py-2.5 rounded-2xl bg-white/90 hover:bg-white text-stone-700 hover:text-amber-800 border-2 border-stone-200/80 shadow-xs flex items-center gap-2 font-bold transition-all transform active:scale-95 cursor-pointer"
          aria-label="Pedagógusi beállítások megnyitása"
        >
          <Settings className="w-5 h-5 text-amber-600" />
          <span className="text-sm hidden sm:inline">Pedagógusi beállítások</span>
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-amber-200 text-center flex flex-col items-center my-auto">
        {/* Autumn Preview Badges Row - Larger and prominent */}
        <div className="flex justify-center items-center gap-2 sm:gap-3.5 mb-6 overflow-hidden py-1">
          {previewConcepts.map((id) => (
            <div
              key={id}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-amber-50 border-3 border-amber-300 shadow-md flex items-center justify-center p-1.5 transition-transform hover:scale-110"
            >
              <img
                src={getConceptDataUrl(id)}
                alt={id}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-amber-950 tracking-tight mb-3">
          Őszi kincskereső
        </h1>

        {/* Short Guide with Audio Readout */}
        <div className="flex items-center justify-center gap-3 bg-amber-50 border-2 border-amber-200/80 rounded-2xl px-5 py-3 mb-8 max-w-lg">
          <button
            onClick={handleSpeakGuide}
            className="min-w-[48px] min-h-[48px] p-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-sm flex items-center justify-center transition-transform active:scale-95 cursor-pointer shrink-0"
            title="Útmutató felolvasása"
            aria-label="Útmutató felolvasása"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <p className="text-base sm:text-xl font-bold text-amber-900 text-left leading-snug">
            Keresd meg a képet! Érintsd meg a kártyát!
          </p>
        </div>

        {/* Big Start Button */}
        <button
          onClick={handleStart}
          className="w-full max-w-md min-h-[64px] sm:min-h-[72px] px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:to-green-700 text-white font-extrabold text-2xl sm:text-3xl shadow-lg hover:shadow-xl border-3 border-emerald-300 flex items-center justify-center gap-4 transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
        >
          <Play className="w-8 h-8 fill-current" />
          <span>Kezdés</span>
        </button>

        {/* Secondary Teacher Button for mobile visibility */}
        <button
          onClick={handleSettings}
          className="mt-4 sm:hidden min-h-[48px] px-4 py-2 text-stone-600 hover:text-amber-800 text-sm font-bold flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4" />
          <span>Pedagógusi beállítások</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl text-center py-2 text-stone-600 text-xs sm:text-sm font-semibold">
        2D fejlesztő nevelési játék • 3 szint • Nagy képkártyák és felolvasás
      </div>
    </div>
  );
};
