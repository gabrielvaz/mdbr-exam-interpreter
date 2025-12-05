"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface LoadingAnimatedProps {
    onComplete?: () => void;
    isFinished?: boolean;
}

const PHRASES = [
    "Lendo seu exame...",
    "Identificando métricas...",
    "Analisando composição corporal...",
    "Comparando com dados da população brasileira...",
    "Gerando recomendações personalizadas...",
    "Finalizando análise...",
];

export function LoadingAnimated({ onComplete, isFinished }: LoadingAnimatedProps) {
    const [progress, setProgress] = useState(0);
    const [phraseIndex, setPhraseIndex] = useState(0);

    useEffect(() => {
        // Phrase rotation
        const phraseInterval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        }, 3000);

        return () => clearInterval(phraseInterval);
    }, []);

    useEffect(() => {
        let progressInterval: NodeJS.Timeout | undefined;
        let completeTimer: NodeJS.Timeout | undefined;

        if (isFinished) {
            // If finished, wait a bit then call onComplete
            completeTimer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 500);
        } else {
            // Asymptotic progress up to 95%
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) return 95; // Stall at 95%
                    // Slower increment as it gets higher
                    const remaining = 95 - prev;
                    const increment = Math.max(0.1, remaining * 0.05);
                    return prev + increment;
                });
            }, 200);
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (completeTimer) clearTimeout(completeTimer);
        };
    }, [isFinished, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-12 animate-in fade-in duration-500">
            <div className="relative">
                <div className="absolute inset-0 bg-slate-200 blur-xl rounded-full animate-pulse" />
                <div className="relative bg-white p-4 rounded-full shadow-lg border border-slate-100">
                    <Loader2 className="w-12 h-12 text-slate-900 animate-spin" />
                </div>
            </div>

            <div className="w-full max-w-md space-y-2 text-center">
                <h3 className="text-lg font-medium text-slate-700 h-8 transition-all duration-300">
                    {PHRASES[phraseIndex]}
                </h3>

                <div className="space-y-1">
                    <Progress value={isFinished ? 100 : progress} className="h-2 w-full bg-slate-100" />
                    <p className="text-xs text-slate-400 text-right font-mono">
                        {Math.round(isFinished ? 100 : progress)}%
                    </p>
                </div>
            </div>
        </div>
    );
}
