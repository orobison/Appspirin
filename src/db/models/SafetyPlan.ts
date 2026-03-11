import { Model } from '@nozbe/watermelondb';
import { readonly, date, children } from '@nozbe/watermelondb/decorators';

export default class SafetyPlan extends Model {
  static table = 'safety_plans';

  static associations = {
    warning_signs: { type: 'has_many' as const, foreignKey: 'safety_plan_id' },
    coping_strategies: { type: 'has_many' as const, foreignKey: 'safety_plan_id' },
    contacts: { type: 'has_many' as const, foreignKey: 'safety_plan_id' },
    check_ins: { type: 'has_many' as const, foreignKey: 'safety_plan_id' },
  };

  @children('warning_signs') warningSigns!: any;
  @children('coping_strategies') copingStrategies!: any;
  @children('contacts') contacts!: any;
  @children('check_ins') checkIns!: any;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
