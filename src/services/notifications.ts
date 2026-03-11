import * as ExpoNotifications from 'expo-notifications';
import { logger } from '../utils/logger';

ExpoNotifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await ExpoNotifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await ExpoNotifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleCheckInReminder(
  hour: number,
  minute: number,
): Promise<string | null> {
  const granted = await requestNotificationPermissions();
  if (!granted) {
    logger.warn('Notification permissions not granted');
    return null;
  }

  const id = await ExpoNotifications.scheduleNotificationAsync({
    content: {
      title: 'Check-in reminder',
      body: "How are you doing? It's time for your daily check-in.",
    },
    trigger: {
      type: ExpoNotifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });

  return id;
}

export async function cancelAllReminders(): Promise<void> {
  await ExpoNotifications.cancelAllScheduledNotificationsAsync();
}
