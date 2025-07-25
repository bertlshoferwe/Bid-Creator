import jsPDF from "jspdf";

// Capitalize first letter of each word
export function capitalize(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

// Generate section key for accordion and editing state
export function getSectionKey(category, sectionTitle) {
  return `${category}-${sectionTitle}`;
}

// Sanitize filename to remove invalid characters
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9_\-\.]/g, "_") // Replace invalid chars with underscore
    .replace(/_+/g, "_") // Collapse multiple underscores
    .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
}

// Generate PDF from subcategories data
export function generatePDF(subcategories, soNumber, homeownerName) {
  console.log("generatePDF Input:", { subcategories, soNumber, homeownerName }); // Debug log

  // Validate input
  if (!subcategories || typeof subcategories !== "object") {
    console.error("Invalid subcategories: must be an object");
    throw new Error("Invalid subcategories data");
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4", // 595.28pt x 841.89pt
  });

  // Page dimensions
  const margin = 72; // 1-inch margins
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const contentWidth = pageWidth - 2 * margin; // ~451.28pt
  const itemColWidth = (contentWidth - 10) / 2; // Two columns for items, 10pt gap
  const col1X = margin; // Left column x=72pt
  const itemCol2X = margin + itemColWidth + 10; // Right item column x=~307.64pt
  const maxY = pageHeight - margin; // Bottom margin ~769.89pt
  let y = margin; // Current y position

  // Font settings
  doc.setFont("Helvetica", "normal");
  const titleFontSize = 18; // Increased for header
  const headerFontSize = 12;
  const categoryFontSize = 14;
  const sectionFontSize = 12;
  const itemFontSize = 10;
  const pageNumberFontSize = 8;

  // Color settings (RGB)
  const headerStartColor = [0, 48, 135]; // #003087
  const headerEndColor = [0, 85, 102]; // #005566
  const headerTextColor = [255, 255, 255]; // #FFFFFF
  const shadowColor = [200, 200, 200]; // #C8C8C8 for shadow
  const categoryTextColor = [0, 85, 102]; // #005566
  const sectionTextColor = [51, 51, 51]; // #333333
  const itemTextColor = [0, 0, 0]; // #000000
  const lineColor = [224, 224, 224]; // #E0E0E0
  const borderColor = [224, 224, 224]; // #E0E0E0
  const pageNumberColor = [51, 51, 51]; // #333333

  // Helper to check for new page
  const checkY = (requiredHeight) => {
    if (y + requiredHeight > maxY) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // Helper to add text
  const addText = (text, x, fontSize, isBold = false, width = contentWidth, textColor = itemTextColor, isItalic = false) => {
    doc.setFont("Helvetica", isBold ? "bold" : isItalic ? "italic" : "normal");
    doc.setFontSize(fontSize);
    doc.setTextColor(...textColor);
    const splitText = doc.splitTextToSize(text, width);
    checkY(splitText.length * (fontSize * 0.5));
    doc.text(splitText, x, y);
    y += splitText.length * (fontSize * 0.5);
    doc.setTextColor(...itemTextColor); // Reset to default
  };

  // Helper to draw horizontal line
  const drawLine = (x1, y1, x2, y2) => {
    doc.setDrawColor(...lineColor);
    doc.setLineWidth(0.5);
    doc.line(x1, y1, x2, y2);
  };

  // Helper to calculate item height
  const calculateItemHeight = (item, width) => {
    if (!item || !item.label) return 0;
    let itemText = item.value ? `${item.label}: ${item.value}` : item.label;
    if (item.qty && item.qty !== "") itemText += ` (Qty: ${item.qty})`;
    if (item.hand && item.hand !== "") itemText += ` (${item.hand})`;
    if (item.label === "Shower Size") {
      const dimensions = [
        item.length ? `L: ${item.length}` : "",
        item.width ? `W: ${item.width}` : "",
        item.height ? `H: ${item.height}` : "",
      ].filter(Boolean).join(", ");
      itemText = dimensions ? `${item.label}: ${dimensions}` : item.label;
    }
    const splitText = doc.splitTextToSize(itemText, width);
    return splitText.length * (itemFontSize * 0.5) + 8; // 8pt spacing
  };

  // Helper to calculate section height
  const calculateSectionHeight = (section) => {
    if (!section || !section.title) return 0;
    let height = sectionFontSize * 0.5 + 16; // Section title + 16pt top spacing
    const items = Array.isArray(section.items) ? section.items : [];
    const half = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, half);
    const rightItems = items.slice(half);
    let leftHeight = 0;
    let rightHeight = 0;
    for (const item of leftItems) {
      leftHeight += calculateItemHeight(item, itemColWidth - 15);
    }
    for (const item of rightItems) {
      rightHeight += calculateItemHeight(item, itemColWidth - 15);
    }
    height += Math.max(leftHeight, rightHeight); // Taller column
    height += 20; // 20pt spacing after section
    return height;
  };

  // Helper to render a section
  const renderSection = (section) => {
    if (!section || !section.title) return;
    const sectionHeight = calculateSectionHeight(section);
    checkY(sectionHeight);
    addText(section.title, col1X, sectionFontSize, true, contentWidth, sectionTextColor);
    y += 16; // 16pt after section title

    const items = Array.isArray(section.items) ? section.items : [];
    const half = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, half);
    const rightItems = items.slice(half);
    let leftY = y;
    let rightY = y;

    for (let i = 0; i < Math.max(leftItems.length, rightItems.length); i++) {
      const leftItem = leftItems[i];
      const rightItem = rightItems[i];
      let maxItemHeight = 0;

      if (leftItem) {
        let itemText = leftItem.value ? `${leftItem.label}: ${leftItem.value}` : leftItem.label;
        if (leftItem.qty && leftItem.qty !== "") itemText += ` (Qty: ${leftItem.qty})`;
        if (leftItem.hand && leftItem.hand !== "") itemText += ` (${leftItem.hand})`;
        if (leftItem.label === "Shower Size") {
          const dimensions = [
            leftItem.length ? `L: ${leftItem.length}` : "",
            leftItem.width ? `W: ${leftItem.width}` : "",
            leftItem.height ? `H: ${leftItem.height}` : "",
          ].filter(Boolean).join(", ");
          itemText = dimensions ? `${leftItem.label}: ${dimensions}` : leftItem.label;
        }
        const splitText = doc.splitTextToSize(itemText, itemColWidth - 15);
        doc.setFontSize(itemFontSize);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...itemTextColor);
        doc.text(splitText, col1X + 15, leftY);
        maxItemHeight = Math.max(maxItemHeight, splitText.length * (itemFontSize * 0.5) + 8);
        if (i < leftItems.length - 1) {
          drawLine(col1X + 15, leftY + maxItemHeight - 4, col1X + itemColWidth - 15, leftY + maxItemHeight - 4);
        }
      }

      if (rightItem) {
        let itemText = rightItem.value ? `${rightItem.label}: ${rightItem.value}` : rightItem.label;
        if (rightItem.qty && rightItem.qty !== "") itemText += ` (Qty: ${rightItem.qty})`;
        if (rightItem.hand && rightItem.hand !== "") itemText += ` (${rightItem.hand})`;
        if (rightItem.label === "Shower Size") {
          const dimensions = [
            rightItem.length ? `L: ${rightItem.length}` : "",
            rightItem.width ? `W: ${rightItem.width}` : "",
            rightItem.height ? `H: ${rightItem.height}` : "",
          ].filter(Boolean).join(", ");
          itemText = dimensions ? `${rightItem.label}: ${dimensions}` : rightItem.label;
        }
        const splitText = doc.splitTextToSize(itemText, itemColWidth - 15);
        doc.setFontSize(itemFontSize);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(...itemTextColor);
        doc.text(splitText, itemCol2X + 15, rightY);
        maxItemHeight = Math.max(maxItemHeight, splitText.length * (itemFontSize * 0.5) + 8);
        if (i < rightItems.length - 1) {
          drawLine(itemCol2X + 15, rightY + maxItemHeight - 4, itemCol2X + itemColWidth - 15, rightY + maxItemHeight - 4);
        }
      }

      leftY += maxItemHeight;
      rightY += maxItemHeight;
    }

    y = Math.max(leftY, rightY) + 20; // 20pt after section
  };

  // Header (enhanced with gradient, shadow, border, and two-column layout)
  const headerPadding = 15; // Top/bottom padding
  const headerSidePadding = 20; // Left/right padding
  const headerHeight = titleFontSize * 0.5 + headerFontSize * 0.5 + headerPadding * 2 + 10;
  checkY(headerHeight);

  // Gradient background (approximated with two rectangles)
  doc.setFillColor(...headerStartColor);
  doc.rect(col1X - headerSidePadding, y - headerPadding, contentWidth + headerSidePadding * 2, headerHeight / 2, "F");
  doc.setFillColor(...headerEndColor);
  doc.rect(col1X - headerSidePadding, y - headerPadding + headerHeight / 2, contentWidth + headerSidePadding * 2, headerHeight / 2, "F");

  // Border
  doc.setDrawColor(...borderColor);
  doc.setLineWidth(0.5);
  doc.rect(col1X - headerSidePadding, y - headerPadding, contentWidth + headerSidePadding * 2, headerHeight);

  // Title with shadow
  y += headerPadding;
  doc.setTextColor(...shadowColor);
  addText("Bid Sheet", col1X + 1, titleFontSize, true, contentWidth, shadowColor); // Shadow offset
  y -= titleFontSize * 0.5; // Reset y for main text
  addText("Bid Sheet", col1X, titleFontSize, true, contentWidth, headerTextColor);
  y += 10;

  // Two-column SO# and Homeowner
  const colWidth = contentWidth / 2;
  addText(`SO#: ${soNumber || "Unknown"}`, col1X, headerFontSize, false, colWidth, headerTextColor, true);
  const tempY = y;
  y -= headerFontSize * 0.5;
  addText(`Homeowner: ${homeownerName || "Unknown"}`, col1X + colWidth, headerFontSize, false, colWidth, headerTextColor, true);
  y = Math.max(y, tempY) + headerPadding;

  // Process subcategories
  const categories = Object.keys(subcategories || {});
  if (categories.length === 0) {
    console.warn("No categories found in subcategories");
    addText("No data available", col1X, sectionFontSize, false, contentWidth, sectionTextColor);
  } else {
    for (const category of categories) {
      const categoryHeight = categoryFontSize * 0.5 + 15;
      checkY(categoryHeight);
      addText(category, col1X, categoryFontSize, true, contentWidth, categoryTextColor);
      y += 15;

      const sections = Array.isArray(subcategories[category]) ? subcategories[category] : [];
      if (sections.length === 0) {
        addText("No sections available", col1X, sectionFontSize, false, contentWidth, sectionTextColor);
        y += 20;
      } else {
        for (const section of sections) {
          renderSection(section);
        }
      }
      y += 15;
    }
  }

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(pageNumberFontSize);
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(...pageNumberColor);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - margin / 2,
      { align: "right" }
    );
  }

  const filename = sanitizeFilename(
    `Bid_${homeownerName || "Unknown"}_${soNumber || "Unknown"}.pdf`
  );

  return { doc, filename };
}