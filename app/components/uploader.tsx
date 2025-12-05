"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploaderProps {
    onUpload: (file: File) => void;
    isLoading: boolean;
}

export function Uploader({ onUpload, isLoading }: UploaderProps) {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        setSelectedFile(file);
    };

    const clearFile = () => {
        setSelectedFile(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300",
                    dragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25 hover:bg-muted/50 hover:border-primary/50",
                    isLoading && "opacity-50 pointer-events-none"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={handleChange}
                    disabled={isLoading}
                />

                {selectedFile ? (
                    <div className="flex flex-col items-center p-6 space-y-4 animate-in zoom-in-50 duration-300 w-full">
                        <div className="flex flex-col items-center space-y-2">
                            {selectedFile.type.startsWith("image/") ? (
                                <ImageIcon className="w-12 h-12 text-primary/80" />
                            ) : (
                                <FileText className="w-12 h-12 text-primary/80" />
                            )}
                            <div className="text-center">
                                <p className="text-sm font-medium text-slate-900 break-all max-w-xs">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col w-full max-w-xs gap-3">
                            <Button
                                onClick={() => onUpload(selectedFile)}
                                className="w-full font-semibold shadow-lg shadow-primary/20"
                                size="lg"
                            >
                                Analisar Exame
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFile();
                                }}
                                className="text-slate-500 hover:text-destructive hover:bg-destructive/10"
                            >
                                <X className="w-4 h-4 mr-2" /> Escolher outro arquivo
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center p-4">
                        <Upload className="w-10 h-10 mb-3 text-muted-foreground transition-transform duration-300 group-hover:scale-110" />
                        <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">Clique para enviar</span> ou arraste e solte
                        </p>
                        <p className="text-xs text-muted-foreground">
                            PDF, PNG, JPG ou HEIC
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
