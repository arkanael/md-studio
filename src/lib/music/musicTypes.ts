// musicTypes.ts — MD Studio (adapted from GB Studio)
// Covers: music tracks, sound effects, instrument types
// Adapted for SGDK/Mega Drive — YM2612 FM + SN76489 PSG sound chips

// ─── Sound chip types ────────────────────────────────────────────────────────

/** The Mega Drive has two sound chips */
export type MDSoundChip = "YM2612" | "SN76489";

/** YM2612 FM channels (6 total, channel 6 can be DAC/PCM) */
export type YM2612Channel = 1 | 2 | 3 | 4 | 5 | 6;

/** SN76489 PSG channels (3 tone + 1 noise) */
export type SN76489Channel = "tone1" | "tone2" | "tone3" | "noise";

// ─── Instrument types ────────────────────────────────────────────────────────

/** FM Operator configuration (YM2612 has 4 operators per channel) */
export interface FMOperator {
  /** Total Level (volume attenuation): 0-127 */
  totalLevel: number;
  /** Multiple (frequency multiplier): 0-15 */
  multiple: number;
  /** Detune: 0-7 */
  detune: number;
  /** Rate Scaling: 0-3 */
  rateScaling: number;
  /** Attack Rate: 0-31 */
  attackRate: number;
  /** Decay Rate (1st): 0-31 */
  decayRate1: number;
  /** Sustain Level: 0-15 */
  sustainLevel: number;
  /** Decay Rate (2nd / Sustain Rate): 0-31 */
  decayRate2: number;
  /** Release Rate: 0-15 */
  releaseRate: number;
  /** Amplitude Modulation sensitivity: boolean */
  ampModSensitivity: boolean;
}

/** YM2612 FM Instrument (4 operators + algorithm + feedback) */
export interface FMInstrument {
  id: string;
  name: string;
  /** Algorithm: 0-7 (defines operator routing) */
  algorithm: number;
  /** Feedback: 0-7 */
  feedback: number;
  /** FM stereo output: 0=none, 1=right, 2=left, 3=both */
  stereo: 0 | 1 | 2 | 3;
  /** LFO Frequency Modulation sensitivity: 0-7 */
  fmSensitivity: number;
  /** LFO Amplitude Modulation sensitivity: 0-3 */
  amSensitivity: number;
  operators: [FMOperator, FMOperator, FMOperator, FMOperator];
}

/** PSG Tone instrument (SN76489 square wave) */
export interface PSGToneInstrument {
  id: string;
  name: string;
  /** Volume envelope: array of 0-15 attenuation values */
  volumeEnvelope: number[];
}

/** PSG Noise instrument (SN76489 noise channel) */
export interface PSGNoiseInstrument {
  id: string;
  name: string;
  /** Noise mode: 0=periodic, 1=white */
  noiseMode: 0 | 1;
  /** Noise frequency shift: 0-3 (3=uses tone3 freq) */
  frequencyShift: 0 | 1 | 2 | 3;
  /** Volume envelope: array of 0-15 values */
  volumeEnvelope: number[];
}

// ─── Track/Song types ────────────────────────────────────────────────────────

/** A single note event in a track pattern */
export interface NoteEvent {
  /** Tick position within the pattern */
  tick: number;
  /** MIDI note number 0-127 (0 = silence/off) */
  note: number;
  /** Volume 0-15 (optional override) */
  volume?: number;
  /** Instrument id to use (optional override) */
  instrumentId?: string;
}

/** One pattern (measure) in a track channel */
export interface TrackPattern {
  id: string;
  /** Number of ticks per pattern (default 64) */
  length: number;
  notes: NoteEvent[];
}

/** A single channel track in the song */
export interface TrackChannel {
  /** Which chip this channel belongs to */
  chip: MDSoundChip;
  /** Channel number/name on the chip */
  channel: YM2612Channel | SN76489Channel;
  /** Ordered list of pattern IDs */
  sequence: string[];
  /** Patterns available for this channel (id -> pattern) */
  patterns: Record<string, TrackPattern>;
  /** Whether this channel is muted in preview */
  muted: boolean;
  /** Instrument id assigned to this channel */
  instrumentId: string | null;
}

/** A full song/track */
export interface MDSong {
  id: string;
  name: string;
  /** File path relative to project */
  filePath: string | null;
  /** Ticks per minute (tempo) */
  tempo: number;
  /** Ticks per beat subdivision */
  ticksPerBeat: number;
  /** YM2612 FM channels (up to 6) */
  fmChannels: TrackChannel[];
  /** SN76489 PSG channels (up to 4) */
  psgChannels: TrackChannel[];
}

// ─── Sound effect types ───────────────────────────────────────────────────────

/** Source chip for a sound effect */
export type SFXChip = MDSoundChip | "PCM";

/** A single sound effect asset */
export interface MDSoundEffect {
  id: string;
  name: string;
  /** Which chip plays this SFX */
  chip: SFXChip;
  /** File path relative to project (VGM, WAV for PCM) */
  filePath: string | null;
  /** Duration in milliseconds */
  durationMs: number;
}

// ─── Music data packet (IPC messaging, adapted from GB Studio) ────────────────

/** Messages sent TO the music worker */
export type MusicDataPacket =
  | { action: "initialized" }
  | { action: "load-song"; song: MDSong }
  | { action: "load-sound"; soundId: string }
  | { action: "loaded" }
  | { action: "play"; song: MDSong; position?: [number, number] }
  | { action: "play-sound"; soundId: string }
  | { action: "stop"; position?: [number, number] }
  | { action: "position"; position: [number, number] }
  | { action: "preview"; chip: MDSoundChip; note: number; instrumentId: string }
  | { action: "set-mute"; chip: MDSoundChip; channel: YM2612Channel | SN76489Channel; muted: boolean }
  | { action: "muted"; channels: boolean[] }
  | { action: "update"; update: [number, number] }
  | { action: "log"; message: string };

/** Messages received FROM the music worker */
export type MusicDataReceivePacket =
  | { action: "initialized" }
  | { action: "log"; message: string }
  | { action: "loaded" }
  | { action: "update"; update: [number, number] }
  | { action: "muted"; channels: boolean[] };

// ─── Full music assets collection ────────────────────────────────────────────

export interface MusicAssets {
  songs: MDSong[];
  soundEffects: MDSoundEffect[];
  fmInstruments: FMInstrument[];
  psgToneInstruments: PSGToneInstrument[];
  psgNoiseInstruments: PSGNoiseInstrument[];
}

export function createEmptyMusicAssets(): MusicAssets {
  return {
    songs: [],
    soundEffects: [],
    fmInstruments: [],
    psgToneInstruments: [],
    psgNoiseInstruments: [],
  };
}

// ─── Default FM operator ──────────────────────────────────────────────────────

export function createDefaultFMOperator(): FMOperator {
  return {
    totalLevel: 40,
    multiple: 1,
    detune: 0,
    rateScaling: 0,
    attackRate: 31,
    decayRate1: 0,
    sustainLevel: 0,
    decayRate2: 0,
    releaseRate: 7,
    ampModSensitivity: false,
  };
}

/** Creates a default 4-operator FM instrument */
export function createDefaultFMInstrument(id: string, name: string): FMInstrument {
  return {
    id,
    name,
    algorithm: 4,
    feedback: 0,
    stereo: 3,
    fmSensitivity: 0,
    amSensitivity: 0,
    operators: [
      createDefaultFMOperator(),
      createDefaultFMOperator(),
      createDefaultFMOperator(),
      createDefaultFMOperator(),
    ],
  };
}

/** Creates a default PSG tone instrument */
export function createDefaultPSGToneInstrument(id: string, name: string): PSGToneInstrument {
  return {
    id,
    name,
    volumeEnvelope: [0, 0, 0, 2, 4, 6, 8, 10, 12, 15],
  };
}

/** Creates a default MDSong */
export function createDefaultSong(id: string, name: string): MDSong {
  return {
    id,
    name,
    filePath: null,
    tempo: 120,
    ticksPerBeat: 24,
    fmChannels: [],
    psgChannels: [],
  };
}
