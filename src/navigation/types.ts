import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Onboarding: undefined;
  App: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  PathSelection: undefined;
  QuickSetup: undefined;
  Scan: undefined;
  Review: { ocrResult?: string };
  WalkThrough: undefined;
};

export type DrawerParamList = {
  PlanStack: NavigatorScreenParams<PlanStackParamList> | undefined;
  CheckInHistory: undefined;
  CrisisLineSettings: undefined;
  AppAppearance: undefined;
  AboutPrivacy: undefined;
};

export type PlanStackParamList = {
  PlanHub: undefined;
  CheckIn: { checkInId?: string };
  EditWarningSigns: undefined;
  EditCopingStrategies: undefined;
  EditPeople: undefined;
  EditCrisisResources: undefined;
};
