import { useState, useRef, useEffect } from "react";
import { submitAnswer } from "@/api/interview.api";
import { toast } from "sonner";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  // Load the initial question from session storage
  useEffect(() => {
    const sessionData = sessionStorage.getItem("interviewSession");
    if (sessionData) {
      const { sessionId, question } = JSON.parse(sessionData);
      setSessionId(sessionId);
      // Start with the first AI question
      setMessages([{ sender: "AI", text: question }]);
    }
  }, []);

  const sendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    setIsLoading(true);
    const userAnswer = input; // Store the user's answer
    setInput(""); // Clear the input field immediately

    try {
      const response = await submitAnswer(sessionId, userAnswer);
      
      // On success, add BOTH the user's last message and the AI's new question
      setMessages(prevMessages => [
        ...prevMessages,
        { sender: "You", text: userAnswer },
        { sender: "AI", text: response.question }
      ]);

    } catch (error) {
      toast.error(error.message || "Failed to get next question.");
      // If the API call fails, we don't add any messages, so no visual bug
    } finally {
      setIsLoading(false);
    }
  };

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Chat Q&A</h2>

      <div className="relative flex-1 overflow-y-auto space-y-2 px-2 py-1 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm whitespace-pre-line ${
              msg.sender === "You"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            <span className="font-medium block mb-1">{msg.sender}</span>
            <span>{msg.text}</span>
          </div>
        ))}
        
        {/* The "Typing..." indicator is now separate and temporary */}
        {isLoading && (
          <div className="flex flex-col max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm bg-gray-200 text-gray-900 self-start">
            <span className="font-medium block mb-1">AI</span>
            <span>Typing...</span>
          </div>
        )}
        
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center rounded-xl overflow-hidden border border-gray-300 shadow bg-white">
        <input
          type="text"
          className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your answer..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 sm:px-5 py-2 text-sm font-medium"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}