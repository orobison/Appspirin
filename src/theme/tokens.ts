// Shape defined by Claude Code. Values to be filled by designer.

export const colors = {
  // Neutral scale
  neutral0: '#FFFFFF',
  neutral50: '#F9FAFB',
  neutral100: '#F3F4F6',
  neutral200: '#E5E7EB',
  neutral300: '#D1D5DB',
  neutral400: '#9CA3AF',
  neutral500: '#6B7280',
  neutral600: '#4B5563',
  neutral700: '#364924',  // olive-tinted dark — dark mode raised surface / border
  neutral800: '#2E3F1E',  // olive dark — dark mode surface
  neutral900: '#283618',  // olive darkest — light mode text / dark mode background

  // Primary scale — olive green
  primary50:  '#f4f6e8',
  primary100: '#e6ead0',
  primary200: '#cbd5a1',
  primary300: '#acbd70',
  primary400: '#8da44b',
  primary500: '#728840',
  primary600: '#606c38',
  primary700: '#4d5830',
  primary800: '#3a4224',
  primary900: '#283618',

  // Secondary scale — warm amber
  secondary50:  '#fdf3eb',
  secondary100: '#fae3ce',
  secondary200: '#f3c89a',
  secondary300: '#ecb578',
  secondary400: '#e8a96a',
  secondary500: '#dda15e',
  secondary600: '#c98640',
  secondary700: '#a56b30',
  secondary800: '#7a4d22',
  secondary900: '#523314',

  // Semantic
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',

  // Surface / background
  surface: '#FFFFFF',
  surfaceRaised: '#fdf7d6',
  background: '#fefae0',
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export const typography = {
  fontFamily: {
    regular: undefined as string | undefined, // system default
    medium: undefined as string | undefined,
    semiBold: undefined as string | undefined,
    bold: undefined as string | undefined,
    mono: undefined as string | undefined,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;

export const zIndex = {
  base: 0,
  card: 10,
  drawer: 50,
  overlay: 90,
  crisisButton: 100,
} as const;
