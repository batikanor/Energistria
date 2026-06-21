export type ImageAnnotation = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
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
