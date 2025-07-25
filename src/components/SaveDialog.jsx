import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const SaveDialog = ({ open, onClose, handleSave, handleSaveAndDownload }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Save Bid Sheet</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Would you like to save the bid sheet to the database, or save and download it as a PDF?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} aria-label="Cancel save">Cancel</Button>
      <Button variant="contained" onClick={handleSave} aria-label="Save bid sheet">
        Save
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSaveAndDownload}
        aria-label="Save and download bid sheet"
      >
        Save & Download
      </Button>
    </DialogActions>
  </Dialog>
);

export default SaveDialog;