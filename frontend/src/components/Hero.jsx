import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Check, Zap, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      id="resume"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-300 via-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Enhanced Badge with animation */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-200/60 rounded-full px-6 py-2 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] will-change-transform">
          <Sparkles className="h-49- w-4 text-yellow-500" aria-hidden="true" />
          <span className="text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Prep smarter. Get hired faster.
          </span>
          <Sparkles className="h-4 w-4 text-yellow-500" aria-hidden="true" />
        </div>



        {/* Headline with improved animations */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="inline-block hover:scale-105 transition-transform duration-300 animate-fade-in-up">
            AI Resume Analyzer
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 transition-all duration-500 animate-fade-in-up delay-100">
            & Interview Coach
          </span>
        </h1>

        {/* Subtext with enhanced features list */}
        <div className="mb-8 max-w-3xl mx-auto animate-fade-in-up delay-200">
          <p className="text-xl md:text-2xl text-gray-600 mb-6 leading-relaxed">
            Transform your job search with our AI-powered platform that analyzes your resume and prepares you for interviews like never before.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-gray-700 font-medium">Instant Feedback</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span className="text-gray-700 font-medium">Smart Analysis</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm">
              <BarChart2 className="h-5 w-5 text-blue-500" />
              <span className="text-gray-700 font-medium">ATS Optimization</span>
            </div>
          </div>
        </div>

        {/* Enhanced Buttons with micro-interactions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-up delay-300">
          <Button
            size="lg"
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
            onClick={() => navigate('/analyze-resume')}
          >
            <span className="relative z-10 flex items-center">
              Analyze Resume
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="relative px-8 py-4 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50/80 transition-all duration-300 hover:scale-105 group bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
            onClick={() => navigate('/interview')}
          >
            <span className="relative z-10 flex items-center">
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Try Demo
            </span>
            <span className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></span>
          </Button>

        </div>

        {/* Enhanced Image Section with floating elements */}
        <div className="flex justify-center animate-fade-in-up delay-500">
          <div className="relative group max-w-4xl w-full">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop&crop=focalpoint&auto=format"
                alt="AI Resume Analysis Dashboard"
                className="w-full h-auto transition-all duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Floating UI Elements */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700">Real-time Analysis</span>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700">Score: 92%</span>
                </div>
              </div>
            </div>

            {/* Floating Tags with improved animation */}
            <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">95% Match</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce" style={{ animationDelay: "1.5s" }}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">AI Powered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;