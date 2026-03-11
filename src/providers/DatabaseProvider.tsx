import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { createDatabase } from '../db';
import { getOrCreateEncryptionKey } from '../services/encryption';
import { seedCrisisResources } from '../db/seeds/crisisResources';
import { logger } from '../utils/logger';

const DatabaseContext = createContext<Database | null>(null);

interface DatabaseProviderProps {
  children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [db, setDb] = useState<Database | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const key = await getOrCreateEncryptionKey();
        const database = createDatabase(key);
        await seedCrisisResources(database);
        if (!cancelled) {
          setDb(database);
        }
      } catch (err) {
        logger.error('Database initialization failed:', err);
        // In production, surface a proper error UI; stub here
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!db) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
}

export function useDatabase(): Database {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return db;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
