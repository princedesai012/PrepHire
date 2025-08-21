import VideoBox from "./VideoBox";
import ChatBox from "./ChatBox";
import InterviewResults from "./InterviewResults";

export default function InterviewMain() {
  return (
    <div className="mt-16 flex flex-col lg:flex-row bg-gray-50 p-4 gap-4 min-h-screen">
      {/* Left: Video */}
      <div className="w-full lg:flex-1 bg-white shadow rounded-2xl p-4 h-[250px] sm:h-[300px] md:h-[350px] lg:h-auto">
        <VideoBox />
      </div>

      {/* Right: Chat + Results */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white shadow rounded-2xl p-4 flex-1 min-h-[300px]">
          <ChatBox />
        </div>
        <div className="bg-white shadow rounded-2xl p-4 flex-1 min-h-[300px]">
          <InterviewResults />
        </div>
      </div>
    </div>
  );
}
