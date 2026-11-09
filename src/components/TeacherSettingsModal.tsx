import React from 'react';
import { X, Check, Clock, Volume2, Mic, RotateCcw } from 'lucide-react';
import { TeacherSettings } from '../types';
import { DEFAULT_SETTINGS } from '../data/concepts';
import { playSoftClick } from '../utils/audio';

interface TeacherSettingsModalProps {
  settings: TeacherSettings;
  onSave: (newSettings: TeacherSettings) => void;
  onClose: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [localSettings, setLocalSettings] = React.useState<TeacherSettings>({ ...settings });

  const handleToggleTimeLimit = () => {
    setLocalSettings((prev) => ({ ...prev, timeLimitEnabled: !prev.timeLimitEnabled }));
  };

  const handleToggleSpeech = () => {
    setLocalSettings((prev) => ({ ...prev, speechEnabled: !prev.speechEnabled }));
  };

  const handleToggleSoundEffects = () => {
    setLocalSettings((prev) => ({ ...prev, soundEffectsEnabled: !prev.soundEffectsEnabled }));
  };

  const handleDurationChange = (level: 1 | 2 | 3, delta: number) => {
    setLocalSettings((prev) => {
      const current = prev.levelDurations[level];
      const updated = Math.max(30, Math.min(600, current + delta));
      return {
        ...prev,
        levelDurations: {
          ...prev.levelDurations,
          [level]: updated,
        },
      };
    });
  };

  const handleResetDefaults = () => {
    setLocalSettings({ ...DEFAULT_SETTINGS });
  };

  const handleSaveAndClose = () => {
    playSoftClick();
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-amber-100/90 px-6 py-4 border-b-2 border-amber-200 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-950">Pedagógusi beállítások</h2>
              <p className="text-xs text-amber-800 font-semibold">Testreszabás az egyéni haladáshoz</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-amber-200/80 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            aria-label="Bezárás"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Time limit toggle */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Időkorlát használata</h3>
                  <p className="text-xs text-stone-600">
                    Kikapcsolva a gyermek nyugodt tempóban, időnyomás nélkül játszhat.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={localSettings.timeLimitEnabled}
                onClick={handleToggleTimeLimit}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  localSettings.timeLimitEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    localSettings.timeLimitEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Level Durations */}
            {localSettings.timeLimitEnabled && (
              <div className="pt-3 border-t border-amber-200/60 space-y-2.5">
                <p className="text-xs font-bold text-amber-950">Szintek időkerete (másodpercben):</p>
                {([1, 2, 3] as const).map((lvl) => (
                  <div
                    key={lvl}
                    className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-100"
                  >
                    <span className="text-sm font-bold text-stone-700">{lvl}. szint:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDurationChange(lvl, -15)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-lg flex items-center justify-center cursor-pointer"
                        title="-15 másodperc"
                      >
                        -
                      </button>
                      <span className="w-16 text-center font-extrabold text-amber-900 text-sm">
                        {localSettings.levelDurations[lvl]} mp
                      </span>
                      <button
                        onClick={() => handleDurationChange(lvl, 15)}
                        className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-lg flex items-center justify-center cursor-pointer"
                        title="+15 másodperc"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audio & Speech Toggles */}
          <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/80 space-y-4">
            <h3 className="font-bold text-stone-900 text-base">Hang és felolvasás</h3>

            {/* Felolvasás (TTS) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-700 flex items-center justify-center">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Utasítások felolvasása</h4>
                  <p className="text-xs text-stone-600">Magyar beszédhang támogatása (Web Speech API)</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={localSettings.speechEnabled}
                onClick={handleToggleSpeech}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  localSettings.speechEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    localSettings.speechEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hangjelzések (Sound cues) */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Finom hangjelzések</h4>
                  <p className="text-xs text-stone-600">Nyugodt, bátorító csengettyűk és koppintások</p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={localSettings.soundEffectsEnabled}
                onClick={handleToggleSoundEffects}
                className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  localSettings.soundEffectsEnabled ? 'bg-emerald-600' : 'bg-stone-300'
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${
                    localSettings.soundEffectsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 text-stone-600 hover:text-stone-900 text-sm font-semibold hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Alapértékek</span>
          </button>

          <button
            onClick={handleSaveAndClose}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-md flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-5 h-5" />
            <span>Mentés és visszatérés</span>
          </button>
        </div>
      </div>
    </div>
  );
};
