import * as Keychain from 'react-native-keychain';
import { getOrCreateEncryptionKey } from './encryption';

jest.mock('react-native-keychain');

const mockKeychain = Keychain as jest.Mocked<typeof Keychain>;

describe('getOrCreateEncryptionKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a 64-character hex string when no key exists', async () => {
    mockKeychain.getGenericPassword.mockResolvedValue(false);
    mockKeychain.setGenericPassword.mockResolvedValue({ service: 'appspirin_db_key', storage: 'keychain' });

    const key = await getOrCreateEncryptionKey();

    expect(key).toHaveLength(64);
    expect(key).toMatch(/^[0-9a-f]{64}$/);
  });

  it('returns the same key on a second call (reads from keychain)', async () => {
    const existingKey = 'a'.repeat(64);
    mockKeychain.getGenericPassword.mockResolvedValue({
      username: 'appspirin',
      password: existingKey,
      service: 'appspirin_db_key',
      storage: 'keychain',
    });

    const key = await getOrCreateEncryptionKey();

    expect(key).toBe(existingKey);
    expect(mockKeychain.setGenericPassword).not.toHaveBeenCalled();
  });

  it('throws if keychain storage fails', async () => {
    mockKeychain.getGenericPassword.mockResolvedValue(false);
    mockKeychain.setGenericPassword.mockRejectedValue(new Error('Keychain unavailable'));

    await expect(getOrCreateEncryptionKey()).rejects.toThrow(
      'Could not persist encryption key. App cannot start.',
    );
  });
});
