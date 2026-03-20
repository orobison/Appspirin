import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { DrawerParamList } from './types';
import PlanStackNavigator from './PlanStackNavigator';
import CheckInHistoryScreen from '../screens/checkin/CheckInHistoryScreen';
import CrisisLineSettingsScreen from '../screens/settings/CrisisLineSettingsScreen';
import AppAppearanceScreen from '../screens/settings/AppAppearanceScreen';
import AboutPrivacyScreen from '../screens/settings/AboutPrivacyScreen';
import { useDatabase } from '../hooks/useDatabase';
import { updateSettings } from '../services/settingsService';
import { logger } from '../utils/logger';

function DevDrawerContent(props: DrawerContentComponentProps) {
  const db = useDatabase();

  const handleReset = useCallback(async () => {
    try {
      await updateSettings(db, { onboardingComplete: false });
    } catch (err) {
      logger.error('Failed to reset onboarding:', err);
    }
  }, [db]);

  const handleStartCheckIn = useCallback(() => {
    props.navigation.navigate('PlanStack', { screen: 'CheckIn' });
  }, [props.navigation]);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.devSection}>
        <DrawerItem label="⚙ Reset Onboarding (dev)" onPress={handleReset} />
        <DrawerItem label="▶ Start Check-In (dev)" onPress={handleStartCheckIn} />
      </View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="PlanStack"
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <DevDrawerContent {...props} />}
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

const styles = StyleSheet.create({
  devSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    marginTop: 8,
  },
});
