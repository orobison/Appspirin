import { useEffect, useRef, useReducer } from 'react';
import { useDatabase } from './useDatabase';
import UserSettings from '../db/models/UserSettings';
import { logger } from '../utils/logger';

/**
 * Reactive hook for the UserSettings singleton.
 * Subscribes to changes so components re-render when settings update.
 *
 * Uses useRef + forceUpdate instead of useState to avoid React's
 * Object.is bail-out: WatermelonDB mutates Model instances in place,
 * so the same reference is re-emitted after an update — useState would
 * silently skip the re-render. The ref holds the latest value while the
 * reducer counter guarantees a re-render on every emission.
 */
export function useSettings(): UserSettings | null {
  const db = useDatabase();
  const settingsRef = useRef<UserSettings | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const s = await UserSettings.getOrCreate(db);
        if (!cancelled) {
          settingsRef.current = s;
          forceUpdate();
        }
      } catch (err) {
        logger.error('Failed to load user settings:', err);
      }
    }

    load();

    const subscription = db
      .get<UserSettings>('user_settings')
      .query()
      .observe()
      .subscribe((rows) => {
        if (!cancelled) {
          settingsRef.current = rows.length > 0 ? rows[0] : null;
          forceUpdate();
        }
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [db]);

  return settingsRef.current;
}
