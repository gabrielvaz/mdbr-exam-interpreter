"use client";

import { AnalysisResult } from "@/app/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardMetric } from "./card-metric";
import { ChartsSection } from "./charts-section";
import {
    Copy,
    Check,
    User,
    Scale,
    Activity,
    Dumbbell,
    Droplets,
    AlertTriangle,
    Star,
    Bone,
    Flame,
    Clock
} from "lucide-react";
import { useState } from "react";

interface TabsResultsProps {
    result: AnalysisResult;
    onReset: () => void;
}

export function TabsResults({ result, onReset }: TabsResultsProps) {
    const [copiedText, setCopiedText] = useState(false);
    const [activeTab, setActiveTab] = useState("summary");

    const { structured, explanation } = result;

    const handleCopy = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2000);
    };

    const copyExplanation = () => {
        const patientName = structured.patientInfo?.name ? `Paciente: ${structured.patientInfo.name}\n\n` : "";
        const textToCopy = `${patientName}${explanation}`;
        handleCopy(textToCopy);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Resultado da Análise</h2>
                <div className="flex gap-2">
                    <Button onClick={onReset}>Nova Análise</Button>
                </div>
            </div>

            <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="summary">Resumo Estruturado</TabsTrigger>
                    <TabsTrigger value="explanation">Explicação para o Paciente</TabsTrigger>
                </TabsList>

                {/* --- TAB: RESUMO --- */}
                <TabsContent value="summary" className="space-y-6">

                    {/* Patient Info Card */}
                    {structured.patientInfo && (
                        <Card className="rounded-xl border-slate-200 bg-slate-50/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                                    <User className="w-5 h-5" />
                                    Dados do Paciente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                {structured.patientInfo.name && (
                                    <div className="col-span-2">
                                        <span className="text-slate-500 block">Nome</span>
                                        <span className="font-medium text-slate-900">{structured.patientInfo.name}</span>
                                    </div>
                                )}
                                {structured.patientInfo.age && (
                                    <div>
                                        <span className="text-slate-500 block">Idade</span>
                                        <span className="font-medium text-slate-900">{structured.patientInfo.age} anos</span>
                                    </div>
                                )}
                                {structured.patientInfo.gender && (
                                    <div>
                                        <span className="text-slate-500 block">Sexo</span>
                                        <span className="font-medium text-slate-900">{structured.patientInfo.gender}</span>
                                    </div>
                                )}
                                {structured.patientInfo.height && (
                                    <div>
                                        <span className="text-slate-500 block">Altura</span>
                                        <span className="font-medium text-slate-900">{structured.patientInfo.height} cm</span>
                                    </div>
                                )}
                                {structured.patientInfo.weight && (
                                    <div>
                                        <span className="text-slate-500 block">Peso</span>
                                        <span className="font-medium text-slate-900">{structured.patientInfo.weight} kg</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <CardMetric
                            title="Peso"
                            value={structured.weight.value}
                            unit={structured.weight.unit}
                            description={structured.weight.status}
                            icon={<Scale className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="IMC"
                            value={structured.bmi.value}
                            unit={structured.bmi.unit}
                            description={structured.bmi.status}
                            icon={<Activity className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Gordura Corporal"
                            value={structured.bodyFat.value}
                            unit={structured.bodyFat.unit}
                            description={structured.bodyFat.status}
                            icon={<Activity className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Massa Muscular"
                            value={structured.muscleMass.value}
                            unit={structured.muscleMass.unit}
                            description={structured.muscleMass.status}
                            icon={<Dumbbell className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Água Corporal"
                            value={structured.bodyWater.value}
                            unit={structured.bodyWater.unit}
                            description={structured.bodyWater.status}
                            icon={<Droplets className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Gordura Visceral"
                            value={structured.visceralFat.value}
                            unit={structured.visceralFat.unit}
                            description={structured.visceralFat.status}
                            icon={<AlertTriangle className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Massa Óssea"
                            value={structured.boneMass.value}
                            unit={structured.boneMass.unit}
                            description={structured.boneMass.status}
                            icon={<Bone className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Metabolismo Basal"
                            value={structured.bmr.value}
                            unit={structured.bmr.unit}
                            description={structured.bmr.status}
                            icon={<Flame className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Idade Metabólica"
                            value={structured.metabolicAge.value}
                            unit={structured.metabolicAge.unit}
                            description={structured.metabolicAge.status}
                            icon={<Clock className="w-5 h-5 text-slate-700" />}
                        />
                        <CardMetric
                            title="Pontuação"
                            value={structured.score.value}
                            unit={structured.score.unit}
                            description={structured.score.status}
                            icon={<Star className="w-5 h-5 text-slate-700" />}
                        />
                    </div>

                    {/* Charts Section */}
                    <ChartsSection data={structured} />
                </TabsContent>

                {/* --- TAB: EXPLICAÇÃO --- */}
                <TabsContent value="explanation" className="space-y-6">
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={copyExplanation} className="mb-2">
                            {copiedText ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            Copiar Texto Completo
                        </Button>
                    </div>

                    <Card className="rounded-xl border-slate-200">
                        <div className="p-8">
                            <div className="prose prose-slate max-w-none">
                                {/* Patient Header in Explanation */}
                                {structured.patientInfo?.name && (
                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Análise de Bioimpedância</h3>
                                        <p className="text-slate-600">
                                            <strong>Paciente:</strong> {structured.patientInfo.name}<br />
                                            {structured.patientInfo.age && <span><strong>Idade:</strong> {structured.patientInfo.age} anos</span>}
                                        </p>
                                    </div>
                                )}

                                <div className="whitespace-pre-wrap text-slate-700 leading-relaxed space-y-4">
                                    {explanation.split('\n').map((line, i) => {
                                        // Simple heuristic to bold lines that look like titles (short, ends with colon or no punctuation but capitalized)
                                        const isTitle = line.trim().length > 0 && line.trim().length < 60 && (line.trim().endsWith(':') || /^[A-ZÀ-Ú]/.test(line.trim())) && !line.includes('.');

                                        if (isTitle) {
                                            return <h4 key={i} className="text-lg font-semibold text-slate-900 mt-6 mb-2">{line}</h4>;
                                        }
                                        return <p key={i} className="mb-2">{line}</p>;
                                    })}
                                </div>

                                {/* Recommendations Section moved here */}
                                {structured.recommendations && (
                                    <div className="mt-8 pt-8 border-t border-slate-100">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6">Recomendações Práticas</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {Object.entries(structured.recommendations).map(([key, value]) => {
                                                if (!value) return null;
                                                const labels: Record<string, string> = {
                                                    diet: "Dieta",
                                                    exercise: "Exercício",
                                                    hydration: "Hidratação",
                                                    sleep: "Sono",
                                                    professional: "Profissional",
                                                    procedures: "Procedimentos"
                                                };
                                                return (
                                                    <div key={key} className="space-y-2">
                                                        <h5 className="font-semibold text-slate-900 flex items-center gap-2">
                                                            {labels[key] || key}
                                                        </h5>
                                                        <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                            {value}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
