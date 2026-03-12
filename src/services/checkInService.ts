import { Database, Q } from '@nozbe/watermelondb';
import CheckIn from '@db/models/CheckIn';
import CheckInResponse from '@db/models/CheckInResponse';
import { CreateCheckInInput, UpdateCheckInInput } from '@db/types';

export async function createCheckIn(
  db: Database,
  planId: string,
  input: CreateCheckInInput,
): Promise<CheckIn> {
  return db.write(async () => {
    const checkIn = await db.get<CheckIn>('check_ins').create((record) => {
      record.safetyPlanId = planId;
      record.timestamp = input.timestamp;
      record.severityScore = input.severityScore;
      record.notes = input.notes ?? '';
    });

    await Promise.all(
      input.responses.map((r) =>
        db.get<CheckInResponse>('check_in_responses').create((record) => {
          record.checkInId = checkIn.id;
          record.warningSignId = r.warningSignId;
          record.endorsed = r.endorsed;
        }),
      ),
    );

    return checkIn;
  });
}

export async function fetchCheckIns(
  db: Database,
  planId: string,
  limit?: number,
): Promise<CheckIn[]> {
  const conditions: ReturnType<typeof Q.where | typeof Q.sortBy | typeof Q.take>[] = [
    Q.where('safety_plan_id', planId),
    Q.sortBy('timestamp', Q.desc),
  ];
  if (limit !== undefined) {
    conditions.push(Q.take(limit));
  }
  return db.get<CheckIn>('check_ins').query(...conditions).fetch();
}

export async function fetchCheckIn(
  db: Database,
  id: string,
): Promise<{ checkIn: CheckIn; responses: CheckInResponse[] }> {
  const checkIn = await db.get<CheckIn>('check_ins').find(id);
  const responses = await db
    .get<CheckInResponse>('check_in_responses')
    .query(Q.where('check_in_id', id))
    .fetch();
  return { checkIn, responses };
}

export async function updateCheckIn(
  db: Database,
  record: CheckIn,
  input: UpdateCheckInInput,
): Promise<CheckIn> {
  return db.write(async () => {
    return record.update((r) => {
      if (input.severityScore !== undefined) r.severityScore = input.severityScore;
      if (input.notes !== undefined) r.notes = input.notes;
    });
  });
}

export async function deleteCheckIn(
  db: Database,
  record: CheckIn,
): Promise<void> {
  await db.write(async () => {
    const responses = await db
      .get<CheckInResponse>('check_in_responses')
      .query(Q.where('check_in_id', record.id))
      .fetch();
    await Promise.all(responses.map((r) => r.destroyPermanently()));
    await record.destroyPermanently();
  });
}
