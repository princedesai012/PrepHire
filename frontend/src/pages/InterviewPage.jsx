import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InterviewMain from "@/components/InterviewMain";

const InterviewPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar />
      <InterviewMain />
      <Footer />
    </>
  );
};

export default InterviewPage;
