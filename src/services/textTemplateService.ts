import { Database, Q } from '@nozbe/watermelondb';
import TextTemplate from '@db/models/TextTemplate';
import { CreateTextTemplateInput, UpdateTextTemplateInput } from '@db/types';

export async function fetchTemplates(db: Database): Promise<TextTemplate[]> {
  return db
    .get<TextTemplate>('text_templates')
    .query(Q.sortBy('display_order', Q.asc))
    .fetch();
}

export async function createTemplate(
  db: Database,
  input: CreateTextTemplateInput,
): Promise<TextTemplate> {
  return db.write(async () => {
    return db.get<TextTemplate>('text_templates').create((record) => {
      record.text = input.text;
      record.isDefault = input.isDefault ?? false;
      record.displayOrder = input.displayOrder;
    });
  });
}

export async function updateTemplate(
  db: Database,
  record: TextTemplate,
  input: UpdateTextTemplateInput,
): Promise<TextTemplate> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.text !== undefined) r.text = input.text;
      if (input.isDefault !== undefined) r.isDefault = input.isDefault;
      if (input.displayOrder !== undefined) r.displayOrder = input.displayOrder;
    });
  });
}

export async function deleteTemplate(
  db: Database,
  record: TextTemplate,
): Promise<void> {
  await db.write(async () => {
    await record.destroyPermanently();
  });
}
