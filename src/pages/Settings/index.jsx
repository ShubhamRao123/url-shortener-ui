import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import toast from "react-hot-toast";
import {
  deleteUser,
  fetchUserProfile,
  updateUserProfile,
} from "../../services/userSetting";
import { useNavigate } from "react-router-dom";
import Header from "../../component/header";
import Sidebar from "../../component/sidebar";

function Settings() {
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

  // Fetch user details on component mount
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const data = await fetchUserProfile();
        setUserDetails({
          fullName: data.name || "",
          email: data.email || "",
          phoneNumber: data.phone || "",
        });

        // Store fetched details in localStorage
        localStorage.setItem("username", data.name || "");
        localStorage.setItem("userEmail", data.email || "");
        localStorage.setItem("userPhone", data.phone || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getUserDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleSaveClick = async () => {
    try {
      await updateUserProfile(userDetails);
      toast.success("Profile updated successfully");

      // Update localStorage
      localStorage.setItem("username", userDetails.fullName);
      localStorage.setItem("userEmail", userDetails.email);
      localStorage.setItem("userPhone", userDetails.phoneNumber);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      toast.success("Account deleted successfully");

      // Clear user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPhone");

      // Navigate to the Register page
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    handleDeleteAccount();
    setShowModal(false);
  };

  return (
    <div style={styles.container}>
      <Header />
      <div className={styles.contentContainer}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <div className={styles.mainContent}>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : (
            <form style={styles.form}>
              <div className={styles.formGroupName}>
                <p>Name</p>
                <input
                  type="text"
                  name="fullName"
                  value={userDetails.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroupName1}>
                <p>Email id</p>
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroupName2}>
                <p>Mobile no.</p>
                <input
                  type="text"
                  name="phoneNumber"
                  value={userDetails.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="button" onClick={handleSaveClick}>
                Save Changes
              </button>
              <button type="button" onClick={handleDeleteModal}>
                Delete Account
              </button>
            </form>
          )}
        </div>
      </div>

      {showModal && (
        <div>
          <div className={styles.headerOverlay}>
            {/* Empty overlay to cover the header */}
          </div>
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <img
                src="https://res.cloudinary.com/dfrujgo0i/image/upload/v1738736299/window-close_noskus.png"
                alt=""
                onClick={handleCloseModal}
              />
              <p>Are you sure you want to delete your account?</p>
              <div className={styles.modalButtons}>
                <p className={styles.closeDelete} onClick={handleCloseModal}>
                  No
                </p>
                <p
                  className={styles.confirmDelete}
                  onClick={handleConfirmDelete}
                >
                  Yes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
