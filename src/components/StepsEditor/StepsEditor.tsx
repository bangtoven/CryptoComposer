import * as React from 'react';
import { Song, Track, Instrument, MidiNote } from 'reactronica';

import DAWStepsEditor from '../DAWStepsEditor';
import { StepIndexContext } from '../../contexts/StepIndexContext';
import { compress, decompress } from '../../models/Compression';

type Props = {
  className?: string;
};

const StepsEditor: React.FunctionComponent<Props> = ({ className }) => {
  const [currentSteps, setCurrentSteps] = React.useState<{ name: MidiNote }[][]>([
    [{ name: 'C4' }, { name: 'E4' }],
    [{ name: 'E4' }],
    [{ name: 'F4' }],
    [{ name: 'G4' }],
    [{ name: 'D4' }, { name: 'G4' }],
    [{ name: 'F4' }],
    [{ name: 'E4' }],
    [{ name: 'D4' }],
  ]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <StepIndexContext.Provider value={{ currentStepIndex }}>
      <DAWStepsEditor
        subdivision={8}
        steps={currentSteps}
        startNote="C4"
        endNote="C5"
        disableScrollIntoView={true}
        onStepEditorChange={(steps) => {
          setCurrentSteps(steps);
          const [hash, result] = compress(steps);
          console.log('hash:', hash);
          console.log('result', result);
          decompress(result);
        }}
      />

      <br />
      <br />
      <button style={{ width: 120, justifyContent: 'center' }} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <Song isPlaying={isPlaying} bpm={100}>
        <Track
          steps={currentSteps}
          onStepPlay={(_, index) => {
            setCurrentStepIndex(index);
          }}
        >
          <Instrument type="synth" oscillator={{ type: 'triangle' }}></Instrument>
        </Track>
      </Song>
    </StepIndexContext.Provider>
  );
};

export default StepsEditor;
