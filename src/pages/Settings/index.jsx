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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmDelete) {
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
    }
  };

  return (
    <div style={styles.container}>
      <Header />
      <Sidebar />
      <h2>Edit Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <form style={styles.form}>
          <label>Name:</label>
          <input
            type="text"
            name="fullName"
            value={userDetails.fullName}
            onChange={handleInputChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            required
          />

          <label>Phone Number:</label>
          <input
            type="text"
            name="phoneNumber"
            value={userDetails.phoneNumber}
            onChange={handleInputChange}
            required
          />

          <button type="button" onClick={handleSaveClick}>
            Save Changes
          </button>
          <button type="button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </form>
      )}
    </div>
  );
}

export default Settings;
