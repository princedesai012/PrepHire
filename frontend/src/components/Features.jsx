import { Brain, Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Features = () => {
  const interviewTypes = [
    {
      icon: Brain,
      title: "Aptitude Interview",
      description: "Master logical reasoning, quantitative aptitude, and problem-solving skills with our AI-powered practice sessions.",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Technical Interview",
      description: "Practice coding challenges, system design, and technical concepts tailored to your field and experience level.",
      gradient: "from-green-400 to-blue-500"
    },
    {
      icon: Users,
      title: "HR Interview",
      description: "Perfect your soft skills, behavioral responses, and communication with realistic HR interview scenarios.",
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-gray-50 to-blue-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ... features content unchanged ... */}
      </div>
    </section>
  );
};

export default Features;