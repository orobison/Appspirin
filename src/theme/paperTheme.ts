import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import type { AppTheme } from './themes';

export function buildPaperTheme(appTheme: AppTheme): MD3Theme {
  const base = appTheme.isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      // Primary
      primary:               appTheme.colors.primary,
      onPrimary:             appTheme.colors.textInverse,
      primaryContainer:      appTheme.colors.primaryLight,
      onPrimaryContainer:    appTheme.colors.primaryDark,
      // Secondary — mapped from neutral tokens (no dedicated secondary token)
      secondary:             appTheme.colors.textSecondary,
      onSecondary:           appTheme.colors.textInverse,
      secondaryContainer:    appTheme.colors.surfaceRaised,
      onSecondaryContainer:  appTheme.colors.textPrimary,
      // Tertiary — mapped to success (most distinct third hue available)
      tertiary:              appTheme.colors.success,
      onTertiary:            appTheme.colors.textInverse,
      tertiaryContainer:     appTheme.colors.successLight,
      onTertiaryContainer:   appTheme.colors.success,
      // Error → danger tokens
      error:                 appTheme.colors.danger,
      onError:               appTheme.colors.textInverse,
      errorContainer:        appTheme.colors.dangerLight,
      onErrorContainer:      appTheme.colors.danger,
      // Backgrounds & surfaces
      background:            appTheme.colors.background,
      onBackground:          appTheme.colors.textPrimary,
      surface:               appTheme.colors.surface,
      onSurface:             appTheme.colors.textPrimary,
      surfaceVariant:        appTheme.colors.surfaceRaised,
      onSurfaceVariant:      appTheme.colors.textSecondary,
      // Outlines
      outline:               appTheme.colors.border,
      outlineVariant:        appTheme.colors.borderSubtle,
      // Inverse (swap modes)
      inverseSurface:        appTheme.isDark ? appTheme.colors.surface     : appTheme.colors.textPrimary,
      inverseOnSurface:      appTheme.isDark ? appTheme.colors.textPrimary : appTheme.colors.textInverse,
      inversePrimary:        appTheme.colors.primaryDark,
      // Misc
      shadow:                '#000000',
      scrim:                 '#000000',
      surfaceDisabled:       appTheme.colors.borderSubtle,
      onSurfaceDisabled:     appTheme.colors.textDisabled,
      // elevation — Paper rgba tint overlays; leave base defaults
      elevation:             base.colors.elevation,
    },
  };
}
