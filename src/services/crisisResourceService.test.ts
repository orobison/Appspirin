import { makeTestDatabase } from './testHelpers/testDb';
import {
  fetchCrisisResources,
  createCrisisResource,
  updateCrisisResource,
  deleteCrisisResource,
  toggleSelected,
} from './crisisResourceService';

describe('crisisResourceService', () => {
  let db: ReturnType<typeof makeTestDatabase>;

  beforeEach(() => {
    db = makeTestDatabase();
  });

  it('creates a custom crisis resource', async () => {
    const resource = await createCrisisResource(db, {
      name: 'Local Warmline',
      phone: '555-0300',
      displayOrder: 0,
      isCustom: true,
    });
    expect(resource.name).toBe('Local Warmline');
    expect(resource.isCustom).toBe(true);
    expect(resource.isSelected).toBe(true);
  });

  it('fetchCrisisResources returns sorted by display_order', async () => {
    await createCrisisResource(db, { name: 'B', displayOrder: 1, isCustom: true });
    await createCrisisResource(db, { name: 'A', displayOrder: 0, isCustom: true });
    const results = await fetchCrisisResources(db);
    expect(results.map((r) => r.name)).toEqual(['A', 'B']);
  });

  it('updates a crisis resource', async () => {
    const r = await createCrisisResource(db, { name: 'Old', displayOrder: 0, isCustom: true });
    const updated = await updateCrisisResource(db, r, { name: 'New', phone: '555-9999' });
    expect(updated.name).toBe('New');
    expect(updated.phone).toBe('555-9999');
  });

  it('toggleSelected flips isSelected', async () => {
    const r = await createCrisisResource(db, { name: 'Test', displayOrder: 0, isCustom: true, isSelected: true });
    const toggled = await toggleSelected(db, r);
    expect(toggled.isSelected).toBe(false);
    const toggledBack = await toggleSelected(db, toggled);
    expect(toggledBack.isSelected).toBe(true);
  });

  it('deletes a custom resource', async () => {
    const r = await createCrisisResource(db, { name: 'Custom', displayOrder: 0, isCustom: true });
    await deleteCrisisResource(db, r);
    const remaining = await fetchCrisisResources(db);
    expect(remaining).toHaveLength(0);
  });

  it('does not delete a non-custom resource', async () => {
    const r = await createCrisisResource(db, { name: '988', displayOrder: 0, isCustom: false });
    await deleteCrisisResource(db, r);
    const remaining = await fetchCrisisResources(db);
    // Should still be there
    expect(remaining).toHaveLength(1);
  });
});
