import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanStackParamList } from './types';
import PlanHubScreen from '../screens/plan/PlanHubScreen';
import CheckInScreen from '../screens/checkin/CheckInScreen';

const Stack = createNativeStackNavigator<PlanStackParamList>();

export default function PlanStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PlanHub" component={PlanHubScreen} options={{ title: 'My Safety Plan' }} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check In' }} />
    </Stack.Navigator>
  );
}
