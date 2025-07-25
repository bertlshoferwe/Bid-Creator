import React from "react";
import { Box, TextField, Select, MenuItem, IconButton, Typography, FormControl, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemInput = ({
  item,
  category,
  sectionIndex,
  itemIndex,
  isEditing,
  updateSubcategories,
  handleDeleteItem,
  currentCategory,
}) => {
  console.log(`ItemInput rendering: ${item.label}, item:`, item); // Debug

  const handleChange = (field, value) => {
    updateSubcategories((prev) => {
      const updated = [...prev];
      const categoryIndex = updated.findIndex((cat) => cat.category === currentCategory);
      updated[categoryIndex].sections[sectionIndex].items[itemIndex][field] = value;
      return updated;
    });
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
      {isEditing ? (
        <TextField
          variant="standard"
          value={item.label}
          onChange={(e) => handleChange("label", e.target.value)}
          sx={{ minWidth: 120, fontWeight: "medium" }}
          inputProps={{ "aria-label": `Edit item label ${item.label}` }}
        />
      ) : (
        <Typography sx={{ minWidth: 120, fontWeight: "medium" }}>{item.label}</Typography>
      )}
      {item.length !== undefined ? (
        <>
          <TextField
            variant="outlined"
            size="small"
            value={item.length || ""}
            onChange={(e) => handleChange("length", e.target.value)}
            sx={{ width: 100 }}
            inputProps={{ "aria-label": `${item.label} Length` }}
          />
          <TextField
            variant="outlined"
            size="small"
            value={item.width || ""}
            onChange={(e) => handleChange("width", e.target.value)}
            sx={{ width: 100 }}
            inputProps={{ "aria-label": `${item.label} Width` }}
          />
          <TextField
            variant="outlined"
            size="small"
            value={item.height || ""}
            onChange={(e) => handleChange("height", e.target.value)}
            sx={{ width: 100 }}
            inputProps={{ "aria-label": `${item.label} Height` }}
          />
        </>
      ) : item.hand !== undefined ? (
        <>
          <TextField
            variant="outlined"
            size="small"
            value={item.value || ""}
            onChange={(e) => handleChange("value", e.target.value)}
            sx={{ flexGrow: 1 }}
            inputProps={{ "aria-label": `${item.label} Value` }}
          />
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel id={`hand-label-${item.label}`}>Hand</InputLabel>
            <Select
              labelId={`hand-label-${item.label}`}
              label="Hand"
              value={item.hand || ""}
              onChange={(e) => handleChange("hand", e.target.value)}
              aria-label={`${item.label} Hand`}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="Left">Left</MenuItem>
              <MenuItem value="Right">Right</MenuItem>
            </Select>
          </FormControl>
        </>
      ) : item.qty !== undefined ? (
        <>
          <TextField
            variant="outlined"
            size="small"
            value={item.value || ""}
            onChange={(e) => handleChange("value", e.target.value)}
            sx={{ flexGrow: 1 }}
            inputProps={{ "aria-label": `${item.label} Value` }}
          />
          <FormControl size="small" sx={{ width: 100 }}>
            <InputLabel id={`qty-label-${item.label}`}>Quantity</InputLabel>
            <Select
              labelId={`qty-label-${item.label}`}
              label="Quantity"
              value={item.qty || ""}
              onChange={(e) => handleChange("qty", e.target.value)}
              aria-label={`${item.label} Quantity`}
            >
              <MenuItem value="">None</MenuItem>
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num.toString()}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      ) : (
        <TextField
          variant="outlined"
          size="small"
          value={item.value || ""}
          onChange={(e) => handleChange("value", e.target.value)}
          sx={{ flexGrow: 1 }}
          inputProps={{ "aria-label": `${item.label} Value` }}
        />
      )}
      {isEditing && (
        <IconButton
          onClick={() => handleDeleteItem(category, sectionIndex, itemIndex)}
          aria-label={`Delete ${item.label}`}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default ItemInput;