import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Clock, Ship, Users } from "lucide-react";

interface MetricsProps {
  totalServices: number;
  totalHoras: number;
  uniqueClientes: number;
  uniqueUnidades: number;
}

export const DashboardMetrics = ({ totalServices, totalHoras, uniqueClientes, uniqueUnidades }: MetricsProps) => {
  const metrics = [
    {
      title: "Total de Serviços",
      value: totalServices.toLocaleString(),
      icon: Anchor,
      description: "Atendimentos realizados",
      gradient: "bg-gradient-ocean"
    },
    {
      title: "Horas de Operação",
      value: totalHoras.toLocaleString(),
      icon: Clock,
      description: "Horas trabalhadas",
      gradient: "bg-gradient-depth"
    },
    {
      title: "Clientes Atendidos",
      value: uniqueClientes.toLocaleString(),
      icon: Users,
      description: "Clientes únicos",
      gradient: "bg-gradient-wave"
    },
    {
      title: "Embarcações",
      value: uniqueUnidades.toLocaleString(),
      icon: Ship,
      description: "Unidades atendidas",
      gradient: "bg-gradient-ocean"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="relative overflow-hidden shadow-card hover:shadow-interactive transition-all duration-300 border-0">
            <div className={`absolute inset-0 opacity-10 ${metric.gradient}`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {metric.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric.value}
              </div>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};