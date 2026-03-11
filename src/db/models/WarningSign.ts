import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import SafetyPlan from './SafetyPlan';

export default class WarningSign extends Model {
  static table = 'warning_signs';

  static associations = {
    safety_plans: { type: 'belongs_to' as const, key: 'safety_plan_id' },
  };

  @field('safety_plan_id') safetyPlanId!: string;
  @field('text') text!: string;
  @field('display_order') displayOrder!: number;
  @field('active') active!: boolean;

  @relation('safety_plans', 'safety_plan_id') safetyPlan!: SafetyPlan;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
