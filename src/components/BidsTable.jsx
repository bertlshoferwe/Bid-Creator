import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

const BidsTable = ({ bids, searchQuery, handleDeleteBid, handleOpenEditModal, handleDownloadPDF }) => {
  const filteredBids = bids.filter((bid) => {
    const soNumber = bid.soNumber?.toLowerCase() || "";
    const homeownerName = bid.homeownerName?.toLowerCase() || "";
    const plumberName =
      bid.subcategories
        ?.find((cat) => cat.category === "Contact")
        ?.sections.find((section) => section.title === "Plumber")
        ?.items.find((item) => item.label === "Name")?.value?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return soNumber.includes(query) || homeownerName.includes(query) || plumberName.includes(query);
  });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="Bids table">
        <TableHead>
          <TableRow>
            <TableCell>SO#</TableCell>
            <TableCell>Homeowner Name</TableCell>
            <TableCell>Plumber</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredBids.map((bid) => {
            const plumberName =
              bid.subcategories
                ?.find((cat) => cat.category === "Contact")
                ?.sections.find((section) => section.title === "Plumber")
                ?.items.find((item) => item.label === "Name")?.value || "-";
            return (
              <TableRow key={bid.id}>
                <TableCell>{bid.soNumber || "-"}</TableCell>
                <TableCell>{bid.homeownerName || "-"}</TableCell>
                <TableCell>{plumberName}</TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownloadPDF(bid)}
                    sx={{ mr: 1 }}
                    aria-label={`Download PDF for bid ${bid.soNumber || bid.id}`}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleOpenEditModal(bid)}
                    sx={{ mr: 1 }}
                    aria-label={`Edit bid ${bid.soNumber || bid.id}`}
                  >
                    Edit/View
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteBid(bid.id)}
                    aria-label={`Delete bid ${bid.soNumber || bid.id}`}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BidsTable;