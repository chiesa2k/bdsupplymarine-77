import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface InteractiveCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  icon?: ReactNode;
  onClick: () => void;
  gradient?: string;
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
}

export const InteractiveCard = ({
  title,
  subtitle,
  badge,
  badgeVariant = "secondary",
  icon,
  onClick,
  gradient = "bg-gradient-wave",
  metrics = []
}: InteractiveCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-interactive transition-all duration-300 group border-0 shadow-card relative overflow-hidden"
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-5 ${gradient} group-hover:opacity-10 transition-opacity`} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {icon && <div className="text-primary">{icon}</div>}
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              {badge && (
                <Badge variant={badgeVariant} className="shrink-0">
                  {badge}
                </Badge>
              )}
            </div>
            
            {subtitle && (
              <p className="text-sm text-muted-foreground mb-3">
                {subtitle}
              </p>
            )}
            
            {metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                {metrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:transform group-hover:translate-x-1 transition-all ml-4" />
        </div>
      </CardContent>
    </Card>
  );
};