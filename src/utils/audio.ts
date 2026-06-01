/**
 * High-end Auditory Interaction Engine (Web Audio API Synthesizer)
 * Synthesizes pure, retro luxury auditory tones for ice cream scoops, sauce drizzles, and AI predictions.
 */

// Safe helper to check window for audio support
const getsAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  return AudioCtx ? new AudioContext() : null;
};

let audioCtx: AudioContext | null = null;

const initCtx = () => {
  if (!audioCtx) {
    audioCtx = getsAudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Bubble plop sound (Ideal for checklist choices, toggling, or selecting cups)
 */
export const playBubbleSound = () => {
  const ctx = initCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Soft frequency ramp-up representing expanding bubble
  const startTime = ctx.currentTime;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(800, startTime + 0.12);

  gainNode.gain.setValueAtTime(0.15, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

  osc.start(startTime);
  osc.stop(startTime + 0.16);
};

/**
 * Soft plop/impact sound (Ideal for ice cream scoop layer placement)
 */
export const playScoopDropSound = () => {
  const ctx = initCtx();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const noise = ctx.createOscillator(); // Or a custom lowfreq sweep
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  const startTime = ctx.currentTime;
  osc.type = 'triangle';
  // Creamy fat low frequency impact
  osc.frequency.setValueAtTime(220, startTime);
  osc.frequency.exponentialRampToValueAtTime(70, startTime + 0.2);

  gainNode.gain.setValueAtTime(0.25, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

  osc.start(startTime);
  osc.stop(startTime + 0.26);
};

/**
 * Clear crystal glass chime sound (Ideal for adding items, finishing order lists, or successfully custom crafting)
 */
export const playCrystalChime = () => {
  const ctx = initCtx();
  if (!ctx) return;

  // We play a beautiful chord of high-end frequencies to resemble European glass tableware chime
  const frequencies = [880, 1100, 1320, 1760];
  const startTime = ctx.currentTime;

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);
    
    // Slight modulation per chord note for organic flavor
    osc.frequency.linearRampToValueAtTime(freq + (idx * 5), startTime + 0.4);

    const individualVolume = 0.08 / frequencies.length;
    gainNode.gain.setValueAtTime(individualVolume, startTime);
    // Metallic ring decay
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6 + (idx * 0.1));

    osc.start(startTime);
    osc.stop(startTime + 0.8 + (idx * 0.1));
  });
};

/**
 * Elegant wind-chime/celestial sweep (Ideal for AI Oracle generation, loading status, or quiz results)
 */
export const playSwooshSound = () => {
  const ctx = initCtx();
  if (!ctx) return;

  const startTime = ctx.currentTime;
  const duration = 1.2;

  const osc = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(260, startTime);
  osc.frequency.exponentialRampToValueAtTime(1200, startTime + duration);

  filter.type = 'peaking';
  filter.frequency.setValueAtTime(500, startTime);
  filter.frequency.linearRampToValueAtTime(2500, startTime + duration);
  filter.Q.setValueAtTime(3, startTime);

  gainNode.gain.setValueAtTime(0.08, startTime);
  gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.2);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
};
