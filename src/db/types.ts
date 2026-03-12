// Input interfaces for all CRUD operations

// WarningSign
export interface CreateWarningSignInput {
  text: string;
  displayOrder: number;
  active?: boolean;
}

export interface UpdateWarningSignInput {
  text?: string;
  displayOrder?: number;
  active?: boolean;
}

// CopingStrategy
export type CopingStrategySection = 'internal' | 'distraction' | 'environment';

export interface CreateCopingStrategyInput {
  text: string;
  displayOrder: number;
  section: CopingStrategySection;
}

export interface UpdateCopingStrategyInput {
  text?: string;
  displayOrder?: number;
  section?: CopingStrategySection;
}

// Contact
export type ContactType = 'distraction' | 'personal' | 'professional';

export interface CreateContactInput {
  name: string;
  phone: string;
  relationship?: string;
  contactType: ContactType;
  displayOrder: number;
}

export interface UpdateContactInput {
  name?: string;
  phone?: string;
  relationship?: string;
  contactType?: ContactType;
  displayOrder?: number;
}

// CrisisResource
export interface CreateCrisisResourceInput {
  name: string;
  phone?: string;
  textNumber?: string;
  isSelected?: boolean;
  displayOrder: number;
  isCustom?: boolean;
}

export interface UpdateCrisisResourceInput {
  name?: string;
  phone?: string;
  textNumber?: string;
  isSelected?: boolean;
  displayOrder?: number;
}

// CheckIn
export interface CheckInResponseInput {
  warningSignId: string;
  endorsed: boolean;
}

export interface CreateCheckInInput {
  timestamp: number;
  severityScore: number;
  notes?: string;
  responses: CheckInResponseInput[];
}

export interface UpdateCheckInInput {
  severityScore?: number;
  notes?: string;
}

// UserSettings
export type ThemePreference = 'light' | 'dark' | 'system';
export type CheckInFrequency = 'daily' | 'weekly' | 'off';
export type OnboardingPath = 'quick' | 'walkthrough';

export interface UpdateUserSettingsInput {
  theme?: ThemePreference;
  checkInFrequency?: CheckInFrequency;
  checkInTimes?: string[];
  nudgeThreshold?: number;
  onboardingComplete?: boolean;
  onboardingPath?: OnboardingPath | null;
}

// TextTemplate
export interface CreateTextTemplateInput {
  text: string;
  isDefault?: boolean;
  displayOrder: number;
}

export interface UpdateTextTemplateInput {
  text?: string;
  isDefault?: boolean;
  displayOrder?: number;
}
