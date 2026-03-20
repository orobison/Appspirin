import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanStackParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';
import { useTheme } from '../../hooks/useTheme';
import { useDatabase } from '../../hooks/useDatabase';
import { logger } from '../../utils/logger';
import type { AppTheme } from '../../theme/themes';
import WarningSign from '../../db/models/WarningSign';
import CopingStrategy from '../../db/models/CopingStrategy';
import Contact from '../../db/models/Contact';
import CrisisResource from '../../db/models/CrisisResource';
import CheckIn from '../../db/models/CheckIn';
import CheckInResponse from '../../db/models/CheckInResponse';
import * as planService from '../../services/planService';
import * as checkInService from '../../services/checkInService';
import * as crisisResourceService from '../../services/crisisResourceService';
import * as crisisCall from '../../services/crisisCall';

type Props = NativeStackScreenProps<PlanStackParamList, 'CheckIn'>;

type Phase = 'loading' | 'form' | 'recommendations' | 'viewMode' | 'empty' | 'error';
type Severity = 'low' | 'medium' | 'high';

interface RecommendationData {
  severity: Severity;
  strategies: CopingStrategy[];
  contacts: Contact[];
  crisisResources: CrisisResource[];
}

function getSeverity(score: number): Severity {
  if (score < 2.5) return 'low';
  if (score <= 3.5) return 'medium';
  return 'high';
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function CheckInScreen({ route, navigation }: Props) {
  const checkInId = route.params?.checkInId;
  const isViewMode = Boolean(checkInId);

  const { theme } = useTheme();
  const db = useDatabase();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [phase, setPhase] = useState<Phase>('loading');
  const [planId, setPlanId] = useState<string | null>(null);
  const [warningSigns, setWarningSigns] = useState<WarningSign[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [recs, setRecs] = useState<RecommendationData | null>(null);

  // View mode data
  const [viewCheckIn, setViewCheckIn] = useState<CheckIn | null>(null);
  const [viewResponses, setViewResponses] = useState<CheckInResponse[]>([]);
  const [warningSignMap, setWarningSignMap] = useState<Record<string, string>>({});

  const loadNew = useCallback(async () => {
    try {
      const plan = await planService.getOrCreatePlan(db);
      const signs = await planService.fetchWarningSigns(db, plan.id);
      if (signs.length === 0) {
        setPhase('empty');
        return;
      }
      const defaultRatings: Record<string, number> = {};
      for (const s of signs) {
        defaultRatings[s.id] = 1;
      }
      setPlanId(plan.id);
      setWarningSigns(signs);
      setRatings(defaultRatings);
      setPhase('form');
    } catch (err) {
      logger.error('CheckInScreen loadNew error:', err);
      setPhase('error');
    }
  }, [db]);

  const loadView = useCallback(async (id: string) => {
    try {
      const { checkIn, responses } = await checkInService.fetchCheckIn(db, id);
      const plan = await planService.getOrCreatePlan(db);
      const signs = await planService.fetchWarningSigns(db, plan.id);
      const map: Record<string, string> = {};
      for (const s of signs) {
        map[s.id] = s.text;
      }
      setViewCheckIn(checkIn);
      setViewResponses(responses);
      setWarningSignMap(map);
      setPhase('viewMode');
    } catch (err) {
      logger.error('CheckInScreen loadView error:', err);
      setPhase('error');
    }
  }, [db]);

  useEffect(() => {
    if (isViewMode && checkInId) {
      loadView(checkInId);
    } else {
      loadNew();
    }
  }, [isViewMode, checkInId, loadNew, loadView]);

  const handleSubmit = useCallback(async () => {
    if (!planId || loading) return;
    setLoading(true);
    try {
      const values = Object.values(ratings);
      const severityScore = values.reduce((a, b) => a + b, 0) / values.length;
      const responses = warningSigns.map((s) => ({
        warningSignId: s.id,
        endorsed: (ratings[s.id] ?? 1) >= 3,
      }));

      await checkInService.createCheckIn(db, planId, {
        timestamp: Date.now(),
        severityScore,
        notes: notes.trim() || undefined,
        responses,
      });

      const severity = getSeverity(severityScore);
      let strategies: CopingStrategy[] = [];
      let contacts: Contact[] = [];
      let crisisResources: CrisisResource[] = [];

      if (severity === 'low') {
        strategies = await planService.fetchCopingStrategies(db, planId, 'internal');
      } else if (severity === 'medium') {
        contacts = await planService.fetchContacts(db, planId);
      } else {
        const all = await crisisResourceService.fetchCrisisResources(db);
        crisisResources = all.filter((r) => r.isSelected);
      }

      setRecs({ severity, strategies, contacts, crisisResources });
      setPhase('recommendations');
    } catch (err) {
      logger.error('CheckInScreen submit error:', err);
      setPhase('error');
    } finally {
      setLoading(false);
    }
  }, [db, planId, loading, ratings, warningSigns, notes]);

  const severityColor = useMemo(() => {
    if (!recs) return theme.colors.textPrimary;
    if (recs.severity === 'low') return theme.colors.success;
    if (recs.severity === 'medium') return theme.colors.warning;
    return theme.colors.danger;
  }, [recs, theme]);

  const severityBgColor = useMemo(() => {
    if (!recs) return theme.colors.surface;
    if (recs.severity === 'low') return theme.colors.successLight;
    if (recs.severity === 'medium') return theme.colors.warningLight;
    return theme.colors.dangerLight;
  }, [recs, theme]);

  const viewSeverityColor = useMemo(() => {
    if (!viewCheckIn) return theme.colors.textPrimary;
    const sev = getSeverity(viewCheckIn.severityScore);
    if (sev === 'low') return theme.colors.success;
    if (sev === 'medium') return theme.colors.warning;
    return theme.colors.danger;
  }, [viewCheckIn, theme]);

  const viewSeverityBg = useMemo(() => {
    if (!viewCheckIn) return theme.colors.surface;
    const sev = getSeverity(viewCheckIn.severityScore);
    if (sev === 'low') return theme.colors.successLight;
    if (sev === 'medium') return theme.colors.warningLight;
    return theme.colors.dangerLight;
  }, [viewCheckIn, theme]);

  // ── Loading ──────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────────

  if (phase === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.doneButtonText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Empty plan guard ─────────────────────────────────────────────────────────

  if (phase === 'empty') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>No warning signs yet</Text>
          <Text style={styles.emptyBody}>
            Your plan doesn't have any warning signs yet. Add some from the plan hub.
          </Text>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Back to plan hub"
          >
            <Text style={styles.doneButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── View mode ────────────────────────────────────────────────────────────────

  if (phase === 'viewMode' && viewCheckIn) {
    const sev = getSeverity(viewCheckIn.severityScore);
    const sevLabel = sev === 'low' ? 'Low' : sev === 'medium' ? 'Moderate' : 'High';
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>{formatTimestamp(viewCheckIn.timestamp)}</Text>

          <View style={[styles.severityBadge, { backgroundColor: viewSeverityBg }]}>
            <Text style={[styles.severityBadgeText, { color: viewSeverityColor }]}>
              {sevLabel} — score {viewCheckIn.severityScore.toFixed(1)}
            </Text>
          </View>

          <View style={styles.section}>
            {viewResponses.map((r) => (
              <View key={r.id} style={styles.viewSignRow}>
                <Text style={styles.endorsedIndicator}>
                  {r.endorsed ? '✓' : '–'}
                </Text>
                <Text style={styles.viewSignText}>
                  {warningSignMap[r.warningSignId] ?? r.warningSignId}
                </Text>
              </View>
            ))}
          </View>

          {viewCheckIn.notes ? (
            <View style={styles.notesBlock}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{viewCheckIn.notes}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Done viewing check-in"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Recommendations phase ────────────────────────────────────────────────────

  if (phase === 'recommendations' && recs) {
    const sevLabel =
      recs.severity === 'low' ? 'Low' : recs.severity === 'medium' ? 'Moderate' : 'High';
    const contextMsg =
      recs.severity === 'low'
        ? 'Here are some strategies from your plan.'
        : recs.severity === 'medium'
        ? 'Here are some people you can reach out to.'
        : 'Please reach out for support. A crisis line is always available.';

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Check-in complete</Text>

          <View style={[styles.severityBadge, { backgroundColor: severityBgColor }]}>
            <Text style={[styles.severityBadgeText, { color: severityColor }]}>
              {sevLabel} severity
            </Text>
          </View>

          <Text style={styles.contextMsg}>{contextMsg}</Text>

          {recs.severity === 'low' && recs.strategies.map((s) => (
            <View key={s.id} style={styles.recCard}>
              <Text style={styles.recCardText} numberOfLines={3}>{s.text}</Text>
            </View>
          ))}

          {recs.severity === 'medium' && recs.contacts.map((c) => (
            <View key={c.id} style={styles.recCard}>
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  {c.relationship ? (
                    <Text style={styles.contactRelationship}>{c.relationship}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => crisisCall.callNumber(c.phone)}
                  accessibilityRole="button"
                  accessibilityLabel={`Call ${c.name}`}
                >
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {recs.severity === 'high' && recs.crisisResources.map((r) => (
            <View key={r.id} style={styles.recCard}>
              <Text style={styles.crisisName}>{r.name}</Text>
              <View style={styles.crisisActions}>
                {r.phone ? (
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => crisisCall.callNumber(r.phone!)}
                    accessibilityRole="button"
                    accessibilityLabel={`Call ${r.name}`}
                  >
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                ) : null}
                {r.textNumber ? (
                  <TouchableOpacity
                    style={styles.textButton}
                    onPress={() => crisisCall.sendSms(r.textNumber!)}
                    accessibilityRole="button"
                    accessibilityLabel={`Text ${r.name}`}
                  >
                    <Text style={styles.textButtonText}>Text</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ))}

          {recs.severity === 'high' && recs.crisisResources.length === 0 && (
            <View style={styles.recCard}>
              <Text style={styles.recCardText}>
                Call or text 988 (Suicide & Crisis Lifeline) — available 24/7.
              </Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => crisisCall.callNumber('988')}
                accessibilityRole="button"
                accessibilityLabel="Call 988 Suicide and Crisis Lifeline"
              >
                <Text style={styles.callButtonText}>Call 988</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Done with check-in"
          >
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Form phase ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.header}>How are you feeling right now?</Text>

          {warningSigns.map((sign) => (
            <View key={sign.id} style={styles.signBlock}>
              <Text style={styles.signText}>{sign.text}</Text>
              <View style={styles.ratingRow}>
                {([1, 2, 3, 4, 5] as const).map((val) => {
                  const selected = ratings[sign.id] === val;
                  return (
                    <TouchableOpacity
                      key={val}
                      style={[
                        styles.ratingButton,
                        selected && { backgroundColor: theme.colors.primary },
                      ]}
                      onPress={() =>
                        setRatings((prev) => ({ ...prev, [sign.id]: val }))
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Rating ${val} out of 5 for ${sign.text}`}
                      accessibilityState={{ selected }}
                    >
                      <Text
                        style={[
                          styles.ratingButtonText,
                          selected && { color: theme.colors.textInverse },
                        ]}
                      >
                        {val}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes (optional)"
            placeholderTextColor={theme.colors.textDisabled}
            multiline
            accessibilityLabel="Optional notes"
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Submit check-in"
            accessibilityState={{ disabled: loading }}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Saving…' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default withErrorBoundary(CheckInScreen);

function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    flex: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.lg,
    },
    header: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    loadingText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
    },
    errorText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.danger,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyBody: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    // Form
    signBlock: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    signText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    ratingRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    ratingButton: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radii.sm,
      backgroundColor: theme.colors.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    ratingButtonText: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    notesInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      minHeight: 88,
      color: theme.colors.textPrimary,
      fontSize: theme.typography.fontSize.md,
      textAlignVertical: 'top',
    },
    submitButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    submitButtonDisabled: {
      opacity: 0.5,
    },
    submitButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
    },
    // Recommendations
    severityBadge: {
      borderRadius: theme.radii.sm,
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      alignSelf: 'flex-start',
    },
    severityBadgeText: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    contextMsg: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textSecondary,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    recCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    recCardText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    contactInfo: {
      flex: 1,
      marginRight: theme.spacing.md,
    },
    contactName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    contactRelationship: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    crisisName: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    crisisActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    callButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    callButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
    },
    textButton: {
      backgroundColor: theme.colors.secondary,
      borderRadius: theme.radii.sm,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
    },
    doneButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
      marginTop: theme.spacing.sm,
    },
    doneButtonText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
    },
    // View mode
    section: {
      gap: theme.spacing.sm,
    },
    viewSignRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    endorsedIndicator: {
      fontSize: theme.typography.fontSize.md,
      fontWeight: '700',
      color: theme.colors.textSecondary,
      width: 20,
    },
    viewSignText: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
    notesBlock: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: theme.spacing.md,
      gap: theme.spacing.xs,
    },
    notesLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
    },
    notesText: {
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      lineHeight:
        theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    },
  });
}
