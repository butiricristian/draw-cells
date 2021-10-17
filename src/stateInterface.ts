import { PresentationState } from './Presentation/reducers/presentations';
import { FramesState } from './Frames/reducers/frames';
import { SidebarsState } from './Sidebars/reducers/sidebars';

export default interface State {
  sidebars: SidebarsState,
  frames: FramesState,
  presentations: PresentationState
}