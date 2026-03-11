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

type Props = NativeStackScreenProps<OnboardingStackParamList, 'PathSelection'>;

function PathSelectionScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const db = useDatabase();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  async function handleSkip() {
    await completeOnboarding(db, null, EMPTY_PLAN_DATA);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>How would you like to set up your plan?</Text>
      <View style={styles.cards}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('QuickSetup')}
          accessibilityRole="button"
          accessibilityLabel="Quick setup, 60 to 90 seconds"
        >
          <Text style={styles.cardTitle}>Quick setup</Text>
          <Text style={styles.cardDuration}>60–90 sec</Text>
          <Text style={styles.cardDesc}>
            Enter your plan all at once. You can always add more later.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('WalkThrough')}
          accessibilityRole="button"
          accessibilityLabel="Walk me through it, 3 to 5 minutes"
        >
          <Text style={styles.cardTitle}>Walk me through it</Text>
          <Text style={styles.cardDuration}>3–5 min</Text>
          <Text style={styles.cardDesc}>
            Guided setup, one step at a time, with context for each section.
          </Text>
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

export default withErrorBoundary(PathSelectionScreen);

function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    heading: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    cards: {
      gap: theme.spacing.md,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.lg,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    cardTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    cardDuration: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
    },
    cardDesc: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    skipButton: {
      position: 'absolute',
      bottom: theme.spacing.xl,
      alignSelf: 'center',
      minHeight: 44,
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    skipText: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.md,
    },
  });
}
