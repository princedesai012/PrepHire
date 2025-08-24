// src/api/interview.api.js

const API_BASE_URL = "http://localhost:5000/api/interview";

/**
 * Starts a new interview session.
 * ✨ MODIFIED: This function now sends FormData to support file uploads.
 * @param {FormData} formData - The FormData object containing settings and the resume file.
 */
export const startInterview = async (formData) => {
  const token = localStorage.getItem("token");
  
  // When using FormData with fetch, you MUST NOT set the 'Content-Type' header.
  // The browser automatically sets it to 'multipart/form-data' and adds the
  // required boundary string, which is crucial for the server to parse the file.
  const response = await fetch(`${API_BASE_URL}/start-interview`, {
    method: "POST",
    headers: {
      // Note: The 'Content-Type': 'application/json' header has been REMOVED.
      Authorization: `Bearer ${token}`,
    },
    body: formData, // The FormData object is sent directly as the body.
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to start interview");
  }

  return response.json();
};

/**
 * Submits a user's answer and gets the next question.
 * --- UNCHANGED ---
 */
export const submitAnswer = async (sessionId, answer) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId, answer }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get next question");
  }

  return response.json();
};

/**
 * Ends the interview and retrieves the results.
 * --- UNCHANGED ---
 */
export const endInterview = async (sessionId) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/end-interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get results");
  }

  return response.json();
};