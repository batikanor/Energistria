export type ImageAnnotation = {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  evidence?: string;
  salesUse?: string;
  confidence?: number;
  tone: "green" | "amber" | "blue" | "red";
};

export type FrameAnalysis = {
  releaseNum: number;
  summary: string;
  annotations: ImageAnnotation[];
};

export type VisionBrief = {
  headline: string;
  confidence: number;
  visualFindings: string[];
  argument: string;
  caution: string;
  nextMove: string;
  frames: FrameAnalysis[];
  generatedBy: string;
};
