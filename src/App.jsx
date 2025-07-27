import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, CssBaseline, IconButton, ThemeProvider } from "@mui/material";
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BidSheetForm from "./BidSheetForm";
import BidsList from "./BidsList";
import lightTheme from "./Themes/lightTheme";
import darkTheme from "./Themes/darkTheme";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";

const NavigationBar = ({mode,toggleMode}) => (
  <AppBar position="static" color="primary">
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Bid Sheet
      </Typography>
      <Button
        startIcon={<EditNoteIcon />}
        variant="outlined"
        color="inherit"
        component={Link}
        to="/create-bid"
      >
        Create Bid
      </Button>
      <Button
        startIcon={<FormatListNumberedRtlIcon />}
        variant="outlined"
        color="inherit"
        component={Link}
        to="/bids"
      >
        Bids List
      </Button>
      <IconButton onClick={toggleMode} color="inherit" aria-label="toggle theme">
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Toolbar>
  </AppBar>
);

const RouteConfig = () => (
  <Routes>
    <Route path="/" element={<BidSheetForm />} />
    <Route path="/create-bid" element={<BidSheetForm />} />
    <Route path="/bids" element={<BidsList />} />
  </Routes>
);

const App = () => {

  const getInitialMode = () => {
    const saved = localStorage.getItem("mode");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [mode, setMode] = useState(getInitialMode);

      useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

   const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Router>
        <NavigationBar mode={mode} toggleMode={toggleMode} />
        <RouteConfig />
      </Router>
    </ThemeProvider>
  );
};
export default App