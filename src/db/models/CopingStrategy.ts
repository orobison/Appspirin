import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import SafetyPlan from './SafetyPlan';

export type CopingStrategySection = 'internal' | 'distraction' | 'environment';

export default class CopingStrategy extends Model {
  static table = 'coping_strategies';

  static associations = {
    safety_plans: { type: 'belongs_to' as const, key: 'safety_plan_id' },
  };

  @field('safety_plan_id') safetyPlanId!: string;
  @field('text') text!: string;
  @field('display_order') displayOrder!: number;
  @field('section') section!: CopingStrategySection;

  @relation('safety_plans', 'safety_plan_id') safetyPlan!: SafetyPlan;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
