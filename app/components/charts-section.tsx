"use client";

import { BioimpedanceData } from "@/app/types";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    ReferenceLine,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Scale } from "lucide-react";

interface ChartsSectionProps {
    data: BioimpedanceData;
}

export function ChartsSection({ data }: ChartsSectionProps) {
    const history = data.history || [];
    const currentExam = {
        date: "Atual",
        weight: data.weight.value,
        bodyFat: data.bodyFat.value,
        muscleMass: data.muscleMass.value,
        score: data.score.value,
    };

    // Combine history with current exam for trends if history exists
    const trendData = history.length > 0 ? [...history, currentExam] : [currentExam];

    // Data for IMC Comparison
    const bmiValue = data.bmi.value || 0;
    const bmiData = [
        { name: "Abaixo", min: 0, max: 18.5, color: "#94a3b8" }, // slate-400
        { name: "Normal", min: 18.5, max: 24.9, color: "#0f172a" }, // slate-900 (primary)
        { name: "Sobrepeso", min: 25, max: 29.9, color: "#64748b" }, // slate-500
        { name: "Obesidade", min: 30, max: 40, color: "#334155" }, // slate-700
    ];

    // Find active BMI category
    const activeBmiCategory = bmiData.find(
        (cat) => bmiValue >= cat.min && bmiValue <= cat.max
    );

    return (
        <div className="space-y-6 mt-6">
            <h3 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
                <TrendingUp className="w-6 h-6" />
                Gráficos e Tendências
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Weight History */}
                <Card className="rounded-xl shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <Scale className="w-4 h-4" />
                            Histórico de Peso (kg)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis domain={['auto', 'auto']} fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#0f172a"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#0f172a" }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Body Composition History */}
                <Card className="rounded-xl shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <Activity className="w-4 h-4" />
                            Composição Corporal (%)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="bodyFat"
                                    name="Gordura"
                                    stroke="#64748b"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="muscleMass"
                                    name="Músculo"
                                    stroke="#0f172a"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* IMC Comparison */}
                <Card className="rounded-xl shadow-sm md:col-span-2 border-slate-200">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2 text-slate-700">
                            <Activity className="w-4 h-4" />
                            Comparativo de IMC
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={bmiData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={80}
                                    tick={{ fontSize: 12, fill: '#64748b' }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                <Bar dataKey="max" barSize={20} radius={[0, 4, 4, 0]}>
                                    {bmiData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            opacity={activeBmiCategory?.name === entry.name ? 1 : 0.3}
                                        />
                                    ))}
                                </Bar>
                                <ReferenceLine x={bmiValue} stroke="#0f172a" strokeDasharray="3 3" label={{ value: `Você: ${bmiValue}`, position: 'right', fill: '#0f172a', fontSize: 12 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
