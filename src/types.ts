export interface Core10Item {
  id: number;
  text: string;
  explanation: string;
  related15Points: string[];
}

export type Score = 0 | 1 | 2 | -1 | null;

export interface VideoData {
  id: string;
  title: string;
  src: string;
  explanation: string;
  itemExplanations?: Record<number, string>;
}
