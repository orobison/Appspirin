import { makeTestDatabase } from './testHelpers/testDb';
import {
  getOrCreatePlan,
  fetchWarningSigns,
  createWarningSign,
  updateWarningSign,
  deleteWarningSign,
  reorderWarningSign,
  fetchCopingStrategies,
  createCopingStrategy,
  updateCopingStrategy,
  deleteCopingStrategy,
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
} from './planService';

describe('planService', () => {
  let db: ReturnType<typeof makeTestDatabase>;

  beforeEach(() => {
    db = makeTestDatabase();
  });

  // ── SafetyPlan ──────────────────────────────────────────────────────────────

  describe('getOrCreatePlan', () => {
    it('creates a plan on first call', async () => {
      const plan = await getOrCreatePlan(db);
      expect(plan).toBeDefined();
      expect(plan.id).toBeTruthy();
    });

    it('returns the same plan on subsequent calls', async () => {
      const plan1 = await getOrCreatePlan(db);
      const plan2 = await getOrCreatePlan(db);
      expect(plan1.id).toBe(plan2.id);
    });
  });

  // ── WarningSign ─────────────────────────────────────────────────────────────

  describe('WarningSign CRUD', () => {
    it('creates a warning sign', async () => {
      const plan = await getOrCreatePlan(db);
      const ws = await createWarningSign(db, plan.id, {
        text: 'Feeling isolated',
        displayOrder: 0,
      });
      expect(ws.text).toBe('Feeling isolated');
      expect(ws.displayOrder).toBe(0);
      expect(ws.active).toBe(true);
      expect(ws.safetyPlanId).toBe(plan.id);
    });

    it('fetchWarningSigns returns sorted by displayOrder', async () => {
      const plan = await getOrCreatePlan(db);
      await createWarningSign(db, plan.id, { text: 'B', displayOrder: 1 });
      await createWarningSign(db, plan.id, { text: 'A', displayOrder: 0 });
      const results = await fetchWarningSigns(db, plan.id);
      expect(results.map((r) => r.text)).toEqual(['A', 'B']);
    });

    it('updates a warning sign', async () => {
      const plan = await getOrCreatePlan(db);
      const ws = await createWarningSign(db, plan.id, {
        text: 'Old text',
        displayOrder: 0,
      });
      const updated = await updateWarningSign(db, ws, { text: 'New text', active: false });
      expect(updated.text).toBe('New text');
      expect(updated.active).toBe(false);
    });

    it('deletes a warning sign', async () => {
      const plan = await getOrCreatePlan(db);
      const ws = await createWarningSign(db, plan.id, {
        text: 'To delete',
        displayOrder: 0,
      });
      await deleteWarningSign(db, ws);
      const results = await fetchWarningSigns(db, plan.id);
      expect(results).toHaveLength(0);
    });

    it('reorders a warning sign', async () => {
      const plan = await getOrCreatePlan(db);
      const ws = await createWarningSign(db, plan.id, {
        text: 'First',
        displayOrder: 0,
      });
      const reordered = await reorderWarningSign(db, ws, 5);
      expect(reordered.displayOrder).toBe(5);
    });
  });

  // ── CopingStrategy ──────────────────────────────────────────────────────────

  describe('CopingStrategy CRUD', () => {
    it('creates a coping strategy', async () => {
      const plan = await getOrCreatePlan(db);
      const cs = await createCopingStrategy(db, plan.id, {
        text: 'Take a walk',
        displayOrder: 0,
        section: 'internal',
      });
      expect(cs.text).toBe('Take a walk');
      expect(cs.section).toBe('internal');
    });

    it('fetches strategies filtered by section', async () => {
      const plan = await getOrCreatePlan(db);
      await createCopingStrategy(db, plan.id, { text: 'A', displayOrder: 0, section: 'internal' });
      await createCopingStrategy(db, plan.id, { text: 'B', displayOrder: 0, section: 'distraction' });
      const internal = await fetchCopingStrategies(db, plan.id, 'internal');
      expect(internal).toHaveLength(1);
      expect(internal[0].text).toBe('A');
    });

    it('fetches all strategies when section omitted', async () => {
      const plan = await getOrCreatePlan(db);
      await createCopingStrategy(db, plan.id, { text: 'A', displayOrder: 0, section: 'internal' });
      await createCopingStrategy(db, plan.id, { text: 'B', displayOrder: 1, section: 'environment' });
      const all = await fetchCopingStrategies(db, plan.id);
      expect(all).toHaveLength(2);
    });

    it('updates a coping strategy', async () => {
      const plan = await getOrCreatePlan(db);
      const cs = await createCopingStrategy(db, plan.id, { text: 'Old', displayOrder: 0, section: 'internal' });
      const updated = await updateCopingStrategy(db, cs, { text: 'New', section: 'distraction' });
      expect(updated.text).toBe('New');
      expect(updated.section).toBe('distraction');
    });

    it('deletes a coping strategy', async () => {
      const plan = await getOrCreatePlan(db);
      const cs = await createCopingStrategy(db, plan.id, { text: 'Gone', displayOrder: 0, section: 'internal' });
      await deleteCopingStrategy(db, cs);
      const all = await fetchCopingStrategies(db, plan.id);
      expect(all).toHaveLength(0);
    });
  });

  // ── Contact ─────────────────────────────────────────────────────────────────

  describe('Contact CRUD', () => {
    it('creates a contact', async () => {
      const plan = await getOrCreatePlan(db);
      const contact = await createContact(db, plan.id, {
        name: 'Alice',
        phone: '555-0100',
        contactType: 'personal',
        displayOrder: 0,
      });
      expect(contact.name).toBe('Alice');
      expect(contact.contactType).toBe('personal');
    });

    it('fetches contacts filtered by type', async () => {
      const plan = await getOrCreatePlan(db);
      await createContact(db, plan.id, { name: 'Alice', phone: '555-0100', contactType: 'personal', displayOrder: 0 });
      await createContact(db, plan.id, { name: 'Dr. Smith', phone: '555-0200', contactType: 'professional', displayOrder: 0 });
      const personal = await fetchContacts(db, plan.id, 'personal');
      expect(personal).toHaveLength(1);
      expect(personal[0].name).toBe('Alice');
    });

    it('fetches all contacts when type omitted', async () => {
      const plan = await getOrCreatePlan(db);
      await createContact(db, plan.id, { name: 'A', phone: '1', contactType: 'personal', displayOrder: 0 });
      await createContact(db, plan.id, { name: 'B', phone: '2', contactType: 'distraction', displayOrder: 1 });
      const all = await fetchContacts(db, plan.id);
      expect(all).toHaveLength(2);
    });

    it('updates a contact', async () => {
      const plan = await getOrCreatePlan(db);
      const c = await createContact(db, plan.id, { name: 'Old', phone: '1', contactType: 'personal', displayOrder: 0 });
      const updated = await updateContact(db, c, { name: 'New', phone: '2' });
      expect(updated.name).toBe('New');
      expect(updated.phone).toBe('2');
    });

    it('deletes a contact', async () => {
      const plan = await getOrCreatePlan(db);
      const c = await createContact(db, plan.id, { name: 'Gone', phone: '0', contactType: 'personal', displayOrder: 0 });
      await deleteContact(db, c);
      const all = await fetchContacts(db, plan.id);
      expect(all).toHaveLength(0);
    });
  });
});
