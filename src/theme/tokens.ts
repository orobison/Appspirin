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
  neutral700: '#374151',
  neutral800: '#1F2937',
  neutral900: '#111827',

  // Primary scale — to be set by designer
  primary50: '#EFF6FF',
  primary100: '#DBEAFE',
  primary200: '#BFDBFE',
  primary300: '#93C5FD',
  primary400: '#60A5FA',
  primary500: '#3B82F6',
  primary600: '#2563EB',
  primary700: '#1D4ED8',
  primary800: '#1E40AF',
  primary900: '#1E3A8A',

  // Semantic
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  success: '#10B981',
  successLight: '#D1FAE5',

  // Surface / background
  surface: '#FFFFFF',
  surfaceRaised: '#F9FAFB',
  background: '#F3F4F6',
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
