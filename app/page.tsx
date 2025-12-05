"use client";

import { useState } from "react";
import { Uploader } from "@/app/components/uploader";
import { LoadingAnimated } from "@/app/components/loading-animated";
import { TabsResults } from "@/app/components/tabs-results";
import { HowItWorks } from "@/app/components/how-it-works";
import { AnalysisResult } from "@/app/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Falha na análise. Tente novamente.");
      }

      const data = await res.json();
      setResult(data);
      // Note: We do NOT set loading(false) here. 
      // We wait for the LoadingAnimated component to call onComplete.
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro ao processar seu exame. Por favor, tente novamente.";
      setError(errorMessage);
      setLoading(false); // Stop loading on error immediately
    }
  };

  const onAnimationComplete = () => {
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Bioimpedância AI
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Interpretação inteligente e detalhada do seu exame corporal.
          </p>
        </div>

        {!result && !loading && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HowItWorks />
            <Uploader onUpload={handleUpload} isLoading={loading} />

            <div className="text-center text-sm text-slate-400 space-y-1">
              <p>Suportamos PDF, JPG, PNG e fotos de celular.</p>
              <p>Seus dados são processados em tempo real e não são salvos.</p>
            </div>
          </div>
        )}

        {loading && (
          <LoadingAnimated
            isFinished={!!result}
            onComplete={onAnimationComplete}
          />
        )}

        {error && (
          <div className="text-center space-y-4 text-destructive animate-in fade-in bg-destructive/10 p-6 rounded-lg border border-destructive/20">
            <p className="font-medium">{error}</p>
            <Button onClick={reset} variant="outline" className="border-destructive/50 hover:bg-destructive/10">
              Tentar Novamente
            </Button>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <TabsResults result={result} onReset={reset} />
          </div>
        )}
      </div>
    </main>
  );
}
