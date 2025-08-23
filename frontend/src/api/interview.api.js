const API_BASE_URL = "http://localhost:5000/api/interview";

/**
 * Starts a new interview session.
 */
export const startInterview = async (settings) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/start-interview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to start interview");
  }

  return response.json();
};

/**
 * Submits a user's answer and gets the next question.
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