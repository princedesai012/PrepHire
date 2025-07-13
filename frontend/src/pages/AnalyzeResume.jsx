import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ResumeUpload from "../components/ResumeUpload";

const AnalyzeResume = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <ResumeUpload   />
            <Footer />
        </div>
    );
};

export default AnalyzeResume;