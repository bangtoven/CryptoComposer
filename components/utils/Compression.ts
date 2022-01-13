import { StepNoteType } from 'reactronica';
import { midiNotes } from '../DAWStepsEditor/midiConfig';
import LZUTF8 from 'lzutf8';
import CryptoJS from 'crypto-js';

const baseNoteIndex = midiNotes.indexOf('C4');

export function compress(notes: StepNoteType[][]): [string, Uint8Array] {
  const hash = CryptoJS.SHA256(JSON.stringify(notes)).toString(CryptoJS.enc.Hex);
  if (!notes) {
    return [hash, new Uint8Array()];
  }

  const numbers = notes.map((step) => {
    if (!step) return [];
    return step.map((note) => midiNotes.indexOf(note.name) - baseNoteIndex);
  });

  const result = LZUTF8.compress(numbers.join('|'));

  return [hash, result];
}

export function decompress(data: Uint8Array): StepNoteType[][] {
  if (!data.length) return [];

  const decompressed = LZUTF8.decompress(data);
  const numbers = decompressed.split('|').map((step) => {
    return step.split(',').map((note) => parseInt(note) + baseNoteIndex);
  });

  const result = numbers.map((step) =>
    step.map((note) => {
      return {
        name: midiNotes[note],
      };
    }),
  );
  return result;
}
