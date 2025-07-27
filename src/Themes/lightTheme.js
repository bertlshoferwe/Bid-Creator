import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2c3e50", // dark blue-gray
      contrastText: "#fff",
    },
    secondary: {
      main: "#e67e22", // bright orange
      contrastText: "#fff",
    },
    background: {
      default: "#edf6f9", // very light gray
      card: "#edf2f4",
      paper: "white", // white for dialogs, cards
    },
    text: {
      primary: "#1a202c", // near black, very readable
      secondary: "#4a5568", // muted gray
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },
  },
});

export default lightTheme;