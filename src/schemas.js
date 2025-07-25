export const getItemSchema = (label) => {
  switch (label) {
    case "Shower Size":
      return { fields: ["length", "width", "height"] };
    case "Tub":
      return { fields: ["value", "hand"] };
    case "Faucet":
    case "Sink":
    case "Toilet":
    case "Seat":
      return { fields: ["value", "qty"] };
    default:
      return { fields: ["value"] }; // Default to single value field for all other items
  }
};