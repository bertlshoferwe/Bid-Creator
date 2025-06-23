import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import BidSheetForm from "./BidSheetForm";
import BidsList from "./BidsList";
import mountainlandLogo from "./assets/mountainland-logo.png";
import FormatListNumberedRtlIcon from '@mui/icons-material/FormatListNumberedRtl';
import EditNoteIcon from '@mui/icons-material/EditNote';


function App() {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#004785" },
          secondary: { main: "#93c01f" },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        },
      }),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
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
          </Toolbar>
        </AppBar>

        <Routes>
          <Route path="/" element={<BidSheetForm />} />
          <Route path="/create-bid" element={<BidSheetForm />} />
          <Route path="/bids" element={<BidsList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;