import { useState, useRef, useEffect } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "AI", text: "Can you describe your last project?" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "You", text: input }]);
    setInput("");
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Chat Q&A</h2>

      <div className="relative flex-1 overflow-y-auto space-y-2 px-2 py-1 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-4 py-2 rounded-xl text-sm shadow-sm whitespace-pre-line ${
              msg.sender === "You"
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
          >
            <span className="font-medium block mb-1">{msg.sender}</span>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center rounded-xl overflow-hidden border border-gray-300 shadow bg-white">
        <input
          type="text"
          className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 sm:px-5 py-2 text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
