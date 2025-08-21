import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const interviewDomains = {
  Technology: {
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "DevOps Engineer",
      "Data Scientist",
      "Mobile Developer",
      "AI/ML Engineer",
      "Cybersecurity Specialist",
    ],
  },
  Healthcare: {
    roles: [
      "Nurse",
      "Doctor",
      "Healthcare Administrator",
      "Medical Technician",
      "Pharmacist",
      "Physical Therapist",
      "Healthcare Data Analyst",
      "Medical Researcher",
    ],
  },
};

const durations = [

  { value: "30", label: "30 Minutes" },
  { value: "45", label: "45 Minutes" },
  { value: "60", label: "60 Minutes" },
];

export default function InterviewSetup() {
  const [selectedDomain, setSelectedDomain] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [inputMode, setInputMode] = useState("text");
  const [duration, setDuration] = useState("30");
  const [resumeBased, setResumeBased] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type)
    ) {
      setResumeFile(file);
    } else {
      alert("Please upload a valid resume file (PDF, DOC, DOCX)");
      event.target.value = "";
    }
  };

  const handleStartInterview = () => {
    if (resumeBased && !resumeFile) {
      alert("Please upload your resume before starting.");
      return;
    }
    if (!resumeBased && (!selectedDomain || !selectedRole)) {
      alert("Please select both interview domain and role");
      return;
    }

    console.log("Starting interview with:", {
      selectedDomain,
      selectedRole,
      inputMode,
      duration,
      resumeBased,
      resumeFile,
    });
  };

  return (
    <>
      <Navbar />

      <div className="pt-20 min-h-screen bg-[#F0F8FF] relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        {/* Aqua soft clouds on 4 corners */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-cyan-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 -z-10" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-30 -z-10" />

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-800">AI Mock Interview</h1>
            <p className="text-gray-600 mt-2">Prep smarter. Get hired faster.</p>
          </div>

          <Card className="bg-white/90 p-8 rounded-2xl shadow-xl backdrop-blur-xl space-y-6">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">
                Use Resume-Based Interview
              </Label>
              <Switch checked={resumeBased} onCheckedChange={setResumeBased} />
            </div>

            {/* Resume Upload */}
            {resumeBased && (
              <div className="space-y-2">
                <Label className="text-lg font-semibold">
                  Upload Your Resume (PDF, DOC, DOCX)
                </Label>
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl text-center hover:scale-105 hover:shadow-xl transition-all duration-300 inline-block">
                      Choose File
                    </div>
                  </label>
                </div>
                {resumeFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Uploaded: {resumeFile.name}
                  </p>
                )}
              </div>
            )}

            {/* Domain */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Select Interview Domain</Label>
              <Select
                value={selectedDomain}
                onValueChange={setSelectedDomain}
                disabled={resumeBased}
              >
                <SelectTrigger className="h-12 rounded-lg bg-white/80 border border-gray-300">
                  <SelectValue placeholder="Choose your domain" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(interviewDomains).map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            {selectedDomain && !resumeBased && (
              <div className="space-y-2">
                <Label className="text-lg font-semibold">Select Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-12 rounded-lg bg-white/80 border border-gray-300">
                    <SelectValue placeholder="Choose your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewDomains[selectedDomain].roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Input Mode */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Input Mode</Label>
              <RadioGroup
                value={inputMode}
                onValueChange={setInputMode}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <Label htmlFor="text">Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="voice" id="voice" />
                  <Label htmlFor="voice">Voice</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label className="text-lg font-semibold">Interview Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-12 rounded-lg bg-white/80 border border-gray-300">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Button */}
            <Button
              className="w-full mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-xl hover:scale-105 hover:shadow-xl transition-all duration-300"
              onClick={handleStartInterview}
              disabled={
                (resumeBased && !resumeFile) ||
                (!resumeBased && (!selectedDomain || !selectedRole))
              }
            >
              Start Interview
            </Button>
          </Card>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Practice with AI-powered interviews tailored to your domain.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
