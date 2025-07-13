import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Testoimonials from "@/components/Testimonials"
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <Hero />
        <Features />
        <About />
        <Contact />
        {/* <Testoimonials /> */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;
