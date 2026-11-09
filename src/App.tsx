import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ConceptId,
  ConceptItem,
  TeacherSettings,
  LevelStats,
  BadgeType,
  GameView,
  ChoiceLog,
} from './types';
import {
  CONCEPTS,
  LEVEL_CONCEPTS,
  DEFAULT_SETTINGS,
} from './data/concepts';
import { CardsGrid2D } from './components/CardsGrid2D';
import { StartScreen } from './components/StartScreen';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { GameHUD } from './components/GameHUD';
import { FeedbackModal } from './components/FeedbackModal';
import { TimeUpModal } from './components/TimeUpModal';
import { LevelCompleteModal } from './components/LevelCompleteModal';
import { GameCompleteModal } from './components/GameCompleteModal';
import {
  speakText,
  stopSpeaking,
  playSuccessChime,
  playGentleHint,
} from './utils/audio';

export default function App() {
  // Game Navigation State
  const [currentView, setCurrentView] = useState<GameView>('start');
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Settings
  const [settings, setSettings] = useState<TeacherSettings>(DEFAULT_SETTINGS);

  // Current Level State
  const [currentLevelNumber, setCurrentLevelNumber] = useState<number>(1);
  const [levelConceptIds, setLevelConceptIds] = useState<ConceptId[]>(LEVEL_CONCEPTS[1]);
  const [remainingTargetIds, setRemainingTargetIds] = useState<ConceptId[]>([]);
  const [currentTargetId, setCurrentTargetId] = useState<ConceptId | null>(null);
  const [foundIds, setFoundIds] = useState<ConceptId[]>([]);

  // Scores & Attempts
  const [levelScore, setLevelScore] = useState<number>(0);
  const [totalAccumulatedScore, setTotalAccumulatedScore] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<number>(DEFAULT_SETTINGS.levelDurations[1]);
  const [isRestartedAttempt, setIsRestartedAttempt] = useState<boolean>(false);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Attempt History for Badges & Personalized Feedback
  const [choiceLogs, setChoiceLogs] = useState<ChoiceLog[]>([]);
  const [wrongCountThisAttempt, setWrongCountThisAttempt] = useState<number>(0);
  const [firstTrySuccesses, setFirstTrySuccesses] = useState<ConceptId[]>([]);
  const [currentAttemptFailedTargets, setCurrentAttemptFailedTargets] = useState<Set<ConceptId>>(new Set());
  const [lastFinishedLevelStats, setLastFinishedLevelStats] = useState<LevelStats | null>(null);
  const [collectedBadges, setCollectedBadges] = useState<BadgeType[]>([]);

  // Active Feedback Modal (When user taps a sphere)
  const [activeFeedback, setActiveFeedback] = useState<{
    isCorrect: boolean;
    target: ConceptItem;
    selected: ConceptItem;
  } | null>(null);

  // Timer interval ref
  const timerRef = useRef<number | null>(null);

  // Shuffle helper
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  // Start or Initialize a level
  const startLevel = useCallback(
    (lvlNum: number, isRetry: boolean = false) => {
      stopSpeaking();
      setCurrentLevelNumber(lvlNum);
      const concepts = LEVEL_CONCEPTS[lvlNum] || LEVEL_CONCEPTS[1];
      setLevelConceptIds(concepts);

      // Random search order for remaining items
      const shuffledTargets = shuffleArray(concepts);
      setRemainingTargetIds(shuffledTargets);
      setCurrentTargetId(shuffledTargets[0]);

      setFoundIds([]);
      setLevelScore(0);
      setIsRestartedAttempt(isRetry);
      setWrongCountThisAttempt(0);
      setFirstTrySuccesses([]);
      setCurrentAttemptFailedTargets(new Set());
      setChoiceLogs([]);
      setActiveFeedback(null);
      setIsTimeUp(false);
      setIsTimerPaused(false);

      const duration = settings.levelDurations[lvlNum as 1 | 2 | 3] || 120;
      setRemainingTime(duration);

      setCurrentView('playing');

      // Announce initial task with speech if enabled
      if (settings.speechEnabled && shuffledTargets[0]) {
        const item = CONCEPTS[shuffledTargets[0]];
        setTimeout(() => {
          speakText(`Keresd meg ${item.accusative}!`);
        }, 350);
      }
    },
    [settings]
  );

  // Timer Countdown Effect
  useEffect(() => {
    if (
      currentView !== 'playing' ||
      !settings.timeLimitEnabled ||
      isTimerPaused ||
      isTimeUp ||
      activeFeedback !== null
    ) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = window.setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentView, settings.timeLimitEnabled, isTimerPaused, isTimeUp, activeFeedback]);

  // Handle sphere selection (Click or Touch)
  const handleSelectSphere = useCallback(
    (selectedId: ConceptId) => {
      if (currentView !== 'playing' || activeFeedback !== null || isTimeUp) return;
      if (!currentTargetId) return;

      // Ignore already found items - rapid double clicks cannot give points
      if (foundIds.includes(selectedId)) return;

      const isCorrect = selectedId === currentTargetId;
      const targetItem = CONCEPTS[currentTargetId];
      const selectedItem = CONCEPTS[selectedId];

      // Pause timer during feedback reading
      setIsTimerPaused(true);

      // Record choice log
      const newLog: ChoiceLog = {
        targetId: currentTargetId,
        selectedId,
        isCorrect,
        timestamp: Date.now(),
      };
      setChoiceLogs((prev) => [...prev, newLog]);

      if (isCorrect) {
        // Sound cue
        if (settings.soundEffectsEnabled) {
          playSuccessChime();
        }

        // Award 10 points
        setLevelScore((prev) => prev + 10);

        // Track first try success
        if (!currentAttemptFailedTargets.has(currentTargetId)) {
          setFirstTrySuccesses((prev) => [...prev, currentTargetId]);
        }

        // Mark sphere as found
        setFoundIds((prev) => [...prev, currentTargetId]);

        // Open feedback modal
        setActiveFeedback({
          isCorrect: true,
          target: targetItem,
          selected: selectedItem,
        });
      } else {
        // Gentle hint sound (no harsh buzzer!)
        if (settings.soundEffectsEnabled) {
          playGentleHint();
        }

        setWrongCountThisAttempt((prev) => prev + 1);
        setCurrentAttemptFailedTargets((prev) => new Set(prev).add(currentTargetId));

        // Open feedback modal with explanation
        setActiveFeedback({
          isCorrect: false,
          target: targetItem,
          selected: selectedItem,
        });
      }
    },
    [currentView, activeFeedback, isTimeUp, currentTargetId, foundIds, currentAttemptFailedTargets, settings]
  );

  // Continue after feedback modal
  const handleContinueAfterFeedback = useCallback(() => {
    if (!activeFeedback) return;
    const wasCorrect = activeFeedback.isCorrect;
    setActiveFeedback(null);
    stopSpeaking();

    if (wasCorrect) {
      // Find remaining targets
      const nextRemaining = remainingTargetIds.filter((id) => id !== currentTargetId);
      setRemainingTargetIds(nextRemaining);

      if (nextRemaining.length === 0) {
        // Level Completed!
        const totalItems = levelConceptIds.length;
        const finalScore = levelScore; // Already updated with +10

        // Calculate badges earned
        const earnedBadges: BadgeType[] = [];
        if (wrongCountThisAttempt === 0) {
          earnedBadges.push('pontos_megfigyelo');
        }
        if (isRestartedAttempt) {
          earnedBadges.push('kitarto_felfedezo');
        }

        // Collect mistake pairs for feedback
        const mistakePairs: { target: ConceptId; chosen: ConceptId }[] = [];
        choiceLogs.forEach((l) => {
          if (!l.isCorrect) {
            mistakePairs.push({ target: l.targetId, chosen: l.selectedId });
          }
        });

        const stats: LevelStats = {
          levelNumber: currentLevelNumber,
          totalItems,
          foundItems: [...foundIds],
          wrongAttemptsCount: wrongCountThisAttempt,
          firstTrySuccesses: [...firstTrySuccesses],
          mistakePairs,
          isRestartedAttempt,
          earnedBadges,
          score: finalScore,
        };

        setLastFinishedLevelStats(stats);
        setTotalAccumulatedScore((prev) => prev + finalScore);
        if (earnedBadges.length > 0) {
          setCollectedBadges((prev) => [...prev, ...earnedBadges]);
        }

        setCurrentView('level_complete');
      } else {
        // Select next target from remaining
        const nextTarget = nextRemaining[0];
        setCurrentTargetId(nextTarget);
        setIsTimerPaused(false);

        // Announce next task
        if (settings.speechEnabled) {
          const item = CONCEPTS[nextTarget];
          speakText(`Keresd meg ${item.accusative}!`);
        }
      }
    } else {
      // Incorrect answer: resume timer and let child try again
      setIsTimerPaused(false);
      if (settings.speechEnabled && currentTargetId) {
        const item = CONCEPTS[currentTargetId];
        speakText(`Keresd meg ${item.accusative}!`);
      }
    }
  }, [
    activeFeedback,
    remainingTargetIds,
    currentTargetId,
    levelConceptIds.length,
    levelScore,
    wrongCountThisAttempt,
    isRestartedAttempt,
    choiceLogs,
    currentLevelNumber,
    foundIds,
    firstTrySuccesses,
    settings.speechEnabled,
  ]);

  // Replay speech instruction for current target
  const handleReplayInstruction = () => {
    if (currentTargetId) {
      const item = CONCEPTS[currentTargetId];
      speakText(`Keresd meg ${item.accusative}!`);
    }
  };

  // Time expired handlers
  const handleRetryAfterTimeUp = () => {
    setIsTimeUp(false);
    startLevel(currentLevelNumber, true); // true = restarted attempt
  };

  const handleContinueUntimed = () => {
    setIsTimeUp(false);
    setSettings((prev) => ({ ...prev, timeLimitEnabled: false }));
    setIsTimerPaused(false);
    if (settings.speechEnabled && currentTargetId) {
      const item = CONCEPTS[currentTargetId];
      speakText(`Keresd meg ${item.accusative}!`);
    }
  };

  // Next level navigation from LevelCompleteModal
  const handleGoToNextLevel = () => {
    if (currentLevelNumber < 3) {
      startLevel(currentLevelNumber + 1, false);
    } else {
      setCurrentView('all_complete');
    }
  };

  const handleRestartLevel = () => {
    startLevel(currentLevelNumber, true);
  };

  const handleBackToHome = () => {
    stopSpeaking();
    setCurrentView('start');
  };

  const handleRestartAll = () => {
    setTotalAccumulatedScore(0);
    setCollectedBadges([]);
    startLevel(1, false);
  };

  const currentTargetItem = currentTargetId ? CONCEPTS[currentTargetId] : null;
  const maxScoreForLevel = levelConceptIds.length * 10;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/70 select-none flex flex-col">
      {/* 2D Playing Meadow with Large Picture Cards */}
      <div className="relative w-full h-full flex flex-col pt-20 sm:pt-20 md:pt-24 pb-3 overflow-hidden">
        <CardsGrid2D
          conceptIds={levelConceptIds}
          foundIds={foundIds}
          onSelectCard={handleSelectSphere}
          disabled={currentView !== 'playing' || activeFeedback !== null || isTimeUp}
        />
      </div>

      {/* Start Screen */}
      {currentView === 'start' && (
        <StartScreen
          onStart={() => startLevel(1, false)}
          onOpenSettings={() => setShowSettingsModal(true)}
          speechEnabled={settings.speechEnabled}
          soundEffectsEnabled={settings.soundEffectsEnabled}
        />
      )}

      {/* Playing Active HUD */}
      {currentView === 'playing' && (
        <GameHUD
          levelNumber={currentLevelNumber}
          currentTarget={currentTargetItem}
          foundCount={foundIds.length}
          totalCount={levelConceptIds.length}
          score={levelScore}
          maxScore={maxScoreForLevel}
          remainingTime={remainingTime}
          timeLimitEnabled={settings.timeLimitEnabled}
          onReplaySpeech={handleReplayInstruction}
          onOpenSettings={() => setShowSettingsModal(true)}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Answer Feedback Modal (Stops timer while visible) */}
      {activeFeedback && (
        <FeedbackModal
          isCorrect={activeFeedback.isCorrect}
          targetConcept={activeFeedback.target}
          selectedConcept={activeFeedback.selected}
          speechEnabled={settings.speechEnabled}
          onContinue={handleContinueAfterFeedback}
        />
      )}

      {/* Time Up Calm Modal */}
      {isTimeUp && (
        <TimeUpModal
          speechEnabled={settings.speechEnabled}
          onRetry={handleRetryAfterTimeUp}
          onContinueUntimed={handleContinueUntimed}
        />
      )}

      {/* Level Complete Modal with Evidence-Based Personalized Observations */}
      {currentView === 'level_complete' && lastFinishedLevelStats && (
        <LevelCompleteModal
          stats={lastFinishedLevelStats}
          isLastLevel={currentLevelNumber === 3}
          speechEnabled={settings.speechEnabled}
          soundEffectsEnabled={settings.soundEffectsEnabled}
          onNextLevel={handleGoToNextLevel}
          onRetryLevel={handleRestartLevel}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Game Complete Modal (All 3 levels completed) */}
      {currentView === 'all_complete' && (
        <GameCompleteModal
          totalScore={totalAccumulatedScore}
          maxTotalScore={240} // 60 + 80 + 100
          allBadges={collectedBadges}
          speechEnabled={settings.speechEnabled}
          soundEffectsEnabled={settings.soundEffectsEnabled}
          onRestartAll={handleRestartAll}
          onBackToHome={handleBackToHome}
        />
      )}

      {/* Teacher Settings Modal */}
      {showSettingsModal && (
        <TeacherSettingsModal
          settings={settings}
          onSave={(newSettings) => setSettings(newSettings)}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </main>
  );
}
