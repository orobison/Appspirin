import { Database } from '@nozbe/watermelondb';
// @ts-ignore — LokiJS adapter has no bundled typings in all versions
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import { schema } from '@db/schema';
import SafetyPlan from '@db/models/SafetyPlan';
import WarningSign from '@db/models/WarningSign';
import CopingStrategy from '@db/models/CopingStrategy';
import Contact from '@db/models/Contact';
import CrisisResource from '@db/models/CrisisResource';
import CheckIn from '@db/models/CheckIn';
import CheckInResponse from '@db/models/CheckInResponse';
import TextTemplate from '@db/models/TextTemplate';
import UserSettings from '@db/models/UserSettings';

export function makeTestDatabase(): Database {
  const adapter = new LokiJSAdapter({
    schema,
    useWebWorker: false,
    useIncrementalIndexedDB: false,
  });

  return new Database({
    adapter,
    modelClasses: [
      SafetyPlan,
      WarningSign,
      CopingStrategy,
      Contact,
      CrisisResource,
      CheckIn,
      CheckInResponse,
      TextTemplate,
      UserSettings,
    ],
  });
}
