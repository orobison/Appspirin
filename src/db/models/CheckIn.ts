import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation, children } from '@nozbe/watermelondb/decorators';
import SafetyPlan from './SafetyPlan';

export default class CheckIn extends Model {
  static table = 'check_ins';

  static associations = {
    safety_plans: { type: 'belongs_to' as const, key: 'safety_plan_id' },
    check_in_responses: { type: 'has_many' as const, foreignKey: 'check_in_id' },
  };

  @field('safety_plan_id') safetyPlanId!: string;
  @field('timestamp') timestamp!: number;
  @field('severity_score') severityScore!: number;
  @field('notes') notes!: string | null;

  @relation('safety_plans', 'safety_plan_id') safetyPlan!: SafetyPlan;
  @children('check_in_responses') responses!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
