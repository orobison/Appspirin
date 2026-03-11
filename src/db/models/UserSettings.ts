import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';
import { Database } from '@nozbe/watermelondb';

export type ThemePreference = 'light' | 'dark' | 'system';
export type CheckInFrequency = 'daily' | 'weekly' | 'off';
export type OnboardingPath = 'quick' | 'walkthrough';

export default class UserSettings extends Model {
  static table = 'user_settings';

  @field('theme') theme!: ThemePreference;
  @field('check_in_frequency') checkInFrequency!: CheckInFrequency;
  @field('check_in_times') checkInTimes!: string; // JSON array of HH:MM strings
  @field('nudge_threshold') nudgeThreshold!: number;
  @field('onboarding_complete') onboardingComplete!: boolean;
  @field('onboarding_path') onboardingPath!: OnboardingPath | null;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;

  /** Returns existing settings row, or creates one with defaults. */
  static async getOrCreate(db: Database): Promise<UserSettings> {
    const collection = db.get<UserSettings>('user_settings');
    const existing = await collection.query().fetch();
    if (existing.length > 0) {
      return existing[0];
    }
    return db.write(async () => {
      return collection.create((record) => {
        record.theme = 'system';
        record.checkInFrequency = 'daily';
        record.checkInTimes = JSON.stringify(['09:00']);
        record.nudgeThreshold = 3;
        record.onboardingComplete = false;
      });
    });
  }
}
