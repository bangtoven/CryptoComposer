import * as React from 'react';
import { Song, Track, Instrument, MidiNote } from 'reactronica';

import DAWStepsEditor from '../DAWStepsEditor';
import { StepIndexContext } from '../../contexts/StepIndexContext';
import { compress, decompress } from '../../models/Compression';

type Props = {
  className?: string;
};

const StepsEditorExample: React.FunctionComponent<Props> = ({ className }) => {
  const [currentSteps, setCurrentSteps] = React.useState<{ name: MidiNote }[][]>([
    [{ name: 'C3' }, { name: 'E3' }, { name: 'A3' }],
    null,
    [{ name: 'C3' }, { name: 'E3' }, { name: 'G3' }, { name: 'B3' }],
    null,
    [{ name: 'C3' }, { name: 'F3' }, { name: 'A3' }],
    null,
    [{ name: 'D3' }, { name: 'G3' }, { name: 'B3' }],
    null,
  ]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <StepIndexContext.Provider value={{ currentStepIndex }}>
      <DAWStepsEditor
        subdivision={8}
        steps={currentSteps}
        startNote="C3"
        endNote="C4"
        disableScrollIntoView={true}
        onStepEditorChange={(steps) => {
          setCurrentSteps(steps);
          const [hash, result] = compress(steps);
          console.log('hash:', hash);
          console.log(result);
          decompress(result);
        }}
      />

      <br />
      <br />
      <button style={{ width: 120, justifyContent: 'center' }} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
      </button>

      <Song isPlaying={isPlaying}>
        <Track
          steps={currentSteps}
          onStepPlay={(_, index) => {
            setCurrentStepIndex(index);
          }}
        >
          <Instrument type="synth"></Instrument>
        </Track>
      </Song>
    </StepIndexContext.Provider>
  );
};

export default StepsEditorExample;
