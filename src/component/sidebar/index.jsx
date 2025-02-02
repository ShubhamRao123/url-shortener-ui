import React from "react";
import styles from "./sidebar.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetFilteredLinks, setSearchRemarks } from "../../store/linkSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    // Clear search query and reset state
    dispatch(setSearchRemarks("")); // Reset searchRemarks in Redux
    dispatch(resetFilteredLinks()); // Reset filteredLinks in Redux
    navigate(path); // Navigate to the desired page
  };

  return (
    <div className={styles.sidebar}>
      <p onClick={() => handleNavigation("/home")}>Dashboard</p>
      <p onClick={() => handleNavigation("/link")}>Links</p>
      <p onClick={() => handleNavigation("/analytics")}>Analytics</p>
      <p onClick={() => handleNavigation("/settings")}>Settings</p>
    </div>
  );
}

export default Sidebar;
