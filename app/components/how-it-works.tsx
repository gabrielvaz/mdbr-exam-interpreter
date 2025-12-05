import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Brain, FileText } from "lucide-react";

export function HowItWorks() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-slate-200 shadow-sm bg-white hover:border-slate-300 transition-colors">
                <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-slate-900" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">1. Envie o Exame</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Tire uma foto ou faça upload do PDF do seu resultado de bioimpedância.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white hover:border-slate-300 transition-colors">
                <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                        <Brain className="w-6 h-6 text-slate-900" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">2. Análise Inteligente</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Nossa IA extrai os dados, calcula métricas e identifica padrões de saúde.
                    </p>
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm bg-white hover:border-slate-300 transition-colors">
                <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-slate-900" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900">3. Resultado Detalhado</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-600 leading-relaxed">
                        Receba uma explicação clara, gráficos e recomendações personalizadas.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
