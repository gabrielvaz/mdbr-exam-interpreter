import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisResult } from "@/app/types";
import { CardMetric } from "./card-metric";
import { Copy, FileJson } from "lucide-react";

interface TabsResultsProps {
    data: AnalysisResult;
}

export function TabsResults({ data }: TabsResultsProps) {
    const { structuredData, patientAnalysis, tips } = data;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="summary">Resumo</TabsTrigger>
                <TabsTrigger value="explanation">Explicação</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <CardMetric title="Peso" value={structuredData.weight} unit="kg" />
                    <CardMetric title="IMC" value={structuredData.bmi} unit="kg/m²" />
                    <CardMetric title="Gordura" value={structuredData.bodyFatPercentage} unit="%" />
                    <CardMetric title="Massa Muscular" value={structuredData.muscleMass} unit="kg" />
                    <CardMetric title="Gordura Visceral" value={structuredData.visceralFat} />
                    <CardMetric title="Água Corporal" value={structuredData.bodyWater} unit="kg" />
                    <CardMetric title="Pontuação" value={structuredData.score} unit="/100" className="col-span-2 md:col-span-3 bg-primary/5 border-primary/20" />
                </div>

                {structuredData.history && structuredData.history.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                                        <tr>
                                            <th className="px-4 py-2">Data</th>
                                            <th className="px-4 py-2">Peso</th>
                                            <th className="px-4 py-2">Músculo</th>
                                            <th className="px-4 py-2">Gordura %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {structuredData.history.map((item, i) => (
                                            <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                <td className="px-4 py-2 font-medium">{item.date}</td>
                                                <td className="px-4 py-2">{item.weight} kg</td>
                                                <td className="px-4 py-2">{item.muscleMass} kg</td>
                                                <td className="px-4 py-2">{item.bodyFatPercentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </TabsContent>

            <TabsContent value="explanation" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Análise para o Paciente</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(patientAnalysis)}>
                            <Copy className="w-4 h-4 mr-2" /> Copiar
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                            {patientAnalysis}
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tips && Object.entries(tips).map(([key, value]) => (
                        <Card key={key} className="bg-muted/30 border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="capitalize text-base font-semibold text-primary">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{value}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </TabsContent>

            <TabsContent value="json" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>JSON Estruturado</CardTitle>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(structuredData, null, 2))}>
                            <FileJson className="w-4 h-4 mr-2" /> Copiar JSON
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[500px] w-full rounded-md border p-4 bg-muted/50">
                            <pre className="text-xs font-mono text-foreground/80">
                                {JSON.stringify(data, null, 2)}
                            </pre>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
