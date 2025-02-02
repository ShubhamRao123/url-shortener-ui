const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Fetch User Analytics
export const getUserAnalytics = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("User ID is missing. Please log in.");
    throw new Error("User ID is required");
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link/analytics/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch analytics");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};
