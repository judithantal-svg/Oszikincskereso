/**
 * Procedural Audio & Web Speech synthesis for "Őszi kincskereső"
 * - Gentle, warm Web Audio API chimes (No harsh buzzers or error sounds)
 * - Hungarian Web Speech API reader with graceful fallback
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Gentle pentatonic progression: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
  const notes = [523.25, 659.25, 783.99, 1046.5];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.001, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.2, now + idx * 0.08 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.5);
  });
}

export function playGentleHint() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Soft wooden marimba-like double tap: F4 (349.2), G4 (392.0)
  const notes = [349.23, 392.0];

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0.001, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.28);
  });
}

export function playCelebrationFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Joyful arpeggio
  const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5];

  chords.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);

    gain.gain.setValueAtTime(0.001, now + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.25, now + idx * 0.1 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.65);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.7);
  });
}

export function playSoftClick() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

// Web Speech API
let cachedHuVoice: SpeechSynthesisVoice | null = null;

function getHungarianVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedHuVoice) return cachedHuVoice;

  const voices = window.speechSynthesis.getVoices();
  // Find Hungarian voice
  const huVoice = voices.find(
    (v) => v.lang.toLowerCase().includes('hu') || v.lang.toLowerCase() === 'hu-hu'
  );
  if (huVoice) {
    cachedHuVoice = huVoice;
    return huVoice;
  }
  return null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedHuVoice = null;
    getHungarianVoice();
  };
}

export function speakText(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hu-HU';
    utterance.rate = 0.92; // Slightly measured, clear tempo for young learners
    utterance.pitch = 1.05; // Friendly, warm tone

    const voice = getHungarianVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
