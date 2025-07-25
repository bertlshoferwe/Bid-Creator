import React from "react";
import { TextField } from "@mui/material";

const FieldRenderer = ({ item, schema, handleChange }) => {
  return schema.fields.map((field) => (
    <TextField
      key={field}
      variant="standard"
      size="small"
      label={field.charAt(0).toUpperCase() + field.slice(1)}
      value={item[field] || ""}
      onChange={(e) => handleChange(field, e.target.value)}
      type={["qty", "length", "width", "height"].includes(field) ? "number" : "text"}
      sx={{ flexGrow: 1, maxWidth: field === "value" ? 150 : 100 }}
      inputProps={{ "aria-label": `${field} for ${item.label}` }}
    />
  ));
};

export default FieldRenderer;