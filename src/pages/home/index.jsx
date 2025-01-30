import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.css"; // Import CSS module
import { createShortLink } from "../../services/linkService";

function Home() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [hasExpiration, setHasExpiration] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreate = async () => {
    const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage

    if (!userId) {
      console.error("User ID is missing. Please log in.");
      return;
    }

    const data = {
      userId, // Include userId in the request body
      destinationUrl,
      remarks,
      expiresAt: hasExpiration ? expiresAt : null,
    };

    try {
      const response = await createShortLink(data);
      console.log("Short link created successfully:", response);

      // Close the modal after successful creation
      toggleModal();

      // Clear the form fields
      handleClear();
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
      <div>
        <p onClick={toggleModal} className={styles.createButton}>
          Create New
        </p>
      </div>
      <div className={styles.sidebar}>
        <p onClick={() => navigate("/link")}>Links</p>
        <p onClick={() => navigate("/analytics")}>Analytics</p>
        <p onClick={() => navigate("/settings")}>Settings</p>
      </div>

      {/* Modal */}
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

export default Home;
