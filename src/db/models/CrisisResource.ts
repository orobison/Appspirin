import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class CrisisResource extends Model {
  static table = 'crisis_resources';

  @field('name') name!: string;
  @field('phone') phone!: string | null;
  @field('text_number') textNumber!: string | null;
  @field('is_selected') isSelected!: boolean;
  @field('display_order') displayOrder!: number;
  @field('is_custom') isCustom!: boolean;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
