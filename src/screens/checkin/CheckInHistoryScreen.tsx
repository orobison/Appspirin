import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Q } from '@nozbe/watermelondb';
import { DrawerParamList } from '@navigation/types';
import { useDatabase } from '@hooks/useDatabase';
import { getOrCreatePlan } from '@services/planService';
import { fetchCheckIns, deleteCheckIn } from '@services/checkInService';
import { withErrorBoundary } from '@utils/errorBoundary';
import { logger } from '@utils/logger';
import { colors, spacing, radii, shadows, typography } from '@theme/tokens';
import CheckIn from '@db/models/CheckIn';
import CheckInResponse from '@db/models/CheckInResponse';

type Props = DrawerScreenProps<DrawerParamList, 'CheckInHistory'>;

type Severity = 'low' | 'medium' | 'high';

interface RowData {
  checkIn: CheckIn;
  endorsedCount: number;
  totalCount: number;
}

function getSeverity(score: number): Severity {
  if (score < 2.5) return 'low';
  if (score <= 3.5) return 'medium';
  return 'high';
}

function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

const SEVERITY_LABELS: Record<Severity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function CheckInHistoryScreen({ navigation }: Props) {
  const db = useDatabase();
  const [rows, setRows] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function load() {
        try {
          const plan = await getOrCreatePlan(db);
          const checkIns = await fetchCheckIns(db, plan.id);

          if (checkIns.length === 0) {
            if (active) { setRows([]); setLoading(false); }
            return;
          }

          const ids = checkIns.map((c) => c.id);
          const allResponses = await db
            .get<CheckInResponse>('check_in_responses')
            .query(Q.where('check_in_id', Q.oneOf(ids)))
            .fetch();

          const responseMap: Record<string, { endorsed: number; total: number }> = {};
          for (const r of allResponses) {
            if (!responseMap[r.checkInId]) {
              responseMap[r.checkInId] = { endorsed: 0, total: 0 };
            }
            responseMap[r.checkInId].total++;
            if (r.endorsed) responseMap[r.checkInId].endorsed++;
          }

          if (active) {
            setRows(
              checkIns.map((ci) => ({
                checkIn: ci,
                endorsedCount: responseMap[ci.id]?.endorsed ?? 0,
                totalCount: responseMap[ci.id]?.total ?? 0,
              })),
            );
            setLoading(false);
          }
        } catch (err) {
          logger.error('CheckInHistoryScreen: failed to load', err);
          if (active) setLoading(false);
        }
      }

      load();
      return () => { active = false; };
    }, [db]),
  );

  const handleLongPress = (row: RowData) => {
    Alert.alert(
      'Delete Check-In',
      'This check-in will be permanently deleted and cannot be recovered.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCheckIn(db, row.checkIn);
              setRows((prev) => prev.filter((r) => r.checkIn.id !== row.checkIn.id));
            } catch (err) {
              logger.error('CheckInHistoryScreen: failed to delete', err);
            }
          },
        },
      ],
    );
  };

  const handlePress = (row: RowData) => {
    navigation.navigate('PlanStack', {
      screen: 'CheckIn',
      params: { checkInId: row.checkIn.id },
    });
  };

  const renderRow = ({ item }: { item: RowData }) => {
    const severity = getSeverity(item.checkIn.severityScore);
    const date = formatTimestamp(item.checkIn.timestamp);
    const signsLabel =
      item.totalCount > 0
        ? `${item.endorsedCount} of ${item.totalCount} warning sign${item.totalCount !== 1 ? 's' : ''} endorsed`
        : null;

    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={`Check-in on ${date}, ${SEVERITY_LABELS[severity]} severity${signsLabel ? ', ' + signsLabel : ''}. Long press to delete.`}
      >
        <View style={styles.rowTop}>
          <Text style={styles.rowDate}>{date}</Text>
          <View style={[styles.badge, severityBadgeStyles[severity]]}>
            <Text style={[styles.badgeText, severityTextStyles[severity]]}>
              {SEVERITY_LABELS[severity]}
            </Text>
          </View>
        </View>
        {signsLabel ? (
          <Text style={styles.rowMeta}>{signsLabel}</Text>
        ) : null}
        {item.checkIn.notes ? (
          <Text style={styles.rowNotes} numberOfLines={1}>{item.checkIn.notes}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburger}
          onPress={() => navigation.openDrawer()}
          accessibilityRole="button"
          accessibilityLabel="Open navigation menu"
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check-In History</Text>
        <View style={styles.hamburger} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary600} />
        </View>
      ) : rows.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No check-ins yet</Text>
          <Text style={styles.emptySubtitle}>Check-ins you complete will appear here.</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('PlanStack', { screen: 'CheckIn', params: {} })}
            accessibilityRole="button"
            accessibilityLabel="Start a check-in"
          >
            <Text style={styles.ctaButtonText}>Start a Check-In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => item.checkIn.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderRow}
        />
      )}
    </SafeAreaView>
  );
}

export default withErrorBoundary(CheckInHistoryScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral200,
    paddingHorizontal: spacing.sm,
  },
  hamburger: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hamburgerIcon: {
    fontSize: 20,
    color: colors.neutral900,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
    color: colors.neutral900,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: '600',
    color: colors.neutral700,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: typography.fontSize.md,
    color: colors.neutral500,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  ctaButton: {
    backgroundColor: colors.primary600,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.neutral0,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  separator: {
    height: spacing.sm,
  },
  row: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  rowDate: {
    flex: 1,
    fontSize: typography.fontSize.md,
    fontWeight: '500',
    color: colors.neutral900,
    marginRight: spacing.sm,
  },
  badge: {
    borderRadius: radii.full,
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: '600',
  },
  rowMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral500,
    marginTop: 2,
  },
  rowNotes: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral400,
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
});

const severityBadgeStyles = StyleSheet.create({
  low: { backgroundColor: colors.successLight },
  medium: { backgroundColor: colors.warningLight },
  high: { backgroundColor: colors.dangerLight },
});

const severityTextStyles = StyleSheet.create({
  low: { color: colors.success },
  medium: { color: colors.warning },
  high: { color: colors.danger },
});
