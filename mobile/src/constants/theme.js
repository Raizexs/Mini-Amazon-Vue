// Design System - Frontend-Matched Theme
export const COLORS = {
  // Primary Dark Theme (from frontend)
  darkBg: '#0f0f1e',
  darkCard: 'rgba(255, 255, 255, 0.05)',
  darkGlass: 'rgba(255, 255, 255, 0.1)',
  darkBorder: 'rgba(255, 255, 255, 0.1)',
  
  // Purple Gradients (from frontend)
  purpleStart: '#667eea',
  purpleEnd: '#764ba2',
  purpleLight: '#a78bfa',
  purpleDark: '#5a3e8c',
  
  // Secondary Gradient
  pinkStart: '#f093fb',
  pinkEnd: '#f5576c',
  
  // Text Colors
  textLight: 'rgba(255, 255, 255, 0.9)',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textDark: 'rgba(255, 255, 255, 0.4)',
  white: '#FFFFFF',
  
  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Gradients Arrays
  gradientPurple: ['#667eea', '#764ba2'],
  gradientPink: ['#f093fb', '#f5576c'],
  gradientDark: ['rgba(15, 15, 30, 0.95)', 'rgba(15, 15, 30, 0.85)'],
  gradientGlass: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
};

export const TYPOGRAPHY = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  
  // Font Weights
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 12,
  },
  purple: {
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const ANIMATIONS = {
  // Durations (ms)
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// Glassmorphism helper
export const GLASS_EFFECT = {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
};
