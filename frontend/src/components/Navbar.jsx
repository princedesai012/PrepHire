import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";

const navigationItems = [
  { name: "Analyze Resume", href: "/analyze-resume" },
  { name: "Interview Practice", href: "/interview" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

const NavLink = ({ item, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (item.href.startsWith("#")) {
      const section = item.href.slice(1); // e.g., "about"
      localStorage.setItem("scrollToSection", section); // store target section
      navigate("/home"); // redirect to home
    } else {
      navigate(item.href); // go to route
    }
    if (onClick) onClick(); // for mobile menu
  };

  return (
    <a
      href={item.href}
      onClick={handleClick}
      className="text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105 hover:shadow-lg relative group overflow-hidden"
    >
      <span className="relative z-10">{item.name}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100 transform origin-left"></div>
      <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-500"></span>
    </a>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleLinkClick = () => setIsMenuOpen(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 cursor-pointer">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 group"
            onClick={() => navigate("/home")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 transition-all duration-500">
                PrepHire
              </h1>
              <p className="text-xs text-gray-600 font-medium tracking-wide">
                Prep smarter. Get hired faster.
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {localStorage.getItem("token") ? (
              <>
                {/* Account Button styled like NavLink */}
                <button
                  onClick={() => navigate("/account")}
                  className="text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105 hover:shadow-lg relative group overflow-hidden"
                >
                  <span className="relative z-10">Account</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-x-0 group-hover:scale-x-100 transform origin-left"></div>
                  <span className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-3/4 group-hover:left-1/8 transition-all duration-500"></span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  className="text-white bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <Button
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 rounded-full px-6 relative overflow-hidden group"
                onClick={() => navigate("/login")}
              >
                <span className="relative z-10 flex items-center">
                  <LogIn className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  Log In
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300 hover:scale-105"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6 transition-transform duration-300 rotate-180" />
              ) : (
                <Menu className="block h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200/50 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl">
              {navigationItems.map((item, index) => (
                <NavLink
                  key={item.name}
                  item={item}
                  onClick={handleLinkClick}
                />
              ))}
              <div className="pt-3 border-t border-gray-200/50">
              {localStorage.getItem("token") ? (
                <>
                  <button
                    onClick={() => {
                      navigate("/account");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-gray-700 hover:text-blue-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-105 hover:shadow-lg"
                  >
                    Account
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-white bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white transition-all duration-300 hover:scale-105 rounded-xl shadow-lg"
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Button>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
