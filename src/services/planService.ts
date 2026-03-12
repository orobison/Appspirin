import { Database, Q } from '@nozbe/watermelondb';
import SafetyPlan from '@db/models/SafetyPlan';
import WarningSign from '@db/models/WarningSign';
import CopingStrategy from '@db/models/CopingStrategy';
import Contact from '@db/models/Contact';
import {
  CreateWarningSignInput,
  UpdateWarningSignInput,
  CreateCopingStrategyInput,
  UpdateCopingStrategyInput,
  ContactType,
  CreateContactInput,
  UpdateContactInput,
  CopingStrategySection,
} from '@db/types';

// ── SafetyPlan ────────────────────────────────────────────────────────────────

export async function getOrCreatePlan(db: Database): Promise<SafetyPlan> {
  const plans = await db.get<SafetyPlan>('safety_plans').query().fetch();
  if (plans.length > 0) {
    return plans[0];
  }
  return db.write(async () => {
    return db.get<SafetyPlan>('safety_plans').create(() => {});
  });
}

// ── WarningSign ───────────────────────────────────────────────────────────────

export async function fetchWarningSigns(
  db: Database,
  planId: string,
): Promise<WarningSign[]> {
  return db
    .get<WarningSign>('warning_signs')
    .query(Q.where('safety_plan_id', planId), Q.sortBy('display_order', Q.asc))
    .fetch();
}

export async function createWarningSign(
  db: Database,
  planId: string,
  input: CreateWarningSignInput,
): Promise<WarningSign> {
  return db.write(async () => {
    return db.get<WarningSign>('warning_signs').create((record) => {
      record.safetyPlanId = planId;
      record.text = input.text;
      record.displayOrder = input.displayOrder;
      record.active = input.active ?? true;
    });
  });
}

export async function updateWarningSign(
  db: Database,
  record: WarningSign,
  input: UpdateWarningSignInput,
): Promise<WarningSign> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.text !== undefined) r.text = input.text;
      if (input.displayOrder !== undefined) r.displayOrder = input.displayOrder;
      if (input.active !== undefined) r.active = input.active;
    });
  });
}

export async function deleteWarningSign(
  db: Database,
  record: WarningSign,
): Promise<void> {
  await db.write(async () => {
    await record.destroyPermanently();
  });
}

export async function reorderWarningSign(
  db: Database,
  record: WarningSign,
  newOrder: number,
): Promise<WarningSign> {
  return updateWarningSign(db, record, { displayOrder: newOrder });
}

// ── CopingStrategy ────────────────────────────────────────────────────────────

export async function fetchCopingStrategies(
  db: Database,
  planId: string,
  section?: CopingStrategySection,
): Promise<CopingStrategy[]> {
  const conditions = [
    Q.where('safety_plan_id', planId),
    Q.sortBy('display_order', Q.asc),
  ];
  if (section !== undefined) {
    conditions.splice(1, 0, Q.where('section', section));
  }
  return db.get<CopingStrategy>('coping_strategies').query(...conditions).fetch();
}

export async function createCopingStrategy(
  db: Database,
  planId: string,
  input: CreateCopingStrategyInput,
): Promise<CopingStrategy> {
  return db.write(async () => {
    return db.get<CopingStrategy>('coping_strategies').create((record) => {
      record.safetyPlanId = planId;
      record.text = input.text;
      record.displayOrder = input.displayOrder;
      record.section = input.section;
    });
  });
}

export async function updateCopingStrategy(
  db: Database,
  record: CopingStrategy,
  input: UpdateCopingStrategyInput,
): Promise<CopingStrategy> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.text !== undefined) r.text = input.text;
      if (input.displayOrder !== undefined) r.displayOrder = input.displayOrder;
      if (input.section !== undefined) r.section = input.section;
    });
  });
}

export async function deleteCopingStrategy(
  db: Database,
  record: CopingStrategy,
): Promise<void> {
  await db.write(async () => {
    await record.destroyPermanently();
  });
}

// ── Contact ───────────────────────────────────────────────────────────────────

export async function fetchContacts(
  db: Database,
  planId: string,
  type?: ContactType,
): Promise<Contact[]> {
  const conditions = [
    Q.where('safety_plan_id', planId),
    Q.sortBy('display_order', Q.asc),
  ];
  if (type !== undefined) {
    conditions.splice(1, 0, Q.where('contact_type', type));
  }
  return db.get<Contact>('contacts').query(...conditions).fetch();
}

export async function createContact(
  db: Database,
  planId: string,
  input: CreateContactInput,
): Promise<Contact> {
  return db.write(async () => {
    return db.get<Contact>('contacts').create((record) => {
      record.safetyPlanId = planId;
      record.name = input.name;
      record.phone = input.phone;
      record.relationship = input.relationship ?? '';
      record.contactType = input.contactType;
      record.displayOrder = input.displayOrder;
    });
  });
}

export async function updateContact(
  db: Database,
  record: Contact,
  input: UpdateContactInput,
): Promise<Contact> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.name !== undefined) r.name = input.name;
      if (input.phone !== undefined) r.phone = input.phone;
      if (input.relationship !== undefined) r.relationship = input.relationship;
      if (input.contactType !== undefined) r.contactType = input.contactType;
      if (input.displayOrder !== undefined) r.displayOrder = input.displayOrder;
    });
  });
}

export async function deleteContact(
  db: Database,
  record: Contact,
): Promise<void> {
  await db.write(async () => {
    await record.destroyPermanently();
  });
}
