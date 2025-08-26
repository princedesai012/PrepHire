import React, { useState, useEffect, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// --- Re-implemented components and icons for a self-contained environment ---
const TooltipProvider = ({ children }) => <>{children}</>;
const Tooltip = ({ children }) => <div className="relative group">{children}</div>;
const TooltipTrigger = ({ children }) => {
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);
  
  const handleMouseEnter = () => setOpen(true);
  const handleMouseLeave = () => setOpen(false);
  
  return React.cloneElement(children, {
    ref: triggerRef,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    'data-state': open ? 'open' : 'closed',
  });
};
const TooltipContent = ({ children, side, className }) => {
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    let parent = trigger.current;
    while (parent && parent.dataset.state === undefined) {
      parent = parent.parentElement;
    }
    if (parent) {
      setOpen(parent.dataset.state === 'open');
    }
  }, []);

  return open ? (
    <div
      ref={trigger}
      className={`absolute z-50 text-sm px-2 py-1 rounded-md transition-opacity duration-300 pointer-events-none ${className}`}
      style={{
        top: side === 'top' ? '-100%' : 'auto',
        bottom: side === 'bottom' ? '-100%' : 'auto',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity: open ? 1 : 0,
        ... (side === 'top' && { bottom: 'calc(100% + 8px)' }),
        ... (side === 'bottom' && { top: 'calc(100% + 8px)' }),
      }}
    >
      {children}
    </div>
  ) : null;
};
// Lucide-react icons as inline SVGs
const Mic = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
  const MicOff = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="2" x2="22" y1="2" y2="22"/><path d="M19 10v2a7 7 0 0 1-2.05 4.88"/><path d="M15.94 15.94A3 3 0 0 1 12 16a3 3 0 0 1-3-3V5a3 3 0 0 1 .43-1.66"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  );
  const Video = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
  );
  const VideoOff = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M10.66 6H22l-6 4 6 4v-2.34M2 16V6a2 2 0 0 1 2-2h8"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
  );
  const Square = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/></svg>
  );
  const HelpCircle = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.84 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
  );
  const CircleDot = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></svg>
  );
  const Clock = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
  const ChevronDown = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
  );
  const ChevronUp = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6"/></svg>
  );

export default function VideoBox() {
  const [isMuted, setIsMuted] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    const getMedia = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          videoRef.current.srcObject = stream;
          const audioTrack = stream.getAudioTracks()[0];
          if (audioTrack) {
            audioTrack.enabled = false;
          }
        } catch (err) {
          console.error("Error accessing media devices.", err);
          setCameraOn(false);
          setIsMuted(true);
        }
      }
    };

    getMedia();
  }, []);

  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (totalSec) => {
    const hrs = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSec % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const toggleMuteAndSpeech = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const audioTrack = videoRef.current.srcObject.getAudioTracks()[0];
      if (audioTrack) {
        const nextMutedState = !isMuted;
        audioTrack.enabled = !nextMutedState;
        setIsMuted(nextMutedState);

        if (nextMutedState) {
          SpeechRecognition.stopListening();
          resetTranscript();
        } else {
          resetTranscript();
          SpeechRecognition.startListening({ continuous: true });
        }
      }
    }
  };

  const toggleCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const videoTrack = videoRef.current.srcObject.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraOn;
        setCameraOn(!cameraOn);
      }
    }
  };

  const handleToggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      // Clear previous recording data
      recordedChunksRef.current = [];
      setRecordedVideoUrl(null);

      const stream = videoRef.current.srcObject;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9' // Modern, high-quality format
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      console.error("No media stream available to record.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <div className="relative w-full h-full bg-gray-300 rounded-xl overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${cameraOn ? 'opacity-100' : 'opacity-0'}`}
        />
        {!cameraOn && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-sm sm:text-base">
            Camera Off
          </div>
        )}

        {listening && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-4/5 bg-black/50 text-white p-3 rounded-lg text-center text-sm backdrop-blur-sm">
            <p>{transcript}</p>
          </div>
        )}
      </div>

      {isRecording && (
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm sm:text-base font-semibold shadow-lg backdrop-blur flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {formatTime(seconds)}
        </div>
      )}
      
      {/* --- Download Link for Completed Recording --- */}
      {recordedVideoUrl && (
        <div className="absolute top-4 left-4">
            <a
                href={recordedVideoUrl}
                download={`interview-recording-${new Date().toISOString()}.webm`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg transition"
            >
                Download Recording
            </a>
        </div>
      )}

      <button
        onClick={() => setShowControls(!showControls)}
        className="absolute bottom-[95px] left-1/2 transform -translate-x-1/2 bg-black/30 text-white px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 hover:bg-black/50 transition"
      >
        {showControls ? (
          <>
            <ChevronDown className="w-4 h-4" /> Hide Controls
          </>
        ) : (
          <>
            <ChevronUp className="w-4 h-4" /> Show Controls
          </>
        )}
      </button>

      {showControls && (
        <>
          <TooltipProvider>
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-md p-3 rounded-2xl flex gap-4 sm:gap-6 shadow-xl z-40">
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={toggleMuteAndSpeech}
                    className={`text-white p-3 rounded-full transition ${listening ? 'bg-blue-600 hover:bg-blue-700' : 'hover:bg-white/10'}`}
                  >
                    {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{isMuted ? "Unmute and Speak" : (listening ? "Stop Listening" : "Mute")}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={toggleCamera}
                    className="text-white p-3 rounded-full hover:bg-white/10 transition"
                  >
                    {cameraOn ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-white/90 text-black">
                  <p>{cameraOn ? "Turn Off Camera" : "Turn On Camera"}</p>
                </TooltipContent>
              </Tooltip>
              
              {/* --- Updated Recording Button --- */}
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={handleToggleRecording}
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

              <Tooltip>
                <TooltipTrigger>
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