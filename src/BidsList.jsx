import React from "react";
import { Box, Typography, TextField } from "@mui/material";
import BidsTable from "./components/BidsTable.jsx";
import EditBidDialog from "./components/EditBidDialog.jsx";
import FeedbackDialog from "./components/FeedbackDialog.jsx";
import useBids from "./hooks/useBids";

function BidsList() {
  const {
    bids,
    searchQuery,
    setSearchQuery,
    editModalOpen,
    setEditModalOpen,
    selectedBid,
    setSelectedBid,
    editSoNumber,
    setEditSoNumber,
    editHomeownerName,
    setEditHomeownerName,
    editSubcategories,
    setEditSubcategories,
    feedbackOpen,
    feedbackMessage,
    feedbackType,
    setFeedbackOpen,
    handleDeleteBid,
    handleOpenEditModal,
    handleSaveEdit,
    handleDownloadPDF,
  } = useBids();

  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh", py: 4 }}>
      <Box
        sx={{
          maxWidth: 1000,
          backgroundColor: "white",
          mx: "auto",
          px: 2,
          pt: 4,
          pb: 8,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Bids List
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Bids"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            placeholder="Search by SO#, Homeowner, or Plumber"
            inputProps={{ "aria-label": "Search bids by SO#, Homeowner, or Plumber" }}
          />
        </Box>
        <BidsTable
          bids={bids}
          searchQuery={searchQuery}
          handleDeleteBid={handleDeleteBid}
          handleOpenEditModal={handleOpenEditModal}
          handleDownloadPDF={handleDownloadPDF}
        />
        <EditBidDialog
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          selectedBid={selectedBid}
          editSoNumber={editSoNumber}
          setEditSoNumber={setEditSoNumber}
          editHomeownerName={editHomeownerName}
          setEditHomeownerName={setEditHomeownerName}
          editSubcategories={editSubcategories}
          setEditSubcategories={setEditSubcategories}
          handleSaveEdit={handleSaveEdit}
        />
        <FeedbackDialog
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          message={feedbackMessage}
          type={feedbackType}
        />
      </Box>
    </Box>
  );
}

export default BidsList;