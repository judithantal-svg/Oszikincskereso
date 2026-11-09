import React, { useEffect } from 'react';
import { Sparkles, RotateCcw, Home, Award } from 'lucide-react';
import { BADGES } from '../data/concepts';
import { BadgeType } from '../types';
import { speakText, playCelebrationFanfare, playSoftClick } from '../utils/audio';

interface GameCompleteModalProps {
  totalScore: number;
  maxTotalScore: number;
  allBadges: BadgeType[];
  speechEnabled: boolean;
  soundEffectsEnabled: boolean;
  onRestartAll: () => void;
  onBackToHome: () => void;
}

export const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  totalScore,
  maxTotalScore,
  allBadges,
  speechEnabled,
  soundEffectsEnabled,
  onRestartAll,
  onBackToHome,
}) => {
  const message = 'Bravó! Mind a három szintet sikeresen teljesítetted!';

  useEffect(() => {
    if (soundEffectsEnabled) {
      playCelebrationFanfare();
    }
    if (speechEnabled) {
      speakText(message);
    }
  }, [message, speechEnabled, soundEffectsEnabled]);

  const uniqueBadges = Array.from(new Set(allBadges));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center my-auto">
        {/* Celebration Crown */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 to-amber-100 border-4 border-amber-400 flex items-center justify-center text-5xl mb-4 shadow-md">
          👑
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-amber-950 mb-2">
          Gratulálunk!
        </h2>
        <p className="text-base sm:text-lg font-bold text-amber-800 mb-6">
          Mind a 3 szintet sikeresen teljesítetted az őszi kertben!
        </p>

        {/* Total Score */}
        <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-5 border-2 border-emerald-300 mb-6 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs uppercase font-extrabold text-emerald-800">
              Összesített pontszám
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-950">
              {totalScore} <span className="text-sm font-normal text-stone-500">/ {maxTotalScore} pont</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Badges Collection */}
        {uniqueBadges.length > 0 && (
          <div className="w-full bg-amber-50/70 rounded-2xl p-4 border border-amber-200 mb-6 text-left">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                Megszerzett jelvényeid
              </span>
            </div>

            <div className="space-y-2.5">
              {uniqueBadges.map((badgeKey) => {
                const b = BADGES[badgeKey];
                return (
                  <div
                    key={badgeKey}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 border border-amber-200 shadow-xs"
                  >
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-amber-950 text-sm sm:text-base">
                        {b.title}
                      </h4>
                      <p className="text-xs text-stone-600">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              playSoftClick();
              onRestartAll();
            }}
            className="w-full min-h-[58px] rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl shadow-lg border-2 border-emerald-300 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-6 h-6" />
            <span>Új játék az 1. szinttől</span>
          </button>

          <button
            onClick={() => {
              playSoftClick();
              onBackToHome();
            }}
            className="w-full min-h-[50px] rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base border border-stone-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Home className="w-5 h-5" />
            <span>Vissza a kezdőlapra</span>
          </button>
        </div>
      </div>
    </div>
  );
};
