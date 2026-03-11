import { Database } from '@nozbe/watermelondb';
import SafetyPlan from '../db/models/SafetyPlan';
import WarningSign from '../db/models/WarningSign';
import CopingStrategy from '../db/models/CopingStrategy';
import Contact from '../db/models/Contact';
import UserSettings, { OnboardingPath } from '../db/models/UserSettings';

export interface ContactEntry {
  name: string;
  phone: string;
}

export interface PlanData {
  warningSigns: string[];
  internalStrategies: string[];
  distractionContacts: ContactEntry[];
  personalContacts: ContactEntry[];
  professionalContacts: ContactEntry[];
  environmentSafety: string[];
}

export const EMPTY_PLAN_DATA: PlanData = {
  warningSigns: [],
  internalStrategies: [],
  distractionContacts: [],
  personalContacts: [],
  professionalContacts: [],
  environmentSafety: [],
};

/**
 * Creates the safety plan records, saves all entered data, and marks
 * onboarding as complete. Safe to call with EMPTY_PLAN_DATA for skip.
 */
export async function completeOnboarding(
  db: Database,
  path: OnboardingPath | null,
  data: PlanData,
): Promise<void> {
  // Fetch/create settings outside the write so we can update it inside.
  const settings = await UserSettings.getOrCreate(db);

  await db.write(async () => {
    const plan = await db.get<SafetyPlan>('safety_plans').create(() => {
      // SafetyPlan has no writable fields beyond associations
    });

    for (const [i, text] of data.warningSigns.entries()) {
      await db.get<WarningSign>('warning_signs').create((r) => {
        r.safetyPlanId = plan.id;
        r.text = text;
        r.displayOrder = i;
        r.active = true;
      });
    }

    for (const [i, text] of data.internalStrategies.entries()) {
      await db.get<CopingStrategy>('coping_strategies').create((r) => {
        r.safetyPlanId = plan.id;
        r.text = text;
        r.displayOrder = i;
        r.section = 'internal';
      });
    }

    for (const [i, c] of data.distractionContacts.entries()) {
      await db.get<Contact>('contacts').create((r) => {
        r.safetyPlanId = plan.id;
        r.name = c.name;
        r.phone = c.phone;
        r.contactType = 'distraction';
        r.displayOrder = i;
      });
    }

    for (const [i, c] of data.personalContacts.entries()) {
      await db.get<Contact>('contacts').create((r) => {
        r.safetyPlanId = plan.id;
        r.name = c.name;
        r.phone = c.phone;
        r.contactType = 'personal';
        r.displayOrder = i;
      });
    }

    for (const [i, c] of data.professionalContacts.entries()) {
      await db.get<Contact>('contacts').create((r) => {
        r.safetyPlanId = plan.id;
        r.name = c.name;
        r.phone = c.phone;
        r.contactType = 'professional';
        r.displayOrder = i;
      });
    }

    for (const [i, text] of data.environmentSafety.entries()) {
      await db.get<CopingStrategy>('coping_strategies').create((r) => {
        r.safetyPlanId = plan.id;
        r.text = text;
        r.displayOrder = i;
        r.section = 'environment';
      });
    }

    await settings.update((s) => {
      s.onboardingComplete = true;
      if (path) {
        s.onboardingPath = path;
      }
    });
  });
}
