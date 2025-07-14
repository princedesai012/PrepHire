import { useState } from "react";
import illustration from "../hooks/illustration.svg";
import Navbar from "../components/Navbar";
import { signupUser } from "../api/auth.api";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react"; // Eye icon

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const data = await signupUser(username, email, password);
      alert(data.message || "Signup successful");
      window.location.href = "/login";
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked (frontend only)");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="mt-[5%] mb-[-1%] flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
        {/* Form */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Signup</h1>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="mb-2 w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-500 ease-in-out hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 hover:scale-105"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>

          <div className="flex items-center gap-4 my-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-sm text-muted-foreground">or</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring transition"
              required
            />

            {/* Password Field with Eye Toggle */}
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
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-xl inline-block transition-all duration-300 hover:bg-opacity-90 hover:border hover:border-dark hover:scale-105 hover:shadow-lg hover:shadow-primary/50"
              >
                Sign Up →
              </button>
            </div>

            <p className="text-sm text-accent-foreground mt-4 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600">
                Login
              </a>
            </p>
          </form>
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

export default Signup;
