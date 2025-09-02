import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export interface ServiceRecord {
  cliente: string;
  codCliente: string;
  unidade: string;
  responsavelTecnico: string;
  numeroAtendimento: string;
  tipoEquipamento: string;
  rdo: string;
  data: string;
  mes: string;
  ano: string;
  sistema: string;
  plannedDays: string;
  local: string;
  tipoServico: string;
  servicoExecutado: string;
  recomendacao: string;
  horasOperacao: number;
  situacaoEntrada: string;
  situacaoSaida: string;
  descricao: string;
  obs: string;
}

export const useExcelData = () => {
  const [data, setData] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        // Fetch data from Google Sheets as CSV
        const response = await fetch('https://docs.google.com/spreadsheets/d/1WQVoH9dTWTJuu1KwvtR8w9tEUGXJau_TrDqrVf5V7rw/export?format=csv&gid=660904763');
        const csvText = await response.text();
        
        // Parse CSV manually
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        const jsonData = lines.slice(1).map(line => {
          const values = [];
          let currentValue = '';
          let insideQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === ',' && !insideQuotes) {
              values.push(currentValue.trim());
              currentValue = '';
            } else {
              currentValue += char;
            }
          }
          values.push(currentValue.trim()); // Add last value
          
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return { row, values };
        });

        const processedData: ServiceRecord[] = jsonData.map(({ row, values }) => {
          // Debug: log headers to see available fields
          if (jsonData.indexOf({ row, values }) === 0) {
            console.log('Available headers:', Object.keys(row));
          }
          
          // Try different possible column names for hours
          const horasValue = row['Horas de operação'] || row['Horas de Operação'] || row['Horas'] || values[16] || '0';
          const horasNumber = parseFloat(String(horasValue).replace(',', '.')) || 0;
          
          // Debug: log first few hours values
          if (jsonData.indexOf({ row, values }) < 5) {
            console.log(`Row ${jsonData.indexOf({ row, values })}: horasValue="${horasValue}", horasNumber=${horasNumber}`);
          }
          
          return {
            cliente: row['Cliente'] || '',
            codCliente: row['Cod_Cliente'] || '',
            unidade: row['Unidade'] || '',
            responsavelTecnico: row['Responsável Técnico'] || '',
            numeroAtendimento: row['N° de atendimento'] || '',
            tipoEquipamento: row['Tipo de Equipamento.'] || '',
            rdo: row['RDO'] || '',
            data: row['DATA'] || '',
            mes: row['MÊS'] || '',
            ano: row['ANO'] || '',
            sistema: row['Sistema'] || '',
            plannedDays: row['Planned Days'] || '',
            local: row['Local'] || '',
            tipoServico: row['Tipo de Serviço'] || '',
            servicoExecutado: row['Serviço Executado'] || '',
            recomendacao: row['Recomendação'] || '',
            horasOperacao: horasNumber,
            situacaoEntrada: row['Situação Entrada'] || '',
            situacaoSaida: row['Situação Saida'] || '',
            descricao: row['Descrição'] || '',
            obs: row['OBS'] || '',
          };
        });

        setData(processedData.filter(record => record.cliente)); // Filter out empty records
      } catch (err) {
        console.error('Error loading Excel data:', err);
        
        // Fallback to sample data if Excel loading fails
        console.log('Carregando dados de exemplo...');
        const { sampleData } = await import('@/data/sampleData');
        setData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    loadExcelData();
  }, []);

  // Helper functions for data analysis
  const getClientes = () => [...new Set(data.map(record => record.cliente))].filter(Boolean);
  
  const getUnidadesByCliente = (cliente: string) => 
    [...new Set(data.filter(record => record.cliente === cliente).map(record => record.unidade))].filter(Boolean);
  
  const getTecnicosByUnidade = (cliente: string, unidade: string) => 
    [...new Set(data.filter(record => record.cliente === cliente && record.unidade === unidade).map(record => record.responsavelTecnico))].filter(Boolean);
  
  const getAtendimentosByTecnico = (tecnico: string) => 
    data.filter(record => record.responsavelTecnico === tecnico);

  const getTotalHorasByCliente = (cliente: string) => 
    data.filter(record => record.cliente === cliente).reduce((sum, record) => sum + record.horasOperacao, 0);

  const getServiceStats = () => {
    const totalServices = data.length;
    const totalHoras = data.reduce((sum, record) => sum + record.horasOperacao, 0);
    const uniqueClientes = getClientes().length;
    const uniqueUnidades = [...new Set(data.map(record => record.unidade))].filter(Boolean).length;
    
    return {
      totalServices,
      totalHoras,
      uniqueClientes,
      uniqueUnidades,
    };
  };

  return {
    data,
    loading,
    error,
    getClientes,
    getUnidadesByCliente,
    getTecnicosByUnidade,
    getAtendimentosByTecnico,
    getTotalHorasByCliente,
    getServiceStats,
  };
};