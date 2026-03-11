export interface EscalationStep {
  step: number;
  label: string;
  description: string;
  severityRange: 'low' | 'medium' | 'high';
}

export const ESCALATION_STEPS: EscalationStep[] = [
  {
    step: 1,
    label: 'Warning Signs',
    description: 'I can tell that a crisis may be developing because…',
    severityRange: 'low',
  },
  {
    step: 2,
    label: 'Internal Coping Strategies',
    description: 'Things I can do on my own to help distract myself…',
    severityRange: 'low',
  },
  {
    step: 3,
    label: 'People & Settings for Distraction',
    description: 'People and social settings that provide distraction…',
    severityRange: 'low',
  },
  {
    step: 4,
    label: 'People I Can Ask for Help',
    description: 'People I can ask for help…',
    severityRange: 'medium',
  },
  {
    step: 5,
    label: 'Professionals & Agencies to Contact',
    description: 'Professionals or agencies I can contact during a crisis…',
    severityRange: 'medium',
  },
  {
    step: 6,
    label: 'Making the Environment Safe',
    description: 'Making the environment safe…',
    severityRange: 'high',
  },
];
