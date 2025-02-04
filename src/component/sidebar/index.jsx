import React, { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetFilteredLinks, setSearchRemarks } from "../../store/linkSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(""); // Track active item
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Toggle sidebar

  useEffect(() => {
    const path = location.pathname;
    const itemName =
      path === "/home"
        ? "dashboard"
        : path === "/link"
        ? "links"
        : path === "/analytics"
        ? "analytics"
        : "settings";
    setActiveItem(itemName);
  }, [location]);

  const handleNavigation = (path, itemName) => {
    dispatch(setSearchRemarks(""));
    dispatch(resetFilteredLinks());
    navigate(path);
    setSidebarOpen(false); // Close sidebar after navigation (mobile)
  };

  return (
    <>
      {/* Hamburger Icon (Visible on Mobile & Tablet) */}
      <div
        className={styles.hamburger}
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <img
          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738648610/menu-btn_jbz2hn.png"
          alt="Menu"
        />
      </div>

      {/* Sidebar (Visible on Desktop, Toggles on Mobile) */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ""}`}>
        <div className={styles.sidebarContent}>
          <p
            className={`${styles.sidebarP} ${
              activeItem === "dashboard" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("/home", "dashboard")}
          >
            <img
              src={
                activeItem === "dashboard"
                  ? "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738639462/Icons_4_siazxw.png"
                  : "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738642574/Icons_5_xakjol.png"
              }
              alt="Dashboard Icon"
            />
            Dashboard
          </p>

          <p
            className={`${styles.sidebarP} ${
              activeItem === "links" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("/link", "links")}
          >
            <img
              src={
                activeItem === "links"
                  ? "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738642647/Icons_7_oeadgs.png"
                  : "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738639462/Icons_3_gdpefc.png"
              }
              alt="Links Icon"
            />
            Links
          </p>

          <p
            className={`${styles.sidebarP} ${
              activeItem === "analytics" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("/analytics", "analytics")}
          >
            <img
              src={
                activeItem === "analytics"
                  ? "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738642599/Icons_6_eapyxm.png"
                  : "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738639462/Icons_3_gdpefc.png"
              }
              alt="Analytics Icon"
            />
            Analytics
          </p>
        </div>
        <p
          className={`${styles.sidebarSettings} ${
            activeItem === "settings" ? styles.active : ""
          }`}
          onClick={() => handleNavigation("/settings", "settings")}
        >
          <img
            src={
              activeItem === "settings"
                ? "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738642667/Icons_8_jlkyvw.png"
                : "https://res.cloudinary.com/dfrujgo0i/image/upload/v1738639462/Frame_2_oksczr.png"
            }
            alt="Settings Icon"
          />
          Settings
        </p>
      </div>
    </>
  );
}

export default Sidebar;
