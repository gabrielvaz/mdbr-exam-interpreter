export interface BioimpedanceData {
  weight: number | null;
  height: number | null;
  age: number | null;
  gender: string | null;
  muscleMass: number | null;
  leanMass: number | null;
  visceralFat: number | null;
  bodyFatPercentage: number | null;
  fatMass: number | null;
  bodyWater: number | null;
  bmi: number | null;
  score: number | null;
  waistHipRatio: number | null;
  segmentalMass: {
    leftArm: number | null;
    rightArm: number | null;
    leftLeg: number | null;
    rightLeg: number | null;
    trunk: number | null;
  };
  segmentalFat: {
    leftArm: number | null;
    rightArm: number | null;
    leftLeg: number | null;
    rightLeg: number | null;
    trunk: number | null;
  };
  history: Array<{
    date: string;
    weight: number;
    muscleMass: number;
    bodyFatPercentage: number;
  }>;
}

export interface AnalysisResult {
  structuredData: BioimpedanceData;
  technicalAnalysis: string;
  patientAnalysis: string;
  tips: {
    bmi: string;
    bodyFat: string;
    muscleMass: string;
    bodyWater: string;
    visceralFat: string;
    score: string;
  };
}
