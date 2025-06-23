import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Typography,
  IconButton,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/GetApp";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { generatePDF } from "./utils";

const categories = ["Contact", "Kitchen", "Bathroom", "Utility", "Outdoor"];

const initialSubcategories = [
  {
    category: "Contact",
    sections: [
      {
        title: "Homeowner",
        items: [
          { label: "Name", value: "" },
          { label: "Phone Number", value: "" },
          { label: "Email Address", value: "" },
          { label: "Street Address", value: "" },
          { label: "City", value: "" },
          { label: "Zip", value: "" },
          { label: "Lot#", value: "" },
        ],
      },
      {
        title: "Plumber",
        items: [
          { label: "Name", value: "" },
          { label: "Email", value: "" },
        ],
      },
      {
        title: "Contractor",
        items: [
          { label: "Name", value: "" },
          { label: "Email", value: "" },
        ],
      },
    ],
  },
  {
    category: "Kitchen",
    sections: [
      {
        title: "Kitchen",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Basket Strainer", value: "" },
          { label: "Disposal", value: "" },
          { label: "Air Switch", value: "" },
        ],
      },
      {
        title: "Pantry",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Basket Strainer", value: "" },
          { label: "Disp. Flange", value: "" },
          { label: "Disposal", value: "" },
          { label: "Air Switch", value: "" },
          { label: "Faucet", value: "", qty: "" },
        ],
      },
      {
        title: "Bar",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Basket Strainer", value: "" },
          { label: "Disp. Flange", value: "" },
          { label: "Disposal", value: "" },
          { label: "Air Switch", value: "" },
          { label: "Faucet", value: "", qty: "" },
        ],
      },
      {
        title: "Kitchen Basement",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Basket Strainer", value: "" },
          { label: "Disp. Flange", value: "" },
          { label: "Disposal", value: "" },
          { label: "Air Switch", value: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Pot Filler", value: "" },
          { label: "Soap", value: "" },
          { label: "Filter Faucet", value: "" },
          { label: "Filter", value: "" },
        ],
      },
    ],
  },
  {
    category: "Bathroom",
    sections: [
      {
        title: "Powder Bath",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
      {
        title: "Master Bath",
        items: [
          { label: "Tub", value: "", hand: "" },
          { label: "Tub Faucet", value: "" },
          { label: "Tub Valve", value: "" },
          { label: "Tub Drain", value: "" },
          { label: "Sink", value: "", qty: "" },
          { label: "Faucets", value: "", qty: "" },
          { label: "Valves", value: "" },
          { label: "Sink Drains", value: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
          { label: "Shower Drain", value: "" },
          { label: "Shower Trim 1", value: "" },
          { label: "Shower Valve 1", value: "" },
          { label: "Shower Valve 2", value: "" },
          { label: "Rain Head", value: "" },
          { label: "Arm", value: "" },
          { label: "Flange", value: "" },
          { label: "Handheld", value: "" },
          { label: "Drop Ell", value: "" },
          { label: "Fixed Head", value: "" },
          { label: "Arm", value: "" },
          { label: "Flange", value: "" },
          { label: "Shower Size", length: "", width: "", height: "" },
          { label: "Material", value: "" },
          { label: "Steam Generator", value: "" },
          { label: "Controller", value: "" },
          { label: "Steam Accessories", value: "" },
        ],
      },
      {
        title: "Guest Bath 1",
        items: [
          { label: "Tub", value: "", hand: "" },
          { label: "Tub Drain", value: "" },
          { label: "Tub/Shower Trim", value: "" },
          { label: "Valve", value: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Sink", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
      {
        title: "Guest Bath 2",
        items: [
          { label: "Tub", value: "", hand: "" },
          { label: "Tub Drain", value: "" },
          { label: "Tub/Shower Trim", value: "" },
          { label: "Valve", value: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Sink", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
      {
        title: "Basement Bath 1",
        items: [
          { label: "Tub", value: "", hand: "" },
          { label: "Tub Drain", value: "" },
          { label: "Tub/Shower Trim", value: "" },
          { label: "Valve", value: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Sink", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
      {
        title: "Basement Bath 2",
        items: [
          { label: "Tub", value: "", hand: "" },
          { label: "Tub Drain", value: "" },
          { label: "Tub/Shower Trim", value: "" },
          { label: "Valve", value: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Sink", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
      {
        title: "Basement Powder",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Toilet", value: "", qty: "" },
          { label: "Seat", value: "", qty: "" },
        ],
      },
    ],
  },
  {
    category: "Utility",
    sections: [
      {
        title: "Utility Room",
        items: [
          { label: "Water Heater", value: "" },
          { label: "Water Softener", value: "" },
        ],
      },
      {
        title: "Dog Wash",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
        ],
      },
      {
        title: "Laundry",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
        ],
      },
      {
        title: "Garage Sink",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
        ],
      },
    ],
  },
  {
    category: "Outdoor",
    sections: [
      {
        title: "Outdoor Shower",
        items: [
          { label: "Shower Trim", value: "" },
          { label: "Shower Valve", value: "" },
          { label: "Shower Drain", value: "" },
        ],
      },
      {
        title: "Outdoor Kitchen",
        items: [
          { label: "Sink", value: "", qty: "" },
          { label: "Faucet", value: "", qty: "" },
          { label: "Drain", value: "" },
        ],
      },
    ],
  },
];

function BidSheetForm() {
  const [homeownerName, setHomeownerName] = useState("");
  const [tab, setTab] = useState(0);
  const [subcategories, setSubcategories] = useState(initialSubcategories);
  const [soNumber, setSoNumber] = useState("");
  const [expandedAccordions, setExpandedAccordions] = useState({});
  const [editingSections, setEditingSections] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [activeSection, setActiveSection] = useState(null);
  const [saveFeedbackOpen, setSaveFeedbackOpen] = useState(false);
  const [saveFeedbackMessage, setSaveFeedbackMessage] = useState("");
  const [saveFeedbackType, setSaveFeedbackType] = useState("success");
  const [isGlobalEditEnabled, setIsGlobalEditEnabled] = useState(false);

  const addItemInputRef = useRef(null);

  // Helper function to capitalize the first letter of each word
  const capitalize = (str) => {
    if (!str) return str;
    return str
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          primary: { main: "#006685" },
          secondary: { main: "#93c01f" },
          background: {
            default: "#f5f5f5",
            paper: "#ffffff",
          },
        },
      }),
    []
  );

  // Extract homeownerName from subcategories
  useEffect(() => {
    const name = subcategories
      .find((cat) => cat.category === "Contact")
      ?.sections.find((section) => section.title === "Homeowner")
      ?.items.find((item) => item.label === "Name")?.value || "";
    setHomeownerName(name);
  }, [subcategories]);

  const handleSave = async () => {
    try {
      if (!homeownerName) {
        throw new Error("Homeowner Name is required");
      }
      if (!Array.isArray(subcategories)) {
        throw new Error("Invalid subcategories data");
      }
      subcategories.forEach((cat, idx) => {
        if (!cat.category || !Array.isArray(cat.sections)) {
          throw new Error(`Invalid category at index ${idx}`);
        }
        cat.sections.forEach((section, sIdx) => {
          if (!section.title || !Array.isArray(section.items)) {
            throw new Error(`Invalid section at index ${sIdx} in ${cat.category}`);
          }
          section.items.forEach((item, iIdx) => {
            if (!item.label) {
              throw new Error(`Invalid item at index ${iIdx} in ${section.title}`);
            }
          });
        });
      });

      const dataToSave = {
        soNumber: soNumber || "",
        homeownerName,
        subcategories,
        timestamp: serverTimestamp(),
      };

      console.log("Saving to Firestore:", dataToSave);
      await addDoc(collection(db, "bids"), dataToSave);

      setModalOpen(false);
      setSaveFeedbackMessage("Bid saved successfully!");
      setSaveFeedbackType("success");
      setSaveFeedbackOpen(true);

      // Reset form
      setSoNumber("");
      setSubcategories(initialSubcategories);
      setExpandedAccordions({});
      setEditingSections({});
    } catch (error) {
      console.error("Error saving to Firestore:", error, { homeownerName, soNumber, subcategories });
      setSaveFeedbackMessage(`Failed to save bid: ${error.message || "Unknown error"}`);
      setSaveFeedbackType("error");
      setSaveFeedbackOpen(true);
    }
  };

  const handleSaveAndDownload = async () => {
    try {
      if (!homeownerName) {
        throw new Error("Homeowner Name is required");
      }
      if (!Array.isArray(subcategories)) {
        throw new Error("Invalid subcategories data");
      }
      subcategories.forEach((cat, idx) => {
        if (!cat.category || !Array.isArray(cat.sections)) {
          throw new Error(`Invalid category at index ${idx}`);
        }
        cat.sections.forEach((section, sIdx) => {
          if (!section.title || !Array.isArray(section.items)) {
            throw new Error(`Invalid section at index ${sIdx} in ${cat.category}`);
          }
          section.items.forEach((item, iIdx) => {
            if (!item.label) {
              throw new Error(`Invalid item at index ${iIdx} in ${section.title}`);
            }
          });
        });
      });

      const dataToSave = {
        soNumber: soNumber || "",
        homeownerName,
        subcategories,
        timestamp: serverTimestamp(),
      };

      console.log("Saving to Firestore:", dataToSave);
      await addDoc(collection(db, "bids"), dataToSave);

      const subcategoriesObject = subcategories.reduce((acc, cat) => {
        acc[cat.category] = cat.sections;
        return acc;
      }, {});
      const { doc, filename } = generatePDF(
        subcategoriesObject,
        soNumber,
        homeownerName
      );
      doc.save(filename);

      setModalOpen(false);
      setSaveFeedbackMessage("Bid saved and downloaded successfully!");
      setSaveFeedbackType("success");
      setSaveFeedbackOpen(true);

      // Reset form
      setSoNumber("");
      setSubcategories(initialSubcategories);
      setExpandedAccordions({});
      setEditingSections({});
    } catch (error) {
      console.error("Error saving and downloading:", error, { homeownerName, soNumber, subcategories });
      setSaveFeedbackMessage(`Failed to save and download bid: ${error.message || "Unknown error"}`);
      setSaveFeedbackType("error");
      setSaveFeedbackOpen(true);
    }
  };

  const handleCloseSaveFeedback = () => {
    setSaveFeedbackOpen(false);
    setSaveFeedbackMessage("");
    setSaveFeedbackType("success");
  };

  const getSectionKey = (category, sectionTitle) =>
    `${category}_${sectionTitle}`;

  const toggleAccordion = (category, sectionTitle) => {
    const key = getSectionKey(category, sectionTitle);
    setExpandedAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSectionEdit = (category, sectionTitle) => {
    const key = getSectionKey(category, sectionTitle);
    setEditingSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    const updated = [...subcategories];
    const currentCategory = categories[tab];
    const categoryIndex = updated.findIndex(
      (cat) => cat.category === currentCategory
    );
    updated[categoryIndex].sections.push({
      title: capitalize(newSectionTitle),
      items: [],
    });
    setSubcategories(updated);
    setNewSectionTitle("");
    setAddSectionOpen(false);
  };

  const handleAddItem = () => {
    if (!newItemLabel.trim() || activeSection === null) return;
    const updated = [...subcategories];
    const currentCategory = categories[tab];
    const categoryIndex = updated.findIndex(
      (cat) => cat.category === currentCategory
    );
    const formattedLabel = capitalize(newItemLabel);
    const newItem =
      formattedLabel === "Shower Size"
        ? { label: formattedLabel, length: "", width: "", height: "" }
        : formattedLabel === "Tub"
        ? { label: formattedLabel, value: "", hand: "" }
        : ["Faucet", "Sink", "Toilet", "Seat"].includes(formattedLabel)
        ? { label: formattedLabel, value: "", qty: "" }
        : { label: formattedLabel, value: "" };
    updated[categoryIndex].sections[activeSection].items.push(newItem);
    setSubcategories(updated);
    setNewItemLabel("");
    setAddItemModalOpen(false);
  };

  const handleDeleteItem = (category, sectionIndex, itemIndex) => {
    const updated = [...subcategories];
    const categoryIndex = updated.findIndex((cat) => cat.category === category);
    updated[categoryIndex].sections[sectionIndex].items.splice(itemIndex, 1);
    setSubcategories(updated);
  };

  const handleDeleteSection = (category, sectionIndex) => {
    const updated = [...subcategories];
    const categoryIndex = updated.findIndex((cat) => cat.category === category);
    const sectionTitle = updated[categoryIndex].sections[sectionIndex].title;
    const sectionKey = getSectionKey(category, sectionTitle);
    setExpandedAccordions((prev) => {
      const copy = { ...prev };
      delete copy[sectionKey];
      return copy;
    });
    setEditingSections((prev) => {
      const copy = { ...prev };
      delete copy[sectionKey];
      return copy;
    });
    updated[categoryIndex].sections.splice(sectionIndex, 1);
    setSubcategories(updated);
  };

  useEffect(() => {
    if (addItemModalOpen && addItemInputRef.current) {
      addItemInputRef.current.focus();
    }
  }, [addItemModalOpen]);

  const currentCategory = categories[tab];
  const currentCategoryData = subcategories.find(
    (cat) => cat.category === currentCategory
  )?.sections || [];

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
            maxWidth: 800,
            backgroundColor: "white",
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
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
            }}
            title={isGlobalEditEnabled ? "Disable Editing" : "Enable Editing"}
          >
            {isGlobalEditEnabled ? <SaveIcon /> : <EditIcon />}
          </IconButton>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <Tab label={cat} key={cat} />
            ))}
          </Tabs>

          {currentCategory === "Contact" && (
            <Box sx={{ mb: 3 }}>
              <TextField
                label="SO#"
                variant="outlined"
                value={soNumber}
                onChange={(e) => setSoNumber(e.target.value)}
                fullWidth
              />
            </Box>
          )}

          <Box>
            {currentCategoryData.map((section, sIdx) => {
              const sectionKey = getSectionKey(currentCategory, section.title);
              const isEditing = !!editingSections[sectionKey];
              const isExpanded = !!expandedAccordions[sectionKey];

              return (
                <Accordion
                  key={sectionKey}
                  expanded={isExpanded}
                  onChange={() => toggleAccordion(currentCategory, section.title)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ flexGrow: 1 }}>
                      {isEditing ? (
                        <TextField
                          variant="standard"
                          value={section.title}
                          onChange={(e) => {
                            const updated = [...subcategories];
                            const categoryIndex = updated.findIndex(
                              (cat) => cat.category === currentCategory
                            );
                            updated[categoryIndex].sections[sIdx].title = e.target.value;
                            setSubcategories(updated);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onFocus={(e) => e.stopPropagation()}
                          sx={{ minWidth: 150 }}
                        />
                      ) : (
                        section.title
                      )}
                    </Typography>
                    {isEditing ? (
                      <>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionEdit(currentCategory, section.title);
                          }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Delete section "${section.title}"? This cannot be undone.`
                              )
                            ) {
                              handleDeleteSection(currentCategory, sIdx);
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </>
                    ) : (
                      isGlobalEditEnabled && (
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSectionEdit(currentCategory, section.title);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )
                    )}
                  </AccordionSummary>
                  <AccordionDetails>
                    {currentCategory === "Contact" &&
                    section.title === "Homeowner" ? (
                      <>
                        {section.items.map((item, iIdx) => {
                          if (["City", "Zip", "Lot#"].includes(item.label)) {
                            if (item.label === "City") {
                              const cityItem = section.items.find(
                                (i) => i.label === "City"
                              );
                              const zipItem = section.items.find(
                                (i) => i.label === "Zip"
                              );
                              const lotItem = section.items.find(
                                (i) => i.label === "Lot#"
                              );
                              return (
                                <Box
                                  key="city-zip-lot"
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: { xs: "flex-start", sm: "center" },
                                    mb: 2,
                                    flexWrap: "wrap",
                                    gap: { xs: 1.5, sm: 1 },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: { xs: "column", sm: "row" },
                                      alignItems: { xs: "stretch", sm: "center" },
                                      flexBasis: { xs: "100%", sm: "33%" },
                                      gap: { xs: 0.5, sm: 1 },
                                    }}
                                  >
                                    {isEditing ? (
                                      <TextField
                                        variant="standard"
                                        size="small"
                                        value={cityItem?.label || ""}
                                        onChange={(e) => {
                                          const updated = [...subcategories];
                                          const categoryIndex = updated.findIndex(
                                            (cat) => cat.category === currentCategory
                                          );
                                          const newLabel = e.target.value;
                                          const itemIdx = updated[categoryIndex].sections[
                                            sIdx
                                          ].items.findIndex((i) => i.label === "City");
                                          updated[categoryIndex].sections[sIdx].items[
                                            itemIdx
                                          ].label = newLabel;
                                          if (newLabel !== "Tub") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].hand;
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand = "";
                                          }
                                          if (newLabel !== "Shower Size") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].length;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].width;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].height;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].width = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].height = "";
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].value;
                                          }
                                          if (
                                            ![
                                              "Faucet",
                                              "Sink",
                                              "Toilet",
                                              "Seat",
                                            ].includes(newLabel)
                                          ) {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].qty;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty = "";
                                          }
                                          setSubcategories(updated);
                                        }}
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      >
                                        City
                                      </Typography>
                                    )}
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      value={cityItem?.value || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[
                                          sIdx
                                        ].items.find(
                                          (i) => i.label === cityItem?.label
                                        ).value = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{
                                        flexGrow: 1,
                                        flexBasis: { xs: "auto", sm: 0 },
                                        maxWidth: { xs: "100%", sm: 150 },
                                      }}
                                    />
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: { xs: "column", sm: "row" },
                                      alignItems: { xs: "stretch", sm: "center" },
                                      flexBasis: { xs: "100%", sm: "33%" },
                                      gap: { xs: 0.5, sm: 1 },
                                    }}
                                  >
                                    {isEditing ? (
                                      <TextField
                                        variant="standard"
                                        size="small"
                                        value={zipItem?.label || ""}
                                        onChange={(e) => {
                                          const updated = [...subcategories];
                                          const categoryIndex = updated.findIndex(
                                            (cat) => cat.category === currentCategory
                                          );
                                          const newLabel = e.target.value;
                                          const itemIdx = updated[categoryIndex].sections[
                                            sIdx
                                          ].items.findIndex((i) => i.label === "Zip");
                                          updated[categoryIndex].sections[sIdx].items[
                                            itemIdx
                                          ].label = newLabel;
                                          if (newLabel !== "Tub") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].hand;
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand = "";
                                          }
                                          if (newLabel !== "Shower Size") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].length;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].width;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].height;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].width = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].height = "";
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].value;
                                          }
                                          if (
                                            ![
                                              "Faucet",
                                              "Sink",
                                              "Toilet",
                                              "Seat",
                                            ].includes(newLabel)
                                          ) {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].qty;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty = "";
                                          }
                                          setSubcategories(updated);
                                        }}
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      >
                                        Zip
                                      </Typography>
                                    )}
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      value={zipItem?.value || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[
                                          sIdx
                                        ].items.find(
                                          (i) => i.label === zipItem?.label
                                        ).value = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{
                                        flexGrow: 1,
                                        flexBasis: { xs: "auto", sm: 0 },
                                        maxWidth: { xs: "100%", sm: 100 },
                                      }}
                                    />
                                  </Box>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: { xs: "column", sm: "row" },
                                      alignItems: { xs: "stretch", sm: "center" },
                                      flexBasis: { xs: "100%", sm: "33%" },
                                      gap: { xs: 0.5, sm: 1 },
                                    }}
                                  >
                                    {isEditing ? (
                                      <TextField
                                        variant="standard"
                                        size="small"
                                        value={lotItem?.label || ""}
                                        onChange={(e) => {
                                          const updated = [...subcategories];
                                          const categoryIndex = updated.findIndex(
                                            (cat) => cat.category === currentCategory
                                          );
                                          const newLabel = e.target.value;
                                          const itemIdx = updated[categoryIndex].sections[
                                            sIdx
                                          ].items.findIndex((i) => i.label === "Lot#");
                                          updated[categoryIndex].sections[sIdx].items[
                                            itemIdx
                                          ].label = newLabel;
                                          if (newLabel !== "Tub") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].hand;
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].hand = "";
                                          }
                                          if (newLabel !== "Shower Size") {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].length;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].width;
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].height;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].length = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].width = "";
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].height = "";
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].value;
                                          }
                                          if (
                                            ![
                                              "Faucet",
                                              "Sink",
                                              "Toilet",
                                              "Seat",
                                            ].includes(newLabel)
                                          ) {
                                            delete updated[categoryIndex].sections[sIdx]
                                              .items[itemIdx].qty;
                                            if (
                                              !updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value
                                            ) {
                                              updated[categoryIndex].sections[sIdx].items[
                                                itemIdx
                                              ].value = "";
                                            }
                                          } else if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              itemIdx
                                            ].qty = "";
                                          }
                                          setSubcategories(updated);
                                        }}
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        sx={{
                                          flexBasis: { xs: "auto", sm: "25%" },
                                          minWidth: { xs: "auto", sm: 60 },
                                          mb: { xs: 0.5, sm: 0 },
                                        }}
                                      >
                                        Lot#
                                      </Typography>
                                    )}
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      value={lotItem?.value || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[
                                          sIdx
                                        ].items.find(
                                          (i) => i.label === lotItem?.label
                                        ).value = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{
                                        flexGrow: 1,
                                        flexBasis: { xs: "auto", sm: 0 },
                                        maxWidth: { xs: "100%", sm: 100 },
                                      }}
                                    />
                                  </Box>
                                  {isEditing && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: { xs: "flex-start", sm: "center" },
                                        flexBasis: { xs: "100%", sm: "auto" },
                                        mt: { xs: 1, sm: 0 },
                                        gap: 1,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleDeleteItem(
                                            currentCategory,
                                            sIdx,
                                            section.items.findIndex(
                                              (i) => i.label === item.label
                                            )
                                          )
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  )}
                                </Box>
                              );
                            }
                            return null;
                          }
                          return (
                            <Box
                              key={iIdx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              {isEditing ? (
                                <TextField
                                  variant="standard"
                                  size="small"
                                  value={item.label}
                                  onChange={(e) => {
                                    const updated = [...subcategories];
                                    const categoryIndex = updated.findIndex(
                                      (cat) => cat.category === currentCategory
                                    );
                                    const newLabel = e.target.value;
                                    updated[categoryIndex].sections[sIdx].items[
                                      iIdx
                                    ].label = newLabel;
                                    if (newLabel !== "Tub") {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].hand;
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand = "";
                                    }
                                    if (newLabel !== "Shower Size") {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].length;
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].width;
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].height;
                                      if (
                                        !updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value
                                      ) {
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value = "";
                                      }
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].length
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].length = "";
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].width = "";
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].height = "";
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].value;
                                    }
                                    if (
                                      ![
                                        "Faucet",
                                        "Sink",
                                        "Toilet",
                                        "Seat",
                                      ].includes(newLabel)
                                    ) {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].qty;
                                      if (
                                        !updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value
                                      ) {
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value = "";
                                      }
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty = "";
                                    }
                                    setSubcategories(updated);
                                  }}
                                  sx={{ width: 120 }}
                                />
                              ) : (
                                <Typography sx={{ width: 120 }}>{item.label}</Typography>
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  flexGrow: 1,
                                }}
                              >
                                <TextField
                                  variant="standard"
                                  size="small"
                                  value={item.value || ""}
                                  onChange={(e) => {
                                    const updated = [...subcategories];
                                    const categoryIndex = updated.findIndex(
                                      (cat) => cat.category === currentCategory
                                    );
                                    updated[categoryIndex].sections[sIdx].items[
                                      iIdx
                                    ].value = e.target.value;
                                    setSubcategories(updated);
                                    if (item.label === "Name" && section.title === "Homeowner") {
                                      setHomeownerName(e.target.value);
                                    }
                                  }}
                                  sx={{ flexGrow: 1, minWidth: 150 }}
                                />
                                {item.label === "Tub" && (
                                  <Select
                                    value={item.hand || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    <MenuItem value="">Select Hand</MenuItem>
                                    <MenuItem value="Right Hand">Right Hand</MenuItem>
                                    <MenuItem value="Left Hand">Left Hand</MenuItem>
                                  </Select>
                                )}
                                {["Faucet", "Sink", "Toilet", "Seat"].includes(
                                  item.label
                                ) && (
                                  <Select
                                    value={item.qty || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 80 }}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <MenuItem key={num} value={num}>
                                        {num}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                              </Box>
                              {isEditing && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDeleteItem(currentCategory, sIdx, iIdx)
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                      </>
                    ) : (
                      <>
                        {section.items.map((item, iIdx) => {
                          if (
                            item.label === "Toilet" &&
                            section.items[iIdx + 1]?.label === "Seat"
                          ) {
                            const toiletItem = item;
                            const seatItem = section.items[iIdx + 1];
                            return (
                              <Box
                                key={`toilet-seat-${iIdx}`}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mb: 2,
                                  gap: 2,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                  }}
                                >
                                  {isEditing ? (
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      value={toiletItem.label}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        const newLabel = e.target.value;
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].label = newLabel;
                                        if (newLabel !== "Tub") {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].hand;
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].hand
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].hand = "";
                                        }
                                        if (newLabel !== "Shower Size") {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].length;
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].width;
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].height;
                                          if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              iIdx
                                            ].value
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              iIdx
                                            ].value = "";
                                          }
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].length
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].length = "";
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].width = "";
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].height = "";
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].value;
                                        }
                                        if (
                                          ![
                                            "Faucet",
                                            "Sink",
                                            "Toilet",
                                            "Seat",
                                          ].includes(newLabel)
                                        ) {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx].qty;
                                          if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              iIdx
                                            ].value
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              iIdx
                                            ].value = "";
                                          }
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].qty
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx
                                          ].qty = "";
                                        }
                                        setSubcategories(updated);
                                      }}
                                      sx={{ width: 80 }}
                                    />
                                  ) : (
                                    <Typography sx={{ width: 80 }}>Toilet</Typography>
                                  )}
                                  <Select
                                    value={toiletItem.qty || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 80 }}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <MenuItem key={num} value={num}>
                                        {num}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <TextField
                                    variant="standard"
                                    size="small"
                                    value={toiletItem.value || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].value = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    sx={{ flexGrow: 1, minWidth: 150 }}
                                  />
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flex: 1,
                                  }}
                                >
                                  {isEditing ? (
                                    <TextField
                                      variant="standard"
                                      size="small"
                                      value={seatItem.label}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        const newLabel = e.target.value;
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx + 1
                                        ].label = newLabel;
                                        if (newLabel !== "Tub") {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].hand;
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].hand
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].hand = "";
                                        }
                                        if (newLabel !== "Shower Size") {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].length;
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].width;
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].height;
                                          if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              iIdx + 1
                                            ].value
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              iIdx + 1
                                            ].value = "";
                                          }
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].length
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].length = "";
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].width = "";
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].height = "";
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].value;
                                        }
                                        if (
                                          ![
                                            "Faucet",
                                            "Sink",
                                            "Toilet",
                                            "Seat",
                                          ].includes(newLabel)
                                        ) {
                                          delete updated[categoryIndex].sections[sIdx]
                                            .items[iIdx + 1].qty;
                                          if (
                                            !updated[categoryIndex].sections[sIdx].items[
                                              iIdx + 1
                                            ].value
                                          ) {
                                            updated[categoryIndex].sections[sIdx].items[
                                              iIdx + 1
                                            ].value = "";
                                          }
                                        } else if (
                                          !updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].qty
                                        ) {
                                          updated[categoryIndex].sections[sIdx].items[
                                            iIdx + 1
                                          ].qty = "";
                                        }
                                        setSubcategories(updated);
                                      }}
                                      sx={{ width: 80 }}
                                    />
                                  ) : (
                                    <Typography sx={{ width: 80 }}>Seat</Typography>
                                  )}
                                  <Select
                                    value={seatItem.qty || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx + 1
                                      ].qty = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 80 }}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <MenuItem key={num} value={num}>
                                        {num}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <TextField
                                    variant="standard"
                                    size="small"
                                    value={seatItem.value || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx + 1
                                      ].value = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    sx={{ flexGrow: 1, minWidth: 150 }}
                                  />
                                </Box>
                                {isEditing && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 1,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleDeleteItem(currentCategory, sIdx, iIdx)
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                      }}
                                    >
                                      <IconButton
                                        size="small"
                                        onClick={() =>
                                          handleDeleteItem(currentCategory, sIdx, iIdx + 1)
                                        }
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            );
                          }
                          if (item.label === "Seat") {
                            return null;
                          }
                          return (
                            <Box
                              key={iIdx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                gap: 1,
                                flexWrap: "wrap",
                              }}
                            >
                              {isEditing ? (
                                <TextField
                                  variant="standard"
                                  size="small"
                                  value={item.label}
                                  onChange={(e) => {
                                    const updated = [...subcategories];
                                    const categoryIndex = updated.findIndex(
                                      (cat) => cat.category === currentCategory
                                    );
                                    const newLabel = e.target.value;
                                    updated[categoryIndex].sections[sIdx].items[
                                      iIdx
                                    ].label = newLabel;
                                    if (newLabel !== "Tub") {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].hand;
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand = "";
                                    }
                                    if (newLabel !== "Shower Size") {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].length;
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].width;
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].height;
                                      if (
                                        !updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value
                                      ) {
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value = "";
                                      }
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].length
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].length = "";
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].width = "";
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].height = "";
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].value;
                                    }
                                    if (
                                      ![
                                        "Faucet",
                                        "Sink",
                                        "Toilet",
                                        "Seat",
                                      ].includes(newLabel)
                                    ) {
                                      delete updated[categoryIndex].sections[sIdx]
                                        .items[iIdx].qty;
                                      if (
                                        !updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value
                                      ) {
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].value = "";
                                      }
                                    } else if (
                                      !updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty
                                    ) {
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty = "";
                                    }
                                    setSubcategories(updated);
                                  }}
                                  sx={{ width: 100 }}
                                />
                              ) : (
                                <Typography sx={{ width: 100 }}>{item.label}</Typography>
                              )}
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  flexGrow: 1,
                                }}
                              >
                                {["Faucet", "Sink", "Toilet", "Seat"].includes(
                                  item.label
                                ) && (
                                  <Select
                                    value={item.qty || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].qty = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 80 }}
                                  >
                                    <MenuItem value="">Select</MenuItem>
                                    {[1, 2, 3, 4, 5].map((num) => (
                                      <MenuItem key={num} value={num}>
                                        {num}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                )}
                                {item.label === "Shower Size" ? (
                                  <>
                                    <TextField
                                      label="Length"
                                      size="small"
                                      value={item.length || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].length = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{ width: 80 }}
                                    />
                                    <TextField
                                      label="Width"
                                      size="small"
                                      value={item.width || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].width = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{ width: 80 }}
                                    />
                                    <TextField
                                      label="Height"
                                      size="small"
                                      value={item.height || ""}
                                      onChange={(e) => {
                                        const updated = [...subcategories];
                                        const categoryIndex = updated.findIndex(
                                          (cat) => cat.category === currentCategory
                                        );
                                        updated[categoryIndex].sections[sIdx].items[
                                          iIdx
                                        ].height = e.target.value;
                                        setSubcategories(updated);
                                      }}
                                      sx={{ width: 80 }}
                                    />
                                  </>
                                ) : (
                                  <TextField
                                    variant="standard"
                                    size="small"
                                    value={item.value || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].value = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    sx={{ flexGrow: 1, minWidth: 150 }}
                                  />
                                )}
                                {item.label === "Tub" && (
                                  <Select
                                    value={item.hand || ""}
                                    onChange={(e) => {
                                      const updated = [...subcategories];
                                      const categoryIndex = updated.findIndex(
                                        (cat) => cat.category === currentCategory
                                      );
                                      updated[categoryIndex].sections[sIdx].items[
                                        iIdx
                                      ].hand = e.target.value;
                                      setSubcategories(updated);
                                    }}
                                    size="small"
                                    sx={{ minWidth: 120 }}
                                  >
                                    <MenuItem value="">Select Hand</MenuItem>
                                    <MenuItem value="Right Hand">Right Hand</MenuItem>
                                    <MenuItem value="Left Hand">Left Hand</MenuItem>
                                  </Select>
                                )}
                              </Box>
                              {isEditing && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDeleteItem(currentCategory, sIdx, iIdx)
                                    }
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              )}
                            </Box>
                          );
                        })}
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => {
                            setAddItemModalOpen(true);
                            setActiveSection(sIdx);
                          }}
                        >
                          Add Item
                        </Button>
                      </>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>

          <Button
            startIcon={<AddIcon />}
            onClick={() => setAddSectionOpen(true)}
            sx={{ mt: 2 }}
          >
            Add Section
          </Button>

          <Fab
            color="primary"
            onClick={() => setModalOpen(true)}
            sx={{ position: "fixed", bottom: 16, right: 16 }}
            disabled={!homeownerName}
          >
            <SaveIcon />
          </Fab>

          <Dialog
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Save Bid Sheet</DialogTitle>
            <DialogContent>
              <Typography>
                Choose an option to save the bid sheet:
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="contained"
                onClick={handleSaveAndDownload}
                startIcon={<DownloadIcon />}
              >
                Save and Download
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addSectionOpen}
            onClose={() => setAddSectionOpen(false)}
          >
            <DialogTitle>Add New Section</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Section Title"
                fullWidth
                variant="outlined"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSection();
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddSectionOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleAddSection}
                disabled={!newSectionTitle.trim()}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={addItemModalOpen}
            onClose={() => setAddItemModalOpen(false)}
          >
            <DialogTitle>Add New Item</DialogTitle>
            <DialogContent>
              <TextField
                inputRef={addItemInputRef}
                margin="dense"
                label="Item Label"
                fullWidth
                variant="outlined"
                value={newItemLabel}
                onChange={(e) => setNewItemLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddItem();
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddItemModalOpen(false)}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleAddItem}
                disabled={!newItemLabel.trim()}
              >
                Add
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={saveFeedbackOpen}
            onClose={handleCloseSaveFeedback}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              {saveFeedbackType === "success" ? "Success" : "Error"}
            </DialogTitle>
            <DialogContent>
              <Alert severity={saveFeedbackType} sx={{ mb: 2 }}>
                {saveFeedbackMessage}
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSaveFeedback}>OK</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default BidSheetForm;