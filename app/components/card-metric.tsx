import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface CardMetricProps {
    title: string;
    value: string | number | null;
    unit: string;
    description: string;
    icon?: ReactNode;
}

export function CardMetric({ title, value, unit, description, icon }: CardMetricProps) {
    return (
        <Card className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                    {value !== null ? value : "-"}
                    <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 capitalize">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}
