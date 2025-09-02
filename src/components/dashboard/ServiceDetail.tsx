import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ServiceRecord } from "@/hooks/useExcelData";
import { Calendar, Clock, MapPin, Settings, User, FileText, AlertCircle } from "lucide-react";

interface ServiceDetailProps {
  service: ServiceRecord;
}

export const ServiceDetail = ({ service }: ServiceDetailProps) => {
  const detailSections = [
    {
      title: "Informações do Cliente",
      icon: User,
      items: [
        { label: "Cliente", value: service.cliente },
        { label: "Unidade", value: service.unidade },
        { label: "Local", value: service.local }
      ]
    },
    {
      title: "Detalhes do Atendimento",
      icon: Settings,
      items: [
        { label: "Nº Atendimento", value: service.numeroAtendimento },
        { label: "Data do Atendimento", value: service.data || `${service.mes}/${service.ano}` },
        { label: "Responsável Técnico", value: service.responsavelTecnico },
        { label: "Tipo de Equipamento", value: service.tipoEquipamento },
        { label: "Sistema", value: service.sistema }
      ]
    },
    {
      title: "Execução do Serviço",
      icon: FileText,
      items: [
        { label: "Tipo de Serviço", value: service.tipoServico },
        { label: "Serviço Executado", value: service.servicoExecutado },
        { label: "Horas de Operação", value: `${service.horasOperacao}h` }
      ]
    },
    {
      title: "Status e Situação",
      icon: AlertCircle,
      items: [
        { label: "Situação Entrada", value: service.situacaoEntrada },
        { label: "Situação Saída", value: service.situacaoSaida },
        { label: "RDO", value: service.rdo }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header com informações principais */}
      <Card className="shadow-card border-0">
        <CardHeader className="bg-gradient-ocean text-primary-foreground rounded-t-lg">
          <CardTitle className="flex items-center gap-3">
            <Calendar className="h-5 w-5" />
            Atendimento #{service.numeroAtendimento}
            <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              {service.mes}/{service.ano}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{service.cliente}</p>
                <p className="text-sm text-muted-foreground">{service.unidade}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{service.responsavelTecnico}</p>
                <p className="text-sm text-muted-foreground">Responsável Técnico</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">{service.horasOperacao}h</p>
                <p className="text-sm text-muted-foreground">Horas trabalhadas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seções detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {detailSections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title} className="shadow-card border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {section.items.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="text-sm text-foreground text-right ml-4">
                          {item.value || '-'}
                        </span>
                      </div>
                      {index < section.items.length - 1 && <Separator className="mt-3" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Descrições e observações */}
      {(service.descricao || service.recomendacao || service.obs) && (
        <div className="grid grid-cols-1 gap-6">
          {service.descricao && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Descrição do Serviço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.descricao}
                </p>
              </CardContent>
            </Card>
          )}

          {service.recomendacao && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Recomendações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.recomendacao}
                </p>
              </CardContent>
            </Card>
          )}

          {service.obs && (
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.obs}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};