
export interface HeartProps {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
}

export enum GameState {
  PROPOSING = 'PROPOSING',
  PUZZLE = 'PUZZLE',
  CELEBRATING = 'CELEBRATING'
}
