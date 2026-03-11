import { Linking } from 'react-native';
import { logger } from '../utils/logger';

/** Opens the phone dialer with the given number. No confirmation gate. */
export async function callNumber(phone: string): Promise<void> {
  const url = `tel:${phone.replace(/\s/g, '')}`;
  try {
    await Linking.openURL(url);
  } catch (err) {
    logger.error('Failed to open phone dialer:', err);
  }
}

/** Opens the SMS app pre-addressed to the given number with optional body. No confirmation gate. */
export async function sendSms(phone: string, body?: string): Promise<void> {
  const number = phone.replace(/\s/g, '');
  const encoded = body ? encodeURIComponent(body) : '';
  // iOS uses `&body=`, Android uses `?body=` — using & works on both in practice
  const url = `sms:${number}${encoded ? `&body=${encoded}` : ''}`;
  try {
    await Linking.openURL(url);
  } catch (err) {
    logger.error('Failed to open SMS app:', err);
  }
}

/** Default crisis action: call 988. Used by NeedHelpNowButton when no custom lines configured. */
export function callDefault988(): Promise<void> {
  return callNumber('988');
}
