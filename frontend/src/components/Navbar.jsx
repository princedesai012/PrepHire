import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


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
      const section = item.href.slice(1);
      localStorage.setItem("scrollToSection", section);
      navigate("/home");
    } else {
      navigate(item.href);
    }
    if (onClick) onClick();
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
  const location = useLocation();

  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "/default-avatar.png");

  useEffect(() => {
    const interval = setInterval(() => {
      const storedPic = localStorage.getItem("profilePic");
      if (storedPic && storedPic !== profilePic) {
        setProfilePic(storedPic);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [profilePic]);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      localStorage.removeItem("profilePic");
      navigate("/login");
    }
  };
  

  // Filter nav items: show About & Contact only on /home
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (item.href.startsWith("#")) {
      return location.pathname === "/home";
    }
    return true;
  });

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
            {filteredNavigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {isLoggedIn ? (
              <div className="flex items-center gap-9">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleLogout}
                        className="p-5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/90 text-white text-xs rounded-md px-2 py-1 shadow-md">
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate("/account")}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:scale-105 transition duration-300"
                      >
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/90 text-white text-xs rounded-md px-2 py-1 shadow-md">
                      <p>Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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

          {/* Mobile Menu Button */}
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
            <div className="px-3 pt-4 pb-4 border-t border-gray-200/50 bg-white/95 backdrop-blur-md rounded-b-2xl shadow-xl">
              <div className="flex flex-wrap justify-between items-center gap-4">
                {filteredNavigationItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.href.startsWith("#")) {
                        const section = item.href.slice(1);
                        localStorage.setItem("scrollToSection", section);
                        navigate("/home");
                      } else {
                        navigate(item.href);
                      }
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-300 hover:bg-blue-50 rounded-lg"
                  >
                    {item.name}
                  </button>
                ))}

                {isLoggedIn ? (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleLogout}
                            className="p-5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all duration-300 hover:scale-110 shadow-lg"
                          >
                            <LogOut className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-black/90 text-white text-xs rounded-md px-2 py-1 shadow-md">
                          <p>Logout</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navigate("/account")}
                        className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 hover:scale-105 transition duration-300"
                      >
                        <img
                          src={profilePic}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-black/90 text-white text-xs rounded-md px-2 py-1 shadow-md">
                      <p>Account</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                  </>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
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
