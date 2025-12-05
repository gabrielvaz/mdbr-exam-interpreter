export interface InsightMetric {
    name: string;
    value: string | number;
    description: string;
    status: "abaixo" | "ideal" | "acima" | "alerta" | "neutro";
}

export interface ExplanationSection {
    title: string;
    subtitle?: string;
    content: string;
}

export interface BioimpedanceData {
    patientInfo?: {
        name?: string;
        age?: string;
        gender?: string;
        height?: string;
        weight?: string;
        cpf?: string;
        birthDate?: string;
    };
    weight: { value: number | null; unit: string; status: string };
    bmi: { value: number | null; unit: string; status: string };
    bodyFat: { value: number | null; unit: string; status: string };
    muscleMass: { value: number | null; unit: string; status: string };
    bodyWater: { value: number | null; unit: string; status: string };
    visceralFat: { value: number | null; unit: string; status: string };
    boneMass: { value: number | null; unit: string; status: string };
    bmr: { value: number | null; unit: string; status: string };
    metabolicAge: { value: number | null; unit: string; status: string };
    score: { value: number | null; unit: string; status: string };
    history: {
        date: string;
        weight: number | null;
        bodyFat: number | null;
        muscleMass: number | null;
        score: number | null;
    }[];
    recommendations?: {
        diet?: string;
        exercise?: string;
        hydration?: string;
        sleep?: string;
        professional?: string;
        procedures?: string;
    };
    insights?: InsightMetric[];
}

export interface AnalysisResult {
    structured: BioimpedanceData;
    explanation: string;
    structuredExplanation?: ExplanationSection[];
    rawJson: Record<string, unknown>;
}
