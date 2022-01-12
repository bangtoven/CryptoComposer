import * as React from 'react';
import { Song, Track, Instrument, MidiNote, StepNoteType } from 'reactronica';
import DAWStepsEditor from '../DAWStepsEditor';
import { StepIndexContext } from '../../contexts/StepIndexContext';
import { Button } from 'react-bootstrap';
import Text from '../Text';
import { compress } from '../../models/Compression';

type Props = {
  className?: string;
  onStepEditorChange?: (data: Uint8Array) => void;
};

const StepsEditor: React.FunctionComponent<Props> = ({ className, onStepEditorChange }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [stepsData, setStepsData] = React.useState(new Uint8Array());

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
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  return (
    <StepIndexContext.Provider value={{ currentStepIndex }}>
      <Button
        style={{ margin: 10, width: 120, justifyContent: 'center', borderColor: 'white' }}
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? '⏸️ Stop' : '▶ Play'}
      </Button>

      <Text t6 color="gray">
        Notes data: {stepsData}
      </Text>

      <DAWStepsEditor
        subdivision={8}
        steps={currentSteps}
        startNote="C4"
        endNote="C5"
        disableScrollIntoView={true}
        onStepEditorChange={(steps) => {
          setCurrentSteps(steps);
          const [hash, data] = compress(steps);
          console.log('hash:', hash);
          console.log('data', data);
          setStepsData(data);
          if (onStepEditorChange) {
            onStepEditorChange(data);
          }
        }}
      />

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
