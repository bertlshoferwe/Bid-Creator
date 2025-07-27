import React from "react";
import { Box, Typography, IconButton, Fab, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import useBidSheetForm from "./hooks/useBidSheetForm";
import CategoryTabs from "./components/CategoryTabs.jsx";
import SectionAccordion from "./components/SectionAccordion.jsx";
import ContactSection from "./components/ContactSection.jsx";
import AddSectionDialog from "./components/AddSectionDialog.jsx";
import AddItemDialog from "./components/AddItemDialog.jsx";
import SaveDialog from "./components/SaveDialog.jsx";
import FeedbackDialog from "./components/FeedbackDialog.jsx";

function BidSheetForm() {
  const {
    tab,
    setTab,
    subcategories,
    setSubcategories,
    soNumber,
    setSoNumber,
    homeownerName,
    expandedAccordions,
    setExpandedAccordions,
    editingSections,
    toggleAccordion,
    toggleSectionEdit,
    handleDeleteSection,
    isGlobalEditEnabled,
    setIsGlobalEditEnabled,
    addSectionOpen,
    setAddSectionOpen,
    newSectionTitle,
    setNewSectionTitle,
    handleAddSection,
    addItemModalOpen,
    setAddItemModalOpen,
    newItemLabel,
    setNewItemLabel,
    activeSection,
    setActiveSection,
    handleAddItem,
    handleDeleteItem,
    modalOpen,
    setModalOpen,
    saveFeedbackOpen,
    saveFeedbackMessage,
    saveFeedbackType,
    setSaveFeedbackOpen,
    handleSave,
    handleSaveAndDownload,
  } = useBidSheetForm();

  const currentCategory = ["Contact", "Kitchen", "Bathroom", "Utility", "Outdoor"][tab];
  const currentCategoryData = subcategories.find((cat) => cat.category === currentCategory)?.sections || [];

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 4 }}>
      <Box
        sx={{
          maxWidth: 800,
          backgroundColor: "background.card",
          mx: "auto",
          px: 2,
          pt: 4,
          pb: 8,
          borderRadius: 2,
          boxShadow: 3,
          position: "relative",
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Bid Sheet
        </Typography>
        <IconButton
          color={isGlobalEditEnabled ? "secondary" : "primary"}
          onClick={() => setIsGlobalEditEnabled(!isGlobalEditEnabled)}
          sx={{ position: "absolute", top: 16, right: 16 }}
          aria-label={isGlobalEditEnabled ? "Disable Editing" : "Enable Editing"}
        >
          {isGlobalEditEnabled ? <SaveIcon /> : <EditIcon />}
        </IconButton>
        <CategoryTabs tab={tab} setTab={setTab} />
        {currentCategory === "Contact" ? (
          currentCategoryData.length === 0 ? (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              No sections available for Contact.
            </Typography>
          ) : (
            <ContactSection
              soNumber={soNumber}
              setSoNumber={setSoNumber}
              sections={currentCategoryData}
              isEditing={isGlobalEditEnabled}
              setSubcategories={setSubcategories}
              handleDeleteItem={handleDeleteItem}
              expandedAccordions={expandedAccordions}
              setExpandedAccordions={setExpandedAccordions}
              editingSections={editingSections}
              toggleAccordion={toggleAccordion}
              toggleSectionEdit={toggleSectionEdit}
              handleDeleteSection={handleDeleteSection}
              handleAddItemModal={(index) => {
                setAddItemModalOpen(true);
                setActiveSection(index);
              }}
            />
          )
        ) : currentCategoryData.length === 0 ? (
          <Typography sx={{ mt: 2, color: "text.secondary" }}>
            No sections available for {currentCategory}. Click "Add Section" to create one.
          </Typography>
        ) : (
          <SectionAccordion
            category={currentCategory}
            sections={currentCategoryData}
            expandedAccordions={expandedAccordions}
            editingSections={editingSections}
            toggleAccordion={toggleAccordion}
            toggleSectionEdit={toggleSectionEdit}
            handleDeleteSection={handleDeleteSection}
            isGlobalEditEnabled={isGlobalEditEnabled}
            setSubcategories={setSubcategories}
            handleAddItemModal={(index) => {
              setAddItemModalOpen(true);
              setActiveSection(index);
            }}
            handleDeleteItem={handleDeleteItem}
          />
        )}
        <Button
          startIcon={<AddIcon />}
          onClick={() => setAddSectionOpen(true)}
          sx={{ mt: 2 }}
          aria-label="Add new section"
        >
          Add Section
        </Button>
        <Fab
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
          disabled={!homeownerName}
          aria-label="Save bid sheet"
        >
          <SaveIcon />
        </Fab>
        <AddSectionDialog
          open={addSectionOpen}
          onClose={() => setAddSectionOpen(false)}
          value={newSectionTitle || ""}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          onSave={handleAddSection}
        />
        <AddItemDialog
          open={addItemModalOpen}
          onClose={() => setAddItemModalOpen(false)}
          value={newItemLabel || ""}
          onChange={(e) => setNewItemLabel(e.target.value)}
          onSave={handleAddItem}
        />
        <SaveDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          handleSave={handleSave}
          handleSaveAndDownload={handleSaveAndDownload}
        />
        <FeedbackDialog
          open={saveFeedbackOpen}
          onClose={() => setSaveFeedbackOpen(false)}
          message={saveFeedbackMessage}
          type={saveFeedbackType}
        />
      </Box>
    </Box>
  );
}

export default BidSheetForm;