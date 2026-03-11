import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import { DatabaseProvider } from './src/providers/DatabaseProvider';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { buildPaperTheme } from './src/theme/paperTheme';
import RootNavigator from './src/navigation/RootNavigator';
import NeedHelpNowButton from './src/screens/_shared/NeedHelpNowButton';
import { RootStackParamList } from './src/navigation/types';

function PaperIconAdapter({
  name, size, color,
}: { name: string; size: number; color?: string }) {
  return (
    <MaterialCommunityIcons
      name={name as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
      size={size}
      color={color ?? '#000000'}
    />
  );
}

function PaperThemeGate({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <PaperProvider theme={buildPaperTheme(theme)} settings={{ icon: PaperIconAdapter }}>
      {children}
    </PaperProvider>
  );
}

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['appspirin://'],
  config: {
    screens: {
      App: {
        screens: {
          PlanStack: {
            screens: {
              CheckIn: 'checkin',
            },
          },
        },
      },
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <DatabaseProvider>
          <ThemeProvider>
            <PaperThemeGate>
              <NavigationContainer linking={linking}>
                <RootNavigator />
              </NavigationContainer>
              <NeedHelpNowButton />
            </PaperThemeGate>
          </ThemeProvider>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
