import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { withErrorBoundary } from '../../utils/errorBoundary';
import { useTheme } from '../../hooks/useTheme';
import { useDatabase } from '../../hooks/useDatabase';
import { logger } from '../../utils/logger';
import {
  completeOnboarding,
  EMPTY_PLAN_DATA,
  ContactEntry,
} from '../../services/onboarding';
import type { AppTheme } from '../../theme/themes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'QuickSetup'>;

// ─── Sub-components ────────────────────────────────────────────────────────

interface TextSectionProps {
  stepNumber: number;
  title: string;
  description: string;
  placeholder: string;
  items: string[];
  onAdd: (text: string) => void;
  onRemove: (index: number) => void;
}

function TextSection({
  stepNumber,
  title,
  description,
  placeholder,
  items,
  onAdd,
  onRemove,
}: TextSectionProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeSectionStyles(theme), [theme]);
  const [input, setInput] = useState('');

  function handleAdd() {
    const trimmed = input.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setInput('');
  }

  return (
    <View style={styles.section}>
      <View style={styles.stepRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{stepNumber}</Text>
        </View>
        <View style={styles.stepMeta}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionDesc}>{description}</Text>
        </View>
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textDisabled}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          accessibilityLabel={`Enter ${title}`}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel={`Add to ${title}`}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {items.map((item, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.itemText} numberOfLines={2}>{item}</Text>
          <TouchableOpacity
            onPress={() => onRemove(i)}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

interface ContactSectionProps {
  stepNumber: number;
  title: string;
  description: string;
  contacts: ContactEntry[];
  onAdd: (contact: ContactEntry) => void;
  onRemove: (index: number) => void;
}

function ContactSection({
  stepNumber,
  title,
  description,
  contacts,
  onAdd,
  onRemove,
}: ContactSectionProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeSectionStyles(theme), [theme]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  function handleAdd() {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onAdd({ name: trimmedName, phone: phone.trim() });
    setName('');
    setPhone('');
  }

  return (
    <View style={styles.section}>
      <View style={styles.stepRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{stepNumber}</Text>
        </View>
        <View style={styles.stepMeta}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionDesc}>{description}</Text>
        </View>
      </View>
      <TextInput
        style={[styles.textInput, styles.contactInput]}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor={theme.colors.textDisabled}
        returnKeyType="next"
        accessibilityLabel={`Name for ${title}`}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone (optional)"
          placeholderTextColor={theme.colors.textDisabled}
          keyboardType="phone-pad"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          accessibilityLabel={`Phone for ${title}`}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          accessibilityRole="button"
          accessibilityLabel={`Add contact to ${title}`}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      {contacts.map((c, i) => (
        <View key={i} style={styles.item}>
          <View style={styles.contactItemText}>
            <Text style={styles.itemText}>{c.name}</Text>
            {c.phone ? (
              <Text style={styles.itemSubText}>{c.phone}</Text>
            ) : null}
          </View>
          <TouchableOpacity
            onPress={() => onRemove(i)}
            style={styles.removeButton}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${c.name}`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────

function QuickSetupScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const db = useDatabase();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [warningSigns, setWarningSigns] = useState<string[]>([]);
  const [internalStrategies, setInternalStrategies] = useState<string[]>([]);
  const [distractionContacts, setDistractionContacts] = useState<ContactEntry[]>([]);
  const [personalContacts, setPersonalContacts] = useState<ContactEntry[]>([]);
  const [professionalContacts, setProfessionalContacts] = useState<ContactEntry[]>([]);
  const [environmentSafety, setEnvironmentSafety] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function removeAt<T>(arr: T[], index: number): T[] {
    return arr.filter((_, i) => i !== index);
  }

  async function handleFinish() {
    if (saving) return;
    setSaving(true);
    try {
      await completeOnboarding(db, 'quick', {
        warningSigns,
        internalStrategies,
        distractionContacts,
        personalContacts,
        professionalContacts,
        environmentSafety,
      });
    } catch (err) {
      logger.error('Failed to complete onboarding:', err);
      setSaving(false);
    }
  }

  async function handleSkip() {
    await completeOnboarding(db, null, EMPTY_PLAN_DATA);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quick setup</Text>
          <Text style={styles.headerSubtitle}>
            Add what you know now — you can always edit later.
          </Text>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextSection
            stepNumber={1}
            title="Warning signs"
            description="How do you know when you're starting to struggle?"
            placeholder="e.g. Trouble sleeping, withdrawing from friends"
            items={warningSigns}
            onAdd={(t) => setWarningSigns((prev) => [...prev, t])}
            onRemove={(i) => setWarningSigns((prev) => removeAt(prev, i))}
          />
          <TextSection
            stepNumber={2}
            title="Internal coping strategies"
            description="Things you can do on your own to take your mind off the pain."
            placeholder="e.g. Go for a walk, listen to music"
            items={internalStrategies}
            onAdd={(t) => setInternalStrategies((prev) => [...prev, t])}
            onRemove={(i) => setInternalStrategies((prev) => removeAt(prev, i))}
          />
          <ContactSection
            stepNumber={3}
            title="People and places for distraction"
            description="People or social settings that take your mind off things."
            contacts={distractionContacts}
            onAdd={(c) => setDistractionContacts((prev) => [...prev, c])}
            onRemove={(i) => setDistractionContacts((prev) => removeAt(prev, i))}
          />
          <ContactSection
            stepNumber={4}
            title="People I can ask for help"
            description="People you trust and can reach out to directly."
            contacts={personalContacts}
            onAdd={(c) => setPersonalContacts((prev) => [...prev, c])}
            onRemove={(i) => setPersonalContacts((prev) => removeAt(prev, i))}
          />
          <ContactSection
            stepNumber={5}
            title="Professionals and agencies"
            description="Clinicians, crisis lines, or agencies you can contact."
            contacts={professionalContacts}
            onAdd={(c) => setProfessionalContacts((prev) => [...prev, c])}
            onRemove={(i) => setProfessionalContacts((prev) => removeAt(prev, i))}
          />
          <TextSection
            stepNumber={6}
            title="Making the environment safe"
            description="Steps to reduce access to means or make your space safer."
            placeholder="e.g. Give medications to a friend to hold"
            items={environmentSafety}
            onAdd={(t) => setEnvironmentSafety((prev) => [...prev, t])}
            onRemove={(i) => setEnvironmentSafety((prev) => removeAt(prev, i))}
          />
          <View style={styles.scrollPad} />
        </ScrollView>
        <SafeAreaView style={styles.footer} edges={['bottom']}>
          <TouchableOpacity
            style={[styles.finishButton, saving && styles.finishButtonDisabled]}
            onPress={handleFinish}
            disabled={saving}
            accessibilityRole="button"
            accessibilityLabel="Finish setup"
          >
            <Text style={styles.finishButtonText}>
              {saving ? 'Saving…' : 'Finish setup'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Skip for now"
          >
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default withErrorBoundary(QuickSetupScreen);

// ─── Styles ────────────────────────────────────────────────────────────────

function makeStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    flex: {
      flex: 1,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderSubtle,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    headerSubtitle: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    scrollPad: {
      height: theme.spacing.xl,
    },
    footer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderSubtle,
      backgroundColor: theme.colors.background,
      gap: theme.spacing.xs,
    },
    finishButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.md,
      paddingVertical: theme.spacing.md,
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    finishButtonDisabled: {
      opacity: 0.6,
    },
    finishButtonText: {
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

function makeSectionStyles(theme: AppTheme) {
  return StyleSheet.create({
    section: {
      marginBottom: theme.spacing.xl,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
    stepBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      flexShrink: 0,
    },
    stepBadgeText: {
      color: theme.colors.textInverse,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: '700',
    },
    stepMeta: {
      flex: 1,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    sectionDesc: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
    },
    inputRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    textInput: {
      flex: 1,
      height: 44,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radii.md,
      paddingHorizontal: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.surface,
    },
    contactInput: {
      marginBottom: theme.spacing.sm,
    },
    addButton: {
      height: 44,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.primaryLight,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 60,
    },
    addButtonText: {
      color: theme.colors.primaryDark,
      fontSize: theme.typography.fontSize.md,
      fontWeight: '600',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surfaceRaised,
      borderRadius: theme.radii.md,
      marginBottom: theme.spacing.xs,
    },
    contactItemText: {
      flex: 1,
    },
    itemText: {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textPrimary,
    },
    itemSubText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    removeButton: {
      minWidth: 32,
      minHeight: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    removeText: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
  });
}
