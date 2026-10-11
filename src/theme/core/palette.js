import { varAlpha, createPaletteChannel } from 'minimal-shared/utils';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

// Primary color
export const primary = createPaletteChannel(themeConfig.palette.primary);

// Secondary color
export const secondary = createPaletteChannel(themeConfig.palette.secondary);

// Info color
export const info = createPaletteChannel(themeConfig.palette.info);

// Success color
export const success = createPaletteChannel(themeConfig.palette.success);

// Warning color
export const warning = createPaletteChannel(themeConfig.palette.warning);

// Error color
export const error = createPaletteChannel(themeConfig.palette.error);

// Common color
export const common = createPaletteChannel(themeConfig.palette.common);

// Grey color
export const grey = createPaletteChannel(themeConfig.palette.grey);

// Text color
export const text = {
  light: createPaletteChannel({
    primary: grey[800],
    secondary: grey[600],
    disabled: grey[500],
  }),
  dark: createPaletteChannel({
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#64748B',
  }),
};

// Background color
export const background = {
  light: createPaletteChannel({
    paper: '#FFFFFF',
    default: '#FFFFFF',
    neutral: grey[200],
  }),
  dark: createPaletteChannel({
    paper: '#0F172A',
    default: '#080C14',
    neutral: '#141F36',
  }),
};

// Base action color
export const baseAction = {
  hover: varAlpha(grey['500Channel'], 0.08),
  selected: varAlpha(grey['500Channel'], 0.16),
  focus: varAlpha(grey['500Channel'], 0.24),
  disabled: varAlpha(grey['500Channel'], 0.8),
  disabledBackground: varAlpha(grey['500Channel'], 0.24),
  hoverOpacity: 0.08,
  disabledOpacity: 0.48,
};

// Action color
export const action = {
  light: { ...baseAction, active: grey[600] },
  dark: { ...baseAction, active: grey[500] },
};

// ----------------------------------------------------------------------

// Base palette
export const basePalette = {
  primary,
  secondary,
  info,
  success,
  warning,
  error,
  common,
  grey,
  divider: varAlpha(grey['500Channel'], 0.2),
};

export const palette = {
  light: {
    ...basePalette,
    text: text.light,
    background: background.light,
    action: action.light,
  },
  dark: {
    ...basePalette,
    text: text.dark,
    background: background.dark,
    action: action.dark,
    divider: 'rgba(255, 255, 255, 0.08)',
  },
};
