// src/api/auth.api.js

const API_BASE_URL = "http://localhost:5000/api"; // or your deployed backend URL

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    return data; // contains access_token
  } catch (error) {
    throw error;
  }
};

export const fetchUserDetails = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch("http://localhost:5000/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch user");

  return data;
};


export const signupUser = async (username, email, password) => {
    try {
        const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || "Signup failed");
  
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  export const googleSignup = async (idToken) => {
    const res = await fetch("http://localhost:5000/api/google-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken }),
    });
  
    const data = await res.json();
  
    if (!res.ok) throw new Error(data.message || "Google signup failed");
    return data;
  };
  