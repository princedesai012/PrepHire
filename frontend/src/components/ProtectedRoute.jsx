// ProtectedRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      let valid = false;

      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });

          valid = res.ok;
          if (!valid) localStorage.removeItem("token");
        } catch {
          localStorage.removeItem("token");
        }
      }

      setTimeout(() => {
        setIsValid(valid);
        setLoading(false);
      }, 500);
    };

    verify();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin mb-2 text-blue-600" />
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!isValid) return <Navigate to="/login" replace />;
  return children;
}
