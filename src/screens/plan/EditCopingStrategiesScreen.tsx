import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanStackParamList } from '@navigation/types';
import { useDatabase } from '@hooks/useDatabase';
import {
  getOrCreatePlan,
  fetchCopingStrategies,
  createCopingStrategy,
  deleteCopingStrategy,
} from '@services/planService';
import { withErrorBoundary } from '@utils/errorBoundary';
import { logger } from '@utils/logger';
import { colors, spacing, radii, typography } from '@theme/tokens';
import CopingStrategy from '@db/models/CopingStrategy';
import { CopingStrategySection } from '@db/types';

type Props = NativeStackScreenProps<PlanStackParamList, 'EditCopingStrategies'>;

const SECTIONS: { key: CopingStrategySection; label: string }[] = [
  { key: 'internal', label: 'Internal' },
  { key: 'distraction', label: 'Distraction' },
  { key: 'environment', label: 'Environment' },
];

function EditCopingStrategiesScreen(_props: Props) {
  const db = useDatabase();
  const [planId, setPlanId] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [activeSection, setActiveSection] = useState<CopingStrategySection>('internal');
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async (id: string) => {
    const result = await fetchCopingStrategies(db, id);
    setStrategies(result);
  }, [db]);

  useEffect(() => {
    async function load() {
      try {
        const plan = await getOrCreatePlan(db);
        setPlanId(plan.id);
        await refresh(plan.id);
      } catch (err) {
        logger.error('EditCopingStrategiesScreen: failed to load', err);
      }
    }
    load();
  }, [db, refresh]);

  const handleTabChange = (section: CopingStrategySection) => {
    setActiveSection(section);
    setText('');
  };

  const handleAdd = async () => {
    if (!text.trim() || !planId || saving) return;
    setSaving(true);
    const sectionCount = strategies.filter((s) => s.section === activeSection).length;
    try {
      await createCopingStrategy(db, planId, {
        text: text.trim(),
        section: activeSection,
        displayOrder: sectionCount,
      });
      setText('');
      await refresh(planId);
    } catch (err) {
      logger.error('EditCopingStrategiesScreen: failed to add', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: CopingStrategy) => {
    if (!planId) return;
    try {
      await deleteCopingStrategy(db, record);
      await refresh(planId);
    } catch (err) {
      logger.error('EditCopingStrategiesScreen: failed to delete', err);
    }
  };

  const filtered = strategies.filter((s) => s.section === activeSection);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.tabs}>
        {SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[styles.tab, activeSection === section.key && styles.tabActive]}
            onPress={() => handleTabChange(section.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeSection === section.key }}
            accessibilityLabel={`${section.label} coping strategies`}
          >
            <Text style={[styles.tabText, activeSection === section.key && styles.tabTextActive]}>
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {activeSection} strategies yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText} numberOfLines={2}>{item.text}</Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item)}
              accessibilityRole="button"
              accessibilityLabel={`Delete ${item.text}`}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Describe a coping strategy…"
              placeholderTextColor={colors.neutral400}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              accessibilityLabel="New coping strategy"
            />
            <TouchableOpacity
              style={[styles.addButton, (!text.trim() || saving) && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!text.trim() || saving}
              accessibilityRole="button"
              accessibilityLabel="Add coping strategy"
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

export default withErrorBoundary(EditCopingStrategiesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral200,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    minHeight: 44,
    justifyContent: 'center',
  },
  tabActive: {
    borderBottomColor: colors.primary600,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral500,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary600,
    fontWeight: '600',
  },
  listContent: {
    padding: spacing.md,
  },
  separator: {
    height: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral400,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  rowText: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.neutral900,
    marginRight: spacing.sm,
  },
  deleteButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: typography.fontSize.sm,
    color: colors.danger,
    fontWeight: '600',
  },
  addForm: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.neutral900,
    minHeight: 44,
  },
  addButton: {
    backgroundColor: colors.primary600,
    borderRadius: radii.md,
    padding: spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.neutral0,
    fontWeight: '600',
  },
});
