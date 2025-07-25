import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const AddSectionDialog = ({ open, onClose, value, onChange, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-section-dialog-title">
      <DialogTitle id="add-section-dialog-title">Add New Section</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Section Title"
          fullWidth
          variant="outlined"
          value={value || ""}
          onChange={onChange}
          inputProps={{ "aria-label": "New section title" }}
          error={value && !value.trim()}
          helperText={value && !value.trim() ? "Section title cannot be empty" : ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel add section">
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!value || !value.trim()} aria-label="Save section">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSectionDialog;