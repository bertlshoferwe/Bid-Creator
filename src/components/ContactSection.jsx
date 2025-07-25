import React from "react";
import { Box, TextField, IconButton, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ItemInput from "../ItemInput.jsx";
import { getSectionKey } from "../utils";

const ContactSection = ({
  soNumber,
  setSoNumber,
  sections,
  isEditing,
  setSubcategories,
  handleDeleteItem,
  expandedAccordions,
  setExpandedAccordions,
  editingSections,
  toggleAccordion,
  toggleSectionEdit,
  handleDeleteSection,
  handleAddItemModal,
}) => {
  console.log("ContactSection props:", { soNumber, sections, isEditing, expandedAccordions, editingSections }); // Debug

  if (!sections || !Array.isArray(sections)) {
    console.error("ContactSection: Invalid sections prop", sections);
    return <Typography color="error">Error: No sections available</Typography>;
  }

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="SO#"
          variant="outlined"
          value={soNumber || ""}
          onChange={(e) => setSoNumber(e.target.value)}
          fullWidth
          inputProps={{ "aria-label": "Sales Order Number" }}
          sx={{ maxWidth: 400 }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sections.length === 0 ? (
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            No sections available for Contact.
          </Typography>
        ) : (
          sections.map((section, sIdx) => {
            const sectionKey = getSectionKey("Contact", section.title);
            const isSectionEditing = !!editingSections[sectionKey];
            const isExpanded = !!expandedAccordions[sectionKey];
            console.log(`Rendering section: ${section.title}, isExpanded: ${isExpanded}, key: ${sectionKey}`); // Debug

            return (
              <Accordion
                key={sectionKey}
                expanded={isExpanded}
                onChange={() => {
                  console.log(`Toggling accordion: Contact, ${section.title}, key: ${sectionKey}`); // Debug
                  toggleAccordion("Contact", section.title);
                }}
                sx={{ width: "100%", boxShadow: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ flexGrow: 1, fontWeight: "medium" }}>
                    {isSectionEditing ? (
                      <TextField
                        variant="standard"
                        value={section.title}
                        onChange={(e) => {
                          const updated = [...subcategories];
                          const categoryIndex = updated.findIndex((cat) => cat.category === "Contact");
                          updated[categoryIndex].sections[sIdx].title = e.target.value;
                          setSubcategories(updated);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        sx={{ minWidth: 150 }}
                        inputProps={{ "aria-label": `Edit section title ${section.title}` }}
                      />
                    ) : (
                      section.title
                    )}
                  </Typography>
                  {isSectionEditing ? (
                    <>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionEdit("Contact", section.title);
                        }}
                        aria-label={`Save section ${section.title}`}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Confirm deletion of section "${section.title}"? This action is permanent.`)) {
                            handleDeleteSection("Contact", sIdx);
                          }
                        }}
                        aria-label={`Delete section ${section.title}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    isEditing && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionEdit("Contact", section.title);
                        }}
                        aria-label={`Edit section ${section.title}`}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                      width: "100%",
                      padding: 1,
                    }}
                  >
                    {section.items.length === 0 ? (
                      <Typography sx={{ color: "text.secondary" }}>
                        No items in section.
                      </Typography>
                    ) : (
                      section.items.map((item, iIdx) => {
                        console.log(`Rendering item: ${item.label}, index: ${iIdx}`, item); // Debug
                        return (
                          <ItemInput
                            key={`${sectionKey}-${item.label}-${iIdx}`}
                            item={item}
                            category="Contact"
                            sectionIndex={sIdx}
                            itemIndex={iIdx}
                            isEditing={isEditing}
                            updateSubcategories={setSubcategories}
                            handleDeleteItem={handleDeleteItem}
                            currentCategory="Contact"
                          />
                        );
                      })
                    )}
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddItemModal(sIdx)}
                      sx={{ mt: 1, alignSelf: "flex-start" }}
                      aria-label={`Add item to ${section.title}`}
                    >
                      Add Item
                    </Button>
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default ContactSection;