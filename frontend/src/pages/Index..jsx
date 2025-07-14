import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Testoimonials from "@/components/Testimonials";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const section = localStorage.getItem("scrollToSection");
    if (section) {
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      localStorage.removeItem("scrollToSection");
    }
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        {/* <Features /> */}
        
        {/* 🔽 Wrapped with section IDs for scroll-to-target support */}
        <div id="about">
          <About />
        </div>
        
        <div id="contact">
          <Contact />
        </div>

        {/* <Testoimonials /> */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
