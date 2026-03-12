import { Database } from '@nozbe/watermelondb';
import UserSettings from '@db/models/UserSettings';
import { UpdateUserSettingsInput } from '@db/types';

export async function getSettings(db: Database): Promise<UserSettings> {
  return UserSettings.getOrCreate(db);
}

export async function updateSettings(
  db: Database,
  input: UpdateUserSettingsInput,
): Promise<UserSettings> {
  const settings = await getSettings(db);
  return db.write(async () => {
    return settings.update((r) => {
      if (input.theme !== undefined) r.theme = input.theme;
      if (input.checkInFrequency !== undefined) r.checkInFrequency = input.checkInFrequency;
      if (input.checkInTimes !== undefined) r.checkInTimes = JSON.stringify(input.checkInTimes);
      if (input.nudgeThreshold !== undefined) r.nudgeThreshold = input.nudgeThreshold;
      if (input.onboardingComplete !== undefined) r.onboardingComplete = input.onboardingComplete;
      if ('onboardingPath' in input) {
        r.onboardingPath = input.onboardingPath ?? null;
      }
    });
  });
}
