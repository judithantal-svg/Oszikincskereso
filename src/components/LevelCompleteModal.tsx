import React, { useEffect } from 'react';
import { Award, ArrowRight, RotateCcw, Home, Sparkles, Volume2 } from 'lucide-react';
import { LevelStats, BadgeType } from '../types';
import { CONCEPTS, BADGES } from '../data/concepts';
import { speakText, playCelebrationFanfare, playSoftClick } from '../utils/audio';

interface LevelCompleteModalProps {
  stats: LevelStats;
  isLastLevel: boolean;
  speechEnabled: boolean;
  soundEffectsEnabled: boolean;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onBackToHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  stats,
  isLastLevel,
  speechEnabled,
  soundEffectsEnabled,
  onNextLevel,
  onRetryLevel,
  onBackToHome,
}) => {
  // Generate personalized pedagogically grounded observation text
  const feedbackSentences: string[] = [];

  // Check first-try successes
  if (stats.firstTrySuccesses.length > 0) {
    if (stats.firstTrySuccesses.length === stats.totalItems) {
      feedbackSentences.push('Minden kincset hibátlanul, első próbálkozásra megtaláltál!');
    } else {
      // List up to 3 items found on first try
      const sample = stats.firstTrySuccesses.slice(0, 3).map((id) => {
        const item = CONCEPTS[id];
        return `${item.article} ${item.accusative}`;
      });

      let itemsStr = '';
      if (sample.length === 1) {
        itemsStr = sample[0];
      } else if (sample.length === 2) {
        itemsStr = `${sample[0]} és ${sample[1]}`;
      } else {
        itemsStr = `${sample[0]}, ${sample[1]} és ${sample[2]}`;
      }
      // Capitalize first letter
      const capitalized = itemsStr.charAt(0).toUpperCase() + itemsStr.slice(1);
      feedbackSentences.push(`${capitalized} elsőre megtaláltad.`);
    }
  }

  // Check specific mistake pairs recorded
  if (stats.mistakePairs.length > 0) {
    // Look for reciprocal confusion or specific pair
    const pair = stats.mistakePairs[0];
    const targetItem = CONCEPTS[pair.target];
    const chosenItem = CONCEPTS[pair.chosen];

    if (
      (pair.target === 'makk' && pair.chosen === 'gesztenye') ||
      (pair.target === 'gesztenye' && pair.chosen === 'makk')
    ) {
      feedbackSentences.push('A makk és a gesztenye megkülönböztetését még gyakorolhatod.');
    } else if (
      (pair.target === 'alma' && pair.chosen === 'korte') ||
      (pair.target === 'korte' && pair.chosen === 'alma')
    ) {
      feedbackSentences.push('Az alma és a körte megkülönböztetését még gyakorolhatod.');
    } else {
      feedbackSentences.push(
        `${targetItem.article.charAt(0).toUpperCase() + targetItem.article.slice(1)} ${targetItem.name} és ${chosenItem.article} ${chosenItem.name} megkülönböztetését még gyakorolhatod.`
      );
    }
  }

  const fullSpeech = `${stats.levelNumber}. szint befejezve! ${feedbackSentences.join(' ')}`;

  useEffect(() => {
    if (soundEffectsEnabled) {
      playCelebrationFanfare();
    }
    if (speechEnabled) {
      speakText(fullSpeech);
    }
  }, [fullSpeech, speechEnabled, soundEffectsEnabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center my-auto">
        {/* Top Trophy Banner */}
        <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center text-4xl mb-3 shadow-xs">
          🏆
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-amber-950 mb-1">
          Szép munka!
        </h2>
        <p className="text-base sm:text-lg font-bold text-amber-800 mb-6">
          Sikeresen befejezted a {stats.levelNumber}. szintet!
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
            <div className="text-xs uppercase font-extrabold text-amber-800">Elért pontszám</div>
            <div className="text-3xl font-black text-amber-950 mt-1">
              {stats.score} <span className="text-sm text-stone-500 font-normal">pont</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
            <div className="text-xs uppercase font-extrabold text-emerald-800">Megtalált kincsek</div>
            <div className="text-3xl font-black text-emerald-950 mt-1">
              {stats.foundItems.length} / {stats.totalItems}
            </div>
          </div>
        </div>

        {/* Earned Badges section */}
        {stats.earnedBadges.length > 0 && (
          <div className="w-full bg-gradient-to-r from-amber-100/80 via-orange-50 to-amber-100/80 rounded-2xl p-4 border-2 border-amber-300 mb-6 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Megszerzett jelvény
              </span>
            </div>

            <div className="space-y-2">
              {stats.earnedBadges.map((badgeKey: BadgeType) => {
                const b = BADGES[badgeKey];
                return (
                  <div
                    key={badgeKey}
                    className="flex items-center gap-3 bg-white/90 rounded-xl p-3 border border-amber-200 shadow-xs"
                  >
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
                        {b.title}
                      </h4>
                      <p className="text-xs text-stone-600 font-medium">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Personalized Observation Feedback */}
        <div className="w-full bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-6 text-left flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="text-xs uppercase font-extrabold text-stone-500 tracking-wider">
              Pedagógusi megfigyelés
            </div>
            {feedbackSentences.map((sent, idx) => (
              <p key={idx} className="text-sm sm:text-base font-bold text-stone-800">
                • {sent}
              </p>
            ))}
          </div>

          <button
            onClick={() => speakText(fullSpeech)}
            className="w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform"
            title="Összegzés felolvasása"
            aria-label="Összegzés felolvasása"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          {/* Next level or finished */}
          {!isLastLevel ? (
            <button
              onClick={() => {
                playSoftClick();
                onNextLevel();
              }}
              className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl sm:text-2xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <span>Következő szint ({stats.levelNumber + 1}. szint)</span>
              <ArrowRight className="w-7 h-7" />
            </button>
          ) : (
            <button
              onClick={() => {
                playSoftClick();
                onNextLevel();
              }}
              className="w-full min-h-[58px] sm:min-h-[64px] rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xl sm:text-2xl shadow-lg border-2 border-amber-300 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
            >
              <Award className="w-7 h-7" />
              <span>Teljes játék áttekintése</span>
            </button>
          )}

          <div className="flex gap-2 w-full">
            <button
              onClick={() => {
                playSoftClick();
                onRetryLevel();
              }}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm sm:text-base border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Újrapróbálom</span>
            </button>

            <button
              onClick={() => {
                playSoftClick();
                onBackToHome();
              }}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm sm:text-base border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Kezdőlap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
