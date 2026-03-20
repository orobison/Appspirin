import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { PlanStackParamList, DrawerParamList } from './types';
import PlanHubScreen from '../screens/plan/PlanHubScreen';
import CheckInScreen from '../screens/checkin/CheckInScreen';
import EditWarningSignsScreen from '../screens/plan/EditWarningSignsScreen';
import EditCopingStrategiesScreen from '../screens/plan/EditCopingStrategiesScreen';
import EditPeopleScreen from '../screens/plan/EditPeopleScreen';
import EditCrisisResourcesScreen from '../screens/plan/EditCrisisResourcesScreen';

const Stack = createNativeStackNavigator<PlanStackParamList>();

function HamburgerButton() {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.hamburger}
      accessibilityRole="button"
      accessibilityLabel="Open navigation menu"
    >
      <Text style={styles.hamburgerIcon}>☰</Text>
    </TouchableOpacity>
  );
}

export default function PlanStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="PlanHub"
        component={PlanHubScreen}
        options={{ title: 'My Safety Plan', headerLeft: () => <HamburgerButton /> }}
      />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Check In' }} />
      <Stack.Screen
        name="EditWarningSigns"
        component={EditWarningSignsScreen}
        options={{ title: 'Warning Signs' }}
      />
      <Stack.Screen
        name="EditCopingStrategies"
        component={EditCopingStrategiesScreen}
        options={{ title: 'Coping Strategies' }}
      />
      <Stack.Screen
        name="EditPeople"
        component={EditPeopleScreen}
        options={{ title: 'People' }}
      />
      <Stack.Screen
        name="EditCrisisResources"
        component={EditCrisisResourcesScreen}
        options={{ title: 'Crisis Resources' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  hamburgerIcon: {
    fontSize: 20,
  },
});
