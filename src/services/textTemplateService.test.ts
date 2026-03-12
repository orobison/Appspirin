import { makeTestDatabase } from './testHelpers/testDb';
import {
  fetchTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from './textTemplateService';

describe('textTemplateService', () => {
  let db: ReturnType<typeof makeTestDatabase>;

  beforeEach(() => {
    db = makeTestDatabase();
  });

  it('creates a template', async () => {
    const t = await createTemplate(db, {
      text: 'Hey, can we talk?',
      displayOrder: 0,
    });
    expect(t.text).toBe('Hey, can we talk?');
    expect(t.isDefault).toBe(false);
    expect(t.displayOrder).toBe(0);
  });

  it('creates a default template', async () => {
    const t = await createTemplate(db, {
      text: 'Default message',
      displayOrder: 0,
      isDefault: true,
    });
    expect(t.isDefault).toBe(true);
  });

  it('fetchTemplates returns sorted by displayOrder', async () => {
    await createTemplate(db, { text: 'B', displayOrder: 1 });
    await createTemplate(db, { text: 'A', displayOrder: 0 });
    const results = await fetchTemplates(db);
    expect(results.map((r) => r.text)).toEqual(['A', 'B']);
  });

  it('updates a template', async () => {
    const t = await createTemplate(db, { text: 'Old', displayOrder: 0 });
    const updated = await updateTemplate(db, t, { text: 'New', isDefault: true });
    expect(updated.text).toBe('New');
    expect(updated.isDefault).toBe(true);
  });

  it('deletes a template', async () => {
    const t = await createTemplate(db, { text: 'Gone', displayOrder: 0 });
    await deleteTemplate(db, t);
    const remaining = await fetchTemplates(db);
    expect(remaining).toHaveLength(0);
  });
});
