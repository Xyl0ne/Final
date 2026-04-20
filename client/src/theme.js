import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: { main: '#161515' },
        secondary: { main: '#d2d6e3' },
        background: {
            default: '#121111',
            paper: '#1E1E1E',
        },
        text: {
            primary: '#d2d6e3',
            secondary: '#d2d6e3',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        span: { fontWeight: 700 },
        button: { textTransform: 'none' },
    
    },
    shape: {
        borderRadius: 8,
    },
   
});

export default theme;