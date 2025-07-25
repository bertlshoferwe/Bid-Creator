import React, { useState, useEffect } from "react";
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generatePDF } from "../utils";

function useBids() {
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
    console.log("useBids initialized"); // Debug
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

  const handleDeleteBid = async (bidId) => {
    if (!window.confirm("Are you sure you want to delete this bid? This cannot be undone.")) return;
    try {
      await deleteDoc(doc(db, "bids", bidId));
      setBids(bids.filter((bid) => bid.id !== bidId));
      setFeedbackMessage("Bid deleted successfully!");
      setFeedbackType("success");
      setFeedbackOpen(true);
    } catch (error) {
      console.error("Error deleting bid:", error);
      setFeedbackMessage(`Failed to delete bid: ${error.message}`);
      setFeedbackType("error");
      setFeedbackOpen(true);
    }
  };

  const handleOpenEditModal = (bid) => {
    setSelectedBid(bid);
    setEditSoNumber(bid.soNumber || "");
    setEditHomeownerName(bid.homeownerName || "");
    setEditSubcategories(JSON.parse(JSON.stringify(bid.subcategories || [])));
    setEditModalOpen(true);
  };

  const handleSubcategoryChange = (categoryIdx, sectionIdx, itemIdx, field, value) => {
    setEditSubcategories((prev) => {
      const updated = [...prev];
      updated[categoryIdx].sections[sectionIdx].items[itemIdx][field] = value;
      return updated;
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!editHomeownerName.trim()) throw new Error("Homeowner Name is required");
      const updatedBid = {
        ...selectedBid,
        soNumber: editSoNumber.trim(),
        homeownerName: editHomeownerName.trim(),
        subcategories: editSubcategories,
        timestamp: selectedBid.timestamp,
      };
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
    const { doc, filename } = generatePDF(subcategoriesObject, bid.soNumber, bid.homeownerName);
    doc.save(filename);
  };

  return {
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
    handleSubcategoryChange,
    handleSaveEdit,
    handleDownloadPDF,
  };
}

export default useBids;