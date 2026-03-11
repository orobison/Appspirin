import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class TextTemplate extends Model {
  static table = 'text_templates';

  @field('text') text!: string;
  @field('is_default') isDefault!: boolean;
  @field('display_order') displayOrder!: number;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
