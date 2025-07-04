
import { DynamicResumeForm } from "./DynamicResumeForm";
import { ResumeData, JDAnalysis } from "@/lib/resume-types";

interface ResumeFormProps {
  jdAnalysis: JDAnalysis | null;
  onResumeCreated: (data: ResumeData) => void;
}

export function ResumeForm({ jdAnalysis, onResumeCreated }: ResumeFormProps) {
  return <DynamicResumeForm jdAnalysis={jdAnalysis} onResumeCreated={onResumeCreated} />;
}
