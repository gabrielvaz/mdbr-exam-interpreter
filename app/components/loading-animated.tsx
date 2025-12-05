"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PHRASES = [
    "Lendo seu exame...",
    "Identificando marcadores corporais...",
    "Extraindo dados numéricos...",
    "Calculando IMC e composição corporal...",
    "Comparando com médias da população brasileira...",
    "Analisando histórico e tendências...",
    "Gerando insights de saúde personalizados...",
    "Verificando consistência dos dados...",
    "Formatando seu relatório detalhado...",
    "Quase pronto, finalizando análise..."
];

export function LoadingAnimated() {
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Rotate phrases
        const phraseInterval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        }, 3000);

        // Asymptotic progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return 95; // Stall at 95%
                // Slow down as we get closer to 90%
                const increment = prev < 50 ? 2 : prev < 80 ? 1 : 0.2;
                return Math.min(prev + increment, 95);
            });
        }, 100);

        return () => {
            clearInterval(phraseInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8 w-full max-w-md mx-auto">
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 border-4 border-primary/30 rounded-full"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-0 border-t-4 border-primary rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
                    {Math.round(progress)}%
                </div>
            </div>

            <div className="h-12 overflow-hidden relative w-full text-center">
                <motion.div
                    key={phraseIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg font-medium text-primary px-4"
                >
                    {PHRASES[phraseIndex]}
                </motion.div>
            </div>

            <div className="w-full space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden w-full">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                    />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                    Isso pode levar alguns segundos dependendo da complexidade do exame.
                </p>
            </div>
        </div>
    );
}
