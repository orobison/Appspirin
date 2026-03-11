import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';
import { useTheme } from '../../hooks/useTheme';
import { useDatabase } from '../../hooks/useDatabase';
import { completeOnboarding, EMPTY_PLAN_DATA } from '../../services/onboarding';
import type { AppTheme } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

function WelcomeScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const db = useDatabase();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  async function handleSkip() {
    await completeOnboarding(db, null, EMPTY_PLAN_DATA);
    // RootNavigator observes onboardingComplete and re-renders automatically
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Appspirin</Text>
        <Text style={styles.subtitle}>
          Your personal safety plan — private, offline, always with you.
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('PathSelection')}
          accessibilityRole="button"
          accessibilityLabel="Get started"
        >
          <Text style={styles.primaryButtonText}>Get started</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          accessibilityRole="button"
          accessibilityLabel="Skip for now"
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default withErrorBoundary(WelcomeScreen);

function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize.xxxl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    },
    actions: {
      paddingBottom: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
    },
    skipButton: {
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      minHeight: 44,
      justifyContent: 'center',
    },
    skipText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.md,
    },
  });
}
