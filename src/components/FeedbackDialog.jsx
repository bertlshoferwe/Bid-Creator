import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from "@mui/material";

const FeedbackDialog = ({ open, onClose, message, type }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{type === "success" ? "Success" : "Error"}</DialogTitle>
    <DialogContent>
      <Alert severity={type}>{message}</Alert>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} aria-label="Close feedback">OK</Button>
    </DialogActions>
  </Dialog>
);

export default FeedbackDialog;