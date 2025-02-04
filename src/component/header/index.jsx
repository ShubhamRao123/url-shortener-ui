// src/components/Header.js
import React, { useEffect, useState } from "react";
import styles from "./header.module.css"; // Import CSS module
import { createShortLink } from "../../services/linkService";
import { useNavigate, useLocation } from "react-router-dom";
import {
  setSearchRemarks,
  fetchLinksByRemarks,
  resetFilteredLinks,
} from "../../store/linkSlice";
import { useDispatch, useSelector } from "react-redux";

function Header({ fetchShortLinks }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);
  const [username, setUsername] = useState(""); // State to store the username
  const [initials, setInitials] = useState(""); // State to store user initials
  const [showLogout, setShowLogout] = useState(false); // State for logout dropdown
  const [urlError, setUrlError] = useState(""); // Error state for URL
  const [remarksError, setRemarksError] = useState(""); // Error state for Remarks

  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const { searchRemarks, loading, error } = useSelector((state) => state.links);

  // Fetch username from localStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    setUsername(storedUsername);

    // Extract initials
    const nameParts = storedUsername.trim().split(" ");
    let initials = nameParts[0][0]; // First letter of the first name
    if (nameParts.length > 1) {
      initials += nameParts[nameParts.length - 1][0]; // First letter of last name
    }
    setInitials(initials.toUpperCase()); // Convert to uppercase
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data
    navigate("/login"); // Navigate to login page
  };

  // Format today's date
  const formatDate = () => {
    const date = new Date();
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    dispatch(setSearchRemarks(value));

    // If the search input is cleared, reset the filteredLinks
    if (value.trim() === "") {
      dispatch(resetFilteredLinks()); // Reset filteredLinks to an empty array
      navigate("/link"); // Navigate to the default link page
    }
  };

  useEffect(() => {
    if (searchRemarks.trim().length < 3) return; // Require at least 3 characters

    const delayDebounceFn = setTimeout(() => {
      // Always update the URL with the search query, regardless of the current page
      navigate(`/link?search=${encodeURIComponent(searchRemarks)}`);

      // If on the /link page, fetch links based on the search query
      if (location.pathname === "/link") {
        dispatch(fetchLinksByRemarks(searchRemarks));
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchRemarks, navigate, location, dispatch]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreate = async () => {
    setUrlError(""); // Reset errors initially
    setRemarksError("");

    if (!destinationUrl.trim()) {
      setUrlError("This field is mandatory");
    }
    if (!remarks.trim()) {
      setRemarksError("This field is mandatory");
    }

    if (!destinationUrl.trim() || !remarks.trim()) {
      return; // Stop execution if validation fails
    }
    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID is missing. Please log in.");
      return;
    }

    const formattedExpiresAt = hasExpiration
      ? new Date(expiresAt).toISOString()
      : null; // Convert to ISO format or set to null if expiration is disabled

    const data = {
      userId,
      destinationUrl,
      remarks,
      expiresAt: formattedExpiresAt,
    };

    console.log("Data being sent:", data); // Debugging line

    try {
      const response = await createShortLink(data);
      console.log("Short link created successfully:", response);

      toggleModal();
      handleClear();

      // Call fetchShortLinks to refresh the list of links
      await fetchShortLinks();
    } catch (error) {
      console.error("Error creating short link:", error);
    }
  };

  const handleClear = () => {
    setDestinationUrl("");
    setRemarks("");
    setExpiresAt("");
    setHasExpiration(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <img
          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738170883/download_2_xxx8cd.png"
          alt=""
        />
      </div>
      {/* Display the greeting and date */}
      <div className={styles.greeting}>
        <p>
          <img
            src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738577384/%EF%B8%8F_mpgsck.png"
            alt=""
          />{" "}
          Good morning,{" "}
          {username.split(" ")[0].charAt(0).toUpperCase() +
            username.split(" ")[0].slice(1)}
        </p>
        <span>{formatDate()}</span>
      </div>

      <p onClick={toggleModal} className={styles.createButton}>
        <img
          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738582634/Frame_qu1ln8.png"
          alt=""
        />
        Create New
      </p>
      <div className={styles.inputField}>
        <img
          src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738583471/Frame_1_ggparq.png"
          alt=""
        />
        <input
          type="text"
          placeholder="Search by remarks"
          value={searchRemarks}
          onChange={handleSearchChange}
        />
      </div>
      {/* User Initials Avatar */}
      <div className={styles.avatar} onClick={() => setShowLogout(!showLogout)}>
        {initials}
      </div>

      {/* Logout Menu */}
      {showLogout && (
        <div className={styles.logoutMenu} onClick={handleLogout}>
          Logout
        </div>
      )}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <p> New Link</p>
              <img
                onClick={toggleModal}
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738233632/close_FILL0_wght400_GRAD0_opsz24_5_1_nhvtsa.png"
                alt=""
              />
            </div>
            <p className={styles.urlLabel}>
              Destination Url <span>*</span>
            </p>
            <input
              type="text"
              placeholder="https://web.whatsapp.com/"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className={styles.inputFieldModal}
            />
            {urlError && <p className={styles.errorText}>{urlError}</p>}{" "}
            {/* Show error */}
            <p className={styles.remarksLabel}>
              Remarks <span>*</span>
            </p>
            <textarea
              placeholder="Add remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={styles.inputFieldModal1}
            />
            {remarksError && <p className={styles.errorText}>{remarksError}</p>}{" "}
            {/* Show error */}
            <div className={styles.expirationContainer}>
              <p>Link Expiration</p>

              <button
                className={`${styles.toggleBtn} ${
                  hasExpiration ? styles.toggle : ""
                }`}
                onClick={() => setHasExpiration(!hasExpiration)}
              >
                <div
                  className={`${styles.thumb} ${
                    hasExpiration ? styles.thumbActive : ""
                  }`}
                ></div>
              </button>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={styles.inputFieldModal}
                disabled={!hasExpiration}
              />
            </div>
            <div className={styles.buttonContainer}>
              <p onClick={handleClear} className={styles.clearButton}>
                Clear
              </p>
              <p onClick={handleCreate} className={styles.createButtonModal}>
                Create New
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
