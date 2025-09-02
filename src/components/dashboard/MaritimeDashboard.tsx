import { useState } from 'react';
import { useExcelData, ServiceRecord } from '@/hooks/useExcelData';
import { DashboardMetrics } from './DashboardMetrics';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import { InteractiveCard } from './InteractiveCard';
import { ServiceDetail } from './ServiceDetail';
import { SearchBar } from '@/components/ui/search-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Ship, Wrench, FileText, Clock, MapPin, Anchor } from 'lucide-react';
import maritimeHero from '@/assets/maritime-hero.jpg';
import maritimeIcon from '@/assets/maritime-icon.png';

type ViewLevel = 'overview' | 'cliente' | 'unidade' | 'tecnico' | 'atendimento' | 'detail';

interface NavigationState {
  level: ViewLevel;
  selectedCliente?: string;
  selectedUnidade?: string;
  selectedTecnico?: string;
  selectedAtendimento?: string;
  selectedService?: ServiceRecord;
}

interface SearchState {
  unidades: string;
  tecnicos: string;
  atendimentos: string;
}

export const MaritimeDashboard = () => {
  const {
    data,
    loading,
    error,
    getClientes,
    getUnidadesByCliente,
    getTecnicosByUnidade,
    getAtendimentosByTecnico,
    getTotalHorasByCliente,
    getServiceStats
  } = useExcelData();

  const [navigation, setNavigation] = useState<NavigationState>({
    level: 'overview'
  });

  const [searchTerms, setSearchTerms] = useState<SearchState>({
    unidades: '',
    tecnicos: '',
    atendimentos: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-wave relative overflow-hidden">
        {/* Background hero image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${maritimeHero})` }}
        />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center bg-card/80 backdrop-blur-sm p-8 rounded-lg shadow-interactive">
            <img src={maritimeIcon} alt="Maritime" className="w-16 h-16 mx-auto mb-4 animate-float" />
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Carregando dados dos serviços marítimos...</p>
            <p className="text-sm text-muted-foreground mt-2">Processando informações das embarcações</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-wave">
        <Card className="p-8 max-w-md shadow-card border-0">
          <CardContent className="text-center">
            <img src={maritimeIcon} alt="Maritime" className="w-16 h-16 mx-auto mb-4" />
            <p className="text-destructive mb-4">{error}</p>
            <p className="text-muted-foreground">O dashboard carregará com dados de exemplo.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = getServiceStats();

  const getBreadcrumbItems = () => {
    const items = [];
    
    if (navigation.selectedCliente) {
      items.push({
        label: navigation.selectedCliente,
        onClick: () => setNavigation({ level: 'cliente', selectedCliente: navigation.selectedCliente })
      });
    }
    
    if (navigation.selectedUnidade) {
      items.push({
        label: navigation.selectedUnidade,
        onClick: () => setNavigation({ 
          level: 'unidade', 
          selectedCliente: navigation.selectedCliente,
          selectedUnidade: navigation.selectedUnidade 
        })
      });
    }
    
    if (navigation.selectedTecnico) {
      items.push({
        label: navigation.selectedTecnico,
        onClick: () => setNavigation({ 
          level: 'tecnico',
          selectedCliente: navigation.selectedCliente,
          selectedUnidade: navigation.selectedUnidade,
          selectedTecnico: navigation.selectedTecnico
        })
      });
    }
    
    if (navigation.selectedAtendimento) {
      items.push({
        label: `Atendimento ${navigation.selectedAtendimento}`
      });
    }

    return items;
  };

  const resetNavigation = () => {
    setNavigation({ level: 'overview' });
    setSearchTerms({ unidades: '', tecnicos: '', atendimentos: '' });
  };

  const handleNavigationChange = (newNavigation: NavigationState) => {
    setNavigation(newNavigation);
    // Clear relevant search terms when navigating
    if (newNavigation.level === 'cliente') {
      setSearchTerms(prev => ({ ...prev, tecnicos: '', atendimentos: '' }));
    } else if (newNavigation.level === 'unidade') {
      setSearchTerms(prev => ({ ...prev, atendimentos: '' }));
    }
  };

  const renderOverview = () => {
    const clientes = getClientes();
    
    return (
      <div className="space-y-6">
        <DashboardMetrics {...stats} />
        
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Clientes ({clientes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((cliente) => {
                const unidades = getUnidadesByCliente(cliente);
                const totalHoras = getTotalHorasByCliente(cliente);
                const servicosCount = data.filter(record => record.cliente === cliente).length;
                
                return (
                  <InteractiveCard
                    key={cliente}
                    title={cliente}
                    icon={<Users className="h-5 w-5" />}
                    badge={`${unidades.length} unidades`}
                    onClick={() => handleNavigationChange({ level: 'cliente', selectedCliente: cliente })}
                    metrics={[
                      { label: 'Serviços', value: servicosCount },
                      { label: 'Horas', value: `${totalHoras}h` }
                    ]}
                    gradient="bg-gradient-ocean"
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCliente = () => {
    if (!navigation.selectedCliente) return null;
    
    const allUnidades = getUnidadesByCliente(navigation.selectedCliente);
    const filteredUnidades = allUnidades.filter(unidade =>
      unidade.toLowerCase().includes(searchTerms.unidades.toLowerCase())
    );
    
    return (
      <Card className="shadow-card border-0">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Ship className="h-5 w-5 text-primary" />
            Unidades - {navigation.selectedCliente} ({filteredUnidades.length}/{allUnidades.length})
          </CardTitle>
          <SearchBar
            placeholder="Pesquisar por embarcação..."
            value={searchTerms.unidades}
            onChange={(value) => setSearchTerms(prev => ({ ...prev, unidades: value }))}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnidades.map((unidade) => {
              const tecnicos = getTecnicosByUnidade(navigation.selectedCliente!, unidade);
              const servicosUnidade = data.filter(record => 
                record.cliente === navigation.selectedCliente && record.unidade === unidade
              );
              const totalHoras = servicosUnidade.reduce((sum, record) => sum + record.horasOperacao, 0);
              
              return (
                <InteractiveCard
                  key={unidade}
                  title={unidade}
                  icon={<Ship className="h-5 w-5" />}
                  badge={`${tecnicos.length} técnicos`}
                  onClick={() => handleNavigationChange({
                    ...navigation,
                    level: 'unidade',
                    selectedUnidade: unidade
                  })}
                  metrics={[
                    { label: 'Serviços', value: servicosUnidade.length },
                    { label: 'Horas', value: `${totalHoras}h` }
                  ]}
                  gradient="bg-gradient-depth"
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUnidade = () => {
    if (!navigation.selectedCliente || !navigation.selectedUnidade) return null;
    
    const allTecnicos = getTecnicosByUnidade(navigation.selectedCliente, navigation.selectedUnidade);
    const filteredTecnicos = allTecnicos.filter(tecnico =>
      tecnico.toLowerCase().includes(searchTerms.tecnicos.toLowerCase())
    );
    
    return (
      <Card className="shadow-card border-0">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Técnicos - {navigation.selectedUnidade} ({filteredTecnicos.length}/{allTecnicos.length})
          </CardTitle>
          <SearchBar
            placeholder="Pesquisar por técnico..."
            value={searchTerms.tecnicos}
            onChange={(value) => setSearchTerms(prev => ({ ...prev, tecnicos: value }))}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTecnicos.map((tecnico) => {
              const atendimentosTecnico = data.filter(record => 
                record.cliente === navigation.selectedCliente && 
                record.unidade === navigation.selectedUnidade &&
                record.responsavelTecnico === tecnico
              );
              const totalHoras = atendimentosTecnico.reduce((sum, record) => sum + record.horasOperacao, 0);
              
              return (
                <InteractiveCard
                  key={tecnico}
                  title={tecnico}
                  icon={<Wrench className="h-5 w-5" />}
                  badge={`${atendimentosTecnico.length} atendimentos`}
                  onClick={() => handleNavigationChange({
                    ...navigation,
                    level: 'tecnico',
                    selectedTecnico: tecnico
                  })}
                  metrics={[
                    { label: 'Atendimentos', value: atendimentosTecnico.length },
                    { label: 'Horas', value: `${totalHoras}h` }
                  ]}
                  gradient="bg-gradient-wave"
                />
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTecnico = () => {
    if (!navigation.selectedTecnico) return null;
    
    const allAtendimentos = data.filter(record => 
      record.cliente === navigation.selectedCliente && 
      record.unidade === navigation.selectedUnidade &&
      record.responsavelTecnico === navigation.selectedTecnico
    );
    
    const filteredAtendimentos = allAtendimentos.filter(atendimento =>
      atendimento.numeroAtendimento.toLowerCase().includes(searchTerms.atendimentos.toLowerCase()) ||
      atendimento.tipoServico.toLowerCase().includes(searchTerms.atendimentos.toLowerCase()) ||
      atendimento.local.toLowerCase().includes(searchTerms.atendimentos.toLowerCase())
    );
    
    return (
      <Card className="shadow-card border-0">
        <CardHeader className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Atendimentos - {navigation.selectedTecnico} ({filteredAtendimentos.length}/{allAtendimentos.length})
          </CardTitle>
          <SearchBar
            placeholder="Pesquisar por atendimento, serviço ou local..."
            value={searchTerms.atendimentos}
            onChange={(value) => setSearchTerms(prev => ({ ...prev, atendimentos: value }))}
          />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredAtendimentos.map((atendimento) => (
              <InteractiveCard
                key={atendimento.numeroAtendimento}
                title={`Atendimento #${atendimento.numeroAtendimento}`}
                subtitle={atendimento.tipoServico}
                icon={<FileText className="h-5 w-5" />}
                badge={`${atendimento.horasOperacao}h`}
                onClick={() => setNavigation({
                  ...navigation,
                  level: 'detail',
                  selectedAtendimento: atendimento.numeroAtendimento,
                  selectedService: atendimento
                })}
                metrics={[
                  { label: 'Local', value: atendimento.local },
                  { label: 'Data', value: `${atendimento.mes}/${atendimento.ano}` }
                ]}
                gradient="bg-gradient-ocean"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderDetail = () => {
    if (!navigation.selectedService) return null;
    
    return <ServiceDetail service={navigation.selectedService} />;
  };

  const renderContent = () => {
    switch (navigation.level) {
      case 'overview':
        return renderOverview();
      case 'cliente':
        return renderCliente();
      case 'unidade':
        return renderUnidade();
      case 'tecnico':
        return renderTecnico();
      case 'detail':
        return renderDetail();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-wave relative">
      {/* Hero background */}
      <div 
        className="absolute top-0 left-0 right-0 h-96 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${maritimeHero})` }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <img src="/lovable-uploads/726240f1-15e2-4b33-9216-5695f97f28dd.png" alt="Supply Marine" className="h-20 max-w-full object-contain" />
            </div>
          </div>
          
          <NavigationBreadcrumb
            items={getBreadcrumbItems()}
            onReset={resetNavigation}
          />
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};