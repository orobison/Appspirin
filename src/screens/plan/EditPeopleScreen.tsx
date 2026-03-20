import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
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
  fetchContacts,
  createContact,
  deleteContact,
} from '@services/planService';
import { withErrorBoundary } from '@utils/errorBoundary';
import { logger } from '@utils/logger';
import { colors, spacing, radii, typography } from '@theme/tokens';
import Contact from '@db/models/Contact';
import { ContactType } from '@db/types';

type Props = NativeStackScreenProps<PlanStackParamList, 'EditPeople'>;

const CONTACT_TYPES: { key: ContactType; label: string; description: string }[] = [
  { key: 'distraction', label: 'Distraction', description: 'Social settings & activities' },
  { key: 'personal', label: 'Personal Help', description: 'Friends & family to reach out to' },
  { key: 'professional', label: 'Professional', description: 'Therapists, crisis lines, agencies' },
];

function EditPeopleScreen(_props: Props) {
  const db = useDatabase();
  const [planId, setPlanId] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedType, setSelectedType] = useState<ContactType>('personal');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async (id: string) => {
    const result = await fetchContacts(db, id);
    setContacts(result);
  }, [db]);

  useEffect(() => {
    async function load() {
      try {
        const plan = await getOrCreatePlan(db);
        setPlanId(plan.id);
        await refresh(plan.id);
      } catch (err) {
        logger.error('EditPeopleScreen: failed to load', err);
      }
    }
    load();
  }, [db, refresh]);

  const handleAdd = async () => {
    if (!name.trim() || !phone.trim() || !planId || saving) return;
    setSaving(true);
    const typeCount = contacts.filter((c) => c.contactType === selectedType).length;
    try {
      await createContact(db, planId, {
        name: name.trim(),
        phone: phone.trim(),
        relationship: relationship.trim() || undefined,
        contactType: selectedType,
        displayOrder: typeCount,
      });
      setName('');
      setPhone('');
      setRelationship('');
      await refresh(planId);
    } catch (err) {
      logger.error('EditPeopleScreen: failed to add', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record: Contact) => {
    if (!planId) return;
    try {
      await deleteContact(db, record);
      await refresh(planId);
    } catch (err) {
      logger.error('EditPeopleScreen: failed to delete', err);
    }
  };

  const canAdd = name.trim().length > 0 && phone.trim().length > 0 && !saving;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {CONTACT_TYPES.map((ct) => {
          const group = contacts.filter((c) => c.contactType === ct.key);
          return (
            <View key={ct.key} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{ct.label}</Text>
                <Text style={styles.groupDescription}>{ct.description}</Text>
              </View>
              {group.length === 0 ? (
                <Text style={styles.emptyText}>None added</Text>
              ) : (
                group.map((contact, i) => (
                  <View
                    key={contact.id}
                    style={[styles.contactRow, i < group.length - 1 && styles.contactRowBorder]}
                  >
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      {contact.relationship ? (
                        <Text style={styles.contactMeta}>{contact.relationship}</Text>
                      ) : null}
                      <Text style={styles.contactMeta}>{contact.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDelete(contact)}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${contact.name}`}
                    >
                      <Text style={styles.deleteText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          );
        })}

        <View style={styles.addForm}>
          <Text style={styles.addFormTitle}>Add Person</Text>

          <View style={styles.typeSelector}>
            {CONTACT_TYPES.map((ct) => (
              <TouchableOpacity
                key={ct.key}
                style={[styles.typeButton, selectedType === ct.key && styles.typeButtonActive]}
                onPress={() => setSelectedType(ct.key)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selectedType === ct.key }}
                accessibilityLabel={ct.label}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    selectedType === ct.key && styles.typeButtonTextActive,
                  ]}
                >
                  {ct.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor={colors.neutral400}
            accessibilityLabel="Contact name"
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            placeholderTextColor={colors.neutral400}
            keyboardType="phone-pad"
            accessibilityLabel="Contact phone number"
          />
          <TextInput
            style={styles.input}
            value={relationship}
            onChangeText={setRelationship}
            placeholder="Relationship (optional)"
            placeholderTextColor={colors.neutral400}
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            accessibilityLabel="Contact relationship"
          />

          <TouchableOpacity
            style={[styles.addButton, !canAdd && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!canAdd}
            accessibilityRole="button"
            accessibilityLabel="Add person"
          >
            <Text style={styles.addButtonText}>Add Person</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default withErrorBoundary(EditPeopleScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  group: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
  },
  groupHeader: {
    marginBottom: spacing.sm,
  },
  groupTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.neutral900,
  },
  groupDescription: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral500,
    marginTop: 2,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral400,
    fontStyle: 'italic',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  contactRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutral200,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.fontSize.md,
    color: colors.neutral900,
    fontWeight: '500',
  },
  contactMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral500,
    marginTop: 1,
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
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  addFormTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    color: colors.neutral900,
    marginBottom: spacing.xs,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.neutral200,
    backgroundColor: colors.neutral50,
    minHeight: 44,
    justifyContent: 'center',
  },
  typeButtonActive: {
    borderColor: colors.primary600,
    backgroundColor: colors.primary50,
  },
  typeButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral600,
    fontWeight: '500',
    textAlign: 'center',
  },
  typeButtonTextActive: {
    color: colors.primary700,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.neutral50,
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
    marginTop: spacing.xs,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    fontSize: typography.fontSize.md,
    color: colors.neutral0,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
