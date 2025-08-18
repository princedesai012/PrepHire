import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to PrepHire</h1>
      <p className="mb-8 text-gray-600 text-lg">Your smart assistant for AI mock interviews and resume analysis.</p>
      <Button
        onClick={() => navigate("/interview")}
        className="text-lg px-6 py-3 rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 text-white transition"
      >
        Interview Practice
      </Button>
    </div>
  );
}
