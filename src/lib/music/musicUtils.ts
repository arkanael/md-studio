import { MDSong, FMInstrument, PSGToneInstrument, PSGNoiseInstrument } from "./musicTypes";

/**
 * Calculates the total length of a song in seconds based on tempo and sequence
 */
export function calculateSongDuration(song: MDSong): number {
  let totalTicks = 0;
  song.fmChannels.forEach(channel => {
    channel.sequence.forEach(patternId => {
      const pattern = channel.patterns[patternId];
      if (pattern) totalTicks += pattern.length;
    });
  });
  // Simplified calculation: (ticks / ticksPerBeat) / (tempo / 60)
  return (totalTicks / song.ticksPerBeat) / (song.tempo / 60);
}

/**
 * Validates FM instrument parameters for YM2612 chip constraints
 */
export function validateFMInstrument(inst: FMInstrument): string[] {
  const errors: string[] = [];
  if (inst.algorithm < 0 || inst.algorithm > 7) errors.push("Algorithm must be 0-7");
  if (inst.feedback < 0 || inst.feedback > 7) errors.push("Feedback must be 0-7");
  
  inst.operators.forEach((op, i) => {
    if (op.totalLevel < 0 || op.totalLevel > 127) errors.push(`Op ${i+1}: Total Level must be 0-127`);
    if (op.multiple < 0 || op.multiple > 15) errors.push(`Op ${i+1}: Multiple must be 0-15`);
  });
  
  return errors;
}

/**
 * Mock function to play a preview note (adapted from GB Studio)
 */
export function playNotePreview(chip: "YM2612" | "SN76489", note: number, instrumentId: string): void {
  console.log(`Playing note ${note} on ${chip} using instrument ${instrumentId}`);
}
