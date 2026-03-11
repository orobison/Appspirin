import { useEffect, useState } from 'react';
import { useDatabase } from './useDatabase';
import UserSettings from '../db/models/UserSettings';
import { logger } from '../utils/logger';

/**
 * Reactive hook for the UserSettings singleton.
 * Subscribes to changes so components re-render when settings update.
 */
export function useSettings(): UserSettings | null {
  const db = useDatabase();
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const s = await UserSettings.getOrCreate(db);
        if (!cancelled) setSettings(s);
      } catch (err) {
        logger.error('Failed to load user settings:', err);
      }
    }

    load();

    // Subscribe to changes on the user_settings table
    const subscription = db
      .get<UserSettings>('user_settings')
      .query()
      .observe()
      .subscribe((rows) => {
        if (!cancelled && rows.length > 0) {
          setSettings(rows[0]);
        }
      });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [db]);

  return settings;
}
