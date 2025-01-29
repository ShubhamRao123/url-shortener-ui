const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch User Profile
export const fetchUserProfile = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch user details");
    }

    return response.json();
  } catch (error) {
    console.error("Fetch User Profile API error:", error.message);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (userDetails) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: userDetails.fullName,
        email: userDetails.email,
        phone: userDetails.phoneNumber,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update profile");
    }

    return response.json();
  } catch (error) {
    console.error("Update User Profile API error:", error.message);
    throw error;
  }
};

// Delete User

export const deleteUser = async () => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete user");
    }

    return response.json();
  } catch (error) {
    console.error("Delete User API error:", error.message);
    throw error;
  }
};
