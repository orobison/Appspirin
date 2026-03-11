import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import PathSelectionScreen from '../screens/onboarding/PathSelectionScreen';
import ScanScreen from '../screens/onboarding/ScanScreen';
import ReviewScreen from '../screens/onboarding/ReviewScreen';
import QuickSetupScreen from '../screens/onboarding/QuickSetupScreen';
import WalkThroughScreen from '../screens/onboarding/WalkThroughScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PathSelection" component={PathSelectionScreen} />
      <Stack.Screen name="QuickSetup" component={QuickSetupScreen} />
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="WalkThrough" component={WalkThroughScreen} />
    </Stack.Navigator>
  );
}
