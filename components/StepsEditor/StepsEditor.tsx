import * as React from 'react';
import { Song, Track, Instrument, MidiNote, StepNoteType } from 'reactronica';
import DAWStepsEditor from '../DAWStepsEditor';
import { StepIndexContext } from '../DAWStepsEditor/StepIndexContext';
import { Button } from 'react-bootstrap';
import Text from '../Text';
import { compress } from '../utils/Compression';

type Props = {
  className?: string;
  stepsData: { name: MidiNote }[][];
  onStepEditorChange?: (data: Uint8Array) => void;
};

const StepsEditor: React.FunctionComponent<Props> = ({ className, stepsData, onStepEditorChange }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [compressedStepsData, setCompressedStepsData] = React.useState(new Uint8Array());

  const [currentSteps, setCurrentSteps] = React.useState<{ name: MidiNote }[][]>(stepsData);
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
        Notes data: {compressedStepsData}
      </Text>

      <DAWStepsEditor
        subdivision={8}
        steps={currentSteps}
        startNote="C4"
        endNote="C5"
        disableScrollIntoView={true}
        onStepEditorChange={(steps) => {
          setCurrentSteps(steps);
          const [, data] = compress(steps);
          setCompressedStepsData(data);
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
