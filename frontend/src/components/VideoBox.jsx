import { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Square,
  HelpCircle,
  CircleDot,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VideoBox() {
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showControls, setShowControls] = useState(true); // 🔄 New toggle state

  // Timer Effect
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setSeconds(0); // reset on stop
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  return (
    <div className="mt-[-2%] relative w-full h-full flex flex-col items-center justify-center">
      {/* Video Display */}
      <div className="w-full aspect-video bg-gray-300 rounded-xl flex items-center justify-center text-gray-700 text-sm sm:text-base">
        Live Video Feed
      </div>

      {/* Interview Timer */}
      {isRecording && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm sm:text-base font-semibold shadow-lg backdrop-blur flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {formatTime(seconds)}
        </div>
      )}

      {/* Toggle Controls Button */}
      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute bottom-[95px] left-1/2 transform -translate-x-1/2 bg-black/30 text-white px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 hover:bg-black/50 transition"
      >
        {showControls ? (
          <>
            <ChevronDown className="w-4 h-4" />
            Hide Controls
          </>
        ) : (
          <>
            <ChevronUp className="w-4 h-4" />
            Show Controls
          </>
        )}
      </button>

      {/* Floating Controls + Question Section */}
      {showControls && (
        <>
          {/* Floating Controls */}
          <TooltipProvider>
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-md p-3 rounded-2xl flex gap-4 sm:gap-6 shadow-xl z-40">
              {/* Mute / Unmute */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-white p-3 rounded-full hover:bg-white/10 transition"
                  >
                    {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{isMuted ? "Unmute" : "Mute"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Camera On / Off */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCameraOn(!cameraOn)}
                    className="text-white p-3 rounded-full hover:bg-white/10 transition"
                  >
                    {cameraOn ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{cameraOn ? "Turn Off Camera" : "Turn On Camera"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Start/Stop Recording */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`text-white p-3 rounded-full transition ${
                      isRecording ? "bg-red-600 hover:bg-red-700" : "hover:bg-white/10"
                    }`}
                  >
                    {isRecording ? <Square className="w-5 h-5 sm:w-6 sm:h-6" /> : <CircleDot className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{isRecording ? "Stop Recording" : "Start Recording"}</p>
                </TooltipContent>
              </Tooltip>

              {/* Toggle Question */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setShowQuestion(!showQuestion)}
                    className="text-white p-3 rounded-full hover:bg-white/10 transition"
                  >
                    <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{showQuestion ? "Hide Question" : "Show Question"}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Question Overlay */}
          {showQuestion && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-xl shadow-lg text-xs sm:text-sm backdrop-blur-md">
              <p>Q: Tell me about yourself.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
