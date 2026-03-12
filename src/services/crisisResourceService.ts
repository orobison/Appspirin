import { Database, Q } from '@nozbe/watermelondb';
import CrisisResource from '@db/models/CrisisResource';
import { CreateCrisisResourceInput, UpdateCrisisResourceInput } from '@db/types';
import { logger } from '@utils/logger';

export async function fetchCrisisResources(db: Database): Promise<CrisisResource[]> {
  return db
    .get<CrisisResource>('crisis_resources')
    .query(Q.sortBy('display_order', Q.asc))
    .fetch();
}

export async function createCrisisResource(
  db: Database,
  input: CreateCrisisResourceInput,
): Promise<CrisisResource> {
  return db.write(async () => {
    return db.get<CrisisResource>('crisis_resources').create((record) => {
      record.name = input.name;
      record.phone = input.phone ?? '';
      record.textNumber = input.textNumber ?? '';
      record.isSelected = input.isSelected ?? true;
      record.displayOrder = input.displayOrder;
      record.isCustom = input.isCustom ?? true;
    });
  });
}

export async function updateCrisisResource(
  db: Database,
  record: CrisisResource,
  input: UpdateCrisisResourceInput,
): Promise<CrisisResource> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.name !== undefined) r.name = input.name;
      if (input.phone !== undefined) r.phone = input.phone;
      if (input.textNumber !== undefined) r.textNumber = input.textNumber;
      if (input.isSelected !== undefined) r.isSelected = input.isSelected;
      if (input.displayOrder !== undefined) r.displayOrder = input.displayOrder;
    });
  });
}

export async function deleteCrisisResource(
  db: Database,
  record: CrisisResource,
): Promise<void> {
  if (!record.isCustom) {
    logger.warn('Attempted to delete a non-custom crisis resource; skipping.');
    return;
  }
  await db.write(async () => {
    await record.destroyPermanently();
  });
}

export async function toggleSelected(
  db: Database,
  record: CrisisResource,
): Promise<CrisisResource> {
  return db.write(async () => {
    return record.update((r) => {
      r.isSelected = !r.isSelected;
    });
  });
}
