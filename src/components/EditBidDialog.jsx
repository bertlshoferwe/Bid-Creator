import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Button } from "@mui/material";

const EditBidDialog = ({
  open,
  onClose,
  selectedBid,
  editSoNumber,
  setEditSoNumber,
  editHomeownerName,
  setEditHomeownerName,
  editSubcategories,
  setEditSubcategories,
  handleSaveEdit,
}) => {
  const handleSubcategoryChange = (categoryIdx, sectionIdx, itemIdx, field, value) => {
    setEditSubcategories((prev) => {
      const updated = [...prev];
      updated[categoryIdx].sections[sectionIdx].items[itemIdx][field] = value;
      return updated;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
      <DialogTitle>Edit Bid</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="SO#"
            variant="outlined"
            value={editSoNumber}
            onChange={(e) => setEditSoNumber(e.target.value)}
            fullWidth
            margin="dense"
            inputProps={{ "aria-label": "Sales Order Number" }}
          />
          <TextField
            label="Homeowner Name"
            variant="outlined"
            value={editHomeownerName}
            onChange={(e) => setEditHomeownerName(e.target.value)}
            fullWidth
            margin="dense"
            required
            inputProps={{ "aria-label": "Homeowner Name" }}
          />
        </Box>
        {editSubcategories.map((category, catIdx) => (
          <Box key={category.category} sx={{ mb: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              {category.category}
            </Typography>
            {category.sections.map((section, secIdx) => (
              <Box key={section.title} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {section.title}
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small" aria-label={`${section.title} items table`}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Label</TableCell>
                        <TableCell>Value</TableCell>
                        {section.items.some((item) => "qty" in item) && <TableCell>Quantity</TableCell>}
                        {section.items.some((item) => "hand" in item) && <TableCell>Hand</TableCell>}
                        {section.items.some((item) => "length" in item) && (
                          <>
                            <TableCell>Length</TableCell>
                            <TableCell>Width</TableCell>
                            <TableCell>Height</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {section.items.map((item, itemIdx) => (
                        <TableRow key={item.label}>
                          <TableCell>{item.label}</TableCell>
                          <TableCell>
                            <TextField
                              variant="outlined"
                              size="small"
                              value={item.value || ""}
                              onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "value", e.target.value)}
                              fullWidth
                              inputProps={{ "aria-label": `Value for ${item.label}` }}
                            />
                          </TableCell>
                          {"qty" in item && (
                            <TableCell>
                              <TextField
                                variant="outlined"
                                size="small"
                                type="number"
                                value={item.qty || ""}
                                onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "qty", e.target.value)}
                                fullWidth
                                inputProps={{ "aria-label": `Quantity for ${item.label}` }}
                              />
                            </TableCell>
                          )}
                          {"hand" in item && (
                            <TableCell>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={item.hand || ""}
                                onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "hand", e.target.value)}
                                fullWidth
                                inputProps={{ "aria-label": `Hand orientation for ${item.label}` }}
                              />
                            </TableCell>
                          )}
                          {"length" in item && (
                            <>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  value={item.length || ""}
                                  onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "length", e.target.value)}
                                  fullWidth
                                  inputProps={{ "aria-label": `Length for ${item.label}` }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  value={item.width || ""}
                                  onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "width", e.target.value)}
                                  fullWidth
                                  inputProps={{ "aria-label": `Width for ${item.label}` }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  type="number"
                                  value={item.height || ""}
                                  onChange={(e) => handleSubcategoryChange(catIdx, secIdx, itemIdx, "height", e.target.value)}
                                  fullWidth
                                  inputProps={{ "aria-label": `Height for ${item.label}` }}
                                />
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} aria-label="Cancel edit">Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveEdit}
          disabled={!editHomeownerName.trim()}
          aria-label="Save edited bid"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBidDialog;