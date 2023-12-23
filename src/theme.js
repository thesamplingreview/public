import { createTheme } from '@mui/material/styles';

// @ref: https://mui.com/material-ui/customization/theming/
const theme = createTheme({
  palette: {
    primary: {
      main: '#FB8F34',
      contrastText: '#fff',
    },
    secondary: {
      main: '#60e4e4',
      contrastText: '#fff',
    },
    success: {
      main: '#2ea782',
    },
    error: {
      main: '#f4516c',
    },
    warning: {
      main: '#ffb822',
    },
    info: {
      main: '#36a3f7',
    },
    background: {
      light: '#ffffff',
      main: '#edefff',
      dark: '#dddddd',
    },
    text: {
      light: '#828ea2',
      main: '#3f4047',
      dark: '#0f0f11',
      primary: '#3f4047', // for base font color
    },
    border: {
      main: '#dee2e6',
    },
  },
  typography: {
    fontFamily: 'var(--font)',
    fontSize: 16,
    fontWeight: 300,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 300,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 300,
    },
    label: {
      fontSize: '1rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          padding: '.65em 1.5em',
          fontSize: '1em',
          textTransform: 'none',
          boxShadow: 'none',
        },
        sizeSmall: {
          fontSize: '.875em',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textAlign: 'left',
        },
      },
    },
  },
});

export default theme;
