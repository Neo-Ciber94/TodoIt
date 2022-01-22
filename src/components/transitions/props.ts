export interface TransitionProps {
  children?: React.ReactElement;
  duration?: number;
  in: boolean;
  onEnter?: () => {};
  onExited?: () => {};
}
