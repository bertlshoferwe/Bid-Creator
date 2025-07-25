import React from "react";
import { Tabs, Tab } from "@mui/material";

const CategoryTabs = ({ tab, setTab }) => {
  return (
    <Tabs
      value={tab}
      onChange={(e, newValue) => setTab(newValue)}
      variant="scrollable"
      scrollButtons="auto"
      aria-label="Category tabs"
    >
      <Tab label="Contact" />
      <Tab label="Kitchen" />
      <Tab label="Bathroom" />
      <Tab label="Utility" />
      <Tab label="Outdoor" />
    </Tabs>
  );
};

export default CategoryTabs;