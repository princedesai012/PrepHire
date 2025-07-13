// // Signup.jsx
// import illustration from "../hooks/illustration.svg";
// import Navbar from "../components/Navbar";

// const Signup = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Signing up...");
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <Navbar />
//       <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
//         {/* Form */}
//         <div className="w-full max-w-md">
//           <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Signup</h1>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="text"
//               placeholder="Username"
//               className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
//               required
//             />
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
//               required
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
//               required
//             />

//             <button
//               type="submit"
//               className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:bg-opacity-90 transition w-full"
//             >
//               Sign Up →
//             </button>

//             <p className="text-sm text-accent-foreground mt-4 text-center">
//               Already have an account? <a href="/login" className="text-blue-600">Login</a>
//             </p>
//           </form>
//         </div>

//         {/* Image */}
//         <div className="w-full max-w-md">
//           <img
//             src={illustration}
//             alt="Illustration"
//             className="w-full object-contain animate-float"
//           />
//         </div>
//       </div>

//       {/* Footer */}
//       <footer className="border-t border-border text-muted-foreground text-sm text-center py-6">
//         <div className="flex justify-center gap-6 flex-wrap">
//           <a href="#">Help Center</a>
//           <a href="#">What's New</a>
//           <a href="#">Pricing</a>
//           <a href="#">Privacy</a>
//           <a href="#">Terms</a>
//           <a href="#">Contact</a>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Signup;



import illustration from "../hooks/illustration.svg";
import Navbar from "../components/Navbar";

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signing up...");
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked (frontend only)");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
        {/* Form */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Signup</h1>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-500 ease-in-out hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 hover:scale-105"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign up with Google</span>
          </button>

          <div className="text-center text-sm text-muted-foreground mb-2">or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring transition"
              required
            />

            <button
              type="submit"
              className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:bg-opacity-90 transition w-full"
            >
              Sign Up →
            </button>

            <p className="text-sm text-accent-foreground mt-4 text-center">
              Already have an account? <a href="/login" className="text-blue-600">Login</a>
            </p>
          </form>
        </div>

        {/* Image */}
        <div className="w-full max-w-md">
          <img
            src={illustration}
            alt="Illustration"
            className="w-full object-contain animate-float"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border text-muted-foreground text-sm text-center py-6">
        <div className="flex justify-center gap-6 flex-wrap">
          <a href="#">Help Center</a>
          <a href="#">What's New</a>
          <a href="#">Pricing</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
