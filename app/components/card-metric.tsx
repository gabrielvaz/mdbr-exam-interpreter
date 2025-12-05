import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CardMetricProps {
    title: string;
    value: string | number | null;
    unit?: string;
    description?: string;
    className?: string;
    trend?: "up" | "down" | "neutral";
}

export function CardMetric({ title, value, unit, description, className, trend }: CardMetricProps) {
    return (
        <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md hover:scale-[1.02]", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">
                    {value !== null && value !== undefined ? value : "-"}
                    {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
                </div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
