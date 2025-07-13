import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InterviewMain from "@/components/InterviewMain";

const InterviewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <Navbar />
      <br />
      <InterviewMain />
      <Footer />
    </div>
  );
};

export default InterviewPage;