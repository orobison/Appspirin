import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from './types';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import QuickSetupScreen from '../screens/onboarding/QuickSetupScreen';
import WalkThroughScreen from '../screens/onboarding/WalkThroughScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="QuickSetup" component={QuickSetupScreen} />
      <Stack.Screen name="WalkThrough" component={WalkThroughScreen} />
    </Stack.Navigator>
  );
}
