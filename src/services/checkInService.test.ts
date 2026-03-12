import { Q } from '@nozbe/watermelondb';
import { makeTestDatabase } from './testHelpers/testDb';
import { getOrCreatePlan, createWarningSign } from './planService';
import {
  createCheckIn,
  fetchCheckIns,
  fetchCheckIn,
  updateCheckIn,
  deleteCheckIn,
} from './checkInService';

describe('checkInService', () => {
  let db: ReturnType<typeof makeTestDatabase>;

  beforeEach(() => {
    db = makeTestDatabase();
  });

  it('creates a check-in with responses atomically', async () => {
    const plan = await getOrCreatePlan(db);
    const ws = await createWarningSign(db, plan.id, { text: 'Anxious', displayOrder: 0 });

    const checkIn = await createCheckIn(db, plan.id, {
      timestamp: Date.now(),
      severityScore: 3,
      responses: [{ warningSignId: ws.id, endorsed: true }],
    });

    expect(checkIn.severityScore).toBe(3);
    expect(checkIn.safetyPlanId).toBe(plan.id);

    const { responses } = await fetchCheckIn(db, checkIn.id);
    expect(responses).toHaveLength(1);
    expect(responses[0].endorsed).toBe(true);
    expect(responses[0].warningSignId).toBe(ws.id);
  });

  it('creates a check-in with no responses', async () => {
    const plan = await getOrCreatePlan(db);
    const checkIn = await createCheckIn(db, plan.id, {
      timestamp: Date.now(),
      severityScore: 1,
      responses: [],
    });
    const { responses } = await fetchCheckIn(db, checkIn.id);
    expect(responses).toHaveLength(0);
  });

  it('fetchCheckIns returns ordered by timestamp desc', async () => {
    const plan = await getOrCreatePlan(db);
    const now = Date.now();
    await createCheckIn(db, plan.id, { timestamp: now - 1000, severityScore: 1, responses: [] });
    await createCheckIn(db, plan.id, { timestamp: now, severityScore: 2, responses: [] });

    const results = await fetchCheckIns(db, plan.id);
    expect(results[0].severityScore).toBe(2);
    expect(results[1].severityScore).toBe(1);
  });

  it('fetchCheckIns respects limit', async () => {
    const plan = await getOrCreatePlan(db);
    const now = Date.now();
    await createCheckIn(db, plan.id, { timestamp: now - 2000, severityScore: 1, responses: [] });
    await createCheckIn(db, plan.id, { timestamp: now - 1000, severityScore: 2, responses: [] });
    await createCheckIn(db, plan.id, { timestamp: now, severityScore: 3, responses: [] });

    const limited = await fetchCheckIns(db, plan.id, 2);
    expect(limited).toHaveLength(2);
    expect(limited[0].severityScore).toBe(3);
  });

  it('updates a check-in', async () => {
    const plan = await getOrCreatePlan(db);
    const checkIn = await createCheckIn(db, plan.id, {
      timestamp: Date.now(),
      severityScore: 2,
      responses: [],
    });
    const updated = await updateCheckIn(db, checkIn, { severityScore: 5, notes: 'Rough day' });
    expect(updated.severityScore).toBe(5);
    expect(updated.notes).toBe('Rough day');
  });

  it('deleteCheckIn cascades to responses', async () => {
    const plan = await getOrCreatePlan(db);
    const ws = await createWarningSign(db, plan.id, { text: 'Sad', displayOrder: 0 });
    const checkIn = await createCheckIn(db, plan.id, {
      timestamp: Date.now(),
      severityScore: 2,
      responses: [{ warningSignId: ws.id, endorsed: true }],
    });

    await deleteCheckIn(db, checkIn);

    const remaining = await fetchCheckIns(db, plan.id);
    expect(remaining).toHaveLength(0);

    // Responses should also be gone
    const orphans = await db
      .get('check_in_responses')
      .query(Q.where('check_in_id', checkIn.id))
      .fetch();
    expect(orphans).toHaveLength(0);
  });
});
