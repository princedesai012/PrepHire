import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Communication", A: 80 },
  { subject: "Creativity", A: 70 },
  { subject: "Leadership", A: 50 },
  { subject: "Flexibility", A: 65 },
  { subject: "Research", A: 90 },
];

export default function InterviewResults() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <h2 className="font-semibold text-lg mb-2 text-gray-700">Interview Results</h2>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart outerRadius="80%" data={data}>
          <PolarGrid stroke="#ccc" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: "#4B5563", fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#6B7280", fontSize: 10 }} />
          <Radar
            name="Candidate"
            dataKey="A"
            stroke="#4F46E5"
            fill="#6366F1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
