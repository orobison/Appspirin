export type RootStackParamList = {
  Onboarding: undefined;
  App: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  QuickSetup: undefined;
  WalkThrough: undefined;
};

export type DrawerParamList = {
  PlanStack: undefined;
  CheckInHistory: undefined;
  CrisisLineSettings: undefined;
  AppAppearance: undefined;
  AboutPrivacy: undefined;
};

export type PlanStackParamList = {
  PlanHub: undefined;
  CheckIn: { checkInId?: string };
};
