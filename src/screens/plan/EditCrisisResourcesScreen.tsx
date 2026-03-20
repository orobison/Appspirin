import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PlanStackParamList } from '@navigation/types';
import { useDatabase } from '@hooks/useDatabase';
import {
  fetchCrisisResources,
  createCrisisResource,
  deleteCrisisResource,
  toggleSelected,
} from '@services/crisisResourceService';
import { withErrorBoundary } from '@utils/errorBoundary';
import { logger } from '@utils/logger';
import { colors, spacing, radii, typography } from '@theme/tokens';
import CrisisResource from '@db/models/CrisisResource';

type Props = NativeStackScreenProps<PlanStackParamList, 'EditCrisisResources'>;

function EditCrisisResourcesScreen(_props: Props) {
  const db = useDatabase();
  const [resources, setResources] = useState<CrisisResource[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const result = await fetchCrisisResources(db);
    setResources(result);
  }, [db]);

  useEffect(() => {
    refresh().catch((err) => logger.error('EditCrisisResourcesScreen: failed to load', err));
  }, [refresh]);

  const handleToggle = async (record: CrisisResource) => {
    try {
      await toggleSelected(db, record);
      await refresh();
    } catch (err) {
      logger.error('EditCrisisResourcesScreen: failed to toggle', err);
    }
  };

  const handleDelete = async (record: CrisisResource) => {
    try {
      await deleteCrisisResource(db, record);
      await refresh();
    } catch (err) {
      logger.error('EditCrisisResourcesScreen: failed to delete', err);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await createCrisisResource(db, {
        name: name.trim(),
        phone: phone.trim() || undefined,
        isSelected: true,
        displayOrder: resources.length,
        isCustom: true,
      });
      setName('');
      setPhone('');
      await refresh();
    } catch (err) {
      logger.error('EditCrisisResourcesScreen: failed to add', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <Text style={styles.listHint}>
            Toggle resources on or off. Selected resources appear in the "Need help now?" sheet.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Text style={styles.resourceName}>{item.name}</Text>
              {item.phone ? (
                <Text style={styles.resourceDetail}>{item.phone}</Text>
              ) : null}
              {item.textNumber ? (
                <Text style={styles.resourceDetail}>Text: {item.textNumber}</Text>
              ) : null}
            </View>
            <View style={styles.rowActions}>
              <Switch
                value={item.isSelected}
                onValueChange={() => handleToggle(item)}
                trackColor={{ false: colors.neutral300, true: colors.primary400 }}
                thumbColor={colors.neutral0}
                accessibilityLabel={`${item.name}, ${item.isSelected ? 'selected' : 'not selected'}`}
                accessibilityRole="switch"
              />
              {item.isCustom && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.addForm}>
            <Text style={styles.addFormTitle}>Add Custom Resource</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name (e.g. Local Crisis Line)"
              placeholderTextColor={colors.neutral400}
              accessibilityLabel="Resource name"
            />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number (optional)"
              placeholderTextColor={colors.neutral400}
              keyboardType="phone-pad"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              accessibilityLabel="Resource phone number"
            />
            <TouchableOpacity
              style={[styles.addButton, (!name.trim() || saving) && styles.addButtonDisabled]}
              onPress={handleAdd}
              disabled={!name.trim() || saving}
              accessibilityRole="button"
              accessibilityLabel="Add crisis resource"
            >
              <Text style={styles.addButtonText}>Add Resource</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
}

export default withErrorBoundary(EditCrisisResourcesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
  },
  listHint: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral500,
    marginBottom: spacing.md,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  separator: {
    height: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  rowInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  resourceName: {
    fontSize: typography.fontSize.md,
    color: colors.neutral900,
    fontWeight: '500',
  },
  resourceDetail: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral500,
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
  addFormTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.neutral900,
    marginBottom: spacing.xs,
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
