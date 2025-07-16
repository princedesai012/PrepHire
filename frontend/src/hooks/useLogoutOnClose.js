import { useEffect } from "react";

const useLogoutOnClose = () => {
  useEffect(() => {
    const handleLogout = () => {
      const token = localStorage.getItem("token");

      if (token) {
        // Optional: Send logout request to backend
        fetch("http://localhost:5000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch((err) => {
          console.error("Logout error:", err);
        });

        // Remove token from local storage
        localStorage.removeItem("token");
      }
    };

    // Trigger on tab/browser close
    window.addEventListener("beforeunload", handleLogout);

    return () => {
      window.removeEventListener("beforeunload", handleLogout);
    };
  }, []);
};

export default useLogoutOnClose;
