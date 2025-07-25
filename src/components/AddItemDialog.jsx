import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const AddItemDialog = ({ open, onClose, value, onChange, onSave }) => {
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-item-dialog-title">
      <DialogTitle id="add-item-dialog-title">Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Item Label"
          fullWidth
          variant="outlined"
          value={value || ""}
          onChange={onChange}
          inputProps={{ "aria-label": "New item label" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel add item">
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!value?.trim()} aria-label="Save item">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddItemDialog;