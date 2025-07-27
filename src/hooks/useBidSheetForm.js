import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { generatePDF, capitalize, getSectionKey } from "../utils";

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

function useBidSheetForm() {
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

  useEffect(() => {
    if (!db) {
      console.error("Firebase db is not initialized");
      setSaveFeedbackMessage("Firebase configuration error");
      setSaveFeedbackType("error");
      setSaveFeedbackOpen(true);
      return;
    }
    const name = subcategories
      .find((cat) => cat.category === "Contact")
      ?.sections.find((section) => section.title === "Homeowner")
      ?.items.find((item) => item.label === "Name")?.value || "";
    setHomeownerName(name);
  }, [subcategories]);

  useEffect(() => {
    if (addItemModalOpen && addItemInputRef.current) {
      addItemInputRef.current.focus();
    }
  }, [addItemModalOpen]);

  const handleSave = async () => {
    try {
      if (!homeownerName) throw new Error("Homeowner Name is required");
      if (!Array.isArray(subcategories)) throw new Error("Invalid subcategories data");
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

      await addDoc(collection(db, "bids"), dataToSave);
      setModalOpen(false);
      setSaveFeedbackMessage("Bid saved successfully!");
      setSaveFeedbackType("success");
      setSaveFeedbackOpen(true);
      setSoNumber("");
      setSubcategories(initialSubcategories);
      setExpandedAccordions({});
      setEditingSections({});
    } catch (error) {
      console.error("Error saving to Firestore:", error);
      setSaveFeedbackMessage(`Failed to save bid: ${error.message || "Unknown error"}`);
      setSaveFeedbackType("error");
      setSaveFeedbackOpen(true);
    }
  };

  const handleSaveAndDownload = async () => {
    try {
      if (!homeownerName) throw new Error("Homeowner Name is required");
      if (!Array.isArray(subcategories)) throw new Error("Invalid subcategories data");
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

      await addDoc(collection(db, "bids"), dataToSave);
      const subcategoriesObject = subcategories.reduce((acc, cat) => {
        acc[cat.category] = cat.sections;
        return acc;
      }, {});
      const { doc, filename } = generatePDF(subcategoriesObject, soNumber, homeownerName);
      doc.save(filename);

      setModalOpen(false);
      setSaveFeedbackMessage("Bid saved and downloaded successfully!");
      setSaveFeedbackType("success");
      setSaveFeedbackOpen(true);
      setSoNumber("");
      setSubcategories(initialSubcategories);
      setExpandedAccordions({});
      setEditingSections({});
    } catch (error) {
      console.error("Error saving and downloading:", error);
      setSaveFeedbackMessage(`Failed to save and download bid: ${error.message || "Unknown error"}`);
      setSaveFeedbackType("error");
      setSaveFeedbackOpen(true);
    }
  };

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
    const currentCategory = ["Contact", "Kitchen", "Bathroom", "Utility", "Outdoor"][tab];
    const categoryIndex = updated.findIndex((cat) => cat.category === currentCategory);
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
    const currentCategory = ["Contact", "Kitchen", "Bathroom", "Utility", "Outdoor"][tab];
    const categoryIndex = updated.findIndex((cat) => cat.category === currentCategory);
    const formattedLabel = capitalize(newItemLabel);
    const newItem = 
      formattedLabel === "Shower Size"
        ? { label: formattedLabel, length: "", width: "", height: "" }
        : formattedLabel === "Tub"
        ? { label: formattedLabel, value: "", hand: "" }
        : ["Sink", "Faucet", "Toilet", "Seat"].includes(formattedLabel)
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

  return {
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
  };
}

export default useBidSheetForm;