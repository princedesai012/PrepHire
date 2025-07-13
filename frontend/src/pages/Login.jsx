// // Login.jsx (Improved UI with Tailwind CSS)
// import React from 'react';
// import illustration from '../hooks/illustration.svg';
// import Navbar from '../components/Navbar';
// import { Link } from 'react-router-dom';

// const Login = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Logging in...");
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col">
//       <Navbar />
//       <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
//         {/* Form */}
//         <div className="w-full max-w-md">
//           <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Login</h1>
//           <form onSubmit={handleSubmit} className="space-y-4">
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
//             <div className="flex justify-between items-center">
//               <button
//                 type="submit"
//                 className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:bg-opacity-90 transition"
//               >
//                 Next →
//               </button>
//               <a href="#" className="text-sm text-muted-foreground hover:underline">
//                 Forgot Password
//               </a>
//             </div>
//             <p className="text-sm text-accent-foreground mt-4 text-center">
//               Don't have an account?{' '}
//               <Link to="/signup" className="text-blue-600">
//                 Sign up
//               </Link>
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

// export default Login;


import React from 'react';
import illustration from '../hooks/illustration.svg';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { loginUser } from "../api/auth.api";

const Login = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      alert("Login successful");
      // redirect to dashboard or profile page
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
      <div className="flex flex-col-reverse md:flex-row items-center justify-center flex-1 gap-10 px-6 py-12">
        {/* Form */}
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-primary">PrepHire Login</h1>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg transition-all duration-500 ease-in-out hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 hover:scale-105 mb-4"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>

          <div className="text-center text-sm text-muted-foreground mb-2">or</div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="bg-primary text-primary-foreground font-semibold px-6 py-2 rounded-md hover:bg-opacity-90 transition"
              >
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

export default Login;
