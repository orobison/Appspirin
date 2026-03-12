import { ExpoConfig, ConfigContext } from 'expo/config';

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getAppName = (): string => {
  if (IS_DEV) return 'Appspirin (Dev)';
  if (IS_PREVIEW) return 'Appspirin (Preview)';
  return 'Appspirin';
};

const getBundleIdentifier = (): string => {
  if (IS_DEV) return 'com.appspirin.dev';
  if (IS_PREVIEW) return 'com.appspirin.preview';
  return 'com.appspirin.app';
};

const getAndroidPackage = (): string => {
  if (IS_DEV) return 'com.appspirin.app.dev';
  if (IS_PREVIEW) return 'com.appspirin.app.preview';
  return 'com.appspirin.app';
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: config.slug ?? 'Appspirin',
  name: getAppName(),
  ios: {
    ...config.ios,
    bundleIdentifier: getBundleIdentifier(),
  },
  android: {
    ...config.android,
    package: getAndroidPackage(),
  },
});
