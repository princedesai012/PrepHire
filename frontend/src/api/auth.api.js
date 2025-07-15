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

  export const googleSignup = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/google-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google signup failed');
      }
      
      return await response.json();
    } catch (err) {
      throw err;
    }
  };