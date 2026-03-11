import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import CheckIn from './CheckIn';
import WarningSign from './WarningSign';

export default class CheckInResponse extends Model {
  static table = 'check_in_responses';

  static associations = {
    check_ins: { type: 'belongs_to' as const, key: 'check_in_id' },
    warning_signs: { type: 'belongs_to' as const, key: 'warning_sign_id' },
  };

  @field('check_in_id') checkInId!: string;
  @field('warning_sign_id') warningSignId!: string;
  @field('endorsed') endorsed!: boolean;

  @relation('check_ins', 'check_in_id') checkIn!: CheckIn;
  @relation('warning_signs', 'warning_sign_id') warningSign!: WarningSign;

  @readonly @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
