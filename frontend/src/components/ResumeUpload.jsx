import { useState } from "react";
import { Upload, FileCheck2, Sparkles, Loader2, AlertCircle } from "lucide-react";

const ResumeUpload = () => {
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setShowResults(false);
      setIsAnalyzing(false);
      setError("");
      console.log("File selected:", file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setShowResults(false);
      setIsAnalyzing(false);
      setError("");
      console.log("File dropped:", file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!fileName) {
      setError("Please upload a resume file first.");
      return;
    }

    setError("");
    setIsAnalyzing(true);
    setShowResults(false);

    console.log("Analyzing resume...");
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
      console.log("Analysis complete.");
    }, 2000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden px-4 py-12">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-purple-300 via-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-2000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <div className="mt-[3%] relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-2xl p-8 text-center animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4">
          AI Resume Analyzer
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-8">
          Upload your resume and let our AI analyze it for keyword optimization, ATS compatibility, and personalized feedback.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div
            className={`w-full cursor-pointer border-2 border-dashed rounded-xl py-10 px-4 bg-white shadow-sm transition-all ${
              dragActive
                ? "border-indigo-600 bg-indigo-50"
                : "border-indigo-300 hover:border-indigo-500"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("resume").click()}
          >
            <Upload className="w-8 h-8 text-indigo-500 mb-2 animate-bounce mx-auto" />
            <span className="text-indigo-600 font-medium block">
              Drag & drop your resume here or click to upload
            </span>
            <span className="text-sm text-gray-400">(PDF, DOC, DOCX)</span>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleChange}
            />
          </div>

          {fileName && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
              <FileCheck2 className="w-5 h-5" />
              <span>Uploaded: {fileName}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-xl hover:scale-105 duration-300"
          >
            Analyze Resume
          </button>
        </form>

        {isAnalyzing && (
          <div className="mt-8 flex items-center justify-center gap-3 text-indigo-600 text-lg font-medium animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin" />
            Analyzing your resume...
          </div>
        )}

        {showResults && (
          <div className="mt-10 bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-inner text-left animate-fade-in-up">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
              <Sparkles className="text-purple-500" /> Analysis Summary
            </h2>

            <ul className="text-gray-700 space-y-2 text-base">
              <li>
                ✅ <strong>ATS Score:</strong> 85%
              </li>
              <li>
                ✅ <strong>Skill:</strong> MERN, DSA, Python
              </li>
              <li>
                ✅ <strong>Experience:</strong> 5 Years
              </li>
              <li>
                ✅ <strong>Education:</strong> B.tech
              </li>
              <li>
                📌 <strong>Recommendations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 text-sm text-gray-600">
                  <li>Add more measurable achievements</li>
                  <li>Include a certifications section</li>
                  <li>Quantify work experience with numbers</li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumeUpload;
