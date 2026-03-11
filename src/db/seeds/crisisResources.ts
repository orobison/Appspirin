import { Database } from '@nozbe/watermelondb';
import { DEFAULT_CRISIS_LINES } from '../../constants/crisisLines';
import CrisisResource from '../models/CrisisResource';

export async function seedCrisisResources(db: Database): Promise<void> {
  const collection = db.get<CrisisResource>('crisis_resources');
  const existing = await collection.query().fetch();
  if (existing.length > 0) return; // already seeded

  await db.write(async () => {
    for (const line of DEFAULT_CRISIS_LINES) {
      await collection.create((record) => {
        record.name = line.name;
        record.phone = line.phone ?? null;
        record.textNumber = line.textNumber ?? null;
        record.isSelected = true;
        record.displayOrder = line.displayOrder;
        record.isCustom = false;
      });
    }
  });
}
