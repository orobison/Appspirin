import { makeTestDatabase } from './testHelpers/testDb';
import { getSettings, updateSettings } from './settingsService';

describe('settingsService', () => {
  let db: ReturnType<typeof makeTestDatabase>;

  beforeEach(() => {
    db = makeTestDatabase();
  });

  it('getSettings creates settings with defaults on first call', async () => {
    const settings = await getSettings(db);
    expect(settings.theme).toBe('system');
    expect(settings.checkInFrequency).toBe('daily');
    expect(settings.onboardingComplete).toBe(false);
    expect(settings.nudgeThreshold).toBe(3);
  });

  it('getSettings returns same record on repeated calls', async () => {
    const s1 = await getSettings(db);
    const s2 = await getSettings(db);
    expect(s1.id).toBe(s2.id);
  });

  it('updates theme', async () => {
    const updated = await updateSettings(db, { theme: 'dark' });
    expect(updated.theme).toBe('dark');
  });

  it('updates checkInFrequency', async () => {
    const updated = await updateSettings(db, { checkInFrequency: 'weekly' });
    expect(updated.checkInFrequency).toBe('weekly');
  });

  it('updates checkInTimes and stores as JSON', async () => {
    const updated = await updateSettings(db, { checkInTimes: ['08:00', '20:00'] });
    expect(updated.checkInTimes).toBe(JSON.stringify(['08:00', '20:00']));
  });

  it('updates onboardingComplete and path', async () => {
    const updated = await updateSettings(db, {
      onboardingComplete: true,
      onboardingPath: 'quick',
    });
    expect(updated.onboardingComplete).toBe(true);
    expect(updated.onboardingPath).toBe('quick');
  });

  it('updates nudgeThreshold', async () => {
    const updated = await updateSettings(db, { nudgeThreshold: 5 });
    expect(updated.nudgeThreshold).toBe(5);
  });
});
