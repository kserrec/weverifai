export const theme = {
  colors: {
    primary: '#f36100',
    secondary: '#007bff',
    background: {
      light: '#ffffff',
      dark: '#181818',
    },
    header: {
      light: '#ffffff',
      dark: '#222',
    },
    text: {
      light: '#333',
      dark: '#eee',
    },
    muted: {
      light: '#555',
      dark: '#bbb',
    },
    border: {
      light: '#eee',
      dark: '#333',
    },
    hover: {
      light: 'rgba(0, 123, 255, 0.1)',
      dark: 'rgba(243, 97, 0, 0.1)',
    },
    disabled: {
      light: '#999',
      dark: '#666',
    }
  },
  shadows: {
    light: '0 1px 3px rgba(0, 0, 0, 0.1)',
    dark: '0 1px 3px rgba(255, 255, 255, 0.05)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.1)',
    mediumDark: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  transitions: {
    default: '0.3s ease',
    fast: '0.2s ease',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1150px',
  },
  spacing: {
    header: '45px',
    contentPadding: {
      desktop: '1rem',
      mobile: '0.75rem',
    }
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      small: '0.85rem',
      base: '1rem',
      large: '1.2rem',
      xlarge: '1.5rem',
      xxlarge: '1.8rem',
    }
  }
};

export type Theme = typeof theme; 