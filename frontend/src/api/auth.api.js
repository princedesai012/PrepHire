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

    // --- ADDED: Store the token in localStorage ---
    if (data.access_token) {
        localStorage.setItem("token", data.access_token);
    }

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
      
      const data = await response.json();

      // --- ADDED: Store the token for Google login as well ---
      if (data.access_token) {
          localStorage.setItem("token", data.access_token);
      }
      return data;
    } catch (err) {
      throw err;
    }
  };

  export const forgotPasswordRequest = async (email) => {
    const res = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send reset email");
  
    return data;
  };
  
  // You will also need a function for the password reset itself (to be used on a new page)
  export const resetPassword = async (token, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reset password");
  
    return data;
  };