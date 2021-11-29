import * as React from 'react';
import { Song, Track, Instrument } from 'reactronica';

import DAWStepsEditor from '../DAWStepsEditor';
import { StepIndexContext } from '../../contexts/StepIndexContext';
import LZUTF8 from 'LZUTF8';

type Props = {
  className?: string;
};

const StepsEditorExample: React.FunctionComponent<Props> = ({ className }) => {
  const [currentSteps, setCurrentSteps] = React.useState([
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
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'Stop' : 'Play'}</button>

      <br />
      <br />

      <DAWStepsEditor
        subdivision={8}
        steps={currentSteps}
        startNote="C3"
        endNote="B3"
        disableScrollIntoView={true}
        onStepEditorChange={(steps) => {
          setCurrentSteps(steps);
          var output = LZUTF8.compress(JSON.stringify(steps));
          console.log(output);

          var decompressed = LZUTF8.decompress(output);
          console.log(decompressed);
        }}
      />

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
