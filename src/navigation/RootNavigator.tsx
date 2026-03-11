import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import OnboardingNavigator from './OnboardingNavigator';
import AppDrawerNavigator from './AppDrawerNavigator';
import { useSettings } from '../hooks/useSettings';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const settings = useSettings();

  // While settings are loading, show onboarding
  // (settings will be null until DB is ready; DB readiness is gated by DatabaseProvider)
  const onboardingComplete = settings?.onboardingComplete ?? false;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {onboardingComplete ? (
        <Stack.Screen name="App" component={AppDrawerNavigator} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
    </Stack.Navigator>
  );
}
