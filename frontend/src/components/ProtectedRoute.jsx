// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/verify-token", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          setIsValid(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsValid(false);
      }
    };

    verifyToken();
  }, []);

  if (isValid === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-600" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
