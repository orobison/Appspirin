import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanStackParamList } from '@navigation/types';
import { useDatabase } from '@hooks/useDatabase';
import {
  getOrCreatePlan,
  fetchWarningSigns,
  fetchCopingStrategies,
  fetchContacts,
} from '@services/planService';
import { fetchCrisisResources } from '@services/crisisResourceService';
import { withErrorBoundary } from '@utils/errorBoundary';
import { logger } from '@utils/logger';
import { colors, spacing, radii, shadows, typography } from '@theme/tokens';
import WarningSign from '@db/models/WarningSign';
import CopingStrategy from '@db/models/CopingStrategy';
import Contact from '@db/models/Contact';
import CrisisResource from '@db/models/CrisisResource';

type Props = NativeStackScreenProps<PlanStackParamList, 'PlanHub'>;

interface HubData {
  warningSigns: WarningSign[];
  copingStrategies: CopingStrategy[];
  contacts: Contact[];
  selectedCrisisResources: CrisisResource[];
}

interface SectionCardProps {
  title: string;
  items: string[];
  onPress: () => void;
}

const PREVIEW_COUNT = 3;

function SectionCard({ title, items, onPress }: SectionCardProps) {
  const preview = items.slice(0, PREVIEW_COUNT);
  const overflow = items.length - PREVIEW_COUNT;

  return (
    <TouchableOpacity
      style={styles.sectionCard}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${items.length} item${items.length !== 1 ? 's' : ''}. Tap to edit.`}
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionPlus} accessibilityElementsHidden>+</Text>
      </View>
      {items.length === 0 ? (
        <Text style={styles.emptyText}>Nothing added yet</Text>
      ) : (
        <>
          {preview.map((item, i) => (
            <Text key={i} style={styles.previewItem} numberOfLines={1}>· {item}</Text>
          ))}
          {overflow > 0 && (
            <Text style={styles.overflowText}>+{overflow} more</Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

function PlanHubScreen({ navigation }: Props) {
  const db = useDatabase();
  const [data, setData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        try {
          const plan = await getOrCreatePlan(db);
          const [warningSigns, copingStrategies, contacts, allResources] = await Promise.all([
            fetchWarningSigns(db, plan.id),
            fetchCopingStrategies(db, plan.id),
            fetchContacts(db, plan.id),
            fetchCrisisResources(db),
          ]);
          if (active) {
            setData({
              warningSigns,
              copingStrategies,
              contacts,
              selectedCrisisResources: allResources.filter((r) => r.isSelected),
            });
          }
        } catch (err) {
          logger.error('PlanHubScreen: failed to load', err);
        } finally {
          if (active) setLoading(false);
        }
      }

      load();
      return () => { active = false; };
    }, [db]),
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary600} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      accessibilityLabel="Safety plan overview"
    >
      <TouchableOpacity
        style={styles.ctaCard}
        onPress={() => navigation.navigate('CheckIn', {})}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Start a check-in"
      >
        <View style={styles.ctaTextGroup}>
          <Text style={styles.ctaTitle}>How are you doing?</Text>
          <Text style={styles.ctaSubtitle}>A check-in takes under a minute.</Text>
        </View>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Start Check-In</Text>
        </View>
      </TouchableOpacity>

      <SectionCard
        title="Warning Signs"
        items={data?.warningSigns.map((w) => w.text) ?? []}
        onPress={() => navigation.navigate('EditWarningSigns')}
      />
      <SectionCard
        title="Coping Strategies"
        items={data?.copingStrategies.map((c) => c.text) ?? []}
        onPress={() => navigation.navigate('EditCopingStrategies')}
      />
      <SectionCard
        title="People"
        items={data?.contacts.map((c) => c.name) ?? []}
        onPress={() => navigation.navigate('EditPeople')}
      />
      <SectionCard
        title="Crisis Resources"
        items={data?.selectedCrisisResources.map((r) => r.name) ?? []}
        onPress={() => navigation.navigate('EditCrisisResources')}
      />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

export default withErrorBoundary(PlanHubScreen);

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  ctaCard: {
    backgroundColor: colors.primary600,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.md,
  },
  ctaTextGroup: {
    flex: 1,
    marginRight: spacing.md,
  },
  ctaTitle: {
    fontSize: typography.fontSize.lg,
    color: colors.neutral0,
    fontWeight: '600',
  },
  ctaSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.primary100,
    marginTop: spacing.xs,
  },
  ctaButton: {
    backgroundColor: colors.neutral0,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  ctaButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary700,
    fontWeight: '600',
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.neutral900,
  },
  sectionPlus: {
    fontSize: typography.fontSize.xl,
    color: colors.primary600,
    minWidth: 44,
    minHeight: 44,
    textAlign: 'right',
    lineHeight: 44,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral400,
    fontStyle: 'italic',
  },
  previewItem: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral600,
    marginBottom: 2,
  },
  overflowText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral400,
    marginTop: 2,
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
