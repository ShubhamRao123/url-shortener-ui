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
      {/* Display the greeting and date */}
      <div className={styles.greeting}>
        <p>Hello {username.split(" ")[0]}</p>
        <p>{formatDate()}</p>
      </div>

      <div>
        <p onClick={toggleModal} className={styles.createButton}>
          Create New
        </p>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by remarks..."
          value={searchRemarks}
          onChange={handleSearchChange}
          className={styles.inputField}
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
              <h2>Create New Link</h2>
              <img
                onClick={toggleModal}
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738233632/close_FILL0_wght400_GRAD0_opsz24_5_1_nhvtsa.png"
                alt=""
              />
            </div>
            <label>Destination URL:</label>
            <input
              type="text"
              placeholder="https://web.whatsapp.com/"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className={styles.inputField}
            />
            <label>Remarks:</label>
            <input
              type="text"
              placeholder="Add remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className={styles.inputField}
            />

            <div className={styles.expirationContainer}>
              <label>Expiration:</label>
              <input
                type="checkbox"
                checked={hasExpiration}
                onChange={() => setHasExpiration(!hasExpiration)}
              />
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className={styles.inputField}
                disabled={!hasExpiration} // Disable the input when hasExpiration is false
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                onClick={handleCreate}
                className={`${styles.button} ${styles.createButton}`}
              >
                Create New
              </button>
              <button
                onClick={handleClear}
                className={`${styles.button} ${styles.clearButton}`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
