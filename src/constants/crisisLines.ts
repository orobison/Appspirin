export interface CrisisLineData {
  name: string;
  phone: string | null;
  textNumber: string | null;
  displayOrder: number;
}

export const DEFAULT_CRISIS_LINES: CrisisLineData[] = [
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    textNumber: '988',
    displayOrder: 1,
  },
  {
    name: 'Crisis Text Line',
    phone: null,
    textNumber: 'HOME to 741741',
    displayOrder: 2,
  },
  {
    name: 'Veterans Crisis Line',
    phone: '988',
    textNumber: '838255',
    displayOrder: 3,
  },
  {
    name: 'The Trevor Project',
    phone: '1-866-488-7386',
    textNumber: 'START to 678-678',
    displayOrder: 4,
  },
  {
    name: 'Trans Lifeline',
    phone: '877-565-8860',
    textNumber: null,
    displayOrder: 5,
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-4357',
    textNumber: null,
    displayOrder: 6,
  },
];
