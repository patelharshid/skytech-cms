// ----------------------------------------------------------------------

export const themeConfig = {
  /** **************************************
   * Base
   *************************************** */
  direction: 'ltr',
  defaultMode: 'dark',
  modeStorageKey: 'skytech-black-theme-mode',
  classesPrefix: 'minimal',
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: 'Open Sans',
    secondary: 'Open Sans',
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: '#FEF3C7',
      light: '#FBBF24',
      main: '#F59E0B',
      dark: '#D97706',
      darker: '#92400E',
      contrastText: '#080C14',
    },
    secondary: {
      lighter: '#CFFAFE',
      light: '#67E8F9',
      main: '#06B6D4',
      dark: '#0284C7',
      darker: '#075985',
      contrastText: '#080C14',
    },
    info: {
      lighter: '#CFFAFE',
      light: '#67E8F9',
      main: '#06B6D4',
      dark: '#0284C7',
      darker: '#075985',
      contrastText: '#FFFFFF',
    },
    success: {
      lighter: '#A7F3D0',
      light: '#34D399',
      main: '#10B981',
      dark: '#047857',
      darker: '#064E3B',
      contrastText: '#FFFFFF',
    },
    warning: {
      lighter: '#FEF3C7',
      light: '#FBBF24',
      main: '#F59E0B',
      dark: '#D97706',
      darker: '#92400E',
      contrastText: '#080C14',
    },
    error: {
      lighter: '#FFE4E6',
      light: '#FB7185',
      main: '#F43F5E',
      dark: '#BE123C',
      darker: '#881337',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FCFDFD',
      100: '#F9FAFB',
      200: '#F4F6F8',
      300: '#DFE3E8',
      400: '#C4CDD5',
      500: '#919EAB',
      600: '#637381',
      700: '#454F5B',
      800: '#1C252E',
      900: '#141A21',
    },
    common: { black: '#000000', white: '#FFFFFF' },
  },
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: '',
    colorSchemeSelector: 'data-color-scheme',
  },
};
