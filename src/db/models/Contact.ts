import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import SafetyPlan from './SafetyPlan';

export type ContactType = 'distraction' | 'personal' | 'professional';

export default class Contact extends Model {
  static table = 'contacts';

  static associations = {
    safety_plans: { type: 'belongs_to' as const, key: 'safety_plan_id' },
  };

  @field('safety_plan_id') safetyPlanId!: string;
  @field('name') name!: string;
  @field('phone') phone!: string;
  @field('relationship') relationship!: string | null;
  @field('contact_type') contactType!: ContactType;
  @field('display_order') displayOrder!: number;

  @relation('safety_plans', 'safety_plan_id') safetyPlan!: SafetyPlan;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
