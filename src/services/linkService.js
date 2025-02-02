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
    expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : null, // Fix: Use data.expiresAt instead of data.hasExpiration
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

// update a short link
export const updateShortLink = async (shortCode, data) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link/update/${shortCode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update short link");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating short link:", error);
    throw error;
  }
};

// delete a short link
export const deleteShortLink = async (shortCode) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link/delete/${shortCode}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete short link");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting short link:", error);
    throw error;
  }
};

// Fetch short links by remarks
export const fetchShortLinksByRemarks = async (
  remarks,
  offset = 0,
  limit = 10
) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link?remarks=${encodeURIComponent(
        remarks
      )}&offset=${offset}&limit=${limit}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch short links");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching short links:", error);
    throw error;
  }
};

// Fetch responses for a specific short link
export const getShortLinkResponses = async (shortCode) => {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/link/${shortCode}/responses`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch responses");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching responses:", error);
    throw error;
  }
};
