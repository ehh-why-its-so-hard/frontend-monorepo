export const theme = {
  fontSize: {
    '2xs': '0.625rem',
  },
  screens: {
    xs: '500px',
    sm: '640px',
    md: '768px',
    lg: '960px',
    xl: '1280px',
    xxl: '1440px',
    xxxl: '1800px',
  },
  borderColor: {
    DEFAULT: 'var(--border)',
  },
  borderRadius: {
    'button-xs': 'var(--button-border-radius-xs)',
    'button-sm': 'var(--button-border-radius-sm)',
    'button-md': 'var(--button-border-radius-md)',
    'button-lg': 'var(--button-border-radius-lg)',
    grid: 'var(--grid-border-radius)',
    input: 'var(--input-border-radius)',
  },
  borderWidth: {
    999: 'var(--button-border-width)',
  },
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    black: 'rgb(var(--color-black) / <alpha-value>)',
    white: 'rgb(var(--color-white) / <alpha-value>)',
    gs: {
      0: 'rgb(var(--gs-0) / <alpha-value>)',
      50: 'rgb(var(--gs-50) / <alpha-value>)',
      100: 'rgb(var(--gs-100) / <alpha-value>)',
      200: 'rgb(var(--gs-200) / <alpha-value>)',
      300: 'rgb(var(--gs-300) / <alpha-value>)',
      400: 'rgb(var(--gs-400) / <alpha-value>)',
      DEFAULT: 'rgb(var(--gs-500) / <alpha-value>)',
      500: 'rgb(var(--gs-500) / <alpha-value>)',
      600: 'rgb(var(--gs-600) / <alpha-value>)',
      700: 'rgb(var(--gs-700) / <alpha-value>)',
      800: 'rgb(var(--gs-800) / <alpha-value>)',
      900: 'rgb(var(--gs-900) / <alpha-value>)',
      950: 'rgb(var(--gs-950) / <alpha-value>)',
    },
    highlight: 'rgb(var(--highlight) / <alpha-value>)',
    'highlight-secondary': 'rgb(var(--highlight-secondary) / <alpha-value>)',
    'highlight-tertiary': 'rgb(var(--highlight-tertiary) / <alpha-value>)',
    'highlight-fg': 'rgb(var(--highlight-fg) / <alpha-value>)',
    'highlight-secondary-fg':
      'rgb(var(--highlight-secondary-fg) / <alpha-value>)',
    'highlight-tertiary-fg':
      'rgb(var(--highlight-tertiary-fg) / <alpha-value>)',
    surface: {
      0: {
        DEFAULT: 'rgb(var(--surface-0) / <alpha-value>)',
        fg: 'rgb(var(--surface-0-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--surface-1-fg-muted) / <alpha-value>)',
      },
      1: {
        DEFAULT: 'rgb(var(--surface-1) / <alpha-value>)',
        fg: 'rgb(var(--surface-1-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--surface-1-fg-muted) / <alpha-value>)',
      },
      2: {
        DEFAULT: 'rgb(var(--surface-2) / <alpha-value>)',
        fg: 'rgb(var(--surface-2-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--surface-2-fg-muted) / <alpha-value>)',
      },
      3: {
        DEFAULT: 'rgb(var(--surface-3) / <alpha-value>)',
        fg: 'rgb(var(--surface-3-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--surface-3-fg-muted) / <alpha-value>)',
      },
    },
    intent: {
      none: {
        DEFAULT: 'rgb(var(--intent-none) / <alpha-value>)',
        foreground: 'rgb(var(--intent-none-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-none-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-none-outline) / <alpha-value>)',
        from: 'rgb(var(--intent-none-from) / <alpha-value>)',
        to: 'rgb(var(--intent-none-to) / <alpha-value>)',
      },
      primary: {
        DEFAULT: 'rgb(var(--intent-primary) / <alpha-value>)',
        foreground: 'rgb(var(--intent-primary-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-primary-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-primary-outline) / <alpha-value>)',
        from: 'rgb(var(--intent-primary-from) / <alpha-value>)',
        to: 'rgb(var(--intent-primary-to) / <alpha-value>)',
      },
      secondary: {
        DEFAULT: 'rgb(var(--intent-secondary) / <alpha-value>)',
        foreground: 'rgb(var(--intent-secondary-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-secondary-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-secondary-outline) / <alpha-value>)',
        from: 'rgb(var(--intent-secondary-from) / <alpha-value>)',
        to: 'rgb(var(--intent-secondary-to) / <alpha-value>)',
      },
      danger: {
        DEFAULT: 'rgb(var(--intent-danger) / <alpha-value>)',
        foreground: 'rgb(var(--intent-danger-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-danger-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-danger-outline) / <alpha-value>)',
      },
      info: {
        DEFAULT: 'rgb(var(--intent-info) / <alpha-value>)',
        foreground: 'rgb(var(--intent-info-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-info-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-info-outline) / <alpha-value>)',
      },
      warning: {
        DEFAULT: 'rgb(var(--intent-warning) / <alpha-value>)',
        foreground: 'rgb(var(--intent-warning-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-warning-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-warning-outline) / <alpha-value>)',
      },
      success: {
        DEFAULT: 'rgb(var(--intent-success) / <alpha-value>)',
        foreground: 'rgb(var(--intent-success-foreground) / <alpha-value>)',
        background: 'rgb(var(--intent-success-background) / <alpha-value>)',
        outline: 'rgb(var(--intent-success-outline) / <alpha-value>)',
      },
    },
    pink: {
      700: 'rgb(var(--color-pink-700) / <alpha-value>)',
      650: 'rgb(var(--color-pink-650) / <alpha-value>)',
      600: 'rgb(var(--color-pink-600) / <alpha-value>)',
      550: 'rgb(var(--color-pink-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-pink) / <alpha-value>)',
      500: 'rgb(var(--color-pink) / <alpha-value>)',
      450: 'rgb(var(--color-pink-450) / <alpha-value>)',
      400: 'rgb(var(--color-pink-400) / <alpha-value>)',
      350: 'rgb(var(--color-pink-350) / <alpha-value>)',
      300: 'rgb(var(--color-pink-300) / <alpha-value>)',
    },
    yellow: {
      700: 'rgb(var(--color-yellow-700) / <alpha-value>)',
      650: 'rgb(var(--color-yellow-650) / <alpha-value>)',
      600: 'rgb(var(--color-yellow-600) / <alpha-value>)',
      550: 'rgb(var(--color-yellow-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-yellow) / <alpha-value>)',
      500: 'rgb(var(--color-yellow) / <alpha-value>)',
      450: 'rgb(var(--color-yellow-450) / <alpha-value>)',
      400: 'rgb(var(--color-yellow-400) / <alpha-value>)',
      350: 'rgb(var(--color-yellow-350) / <alpha-value>)',
      300: 'rgb(var(--color-yellow-300) / <alpha-value>)',
    },
    green: {
      700: 'rgb(var(--color-green-700) / <alpha-value>)',
      650: 'rgb(var(--color-green-650) / <alpha-value>)',
      600: 'rgb(var(--color-green-600) / <alpha-value>)',
      550: 'rgb(var(--color-green-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-green) / <alpha-value>)',
      500: 'rgb(var(--color-green) / <alpha-value>)',
      450: 'rgb(var(--color-green-450) / <alpha-value>)',
      400: 'rgb(var(--color-green-400) / <alpha-value>)',
      350: 'rgb(var(--color-green-350) / <alpha-value>)',
      300: 'rgb(var(--color-green-300) / <alpha-value>)',
    },
    blue: {
      700: 'rgb(var(--color-blue-700) / <alpha-value>)',
      650: 'rgb(var(--color-blue-650) / <alpha-value>)',
      600: 'rgb(var(--color-blue-600) / <alpha-value>)',
      550: 'rgb(var(--color-blue-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-blue) / <alpha-value>)',
      500: 'rgb(var(--color-blue) / <alpha-value>)',
      450: 'rgb(var(--color-blue-450) / <alpha-value>)',
      400: 'rgb(var(--color-blue-400) / <alpha-value>)',
      350: 'rgb(var(--color-blue-350) / <alpha-value>)',
      300: 'rgb(var(--color-blue-300) / <alpha-value>)',
    },
    purple: {
      700: 'rgb(var(--color-purple-700) / <alpha-value>)',
      650: 'rgb(var(--color-purple-650) / <alpha-value>)',
      600: 'rgb(var(--color-purple-600) / <alpha-value>)',
      550: 'rgb(var(--color-purple-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-purple) / <alpha-value>)',
      500: 'rgb(var(--color-purple) / <alpha-value>)',
      450: 'rgb(var(--color-purple-450) / <alpha-value>)',
      400: 'rgb(var(--color-purple-400) / <alpha-value>)',
      350: 'rgb(var(--color-purple-350) / <alpha-value>)',
      300: 'rgb(var(--color-purple-300) / <alpha-value>)',
    },
    red: {
      700: 'rgb(var(--color-red-700) / <alpha-value>)',
      650: 'rgb(var(--color-red-650) / <alpha-value>)',
      600: 'rgb(var(--color-red-600) / <alpha-value>)',
      550: 'rgb(var(--color-red-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-red) / <alpha-value>)',
      500: 'rgb(var(--color-red) / <alpha-value>)',
      450: 'rgb(var(--color-red-450) / <alpha-value>)',
      400: 'rgb(var(--color-red-400) / <alpha-value>)',
      350: 'rgb(var(--color-red-350) / <alpha-value>)',
      300: 'rgb(var(--color-red-300) / <alpha-value>)',
    },
    orange: {
      700: 'rgb(var(--color-orange-700) / <alpha-value>)',
      650: 'rgb(var(--color-orange-650) / <alpha-value>)',
      600: 'rgb(var(--color-orange-600) / <alpha-value>)',
      550: 'rgb(var(--color-orange-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-orange) / <alpha-value>)',
      500: 'rgb(var(--color-orange) / <alpha-value>)',
      450: 'rgb(var(--color-orange-450) / <alpha-value>)',
      400: 'rgb(var(--color-orange-400) / <alpha-value>)',
      350: 'rgb(var(--color-orange-350) / <alpha-value>)',
      300: 'rgb(var(--color-orange-300) / <alpha-value>)',
    },
    cyan: {
      700: 'rgb(var(--color-cyan-700) / <alpha-value>)',
      650: 'rgb(var(--color-cyan-650) / <alpha-value>)',
      600: 'rgb(var(--color-cyan-600) / <alpha-value>)',
      550: 'rgb(var(--color-cyan-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-cyan) / <alpha-value>)',
      500: 'rgb(var(--color-cyan) / <alpha-value>)',
      450: 'rgb(var(--color-cyan-450) / <alpha-value>)',
      400: 'rgb(var(--color-cyan-400) / <alpha-value>)',
      350: 'rgb(var(--color-cyan-350) / <alpha-value>)',
      300: 'rgb(var(--color-cyan-300) / <alpha-value>)',
    },
    teal: {
      700: 'rgb(var(--color-teal-700) / <alpha-value>)',
      650: 'rgb(var(--color-teal-650) / <alpha-value>)',
      600: 'rgb(var(--color-teal-600) / <alpha-value>)',
      550: 'rgb(var(--color-teal-550) / <alpha-value>)',
      DEFAULT: 'rgb(var(--color-teal) / <alpha-value>)',
      500: 'rgb(var(--color-teal) / <alpha-value>)',
      450: 'rgb(var(--color-teal-450) / <alpha-value>)',
      400: 'rgb(var(--color-teal-400) / <alpha-value>)',
      350: 'rgb(var(--color-teal-350) / <alpha-value>)',
      300: 'rgb(var(--color-teal-300) / <alpha-value>)',
    },
    dir: {
      down: {
        DEFAULT: 'rgb(var(--dir-down) / <alpha-value>)',
        bg: 'rgb(var(--dir-down-bg) / <alpha-value>)',
        fg: 'rgb(var(--dir-down-fg) / <alpha-value>)',
        outline: 'rgb(var(--dir-down-outline) / <alpha-value>)',
      },
      up: {
        DEFAULT: 'rgb(var(--dir-up) / <alpha-value>)',
        bg: 'rgb(var(--dir-up-bg) / <alpha-value>)',
        fg: 'rgb(var(--dir-up-fg) / <alpha-value>)',
        outline: 'rgb(var(--dir-up-outline) / <alpha-value>)',
      },
    },
  },
  fontFamily: {
    mono: ['var(--font-mono)'],
    sans: ['var(--font-sans)'],
    alt: ['var(--font-alt)', { fontFeatureSettings: '"calt" 0, "liga" 0' }],
  },
  keyframes: {
    rotate: {
      '0%': {
        transform: 'rotate(0deg)',
        transformBox: 'fill-box',
        transformOrigin: 'center',
      },
      '100%': {
        transform: 'rotate(360deg)',
        transformBox: 'fill-box',
        transformOrigin: 'center',
      },
    },
    progress: {
      from: { width: '0' },
      to: { width: '100%' },
    },
  },
  animation: {
    rotate: 'rotate 2s linear alternate infinite',
    'rotate-back': 'rotate 2s linear reverse infinite',
    progress: 'progress 5s cubic-bezier(.39,.58,.57,1) 1',
  },
  data: {
    selected: 'state~="checked"',
    open: 'state~="open"',
  },
};
