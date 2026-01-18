/**
 * Design System - Theme Constants
 * 
 * Bold typography, consistent thick borders.
 */

export const colors = {
    // Backgrounds - Dark theme
    background: '#0D0D0D',
    surface: '#1A1A1A',
    surfaceElevated: '#242424',

    // Text
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.65)',
    tertiary: 'rgba(255, 255, 255, 0.4)',

    // Accent colors - Vibrant
    accent: '#FF6B6B',           // Coral red - work phase & primary accent
    accentBreak: '#4ECDC4',      // Bright teal - break phase
    accentPurple: '#A855F7',     // Purple for highlights

    // System
    border: 'rgba(255, 255, 255, 0.15)',
    borderStrong: 'rgba(255, 255, 255, 0.25)',
    borderFocus: 'rgba(255, 255, 255, 0.35)',

    // States
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // Timer ring
    ringBackground: 'rgba(255, 255, 255, 0.08)',
    ringWork: '#FF6B6B',
    ringBreak: '#4ECDC4',

    // Toggle colors
    toggleActive: '#22C55E',
    toggleInactive: 'rgba(255, 255, 255, 0.2)',
} as const;

export const typography = {
    // Timer display
    display: {
        fontSize: 72,
        fontWeight: '300' as const,
        letterSpacing: -2,
    },

    // Large titles - bolder
    title: {
        fontSize: 34,
        fontWeight: '800' as const,
        letterSpacing: 0.2,
    },

    // Section headers - bolder
    headline: {
        fontSize: 18,
        fontWeight: '700' as const,
        letterSpacing: -0.3,
    },

    // Body text - medium weight
    body: {
        fontSize: 17,
        fontWeight: '500' as const,
        letterSpacing: -0.3,
    },

    // Secondary text
    callout: {
        fontSize: 16,
        fontWeight: '500' as const,
        letterSpacing: -0.2,
    },

    // Captions - medium weight
    caption: {
        fontSize: 12,
        fontWeight: '500' as const,
        letterSpacing: 0,
    },

    // Small labels - semibold
    footnote: {
        fontSize: 13,
        fontWeight: '600' as const,
        letterSpacing: 0,
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

export const radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
} as const;

// Consistent border widths across app
export const borders = {
    thin: 1,
    medium: 1.5,
    thick: 2,
} as const;

export const shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
    },
    glow: {
        shadowColor: '#FF6B6B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
} as const;

export const theme = {
    colors,
    typography,
    spacing,
    radius,
    borders,
    shadows,
} as const;

export type Theme = typeof theme;
