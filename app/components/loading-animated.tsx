"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const PHRASES = [
    "Lendo seu exame...",
    "Interpretando suas medidas corporais...",
    "Comparando com dados da população brasileira...",
    "Analisando evolução ao longo do tempo...",
    "Gerando explicações claras para você...",
    "Quase pronto... finalizando sua análise..."
];

export function LoadingAnimated() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % PHRASES.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-8">
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
            </div>

            <div className="h-8 overflow-hidden relative w-full max-w-md text-center">
                <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg font-medium text-primary"
                >
                    {PHRASES[index]}
                </motion.div>
            </div>

            <div className="w-full max-w-md space-y-2">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 15, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    );
}
