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

type Props = NativeStackScreenProps<OnboardingStackParamList, 'WalkThrough'>;

function WalkThroughScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const db = useDatabase();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  async function handleSkip() {
    await completeOnboarding(db, null, EMPTY_PLAN_DATA);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Guided setup</Text>
        <Text style={styles.body}>
          Step-by-step guidance is coming soon. In the meantime, you can use the
          quick setup form to enter your plan.
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('QuickSetup')}
          accessibilityRole="button"
          accessibilityLabel="Use quick setup instead"
        >
          <Text style={styles.primaryButtonText}>Use quick setup instead</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleSkip}
        accessibilityRole="button"
        accessibilityLabel="Skip for now"
      >
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default withErrorBoundary(WalkThroughScreen);

function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
    body: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
      marginBottom: theme.spacing.xl,
    },
    primaryButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    primaryButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.md,
      fontWeight: '600',
    },
    skipButton: {
      alignItems: 'center',
      paddingBottom: theme.spacing.xl,
      minHeight: 44,
      justifyContent: 'center',
    },
    skipText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.md,
    },
  });
}
