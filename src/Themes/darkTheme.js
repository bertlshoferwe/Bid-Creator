import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#007acc", // light blue
      contrastText: "#000",
    },
    secondary: {
      main: "#f48fb1", // pinkish
      contrastText: "#000",
    },
    background: {
      default: "#121212", // dark background
      card:"#2d2d30",
      paper: "#1e1e1e", // slightly lighter for dialogs, cards
    },
    text: {
      primary: "#e0e0e0", // light gray
      secondary: "#b0b0b0", // medium gray
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
          boxShadow: "0 1px 3px rgba(255,255,255,0.1)",
          borderRadius: 4,
          backgroundColor: "#1e1e1e",
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
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            color: "#e0e0e0",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#90caf9",
          },
        },
      },
    },
  },
});

export default darkTheme;