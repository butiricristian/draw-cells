import { CanvasState } from './Canvas/reducers/canvas';
import { PresentationState } from './Presentation/reducers/presentations';
import { FramesState } from './Frames/reducers/frames';
import { SidebarsState } from './Sidebars/reducers/sidebars';
import { HomeState } from './Home/reducers';

export default interface State {
  sidebars: SidebarsState,
  frames: FramesState,
  presentations: PresentationState,
  canvas: CanvasState,
  home: HomeState
}