import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import illustration from "../hooks/illustration.svg";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

const Account = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ old: "", new: "" });
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
        if (data.profile_picture) {
          localStorage.setItem("profilePic", data.profile_picture);
        }        
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Profile updated successfully");
      setEditMode(false);
      fetchUserDetails();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: passwords.old,
          new_password: passwords.new,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("Password changed successfully");
      setPasswords({ old: "", new: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_URL}/user`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete account");
      localStorage.removeItem("token");
      localStorage.removeItem("profilePic"); // ✅ remove profile pic on delete
      alert("Account deleted successfully");
      navigate("/signup");
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="mt-[5%] mb-[-1%] flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
        {/* Form */}
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-3xl font-bold text-primary mb-4">My Account</h1>

          {user && (
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editMode}
                className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
              {editMode ? (
                <button
                  onClick={handleUpdateProfile}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-500 hover:scale-105"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}

          <div className="space-y-4 border-t border-gray-300 pt-6">
            <h2 className="text-xl font-semibold text-primary">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={passwords.old}
              onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleChangePassword}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-500 hover:scale-105"
            >
              Change Password
            </button>
          </div>

          <div className="pt-6 border-t border-gray-300">
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              Delete My Account
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="ml-[2%] w-full max-w-md">
          <img
            src={illustration}
            alt="Account Illustration"
            className="w-full object-contain animate-float"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
