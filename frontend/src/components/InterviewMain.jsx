import { useState } from "react";
import { Mic } from "lucide-react";
import { Sparkles } from "lucide-react";

const InterviewMain = () => {
  const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why should we hire you?",
    "Describe a challenge you faced and how you handled it."
  ];

  const [answers, setAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);

  const handleInputChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowFeedback(true);
  };

  return (
    <main className="relative z-10 max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">AI-Based Interview</h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        Answer the questions below either by typing or speaking. Get instant feedback after completion.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-200 space-y-4"
          >
            <p className="font-medium text-gray-800">{index + 1}. {q}</p>

            <textarea
              rows={3}
              placeholder="Type your answer..."
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={(e) => handleInputChange(index, e.target.value)}
            />

            <button
              type="button"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              <Mic className="w-4 h-4" />
              Speak Answer (Coming Soon)
            </button>
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-xl hover:scale-105 duration-300"
        >
          Submit Interview
        </button>
      </form>

      {showFeedback && (
        <div className="mt-12 bg-indigo-50 border border-indigo-200 p-6 rounded-xl shadow-inner animate-fade-in-up">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
            <Sparkles className="text-purple-500" />
            Interview Feedback
          </h2>
          <ul className="text-gray-700 space-y-2 text-base">
            <li>✅ Confident tone in your answers.</li>
            <li>✅ You covered relevant examples effectively.</li>
            <li>📌 Tip: Be more specific with metrics or outcomes (e.g., “increased sales by 20%”).</li>
            <li>📌 Tip: Add technical keywords aligned with job roles.</li>
          </ul>
        </div>
      )}
    </main>
  );
};

export default InterviewMain;
