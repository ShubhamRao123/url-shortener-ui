const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Create a short link

export const createShortLink = async (data) => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    console.error("User ID is missing. Please log in.");
    throw new Error("User ID is required");
  }

  const formattedData = {
    userId,
    originalUrl: data.destinationUrl, // Fix: Change to originalUrl
    remarks: data.remarks,
    expiresAt: data.hasExpiration
      ? new Date(data.expiresAt).toISOString()
      : null, // Ensure valid date format
  };

  try {
    const response = await fetch(`${BACKEND_URL}/api/link/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create short link");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating short link:", error);
    throw error;
  }
};

// Get all short links for a user

export const getUserShortLinks = async (userId) => {
  if (!userId) {
    console.error("User ID is required for fetching short links");
    return [];
  }
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link/short-links/${userId}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch short links");
    }

    const data = await response.json();
    return data.shortLinks || [];
  } catch (error) {
    console.error("Error fetching short links:", error);
    return [];
  }
};

// Redirect to the original URL
export const redirectToOriginal = async (shortCode) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/link/${shortCode}`);

    if (!response.ok) {
      throw new Error("Failed to redirect");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in redirection:", error);
    throw error;
  }
};
