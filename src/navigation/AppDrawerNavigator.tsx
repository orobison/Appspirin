import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import PlanStackNavigator from './PlanStackNavigator';
import CheckInHistoryScreen from '../screens/checkin/CheckInHistoryScreen';
import CrisisLineSettingsScreen from '../screens/settings/CrisisLineSettingsScreen';
import AppAppearanceScreen from '../screens/settings/AppAppearanceScreen';
import AboutPrivacyScreen from '../screens/settings/AboutPrivacyScreen';

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="PlanStack"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="PlanStack"
        component={PlanStackNavigator}
        options={{ drawerLabel: 'Safety Plan', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="CheckInHistory"
        component={CheckInHistoryScreen}
        options={{ drawerLabel: 'Check-In History' }}
      />
      <Drawer.Screen
        name="CrisisLineSettings"
        component={CrisisLineSettingsScreen}
        options={{ drawerLabel: 'Crisis Line Settings' }}
      />
      <Drawer.Screen
        name="AppAppearance"
        component={AppAppearanceScreen}
        options={{ drawerLabel: 'App Appearance' }}
      />
      <Drawer.Screen
        name="AboutPrivacy"
        component={AboutPrivacyScreen}
        options={{ drawerLabel: 'About & Privacy' }}
      />
    </Drawer.Navigator>
  );
}
