import { colors, typography, spacing, radii, shadows, zIndex } from './tokens';

export interface AppTheme {
  colors: {
    // Backgrounds
    background: string;
    surface: string;
    surfaceRaised: string;
    overlay: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textDisabled: string;
    textInverse: string;

    // Brand — primary
    primary: string;
    primaryLight: string;
    primaryDark: string;

    // Brand — secondary
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;

    // Semantic
    danger: string;
    dangerLight: string;
    warning: string;
    warningLight: string;
    success: string;
    successLight: string;

    // Borders
    border: string;
    borderSubtle: string;
  };
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  isDark: boolean;
}

export const lightTheme: AppTheme = {
  colors: {
    background:   colors.background,
    surface:      colors.surface,
    surfaceRaised: colors.surfaceRaised,
    overlay:      colors.overlay,

    textPrimary:   colors.neutral900,
    textSecondary: colors.neutral600,
    textDisabled:  colors.neutral400,
    textInverse:   colors.neutral0,

    primary:      colors.primary600,
    primaryLight: colors.primary100,
    primaryDark:  colors.primary800,

    secondary:      colors.secondary500,
    secondaryLight: colors.secondary100,
    secondaryDark:  colors.secondary700,

    danger:      colors.danger,
    dangerLight: colors.dangerLight,
    warning:     colors.warning,
    warningLight: colors.warningLight,
    success:     colors.success,
    successLight: colors.successLight,

    border:       colors.neutral200,
    borderSubtle: colors.neutral100,
  },
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  isDark: false,
};

export const darkTheme: AppTheme = {
  colors: {
    background:   colors.neutral900,
    surface:      colors.neutral800,
    surfaceRaised: colors.neutral700,
    overlay:      colors.overlay,

    textPrimary:   colors.neutral50,
    textSecondary: colors.neutral400,
    textDisabled:  colors.neutral600,
    textInverse:   colors.neutral900,

    primary:      colors.primary400,
    primaryLight: colors.primary900,
    primaryDark:  colors.primary200,

    secondary:      colors.secondary400,
    secondaryLight: colors.secondary900,
    secondaryDark:  colors.secondary200,

    danger:      colors.danger,
    dangerLight: '#450A0A',
    warning:     colors.warning,
    warningLight: '#451A03',
    success:     colors.success,
    successLight: '#064E3B',

    border:       colors.neutral700,
    borderSubtle: colors.neutral800,
  },
  typography,
  spacing,
  radii,
  shadows,
  zIndex,
  isDark: true,
};
