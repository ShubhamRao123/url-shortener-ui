const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const register = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred");
    }

    return response.json();
  } catch (error) {
    console.error("Register API error:", error.message);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "An error occurred during login");
    }

    return response.json();
  } catch (error) {
    console.error("Login API error:", error.message);
    throw error;
  }
};
