import React from 'react';
import { Check } from 'lucide-react';
import { ConceptId } from '../types';
import { CONCEPTS } from '../data/concepts';
import { getConceptDataUrl } from '../utils/textureGenerator';
import { playSoftClick } from '../utils/audio';

interface CardsGrid2DProps {
  conceptIds: ConceptId[];
  foundIds: ConceptId[];
  onSelectCard: (id: ConceptId) => void;
  disabled: boolean;
}

export const CardsGrid2D: React.FC<CardsGrid2DProps> = ({
  conceptIds,
  foundIds,
  onSelectCard,
  disabled,
}) => {
  const handleCardClick = (id: ConceptId) => {
    if (disabled || foundIds.includes(id)) return;
    playSoftClick();
    onSelectCard(id);
  };

  // Determine grid columns based on number of items:
  // 6 items: 2 cols on mobile, 3 cols on tablet/desktop
  // 8 items: 2 cols on mobile, 4 cols on tablet/desktop
  // 10 items: 2 cols on mobile, 3-4 cols on tablet, 5 cols on desktop
  const count = conceptIds.length;
  let gridColsClass = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3';
  if (count === 8) {
    gridColsClass = 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4';
  } else if (count === 10) {
    gridColsClass = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Decorative Autumn Foliage in Background (Subtle, Friendly, Non-Distracting) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        {/* Soft autumn tree silhouettes in corners */}
        <div className="absolute -top-12 -left-12 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-amber-300/40 blur-2xl" />
        <div className="absolute -top-12 -right-12 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-orange-300/40 blur-2xl" />
        <div className="absolute -bottom-12 left-1/4 w-64 h-64 rounded-full bg-yellow-300/30 blur-2xl" />
        <div className="absolute -bottom-12 right-1/4 w-64 h-64 rounded-full bg-emerald-200/30 blur-2xl" />

        {/* Scattered soft golden leaf accents on edges */}
        <div className="absolute top-16 left-6 text-2xl sm:text-4xl transform -rotate-12 select-none">🍂</div>
        <div className="absolute top-24 right-8 text-2xl sm:text-4xl transform rotate-45 select-none">🍁</div>
        <div className="absolute bottom-20 left-10 text-2xl sm:text-4xl transform rotate-12 select-none">🍂</div>
        <div className="absolute bottom-16 right-12 text-2xl sm:text-4xl transform -rotate-45 select-none">🍁</div>
      </div>

      {/* Main Playing Meadow Container - High Contrast, Clean, Rounded Area */}
      <div className="relative z-10 w-full max-w-6xl my-auto">
        <div
          className={`grid ${gridColsClass} gap-3 sm:gap-4 md:gap-5 justify-center items-center`}
        >
          {conceptIds.map((id) => {
            const concept = CONCEPTS[id];
            const isFound = foundIds.includes(id);

            return (
              <button
                key={id}
                onClick={() => handleCardClick(id)}
                disabled={disabled || isFound}
                aria-label={`${concept.name}${isFound ? ' - megtalálva' : ''}`}
                className={`group relative flex flex-col items-center justify-between p-2.5 sm:p-4 rounded-3xl transition-all duration-200 transform select-none touch-manipulation cursor-pointer ${
                  isFound
                    ? 'bg-emerald-50/90 border-4 border-emerald-400 opacity-85 shadow-xs cursor-default scale-95'
                    : 'bg-white/95 hover:bg-amber-50/90 active:scale-95 hover:-translate-y-1 shadow-md hover:shadow-xl border-4 border-amber-200 hover:border-amber-400'
                }`}
                style={{ minHeight: '140px', minWidth: '120px' }}
              >
                {/* Found Celebratory Checkmark Badge */}
                {isFound && (
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-75">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3.5]" />
                  </div>
                )}

                {/* Big, Crisp Procedural Illustration */}
                <div className="relative w-full aspect-square max-w-[130px] sm:max-w-[160px] md:max-w-[180px] flex items-center justify-center p-1 sm:p-2">
                  <img
                    src={getConceptDataUrl(id, isFound)}
                    alt={concept.name}
                    className={`w-full h-full object-contain pointer-events-none transition-transform duration-200 ${
                      !isFound ? 'group-hover:scale-105' : 'grayscale-25'
                    }`}
                    loading="lazy"
                  />
                </div>

                {/* Clear, Bold Hungarian Name Label */}
                <div
                  className={`mt-1 sm:mt-2 w-full py-1 sm:py-1.5 px-2 rounded-2xl text-center font-black text-sm sm:text-base md:text-lg tracking-tight transition-colors ${
                    isFound
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100/70 group-hover:bg-amber-200/80 text-amber-950 border border-amber-200'
                  }`}
                >
                  <span className="capitalize">{concept.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
