import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'safety_plans',
      columns: [
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'warning_signs',
      columns: [
        { name: 'safety_plan_id', type: 'string', isIndexed: true },
        { name: 'text', type: 'string' },
        { name: 'display_order', type: 'number' },
        { name: 'active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'coping_strategies',
      columns: [
        { name: 'safety_plan_id', type: 'string', isIndexed: true },
        { name: 'text', type: 'string' },
        { name: 'display_order', type: 'number' },
        { name: 'section', type: 'string' }, // 'internal' | 'distraction' | 'environment'
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'contacts',
      columns: [
        { name: 'safety_plan_id', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'relationship', type: 'string', isOptional: true },
        { name: 'contact_type', type: 'string' }, // 'distraction' | 'personal' | 'professional'
        { name: 'display_order', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'crisis_resources',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'text_number', type: 'string', isOptional: true },
        { name: 'is_selected', type: 'boolean' },
        { name: 'display_order', type: 'number' },
        { name: 'is_custom', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'check_ins',
      columns: [
        { name: 'safety_plan_id', type: 'string', isIndexed: true },
        { name: 'timestamp', type: 'number', isIndexed: true },
        { name: 'severity_score', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'check_in_responses',
      columns: [
        { name: 'check_in_id', type: 'string', isIndexed: true },
        { name: 'warning_sign_id', type: 'string', isIndexed: true },
        { name: 'endorsed', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'text_templates',
      columns: [
        { name: 'text', type: 'string' },
        { name: 'is_default', type: 'boolean' },
        { name: 'display_order', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'user_settings',
      columns: [
        { name: 'theme', type: 'string' }, // 'light' | 'dark' | 'system'
        { name: 'check_in_frequency', type: 'string' }, // 'daily' | 'weekly' | 'off'
        { name: 'check_in_times', type: 'string' }, // JSON array of HH:MM strings
        { name: 'nudge_threshold', type: 'number' },
        { name: 'onboarding_complete', type: 'boolean' },
        { name: 'onboarding_path', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
