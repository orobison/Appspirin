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
  // getOrCreate() uses db.write() internally when creating the row.
  // Calling it here (outside our writer) avoids a nested-write error.
  const settings = await UserSettings.getOrCreate(db);

  // prepare* calls are synchronous and must happen outside db.write().
  // Only db.batch() needs to be inside a writer.
  const planDraft = db.get<SafetyPlan>('safety_plans').prepareCreate(() => {});

  const ops: Parameters<typeof db.batch>[0][] = [planDraft];

  for (const [i, text] of data.warningSigns.entries()) {
    ops.push(db.get<WarningSign>('warning_signs').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.text = text;
      r.displayOrder = i;
      r.active = true;
    }));
  }

  for (const [i, text] of data.internalStrategies.entries()) {
    ops.push(db.get<CopingStrategy>('coping_strategies').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.text = text;
      r.displayOrder = i;
      r.section = 'internal';
    }));
  }

  for (const [i, c] of data.distractionContacts.entries()) {
    ops.push(db.get<Contact>('contacts').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.name = c.name;
      r.phone = c.phone;
      r.contactType = 'distraction';
      r.displayOrder = i;
    }));
  }

  for (const [i, c] of data.personalContacts.entries()) {
    ops.push(db.get<Contact>('contacts').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.name = c.name;
      r.phone = c.phone;
      r.contactType = 'personal';
      r.displayOrder = i;
    }));
  }

  for (const [i, c] of data.professionalContacts.entries()) {
    ops.push(db.get<Contact>('contacts').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.name = c.name;
      r.phone = c.phone;
      r.contactType = 'professional';
      r.displayOrder = i;
    }));
  }

  for (const [i, text] of data.environmentSafety.entries()) {
    ops.push(db.get<CopingStrategy>('coping_strategies').prepareCreate((r) => {
      r.safetyPlanId = planDraft.id;
      r.text = text;
      r.displayOrder = i;
      r.section = 'environment';
    }));
  }

  ops.push(settings.prepareUpdate((s) => {
    s.onboardingComplete = true;
    if (path) s.onboardingPath = path;
  }));

  await db.write(() => db.batch(...ops));
}
