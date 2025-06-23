import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CssBaseline,
  createTheme,
  ThemeProvider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Divider,
} from "@mui/material";
import { db } from "./firebase";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { generatePDF } from "./utils";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#006685" },
    secondary: { main: "#93c01f" },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
});

function BidsList() {
  const [bids, setBids] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [editSoNumber, setEditSoNumber] = useState("");
  const [editHomeownerName, setEditHomeownerName] = useState("");
  const [editSubcategories, setEditSubcategories] = useState([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackType, setFeedbackType] = useState("success");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bids"));
        const bidsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBids(bidsData);
      } catch (error) {
        console.error("Error fetching bids:", error);
        setFeedbackMessage(`Failed to load bids: ${error.message}`);
        setFeedbackType("error");
        setFeedbackOpen(true);
      }
    };
    fetchBids();
  }, []);

  const handleOpenEditModal = (bid) => {
    setSelectedBid(bid);
    setEditSoNumber(bid.soNumber || "");
    setEditHomeownerName(bid.homeownerName || "");
    setEditSubcategories(JSON.parse(JSON.stringify(bid.subcategories || []))); // Deep copy
    setEditModalOpen(true);
  };

  const handleSubcategoryChange = (categoryIdx, sectionIdx, itemIdx, field, value) => {
    setEditSubcategories((prev) => {
      const updated = [...prev];
      const item = updated[categoryIdx].sections[sectionIdx].items[itemIdx];
      item[field] = value;
      return updated;
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editHomeownerName.trim()) {
        throw new Error("Homeowner Name is required");
      }

      const updatedBid = {
        ...selectedBid,
        soNumber: editSoNumber.trim(),
        homeownerName: editHomeownerName.trim(),
        subcategories: editSubcategories,
        timestamp: selectedBid.timestamp, // Preserve original timestamp
      };

      // Save to Firestore
      await setDoc(doc(db, "bids", selectedBid.id), updatedBid);
      setBids(bids.map((b) => (b.id === selectedBid.id ? updatedBid : b)));
      setEditModalOpen(false);
      setFeedbackMessage("Bid updated successfully!");
      setFeedbackType("success");
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Error saving bid:", error);
      setFeedbackMessage(`Failed to update bid: ${error.message}`);
      setFeedbackType("error");
      setFeedbackOpen(true);
    }
  };

  const handleDownloadPDF = (bid) => {
    const subcategoriesObject = bid.subcategories.reduce((acc, cat) => {
      acc[cat.category] = cat.sections;
      return acc;
    }, {});
    const { doc, filename } = generatePDF(
      subcategoriesObject,
      bid.soNumber,
      bid.homeownerName
    );
    doc.save(filename);
  };

  // Filter bids based on search query
  const filteredBids = bids.filter((bid) => {
    const soNumber = bid.soNumber?.toLowerCase() || "";
    const homeownerName = bid.homeownerName?.toLowerCase() || "";
    const plumberName =
      bid.subcategories
        ?.find((cat) => cat.category === "Contact")
        ?.sections.find((section) => section.title === "Plumber")
        ?.items.find((item) => item.label === "Name")?.value?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    return (
      soNumber.includes(query) ||
      homeownerName.includes(query) ||
      plumberName.includes(query)
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          py: 4,
        }}
      >
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
            />
          </Box>
          <TableContainer component={Paper}>
            <Table>
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
                        >
                          Download PDF
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => handleOpenEditModal(bid)}
                        >
                          Edit/View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Edit Modal */}
          <Dialog
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            maxWidth="md"
            fullWidth
            scroll="paper"
          >
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
                />
                <TextField
                  label="Homeowner Name"
                  variant="outlined"
                  value={editHomeownerName}
                  onChange={(e) => setEditHomeownerName(e.target.value)}
                  fullWidth
                  margin="dense"
                  required
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
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Label</TableCell>
                              <TableCell>Value</TableCell>
                              {section.items.some((item) => "qty" in item) && (
                                <TableCell>Quantity</TableCell>
                              )}
                              {section.items.some((item) => "hand" in item) && (
                                <TableCell>Hand</TableCell>
                              )}
                              {section.items.some(
                                (item) => "length" in item
                              ) && (
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
                                    onChange={(e) =>
                                      handleSubcategoryChange(
                                        catIdx,
                                        secIdx,
                                        itemIdx,
                                        "value",
                                        e.target.value
                                      )
                                    }
                                    fullWidth
                                  />
                                </TableCell>
                                {"qty" in item && (
                                  <TableCell>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      type="number"
                                      value={item.qty || ""}
                                      onChange={(e) =>
                                        handleSubcategoryChange(
                                          catIdx,
                                          secIdx,
                                          itemIdx,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                      fullWidth
                                    />
                                  </TableCell>
                                )}
                                {"hand" in item && (
                                  <TableCell>
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      value={item.hand || ""}
                                      onChange={(e) =>
                                        handleSubcategoryChange(
                                          catIdx,
                                          secIdx,
                                          itemIdx,
                                          "hand",
                                          e.target.value
                                        )
                                      }
                                      fullWidth
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
                                        onChange={(e) =>
                                          handleSubcategoryChange(
                                            catIdx,
                                            secIdx,
                                            itemIdx,
                                            "length",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={item.width || ""}
                                        onChange={(e) =>
                                          handleSubcategoryChange(
                                            catIdx,
                                            secIdx,
                                            itemIdx,
                                            "width",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        value={item.height || ""}
                                        onChange={(e) =>
                                          handleSubcategoryChange(
                                            catIdx,
                                            secIdx,
                                            itemIdx,
                                            "height",
                                            e.target.value
                                          )
                                        }
                                        fullWidth
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
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveEdit}
                disabled={!editHomeownerName.trim()}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Feedback Dialog */}
          <Dialog
            open={feedbackOpen}
            onClose={() => setFeedbackOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>{feedbackType === "success" ? "Success" : "Error"}</DialogTitle>
            <DialogContent>
              <Alert severity={feedbackType}>{feedbackMessage}</Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFeedbackOpen(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default BidsList;