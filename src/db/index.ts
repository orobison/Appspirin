import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import { migrations } from './migrations';

import SafetyPlan from './models/SafetyPlan';
import WarningSign from './models/WarningSign';
import CopingStrategy from './models/CopingStrategy';
import Contact from './models/Contact';
import CrisisResource from './models/CrisisResource';
import CheckIn from './models/CheckIn';
import CheckInResponse from './models/CheckInResponse';
import TextTemplate from './models/TextTemplate';
import UserSettings from './models/UserSettings';

export const MODEL_CLASSES = [
  SafetyPlan,
  WarningSign,
  CopingStrategy,
  Contact,
  CrisisResource,
  CheckIn,
  CheckInResponse,
  TextTemplate,
  UserSettings,
];

/** Creates and returns the Database instance. Resolves when the adapter is ready. */
export function createDatabase(encryptionKey: string): Database {
  const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: 'appspirin',
    // SQLCipher encryption key injected here
    key: encryptionKey,
    jsi: true,
    onSetUpError: (error) => {
      throw new Error(`Database setup failed: ${error.message}`);
    },
  });

  return new Database({
    adapter,
    modelClasses: MODEL_CLASSES,
  });
}

export {
  SafetyPlan,
  WarningSign,
  CopingStrategy,
  Contact,
  CrisisResource,
  CheckIn,
  CheckInResponse,
  TextTemplate,
  UserSettings,
};
