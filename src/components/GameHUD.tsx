import React, { useState } from 'react';
import { Volume2, Clock, Settings, Home, Award, ZoomIn, X, ChevronUp, ChevronDown } from 'lucide-react';
import { ConceptItem } from '../types';
import { getConceptDataUrl } from '../utils/textureGenerator';
import { playSoftClick, speakText } from '../utils/audio';

interface GameHUDProps {
  levelNumber: number;
  currentTarget: ConceptItem | null;
  foundCount: number;
  totalCount: number;
  score: number;
  maxScore: number;
  remainingTime: number;
  timeLimitEnabled: boolean;
  onReplaySpeech: () => void;
  onOpenSettings: () => void;
  onBackToHome: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  levelNumber,
  currentTarget,
  foundCount,
  totalCount,
  score,
  maxScore,
  remainingTime,
  timeLimitEnabled,
  onReplaySpeech,
  onOpenSettings,
  onBackToHome,
}) => {
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Format remaining time as MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenZoom = () => {
    playSoftClick();
    setIsZoomModalOpen(true);
  };

  const handleCloseZoom = () => {
    playSoftClick();
    setIsZoomModalOpen(false);
  };

  return (
    <>
      {/* Top Header - Streamlined, Compact Single-Bar (Zero Occlusion) */}
      <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-2 sm:p-3 flex flex-col items-center">
        {!isCollapsed ? (
          <div className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-2xl shadow-md border-2 border-amber-300 px-3 py-2 pointer-events-auto flex items-center justify-between gap-2 sm:gap-4 transition-all">
            {/* Left Section: Home & Level */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => {
                  playSoftClick();
                  onBackToHome();
                }}
                className="min-w-[44px] min-h-[44px] sm:min-w-[48px] sm:min-h-[48px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-amber-800 border border-stone-200 flex items-center gap-1.5 font-bold transition-transform active:scale-95 cursor-pointer"
                title="Vissza a kezdőlapra"
                aria-label="Vissza a kezdőlapra"
              >
                <Home className="w-5 h-5 text-amber-700" />
                <span className="hidden md:inline text-xs">Főoldal</span>
              </button>

              <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-amber-600 text-white font-black text-xs sm:text-sm border border-amber-500 whitespace-nowrap">
                {levelNumber}. szint
              </div>
            </div>

            {/* Center Section: Compact Active Task Prompt with Picture */}
            {currentTarget && (
              <div className="flex items-center gap-2 sm:gap-3 bg-amber-50/90 border-2 border-amber-300/80 rounded-2xl px-2.5 py-1 sm:px-4 sm:py-1.5 min-w-0 max-w-md md:max-w-xl shadow-xs">
                {/* Clickable Target Image Thumbnail with Zoom */}
                <button
                  onClick={handleOpenZoom}
                  className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border-2 border-amber-400 flex items-center justify-center p-0.5 shrink-0 transition-transform active:scale-95 hover:scale-105 cursor-pointer shadow-xs"
                  title="Kattints a kép nagyításához!"
                  aria-label="Kép nagyítása"
                >
                  <img
                    src={getConceptDataUrl(currentTarget.id)}
                    alt={currentTarget.name}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 border border-white">
                    <ZoomIn className="w-3 h-3" />
                  </div>
                </button>

                {/* Instruction Text */}
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wider block leading-none">
                    Keresd meg:
                  </span>
                  <span className="text-base sm:text-xl md:text-2xl font-black text-amber-950 truncate block leading-tight">
                    {currentTarget.accusative}!
                  </span>
                </div>

                {/* Speaker Button to Replay Speech */}
                <button
                  onClick={() => {
                    playSoftClick();
                    onReplaySpeech();
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs border border-amber-400 active:scale-95 transition-transform cursor-pointer"
                  title="Utasítás felolvasása"
                  aria-label="Utasítás felolvasása"
                >
                  <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            )}

            {/* Right Section: Stats & Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Progress Count */}
              <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-stone-100 border border-stone-200 font-extrabold text-stone-800 text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
                <span className="text-amber-700 hidden sm:inline">Kincsek:</span>
                <span>
                  {foundCount}/{totalCount}
                </span>
              </div>

              {/* Score */}
              <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 font-extrabold text-emerald-800 text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap">
                <Award className="w-4 h-4 text-emerald-600 hidden sm:inline" />
                <span>
                  {score} <span className="text-stone-400 font-normal hidden sm:inline">/ {maxScore}</span>
                </span>
              </div>

              {/* Timer */}
              {timeLimitEnabled && (
                <div
                  className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border font-black text-xs sm:text-sm flex items-center gap-1 whitespace-nowrap ${
                    remainingTime <= 20
                      ? 'bg-rose-100 border-rose-300 text-rose-800'
                      : 'bg-stone-100 border-stone-200 text-stone-800'
                  }`}
                >
                  <Clock
                    className={`w-3.5 h-3.5 ${
                      remainingTime <= 20 ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  />
                  <span className="tabular-nums">{formatTime(remainingTime)}</span>
                </div>
              )}

              {/* Settings Button */}
              <button
                onClick={() => {
                  playSoftClick();
                  onOpenSettings();
                }}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center border border-stone-200 active:scale-95 transition-transform cursor-pointer"
                title="Pedagógusi beállítások"
                aria-label="Pedagógusi beállítások"
              >
                <Settings className="w-5 h-5 text-stone-600" />
              </button>
            </div>
          </div>
        ) : (
          /* Collapsed Mini Pill */
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full shadow-md border-2 border-amber-300 px-4 py-1.5 flex items-center gap-3">
            {currentTarget && (
              <button
                onClick={handleOpenZoom}
                className="w-8 h-8 rounded-full bg-amber-50 border border-amber-300 flex items-center justify-center p-0.5 cursor-pointer"
                title="Kép megnyitása"
              >
                <img
                  src={getConceptDataUrl(currentTarget.id)}
                  alt={currentTarget.name}
                  className="w-full h-full object-contain pointer-events-none"
                />
              </button>
            )}
            <span className="text-sm font-black text-amber-950">
              Keresd meg: {currentTarget?.accusative}!
            </span>
            <button
              onClick={() => {
                playSoftClick();
                onReplaySpeech();
              }}
              className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center cursor-pointer"
              title="Felolvasás"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Collapse / Expand Toggle Tab */}
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="pointer-events-auto mt-1 px-3 py-0.5 rounded-full bg-white/90 hover:bg-white text-stone-500 hover:text-stone-800 text-[11px] font-bold shadow-xs border border-amber-200/80 flex items-center gap-1 cursor-pointer transition-colors"
          title={isCollapsed ? 'Sáv lenyitása' : 'Sáv összecsukása a maximális rálátásért'}
        >
          {isCollapsed ? (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Sáv mutatása</span>
            </>
          ) : (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Sáv összecsukása</span>
            </>
          )}
        </button>
      </header>

      {/* Target Image Detail Zoom Modal (when user wants to see image in giant full-screen view) */}
      {isZoomModalOpen && currentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center">
            {/* Close Button */}
            <button
              onClick={handleCloseZoom}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Bezárás"
            >
              <X className="w-6 h-6" />
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs uppercase mb-3">
              <ZoomIn className="w-3.5 h-3.5" /> Nagyított kép
            </span>

            {/* Giant illustration card */}
            <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-amber-50 border-4 border-amber-300 shadow-lg flex items-center justify-center p-3 mb-4 ring-8 ring-amber-100">
              <img
                src={getConceptDataUrl(currentTarget.id)}
                alt={currentTarget.name}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>

            {/* Label and Audio */}
            <div className="flex items-center justify-center gap-3 mb-2">
              <h3 className="text-3xl sm:text-4xl font-black text-amber-950 capitalize">
                {currentTarget.nominativeWithArticle}
              </h3>
              <button
                onClick={() =>
                  speakText(
                    `Ez ${currentTarget.nominativeWithArticle}. Keresd meg a képkártyák között!`
                  )
                }
                className="w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                title="Felolvasás"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-stone-600 font-semibold mb-6">
              {currentTarget.description}
            </p>

            <button
              onClick={handleCloseZoom}
              className="w-full min-h-[52px] rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xl shadow-md border-2 border-amber-300 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              Rendben, keresem!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
