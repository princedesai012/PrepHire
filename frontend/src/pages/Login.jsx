import React, { useState, useEffect } from 'react';
import illustration from '../hooks/illustration.svg';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, googleSignup } from "../api/auth.api";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      alert("Login successful");
      navigate('/home');
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ Google Identity Services (One Tap)
  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "88929798729-vrm6civj7erlf8di1h3lq9tgsggc6ull.apps.googleusercontent.com",
        callback: async (response) => {
          const idToken = response.credential;
          try {
            const data = await googleSignup(idToken);
            localStorage.setItem("token", data.access_token);
            navigate("/account");
          } catch (err) {
            alert(err.message || "Google login failed");
          }
        },
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { theme: "outline", size: "large", shape: "pill", width: "50%" }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="mt-[5%] mb-[0.7%] flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
        {/* Form */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Login</h1>

          {/* Google Login Button */}
          <div
            id="google-login-button"
          >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
            <span>Sign in with Google</span>
          </div>
          <div className="flex items-center gap-4 my-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-muted-foreground">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>
          

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
              required
            />

            {/* Password Field with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 pr-12 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-xl transition-all duration-300 hover:bg-opacity-90 hover:border hover:border-dark hover:scale-105 hover:shadow-lg hover:shadow-primary/50">
                Next →
              </button>
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                Forgot Password
              </a>
            </div>

            <p className="text-sm text-accent-foreground mt-4 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600">
                Sign up
              </Link>
            </p>
          </form>

          {/* Guest Access Button */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/home')}
              className="text-sm text-blue-600 hover:underline"
            >
              Continue as Guest
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="ml-[2%] w-full max-w-md">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full object-contain animate-float"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Login;
